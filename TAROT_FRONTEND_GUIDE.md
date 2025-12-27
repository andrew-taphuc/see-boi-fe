# Hướng Dẫn Triển Khai Frontend Module Tarot

## Tổng Quan

Module Tarot cung cấp 5 API endpoints để thực hiện các loại bói bài tarot khác nhau:
1. **Daily Tarot** - Bói tarot hàng ngày (Tình yêu, Tâm trạng, Tiền bạc)
2. **Yes/No Tarot** - Bói tarot câu hỏi yes/no
3. **One Card Tarot** - Bói tarot một lá bài
4. **Love Simple Tarot** - Bói tarot tình yêu đơn giản (Quá khứ, Hiện tại, Tương lai)
5. **Love Deep Tarot** - Bói tarot tình yêu sâu sắc (5 lá bài)

Tất cả các API đều yêu cầu **authentication** (JWT Bearer Token).

---

## Cấu Hình Cơ Bản

### Base URL
```
http://localhost:6789/tarot
```
*(Thay đổi theo môi trường production của bạn)*

### Headers Bắt Buộc
```javascript
{
  'Content-Type': 'application/json',
  'Authorization': 'Bearer <JWT_TOKEN>'
}
```

### Cấu Trúc Response Chung
Tất cả API đều trả về response với cấu trúc:
```typescript
{
  success: boolean;
  data: {
    // Dữ liệu cụ thể tùy theo từng API
  }
}
```

---

## API 1: Daily Tarot (Bói Tarot Hàng Ngày)

### Endpoint
```
POST /tarot/daily
```

### Mô Tả
Nhận tên, sinh nhật và 3 lá bài tarot để luận giải về **Tình yêu**, **Tâm trạng** và **Tiền bạc** trong ngày hôm nay.

### Request Body
```typescript
{
  name: string;        // Tên người xem (VD: "Nguyễn Văn A")
  birthday: string;    // Ngày sinh (format: "YYYY-MM-DD", VD: "2002-08-15")
  card1: string;       // Tên lá bài thứ nhất - cho Tình yêu (VD: "The Fool")
  card2: string;       // Tên lá bài thứ hai - cho Tâm trạng (VD: "The Magician")
  card3: string;       // Tên lá bài thứ ba - cho Tiền bạc (VD: "The High Priestess")
}
```

### Response Success (200)
```typescript
{
  success: true,
  data: {
    name: string;
    birthday: string;
    cards: {
      card1: { name: string; question: "Tình yêu" };
      card2: { name: string; question: "Tâm trạng" };
      card3: { name: string; question: "Tiền bạc" };
    };
    reading: {
      "tinh-yeu": string;    // Luận giải về tình yêu (100-150 từ)
      "tam-trang": string;   // Luận giải về tâm trạng (100-150 từ)
      "tien-bac": string;    // Luận giải về tiền bạc (100-150 từ)
    };
  }
}
```

### Ví Dụ Code (JavaScript/TypeScript)
```typescript
async function getDailyTarot(token: string, data: {
  name: string;
  birthday: string;
  card1: string;
  card2: string;
  card3: string;
}) {
  const response = await fetch('http://localhost:6789/tarot/daily', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
}

// Sử dụng
const result = await getDailyTarot(token, {
  name: 'Nguyễn Văn A',
  birthday: '2002-08-15',
  card1: 'The Fool',
  card2: 'The Magician',
  card3: 'The High Priestess'
});

console.log(result.data.reading['tinh-yeu']); // Luận giải về tình yêu
```

### Error Responses
- **400**: Thiếu thông tin (tên, sinh nhật hoặc tên lá bài)
- **401**: Chưa đăng nhập hoặc token không hợp lệ
- **500**: Lỗi server khi gọi AI service

---

## API 2: Yes/No Tarot (Bói Tarot Yes/No)

### Endpoint
```
POST /tarot/yes-no
```

### Mô Tả
Nhận câu hỏi yes/no, 2 lá bài tarot đã bốc, và lá bài đã lật. Trả về câu trả lời yes/no dựa trên lá bài đã lật, và giải thích sâu hơn về lá bài chưa lật (không tiết lộ tên lá bài chưa lật).

### Request Body
```typescript
{
  question: string;              // Câu hỏi yes/no (VD: "Tôi có nên thay đổi công việc hiện tại không?")
  card1: string;                 // Tên lá bài tarot thứ nhất (VD: "The Fool")
  card2: string;                 // Tên lá bài tarot thứ hai (VD: "The Magician")
  revealedCard: "card1" | "card2"; // Lá bài nào đã được lật
}
```

### Response Success (200)
```typescript
{
  success: true,
  data: {
    question: string;
    revealedCard: {
      name: string;        // Tên lá bài đã lật
      position: "card1" | "card2";
    };
    answer: {
      yesNo: "yes" | "no";           // Câu trả lời yes/no
      explanation: string;            // Giải thích chi tiết dựa trên lá bài đã lật (150-200 từ)
      deeperInsight: string;          // Giải thích sâu hơn về lá bài chưa lật (KHÔNG tiết lộ tên) (100-150 từ)
    };
  }
}
```

### Ví Dụ Code
```typescript
async function getYesNoTarot(token: string, data: {
  question: string;
  card1: string;
  card2: string;
  revealedCard: "card1" | "card2";
}) {
  const response = await fetch('http://localhost:6789/tarot/yes-no', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
}

// Sử dụng
const result = await getYesNoTarot(token, {
  question: 'Tôi có nên thay đổi công việc hiện tại không?',
  card1: 'The Fool',
  card2: 'The Magician',
  revealedCard: 'card1'
});

console.log(result.data.answer.yesNo);        // "yes" hoặc "no"
console.log(result.data.answer.explanation);  // Giải thích chi tiết
console.log(result.data.answer.deeperInsight); // Thông điệp sâu hơn (không tiết lộ tên lá bài chưa lật)
```

### Error Responses
- **400**: Thiếu thông tin (câu hỏi, lá bài hoặc thông tin lá bài đã lật)
- **401**: Chưa đăng nhập hoặc token không hợp lệ
- **500**: Lỗi server khi gọi AI service

---

## API 3: One Card Tarot (Bói Tarot Một Lá Bài)

### Endpoint
```
POST /tarot/one-card
```

### Mô Tả
Nhận câu hỏi và 1 lá bài tarot để luận giải chi tiết về câu hỏi dựa trên ý nghĩa của lá bài.

### Request Body
```typescript
{
  question: string;  // Câu hỏi (VD: "Tôi nên làm gì để cải thiện mối quan hệ hiện tại?")
  card: string;      // Tên lá bài tarot (VD: "The Lovers")
}
```

### Response Success (200)
```typescript
{
  success: true,
  data: {
    question: string;
    card: {
      name: string;
    };
    reading: {
      interpretation: string;  // Luận giải chi tiết về câu hỏi (200-250 từ)
      guidance: string;         // Lời khuyên và hướng dẫn cụ thể (100-150 từ)
      keyMessage: string;       // Thông điệp chính ngắn gọn (1-2 câu)
    };
  }
}
```

### Ví Dụ Code
```typescript
async function getOneCardTarot(token: string, data: {
  question: string;
  card: string;
}) {
  const response = await fetch('http://localhost:6789/tarot/one-card', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
}

// Sử dụng
const result = await getOneCardTarot(token, {
  question: 'Tôi nên làm gì để cải thiện mối quan hệ hiện tại?',
  card: 'The Lovers'
});

console.log(result.data.reading.interpretation); // Luận giải chi tiết
console.log(result.data.reading.guidance);       // Lời khuyên
console.log(result.data.reading.keyMessage);     // Thông điệp chính
```

### Error Responses
- **400**: Thiếu thông tin (câu hỏi hoặc tên lá bài)
- **401**: Chưa đăng nhập hoặc token không hợp lệ
- **500**: Lỗi server khi gọi AI service

---

## API 4: Love Simple Tarot (Bói Tarot Tình Yêu Đơn Giản)

### Endpoint
```
POST /tarot/love/simple
```

### Mô Tả
Nhận câu hỏi về tình yêu và 3 lá bài tarot để luận giải theo dòng thời gian: **Quá khứ**, **Hiện tại**, **Tương lai**.

### Request Body
```typescript
{
  question: string;  // Câu hỏi về tình yêu (VD: "Tình yêu của tôi sẽ phát triển như thế nào?")
  card1: string;     // Tên lá bài thứ nhất - cho Quá khứ (VD: "The Lovers")
  card2: string;     // Tên lá bài thứ hai - cho Hiện tại (VD: "The Two of Cups")
  card3: string;     // Tên lá bài thứ ba - cho Tương lai (VD: "The Sun")
}
```

### Response Success (200)
```typescript
{
  success: true,
  data: {
    question: string;
    cards: {
      card1: { name: string; period: "Quá khứ" };
      card2: { name: string; period: "Hiện tại" };
      card3: { name: string; period: "Tương lai" };
    };
    reading: {
      "qua-khu": string;   // Luận giải về quá khứ (150-200 từ)
      "hien-tai": string;  // Luận giải về hiện tại (150-200 từ)
      "tuong-lai": string; // Luận giải về tương lai (150-200 từ)
    };
  }
}
```

### Ví Dụ Code
```typescript
async function getLoveSimpleTarot(token: string, data: {
  question: string;
  card1: string;
  card2: string;
  card3: string;
}) {
  const response = await fetch('http://localhost:6789/tarot/love/simple', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
}

// Sử dụng
const result = await getLoveSimpleTarot(token, {
  question: 'Tình yêu của tôi sẽ phát triển như thế nào?',
  card1: 'The Lovers',
  card2: 'The Two of Cups',
  card3: 'The Sun'
});

console.log(result.data.reading['qua-khu']);   // Luận giải về quá khứ
console.log(result.data.reading['hien-tai']);  // Luận giải về hiện tại
console.log(result.data.reading['tuong-lai']); // Luận giải về tương lai
```

### Error Responses
- **400**: Thiếu thông tin (câu hỏi hoặc tên lá bài)
- **401**: Chưa đăng nhập hoặc token không hợp lệ
- **500**: Lỗi server khi gọi AI service

---

## API 5: Love Deep Tarot (Bói Tarot Tình Yêu Sâu Sắc)

### Endpoint
```
POST /tarot/love/deep
```

### Mô Tả
Nhận câu hỏi về tình yêu và 5 lá bài tarot để luận giải sâu sắc về hành trình tình yêu. Mỗi lá bài trả lời một câu hỏi cụ thể:
1. Năng lượng khi bước vào mối quan hệ
2. Thử thách hay vấn đề trên hành trình yêu thương
3. Dư âm từ những mối tình đã qua
4. Điều cần chữa lành, hoàn thiện hoặc học hỏi
5. Thông điệp về yêu thương bản thân

### Request Body
```typescript
{
  question: string;  // Câu hỏi về tình yêu (VD: "Tôi muốn hiểu sâu hơn về hành trình tình yêu của mình")
  card1: string;     // Năng lượng khi bước vào mối quan hệ (VD: "The Fool")
  card2: string;     // Thử thách hay vấn đề (VD: "The Tower")
  card3: string;     // Dư âm từ những mối tình đã qua (VD: "The Moon")
  card4: string;     // Điều cần chữa lành (VD: "The Star")
  card5: string;     // Thông điệp về yêu thương bản thân (VD: "The Sun")
}
```

### Response Success (200)
```typescript
{
  success: true,
  data: {
    question: string;
    cards: {
      card1: { name: string; question: "Năng lượng khi bước vào mối quan hệ" };
      card2: { name: string; question: "Thử thách hay vấn đề trên hành trình yêu thương" };
      card3: { name: string; question: "Dư âm từ những mối tình đã qua" };
      card4: { name: string; question: "Điều cần chữa lành, hoàn thiện hoặc học hỏi" };
      card5: { name: string; question: "Thông điệp về yêu thương bản thân" };
    };
    reading: {
      "nang-luong": string;           // Luận giải về năng lượng (150-200 từ)
      "thu-thach": string;             // Luận giải về thử thách (150-200 từ)
      "du-am": string;                 // Luận giải về dư âm (150-200 từ)
      "chua-lanh": string;             // Luận giải về chữa lành (150-200 từ)
      "yeu-thuong-ban-than": string;  // Luận giải về yêu thương bản thân (150-200 từ)
    };
  }
}
```

### Ví Dụ Code
```typescript
async function getLoveDeepTarot(token: string, data: {
  question: string;
  card1: string;
  card2: string;
  card3: string;
  card4: string;
  card5: string;
}) {
  const response = await fetch('http://localhost:6789/tarot/love/deep', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
}

// Sử dụng
const result = await getLoveDeepTarot(token, {
  question: 'Tôi muốn hiểu sâu hơn về hành trình tình yêu của mình',
  card1: 'The Fool',
  card2: 'The Tower',
  card3: 'The Moon',
  card4: 'The Star',
  card5: 'The Sun'
});

console.log(result.data.reading['nang-luong']);           // Năng lượng
console.log(result.data.reading['thu-thach']);            // Thử thách
console.log(result.data.reading['du-am']);                // Dư âm
console.log(result.data.reading['chua-lanh']);            // Chữa lành
console.log(result.data.reading['yeu-thuong-ban-than']); // Yêu thương bản thân
```

### Error Responses
- **400**: Thiếu thông tin (câu hỏi hoặc tên lá bài)
- **401**: Chưa đăng nhập hoặc token không hợp lệ
- **500**: Lỗi server khi gọi AI service

---

## Xử Lý Lỗi Chung

### Cấu Trúc Error Response
```typescript
{
  statusCode: number;
  message: string | string[];
  error?: string;
}
```

### Ví Dụ Xử Lý Lỗi
```typescript
async function callTarotAPI(endpoint: string, token: string, data: any) {
  try {
    const response = await fetch(`http://localhost:6789/tarot/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json();
      
      switch (response.status) {
        case 400:
          console.error('Dữ liệu không hợp lệ:', error.message);
          break;
        case 401:
          console.error('Chưa đăng nhập hoặc token không hợp lệ');
          // Có thể redirect đến trang login
          break;
        case 500:
          console.error('Lỗi server:', error.message);
          break;
        default:
          console.error('Lỗi không xác định:', error);
      }
      
      throw new Error(error.message || 'Có lỗi xảy ra');
    }

    return await response.json();
  } catch (error) {
    console.error('Lỗi khi gọi API:', error);
    throw error;
  }
}
```

---

## Best Practices

### 1. Tạo Service Class/Module
Tạo một service class để quản lý tất cả các API calls:

```typescript
class TarotService {
  private baseURL = 'http://localhost:6789/tarot';
  
  constructor(private token: string) {}

  private async request(endpoint: string, data: any) {
    const response = await fetch(`${this.baseURL}/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Có lỗi xảy ra');
    }

    return await response.json();
  }

  async getDailyReading(data: DailyTarotInput) {
    return this.request('daily', data);
  }

  async getYesNoReading(data: YesNoTarotInput) {
    return this.request('yes-no', data);
  }

  async getOneCardReading(data: OneCardTarotInput) {
    return this.request('one-card', data);
  }

  async getLoveSimpleReading(data: LoveSimpleTarotInput) {
    return this.request('love/simple', data);
  }

  async getLoveDeepReading(data: LoveDeepTarotInput) {
    return this.request('love/deep', data);
  }
}
```

### 2. Sử Dụng TypeScript Types
Định nghĩa types cho request và response:

```typescript
// Request Types
interface DailyTarotInput {
  name: string;
  birthday: string;
  card1: string;
  card2: string;
  card3: string;
}

interface YesNoTarotInput {
  question: string;
  card1: string;
  card2: string;
  revealedCard: 'card1' | 'card2';
}

interface OneCardTarotInput {
  question: string;
  card: string;
}

interface LoveSimpleTarotInput {
  question: string;
  card1: string;
  card2: string;
  card3: string;
}

interface LoveDeepTarotInput {
  question: string;
  card1: string;
  card2: string;
  card3: string;
  card4: string;
  card5: string;
}

// Response Types
interface TarotResponse<T> {
  success: boolean;
  data: T;
}
```

### 3. Loading States
Quản lý trạng thái loading khi gọi API:

```typescript
const [loading, setLoading] = useState(false);
const [result, setResult] = useState(null);
const [error, setError] = useState(null);

async function handleTarotReading() {
  setLoading(true);
  setError(null);
  
  try {
    const response = await tarotService.getDailyReading(data);
    setResult(response.data);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
}
```

### 4. Validation
Validate dữ liệu trước khi gửi request:

```typescript
function validateDailyTarotInput(data: DailyTarotInput): string[] {
  const errors: string[] = [];
  
  if (!data.name || data.name.trim().length === 0) {
    errors.push('Tên không được để trống');
  }
  
  if (!data.birthday || !/^\d{4}-\d{2}-\d{2}$/.test(data.birthday)) {
    errors.push('Ngày sinh phải có định dạng YYYY-MM-DD');
  }
  
  if (!data.card1 || !data.card2 || !data.card3) {
    errors.push('Vui lòng chọn đủ 3 lá bài');
  }
  
  return errors;
}
```

### 5. Caching (Tùy Chọn)
Cache kết quả nếu cần thiết (ví dụ: daily tarot chỉ thay đổi mỗi ngày):

```typescript
const cacheKey = `daily-tarot-${new Date().toDateString()}`;
const cached = localStorage.getItem(cacheKey);

if (cached) {
  return JSON.parse(cached);
}

const result = await tarotService.getDailyReading(data);
localStorage.setItem(cacheKey, JSON.stringify(result));
return result;
```

---

## Lưu Ý Quan Trọng

1. **Authentication**: Tất cả API đều yêu cầu JWT token. Đảm bảo token được lưu trữ an toàn và refresh khi hết hạn.

2. **Error Handling**: Luôn xử lý các trường hợp lỗi (400, 401, 500) và hiển thị thông báo phù hợp cho người dùng.

3. **Loading States**: Hiển thị loading indicator khi đang gọi API vì AI service có thể mất thời gian để xử lý.

4. **Validation**: Validate dữ liệu ở phía frontend trước khi gửi request để tránh lỗi 400.

5. **User Experience**: 
   - Hiển thị kết quả một cách rõ ràng, dễ đọc
   - Cho phép người dùng copy/share kết quả
   - Có thể lưu lịch sử các lần bói

6. **Card Names**: Đảm bảo tên lá bài tarot được gửi đúng format (ví dụ: "The Fool", "The Magician", v.v.)

---

## Ví Dụ Hoàn Chỉnh (React)

```typescript
import React, { useState } from 'react';
import { TarotService } from './services/tarot.service';

function DailyTarotComponent() {
  const [name, setName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [card1, setCard1] = useState('');
  const [card2, setCard2] = useState('');
  const [card3, setCard3] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token');
  const tarotService = new TarotService(token);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await tarotService.getDailyReading({
        name,
        birthday,
        card1,
        card2,
        card3
      });
      setResult(response.data);
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Tên"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="date"
          value={birthday}
          onChange={(e) => setBirthday(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Lá bài 1 (Tình yêu)"
          value={card1}
          onChange={(e) => setCard1(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Lá bài 2 (Tâm trạng)"
          value={card2}
          onChange={(e) => setCard2(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Lá bài 3 (Tiền bạc)"
          value={card3}
          onChange={(e) => setCard3(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Đang xử lý...' : 'Bói Tarot'}
        </button>
      </form>

      {error && <div className="error">{error}</div>}

      {result && (
        <div className="result">
          <h3>Kết Quả Bói Tarot</h3>
          <div>
            <h4>Tình Yêu</h4>
            <p>{result.reading['tinh-yeu']}</p>
          </div>
          <div>
            <h4>Tâm Trạng</h4>
            <p>{result.reading['tam-trang']}</p>
          </div>
          <div>
            <h4>Tiền Bạc</h4>
            <p>{result.reading['tien-bac']}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default DailyTarotComponent;
```

---

## Kết Luận

Module Tarot cung cấp 5 API endpoints mạnh mẽ để tích hợp tính năng bói bài tarot vào ứng dụng frontend. Đảm bảo tuân thủ các best practices về authentication, error handling, và user experience để tạo trải nghiệm tốt nhất cho người dùng.

Nếu có thắc mắc hoặc cần hỗ trợ, vui lòng liên hệ team backend.


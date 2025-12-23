# API Documentation: PATCH /user/me

## Tổng quan
API này cho phép người dùng cập nhật thông tin cá nhân của chính họ. API hỗ trợ upload ảnh đại diện (avatar) và cập nhật các thông tin khác như tên, email, ngày sinh, giới tính, bio.

## Endpoint
```
PATCH /user/me
```

## Authentication
- **Bắt buộc**: Có
- **Type**: Bearer Token (JWT)
- **Header**: `Authorization: Bearer <token>`

## Request

### Content-Type
```
multipart/form-data
```

### Request Body
Tất cả các trường đều **tùy chọn** (optional). Chỉ gửi các trường muốn cập nhật.

| Trường | Type | Mô tả | Ví dụ | Validation |
|--------|------|-------|-------|------------|
| `fullName` | string | Tên đầy đủ của người dùng | `"Nguyễn Văn A"` | Tùy chọn, nếu có phải là string |
| `userName` | string | Tên người dùng (username) | `"nguyenvana"` | Tùy chọn, nếu có phải là string |
| `email` | string | Email của người dùng | `"nguyenvana@example.com"` | Tùy chọn, nếu có phải là email hợp lệ |
| `birthday` | string | Ngày sinh (định dạng ISO 8601) | `"1990-01-01"` | Tùy chọn, nếu có phải là date string |
| `gender` | string | Giới tính | `"Nam"` hoặc `"Nữ"` | Tùy chọn, nếu có phải là string |
| `bio` | string | Tiểu sử/giới thiệu | `"Developer at ABC Company"` | Tùy chọn, nếu có phải là string |
| `avatar` | File | File ảnh đại diện | File ảnh từ máy tính | Tùy chọn, nếu có phải là file ảnh |

**Lưu ý quan trọng:**
- Trường `avatar` là **file upload**, không phải text/string
- Các trường khác là **text fields** trong form-data
- Có thể chỉ cập nhật một vài trường, không cần gửi tất cả

### Ví dụ Request

#### JavaScript (Fetch API)
```javascript
const formData = new FormData();
formData.append('fullName', 'Nguyễn Văn A');
formData.append('userName', 'nguyenvana');
formData.append('email', 'nguyenvana@example.com');
formData.append('birthday', '1990-01-01');
formData.append('gender', 'Nam');
formData.append('bio', 'Developer at ABC Company');

// Nếu có file ảnh mới
if (avatarFile) {
  formData.append('avatar', avatarFile);
}

const response = await fetch('https://your-api-domain.com/user/me', {
  method: 'PATCH',
  headers: {
    'Authorization': `Bearer ${token}`,
    // KHÔNG set Content-Type header, browser sẽ tự động set với boundary
  },
  body: formData
});
```

#### Axios
```javascript
const formData = new FormData();
formData.append('fullName', 'Nguyễn Văn A');
formData.append('userName', 'nguyenvana');
formData.append('email', 'nguyenvana@example.com');
formData.append('birthday', '1990-01-01');
formData.append('gender', 'Nam');
formData.append('bio', 'Developer at ABC Company');

if (avatarFile) {
  formData.append('avatar', avatarFile);
}

const response = await axios.patch('/user/me', formData, {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'multipart/form-data'
  }
});
```

#### React Hook Form với file upload
```javascript
import { useForm } from 'react-hook-form';
import axios from 'axios';

function UpdateProfileForm() {
  const { register, handleSubmit } = useForm();
  
  const onSubmit = async (data) => {
    const formData = new FormData();
    
    if (data.fullName) formData.append('fullName', data.fullName);
    if (data.userName) formData.append('userName', data.userName);
    if (data.email) formData.append('email', data.email);
    if (data.birthday) formData.append('birthday', data.birthday);
    if (data.gender) formData.append('gender', data.gender);
    if (data.bio) formData.append('bio', data.bio);
    if (data.avatar && data.avatar[0]) {
      formData.append('avatar', data.avatar[0]);
    }
    
    try {
      const response = await axios.patch('/user/me', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Cập nhật thành công:', response.data);
    } catch (error) {
      console.error('Lỗi:', error);
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('fullName')} placeholder="Tên đầy đủ" />
      <input {...register('userName')} placeholder="Username" />
      <input {...register('email')} type="email" placeholder="Email" />
      <input {...register('birthday')} type="date" />
      <input {...register('gender')} placeholder="Giới tính" />
      <textarea {...register('bio')} placeholder="Bio" />
      <input {...register('avatar')} type="file" accept="image/*" />
      <button type="submit">Cập nhật</button>
    </form>
  );
}
```

## Response

### Success Response (200 OK)
Trả về thông tin người dùng đã được cập nhật.

```json
{
  "id": 1,
  "userName": "nguyenvana",
  "email": "nguyenvana@example.com",
  "googleId": null,
  "facebookId": null,
  "fullName": "Nguyễn Văn A",
  "avatarUrl": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/avatar.jpg",
  "birthday": "1990-01-01T00:00:00.000Z",
  "gender": "Nam",
  "bio": "Developer at ABC Company",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-12-20T10:30:00.000Z"
}
```

### Error Responses

#### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```
**Nguyên nhân:**
- Chưa đăng nhập
- Token không hợp lệ hoặc đã hết hạn
- Thiếu header Authorization

**Cách xử lý:**
- Kiểm tra token có tồn tại không
- Refresh token hoặc yêu cầu người dùng đăng nhập lại

#### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": ["email must be an email", "birthday must be a valid ISO 8601 date string"]
}
```
**Nguyên nhân:**
- Dữ liệu không hợp lệ (email sai format, date sai format, etc.)

**Cách xử lý:**
- Kiểm tra validation errors trong response
- Hiển thị lỗi cho người dùng
- Sửa lại dữ liệu và gửi lại request

## Xử lý Ảnh Avatar

### Upload Ảnh
- File ảnh sẽ được upload lên Cloudinary
- Backend tự động xử lý và trả về URL trong `avatarUrl`
- Không cần xử lý upload phía frontend, chỉ cần gửi file trong form-data

### Không Upload Ảnh Mới
- Nếu không gửi trường `avatar`, `avatarUrl` sẽ giữ nguyên giá trị cũ
- Có thể cập nhật các trường khác mà không ảnh hưởng đến avatar

## Best Practices

1. **Chỉ gửi các trường cần cập nhật**: Không cần gửi tất cả trường, chỉ gửi những trường người dùng thay đổi
2. **Validate phía frontend**: Kiểm tra email format, date format trước khi gửi request
3. **Xử lý loading state**: Hiển thị loading indicator khi đang cập nhật
4. **Xử lý lỗi**: Hiển thị thông báo lỗi rõ ràng cho người dùng
5. **Optimistic update**: Có thể cập nhật UI ngay lập tức, sau đó rollback nếu có lỗi
6. **File size limit**: Nên giới hạn kích thước file ảnh (ví dụ: max 5MB)

## Ví dụ Flow Hoàn Chỉnh

```javascript
async function updateUserProfile(profileData, avatarFile) {
  try {
    // 1. Tạo FormData
    const formData = new FormData();
    
    // 2. Thêm các trường text
    if (profileData.fullName) formData.append('fullName', profileData.fullName);
    if (profileData.userName) formData.append('userName', profileData.userName);
    if (profileData.email) formData.append('email', profileData.email);
    if (profileData.birthday) formData.append('birthday', profileData.birthday);
    if (profileData.gender) formData.append('gender', profileData.gender);
    if (profileData.bio) formData.append('bio', profileData.bio);
    
    // 3. Thêm file ảnh nếu có
    if (avatarFile) {
      // Kiểm tra kích thước file (ví dụ: max 5MB)
      if (avatarFile.size > 5 * 1024 * 1024) {
        throw new Error('File ảnh quá lớn. Vui lòng chọn file nhỏ hơn 5MB');
      }
      formData.append('avatar', avatarFile);
    }
    
    // 4. Gửi request
    const token = localStorage.getItem('token'); // hoặc từ context/state
    const response = await fetch(`${API_BASE_URL}/user/me`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData
    });
    
    // 5. Xử lý response
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Có lỗi xảy ra');
    }
    
    const updatedUser = await response.json();
    
    // 6. Cập nhật state/context với dữ liệu mới
    setUser(updatedUser);
    
    return updatedUser;
  } catch (error) {
    console.error('Lỗi cập nhật profile:', error);
    throw error;
  }
}
```

## Lưu ý Kỹ Thuật

1. **Content-Type Header**: Khi sử dụng FormData với fetch API, **KHÔNG** set Content-Type header thủ công. Browser sẽ tự động set với boundary phù hợp.

2. **Date Format**: Trường `birthday` nên được gửi dưới dạng string ISO 8601 (YYYY-MM-DD), backend sẽ tự động convert sang Date object.

3. **File Upload**: File ảnh sẽ được xử lý bởi Cloudinary storage, URL trả về sẽ có dạng Cloudinary URL.

4. **Partial Update**: API hỗ trợ partial update, nghĩa là chỉ cần gửi các trường muốn thay đổi.

5. **Token Expiration**: Nếu nhận được 401, có thể token đã hết hạn, cần refresh token hoặc đăng nhập lại.


# Tài liệu Implementation - Authentication System

## Tổng quan

Tài liệu này mô tả các implementation đã thực hiện cho hệ thống xác thực (Authentication) trong ứng dụng See Bói Frontend, bao gồm:

- **Axios Instance**: Cấu hình HTTP client với base URL và interceptors
- **Login Component**: Form đăng nhập tích hợp với API backend
- **AuthContext**: Quản lý trạng thái đăng nhập toàn cục với persistent session

---

## 1. Axios Instance (`src/utils/axiosInstance.js`)

### Mục đích
Tạo một axios instance được cấu hình sẵn để gọi API đến backend server.

### Cấu hình

```javascript
baseURL: 'http://localhost:6789'
```

### Tính năng

#### Request Interceptor
- **Tự động thêm token**: Mọi request sẽ tự động thêm `Authorization: Bearer <token>` vào header nếu có token trong localStorage
- **Không cần thêm thủ công**: Developer không cần nhớ thêm token vào mỗi request

#### Response Interceptor
- **Xử lý lỗi 401**: Khi nhận được lỗi 401 (Unauthorized), tự động:
  - Xóa token và user khỏi localStorage
  - Redirect về trang `/login`
- **Bảo mật**: Đảm bảo user bị đăng xuất khi token hết hạn hoặc không hợp lệ

### Cách sử dụng

```javascript
import axiosInstance from '../../utils/axiosInstance';

// Gọi API - token sẽ tự động được thêm vào header
const response = await axiosInstance.post('/auth/login', {
  email,
  password
});
```

---

## 2. Login Component (`src/components/Login&Register/Login.jsx`)

### Mục đích
Component form đăng nhập tích hợp với API backend.

### Tính năng

#### Form Handling
- **Controlled inputs**: Email và password được quản lý bằng React state
- **Validation**: Sử dụng HTML5 validation (`required`, `type="email"`)
- **Loading state**: Hiển thị trạng thái "Đang đăng nhập..." khi đang xử lý

#### API Integration
- **Endpoint**: `POST /auth/login`
- **Request body**: `{ email, password }`
- **Response format**: 
  ```json
  {
    "access_token": "eyJhbGc...",
    "user": {
      "id": 4,
      "fullName": "Nguyen van C",
      "userName": "user_c",
      "email": "c@gmail.com",
      "role": "USER",
      ...
    }
  }
  ```

#### Xử lý sau đăng nhập
1. **Lưu thông tin**: Gọi `loginAPI(user, access_token)` để lưu vào AuthContext và localStorage
2. **Đóng popup**: Nếu được gọi từ popup (có prop `onClose`)
3. **Redirect**: Tự động chuyển đến trang `/socialmedia`

#### Error Handling
- Hiển thị thông báo lỗi từ server hoặc thông báo mặc định
- Xử lý các trường hợp:
  - Email/password sai
  - Server error
  - Response không hợp lệ

### Cách sử dụng

```jsx
// Từ popup
<Login 
  onClose={closePopup} 
  onSwitchToRegister={openRegister} 
/>

// Hoặc từ route riêng
<Login />
```

---

## 3. AuthContext (`src/context/AuthContext.jsx`)

### Mục đích
Quản lý trạng thái đăng nhập toàn cục cho toàn bộ ứng dụng, sử dụng React Context API.

### State Management

```javascript
const [currentUser, setCurrentUser] = useState(null);
```

- `currentUser`: Object chứa thông tin user hiện tại, hoặc `null` nếu chưa đăng nhập

### Persistent Session

Khi app khởi động, `useEffect` sẽ:
1. **Kiểm tra localStorage**:
   - Nếu có `token` và `currentUser` → Khôi phục session từ API login
   - Nếu chỉ có `currentUser` (không có token) → Dùng logic fallback với `usersData`
   - Nếu không có gì → Mặc định chọn user đầu tiên (chỉ khi không có token)

2. **Error handling**: Xử lý các trường hợp parse lỗi và dọn dữ liệu không hợp lệ

### Các hàm được cung cấp

#### `loginAPI(user, token)`
- **Mục đích**: Đăng nhập từ API (có token)
- **Tham số**: 
  - `user`: Object thông tin user từ API
  - `token`: JWT access token
- **Hành động**: 
  - Lưu user và token vào state và localStorage
  - Dùng cho đăng nhập thực tế qua API

#### `login(user)`
- **Mục đích**: Đăng nhập local (không có token)
- **Tham số**: `user` - Object thông tin user
- **Hành động**: Chỉ lưu user, không lưu token
- **Dùng cho**: `switchUser` (chuyển user trong development)

#### `logout()`
- **Mục đích**: Đăng xuất
- **Hành động**: 
  - Xóa `currentUser` khỏi state
  - Xóa `currentUser` và `token` khỏi localStorage

#### `switchUser(userId)`
- **Mục đích**: Chuyển sang user khác (development/testing)
- **Tham số**: `userId` - ID của user muốn chuyển
- **Hành động**: Tìm user trong `usersData` và gọi `login(user)`

### Cách sử dụng

```jsx
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { currentUser, loginAPI, logout } = useAuth();
  
  // Sử dụng currentUser
  if (currentUser) {
    return <div>Xin chào, {currentUser.userName}!</div>;
  }
  
  // Đăng xuất
  const handleLogout = () => {
    logout();
  };
}
```

---

## 4. Luồng hoạt động tổng thể

### Khi đăng nhập

```
1. User nhập email/password và submit form
2. Login component gọi API: POST /auth/login
3. Backend trả về: { access_token, user }
4. Gọi loginAPI(user, access_token)
5. Lưu vào:
   - State: currentUser
   - localStorage: 'currentUser' và 'token'
6. Redirect đến /socialmedia
```

### Khi reload trang

```
1. AuthProvider mount
2. useEffect chạy
3. Đọc localStorage:
   - 'token' và 'currentUser'
4. Khôi phục currentUser vào state
5. User vẫn đăng nhập (persistent session)
```

### Khi gọi API khác

```
1. Component gọi axiosInstance.post/get/put/delete
2. Request interceptor tự động thêm:
   Authorization: Bearer <token>
3. Backend xác thực token
4. Nếu 401: Response interceptor tự động đăng xuất
```

---

## 5. Cấu trúc dữ liệu

### User Object

```typescript
{
  id: number;
  fullName: string;
  userName: string;
  email: string;
  role: string;
  avatarUrl: string | null;
  bio: string | null;
  birthday: string | null;
  gender: string | null;
  level: number;
  xp: number;
}
```

### Token Storage

- **Key**: `'token'`
- **Value**: JWT access token string
- **Format**: `Bearer <token>` trong Authorization header

---

## 6. Lưu ý quan trọng

### Security
- ✅ Token được lưu trong localStorage (có thể cân nhắc httpOnly cookies cho production)
- ✅ Token tự động được thêm vào mọi request
- ✅ Tự động xử lý khi token hết hạn (401)

### Compatibility
- ✅ Hỗ trợ cả API login (có token) và local login (không token)
- ✅ Fallback về `usersData` nếu không có token (tương thích ngược)

### Error Handling
- ✅ Xử lý lỗi parse JSON
- ✅ Xử lý lỗi từ API
- ✅ Xử lý response không hợp lệ

---

## 7. Files đã tạo/cập nhật

### Files mới
- `src/utils/axiosInstance.js` - Axios instance với interceptors

### Files đã cập nhật
- `src/components/Login&Register/Login.jsx` - Tích hợp API login
- `src/context/AuthContext.jsx` - Thêm `loginAPI` và xử lý token

### Dependencies
- `axios` - Đã được cài đặt trong `package.json`

---

## 8. Cách test

1. **Test đăng nhập**:
   - Mở form đăng nhập
   - Nhập email/password hợp lệ
   - Kiểm tra redirect đến `/socialmedia`
   - Kiểm tra localStorage có `token` và `currentUser`

2. **Test persistent session**:
   - Đăng nhập thành công
   - Reload trang
   - Kiểm tra user vẫn đăng nhập

3. **Test token expiration**:
   - Đăng nhập
   - Sửa token trong localStorage thành giá trị không hợp lệ
   - Gọi API bất kỳ
   - Kiểm tra tự động redirect về `/login`

---

## Kết luận

Hệ thống authentication đã được implement với các tính năng:
- ✅ Tích hợp với backend API
- ✅ Persistent session (giữ đăng nhập khi reload)
- ✅ Tự động xử lý token trong mọi request
- ✅ Tự động đăng xuất khi token hết hạn
- ✅ Error handling đầy đủ
- ✅ Tương thích ngược với logic cũ

Hệ thống sẵn sàng để sử dụng và có thể mở rộng thêm các tính năng như refresh token, remember me, v.v.


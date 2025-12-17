# Hướng dẫn sử dụng User Switcher

## Cách thay đổi user hiện tại

### 1. Sử dụng UserSwitcher Component

Component `UserSwitcher` đã được tích hợp vào `SocialHeader` và hiển thị ở góc phải trên cùng của header.

**Cách sử dụng:**
- Click vào nút hiển thị tên user và avatar hiện tại (ở bên phải header, trước icon notification)
- Một dropdown sẽ hiện ra với danh sách tất cả users
- Click vào user bạn muốn chuyển sang
- User sẽ được thay đổi ngay lập tức và lưu vào localStorage

### 2. Sử dụng trong code (Programmatic)

Nếu bạn muốn thay đổi user từ code:

```jsx
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { switchUser, currentUser } = useAuth();

  const handleSwitch = () => {
    // Chuyển sang user có id = 2
    switchUser(2);
  };

  return (
    <div>
      <p>User hiện tại: {currentUser?.userName}</p>
      <button onClick={handleSwitch}>Chuyển user</button>
    </div>
  );
}
```

### 3. Các hàm có sẵn trong AuthContext

```jsx
const { 
  currentUser,    // User hiện tại (null nếu chưa đăng nhập)
  login,          // Đăng nhập một user: login(userObject)
  logout,         // Đăng xuất: logout()
  switchUser      // Chuyển user: switchUser(userId)
} = useAuth();
```

### 4. Lưu ý

- User được lưu tự động vào `localStorage` với key `'currentUser'`
- Khi refresh trang, user sẽ được khôi phục từ localStorage
- Nếu user trong localStorage không tồn tại trong `users.json`, hệ thống sẽ tự động chọn user đầu tiên

### 5. Xem profile của user

- Click vào avatar hoặc tên user ở bất kỳ đâu trong app
- Hoặc truy cập trực tiếp: `/user/{userId}`
- Ví dụ: `/user/1` để xem profile của user có id = 1

### 6. Conditional Rendering trong UserProfile

Trang UserProfile tự động phát hiện nếu bạn đang xem profile của chính mình:
- **Profile của mình**: Hiển thị nút "Chỉnh sửa" và "Cài đặt"
- **Profile người khác**: Hiển thị nút "Theo dõi" / "Đang theo dõi"



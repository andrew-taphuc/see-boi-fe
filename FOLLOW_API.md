# Follow API Routes & Spec (See Boi Backend)

Tài liệu này tổng hợp **các endpoint liên quan đến chức năng Follow người dùng** để team giao diện triển khai.

## Base

- **Base URL**: `http://localhost:6789`
- **Prefix**: `/user`
- **Auth**: Tất cả endpoint follow đều yêu cầu JWT:
  - Header: `Authorization: Bearer <access_token>`

---

## 1) Theo dõi người dùng

### `POST /user/:id/follow`

- **Auth**: Required
- **Description**: Người dùng hiện tại theo dõi người dùng khác
- **Params**:
  - `id` (path parameter): ID của người dùng muốn theo dõi (number)

- **Response (201)**: Theo dõi thành công
  ```json
  {
    "followerId": 1,
    "followingId": 2,
    "createdAt": "2025-12-23T10:00:00.000Z"
  }
  ```

- **Response (400)**: Lỗi
  - Không thể tự theo dõi chính mình
  - Đã theo dõi người dùng này trước đó

- **Response (401)**: Chưa đăng nhập hoặc token không hợp lệ

- **Response (404)**: Không tìm thấy người dùng

- **Notes**:
  - Khi follow thành công, người được follow sẽ nhận notification realtime qua WebSocket
  - Notification type: `FOLLOW`
  - Content: "Bạn có người theo dõi mới"

**Ví dụ request:**
```javascript
// Axios
await axios.post(
  `${API_URL}/user/2/follow`,
  {},
  {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }
);
```

---

## 2) Hủy theo dõi người dùng

### `POST /user/:id/unfollow`

- **Auth**: Required
- **Description**: Người dùng hiện tại hủy theo dõi người dùng khác
- **Params**:
  - `id` (path parameter): ID của người dùng muốn hủy theo dõi (number)

- **Response (200)**: Hủy theo dõi thành công
  ```json
  {
    "count": 1
  }
  ```

- **Response (401)**: Chưa đăng nhập hoặc token không hợp lệ

- **Response (404)**: Không tìm thấy người dùng hoặc chưa theo dõi

**Ví dụ request:**
```javascript
// Axios
await axios.post(
  `${API_URL}/user/2/unfollow`,
  {},
  {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }
);
```

---

## 3) Xóa người theo dõi

### `POST /user/:id/remove-follower`

- **Auth**: Required
- **Description**: Xóa một người đang theo dõi bạn khỏi danh sách followers
- **Params**:
  - `id` (path parameter): ID của người muốn xóa khỏi followers (number)

- **Response (200)**: Xóa thành công
  ```json
  {
    "count": 1
  }
  ```

- **Response (401)**: Chưa đăng nhập hoặc token không hợp lệ

- **Response (404)**: Không tìm thấy người dùng hoặc người này không theo dõi bạn

**Ví dụ request:**
```javascript
// Axios
await axios.post(
  `${API_URL}/user/5/remove-follower`,
  {},
  {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }
);
```

---

## 4) Lấy danh sách người theo dõi

### `GET /user/:id/followers`

- **Auth**: Required
- **Description**: Lấy danh sách những người đang theo dõi người dùng này
- **Params**:
  - `id` (path parameter): ID của người dùng (number)

- **Response (200)**: Danh sách followers
  ```json
  [
    {
      "id": 1,
      "fullName": "Nguyễn Văn A",
      "userName": "nguyenvana",
      "email": "nguyenvana@example.com",
      "avatarUrl": "https://example.com/avatar.jpg",
      "bio": "Developer",
      "level": 5,
      "xp": 1000
    },
    {
      "id": 3,
      "fullName": "Trần Thị B",
      "userName": "tranthib",
      "email": "tranthib@example.com",
      "avatarUrl": null,
      "bio": null,
      "level": 2,
      "xp": 200
    }
  ]
  ```

- **Response (401)**: Chưa đăng nhập hoặc token không hợp lệ

- **Response (404)**: Không tìm thấy người dùng

**Ví dụ request:**
```javascript
// Axios
const response = await axios.get(
  `${API_URL}/user/2/followers`,
  {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }
);
console.log('Followers:', response.data);
```

---

## 5) Lấy danh sách đang theo dõi

### `GET /user/:id/following`

- **Auth**: Required
- **Description**: Lấy danh sách những người mà người dùng này đang theo dõi
- **Params**:
  - `id` (path parameter): ID của người dùng (number)

- **Response (200)**: Danh sách following
  ```json
  [
    {
      "id": 2,
      "fullName": "Lê Văn C",
      "userName": "levanc",
      "email": "levanc@example.com",
      "avatarUrl": "https://example.com/avatar2.jpg",
      "bio": "Designer",
      "level": 3,
      "xp": 500
    },
    {
      "id": 4,
      "fullName": "Phạm Thị D",
      "userName": "phamthid",
      "email": "phamthid@example.com",
      "avatarUrl": null,
      "bio": "Writer",
      "level": 1,
      "xp": 50
    }
  ]
  ```

- **Response (401)**: Chưa đăng nhập hoặc token không hợp lệ

- **Response (404)**: Không tìm thấy người dùng

**Ví dụ request:**
```javascript
// Axios
const response = await axios.get(
  `${API_URL}/user/2/following`,
  {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }
);
console.log('Following:', response.data);
```

---

## Lưu ý quan trọng

### 1. Quan hệ Follow
- **Follower**: Người theo dõi (người thực hiện hành động follow)
- **Following**: Người được theo dõi (người nhận follow)
- Một người có thể vừa là follower vừa là following của người khác

### 2. Validation
- ❌ Không thể tự theo dõi chính mình
- ❌ Không thể follow cùng một người 2 lần (sẽ báo lỗi 400)
- ✅ Có thể unfollow và follow lại sau

### 3. Notification
- Khi follow thành công, người được follow sẽ nhận notification realtime qua WebSocket
- Notification type: `FOLLOW`
- Content: "Bạn có người theo dõi mới"
- `refId`: ID của người đã follow (followerId)

### 4. Response Format
- Tất cả response về danh sách user đều được wrap trong `User` entity
- Các field sensitive (password, googleId, facebookId) không được trả về

---

## Ví dụ sử dụng đầy đủ

### React Hook Example

```typescript
import { useState } from 'react';
import axios from 'axios';

const useFollow = () => {
  const [loading, setLoading] = useState(false);

  const follow = async (userId: number) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/user/${userId}/follow`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  const unfollow = async (userId: number) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/user/${userId}/unfollow`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  const getFollowers = async (userId: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_URL}/user/${userId}/followers`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const getFollowing = async (userId: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_URL}/user/${userId}/following`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  return { follow, unfollow, getFollowers, getFollowing, loading };
};
```

---

## Error Handling

### Common Errors

| Status Code | Mô tả | Cách xử lý |
|-------------|-------|------------|
| 400 | Đã follow trước đó hoặc tự follow chính mình | Hiển thị thông báo lỗi |
| 401 | Chưa đăng nhập | Redirect đến trang login |
| 404 | Không tìm thấy người dùng | Hiển thị thông báo "Người dùng không tồn tại" |
| 500 | Lỗi server | Hiển thị thông báo lỗi chung |

**Ví dụ xử lý lỗi:**
```typescript
try {
  await follow(userId);
  toast.success('Đã theo dõi thành công');
} catch (error: any) {
  if (error.response?.status === 400) {
    toast.error('Bạn đã theo dõi người này rồi');
  } else if (error.response?.status === 401) {
    toast.error('Vui lòng đăng nhập');
    router.push('/login');
  } else {
    toast.error('Có lỗi xảy ra, vui lòng thử lại');
  }
}
```

---

## Checklist triển khai Frontend

- [ ] Implement follow/unfollow button
- [ ] Implement followers list page
- [ ] Implement following list page
- [ ] Handle error cases (400, 401, 404)
- [ ] Show loading state khi đang xử lý
- [ ] Update UI sau khi follow/unfollow thành công
- [ ] Lắng nghe WebSocket notification khi có người follow
- [ ] Validate không cho follow chính mình (client-side)

---

## Tham khảo

- Controller: `src/modules/user/user.controller.ts`
- Service: `src/modules/user/user.service.ts`
- Entity: `src/modules/user/entities/user.entity.ts`
- Schema: `prisma/schema.prisma` (model `UserFollow`)


# API Update User Avatar - Hướng dẫn cho Frontend

## 📋 Tổng quan

API `PATCH /user/me` hỗ trợ **2 cách** để cập nhật avatar:
1. **Upload file ảnh** (ưu tiên)
2. **Gửi URL ảnh** (string)

---

## 🔑 Thông tin API

- **Endpoint:** `PATCH /user/me`
- **Content-Type:** `multipart/form-data`
- **Authentication:** `Authorization: Bearer <token>`

---

## 📤 Cách 1: Upload File ảnh (Khuyến nghị)

### Request Format
```javascript
const formData = new FormData();
formData.append('avatarUrl', fileObject); // File object từ input file
formData.append('fullName', 'Nguyễn Văn A'); // Các field khác (optional)
formData.append('userName', 'nguyenvana');
// ... các field khác
```

### Ví dụ Code (React/Axios)
```typescript
const updateAvatar = async (file: File, otherData?: any) => {
  const formData = new FormData();
  
  // Bắt buộc: Gửi file với field name là 'avatarUrl'
  formData.append('avatarUrl', file);
  
  // Optional: Các field khác
  if (otherData?.fullName) formData.append('fullName', otherData.fullName);
  if (otherData?.userName) formData.append('userName', otherData.userName);
  // ... các field khác
  
  const response = await axios.patch(
    `${API_URL}/user/me`,
    formData,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  
  return response.data;
};
```

### Yêu cầu File
- **Format:** JPG, JPEG, PNG
- **Size:** Khuyến nghị < 5MB
- **Field name:** `avatarUrl` (bắt buộc)

---

## 🔗 Cách 2: Gửi URL ảnh

### Request Format
```javascript
const formData = new FormData();
formData.append('avatarUrl', 'https://example.com/avatar.jpg'); // URL string
formData.append('fullName', 'Nguyễn Văn A'); // Các field khác (optional)
// ... các field khác
```

### Ví dụ Code (React/Axios)
```typescript
const updateAvatarByUrl = async (imageUrl: string, otherData?: any) => {
  const formData = new FormData();
  
  // Bắt buộc: Gửi URL với field name là 'avatarUrl'
  formData.append('avatarUrl', imageUrl); // URL string, không phải file
  
  // Optional: Các field khác
  if (otherData?.fullName) formData.append('fullName', otherData.fullName);
  // ... các field khác
  
  const response = await axios.patch(
    `${API_URL}/user/me`,
    formData,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  
  return response.data;
};
```

### Yêu cầu URL
- **Format:** Phải bắt đầu bằng `http://` hoặc `https://`
- **Validation:** Backend sẽ validate URL hợp lệ
- **Field name:** `avatarUrl` (bắt buộc)

---

## ⚠️ Lưu ý quan trọng

### 1. Ưu tiên File Upload
- Nếu gửi **cả file và URL**, backend sẽ **ưu tiên file upload**
- URL sẽ bị bỏ qua nếu có file

### 2. Field Name
- **Bắt buộc:** Field name phải là `avatarUrl` (không phải `avatar`, `file`, hay tên khác)
- Cả file và URL đều dùng cùng field name `avatarUrl`

### 3. Content-Type
- **Luôn dùng:** `multipart/form-data` (kể cả khi chỉ gửi URL)
- Không dùng `application/json` khi gửi avatar

### 4. Error Handling
```typescript
try {
  await updateAvatar(file);
} catch (error) {
  if (error.response?.status === 400) {
    // URL không hợp lệ hoặc lỗi validation
    console.error(error.response.data.message);
  } else if (error.response?.status === 401) {
    // Chưa đăng nhập hoặc token không hợp lệ
    console.error('Unauthorized');
  }
}
```

---

## 📝 Ví dụ đầy đủ (React Hook)

```typescript
import { useState } from 'react';
import axios from 'axios';

const useUpdateAvatar = () => {
  const [loading, setLoading] = useState(false);

  const updateAvatar = async (avatar: File | string, userData?: any) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();

      // Gửi avatar (file hoặc URL)
      formData.append('avatarUrl', avatar);

      // Gửi các field khác nếu có
      if (userData?.fullName) formData.append('fullName', userData.fullName);
      if (userData?.userName) formData.append('userName', userData.userName);
      if (userData?.email) formData.append('email', userData.email);
      if (userData?.bio) formData.append('bio', userData.bio);
      if (userData?.birthday) formData.append('birthday', userData.birthday);
      if (userData?.gender) formData.append('gender', userData.gender);

      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/me`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  return { updateAvatar, loading };
};

// Sử dụng:
// const { updateAvatar, loading } = useUpdateAvatar();
// await updateAvatar(fileObject); // Upload file
// await updateAvatar('https://example.com/avatar.jpg'); // Gửi URL
```

---

## ✅ Checklist triển khai

- [ ] Field name phải là `avatarUrl` (không phải tên khác)
- [ ] Content-Type: `multipart/form-data`
- [ ] Header: `Authorization: Bearer <token>`
- [ ] Validate file format (JPG, JPEG, PNG) trước khi gửi
- [ ] Validate URL format (http:// hoặc https://) nếu dùng URL
- [ ] Xử lý error 400 (URL không hợp lệ)
- [ ] Xử lý error 401 (Unauthorized)

---

## 🎯 Tóm tắt

| Cách | Field Name | Giá trị | Ưu tiên |
|------|------------|---------|---------|
| Upload File | `avatarUrl` | File object | ✅ Cao |
| Gửi URL | `avatarUrl` | URL string | ⚠️ Thấp (bị bỏ qua nếu có file) |

**Lưu ý:** Cả 2 cách đều dùng cùng field name `avatarUrl`, backend sẽ tự động phân biệt dựa vào kiểu dữ liệu.


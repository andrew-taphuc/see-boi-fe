# USER PROFILE IMPLEMENTATION

Tài liệu này mô tả cách FE (Vite/React) triển khai trang **User Profile** trong repo `see-boi-fe`.

## Route & hành vi tổng quát

- **Route duy nhất**: `GET /user/:id` (frontend route) → render `client/src/pages/UserProfile.jsx`
- Trang sẽ render theo 2 chế độ (conditional rendering):
  - **Xem profile bản thân**: khi `currentUser.id === :id`
    - Load dữ liệu bằng **API**: `GET /user/me`
    - Cho phép chỉnh sửa và lưu bằng **API**: `PATCH /user/me`
  - **Xem profile người khác**: khi `currentUser.id !== :id`
    - Load dữ liệu bằng **API**: `GET /user/:id`
    - Chỉ xem (không cho sửa). Nút “Theo dõi” hiện là UI mock (chưa có backend follow).

> Lưu ý: Phần “Bài viết” hiện vẫn dùng dữ liệu mock từ `posts.json` (chưa có backend posts).

## Endpoint backend được FE sử dụng

### 1) `GET /user/me`

- **Mục đích**: lấy thông tin user đang đăng nhập.
- **Auth**: yêu cầu `Authorization: Bearer <token>`
- **Response**: object user (giống mẫu backend cung cấp)

### 2) `PATCH /user/me`

- **Mục đích**: cập nhật thông tin cá nhân của user đang đăng nhập.
- **Auth**: yêu cầu `Authorization: Bearer <token>`
- **Body FE đang gửi** (nullable):
  - `fullName: string | null`
  - `avatarUrl: string | null`
  - `birthday: string | null` (FE convert từ input date sang ISO bằng `new Date(yyyy-MM-dd).toISOString()`)
  - `gender: 'MALE' | 'FEMALE' | 'OTHER' | null`
  - `bio: string | null`
- **Response**: object user đã cập nhật (FE dùng response này để cập nhật UI + context).

### 3) `GET /user/:id`

- **Mục đích**: lấy thông tin profile user theo id (để xem người khác).
- **Auth**: tùy backend (FE hiện dùng `axiosInstance` nên nếu có token sẽ gửi kèm).
- **Response**: object user (giống `/user/me` theo yêu cầu).

## Cấu trúc UI & các trường chỉnh sửa

### Trạng thái hiển thị

- Avatar (hiển thị dạng background image)
- `userName`, `fullName`, `email`
- Bio
- Thống kê bài viết (đếm từ mock posts)
- Khi là profile bản thân: hiển thị thêm Level/XP và createdAt/updatedAt

### Khi bật “Chỉnh sửa” (chỉ profile bản thân)

- **Họ và tên**: `fullName`
- **Avatar URL**: `avatarUrl`
- **Ngày sinh**: input type `date` → `birthday`
- **Giới tính**: select → `gender` (MALE/FEMALE/OTHER)
- **Giới thiệu**: textarea → `bio`

## Xử lý Auth/Token (axiosInstance)

File: `client/src/utils/axiosInstance.js`

- Request interceptor tự gắn:
  - `Authorization: Bearer <token>` nếu có `localStorage.token`
- Response interceptor:
  - Nếu 401 từ các endpoint không phải `/auth/login`/`/auth/register` → xóa `token/currentUser` và redirect `/login`

## Đồng bộ currentUser sau khi GET/PATCH

File: `client/src/context/AuthContext.jsx`

- FE chỉ dùng “auth thật”:
  - Nếu có `token` + `currentUser` trong localStorage → set `currentUser`
  - Không còn logic “user ảo” từ `users.json`, không còn `switchUser`
- Có hàm `updateCurrentUser(nextUser)`:
  - Update state `currentUser`
  - Đồng thời ghi lại `localStorage.currentUser`
- `UserProfile` gọi `updateCurrentUser` sau:
  - `GET /user/me` (để header/avatar đồng bộ với dữ liệu backend)
  - `PATCH /user/me` (để cập nhật ngay UI)

## Điểm chạm code chính

- **Routes**: `client/src/routes/index.jsx`
  - `"/user/:id"` → `<UserProfile />`
- **Trang profile**: `client/src/pages/UserProfile.jsx`
  - Own profile → `GET /user/me`, `PATCH /user/me`
  - Other profile → `GET /user/:id`
- **Header link “Trang cá nhân”**: `client/src/components/socialMedia/SocialHeader.jsx`
  - Link tới `"/user/${currentUser.id}"`

## TODO / Nâng cấp gợi ý

- **Posts backend**: thay `posts.json` bằng API posts thật.
- **Follow backend**: thay UI follow mock bằng endpoint thật.
- **Birthday format**: nếu backend yêu cầu `YYYY-MM-DD` thay vì ISO, chỉnh payload `birthday` tương ứng trong `UserProfile.jsx`.



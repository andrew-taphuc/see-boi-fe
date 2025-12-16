# ✅ Danh sách chức năng Nhân Tướng Học (Face Analysis Features)

## 1. Upload & Phân tích khuôn mặt (Face Analysis)

### Upload ảnh:

- Upload ảnh khuôn mặt (JPG/PNG, max 5MB)
- Validate file: định dạng, kích thước, detect có khuôn mặt hay không
- Preview ảnh trước khi submit
- Crop/adjust ảnh nếu cần (cái này khó quá thì bỏ qua)

### Điền thông tin cá nhân:

- Họ và tên (bắt buộc)
- Giới tính (Nam/Nữ - bắt buộc)
- Ngày sinh (ngày/tháng/năm - bắt buộc)
- Validation form đầy đủ

### Xử lý phân tích:

- Gửi ảnh + thông tin lên server
- Nhận kết quả phân tích (realtime hoặc processing)
- Redirect đến trang kết quả

## 2. Xem kết quả phân tích (Analysis Results)

### Thông tin cơ bản:

- Hiển thị ảnh đã upload
- Thông tin người dùng: Họ tên, Giới tính, Ngày sinh, Tuổi
- Thông tin ngày lưu phân tích

### Các tags phân tích:

- Năm nay (Thiên can Địa chi)
- Tháng sinh
- Ngày sinh
- Tiền kiếp
- Thai mẫu
- Quẻ
- Dung môn (Ngũ hành)
- Hỷ thần

### 12 phần phân tích chi tiết:

1. **Khuôn Mặt** - Tổng quan về khuôn mặt
2. **Thượng Đình (Trán)** - Phái duyên tuổi trẻ (0-30)
3. **Trung Đình** - Phái duyên trung niên (31-50)
4. **Hạ Đình** - Phái duyên hậu vận (51+)
5. **Tâm Đình** - Tổng thể 3 đình
6. **Ấn Đường** - Khí chất, sức cố
7. **Mắt** - Tính cách, nội tâm
8. **Lông Mày** - Anh em, bạn bè, ý chí
9. **Mũi** - Tài lộc, sự nghiệp
10. **Nhân Trung** - Sức khỏe, tuổi thọ, con cái
11. **Môi** - Tài ăn nói, giao tiếp
12. **Cằm** - Phúc hậu, bền lòng

- Mỗi phần hiển thị: Tiêu đề + Nội dung phân tích đầy đủ

## 3. Quản lý lịch sử phân tích (Analysis History)

### Danh sách lịch sử:

- Xem tất cả các lần phân tích trước đó
- Mỗi item hiển thị:
  - Thumbnail ảnh
  - Ngày phân tích
  - Nút "Xem lại"

### Lọc và tìm kiếm:

- Sắp xếp: Mới nhất / Cũ nhất
- Tìm kiếm theo tên hoặc ngày

### Thao tác:

- Click để xem lại kết quả
- Xóa lịch sử (soft delete - có thể khôi phục trong 30 ngày)
- Đổi ảnh mới (giữ nguyên thông tin cá nhân)

## 4. Đổi ảnh luận giải (Re-upload)

- Từ trang kết quả, click "Đổi ảnh luận giải"
- Quay lại form upload (giữ nguyên hoặc xóa thông tin cũ)
- Upload ảnh mới và phân tích lại
- Tạo record mới trong lịch sử

## 5. Chia sẻ kết quả (Share Results)

### Chia sẻ qua:

- Link (generate unique URL)
- Facebook
- Zalo
- Copy link

### Quyền riêng tư:

- Công khai: Ai có link đều xem được
- Riêng tư: Chỉ chủ sở hữu xem được

---

# ✅ Chức năng Admin (Admin Features)

## 6. Quản lý phân tích (Analysis Management)

### Dashboard tổng quan:

- Tổng số lượt phân tích
- Số lượt phân tích hôm nay

### Quản lý danh sách:

- Xem tất cả phân tích của users
- Lọc theo: User, Ngày
- Xem chi tiết từng phân tích
- Xóa phân tích vi phạm

## 7. Quản lý nội dung (Content Management)

### Template luận giải:

- Quản lý nội dung template cho 12 phần
- Biến động nội dung dựa trên Ngũ hành, Quẻ, v.v.
- CRUD template

### Features Management:

- Quản lý 3 tính năng chính trên trang chủ
- Chỉnh sửa icon, tiêu đề, mô tả

## 8. Quản lý người dùng (User Management)

### Danh sách users:

- Thông tin cơ bản
- Số lần phân tích
- Ngày đăng ký

### Thao tác:

- Xem lịch sử phân tích của user
- Cảnh cáo/Ban user
- Reset password
- Gửi thông báo

## 9. Báo cáo & Thống kê (Reports & Analytics)

### Thống kê sử dụng:

- Lượt truy cập trang Nhân Tướng
- Lượt upload ảnh
- Bounce rate
- Time on page

### Thống kê AI/ML:

- Độ chính xác face detection
- Thời gian xử lý trung bình
- Tỷ lệ lỗi phân tích

### User behavior:

- Tỷ lệ chuyển đổi từng bước (funnel)
- Thời điểm upload nhiều nhất
- Độ tuổi người dùng phân tích
- Giới tính người dùng

---

# 🎯 API Endpoints cần Backend làm


## Face Analysis APIs

### 1. Upload & Phân tích

```
POST   /api/analysis/upload
       Headers: Authorization: Bearer {token}
       Content-Type: multipart/form-data
       Body: {
         image: File,
         fullName: String,
         gender: "male" | "female",
         birthDate: {
           day: Number (1-31),
           month: Number (1-12),
           year: Number (YYYY)
         }
       }
       Response: {
         success: true,
         analysisId: String,
         status: "processing" | "completed",
         message: "Đang phân tích..."
       }
```

### 2. Lấy kết quả phân tích

```
GET    /api/analysis/:id
       Headers: Authorization: Bearer {token}
       Response: {
         id: String,
         userId: String,
         userInfo: {
           fullName: String,
           gender: "male" | "female",
           birthDate: String (DD-MM-YYYY),
           age: Number
         },
         imageUrl: String,
         tags: {
           year: String,          // "Giáp Thân"
           month: String,         // "Nhâm Thân"
           day: String,           // "Đinh Sửu"
           prevLife: String,      // "Tuyển Trung Thủy"
           pregnancy: String,     // "Thần Thiên Pháp"
           trigram: String,       // "Càn Trực Độc"
           element: String,       // "Mộc"
           deity: String          // "Hỏa"
         },
         sections: [
           {
             num: "01",
             title: "Khuôn Mặt",
             content: String,          // Nội dung phân tích đầy đủ
             parametersCount: Number   // Số thông số
           },
           // ... 11 sections nữa
         ],
         shareLink: String,
         shareSettings: "public" | "private",
         createdAt: Date,
         updatedAt: Date
       }
```

### 3. Lấy lịch sử phân tích

```
GET    /api/analysis/history
       Headers: Authorization: Bearer {token}
       Query: {
         page: Number (default: 1),
         limit: Number (default: 10),
         sortBy: "newest" | "oldest"
       }
       Response: {
         total: Number,
         page: Number,
         limit: Number,
         data: [
           {
             id: String,
             thumbnail: String,
             userInfo: { fullName, age, gender },
             createdAt: Date
           }
         ]
       }
```

### 4. Xóa phân tích

```
DELETE /api/analysis/:id
       Headers: Authorization: Bearer {token}
       Response: {
         success: true,
         message: "Đã xóa phân tích. Có thể khôi phục trong 30 ngày."
       }
```

### 5. Khôi phục phân tích đã xóa

```
POST   /api/analysis/:id/restore
       Headers: Authorization: Bearer {token}
       Response: {
         success: true,
         message: "Đã khôi phục phân tích"
       }
```

### 6. Cập nhật chia sẻ

```
PUT    /api/analysis/:id/share
       Body: {
         shareSettings: "public" | "private" | "preview"
       }
       Response: {
         shareLink: String,
         shareSettings: String
       }
```

### 7. Xem phân tích qua share link (Public) 

#### Nếu không làm chức năng share kết quả thì bỏ qua api này

```
GET    /api/analysis/shared/:shareToken
       No Auth Required
       Response: {
         // Giống GET /api/analysis/:id
         // Nhưng chỉ trả về data theo shareSettings
       }
```

---


## Admin APIs

### 1. Dashboard thống kê

```
GET    /api/admin/stats/overview
       Headers: Authorization: Bearer {adminToken}
       Response: {
         totalAnalyses: Number,
         todayAnalyses: Number,
         activeUsers: Number,
         avgProcessingTime: Number  // seconds
       }
```

### 2. Quản lý phân tích

```
GET    /api/admin/analyses
       Query: {
         page, limit,
         userId: String (optional),
         startDate, endDate
       }

DELETE /api/admin/analyses/:id
       Body: { reason: String }
```

### 3. Quản lý người dùng

```
GET    /api/admin/users
       Query: { page, limit, search, sortBy }

GET    /api/admin/users/:id
       Response: {
         // User info + statistics
         totalAnalyses: Number,
         lastActivity: Date
       }

PUT    /api/admin/users/:id/status
       Body: { status: "active" | "banned", reason: String }
```

### 4. Quản lý nội dung

```
POST   /api/admin/content/faq
       Body: { question, answer, order }

PUT    /api/admin/content/faq/:id
DELETE /api/admin/content/faq/:id

POST   /api/admin/content/features
PUT    /api/admin/content/features/:id
DELETE /api/admin/content/features/:id
```

### 5. Thống kê chi tiết

```
GET    /api/admin/stats/users
       Response: {
         totalUsers: Number,
         newUsersToday: Number,
         activeUsers: Number
       }

GET    /api/admin/stats/user-behavior
       Response: {
         visitLandingPage: Number,
         uploadImage: Number,
         viewResults: Number,
         rates: {
           uploadRate: Number,
           completionRate: Number
         }
       }
```

---

# ✅ Danh sách chức năng người dùng (User Features) – HOME

## 1. Bài đăng (Posts)

- Xem danh sách bài đăng (feed).

### Tương tác bài viết:

- Like / Unlike
- Comment / Reply
- Lưu bài viết (bookmark)

- Lấy danh sách post trending (theo lượt xem, like, comment…).

### CRUD bài viết:

- Tạo bài viết
- Chỉnh sửa bài viết (lưu lịch sử chỉnh sửa – edit history)
- Xóa bài viết
- Khôi phục bài đã xóa trong 30 ngày (soft delete + restore)

## 2. Bài đăng đặc biệt

- Tạo bài viết dạng poll/vote.
- Thu thập kết quả vote theo thời gian thực.

## 3. Theo dõi người dùng & Trang cá nhân

- Follow / Unfollow user.

### Xem trang cá nhân:

- Thông tin cơ bản (avatar, bio, cấp độ…)
- Danh sách bài đăng của user
- Followers / Following

## 4. Hồ sơ cá nhân (Profile)

- Thay đổi avatar.
- Chỉnh sửa thông tin cá nhân (bio, birthday, giới tính, quan tâm…).

### Nhận push notification:

- Like bài
- Comment
- User mới theo dõi
- Vote trên poll
- Mention trong bài viết

---

# ✅ Mở rộng tính năng (Advanced User Features)

## 5. Gamification System

### Tính điểm kinh nghiệm (XP) dựa trên:

- Tạo bài
- Comment
- Lượt like nhận được

### Tự động phân cấp độ (Level):

- Người mới nhập môn → Tín đồ → Học giả → Bậc thầy tâm linh

### Hệ thống huy hiệu (Badges):

- "Top Reader"
- "Chiêm tinh gia"
- "Chuyên gia Tarot"
- Các badge theo sự kiện / thành tựu

## 6. Bookmark nâng cao

- Lưu bài viết vào thư viện cá nhân.
- Tạo Collections (ví dụ: Tarot, Nhân tướng học, Chiêm tinh…).

### Lọc bài đã lưu theo:

- Tag
- Ngày lưu
- Tác giả

## 7. Hệ thống Tag / Category / Topic

### Phân chia theo chủ đề tâm linh:

- Tarot
- Chiêm tinh
- Tử vi
- Phong thủy
- Tâm linh – trải nghiệm
- Thiền – năng lượng – healing

- Mỗi bài viết có thể có nhiều tag.

## 8. Chế độ Ẩn danh (Anonymous & Private Posts)

- Đăng bài ẩn danh (không hiển thị tên user).
- Comment ẩn danh.

### Quyền riêng tư bài đăng:

- Công khai
- Chỉ bạn bè
- Chỉ mình tôi

## 9. Recommendation System

### Thuật toán gợi ý dựa trên hành vi người dùng:

- Gợi ý người dùng nên follow.
- Gợi ý bài viết phù hợp với sở thích (tags, history…).
- Gợi ý chủ đề bạn xem gần đây.

## 10. Báo cáo & Moderation

- Báo cáo bài viết / comment (Report).
- Auto–flag nội dung nhạy cảm.
- Quản trị viên xử lý report.

## 11. Topic Following

### Người dùng có thể follow:

- Tag
- Category / Board
- Thread cụ thể

- Feed sẽ ưu tiên hiển thị các chủ đề đã follow.

## 12. Draft Post

- Lưu bài nháp chưa đăng.
- Tự động autosave nội dung mỗi X giây.

## 13. Vote chất lượng bình luận

- Bình chọn comment ↑ hoặc ↓ (giống Reddit).
- Sắp xếp comment theo "best", "newest", "oldest".

---

# ✅ Admin & Moderation Tools (Essential)

## 14. Admin Dashboard

### Chức năng quản trị:

- Quản lý bài đăng (duyệt / khóa / xóa).
- Quản lý user (cảnh cáo / ban / gỡ quyền).
- Gắn tag hoặc phân loại đặc biệt cho bài được nhiều người quan tâm.

### Thống kê hệ thống:

- Lượt xem
- Lượt đăng
- Tương tác theo ngày
- Người dùng hoạt động

---

# 🎯 Tóm tắt theo Checklist để Backend bắt đầu design API

## Post Module

- CRUD + Soft delete + Restore
- Like / Unlike
- Comment / Reply
- Trending API
- Edit history
- Draft

## User Module

- Profile CRUD
- Follow / Unfollow
- Avatar upload
- Notification

## Bookmark Module

- Collections
- Filters

## Tag / Category Module

- Tag CRUD
- Assign tag → post
- Topic following

## Gamification Module

- XP
- Level
- Badges

## Special Post Module

- Poll / vote
- Poll result

## Privacy Module

- Anonymous mode
- View permissions

## Moderation Module

- Report
- Admin dashboard
- Auto-flag

## Recommendation Module

- Suggested posts
- Suggested users
- Suggested topics


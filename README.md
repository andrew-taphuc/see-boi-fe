# See Bói - Trang Web Xem Bói Trực Tuyến

Dự án web & e-service 2025.1 - Nền tảng xem bói trực tuyến và diễn đàn chia sẻ về tâm linh.

## 📋 Mô tả dự án

**See Bói** là một nền tảng web toàn diện cung cấp các dịch vụ xem bói trực tuyến và mạng xã hội tâm linh. Dự án được xây dựng với mục tiêu mang đến trải nghiệm xem bói hiện đại, dễ sử dụng và tương tác cho người dùng.

### Các dịch vụ chính:

- **🔮 Tử Vi**: Xem tử vi theo ngày sinh, giờ sinh, nơi sinh với phân tích chi tiết về vận mệnh, công danh, tình duyên
- **🃏 Tarot**: Bói bài Tarot trực tuyến với nhiều trải bài khác nhau, giải thích chi tiết từng lá bài
- **👤 Nhân Tướng**: Phân tích nhân tướng học dựa trên khuôn mặt, sử dụng công nghệ AI nhận diện khuôn mặt
- **💬 Diễn đàn**: Nơi chia sẻ, thảo luận về tâm linh, đăng bài viết, tương tác với cộng đồng

## ✨ Tính năng nổi bật

### 🔐 Xác thực và Bảo mật
- Đăng ký và đăng nhập tài khoản
- Xác thực JWT (JSON Web Token)
- Phân quyền dựa trên vai trò (Role-based Access Control)
- Quản lý phiên đăng nhập và token expiration
- Upload và quản lý avatar người dùng

### 📝 Diễn đàn và Mạng xã hội
- Tạo, chỉnh sửa và xóa bài viết
- Rich text editor với TipTap (hỗ trợ định dạng văn bản, hình ảnh, link)
- Hệ thống bình luận đa cấp
- Tìm kiếm bài viết và người dùng
- Theo dõi người dùng và tags
- Lưu bài viết yêu thích
- Thông báo real-time với Socket.IO
- Bốc thăm vận may (lucky draw)

### 🔮 Dịch vụ Xem Bói

#### Tử Vi
- Nhập thông tin: ngày sinh, giờ sinh, nơi sinh
- Phân tích chi tiết về các khía cạnh cuộc sống
- Hiển thị biểu đồ và thống kê trực quan

#### Tarot
- Nhiều trải bài khác nhau (3 lá, 5 lá, Celtic Cross, v.v.)
- Giải thích chi tiết từng lá bài
- Hình ảnh và video minh họa
- Lưu lịch sử các lần bói

#### Nhân Tướng
- Upload ảnh khuôn mặt
- Phân tích tự động bằng AI (Face API)
- Nhận diện các đặc điểm khuôn mặt
- Phân tích tính cách và vận mệnh dựa trên nhân tướng học

### 👤 Quản lý Người dùng
- Hồ sơ người dùng chi tiết
- Chỉnh sửa thông tin cá nhân
- Quản lý avatar
- Xem bài viết và hoạt động của người dùng khác
- Hệ thống theo dõi (follow/unfollow)

### 🎨 Giao diện và Trải nghiệm
- Responsive design - tương thích mọi thiết bị
- Dark mode / Light mode
- Giao diện hiện đại với Tailwind CSS
- Animation và transition mượt mà
- Tối ưu hiệu suất và tốc độ tải trang

### 🔧 Quản trị
- Dashboard quản trị
- Quản lý người dùng
- Quản lý bài viết và nội dung
- Thống kê và báo cáo

## 🛠️ Công nghệ sử dụng

### Frontend
- **React 19** - Thư viện UI hiện đại với React Compiler
- **Vite 7** - Build tool nhanh chóng với HMR (Hot Module Replacement)
- **Tailwind CSS 4** - Framework CSS utility-first
- **React Router DOM 7** - Điều hướng và routing
- **TipTap 2** - Rich text editor mạnh mẽ
- **Axios** - HTTP client cho API calls
- **Socket.IO Client** - Real-time communication
- **Face API (@vladmandic/face-api)** - Nhận diện khuôn mặt và phân tích
- **Lucide React** - Icon library đẹp mắt
- **Recharts** - Thư viện biểu đồ và visualization
- **React Markdown** - Render markdown content

### Backend (Tham khảo)
- **NestJS** - Framework Node.js mạnh mẽ
- **Prisma** - ORM hiện đại cho database
- **PostgreSQL/MySQL** - Database quan hệ
- **JWT** - Xác thực và authorization
- **Passport** - Authentication strategies
- **Socket.IO** - Real-time server
- **Cloudinary** - Quản lý hình ảnh và media

### Công cụ phát triển
- **ESLint** - Linting và code quality
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes
- **Vite Plugin React** - React support cho Vite

## 📁 Cấu trúc dự án

```
see-boi-fe/
├── client/                      # Frontend React Application
│   ├── src/
│   │   ├── components/          # Các component tái sử dụng
│   │   │   ├── admin/          # Component quản trị
│   │   │   ├── avatarUpload/   # Upload và xử lý avatar
│   │   │   ├── comments/       # Component bình luận
│   │   │   ├── common/         # Component dùng chung
│   │   │   ├── landingPage/    # Component trang chủ
│   │   │   ├── Login&Register/ # Component đăng nhập/đăng ký
│   │   │   ├── nhantuong/      # Component nhân tướng
│   │   │   ├── posts/          # Component bài viết
│   │   │   ├── richtext/       # Rich text editor (TipTap)
│   │   │   ├── socialMedia/    # Component mạng xã hội
│   │   │   ├── tarot/          # Component tarot
│   │   │   ├── tuvi/           # Component tử vi
│   │   │   └── userProfile/    # Component hồ sơ người dùng
│   │   ├── pages/              # Các trang chính
│   │   │   ├── admin/          # Trang quản trị
│   │   │   ├── nhantuong/      # Trang nhân tướng
│   │   │   ├── tarot/          # Trang tarot
│   │   │   └── TuviPage/       # Trang tử vi
│   │   ├── layouts/            # Layout components
│   │   │   ├── AdminLayout.jsx
│   │   │   ├── MainLayout.jsx
│   │   │   ├── SocialLayout.jsx
│   │   │   ├── TarotLayout.jsx
│   │   │   └── TuviLayout.jsx
│   │   ├── context/            # React Context
│   │   │   ├── AuthContext.jsx      # Context xác thực
│   │   │   ├── NotificationContext.jsx # Context thông báo
│   │   │   ├── SocketContext.jsx    # Context Socket.IO
│   │   │   ├── ThemeContext.jsx     # Context theme
│   │   │   └── ToastContext.jsx     # Context toast notification
│   │   ├── routes/             # Định tuyến
│   │   ├── utils/              # Utility functions
│   │   ├── hooks/              # Custom React hooks
│   │   ├── constants/          # Constants và config
│   │   ├── data/               # Dữ liệu mẫu và mock data
│   │   ├── assets/             # Hình ảnh, fonts, media
│   │   ├── App.jsx             # Component chính
│   │   ├── main.jsx            # Entry point
│   │   └── index.css           # Global styles
│   ├── public/                 # Static files
│   │   ├── models/             # Face API models
│   │   └── favicon.png
│   ├── dist/                   # Build output
│   ├── package.json
│   ├── vite.config.js          # Vite configuration
│   ├── tailwind.config.js      # Tailwind configuration
│   └── eslint.config.js        # ESLint configuration
│
├── docs/                       # Tài liệu dự án
│   ├── AUTH.md                 # Tài liệu xác thực
│   ├── AUTH_IMPLEMENTATION.md  # Hướng dẫn implement auth
│   ├── RUN_PROJECT.md          # Hướng dẫn chạy dự án
│   ├── TAROT_FRONTEND_GUIDE.md # Hướng dẫn Tarot
│   ├── TIPTAP_RICH_TEXT_FE.md # Hướng dẫn Rich Text
│   ├── USER_PROFILE_IMPLEMENTATION.MD # Hướng dẫn User Profile
│   ├── RESPONSIVE_AND_THEME_GUIDE.md # Hướng dẫn responsive
│   └── ...                     # Các tài liệu khác
│
├── tarot-research/             # Scripts và tools cho Tarot
│   ├── crawl_tarot_data.py     # Script crawl dữ liệu tarot
│   └── ...
│
├── build.sh                    # Script build production
├── run.sh                      # Script chạy dự án
├── setup.sh                    # Script setup ban đầu
└── README.md                   # File này
```

## 🚀 Hướng dẫn cài đặt và chạy

### Yêu cầu hệ thống

- **Node.js**: phiên bản 18.x trở lên
- **npm**: phiên bản 9.x trở lên (hoặc yarn/pnpm)
- **Git**: để clone repository

### Cách 1: Sử dụng script tự động (Khuyến nghị)

#### macOS / Linux

**Lần đầu setup:**
```bash
chmod +x setup.sh
./setup.sh
```

**Chạy dự án (sau khi đã setup):**
```bash
chmod +x run.sh
./run.sh
```

#### Windows

Tạo các file `.bat` tương ứng hoặc chạy các lệnh thủ công.

### Cách 2: Cài đặt thủ công

#### Bước 1: Clone repository

```bash
git clone <repository-url>
cd see-boi-fe
```

#### Bước 2: Cài đặt dependencies

```bash
cd client
npm install
```

#### Bước 3: Tải Face API Models (cho tính năng Nhân Tướng)

```bash
# Từ thư mục gốc
chmod +x download_face_models.sh
./download_face_models.sh
```

Hoặc tải thủ công các model vào `client/public/models/`:
- `face_landmark_68_model-weights_manifest.json`
- `face_landmark_68_model-shard1`
- `tiny_face_detector_model-weights_manifest.json`
- `tiny_face_detector_model-shard1`

#### Bước 4: Cấu hình môi trường

Tạo file `.env` trong thư mục `client/` (nếu cần):

```env
VITE_API_URL=http://localhost:3000
VITE_SOCKET_URL=http://localhost:3000
```

#### Bước 5: Chạy dự án

```bash
cd client
npm run dev
```

Frontend sẽ chạy tại `http://localhost:5173`

### Build cho Production

```bash
cd client
npm run build
```

Files build sẽ được tạo trong thư mục `client/dist/`

## 📱 Các trang và route chính

### Trang công khai
- `/` - Trang chủ (Landing Page)
- `/login` - Đăng nhập
- `/register` - Đăng ký

### Dịch vụ xem bói
- `/tuvi` - Xem Tử Vi
- `/tarot` - Bói bài Tarot
  - `/tarot/reading` - Trang bói bài
  - `/tarot/cards` - Danh sách lá bài
- `/nhantuong` - Phân tích Nhân Tướng
  - `/nhantuong/upload` - Upload ảnh
  - `/nhantuong/result` - Kết quả phân tích

### Diễn đàn và mạng xã hội
- `/socialmedia` - Trang chủ diễn đàn
- `/post/:id` - Chi tiết bài viết
- `/post/create` - Tạo bài viết mới
- `/post/edit/:id` - Chỉnh sửa bài viết
- `/search` - Tìm kiếm
- `/tag/:tagName` - Trang tag
- `/saved` - Bài viết đã lưu
- `/drafts` - Bài viết nháp

### Người dùng
- `/profile/:username` - Hồ sơ người dùng
- `/profile/edit` - Chỉnh sửa hồ sơ
- `/following/tags` - Tags đang theo dõi

### Quản trị
- `/admin` - Dashboard quản trị
- `/admin/users` - Quản lý người dùng
- `/admin/posts` - Quản lý bài viết

## 📝 Scripts có sẵn

### Frontend Scripts

Trong thư mục `client/`:

```bash
# Chạy development server
npm run dev

# Build cho production
npm run build

# Preview build production
npm run preview

# Kiểm tra lỗi code (linting)
npm run lint
```

### Utility Scripts

Trong thư mục gốc:

- `setup.sh` - Script setup ban đầu (cài đặt dependencies)
- `run.sh` - Script chạy dự án
- `build.sh` - Script build và deploy (với PM2)
- `download_face_models.sh` - Tải Face API models

## 🔐 Cấu hình môi trường

### Frontend Environment Variables

Tạo file `.env` trong thư mục `client/`:

```env
# API Base URL
VITE_API_URL=http://localhost:3000

# Socket.IO URL
VITE_SOCKET_URL=http://localhost:3000

# Cloudinary (nếu cần)
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_API_KEY=your_api_key
```

### Backend Environment Variables

Tham khảo file `docs/RUN_PROJECT.md` để biết chi tiết về cấu hình backend.

## 📚 Tài liệu tham khảo

Dự án có đầy đủ tài liệu trong thư mục `docs/`:

- **AUTH.md** - Tài liệu về hệ thống xác thực
- **AUTH_IMPLEMENTATION.md** - Hướng dẫn implement authentication
- **RUN_PROJECT.md** - Hướng dẫn chi tiết chạy dự án
- **TAROT_FRONTEND_GUIDE.md** - Hướng dẫn tính năng Tarot
- **TIPTAP_RICH_TEXT_FE.md** - Hướng dẫn sử dụng Rich Text Editor
- **USER_PROFILE_IMPLEMENTATION.MD** - Hướng dẫn User Profile
- **RESPONSIVE_AND_THEME_GUIDE.md** - Hướng dẫn responsive và theme
- **FACE_API_MODELS_GUIDE.md** - Hướng dẫn Face API models
- **POST.md** - Tài liệu về tính năng bài viết
- **FOLLOW_API.md** - Tài liệu về API follow
- Và nhiều tài liệu khác...

## 🎯 Tính năng đang phát triển

- [ ] Tích hợp thanh toán cho dịch vụ premium
- [ ] Ứng dụng mobile (React Native)
- [ ] Nhiều loại bói bài hơn
- [ ] Hệ thống đánh giá và review
- [ ] Chat real-time giữa người dùng
- [ ] Tích hợp AI để phân tích sâu hơn

## 🤝 Đóng góp

Dự án này là một phần của khóa học IT4409 - Web & E-Service 2025.1.

Nếu bạn muốn đóng góp:
1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

## 📄 License

UNLICENSED

## 👥 Tác giả và Liên hệ

**Dự án IT4409 - Web & E-Service 2025.1**

Nhóm phát triển See Bói

---

**Lưu ý**: Đây là dự án học tập. Các dịch vụ xem bói chỉ mang tính chất giải trí và tham khảo.

## 🆘 Hỗ trợ

Nếu gặp vấn đề khi cài đặt hoặc chạy dự án:

1. Kiểm tra phiên bản Node.js: `node --version` (cần >= 18.x)
2. Xóa `node_modules` và `package-lock.json`, sau đó chạy lại `npm install`
3. Kiểm tra file `.env` đã được cấu hình đúng chưa
4. Xem các tài liệu trong thư mục `docs/` để biết thêm chi tiết
5. Kiểm tra console để xem lỗi cụ thể

---

**Chúc bạn sử dụng dự án vui vẻ! 🔮✨**

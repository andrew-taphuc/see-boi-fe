# See Bói - Trang Web Xem Bói Trực Tuyến

Dự án web & e-service 2025.1 - Trang web xem bói trực tuyến và diễn đàn chia sẻ về tâm linh.

## 📋 Mô tả

See Bói là một nền tảng web cung cấp các dịch vụ xem bói trực tuyến bao gồm:
- **Tử Vi**: Xem tử vi theo ngày sinh
- **Tarot**: Bói bài Tarot
- **Nhân Tướng**: Phân tích nhân tướng học
- **Diễn đàn**: Nơi chia sẻ và thảo luận về tâm linh

## 🛠️ Công nghệ sử dụng

### Frontend
- **React 19** - Thư viện UI
- **Vite** - Build tool
- **Tailwind CSS 4** - Framework CSS
- **React Router DOM** - Điều hướng
- **Lucide React** - Icon library

### Backend
- **NestJS** - Framework Node.js
- **Prisma** - ORM
- **MySQL** - Database
- **JWT** - Authentication
- **Passport** - Authentication strategy

## 📁 Cấu trúc dự án

```
IT4409_SEE_BOI/
├── client/          # Frontend React
│   ├── src/
│   │   ├── components/    # Các component
│   │   ├── pages/         # Các trang
│   │   ├── routes/        # Định tuyến
│   │   └── data/          # Dữ liệu mẫu
│   └── package.json
│
├── backend/        # Backend NestJS
│   ├── src/
│   │   ├── auth/          # Authentication
│   │   ├── prisma/        # Prisma service
│   │   └── main.ts
│   ├── prisma/            # Prisma schema & migrations
│   └── package.json
│
└── docs/           # Tài liệu
```

## 🚀 Cài đặt và chạy

### Frontend

```bash
cd client
npm install
npm run dev
```

Frontend sẽ chạy tại `http://localhost:5173`

### Backend

```bash
cd backend
npm install

# Setup database
npx prisma generate
npx prisma migrate dev

# Chạy server
npm run start:dev
```

Backend sẽ chạy tại `http://localhost:3000`

## 📱 Các trang chính

- `/` - Trang chủ (Landing Page)
- `/tuvi` - Xem Tử Vi
- `/tarot` - Bói bài Tarot
- `/nhantuong` - Phân tích Nhân Tướng
- `/socialmedia` - Diễn đàn chia sẻ
- `/post/:id` - Chi tiết bài viết
- `/login` - Đăng nhập
- `/register` - Đăng ký

## ✨ Tính năng

### Xem Bói
- **Tử Vi**: Nhập thông tin ngày sinh để xem tử vi
- **Tarot**: Bói bài Tarot trực tuyến
- **Nhân Tướng**: Phân tích nhân tướng học

### Diễn đàn
- Xem danh sách bài viết
- Xem chi tiết bài viết
- Bốc thăm vận may
- Tìm kiếm bài viết
- Thông báo và quản lý tài khoản

### Authentication
- Đăng ký tài khoản
- Đăng nhập
- JWT authentication
- Role-based access control

## 📝 Scripts

### Frontend
- `npm run dev` - Chạy development server
- `npm run build` - Build production
- `npm run lint` - Kiểm tra lỗi code

### Backend
- `npm run start:dev` - Chạy development server
- `npm run build` - Build production
- `npm run test` - Chạy tests
- `npx prisma migrate dev` - Chạy migrations

## 🔐 Environment Variables

Tạo file `.env` trong thư mục `backend/`:

```env
DATABASE_URL="mysql://user:password@localhost:3306/dbname"
JWT_SECRET="your-secret-key"
```

## 📄 License

UNLICENSED

## 👥 Tác giả

Dự án IT4409 - Web & E-Service 2025.1

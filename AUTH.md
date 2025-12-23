# Tài Liệu Hệ Thống Authentication

## Mục Lục
1. [Tổng Quan](#tổng-quan)
2. [Cấu Trúc Module](#cấu-trúc-module)
3. [API Endpoints](#api-endpoints)
4. [JWT Strategy](#jwt-strategy)
5. [Guards và Decorators](#guards-và-decorators)
6. [Cách Sử Dụng](#cách-sử-dụng)
7. [Ví Dụ Thực Tế](#ví-dụ-thực-tế)
8. [Bảo Mật](#bảo-mật)

---

## Tổng Quan

Hệ thống Authentication của ứng dụng sử dụng **JWT (JSON Web Token)** để xác thực người dùng. Hệ thống hỗ trợ:

- ✅ Đăng ký tài khoản mới
- ✅ Đăng nhập bằng email/username và mật khẩu
- ✅ Xác thực JWT token
- ✅ Phân quyền dựa trên Role (USER, ADMIN)
- ✅ Bảo vệ routes bằng Guards

### Công Nghệ Sử Dụng

- **@nestjs/passport**: Framework authentication cho NestJS
- **@nestjs/jwt**: JWT token generation và validation
- **passport-jwt**: Strategy để xác thực JWT
- **bcrypt**: Mã hóa mật khẩu
- **class-validator**: Validation cho DTOs

---

## Cấu Trúc Module

```
src/auth/
├── auth.controller.ts      # API endpoints (register, login)
├── auth.service.ts          # Business logic (đăng ký, đăng nhập, tạo token)
├── auth.module.ts           # Module configuration
├── strategy/
│   └── jwt.strategy.ts      # JWT passport strategy
├── guard/
│   └── roles.guard.ts       # Guard kiểm tra quyền truy cập
└── decorator/
    ├── get-user.decorator.ts  # Decorator lấy thông tin user từ request
    └── roles.decorator.ts     # Decorator định nghĩa roles cho route
```

---

## API Endpoints

### 1. Đăng Ký (Register)

**Endpoint:** `POST /auth/register`

**Mô tả:** Tạo tài khoản người dùng mới trong hệ thống.

**Request Body:**
```json
{
  "fullName": "Nguyễn Văn A",
  "email": "nguyenvana@example.com",
  "password": "password123",
  "userName": "nguyenvana",
  "role": "USER",           // Optional, mặc định là "USER"
  "birthday": "1990-01-01", // Optional
  "gender": "Nam"           // Optional
}
```

**Validation:**
- `fullName`: Bắt buộc, phải là string
- `email`: Bắt buộc, phải là email hợp lệ, duy nhất
- `password`: Bắt buộc, tối thiểu 6 ký tự
- `userName`: Bắt buộc, phải là string, duy nhất
- `role`: Optional, enum: `USER` hoặc `ADMIN` (mặc định: `USER`)
- `birthday`: Optional, định dạng ISO 8601 (YYYY-MM-DD)
- `gender`: Optional, string

**Response (201):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "nguyenvana@example.com",
    "userName": "nguyenvana",
    "fullName": "Nguyễn Văn A",
    "role": "USER",
    "avatarUrl": null,
    "bio": null,
    "birthday": "1990-01-01T00:00:00.000Z",
    "gender": "Nam",
    "level": 1,
    "xp": 0
  }
}
```

**Lỗi Có Thể Xảy Ra:**
- `400`: Dữ liệu không hợp lệ (email/username đã tồn tại, password quá ngắn...)
- `403`: Email đã được sử dụng

---

### 2. Đăng Nhập (Login)

**Endpoint:** `POST /auth/login`

**Mô tả:** Đăng nhập vào hệ thống bằng email/username và mật khẩu.

**Request Body:**
```json
{
  "email": "nguyenvana@example.com",  // Có thể dùng email hoặc username
  "password": "password123"
}
```

**Validation:**
- `email`: Bắt buộc, có thể là email hoặc username
- `password`: Bắt buộc

**Response (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "nguyenvana@example.com",
    "userName": "nguyenvana",
    "fullName": "Nguyễn Văn A",
    "role": "USER",
    "avatarUrl": null,
    "bio": null,
    "birthday": "1990-01-01T00:00:00.000Z",
    "gender": "Nam",
    "level": 1,
    "xp": 0
  }
}
```

**Lỗi Có Thể Xảy Ra:**
- `401`: Email hoặc mật khẩu không đúng
- `403`: Tài khoản đăng nhập bằng phương thức khác (Google/Facebook)
- `404`: Tài khoản không tồn tại

**Lưu Ý:**
- Hệ thống cho phép đăng nhập bằng **email** hoặc **username** (trường `email` trong request có thể nhận cả hai)
- Mật khẩu được mã hóa bằng bcrypt với salt rounds = 10
- Token JWT được tạo với payload: `{ sub: userId, email, role }`

---

## JWT Strategy

### Cấu Hình

JWT Strategy được cấu hình trong `jwt.strategy.ts`:

```typescript
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || 'supersecret',
    });
  }

  async validate(payload: any) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub }
    });
    return user;
  }
}
```

**Cách Hoạt Động:**
1. Extract JWT token từ header `Authorization: Bearer <token>`
2. Verify token với `JWT_SECRET`
3. Validate payload và tìm user trong database
4. Attach user object vào `request.user`

### Environment Variables

Cần cấu hình các biến môi trường sau:

```env
JWT_SECRET=your-secret-key-here
JWT_EXPIRATION=7d  # Thời gian hết hạn của token (ví dụ: 7d, 24h, 1h)
```

---

## Guards và Decorators

### 1. AuthGuard

**Mục đích:** Bảo vệ route, yêu cầu user phải đăng nhập.

**Cách sử dụng:**
```typescript
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Get('protected-route')
getProtectedData() {
  // Route này yêu cầu authentication
}
```

### 2. RolesGuard

**Mục đích:** Kiểm tra quyền truy cập dựa trên Role của user.

**Cách sử dụng:**
```typescript
import { RolesGuard } from '../../auth/guard/roles.guard';
import { Roles } from '../../auth/decorator/roles.decorator';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('ADMIN')
@Get('admin-only')
getAdminData() {
  // Chỉ ADMIN mới có thể truy cập
}
```

**Lưu ý:** `RolesGuard` phải được sử dụng cùng với `AuthGuard('jwt')` vì nó cần `request.user` từ JWT strategy.

### 3. GetUser Decorator

**Mục đích:** Lấy thông tin user từ request một cách dễ dàng.

**Cách sử dụng:**
```typescript
import { GetUser } from '../../auth/decorator/get-user.decorator';

@UseGuards(AuthGuard('jwt'))
@Get('me')
getCurrentUser(@GetUser() user: User) {
  // Lấy toàn bộ user object
  return user;
}

@UseGuards(AuthGuard('jwt'))
@Get('my-email')
getMyEmail(@GetUser('email') email: string) {
  // Lấy một field cụ thể
  return { email };
}
```

### 4. Roles Decorator

**Mục đích:** Định nghĩa roles được phép truy cập route.

**Cách sử dụng:**
```typescript
import { Roles } from '../../auth/decorator/roles.decorator';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('ADMIN', 'USER')  // Cho phép cả ADMIN và USER
@Get('some-route')
getData() {
  // ...
}

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('ADMIN')  // Chỉ ADMIN
@Delete('delete')
deleteData() {
  // ...
}
```

---

## Cách Sử Dụng

### 1. Bảo Vệ Route Cơ Bản

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../../auth/decorator/get-user.decorator';

@Controller('example')
export class ExampleController {
  @UseGuards(AuthGuard('jwt'))
  @Get('protected')
  getProtectedData(@GetUser() user) {
    return {
      message: 'Bạn đã đăng nhập',
      userId: user.id,
      email: user.email
    };
  }
}
```

### 2. Bảo Vệ Route Với Role

```typescript
import { Controller, Delete, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../auth/guard/roles.guard';
import { Roles } from '../../auth/decorator/roles.decorator';

@Controller('admin')
export class AdminController {
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @Delete('users/:id')
  deleteUser(@Param('id') id: string) {
    // Chỉ ADMIN mới có thể xóa user
    return { message: 'User đã được xóa' };
  }
}
```

### 3. Lấy Thông Tin User Trong Service

```typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SomeService {
  constructor(private prisma: PrismaService) {}

  async getUserPosts(userId: number) {
    return this.prisma.post.findMany({
      where: { userId }
    });
  }
}
```

Trong Controller:
```typescript
@UseGuards(AuthGuard('jwt'))
@Get('my-posts')
async getMyPosts(@GetUser() user) {
  return this.someService.getUserPosts(user.id);
}
```

---

## Ví Dụ Thực Tế

### Ví Dụ 1: User Controller

```typescript
@ApiTags('Users')
@ApiBearerAuth()
@Controller('user')
export class UserController {
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get('me')
  getCurrentUser(@GetUser() user: User) {
    return user;
  }
}
```

### Ví Dụ 2: Report Controller (Chỉ Admin)

```typescript
@ApiTags('Reports')
@ApiBearerAuth()
@Controller('report')
export class ReportController {
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @Get()
  getAllReports() {
    // Chỉ ADMIN mới có thể xem tất cả reports
    return this.reportService.findAll();
  }
}
```

### Ví Dụ 3: Post Controller (User và Admin)

```typescript
@ApiTags('Posts')
@ApiBearerAuth()
@Controller('post')
export class PostController {
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post()
  createPost(@Body() dto: CreatePostDto, @GetUser() user: User) {
    // Cả USER và ADMIN đều có thể tạo post
    return this.postService.create(dto, user.id);
  }
}
```

---

## Bảo Mật

### 1. Mật Khẩu

- Mật khẩu được mã hóa bằng **bcrypt** với **salt rounds = 10**
- Mật khẩu không bao giờ được trả về trong response
- Mật khẩu tối thiểu 6 ký tự

### 2. JWT Token

- Token chứa: `userId` (sub), `email`, `role`
- Token được ký bằng `JWT_SECRET` từ environment variable
- Token có thời gian hết hạn (cấu hình trong `JWT_EXPIRATION`)
- Token được gửi qua header: `Authorization: Bearer <token>`

### 3. Sensitive Data

Các field nhạy cảm không được trả về trong response:
- `password`
- `googleId`
- `facebookId`
- `createdAt`, `updatedAt` (tùy endpoint)

### 4. Role-Based Access Control (RBAC)

- Hệ thống hỗ trợ 2 roles: `USER` và `ADMIN`
- Sử dụng `RolesGuard` để kiểm tra quyền truy cập
- Mặc định role là `USER` khi đăng ký

### 5. Best Practices

✅ **Nên làm:**
- Luôn sử dụng `AuthGuard('jwt')` cho các route cần authentication
- Sử dụng `RolesGuard` kèm `Roles` decorator cho route cần phân quyền
- Sử dụng `GetUser` decorator để lấy thông tin user
- Validate input bằng DTOs với class-validator
- Sử dụng environment variables cho JWT_SECRET

❌ **Không nên:**
- Không hardcode JWT_SECRET trong code
- Không trả về password trong response
- Không bỏ qua validation
- Không sử dụng token hết hạn

---

## Testing với Swagger

1. Truy cập Swagger UI: `http://localhost:6789/api`
2. Đăng ký/Đăng nhập để lấy `access_token`
3. Click nút **"Authorize"** ở góc trên bên phải
4. Nhập token: `Bearer <your-token>`
5. Test các endpoint được bảo vệ

---

## Troubleshooting

### Lỗi: "Unauthorized"
- Kiểm tra token có được gửi trong header `Authorization: Bearer <token>`
- Kiểm tra token có hết hạn chưa
- Kiểm tra `JWT_SECRET` có đúng không

### Lỗi: "Forbidden"
- Kiểm tra user có đúng role không (nếu route yêu cầu role cụ thể)
- Kiểm tra `RolesGuard` và `Roles` decorator có được sử dụng đúng không

### Lỗi: "Email đã được sử dụng"
- Email hoặc username đã tồn tại trong database
- Sử dụng email/username khác

### Lỗi: "Tài khoản đăng nhập bằng phương thức khác"
- User đã đăng ký bằng OAuth (Google/Facebook)
- Cần đăng nhập bằng phương thức OAuth tương ứng

---

## Tài Liệu Tham Khảo

- [NestJS Authentication](https://docs.nestjs.com/security/authentication)
- [Passport JWT Strategy](http://www.passportjs.org/packages/passport-jwt/)
- [JWT.io](https://jwt.io/) - Debug và test JWT tokens


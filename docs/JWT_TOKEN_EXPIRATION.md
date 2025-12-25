# Tài Liệu JWT Token Expiration - Frontend Implementation Guide

## Mục Lục
1. [JWT_EXPIRATION Configuration](#1-jwt_expiration-configuration)
2. [JWT Token Structure](#2-jwt-token-structure)
3. [Token Generation](#3-token-generation)
4. [Token Validation](#4-token-validation)
5. [Code Examples](#5-code-examples)
6. [Frontend Implementation Guide](#6-frontend-implementation-guide)

---

## 1. JWT_EXPIRATION Configuration

### Giá trị hiện tại

Theo `RUN_PROJECT.md`, giá trị mặc định trong file `.env` là:
```env
JWT_EXPIRATION="24h"
```

### Format/Unit được sử dụng

`@nestjs/jwt` (sử dụng thư viện `jsonwebtoken` bên dưới) hỗ trợ các format sau:

- `"24h"` - 24 giờ
- `"7d"` - 7 ngày  
- `"1h"` - 1 giờ
- `"30m"` - 30 phút
- `"3600"` hoặc `"3600s"` - 3600 giây
- `"2 days"`, `"10h"`, `"7.5h"` - các format khác

**Lưu ý:** Format được parse tự động bởi thư viện `jsonwebtoken`, không cần parse thủ công.

### Cách JWT_EXPIRATION được parse và sử dụng

**Trong `auth.service.ts`:**
```typescript
async signToken(userId: number, email: string, role: string) {
  const payload = { sub: userId, email, role };
  const secret = this.config.get('JWT_SECRET');
  const expiresIn = this.config.get('JWT_EXPIRATION'); // Lấy từ .env
  
  const token = await this.jwt.signAsync(payload, {
    expiresIn: expiresIn,  // Passport-JWT tự động parse format này
    secret: secret,
  });
  
  return {
    access_token: token
  };
}
```

**Trong `auth.module.ts`:**
```typescript
@Module({
  imports: [
    PrismaModule,
    JwtModule.register({}),  // Empty config, sử dụng default
    ConfigModule
  ],
  // ...
})
```

**Lưu ý:** `JwtModule.register({})` sử dụng config mặc định. `expiresIn` được truyền trực tiếp vào `jwt.signAsync()` trong service, không cần config ở module level.

---

## 2. JWT Token Structure

### Payload Structure

JWT token có 3 phần: **Header**, **Payload**, **Signature**.

**Custom Payload** (được định nghĩa trong code):
```typescript
{
  sub: number,      // User ID
  email: string,    // User email
  role: string      // User role (USER | ADMIN)
}
```

**Full Payload** (sau khi JWT library tự động thêm):
```typescript
{
  sub: number,      // User ID (custom)
  email: string,    // User email (custom)
  role: string,     // User role (custom)
  iat: number,      // ✅ Issued At (tự động thêm) - Unix timestamp (seconds)
  exp: number       // ✅ Expiration (tự động thêm) - Unix timestamp (seconds)
}
```

### Có field `exp` và `iat` không?

**Có!** `@nestjs/jwt` (sử dụng `jsonwebtoken`) tự động thêm:
- `exp`: Unix timestamp (seconds) khi token hết hạn
- `iat`: Unix timestamp (seconds) khi token được tạo

### Ví dụ Payload thực tế

```json
{
  "sub": 1,
  "email": "nguyenvana@example.com",
  "role": "USER",
  "iat": 1703123456,
  "exp": 1703209856
}
```

**Giải thích:**
- `iat: 1703123456` = Token được tạo lúc: `2023-12-21 10:30:56 UTC`
- `exp: 1703209856` = Token hết hạn lúc: `2023-12-22 10:30:56 UTC` (24 giờ sau)

---

## 3. Token Generation

### File và Function

**File:** `src/auth/auth.service.ts`

**Function:** `signToken()`

```typescript
async signToken(userId: number, email: string, role: string) {
  const payload = { sub: userId, email, role };
  const secret = this.config.get('JWT_SECRET');
  const expiresIn = this.config.get('JWT_EXPIRATION');
  
  const token = await this.jwt.signAsync(payload, {
    expiresIn: expiresIn,
    secret: secret,
  });
  
  return {
    access_token: token
  };
}
```

### Cách token được sign

- Sử dụng `JwtService.signAsync()` (async version)
- `expiresIn` được truyền vào options
- `secret` từ environment variable
- Tự động thêm `exp` và `iat` vào payload

### Refresh Token Mechanism

**Hiện tại:** Không có refresh token mechanism. Chỉ có access token. Khi token hết hạn, user cần đăng nhập lại.

---

## 4. Token Validation

### Cách backend validate token expiration

**File:** `src/auth/strategy/jwt.strategy.ts`

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

**Cách hoạt động:**
1. `passport-jwt` tự động verify token signature và kiểm tra `exp`
2. Nếu token hết hạn, `passport-jwt` throw error **trước khi** vào `validate()`
3. Nếu token hợp lệ, `validate()` được gọi để lấy user từ database

### Response khi token hết hạn

Khi token hết hạn, `passport-jwt` tự động reject và NestJS trả về:

**Status Code:** `401 Unauthorized`

**Response Body:**
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

Hoặc có thể có message chi tiết hơn tùy vào cấu hình error handling.

---

## 5. Code Examples

### auth.module.ts - JWT Module Configuration

```typescript
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import { PrismaModule } from '../prisma/prisma.module'; 
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({}),  // Empty config - sử dụng default
    ConfigModule
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
```

### auth.service.ts - Token Generation

```typescript
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,        // JwtService từ @nestjs/jwt
    private config: ConfigService,
  ) {}

  async signToken(userId: number, email: string, role: string) {
    const payload = { sub: userId, email, role };
    const secret = this.config.get('JWT_SECRET');
    const expiresIn = this.config.get('JWT_EXPIRATION');
  
    // jwt.signAsync() tự động:
    // 1. Thêm iat (issued at)
    // 2. Tính exp dựa trên expiresIn
    // 3. Sign token với secret
    const token = await this.jwt.signAsync(payload, {
      expiresIn: expiresIn,  // Ví dụ: "24h"
      secret: secret,
    });
  
    return {
      access_token: token
    };
  }
}
```

### jwt.strategy.ts - Token Validation

```typescript
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || 'supersecret',
      // passport-jwt tự động verify exp
    });
  }

  // Function này chỉ được gọi nếu token hợp lệ và chưa hết hạn
  async validate(payload: any) {
    const user = await this.prisma.user.findUnique({
        where: { id: payload.sub }
    });
    return user;
  }
}
```

---

## 6. Frontend Implementation Guide

### 1. Decode JWT Token

```typescript
// Helper function để decode JWT (không cần verify signature)
function decodeJWT(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
}
```

**Hoặc sử dụng thư viện:**
```bash
npm install jwt-decode
```

```typescript
import jwt_decode from 'jwt-decode';

function decodeJWT(token: string): any {
  try {
    return jwt_decode(token);
  } catch (error) {
    return null;
  }
}
```

### 2. Check Token Expiration

```typescript
function isTokenExpired(token: string): boolean {
  const decoded = decodeJWT(token);
  if (!decoded || !decoded.exp) {
    return true; // Không có exp = invalid token
  }
  
  // exp là Unix timestamp (seconds), Date.now() là milliseconds
  const expirationTime = decoded.exp * 1000;
  const currentTime = Date.now();
  
  // Có thể thêm buffer time (ví dụ: 5 phút trước khi hết hạn)
  const bufferTime = 5 * 60 * 1000; // 5 phút
  
  return currentTime >= (expirationTime - bufferTime);
}
```

### 3. Check Token on App Startup

```typescript
// Trong App.tsx hoặc main.tsx
import { useEffect } from 'react';

useEffect(() => {
  const token = localStorage.getItem('access_token');
  
  if (token) {
    if (isTokenExpired(token)) {
      // Token đã hết hạn, logout user
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      // Redirect to login
      window.location.href = '/login';
    } else {
      // Token còn hợp lệ, có thể set user vào state
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      setUser(user);
    }
  }
}, []);
```

### 4. Check Token Before API Request

#### Axios Interceptor

```typescript
import axios from 'axios';

// Request interceptor
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    
    if (token) {
      if (isTokenExpired(token)) {
        // Token hết hạn, logout và redirect
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(new Error('Token expired'));
      }
      
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor để handle 401
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token không hợp lệ hoặc hết hạn
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

#### Fetch API Wrapper

```typescript
async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem('access_token');
  
  if (token) {
    if (isTokenExpired(token)) {
      localStorage.clear();
      window.location.href = '/login';
      throw new Error('Token expired');
    }
    
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  
  const response = await fetch(url, options);
  
  if (response.status === 401) {
    localStorage.clear();
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }
  
  return response;
}
```

### 5. Complete Example với React Hook

```typescript
import { useEffect, useState } from 'react';

interface JWTPayload {
  sub: number;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

function decodeJWT(token: string): JWTPayload | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
}

function isTokenExpired(token: string): boolean {
  const decoded = decodeJWT(token);
  if (!decoded || !decoded.exp) {
    return true;
  }
  
  const expirationTime = decoded.exp * 1000;
  const currentTime = Date.now();
  const bufferTime = 5 * 60 * 1000; // 5 phút buffer
  
  return currentTime >= (expirationTime - bufferTime);
}

function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    
    if (token) {
      const decoded = decodeJWT(token);
      
      if (decoded && decoded.exp) {
        const expirationTime = decoded.exp * 1000;
        const currentTime = Date.now();
        
        if (currentTime < expirationTime) {
          // Token còn hợp lệ
          setIsAuthenticated(true);
          const savedUser = localStorage.getItem('user');
          if (savedUser) {
            setUser(JSON.parse(savedUser));
          }
        } else {
          // Token hết hạn
          handleLogout();
        }
      } else {
        handleLogout();
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  return { isAuthenticated, user, logout: handleLogout };
}

// Sử dụng
function App() {
  const { isAuthenticated, user, logout } = useAuth();
  
  if (!isAuthenticated) {
    return <LoginPage />;
  }
  
  return (
    <div>
      <p>Welcome, {user?.email}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### 6. Vue.js Example

```typescript
// composables/useAuth.ts
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

export function useAuth() {
  const router = useRouter();
  const isAuthenticated = ref(false);
  const user = ref(null);

  function decodeJWT(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      return null;
    }
  }

  function isTokenExpired(token: string): boolean {
    const decoded = decodeJWT(token);
    if (!decoded || !decoded.exp) {
      return true;
    }
    const expirationTime = decoded.exp * 1000;
    const currentTime = Date.now();
    return currentTime >= expirationTime;
  }

  function checkAuth() {
    const token = localStorage.getItem('access_token');
    if (token && !isTokenExpired(token)) {
      isAuthenticated.value = true;
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        user.value = JSON.parse(savedUser);
      }
    } else {
      logout();
    }
  }

  function logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    isAuthenticated.value = false;
    user.value = null;
    router.push('/login');
  }

  onMounted(() => {
    checkAuth();
  });

  return {
    isAuthenticated,
    user,
    logout,
    checkAuth,
  };
}
```

### 7. Auto-refresh Token Check (Periodic Check)

```typescript
// Check token expiration mỗi 1 phút
useEffect(() => {
  const checkInterval = setInterval(() => {
    const token = localStorage.getItem('access_token');
    if (token && isTokenExpired(token)) {
      handleLogout();
    }
  }, 60 * 1000); // Check mỗi 1 phút

  return () => clearInterval(checkInterval);
}, []);
```

---

## Tóm Tắt

### Thông tin quan trọng:

1. **JWT_EXPIRATION:** `"24h"` (có thể thay đổi trong `.env`)
2. **Token structure:** Có `exp` và `iat` (tự động thêm bởi JWT library)
3. **Format:** `exp` và `iat` là Unix timestamp (seconds)
4. **Validation:** Backend tự động kiểm tra `exp` qua `passport-jwt`
5. **Response khi hết hạn:** `401 Unauthorized`

### Best Practices cho Frontend:

✅ **Nên làm:**
- Check token expiration trước khi gửi request
- Check token khi app khởi động
- Sử dụng interceptor để tự động handle expired token
- Thêm buffer time (5-10 phút) để tránh request fail ngay trước khi hết hạn
- Clear localStorage khi token hết hạn

❌ **Không nên:**
- Không chỉ dựa vào response 401 (nên check trước)
- Không lưu token trong memory mà không check expiration
- Không gửi request với token đã hết hạn

---

## Testing

### Test với JWT Token

1. **Decode token để xem payload:**
   - Truy cập: https://jwt.io
   - Paste token vào để decode và xem `exp`, `iat`

2. **Test expiration:**
   - Tạo token với `JWT_EXPIRATION="10s"` (10 giây)
   - Đợi 11 giây và test API call
   - Kiểm tra response 401

3. **Test frontend:**
   - Lưu token vào localStorage
   - Reload page và check auto-logout
   - Test API call với expired token

---

## Tài Liệu Tham Khảo

- [JWT.io](https://jwt.io/) - Debug và test JWT tokens
- [jsonwebtoken Documentation](https://github.com/auth0/node-jsonwebtoken#readme)
- [passport-jwt Documentation](https://github.com/mikenicholson/passport-jwt)
- [jwt-decode npm package](https://www.npmjs.com/package/jwt-decode)


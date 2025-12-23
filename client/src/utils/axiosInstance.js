import axios from 'axios';
import { isTokenExpired } from './jwtUtils';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:6789',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor để thêm token vào header và kiểm tra expiration
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    
    // Nếu là FormData, không set Content-Type (axios sẽ tự động set với boundary)
    if (config.data instanceof FormData) {
      // Xóa Content-Type header để browser tự động set với boundary
      delete config.headers['Content-Type'];
    }
    
    if (token) {
      // Kiểm tra token expiration trước khi gửi request
      if (isTokenExpired(token)) {
        // Token hết hạn, xóa và redirect
        localStorage.removeItem('token');
        localStorage.removeItem('currentUser');
        
        // Chỉ redirect nếu không phải là auth endpoint
        const requestPath = config.url || '';
        const isAuthEndpoint = 
          requestPath.startsWith('/auth/login') || 
          requestPath.startsWith('/auth/register') ||
          requestPath === '/auth/login' ||
          requestPath === '/auth/register';
        
        if (!isAuthEndpoint) {
          window.location.href = '/?login=true';
        }
        
        return Promise.reject(new Error('Token expired'));
      }
      
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor để xử lý lỗi
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Chỉ redirect khi không phải là API login/register
      // Vì khi đăng nhập sai, backend trả về 401 nhưng không nên redirect
      const config = error.config;
      
      // Kiểm tra flag skipAuthRedirect trước
      if (config?.skipAuthRedirect) {
        // Không redirect, để component tự xử lý
        return Promise.reject(error);
      }
      
      if (config && config.url) {
        // Kiểm tra URL path (config.url thường là relative path như "/auth/login")
        const requestPath = config.url;
        
        // Kiểm tra xem có phải là endpoint auth không
        const isAuthEndpoint = 
          requestPath.startsWith('/auth/login') || 
          requestPath.startsWith('/auth/register') ||
          requestPath === '/auth/login' ||
          requestPath === '/auth/register';
        
        if (!isAuthEndpoint) {
          // Token hết hạn hoặc không hợp lệ từ các API khác
          localStorage.removeItem('token');
          localStorage.removeItem('currentUser');
          window.location.href = '/?login=true';
        }
      } else {
        // Nếu không có config hoặc url, an toàn hơn là không redirect
        // Để component tự xử lý
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;


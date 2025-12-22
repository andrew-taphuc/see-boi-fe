/**
 * Utility functions để xử lý JWT token
 * Dựa trên tài liệu JWT_TOKEN_EXPIRATION.md
 */

/**
 * Decode JWT token (không verify signature)
 * @param {string} token - JWT token string
 * @returns {object|null} - Decoded payload hoặc null nếu lỗi
 */
export function decodeJWT(token) {
  if (!token) return null;
  
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }
    
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
}

/**
 * Kiểm tra token có hết hạn chưa
 * @param {string} token - JWT token string
 * @param {number} bufferTimeMs - Buffer time trước khi hết hạn (milliseconds), mặc định 5 phút
 * @returns {boolean} - true nếu token đã hết hạn hoặc sắp hết hạn
 */
export function isTokenExpired(token, bufferTimeMs = 5 * 60 * 1000) {
  if (!token) return true;
  
  const decoded = decodeJWT(token);
  if (!decoded || !decoded.exp) {
    return true; // Không có exp = invalid token
  }
  
  // exp là Unix timestamp (seconds), Date.now() là milliseconds
  const expirationTime = decoded.exp * 1000;
  const currentTime = Date.now();
  
  // Kiểm tra với buffer time (ví dụ: 5 phút trước khi hết hạn)
  return currentTime >= (expirationTime - bufferTimeMs);
}

/**
 * Lấy thời gian còn lại của token (milliseconds)
 * @param {string} token - JWT token string
 * @returns {number|null} - Số milliseconds còn lại, hoặc null nếu invalid
 */
export function getTokenTimeRemaining(token) {
  if (!token) return null;
  
  const decoded = decodeJWT(token);
  if (!decoded || !decoded.exp) {
    return null;
  }
  
  const expirationTime = decoded.exp * 1000;
  const currentTime = Date.now();
  const remaining = expirationTime - currentTime;
  
  return remaining > 0 ? remaining : 0;
}


import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Chỉ dùng auth thật (token + currentUser từ API login)
    const token = localStorage.getItem('token');
    const saved = localStorage.getItem('currentUser');
    
    if (token && saved) {
      try {
        const parsedUser = JSON.parse(saved);
        setCurrentUser(parsedUser);
        return;
      } catch (error) {
        // Nếu parse lỗi, xóa dữ liệu không hợp lệ
        localStorage.removeItem('currentUser');
        localStorage.removeItem('token');
      }
    }

    // Không có token hợp lệ => chưa đăng nhập
    setCurrentUser(null);
  }, []);

  // Login từ API (với token)
  const loginAPI = useCallback((user, token) => {
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('token', token);
  }, []);

  // Cập nhật user hiện tại (ví dụ sau khi PATCH /user/me)
  const updateCurrentUser = useCallback((partialOrNextUser) => {
    setCurrentUser((prev) => {
      const next =
        typeof partialOrNextUser === 'function'
          ? partialOrNextUser(prev)
          : partialOrNextUser;

      if (next) {
        localStorage.setItem('currentUser', JSON.stringify(next));
      }
      return next;
    });
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
  }, []);

  const value = useMemo(
    () => ({ currentUser, loginAPI, logout, updateCurrentUser }),
    [currentUser, loginAPI, logout, updateCurrentUser]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};



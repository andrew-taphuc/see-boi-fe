import { createContext, useContext, useState, useEffect } from 'react';
import usersData from '../data/users.json';

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
    // Kiểm tra token và user từ localStorage (từ API login)
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
    
    // Nếu không có token (chưa đăng nhập qua API), dùng logic cũ với usersData
    if (saved) {
      try {
        const parsedUser = JSON.parse(saved);
        // Kiểm tra xem user có còn tồn tại trong usersData không
        const userExists = usersData.find(u => u.id === parsedUser.id);
        if (userExists) {
          setCurrentUser(userExists);
        } else {
          // Nếu user không tồn tại, dùng user đầu tiên
          setCurrentUser(usersData[0]);
          localStorage.setItem('currentUser', JSON.stringify(usersData[0]));
        }
      } catch (error) {
        // Nếu parse lỗi, dùng user đầu tiên
        setCurrentUser(usersData[0]);
        localStorage.setItem('currentUser', JSON.stringify(usersData[0]));
      }
    } else {
      // Mặc định chọn user đầu tiên (chỉ khi không có token)
      if (!token) {
        setCurrentUser(usersData[0]);
        localStorage.setItem('currentUser', JSON.stringify(usersData[0]));
      }
    }
  }, []);

  // Login từ API (với token)
  const loginAPI = (user, token) => {
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('token', token);
  };

  // Login từ local (không có token, dùng cho switchUser)
  const login = (user) => {
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
  };

  const switchUser = (userId) => {
    const user = usersData.find(u => u.id === userId);
    if (user) {
      login(user);
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, loginAPI, logout, switchUser }}>
      {children}
    </AuthContext.Provider>
  );
};



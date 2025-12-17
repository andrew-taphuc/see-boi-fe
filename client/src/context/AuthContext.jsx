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
    // Lấy từ localStorage hoặc mặc định user đầu tiên
    const saved = localStorage.getItem('currentUser');
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
      // Mặc định chọn user đầu tiên
      setCurrentUser(usersData[0]);
      localStorage.setItem('currentUser', JSON.stringify(usersData[0]));
    }
  }, []);

  const login = (user) => {
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const switchUser = (userId) => {
    const user = usersData.find(u => u.id === userId);
    if (user) {
      login(user);
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, switchUser }}>
      {children}
    </AuthContext.Provider>
  );
};


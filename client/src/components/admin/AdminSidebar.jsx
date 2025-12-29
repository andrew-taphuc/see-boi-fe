import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  AlertTriangle, 
  FileText, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  UserCog
} from 'lucide-react';

const AdminSidebar = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const menuItems = [
    {
      name: 'Dashboard',
      path: '/admin',
      icon: LayoutDashboard,
    },
    {
      name: 'Quản lý người dùng',
      path: '/admin/users',
      icon: Users,
    },
    {
      name: 'Quản lý báo cáo',
      path: '/admin/reports',
      icon: AlertTriangle,
    },
    {
      name: 'Quản lý bài viết & Comment',
      path: '/admin/posts',
      icon: FileText,
    },
    {
      name: 'Thông tin cá nhân',
      path: '/admin/profile',
      icon: UserCog,
    },
  ];

  return (
    <div className={`${
      isCollapsed ? 'w-20' : 'w-64'
    } bg-gray-800 text-white min-h-screen fixed left-0 top-0 flex flex-col transition-all duration-300 z-50`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-700 flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-amber-400">Admin Panel</h1>
            <p className="text-sm text-gray-400 mt-1">{user?.fullName || 'Administrator'}</p>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          title={isCollapsed ? 'Mở sidebar' : 'Thu gọn sidebar'}
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 py-6">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-6 py-3 transition-colors duration-200 ${
                  isActive
                    ? 'bg-amber-600 text-white border-l-4 border-amber-400'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`
              }
              title={isCollapsed ? item.name : ''}
            >
              <IconComponent size={24} className="flex-shrink-0" />
              {!isCollapsed && <span className="font-medium">{item.name}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer with Logout */}
      <div className="p-6 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-2 text-gray-300 hover:bg-red-600 hover:text-white rounded-lg transition-colors duration-200"
          title={isCollapsed ? 'Đăng xuất' : ''}
        >
          <LogOut size={24} className="flex-shrink-0" />
          {!isCollapsed && <span className="font-medium">Đăng xuất</span>}
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;

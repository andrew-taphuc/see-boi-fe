import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Bell, CalendarDays, Sparkles, Eye, Settings, LogOut, User, HelpCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import ballLogo from '../../assets/ball.png';

const SocialHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isAvatarOpen, setIsAvatarOpen] = useState(false);
  const notificationRef = useRef(null);
  const avatarRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
      if (avatarRef.current && !avatarRef.current.contains(event.target)) {
        setIsAvatarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-white shadow-md fixed top-0 w-full z-50">
      <div className="flex items-center justify-between px-6 h-14">
        {/* Left: Logo & Brand Name */}
        <div className="flex items-center gap-4 flex-1">
          <Link 
            to="/socialmedia" 
            className="flex items-center gap-2 hover:opacity-80 transition-opacity flex-shrink-0"
          >
            <img 
              src={ballLogo} 
              alt="See Bói Logo" 
              className="h-10 w-auto drop-shadow-lg object-contain"
            />
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              See Bói
            </span>
          </Link>
        </div>

        {/* Center: 3 Navigation Buttons with Icons */}
        <nav className="flex items-center gap-1 absolute left-1/2 transform -translate-x-1/2">
          <Link
            to="/tuvi"
            className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors ${
              location.pathname === '/tuvi'
                ? 'bg-purple-100 text-purple-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <CalendarDays size={20} />
            <span>Tử Vi</span>
          </Link>
          <Link
            to="/tarot"
            className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors ${
              location.pathname === '/tarot'
                ? 'bg-purple-100 text-purple-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Sparkles size={20} />
            <span>Tarot</span>
          </Link>
          <Link
            to="/nhantuong"
            className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors ${
              location.pathname === '/nhantuong'
                ? 'bg-purple-100 text-purple-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Eye size={20} />
            <span>Nhân Tướng</span>
          </Link>
        </nav>

        {/* Right: User Switcher, Notification & Avatar */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Notification Bell with Dropdown */}
          <div className="relative" ref={notificationRef}>
            <button 
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Bell size={20} className="text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            
            {/* Notification Dropdown */}
            {isNotificationOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-y-auto">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900">Thông báo</h3>
                </div>
                <div className="divide-y divide-gray-100">
                  {/* Sample notifications */}
                  {[
                    { id: 1, text: "Bạn có một lượt bốc thăm mới", time: "5 phút trước", unread: true },
                    { id: 2, text: "Ai đó đã thích bài viết của bạn", time: "1 giờ trước", unread: true },
                    { id: 3, text: "Bình luận mới trên bài viết của bạn", time: "2 giờ trước", unread: false },
                    { id: 4, text: "Bạn có tin nhắn mới", time: "3 giờ trước", unread: false },
                  ].map((notification) => (
                    <div 
                      key={notification.id}
                      className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                        notification.unread ? 'bg-purple-50' : ''
                      }`}
                    >
                      <p className="text-sm text-gray-800">{notification.text}</p>
                      <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-gray-200 text-center">
                  <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                    Xem tất cả thông báo
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Avatar with Dropdown */}
          {currentUser && (
            <div className="relative" ref={avatarRef}>
              <button 
                onClick={() => setIsAvatarOpen(!isAvatarOpen)}
                className="w-9 h-9 rounded-full border-2 border-purple-500 overflow-hidden hover:opacity-80 transition-opacity"
              >
                <div 
                  className="w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${currentUser.avatarUrl})` }}
                />
              </button>
              
              {/* Avatar Dropdown Menu */}
              {isAvatarOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                  <div className="p-3 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-full border-2 border-purple-500 bg-cover bg-center flex-shrink-0"
                        style={{ backgroundImage: `url(${currentUser.avatarUrl})` }}
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {currentUser.userName}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {currentUser.email}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="py-1">
                    <Link
                      to={`/user/${currentUser.id}`}
                      onClick={() => setIsAvatarOpen(false)}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <User size={18} className="text-gray-500" />
                      <span>Trang cá nhân</span>
                    </Link>
                  <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                    <Settings size={18} className="text-gray-500" />
                    <span>Cài đặt</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                    <HelpCircle size={18} className="text-gray-500" />
                    <span>Trợ giúp</span>
                  </button>
                    <div className="border-t border-gray-200 my-1"></div>
                    <button 
                      onClick={() => {
                        logout();
                        setIsAvatarOpen(false);
                        navigate('/');
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={18} />
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default SocialHeader;


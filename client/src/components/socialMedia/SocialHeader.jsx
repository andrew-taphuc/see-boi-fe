import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Bell, Search, Sparkles, Settings, LogOut, User, HelpCircle } from 'lucide-react';

// Logo SVG quả cầu xem bói
const CrystalBallLogo = () => {
  return (
    <svg 
      width="40" 
      height="40" 
      viewBox="0 0 40 40" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className="drop-shadow-lg"
    >
      {/* Quả cầu với gradient */}
      <defs>
        <linearGradient id="ballGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#9333EA" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#7C3AED" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#6D28D9" stopOpacity="1" />
        </linearGradient>
        <linearGradient id="shineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="innerGlow" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#A855F7" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#9333EA" stopOpacity="0" />
        </radialGradient>
      </defs>
      
      {/* Quả cầu chính */}
      <circle cx="20" cy="20" r="16" fill="url(#ballGradient)" />
      
      {/* Ánh sáng bên trong */}
      <ellipse cx="20" cy="20" rx="10" ry="8" fill="url(#innerGlow)" />
      
      {/* Độ sáng bề mặt */}
      <ellipse cx="14" cy="14" rx="6" ry="4" fill="url(#shineGradient)" />
      
      {/* Các ngôi sao nhỏ */}
      <circle cx="12" cy="12" r="1" fill="#FBBF24" opacity="0.8" />
      <circle cx="28" cy="16" r="0.8" fill="#FBBF24" opacity="0.7" />
      <circle cx="16" cy="28" r="0.9" fill="#FBBF24" opacity="0.6" />
      
      {/* Đế quả cầu */}
      <ellipse cx="20" cy="34" rx="12" ry="3" fill="#4B5563" opacity="0.6" />
      <ellipse cx="20" cy="33" rx="10" ry="2" fill="#6B7280" opacity="0.4" />
    </svg>
  );
};

const SocialHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
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
        {/* Left: Logo, Brand Name & Search */}
        <div className="flex items-center gap-4 flex-1">
          <Link 
            to="/" 
            className="flex items-center gap-2 hover:opacity-80 transition-opacity flex-shrink-0"
          >
            <CrystalBallLogo />
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              See Bói
            </span>
          </Link>
          
          {/* Modern Search Box */}
          <div className={`relative flex items-center transition-all duration-300 ${
            isSearchFocused ? 'flex-1 max-w-md' : 'w-64'
          }`}>
            <div className={`relative w-full flex items-center rounded-full border-2 transition-all duration-300 ${
              isSearchFocused 
                ? 'border-purple-500 bg-purple-50 shadow-lg' 
                : 'border-gray-200 bg-gray-50 hover:border-purple-300'
            }`}>
              <div className="absolute left-4 flex items-center">
                <Search 
                  size={18} 
                  className={`transition-colors ${
                    isSearchFocused ? 'text-purple-600' : 'text-gray-400'
                  }`} 
                />
              </div>
              <input
                type="text"
                placeholder="Tìm kiếm bài viết, người dùng..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className="w-full pl-12 pr-4 py-2.5 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400 rounded-full"
              />
              {searchValue && (
                <button
                  onClick={() => setSearchValue('')}
                  className="absolute right-3 p-1 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <span className="text-gray-400 text-xs">✕</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Center: 3 Navigation Buttons */}
        <nav className="flex items-center gap-1 absolute left-1/2 transform -translate-x-1/2">
          <Link
            to="/tuvi"
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              location.pathname === '/tuvi'
                ? 'bg-purple-100 text-purple-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Tử Vi
          </Link>
          <Link
            to="/tarot"
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              location.pathname === '/tarot'
                ? 'bg-purple-100 text-purple-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Tarot
          </Link>
          <Link
            to="/nhantuong"
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              location.pathname === '/nhantuong'
                ? 'bg-purple-100 text-purple-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Nhân Tướng
          </Link>
        </nav>

        {/* Right: Notification & Avatar */}
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
          <div className="relative" ref={avatarRef}>
            <button 
              onClick={() => setIsAvatarOpen(!isAvatarOpen)}
              className="w-9 h-9 rounded-full border-2 border-purple-500 overflow-hidden hover:opacity-80 transition-opacity"
            >
              <img 
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTG3lfMOpNq0uh7wbVh3ER14gQdTt_ydu1zfQ&s" 
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </button>
            
            {/* Avatar Dropdown Menu */}
            {isAvatarOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                <div className="p-3 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <img 
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTG3lfMOpNq0uh7wbVh3ER14gQdTt_ydu1zfQ&s" 
                      alt="Avatar"
                      className="w-10 h-10 rounded-full border-2 border-purple-500 object-cover"
                    />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Người dùng</p>
                      <p className="text-xs text-gray-500">user@example.com</p>
                    </div>
                  </div>
                </div>
                <div className="py-1">
                  <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                    <User size={18} className="text-gray-500" />
                    <span>Trang cá nhân</span>
                  </button>
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
                    onClick={() => navigate('/login')}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={18} />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default SocialHeader;


import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@context/AuthContext';
import { ChevronDown, User, Check } from 'lucide-react';
import usersData from '@/data/users.json';

const UserSwitcher = () => {
  // Feature này dùng dữ liệu mock users.json (user ảo). Hiện tại đã bỏ mock auth,
  // nên giữ component ở trạng thái tắt để tránh crash nếu còn import đâu đó.
  const { currentUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleUserSelect = (user) => {
    // no-op
    setIsOpen(false);
  };

  if (!currentUser) return null;
  return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
      >
        <div 
          className="w-6 h-6 rounded-full bg-cover bg-center border border-gray-300"
          style={{ backgroundImage: `url(${currentUser.avatarUrl})` }}
        />
        <span className="text-sm font-medium text-gray-700 max-w-[120px] truncate">
          {currentUser.userName}
        </span>
        <ChevronDown size={16} className="text-gray-500" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
          <div className="p-3 border-b border-gray-200">
            <p className="text-xs font-semibold text-gray-500 uppercase">Chuyển đổi tài khoản</p>
          </div>
          <div className="py-1 max-h-80 overflow-y-auto">
            {usersData.map((user) => (
              <button
                key={user.id}
                onClick={() => handleUserSelect(user)}
                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors ${
                  currentUser.id === user.id ? 'bg-blue-50' : ''
                }`}
              >
                <div 
                  className="w-10 h-10 rounded-full bg-cover bg-center border-2 border-gray-300 flex-shrink-0"
                  style={{ 
                    backgroundImage: `url(${user.avatarUrl})`,
                    borderColor: currentUser.id === user.id ? '#3b82f6' : '#d1d5db'
                  }}
                />
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {user.userName}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user.email}
                  </p>
                </div>
                {currentUser.id === user.id && (
                  <Check size={18} className="text-blue-500 flex-shrink-0" />
                )}
              </button>
            ))}
          </div>
          <div className="p-3 border-t border-gray-200 bg-gray-50">
            <p className="text-xs text-gray-500 text-center">
              Chọn tài khoản để xem profile
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserSwitcher;



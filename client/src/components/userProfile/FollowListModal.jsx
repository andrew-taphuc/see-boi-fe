import React, { useState, useEffect } from 'react';
import { X, Loader2, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import axiosInstance from '@utils/axiosInstance';

/**
 * Component modal hiển thị danh sách followers và following với tabs
 * @param {Object} props
 * @param {boolean} props.isOpen - Modal có đang mở không
 * @param {Function} props.onClose - Callback khi đóng modal
 * @param {number} props.userId - ID của user
 * @param {string} props.initialTab - Tab mặc định khi mở: 'followers' hoặc 'following'
 */
const FollowListModal = ({ isOpen, onClose, userId, initialTab = 'followers' }) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Reset về initialTab khi modal mở lại
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  useEffect(() => {
    if (!isOpen || !userId) {
      setUsers([]);
      setError('');
      return;
    }

    const loadList = async () => {
      setIsLoading(true);
      setError('');
      try {
        const endpoint = activeTab === 'followers' 
          ? `/user/${userId}/followers`
          : `/user/${userId}/following`;
        
        const response = await axiosInstance.get(endpoint);
        setUsers(response.data || []);
      } catch (err) {
        const status = err?.response?.status;
        if (status === 404) {
          setError('Không tìm thấy người dùng');
        } else {
          setError(
            err?.response?.data?.message || 
            'Không thể tải danh sách. Vui lòng thử lại.'
          );
        }
        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadList();
  }, [isOpen, userId, activeTab]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md h-[600px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-2xl font-bold text-gray-900">
            Người dùng
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 flex-shrink-0">
          <button
            onClick={() => setActiveTab('followers')}
            className={`flex-1 px-4 py-3 text-center font-medium transition-colors ${
              activeTab === 'followers'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Người theo dõi
          </button>
          <button
            onClick={() => setActiveTab('following')}
            className={`flex-1 px-4 py-3 text-center font-medium transition-colors ${
              activeTab === 'following'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Đang theo dõi
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4 min-h-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-2 text-gray-600">
                <Loader2 className="animate-spin" size={20} />
                <span>Đang tải...</span>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600">{error}</p>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12">
              <User size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">
                {activeTab === 'followers' 
                  ? 'Chưa có người theo dõi' 
                  : 'Chưa theo dõi ai'}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {users.map((user) => (
                <Link
                  key={user.id}
                  to={`/user/${user.id}`}
                  onClick={onClose}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {/* Avatar */}
                  <div
                    className="w-12 h-12 rounded-full border-2 border-blue-500 bg-cover bg-center flex-shrink-0"
                    style={{ backgroundImage: `url(${user.avatarUrl || ''})` }}
                  />
                  
                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">
                      {user.fullName || user.userName}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      @{user.userName}
                    </p>
                    {user.bio && (
                      <p className="text-xs text-gray-400 truncate mt-1">
                        {user.bio}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FollowListModal;


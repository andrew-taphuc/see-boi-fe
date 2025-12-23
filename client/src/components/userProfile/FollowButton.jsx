import React, { useState, useEffect } from 'react';
import { UserPlus, Check, Loader2 } from 'lucide-react';
import axiosInstance from '@utils/axiosInstance';
import { useAuth } from '@context/AuthContext';

/**
 * Component nút theo dõi/bỏ theo dõi người dùng
 * @param {Object} props
 * @param {number} props.userId - ID của user muốn follow/unfollow
 * @param {boolean} props.initialIsFollowing - Trạng thái follow ban đầu (từ API)
 * @param {Function} props.onFollowChange - Callback khi follow status thay đổi (optional)
 * @param {string} props.size - Size của button: 'sm' | 'md' | 'lg' (default: 'md')
 * @param {boolean} props.showIcon - Hiển thị icon hay không (default: true)
 */
const FollowButton = ({ 
  userId, 
  initialIsFollowing = false,
  onFollowChange,
  size = 'md',
  showIcon = true 
}) => {
  const { currentUser } = useAuth();
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Sync với initialIsFollowing khi prop thay đổi
  useEffect(() => {
    setIsFollowing(initialIsFollowing);
  }, [initialIsFollowing]);

  // Không hiển thị nếu là chính mình hoặc chưa có userId
  if (!userId || !currentUser || currentUser.id === userId) {
    return null;
  }

  const handleFollow = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    setError('');
    
    // Optimistic update
    const previousState = isFollowing;
    setIsFollowing(!previousState);

    try {
      if (previousState) {
        // Unfollow
        await axiosInstance.post(`/user/${userId}/unfollow`);
        console.log('Đã bỏ theo dõi');
      } else {
        // Follow
        await axiosInstance.post(`/user/${userId}/follow`);
        console.log('Đã theo dõi');
      }

      // Callback để parent component update state
      onFollowChange?.(!previousState);
    } catch (err) {
      // Revert optimistic update nếu lỗi
      setIsFollowing(previousState);
      
      const status = err?.response?.status;
      let errorMessage = '';
      
      if (status === 400) {
        // Nếu lỗi 400 khi follow, có thể là đã follow rồi - cần reload status
        if (!previousState) {
          // Đang cố follow nhưng bị lỗi 400 -> có thể đã follow rồi, reload status bằng API mới
          try {
            const isFollowingRes = await axiosInstance.get(`/user/${userId}/is-following`);
            if (isFollowingRes?.data?.isFollowing) {
              setIsFollowing(true);
              onFollowChange?.(true);
              errorMessage = 'Bạn đã theo dõi người này rồi';
            } else {
              errorMessage = 'Bạn đã theo dõi người này rồi hoặc không thể tự theo dõi chính mình';
            }
          } catch (reloadErr) {
            errorMessage = 'Bạn đã theo dõi người này rồi hoặc không thể tự theo dõi chính mình';
          }
        } else {
          errorMessage = 'Không thể bỏ theo dõi';
        }
      } else if (status === 401) {
        errorMessage = 'Vui lòng đăng nhập';
      } else if (status === 404) {
        errorMessage = previousState 
          ? 'Không tìm thấy người dùng hoặc chưa theo dõi' 
          : 'Không tìm thấy người dùng';
      } else {
        errorMessage = previousState 
          ? 'Không thể bỏ theo dõi. Vui lòng thử lại' 
          : 'Không thể theo dõi. Vui lòng thử lại';
      }
      
      setError(errorMessage);
      console.error('Follow error:', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Size classes
  const sizeClasses = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };

  const iconSize = {
    sm: 16,
    md: 18,
    lg: 20
  };

  return (
    <>
      <button
        onClick={handleFollow}
        disabled={isLoading}
        className={`flex items-center gap-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
          isFollowing
            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            : 'bg-blue-500 text-white hover:bg-blue-600'
        } ${sizeClasses[size]}`}
      >
        {isLoading ? (
          <>
            <Loader2 className="animate-spin" size={iconSize[size]} />
            <span>Đang xử lý...</span>
          </>
        ) : (
          <>
            {showIcon && (
              isFollowing ? (
                <Check size={iconSize[size]} />
              ) : (
                <UserPlus size={iconSize[size]} />
              )
            )}
            <span>{isFollowing ? 'Đang theo dõi' : 'Theo dõi'}</span>
          </>
        )}
      </button>
      {error && (
        <div className="mt-2 text-sm text-red-600">
          {error}
        </div>
      )}
    </>
  );
};

export default FollowButton;


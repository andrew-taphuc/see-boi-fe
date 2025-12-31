import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ChevronLeft, UserPlus, Check } from 'lucide-react';
import axiosInstance from '@utils/axiosInstance';
import { useAuth } from '@context/AuthContext';

const SuggestUser = () => {
  const { currentUser } = useAuth();
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [slideDirection, setSlideDirection] = useState('right');

  useEffect(() => {
    loadSuggestedUsers();
  }, []);

  const loadSuggestedUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get('/user/me/suggested-friends', {
        params: {
          limit: 10,
        },
      });
      const users = response.data || [];
      setSuggestedUsers(users);
      setCurrentIndex(0);
    } catch (err) {
      console.error('Error loading suggested users:', err);
      setError('Không thể tải gợi ý người dùng');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < suggestedUsers.length - 1) {
      setSlideDirection('right');
      setCurrentIndex(currentIndex + 1);
      setIsFollowing(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setSlideDirection('left');
      setCurrentIndex(currentIndex - 1);
      setIsFollowing(false);
    }
  };

  const handleFollow = async () => {
    if (isProcessing || !suggestedUsers[currentIndex]) return;

    setIsProcessing(true);
    try {
      const userId = suggestedUsers[currentIndex].id;
      await axiosInstance.post(`/user/${userId}/follow`);
      setIsFollowing(true);
      
      // Tự động chuyển sang người tiếp theo sau 1 giây
      setTimeout(() => {
        handleNext();
        setIsFollowing(false);
      }, 1000);
    } catch (err) {
      console.error('Error following user:', err);
      alert('Không thể theo dõi người dùng này');
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-4 shadow-sm mt-4 mb-24">
        <h3 className="font-semibold text-gray-900 mb-3 text-sm">Gợi ý cho bạn</h3>
        <div className="animate-pulse space-y-4">
          <div className="h-24 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl p-4 shadow-sm mt-4 mb-24">
        <h3 className="font-semibold text-gray-900 mb-3 text-sm">Gợi ý cho bạn</h3>
        <p className="text-red-500 text-sm">{error}</p>
        <button
          onClick={loadSuggestedUsers}
          className="mt-2 text-sm text-blue-600 hover:text-blue-700"
        >
          Thử lại
        </button>
      </div>
    );
  }

  if (suggestedUsers.length === 0) {
    return (
      <div className="bg-white rounded-xl p-4 shadow-sm mt-4 mb-24">
        <h3 className="font-semibold text-gray-900 mb-3 text-sm">Gợi ý cho bạn</h3>
        <p className="text-gray-500 text-sm">Không có gợi ý người dùng</p>
      </div>
    );
  }

  const currentUserData = suggestedUsers[currentIndex];
  if (!currentUserData) {
    return (
      <div className="bg-white rounded-xl p-4 shadow-sm mt-4 mb-24">
        <h3 className="font-semibold text-gray-900 mb-3 text-sm">Gợi ý cho bạn</h3>
        <p className="text-gray-500 text-sm">Đã xem hết gợi ý</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm mt-4 mb-24">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-900 text-sm">Gợi ý cho bạn</h3>
        <span className="text-xs text-gray-500">
          {currentIndex + 1} / {suggestedUsers.length}
        </span>
      </div>

      {/* User Card with Navigation Arrows */}
      <div className="relative border border-gray-200 rounded-lg p-3 overflow-hidden">
        {/* Left Arrow */}
        <button
          onClick={handlePrevious}
          className={`absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center bg-white border border-gray-300 rounded-full shadow-md hover:bg-gray-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed ${
            slideDirection === 'left' ? 'animate-pulse' : ''
          }`}
          disabled={isProcessing || currentIndex === 0}
        >
          <ChevronLeft size={18} className="text-gray-700" />
        </button>

        {/* Right Arrow */}
        <button
          onClick={handleNext}
          className={`absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center bg-white border border-gray-300 rounded-full shadow-md hover:bg-gray-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed ${
            slideDirection === 'right' ? 'animate-pulse' : ''
          }`}
          disabled={isProcessing || currentIndex >= suggestedUsers.length - 1}
        >
          <ChevronRight size={18} className="text-gray-700" />
        </button>

        {/* User Content with Slide Animation */}
        <div
          key={currentIndex}
          className={`transition-all duration-300 ease-in-out ${
            slideDirection === 'right'
              ? 'animate-slide-in-right'
              : 'animate-slide-in-left'
          }`}
        >
          <Link
            to={`/user/${currentUserData.id}`}
            className="block mb-3 hover:opacity-90 transition-opacity"
          >
            <div className="flex flex-col items-center text-center px-6">
              {/* Avatar */}
              <img
                src={
                  currentUserData.avatarUrl ||
                  `https://ui-avatars.com/api/?name=${currentUserData.userName || 'User'}&background=4267B2&color=fff`
                }
                alt={currentUserData.fullName || currentUserData.userName}
                className="w-16 h-16 rounded-full object-cover border-2 border-blue-500 mb-2"
              />

              {/* Name */}
              <h4 className="font-semibold text-gray-900 mb-0.5 text-sm">
                {currentUserData.fullName || currentUserData.userName || 'Người dùng'}
              </h4>

              {/* Username */}
              <p className="text-xs text-gray-500 mb-1.5">
                @{currentUserData.userName}
              </p>

              {/* Bio */}
              {currentUserData.bio && (
                <p className="text-xs text-gray-600 mb-2 line-clamp-1">
                  {currentUserData.bio}
                </p>
              )}

              {/* Level Badge */}
              <div className="flex items-center gap-1.5 px-2 py-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-2">
                <svg
                  className="w-2.5 h-2.5 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-white font-bold text-[10px]">
                  Level {currentUserData.level ?? 1}
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleFollow}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-300 transform ${
              isFollowing
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md shadow-green-500/30 cursor-default'
                : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-md shadow-blue-600/30 hover:shadow-lg hover:shadow-blue-600/40 hover:scale-105 active:scale-95'
            } disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-md`}
            disabled={isProcessing || isFollowing}
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Đang xử lý...</span>
              </>
            ) : isFollowing ? (
              <>
                <Check size={16} className="stroke-[3]" />
                <span>Đã theo dõi</span>
              </>
            ) : (
              <>
                <UserPlus size={16} />
                <span>Theo dõi</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuggestUser;


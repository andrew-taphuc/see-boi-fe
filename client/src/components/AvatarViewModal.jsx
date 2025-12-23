import React, { useEffect } from 'react';
import { X } from 'lucide-react';

/**
 * Component Modal để xem ảnh đại diện fullscreen
 * Props:
 * - isOpen: boolean - Trạng thái mở/đóng modal
 * - onClose: function - Callback khi đóng modal
 * - avatarUrl: string - URL ảnh đại diện
 * - userName: string - Tên người dùng (optional)
 */
const AvatarViewModal = ({ isOpen, onClose, avatarUrl, userName }) => {
  // Xử lý phím ESC để đóng modal
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    // Đóng modal khi click vào overlay (ngoài vùng ảnh)
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
      onClick={handleOverlayClick}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 text-white hover:text-gray-300 transition-colors p-2 rounded-full hover:bg-white/10"
      >
        <X size={32} />
      </button>

      {/* Image Container */}
      <div 
        className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center"
        onClick={(e) => e.stopPropagation()} // Ngăn event bubble lên overlay
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={userName ? `Ảnh đại diện của ${userName}` : 'Ảnh đại diện'}
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()} // Ngăn đóng modal khi click vào ảnh
          />
        ) : (
          <div className="w-64 h-64 rounded-full bg-gray-700 flex items-center justify-center">
            <span className="text-white text-lg">Không có ảnh đại diện</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AvatarViewModal;


import { Camera, Eye } from 'lucide-react';

/**
 * Component Menu dropdown cho avatar
 */
const AvatarMenu = ({ 
  isOpen, 
  onClose, 
  onUploadClick, 
  onViewClick 
}) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop để đóng menu khi click ra ngoài */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
      />
      {/* Menu */}
      <div className="absolute top-full left-0 mt-2 z-50 bg-white rounded-lg shadow-lg border border-gray-200 min-w-[180px] overflow-hidden">
        <button
          onClick={() => {
            onClose();
            onUploadClick();
          }}
          className="w-full px-4 py-3 text-left hover:bg-gray-100 transition-colors flex items-center gap-2 text-gray-700"
        >
          <Camera size={18} />
          <span>Thay ảnh đại diện</span>
        </button>
        <button
          onClick={() => {
            onClose();
            onViewClick();
          }}
          className="w-full px-4 py-3 text-left hover:bg-gray-100 transition-colors flex items-center gap-2 text-gray-700 border-t border-gray-200"
        >
          <Eye size={18} />
          <span>Xem ảnh đại diện</span>
        </button>
      </div>
    </>
  );
};

export default AvatarMenu;


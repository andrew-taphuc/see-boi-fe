import { Loader2, Image as ImageIcon } from 'lucide-react';

/**
 * Component hiển thị preview avatar
 */
const AvatarPreview = ({ previewUrl, currentAvatarUrl, isLoadingUrl }) => {
  return (
    <div className="relative">
      <div className="w-48 h-48 rounded-full border-4 border-blue-500 bg-cover bg-center overflow-hidden">
        {isLoadingUrl ? (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <Loader2 className="animate-spin text-blue-500" size={32} />
          </div>
        ) : previewUrl ? (
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-full object-cover"
          />
        ) : currentAvatarUrl ? (
          <img
            src={currentAvatarUrl}
            alt="Avatar hiện tại"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <ImageIcon size={48} className="text-gray-400" />
          </div>
        )}
      </div>
    </div>
  );
};

export default AvatarPreview;


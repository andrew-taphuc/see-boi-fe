import React, { useRef } from 'react';
import { Image, X, Upload } from 'lucide-react';

/**
 * Component upload ảnh đại diện cho bài viết
 * Props:
 * - imageUrl?: string (URL của ảnh đã upload hoặc preview)
 * - onImageChange?: (file: File | null) => void
 * - onImageRemove?: () => void
 */
const ImageUpload = ({ imageUrl, onImageChange, onImageRemove }) => {
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Vui lòng chọn file ảnh');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Kích thước ảnh không được vượt quá 5MB');
        return;
      }

      onImageChange?.(file);
    }
  };

  const handleRemove = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onImageRemove?.();
  };

  return (
    <div className="mb-3">
      {imageUrl ? (
        <div className="relative group">
          <img
            src={imageUrl}
            alt="Preview"
            className="w-full h-auto rounded-lg object-cover max-h-96"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
            title="Xóa ảnh"
          >
            <X size={18} />
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload size={24} className="text-gray-400 mb-2" />
            <p className="text-sm text-gray-500">
              <span className="font-semibold">Click để upload</span> hoặc kéo thả ảnh vào đây
            </p>
            <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF tối đa 5MB</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </label>
      )}
    </div>
  );
};

export default ImageUpload;


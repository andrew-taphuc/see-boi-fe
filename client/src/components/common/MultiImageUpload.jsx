import React, { useRef } from "react";
import { Image, X } from "lucide-react";

/**
 * Component upload nhiều ảnh (tối đa 10 ảnh)
 * Props:
 * - images: Array<File> - Mảng các file ảnh
 * - onImagesChange: (files: Array<File>) => void
 * - maxImages: number - Số lượng ảnh tối đa (default: 10)
 * - showIconOnly: boolean - Chỉ hiển thị icon (cho comment)
 */
const MultiImageUpload = ({
  images = [],
  onImagesChange,
  maxImages = 10,
  showIconOnly = false,
}) => {
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);

    if (files.length === 0) return;

    // Validate số lượng
    const totalImages = images.length + files.length;
    if (totalImages > maxImages) {
      alert(`Bạn chỉ có thể upload tối đa ${maxImages} ảnh`);
      return;
    }

    // Validate từng file
    const validFiles = [];
    for (const file of files) {
      // Kiểm tra loại file
      if (!file.type.startsWith("image/")) {
        alert(`File "${file.name}" không phải là ảnh`);
        continue;
      }

      // Kiểm tra kích thước (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert(`File "${file.name}" vượt quá 5MB`);
        continue;
      }

      validFiles.push(file);
    }

    if (validFiles.length > 0) {
      onImagesChange([...images, ...validFiles]);
    }

    // Reset input để có thể chọn lại cùng file
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const handleClickInput = () => {
    fileInputRef.current?.click();
  };

  // Mode chỉ hiển thị icon (cho comment)
  if (showIconOnly) {
    return (
      <div className="relative">
        <button
          type="button"
          onClick={handleClickInput}
          className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
          title="Thêm ảnh"
          disabled={images.length >= maxImages}
        >
          <Image size={20} />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Hiển thị số ảnh đã chọn */}
        {images.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {images.length}
          </span>
        )}
      </div>
    );
  }

  // Mode hiển thị đầy đủ (cho post)
  return (
    <div className="mb-3">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Hiển thị preview các ảnh đã chọn */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
          {images.map((file, index) => {
            const previewUrl = URL.createObjectURL(file);
            return (
              <div key={index} className="relative group">
                <img
                  src={previewUrl}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                  onLoad={() => URL.revokeObjectURL(previewUrl)}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-1 right-1 p-1 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
                  title="Xóa ảnh"
                >
                  <X size={16} />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Button thêm ảnh */}
      {images.length < maxImages && (
        <button
          type="button"
          onClick={handleClickInput}
          className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-sm text-gray-600 hover:text-blue-600"
        >
          <Image size={18} />
          <span>
            Thêm ảnh ({images.length}/{maxImages})
          </span>
        </button>
      )}
    </div>
  );
};

export default MultiImageUpload;

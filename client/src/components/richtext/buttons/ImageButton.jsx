import React, { useRef } from 'react';
import { Image as ImageIcon } from 'lucide-react';

/**
 * Image button component cho Tiptap toolbar
 * Props:
 * - editor: Tiptap editor instance
 * - onClose?: () => void
 */
const ImageButton = ({ editor, onClose }) => {
  const fileInputRef = useRef(null);

  if (!editor) return null;

  const handleImageSelect = (file) => {
    if (!file || !file.type.startsWith('image/')) {
      alert('Vui lòng chọn file ảnh');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Kích thước ảnh không được vượt quá 5MB');
      return;
    }

    // Tạo data URL để preview (chỉ UI, chưa upload)
    const reader = new FileReader();
    reader.onloadend = () => {
      try {
        const dataUrl = reader.result;
        if (!dataUrl || typeof dataUrl !== 'string') {
          throw new Error('Invalid data URL');
        }
        // Insert ảnh vào editor tại vị trí cursor với data URL
        editor.chain().focus().setImage({ src: dataUrl }).run();
        onClose?.();
      } catch (error) {
        console.error('Error inserting image:', error);
        alert('Chèn ảnh thất bại. Vui lòng thử lại.');
      }
    };
    reader.onerror = () => {
      alert('Đọc file ảnh thất bại. Vui lòng thử lại.');
    };
    reader.readAsDataURL(file);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageSelect(file);
    }
    // Reset input để có thể chọn lại cùng file
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
        }}
        onClick={() => {
          fileInputRef.current?.click();
        }}
        className="p-2 rounded hover:bg-gray-100 transition-colors text-gray-700"
        title="Thêm ảnh"
      >
        <ImageIcon size={18} />
      </button>
    </>
  );
};

export default ImageButton;


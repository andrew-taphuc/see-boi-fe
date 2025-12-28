import React, { useRef, useState } from 'react';
import { Image as ImageIcon, Loader2 } from 'lucide-react';
import axiosInstance from '@utils/axiosInstance';

/**
 * Image button component cho Tiptap toolbar
 * Props:
 * - editor: Tiptap editor instance
 * - onClose?: () => void
 */
const ImageButton = ({ editor, onClose }) => {
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);

  if (!editor) return null;

  const handleImageSelect = async (file) => {
    if (!file || !file.type.startsWith('image/')) {
      alert('Vui lòng chọn file ảnh');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Kích thước ảnh không được vượt quá 5MB');
      return;
    }

    setIsUploading(true);

    try {
      // Lưu vị trí cursor hiện tại
      const { state } = editor;
      const { selection } = state;
      const insertPos = selection.$anchor.pos;

      // Tạo data URL để preview tạm thời
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const dataUrl = reader.result;
          if (!dataUrl || typeof dataUrl !== 'string') {
            throw new Error('Invalid data URL');
          }
          
          // Insert ảnh với data URL tạm thời để preview
          editor.chain().focus().setImage({ src: dataUrl }).run();

          // Upload ảnh lên server
          const formData = new FormData();
          formData.append('file', file);

          const response = await axiosInstance.post('/upload/image', formData);
          const imageUrl = response.data?.url || response.data?.imageUrl || response.data;

          if (!imageUrl || typeof imageUrl !== 'string') {
            throw new Error('Không nhận được link ảnh từ server');
          }

          // Tìm node ảnh vừa chèn tại vị trí insertPos
          const currentState = editor.state;
          const { doc } = currentState;
          let imagePos = null;

          // Tìm node ảnh gần vị trí insertPos nhất
          doc.descendants((node, pos) => {
            if (node.type.name === 'image' && node.attrs.src === dataUrl) {
              // Tìm node gần vị trí insertPos nhất
              if (imagePos === null || Math.abs(pos - insertPos) < Math.abs(imagePos - insertPos)) {
                imagePos = pos;
              }
            }
          });

          if (imagePos !== null) {
            // Cập nhật src của ảnh với link thật
            editor.commands.setNodeSelection(imagePos);
            editor.chain().setImage({ src: imageUrl }).run();
          }

          onClose?.();
        } catch (error) {
          console.error('Error uploading image:', error);
          
          // Xóa ảnh đã chèn nếu upload thất bại
          const currentState = editor.state;
          const { doc } = currentState;
          let imagePosToDelete = null;

          // Tìm node ảnh có data URL gần vị trí insertPos nhất
          doc.descendants((node, pos) => {
            if (node.type.name === 'image' && node.attrs.src && node.attrs.src.startsWith('data:')) {
              if (imagePosToDelete === null || Math.abs(pos - insertPos) < Math.abs(imagePosToDelete - insertPos)) {
                imagePosToDelete = pos;
              }
            }
          });

          if (imagePosToDelete !== null) {
            editor.commands.setNodeSelection(imagePosToDelete);
            editor.commands.deleteNode('image');
          }

          const errorMsg = error?.response?.data?.message || error?.message || 'Upload ảnh thất bại. Vui lòng thử lại.';
          alert(errorMsg);
        } finally {
          setIsUploading(false);
        }
      };
      reader.onerror = () => {
        setIsUploading(false);
        alert('Đọc file ảnh thất bại. Vui lòng thử lại.');
      };
      reader.readAsDataURL(file);
    } catch (error) {
      setIsUploading(false);
      console.error('Error handling image:', error);
      alert('Có lỗi xảy ra. Vui lòng thử lại.');
    }
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
          if (!isUploading) {
            fileInputRef.current?.click();
          }
        }}
        disabled={isUploading}
        className="p-2 rounded hover:bg-gray-100 transition-colors text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        title={isUploading ? "Đang upload ảnh..." : "Thêm ảnh"}
      >
        {isUploading ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <ImageIcon size={18} />
        )}
      </button>
    </>
  );
};

export default ImageButton;


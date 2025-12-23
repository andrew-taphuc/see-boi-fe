import React, { useState, useRef } from 'react';
import { X, Loader2 } from 'lucide-react';
import axiosInstance from '../utils/axiosInstance';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import UploadModeTabs from './avatarUpload/UploadModeTabs';
import AvatarPreview from './avatarUpload/AvatarPreview';
import FileUploadInput from './avatarUpload/FileUploadInput';
import UrlInput from './avatarUpload/UrlInput';

/**
 * Component Modal để upload ảnh đại diện
 * Props:
 * - isOpen: boolean - Trạng thái mở/đóng modal
 * - onClose: function - Callback khi đóng modal
 * - currentAvatarUrl: string - URL ảnh đại diện hiện tại
 * - onSuccess: function(updatedUser) - Callback khi upload thành công
 */
const AvatarUploadModal = ({ isOpen, onClose, currentAvatarUrl, onSuccess }) => {
  const { updateCurrentUser } = useAuth();
  const { success: showSuccess } = useToast();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [imageUrl, setImageUrl] = useState(''); // URL từ input
  const [uploadMode, setUploadMode] = useState('file'); // 'file' hoặc 'url'
  const [isUploading, setIsUploading] = useState(false);
  const [isLoadingUrl, setIsLoadingUrl] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  // Reset state khi modal đóng
  React.useEffect(() => {
    if (!isOpen) {
      setSelectedFile(null);
      setPreviewUrl(null);
      setImageUrl('');
      setUploadMode('file');
      setError('');
      setIsUploading(false);
      setIsLoadingUrl(false);
    }
  }, [isOpen]);


  // Xử lý khi nhập URL
  const handleUrlChange = async (e) => {
    const url = e.target.value.trim();
    setImageUrl(url);
    setError('');
    setSelectedFile(null);
    setPreviewUrl(null);

    if (!url) {
      return;
    }

    // Validate URL format - phải bắt đầu bằng http:// hoặc https://
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      setError('URL phải bắt đầu bằng http:// hoặc https://');
      return;
    }

    // Validate URL hợp lệ
    try {
      new URL(url);
    } catch {
      setError('URL không hợp lệ');
      return;
    }

    // Preview ảnh từ URL
    setIsLoadingUrl(true);
    try {
      // Test xem URL có load được không
      const img = new Image();
      img.crossOrigin = 'anonymous'; // Cho phép CORS nếu cần
      
      await new Promise((resolve, reject) => {
        img.onload = () => {
          setPreviewUrl(url);
          setIsLoadingUrl(false);
          resolve();
        };
        img.onerror = () => {
          setError('Không thể tải ảnh từ URL này. Vui lòng kiểm tra lại.');
          setIsLoadingUrl(false);
          reject(new Error('Failed to load image'));
        };
        img.src = url;
      });
    } catch (err) {
      console.error('Lỗi preview ảnh từ URL:', err);
      if (!error) {
        setError('Không thể tải ảnh từ URL này. Vui lòng kiểm tra lại.');
      }
      setIsLoadingUrl(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Kiểm tra loại file - chỉ chấp nhận JPG, JPEG, PNG
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type.toLowerCase())) {
      setError('Chỉ chấp nhận file ảnh định dạng JPG, JPEG hoặc PNG');
      return;
    }

    // Kiểm tra kích thước file (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setError('File ảnh quá lớn. Vui lòng chọn file nhỏ hơn 5MB');
      return;
    }

    setSelectedFile(file);
    setError('');

    // Tạo preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    setIsUploading(true);
    setError('');

    try {
      // Tạo FormData
      const formData = new FormData();

      // Xác định dữ liệu cần gửi
      if (uploadMode === 'file') {
        // Upload file từ máy tính
        if (!selectedFile) {
          setError('Vui lòng chọn ảnh đại diện');
          setIsUploading(false);
          return;
        }
        
        // Đảm bảo selectedFile là File object
        if (!(selectedFile instanceof File)) {
          setError('File không hợp lệ. Vui lòng chọn lại.');
          setIsUploading(false);
          return;
        }
        
        // Append file với field name 'avatarUrl'
        formData.append('avatarUrl', selectedFile, selectedFile.name); // File object với tên file
      } else {
        // Gửi URL string - backend sẽ tự download và upload lên Cloudinary
        if (!imageUrl) {
          setError('Vui lòng nhập URL ảnh');
          setIsUploading(false);
          return;
        }

        if (!previewUrl) {
          setError('Vui lòng đợi ảnh được tải xong');
          setIsUploading(false);
          return;
        }

        // Validate URL format một lần nữa trước khi gửi
        if (!imageUrl.startsWith('http://') && !imageUrl.startsWith('https://')) {
          setError('URL phải bắt đầu bằng http:// hoặc https://');
          setIsUploading(false);
          return;
        }

        // Gửi URL string trực tiếp
        formData.append('avatarUrl', imageUrl); // URL string
      }

      // Debug: Log FormData để kiểm tra
      console.log('FormData contents:');
      for (let [key, value] of formData.entries()) {
        console.log(key, value instanceof File ? `File: ${value.name} (${value.size} bytes)` : value);
      }

      // Gửi request với multipart/form-data
      // axiosInstance sẽ tự động xóa Content-Type header và set với boundary phù hợp
      const response = await axiosInstance.patch('/user/me', formData);

      const updatedUser = response.data;

      // Cập nhật context
      updateCurrentUser?.(updatedUser);

      // Hiển thị toast success
      showSuccess('Cập nhật ảnh đại diện thành công!');

      // Gọi callback success
      onSuccess?.(updatedUser);

      // Đóng modal
      onClose();
    } catch (err) {
      console.error('Lỗi upload avatar:', err);
      
      // Xử lý error theo status code
      if (err?.response?.status === 400) {
        // URL không hợp lệ hoặc lỗi validation
        setError(
          err?.response?.data?.message ||
          'URL không hợp lệ hoặc có lỗi validation. Vui lòng kiểm tra lại.'
        );
      } else if (err?.response?.status === 401) {
        // Chưa đăng nhập hoặc token không hợp lệ
        setError('Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      } else {
        // Lỗi khác
        const errorMessage =
          err?.response?.data?.message ||
          err?.message ||
          'Có lỗi xảy ra khi upload ảnh. Vui lòng thử lại.';
        setError(errorMessage);
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && !isUploading) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleOverlayClick}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" />

      {/* Modal Content */}
      <div className="relative z-10 w-full max-w-md bg-white rounded-lg shadow-xl animate-fade-in-up">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Cập nhật ảnh đại diện</h2>
          <button
            onClick={onClose}
            disabled={isUploading}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Preview Area */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Ảnh đại diện
            </label>
            
            {/* Tabs để chuyển đổi giữa upload file và nhập URL */}
            <UploadModeTabs
              uploadMode={uploadMode}
              onModeChange={(mode) => {
                setUploadMode(mode);
                setError('');
                if (mode === 'file') {
                  setImageUrl('');
                  if (uploadMode === 'url') {
                    setPreviewUrl(null);
                  }
                } else {
                  setSelectedFile(null);
                  if (uploadMode === 'file') {
                    setPreviewUrl(null);
                  }
                }
              }}
              disabled={isUploading}
            />

            <div className="flex flex-col items-center gap-4">
              {/* Preview hoặc ảnh hiện tại */}
              <AvatarPreview
                previewUrl={previewUrl}
                currentAvatarUrl={currentAvatarUrl}
                isLoadingUrl={isLoadingUrl}
              />

              {/* Upload File Mode */}
              {uploadMode === 'file' && (
                <FileUploadInput
                  fileInputRef={fileInputRef}
                  onFileSelect={handleFileSelect}
                  selectedFile={selectedFile}
                  disabled={isUploading}
                />
              )}

              {/* URL Input Mode */}
              {uploadMode === 'url' && (
                <UrlInput
                  imageUrl={imageUrl}
                  onUrlChange={handleUrlChange}
                  previewUrl={previewUrl}
                  isLoadingUrl={isLoadingUrl}
                  disabled={isUploading}
                />
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isUploading}
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Hủy
            </button>
            <button
              onClick={handleUpload}
              disabled={
                isUploading ||
                (uploadMode === 'file' && !selectedFile) ||
                (uploadMode === 'url' && (!imageUrl || !previewUrl || isLoadingUrl))
              }
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isUploading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  <span>Đang tải lên...</span>
                </>
              ) : (
                'Cập nhật'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvatarUploadModal;


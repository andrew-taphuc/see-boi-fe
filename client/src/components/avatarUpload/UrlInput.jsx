/**
 * Component input để nhập URL ảnh
 */
const UrlInput = ({ 
  imageUrl, 
  onUrlChange, 
  previewUrl, 
  isLoadingUrl, 
  disabled 
}) => {
  return (
    <div className="w-full">
      <input
        type="url"
        value={imageUrl}
        onChange={onUrlChange}
        placeholder="Nhập URL ảnh (ví dụ: https://example.com/image.jpg)"
        disabled={disabled || isLoadingUrl}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
      />
      {isLoadingUrl && (
        <p className="mt-2 text-xs text-blue-600 text-center">
          Đang tải ảnh...
        </p>
      )}
      {imageUrl && previewUrl && !isLoadingUrl && (
        <p className="mt-2 text-xs text-green-600 text-center">
          ✓ Ảnh đã sẵn sàng để upload
        </p>
      )}
    </div>
  );
};

export default UrlInput;


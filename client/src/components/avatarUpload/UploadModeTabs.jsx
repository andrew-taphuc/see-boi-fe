import { Upload, Link as LinkIcon } from 'lucide-react';

/**
 * Component Tab để chuyển đổi giữa upload file và nhập URL
 */
const UploadModeTabs = ({ uploadMode, onModeChange, disabled }) => {
  return (
    <div className="flex gap-2 mb-4 border-b border-gray-200">
      <button
        type="button"
        onClick={() => onModeChange('file')}
        className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
          uploadMode === 'file'
            ? 'border-blue-500 text-blue-600'
            : 'border-transparent text-gray-500 hover:text-gray-700'
        }`}
        disabled={disabled}
      >
        <div className="flex items-center gap-2">
          <Upload size={16} />
          <span>Upload ảnh</span>
        </div>
      </button>
      <button
        type="button"
        onClick={() => onModeChange('url')}
        className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
          uploadMode === 'url'
            ? 'border-blue-500 text-blue-600'
            : 'border-transparent text-gray-500 hover:text-gray-700'
        }`}
        disabled={disabled}
      >
        <div className="flex items-center gap-2">
          <LinkIcon size={16} />
          <span>Gắn link</span>
        </div>
      </button>
    </div>
  );
};

export default UploadModeTabs;


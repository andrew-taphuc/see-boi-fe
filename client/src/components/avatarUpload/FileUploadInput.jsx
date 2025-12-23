import { Upload } from 'lucide-react';

/**
 * Component input để upload file
 */
const FileUploadInput = ({ 
  fileInputRef, 
  onFileSelect, 
  selectedFile, 
  disabled 
}) => {
  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png"
        onChange={onFileSelect}
        disabled={disabled}
        className="hidden"
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={disabled}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Upload size={20} className="text-gray-600" />
        <span className="text-sm font-medium text-gray-700">
          {selectedFile ? 'Chọn ảnh khác' : 'Chọn ảnh đại diện'}
        </span>
      </button>
      {selectedFile && (
        <p className="mt-2 text-xs text-gray-500 text-center">
          {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
        </p>
      )}
    </div>
  );
};

export default FileUploadInput;


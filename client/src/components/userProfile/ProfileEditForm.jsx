import { Save, Loader2 } from 'lucide-react';

/**
 * Component Form edit profile
 */
const ProfileEditForm = ({
  editedFullName,
  onFullNameChange,
  editedBirthday,
  onBirthdayChange,
  editedGender,
  onGenderChange,
  editedBio,
  onBioChange,
  isSaving,
  onSave,
  onCancel,
}) => {
  return (
    <div className="mb-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Ngày sinh
          </label>
          <input
            type="date"
            value={editedBirthday}
            onChange={(e) => onBirthdayChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Giới tính
          </label>
          <select
            value={editedGender}
            onChange={(e) => onGenderChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
          >
            <option value="">Chưa chọn</option>
            <option value="MALE">Nam</option>
            <option value="FEMALE">Nữ</option>
            <option value="OTHER">Khác</option>
          </select>
        </div>
      </div>
      <textarea
        value={editedBio}
        onChange={(e) => onBioChange(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        rows="3"
        placeholder="Viết giới thiệu về bản thân..."
      />
      <div className="flex gap-2 mt-2">
        <button
          onClick={onSave}
          disabled={isSaving}
          className={`px-4 py-1 rounded-lg transition-colors text-sm flex items-center gap-2 ${
            isSaving ? 'bg-blue-400 text-white cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
          <span>Lưu</span>
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
        >
          Hủy
        </button>
      </div>
    </div>
  );
};

export default ProfileEditForm;


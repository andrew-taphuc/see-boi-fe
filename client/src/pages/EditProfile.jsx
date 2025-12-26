import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
import { Save, Loader2, ArrowLeft } from 'lucide-react';
import axiosInstance from '@utils/axiosInstance';
import { getDefaultAvatar } from '@constants/defaultAvatars';

/**
 * Trang cập nhật thông tin người dùng
 * Sử dụng API PATCH /user/me với multipart/form-data
 */
const EditProfile = () => {
  const navigate = useNavigate();
  const { currentUser, updateCurrentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    userName: '',
    email: '',
    birthday: '',
    gender: '',
    bio: '',
  });

  const [user, setUser] = useState(null);

  // Check if this is first-time setup (thiếu avatarUrl, birthday hoặc gender)
  const isFirstTimeSetup = useMemo(() => {
    return user && (!user.avatarUrl || !user.birthday || !user.gender);
  }, [user]);

  // Load user data
  useEffect(() => {
    const loadUserData = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await axiosInstance.get('/user/me');
        const userData = response.data;
        setUser(userData);
        
        // Set form data
        setFormData({
          fullName: userData.fullName || '',
          userName: userData.userName || '',
          email: userData.email || '',
          birthday: normalizeDateToInput(userData.birthday),
          gender: userData.gender || '',
          bio: userData.bio || '',
        });
      } catch (err) {
        console.error('Lỗi tải thông tin người dùng:', err);
        setError(
          err?.response?.data?.message ||
            'Không thể tải thông tin cá nhân. Vui lòng thử lại.'
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  const normalizeDateToInput = (value) => {
    if (!value) return '';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return '';
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error khi user bắt đầu nhập
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Nếu là lần đầu setup, bắt buộc điền đầy đủ (trừ bio)
    if (isFirstTimeSetup) {
      if (!formData.fullName?.trim()) {
        setError('Vui lòng nhập họ và tên');
        return;
      }
      if (!formData.birthday) {
        setError('Vui lòng chọn ngày sinh');
        return;
      }
      if (!formData.gender) {
        setError('Vui lòng chọn giới tính');
        return;
      }
    }

    // Validate email
    if (formData.email && !isValidEmail(formData.email)) {
      setError('Email không hợp lệ');
      return;
    }

    setIsSaving(true);

    try {
      // Tạo FormData
      const submitFormData = new FormData();

      // Thêm các trường bắt buộc hoặc có giá trị
      if (formData.fullName?.trim()) {
        submitFormData.append('fullName', formData.fullName.trim());
      }
      // userName và email không được thay đổi, chỉ gửi nếu có
      if (formData.userName?.trim()) {
        submitFormData.append('userName', formData.userName.trim());
      }
      if (formData.email?.trim()) {
        submitFormData.append('email', formData.email.trim());
      }
      if (formData.birthday) {
        submitFormData.append('birthday', formData.birthday);
      }
      if (formData.gender) {
        submitFormData.append('gender', formData.gender);
        // Nếu là lần đầu setup, gán avatarUrl dựa trên gender
        if (isFirstTimeSetup) {
          const defaultAvatarUrl = getDefaultAvatar(formData.gender);
          submitFormData.append('avatarUrl', defaultAvatarUrl);
        }
      }
      if (formData.bio?.trim()) {
        submitFormData.append('bio', formData.bio.trim());
      }

      // Gửi request với multipart/form-data
      // Không set Content-Type header, axios sẽ tự động set với boundary phù hợp
      const response = await axiosInstance.patch('/user/me', submitFormData);

      const updatedUser = response.data;
      setUser(updatedUser);
      updateCurrentUser?.(updatedUser);
      setSuccess('Cập nhật thông tin thành công!');
      
      // Nếu là lần đầu setup, redirect đến socialmedia sau 1.5 giây
      // Nếu không, redirect về profile sau 1.5 giây
      setTimeout(() => {
        if (isFirstTimeSetup) {
          navigate('/socialmedia');
        } else {
          navigate(`/user/${updatedUser.id}`);
        }
      }, 1500);
    } catch (err) {
      console.error('Lỗi cập nhật profile:', err);
      const errorMessage =
        err?.response?.data?.message ||
        (Array.isArray(err?.response?.data?.message)
          ? err.response.data.message.join(', ')
          : 'Có lỗi xảy ra khi cập nhật. Vui lòng thử lại.') ||
        'Có lỗi xảy ra khi cập nhật. Vui lòng thử lại.';
      setError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2 text-gray-600">
          <Loader2 className="animate-spin" size={18} />
          <span>Đang tải thông tin...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-6 flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <ArrowLeft size={24} className="text-gray-700" />
            </button>
            <h1 className="text-3xl font-bold text-gray-900">
              {isFirstTimeSetup ? 'Cập nhật thông tin cá nhân' : 'Chỉnh sửa thông tin cá nhân'}
            </h1>
          </div>

          {/* Messages */}
          {error && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              {success}
            </div>
          )}

          {/* Form Card */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <form onSubmit={handleSubmit} className="p-6">
              {/* Full Name */}
              <div className="mb-6">
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Họ và tên {isFirstTimeSetup && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required={isFirstTimeSetup}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập họ và tên"
                />
              </div>

              {/* Username */}
              <div className="mb-6">
                <label
                  htmlFor="userName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Tên người dùng
                </label>
                <input
                  type="text"
                  id="userName"
                  name="userName"
                  value={formData.userName}
                  onChange={handleInputChange}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                  placeholder="Nhập tên người dùng"
                />
              </div>

              {/* Email */}
              <div className="mb-6">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                  placeholder="Nhập email"
                />
              </div>

              {/* Birthday and Gender Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Birthday */}
                <div>
                  <label
                    htmlFor="birthday"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Ngày sinh {isFirstTimeSetup && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="date"
                    id="birthday"
                    name="birthday"
                    value={formData.birthday}
                    onChange={handleInputChange}
                    required={isFirstTimeSetup}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Gender */}
                <div>
                  <label
                    htmlFor="gender"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Giới tính {isFirstTimeSetup && <span className="text-red-500">*</span>}
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    required={isFirstTimeSetup}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="">Chưa chọn</option>
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>
              </div>

              {/* Bio */}
              <div className="mb-6">
                <label
                  htmlFor="bio"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Giới thiệu
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Viết giới thiệu về bản thân..."
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                {!isFirstTimeSetup && (
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Hủy
                  </button>
                )}
                <button
                  type="submit"
                  disabled={isSaving}
                  className={`${isFirstTimeSetup ? 'w-full' : 'flex-1'} px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      <span>Đang lưu...</span>
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      <span>{isFirstTimeSetup ? 'Hoàn tất' : 'Lưu thay đổi'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
      </div>
    
  );
};

export default EditProfile;


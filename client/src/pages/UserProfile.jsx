import React, { useMemo, useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Edit2, UserPlus, Check, Settings, Calendar, Users, Save, Loader2, PenSquare } from 'lucide-react';
import SocialHeader from '../components/socialMedia/SocialHeader';
import axiosInstance from '../utils/axiosInstance';

const UserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, updateCurrentUser } = useAuth();
  const [user, setUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedBio, setEditedBio] = useState('');
  const [editedFullName, setEditedFullName] = useState('');
  const [editedAvatarUrl, setEditedAvatarUrl] = useState('');
  const [editedBirthday, setEditedBirthday] = useState(''); // yyyy-MM-dd
  const [editedGender, setEditedGender] = useState(''); // MALE|FEMALE|OTHER|''
  const [isLoadingMe, setIsLoadingMe] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  const resolvedId = useMemo(() => (id ? parseInt(id) : null), [id]);
  const isOwnProfile = useMemo(() => {
    if (!currentUser || !resolvedId) return false;
    return currentUser.id === resolvedId;
  }, [currentUser, resolvedId]);

  const normalizeDateToInput = (value) => {
    if (!value) return '';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return '';
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const fetchPostsByUserId = async (userId) => {
    const res = await axiosInstance.get('/post');
    const all = Array.isArray(res.data) ? res.data : [];
    const filtered = all.filter((p) => {
      if (p?.userId != null) return Number(p.userId) === Number(userId);
      if (p?.user?.id != null) return Number(p.user.id) === Number(userId);
      return false;
    });
    filtered.sort((a, b) => new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0));
    return filtered;
  };

  useEffect(() => {
    let cancelled = false;

    const loadMe = async () => {
      setIsLoadingMe(true);
      setErrorMsg('');
      setSuccessMsg('');
      try {
        const res = await axiosInstance.get('/user/me');
        if (cancelled) return;
        const me = res.data;
        setUser(me);
        setEditedBio(me?.bio || '');
        setEditedFullName(me?.fullName || '');
        setEditedAvatarUrl(me?.avatarUrl || '');
        setEditedBirthday(normalizeDateToInput(me?.birthday));
        setEditedGender(me?.gender || '');

        // Sync ngay vào context/localStorage để header đổi avatar/name
        updateCurrentUser?.(me);

        const posts = await fetchPostsByUserId(me?.id);
        if (!cancelled) setUserPosts(posts);
      } catch (e) {
        if (cancelled) return;
        setErrorMsg(
          e?.response?.data?.message ||
            'Không thể tải thông tin cá nhân. Vui lòng thử lại.'
        );
      } finally {
        if (!cancelled) setIsLoadingMe(false);
      }
    };

    const loadUserById = async () => {
      const userId = parseInt(id);
      if (!userId || Number.isNaN(userId)) {
        setUser(null);
        return;
      }

      setIsLoadingMe(true);
      setErrorMsg('');
      setSuccessMsg('');
      try {
        const res = await axiosInstance.get(`/user/${userId}`);
        if (cancelled) return;
        const u = res.data;
        setUser(u);
        setEditedBio(u?.bio || '');
        setEditedFullName(u?.fullName || '');
        setEditedAvatarUrl(u?.avatarUrl || '');
        setEditedBirthday(normalizeDateToInput(u?.birthday));
        setEditedGender(u?.gender || '');

        const posts = await fetchPostsByUserId(u?.id);
        if (!cancelled) setUserPosts(posts);
      } catch (e) {
        if (cancelled) return;
        const status = e?.response?.status;
        if (status === 404) {
          setUser(null);
          setErrorMsg('Không tìm thấy người dùng');
        } else {
          setErrorMsg(
            e?.response?.data?.message ||
              'Không thể tải thông tin người dùng. Vui lòng thử lại.'
          );
        }
      } finally {
        if (!cancelled) setIsLoadingMe(false);
      }
    };

    if (isOwnProfile) {
      loadMe();
    } else {
      loadUserById();
    }

    return () => {
      cancelled = true;
    };
  }, [id, isOwnProfile, updateCurrentUser]);

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    // TODO: Implement follow logic khi có backend
  };

  const handleSaveEdit = async () => {
    setErrorMsg('');
    setSuccessMsg('');

    if (!isOwnProfile) return;

    setIsSaving(true);
    try {
      const payload = {
        fullName: editedFullName?.trim() || null,
        avatarUrl: editedAvatarUrl?.trim() || null,
        birthday: editedBirthday ? new Date(editedBirthday).toISOString() : null,
        gender: editedGender || null,
        bio: editedBio?.trim() || null,
      };

      const res = await axiosInstance.patch('/user/me', payload);
      const updated = res.data;
      setUser(updated);
      setEditedBio(updated?.bio || '');
      setEditedFullName(updated?.fullName || '');
      setEditedAvatarUrl(updated?.avatarUrl || '');
      setEditedBirthday(normalizeDateToInput(updated?.birthday));
      setEditedGender(updated?.gender || '');
      updateCurrentUser?.(updated);
      setIsEditMode(false);
      setSuccessMsg('Đã cập nhật thông tin cá nhân.');
    } catch (e) {
      setErrorMsg(
        e?.response?.data?.message ||
          'Cập nhật thất bại. Vui lòng thử lại.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoadingMe) {
    return (
      <div className="min-h-screen bg-gray-100">
        <SocialHeader />
        <div className="pt-14 flex items-center justify-center min-h-screen">
          <div className="flex items-center gap-2 text-gray-600">
            <Loader2 className="animate-spin" size={18} />
            <span>Đang tải thông tin cá nhân...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100">
        <SocialHeader />
        <div className="pt-14 flex items-center justify-center min-h-screen">
          <p className="text-gray-600">
            {errorMsg || 'Không tìm thấy người dùng'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <SocialHeader />
      
      <div className="pt-14 max-w-4xl mx-auto px-4 py-6">
        {/* Profile Header Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
          <div className="p-6">
            {!!errorMsg && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {errorMsg}
              </div>
            )}
            {!!successMsg && (
              <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                {successMsg}
              </div>
            )}
            <div className="flex items-start gap-6">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div
                  className="w-32 h-32 rounded-full border-4 border-blue-500 bg-cover bg-center"
                  style={{ backgroundImage: `url(${user.avatarUrl || ''})` }}
                />
                {isEditMode && isOwnProfile && (
                  <div className="mt-3">
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Avatar URL
                    </label>
                    <input
                      value={editedAvatarUrl}
                      onChange={(e) => setEditedAvatarUrl(e.target.value)}
                      className="w-56 max-w-[14rem] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      placeholder="https://..."
                    />
                  </div>
                )}
              </div>

              {/* User Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-1">
                      {user.userName}
                    </h1>
                    {isEditMode && isOwnProfile ? (
                      <div className="mb-2">
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Họ và tên
                        </label>
                        <input
                          value={editedFullName}
                          onChange={(e) => setEditedFullName(e.target.value)}
                          className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          placeholder="Nhập họ và tên"
                        />
                      </div>
                    ) : (
                      <p className="text-gray-600 mb-2">{user.fullName}</p>
                    )}
                    {user.email && (
                      <p className="text-sm text-gray-500">{user.email}</p>
                    )}

                    {/* Extra info khi xem profile bản thân */}
                    {isOwnProfile && (
                      <div className="mt-2 text-sm text-gray-600 flex flex-wrap gap-x-4 gap-y-1">
                        <span>
                          <span className="font-semibold text-gray-800">Level:</span> {user.level ?? 1}
                        </span>
                        <span>
                          <span className="font-semibold text-gray-800">XP:</span> {user.xp ?? 0}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    {isOwnProfile ? (
                      <>
                        <button
                          onClick={() => navigate('/post/create')}
                          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <PenSquare size={18} />
                          <span>Đăng bài</span>
                        </button>
                        <button
                          onClick={() => setIsEditMode(!isEditMode)}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                          <Edit2 size={18} />
                          <span>Chỉnh sửa</span>
                        </button>
                        <Link
                          to="/settings"
                          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          <Settings size={18} />
                          <span>Cài đặt</span>
                        </Link>
                      </>
                    ) : (
                      <button
                        onClick={handleFollow}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                          isFollowing
                            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                        }`}
                      >
                        {isFollowing ? (
                          <>
                            <Check size={18} />
                            <span>Đang theo dõi</span>
                          </>
                        ) : (
                          <>
                            <UserPlus size={18} />
                            <span>Theo dõi</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* Bio - Editable if own profile */}
                {isEditMode && isOwnProfile ? (
                  <div className="mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Ngày sinh
                        </label>
                        <input
                          type="date"
                          value={editedBirthday}
                          onChange={(e) => setEditedBirthday(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Giới tính
                        </label>
                        <select
                          value={editedGender}
                          onChange={(e) => setEditedGender(e.target.value)}
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
                      onChange={(e) => setEditedBio(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      rows="3"
                      placeholder="Viết giới thiệu về bản thân..."
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={handleSaveEdit}
                        disabled={isSaving}
                        className={`px-4 py-1 rounded-lg transition-colors text-sm flex items-center gap-2 ${
                          isSaving ? 'bg-blue-400 text-white cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'
                        }`}
                      >
                        {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                        <span>Lưu</span>
                      </button>
                      <button
                        onClick={() => {
                          setIsEditMode(false);
                          setEditedBio(user.bio || '');
                          setEditedFullName(user.fullName || '');
                          setEditedAvatarUrl(user.avatarUrl || '');
                          setEditedBirthday(normalizeDateToInput(user.birthday));
                          setEditedGender(user.gender || '');
                          setErrorMsg('');
                          setSuccessMsg('');
                        }}
                        className="px-4 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                      >
                        Hủy
                      </button>
                    </div>
                  </div>
                ) : (
                  user.bio && (
                    <p className="text-gray-700 mb-4 leading-relaxed">{user.bio}</p>
                  )
                )}

                {/* Stats */}
                <div className="flex items-center gap-6 pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2">
                    <Calendar size={18} className="text-gray-500" />
                    <div>
                      <span className="font-bold text-gray-900">{userPosts.length}</span>
                      <span className="text-gray-600 ml-1">Bài viết</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users size={18} className="text-gray-500" />
                    <div>
                      <span className="font-bold text-gray-900">0</span>
                      <span className="text-gray-600 ml-1">Người theo dõi</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users size={18} className="text-gray-500" />
                    <div>
                      <span className="font-bold text-gray-900">0</span>
                      <span className="text-gray-600 ml-1">Đang theo dõi</span>
                    </div>
                  </div>
                </div>

                {/* Meta info */}
                {isOwnProfile && (
                  <div className="mt-4 text-xs text-gray-500">
                    <div>
                      Tạo lúc: {user.createdAt ? formatDate(user.createdAt) : '—'}
                    </div>
                    <div>
                      Cập nhật: {user.updatedAt ? formatDate(user.updatedAt) : '—'}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Posts Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Bài viết</h2>
          
          {userPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Chưa có bài viết nào</p>
            </div>
          ) : (
            <div className="space-y-6">
              {userPosts.map((post) => (
                <Link
                  key={post.id}
                  to={`/post/${post.id}`}
                  className="block border-b border-gray-200 pb-6 last:border-b-0 last:pb-0 hover:bg-gray-50 -mx-6 px-6 py-2 rounded-lg transition-colors"
                >
                  <div className="flex gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
                        {post.title || '(Không có tiêu đề)'}
                      </h3>
                      {(post.contentText || post.content) && (
                        <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                          {post.contentText || post.content}
                        </p>
                      )}
                      <p className="text-xs text-gray-500">
                        {post.createdAt ? formatDateTime(post.createdAt) : ''}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;



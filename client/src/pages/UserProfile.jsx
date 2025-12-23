import React, { useMemo, useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
import { Edit2, UserPlus, Check, Settings, Calendar, Users, Save, Loader2, PenSquare, Camera } from 'lucide-react';
import SocialHeader from '@components/socialMedia/SocialHeader';
import FollowButton from '@components/userProfile/FollowButton';
import FollowListModal from '@components/userProfile/FollowListModal';
import AvatarUploadModal from '@components/AvatarUploadModal';
import AvatarViewModal from '@components/AvatarViewModal';
import AvatarMenu from '@components/userProfile/AvatarMenu';
import ProfileStats from '@components/userProfile/ProfileStats';
import UserPostsList from '@components/userProfile/UserPostsList';
import axiosInstance from '@utils/axiosInstance';

const UserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, updateCurrentUser } = useAuth();
  const [user, setUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedBio, setEditedBio] = useState('');
  const [editedFullName, setEditedFullName] = useState('');
  const [editedAvatarUrl, setEditedAvatarUrl] = useState('');
  const [editedBirthday, setEditedBirthday] = useState(''); // yyyy-MM-dd
  const [editedGender, setEditedGender] = useState(''); // MALE|FEMALE|OTHER|''
  const [isLoadingMe, setIsLoadingMe] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [followModalOpen, setFollowModalOpen] = useState(false);
  const [followModalInitialTab, setFollowModalInitialTab] = useState('followers'); // 'followers' or 'following'
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [isAvatarViewModalOpen, setIsAvatarViewModalOpen] = useState(false);
  const [isAvatarMenuOpen, setIsAvatarMenuOpen] = useState(false);
  
  const resolvedId = useMemo(() => (id ? parseInt(id) : null), [id]);
  const isOwnProfile = useMemo(() => {
    if (!currentUser || !resolvedId) return false;
    return currentUser.id === resolvedId;
  }, [currentUser, resolvedId]);

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

        // Sync ngay vào context/localStorage để header đổi avatar/name
        updateCurrentUser?.(me);

        // Load followers và following count
        try {
          const [followersRes, followingRes] = await Promise.all([
            axiosInstance.get(`/user/${me?.id}/followers`),
            axiosInstance.get(`/user/${me?.id}/following`)
          ]);
          if (!cancelled) {
            setFollowersCount(Array.isArray(followersRes.data) ? followersRes.data.length : 0);
            setFollowingCount(Array.isArray(followingRes.data) ? followingRes.data.length : 0);
          }
        } catch (e) {
          console.error('Error loading follow counts:', e);
        }

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

        // Load followers và following count, đồng thời check follow status
        try {
          // Xử lý riêng từng API để tránh lỗi một API làm fail cả batch
          const promises = [
            axiosInstance.get(`/user/${userId}/followers`).catch(err => {
              console.error('Error loading followers:', err);
              return { data: [] };
            }),
            // API following có thể fail do backend lỗi, nên catch riêng
            axiosInstance.get(`/user/${userId}/following`).catch(err => {
              console.error('Error loading following (backend may have issue):', err);
              return { data: [] };
            })
          ];

          // Sử dụng API mới để check follow status đơn giản hơn
          if (currentUser?.id && !isOwnProfile) {
            promises.push(
              axiosInstance.get(`/user/${userId}/is-following`).catch((err) => {
                console.error('Error checking follow status:', err);
                return { data: { isFollowing: false } };
              })
            );
          } else {
            promises.push(Promise.resolve({ data: { isFollowing: false } }));
          }

          const [followersRes, followingRes, isFollowingRes] = await Promise.all(promises);
          
          if (!cancelled) {
            setFollowersCount(Array.isArray(followersRes.data) ? followersRes.data.length : 0);
            setFollowingCount(Array.isArray(followingRes.data) ? followingRes.data.length : 0);
            
            // Lấy follow status từ API mới
            if (currentUser?.id && !isOwnProfile && isFollowingRes?.data) {
              setIsFollowing(isFollowingRes.data.isFollowing || false);
            } else {
              // Nếu không có currentUser hoặc là own profile, set về false
              setIsFollowing(false);
            }
          }
        } catch (e) {
          console.error('Error loading follow counts:', e);
          // Nếu lỗi, set về false
          setIsFollowing(false);
        }

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
  }, [id, isOwnProfile, updateCurrentUser, currentUser?.id]);

  const handleFollowChange = async (newStatus) => {
    setIsFollowing(newStatus);
    
    // Reload lại followersCount của user này khi follow/unfollow
    if (!isOwnProfile && user?.id) {
      try {
        const followersRes = await axiosInstance.get(`/user/${user.id}/followers`);
        setFollowersCount(Array.isArray(followersRes.data) ? followersRes.data.length : 0);
      } catch (e) {
        console.error('Error reloading followers count:', e);
      }
    }
  };

  const handleAvatarUpdateSuccess = (updatedUser) => {
    setUser(updatedUser);
    setSuccessMsg('Cập nhật ảnh đại diện thành công!');
    // Reload user data để đảm bảo sync
    if (isOwnProfile) {
      const loadMe = async () => {
        try {
          const res = await axiosInstance.get('/user/me');
          const me = res.data;
          setUser(me);
          updateCurrentUser?.(me);
        } catch (e) {
          console.error('Lỗi reload user data:', e);
        }
      };
      loadMe();
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
              <div className="flex-shrink-0 relative">
                <div
                  className="w-32 h-32 rounded-full border-4 border-blue-500 bg-cover bg-center cursor-pointer transition-all duration-200 relative group"
                  style={{ backgroundImage: `url(${user.avatarUrl || ''})` }}
                  onClick={() => {
                    if (isOwnProfile) {
                      setIsAvatarMenuOpen(true);
                    } else {
                      setIsAvatarViewModalOpen(true);
                    }
                  }}
                >
                  {/* Hover overlay với icon camera - chỉ hiện khi là own profile */}
                  {isOwnProfile && (
                    <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                      <Camera size={32} className="text-white" />
                    </div>
                  )}
                </div>
                
                {/* Menu dropdown - chỉ hiện khi click vào avatar của own profile */}
                {isOwnProfile && (
                  <AvatarMenu
                    isOpen={isAvatarMenuOpen}
                    onClose={() => setIsAvatarMenuOpen(false)}
                    onUploadClick={() => setIsAvatarModalOpen(true)}
                    onViewClick={() => setIsAvatarViewModalOpen(true)}
                  />
                )}
              </div>

              {/* User Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-1">
                      {user.userName}
                    </h1>
                    <p className="text-gray-600 mb-2">{user.fullName}</p>
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
                        <Link
                          to="/user/edit"
                          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                          <Edit2 size={18} />
                          <span>Chỉnh sửa</span>
                        </Link>
                        <Link
                          to="/settings"
                          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          <Settings size={18} />
                          <span>Cài đặt</span>
                        </Link>
                      </>
                    ) : (
                      <FollowButton
                        userId={user?.id}
                        initialIsFollowing={isFollowing}
                        onFollowChange={handleFollowChange}
                      />
                    )}
                  </div>
                </div>

                {/* Bio */}
                {user.bio && (
                  <p className="text-gray-700 mb-4 leading-relaxed">{user.bio}</p>
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
                  <button
                    onClick={() => {
                      setFollowModalInitialTab('followers');
                      setFollowModalOpen(true);
                    }}
                    className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
                  >
                    <Users size={18} className="text-gray-500" />
                    <div>
                      <span className="font-bold text-gray-900">{followersCount}</span>
                      <span className="text-gray-600 ml-1">Người theo dõi</span>
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      setFollowModalInitialTab('following');
                      setFollowModalOpen(true);
                    }}
                    className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
                  >
                    <Users size={18} className="text-gray-500" />
                    <div>
                      <span className="font-bold text-gray-900">{followingCount}</span>
                      <span className="text-gray-600 ml-1">Đang theo dõi</span>
                    </div>
                  </button>
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
          <UserPostsList posts={userPosts} formatDateTime={formatDateTime} />
        </div>
      </div>

      {/* Follow List Modal */}
      <FollowListModal
        isOpen={followModalOpen}
        onClose={() => setFollowModalOpen(false)}
        userId={user?.id}
        initialTab={followModalInitialTab}
      {/* Avatar Upload Modal */}
      {isOwnProfile && (
        <AvatarUploadModal
          isOpen={isAvatarModalOpen}
          onClose={() => setIsAvatarModalOpen(false)}
          currentAvatarUrl={user?.avatarUrl}
          onSuccess={handleAvatarUpdateSuccess}
        />
      )}

      {/* Avatar View Modal */}
      <AvatarViewModal
        isOpen={isAvatarViewModalOpen}
        onClose={() => setIsAvatarViewModalOpen(false)}
        avatarUrl={user?.avatarUrl}
        userName={user?.userName || user?.fullName}
      />
    </div>
  );
};

export default UserProfile;



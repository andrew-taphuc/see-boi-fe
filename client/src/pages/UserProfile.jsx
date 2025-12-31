import React, { useMemo, useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "@context/AuthContext";
import {
  Edit2,
  UserPlus,
  Check,
  Settings,
  Calendar,
  Users,
  Save,
  Loader2,
  Camera,
} from "lucide-react";
import FollowButton from "@components/userProfile/FollowButton";
import FollowListModal from "@components/userProfile/FollowListModal";
import AvatarUploadModal from "@components/AvatarUploadModal";
import AvatarViewModal from "@components/AvatarViewModal";
import AvatarMenu from "@components/userProfile/AvatarMenu";
import ProfileStats from "@components/userProfile/ProfileStats";
import UserPostsList from "@components/userProfile/UserPostsList";
import axiosInstance from "@utils/axiosInstance";

const UserProfile = () => {
  const { id } = useParams();
  const { currentUser, updateCurrentUser } = useAuth();
  const [user, setUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedBio, setEditedBio] = useState("");
  const [editedFullName, setEditedFullName] = useState("");
  const [editedAvatarUrl, setEditedAvatarUrl] = useState("");
  const [editedBirthday, setEditedBirthday] = useState(""); // yyyy-MM-dd
  const [editedGender, setEditedGender] = useState(""); // MALE|FEMALE|OTHER|''
  const [isLoadingMe, setIsLoadingMe] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [followModalOpen, setFollowModalOpen] = useState(false);
  const [followModalInitialTab, setFollowModalInitialTab] =
    useState("followers"); // 'followers' or 'following'
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [isAvatarViewModalOpen, setIsAvatarViewModalOpen] = useState(false);
  const [isAvatarMenuOpen, setIsAvatarMenuOpen] = useState(false);

  const resolvedId = useMemo(() => (id ? parseInt(id) : null), [id]);
  const isOwnProfile = useMemo(() => {
    if (!currentUser || !resolvedId) return false;
    return currentUser.id === resolvedId;
  }, [currentUser, resolvedId]);

  const fetchPostsByUserId = async (userId) => {
    // Sử dụng API backend /post/:userId/posts để lấy posts với visibility logic đúng
    const res = await axiosInstance.get(`/post/${userId}/posts`);
    const posts = Array.isArray(res.data) ? res.data : [];
    // Backend đã sort theo createdAt DESC rồi, không cần sort lại
    return posts;
  };

  useEffect(() => {
    let cancelled = false;

    const loadMe = async () => {
      setIsLoadingMe(true);
      setErrorMsg("");
      setSuccessMsg("");
      try {
        const res = await axiosInstance.get("/user/me");
        if (cancelled) return;
        const me = res.data;
        setUser(me);

        // Sync ngay vào context/localStorage để header đổi avatar/name
        updateCurrentUser?.(me);

        // Load followers và following count
        try {
          const [followersRes, followingRes] = await Promise.all([
            axiosInstance.get(`/user/${me?.id}/followers`),
            axiosInstance.get(`/user/${me?.id}/following`),
          ]);
          if (!cancelled) {
            setFollowersCount(
              Array.isArray(followersRes.data) ? followersRes.data.length : 0
            );
            setFollowingCount(
              Array.isArray(followingRes.data) ? followingRes.data.length : 0
            );
          }
        } catch (e) {
          console.error("Error loading follow counts:", e);
        }

        const posts = await fetchPostsByUserId(me?.id);
        if (!cancelled) setUserPosts(posts);
      } catch (e) {
        if (cancelled) return;
        setErrorMsg(
          e?.response?.data?.message ||
            "Không thể tải thông tin cá nhân. Vui lòng thử lại."
        );
      } finally {
        if (!cancelled) setIsLoadingMe(false);
      }
    };

    const loadUserById = async () => {
      const userId = parseInt(id);
      if (!userId || Number.isNaN(userId)) {
        setUser(null);
        setErrorMsg("ID người dùng không hợp lệ");
        setIsLoadingMe(false);
        return;
      }

      setIsLoadingMe(true);
      setErrorMsg("");
      setSuccessMsg("");
      try {
        const res = await axiosInstance.get(`/user/${userId}`);
        if (cancelled) return;
        const u = res.data;
        setUser(u);

        // Load followers và following count, đồng thời check follow status
        try {
          // Xử lý riêng từng API để tránh lỗi một API làm fail cả batch
          const promises = [
            axiosInstance.get(`/user/${userId}/followers`).catch((err) => {
              console.error("Error loading followers:", err);
              return { data: [] };
            }),
            // API following có thể fail do backend lỗi, nên catch riêng
            axiosInstance.get(`/user/${userId}/following`).catch((err) => {
              console.error(
                "Error loading following (backend may have issue):",
                err
              );
              return { data: [] };
            }),
          ];

          // Sử dụng API mới để check follow status đơn giản hơn
          if (currentUser?.id && !isOwnProfile) {
            promises.push(
              axiosInstance.get(`/user/${userId}/is-following`).catch((err) => {
                console.error("Error checking follow status:", err);
                return { data: { isFollowing: false } };
              })
            );
          } else {
            promises.push(Promise.resolve({ data: { isFollowing: false } }));
          }

          const [followersRes, followingRes, isFollowingRes] =
            await Promise.all(promises);

          if (!cancelled) {
            setFollowersCount(
              Array.isArray(followersRes.data) ? followersRes.data.length : 0
            );
            setFollowingCount(
              Array.isArray(followingRes.data) ? followingRes.data.length : 0
            );

            // Lấy follow status từ API mới
            if (currentUser?.id && !isOwnProfile && isFollowingRes?.data) {
              setIsFollowing(isFollowingRes.data.isFollowing || false);
            } else {
              // Nếu không có currentUser hoặc là own profile, set về false
              setIsFollowing(false);
            }
          }
        } catch (e) {
          console.error("Error loading follow counts:", e);
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
          setErrorMsg("Không tìm thấy người dùng");
        } else {
          setErrorMsg(
            e?.response?.data?.message ||
              "Không thể tải thông tin người dùng. Vui lòng thử lại."
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

  // Đặt background trắng cho body/html và ngăn overscroll để tránh lộ viền
  useEffect(() => {
    const originalBodyBg = document.body.style.backgroundColor;
    const originalHtmlBg = document.documentElement.style.backgroundColor;
    const originalBodyOverscroll = document.body.style.overscrollBehavior;
    const originalHtmlOverscroll = document.documentElement.style.overscrollBehavior;
    
    // Đặt màu nền trắng và ngăn overscroll
    document.body.style.backgroundColor = '#ffffff';
    document.documentElement.style.backgroundColor = '#ffffff';
    document.body.style.overscrollBehavior = 'none';
    document.documentElement.style.overscrollBehavior = 'none';
    
    // Cleanup khi unmount
    return () => {
      document.body.style.backgroundColor = originalBodyBg;
      document.documentElement.style.backgroundColor = originalHtmlBg;
      document.body.style.overscrollBehavior = originalBodyOverscroll;
      document.documentElement.style.overscrollBehavior = originalHtmlOverscroll;
    };
  }, []);

  const handleFollowChange = async (newStatus) => {
    setIsFollowing(newStatus);

    // Reload lại followersCount của user này khi follow/unfollow
    if (!isOwnProfile && user?.id) {
      try {
        const followersRes = await axiosInstance.get(
          `/user/${user.id}/followers`
        );
        setFollowersCount(
          Array.isArray(followersRes.data) ? followersRes.data.length : 0
        );
      } catch (e) {
        console.error("Error reloading followers count:", e);
      }
    }
  };

  const handleAvatarUpdateSuccess = (updatedUser) => {
    setUser(updatedUser);
    setSuccessMsg("Cập nhật ảnh đại diện thành công!");
    // Reload user data để đảm bảo sync
    if (isOwnProfile) {
      const loadMe = async () => {
        try {
          const res = await axiosInstance.get("/user/me");
          const me = res.data;
          setUser(me);
          updateCurrentUser?.(me);
        } catch (e) {
          console.error("Lỗi reload user data:", e);
        }
      };
      loadMe();
    }
  };

  const handlePostUpdate = (updatedPost) => {
    setUserPosts((prevPosts) =>
      prevPosts.map((post) => (post.id === updatedPost.id ? updatedPost : post))
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoadingMe) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="flex items-center gap-2 text-gray-600">
          <Loader2 className="animate-spin" size={18} />
          <span>Đang tải thông tin cá nhân...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <p className="text-gray-600">
          {errorMsg || "Không tìm thấy người dùng"}
        </p>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-white"
      style={{
        overscrollBehavior: 'none',
        overscrollBehaviorY: 'none',
        overflowX: 'hidden',
      }}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Profile Header Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          <div className="p-6 lg:p-8">
            {!!errorMsg && (
              <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 shadow-sm">
                {errorMsg}
              </div>
            )}
            {!!successMsg && (
              <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 shadow-sm">
                {successMsg}
              </div>
            )}
            <div className="flex flex-col sm:flex-row items-start gap-6 lg:gap-8">
              {/* Avatar */}
              <div className="flex-shrink-0 relative mx-auto sm:mx-0">
                <div
                  className="w-28 h-28 sm:w-36 sm:h-36 lg:w-40 lg:h-40 rounded-full border-4 border-white shadow-lg bg-cover bg-center cursor-pointer transition-all duration-300 relative group ring-4 ring-gray-100"
                  style={{ backgroundImage: `url(${user.avatarUrl || ""})` }}
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
                    <div className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                      <Camera size={32} className="text-white drop-shadow-lg" />
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
              <div className="flex-1 min-w-0 w-full">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                  <div className="flex-1">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                      {user.fullName}
                    </h1>
                    <p className="text-base sm:text-lg text-gray-600 mb-2">{user.userName}</p>
                    {user.email && isOwnProfile && (
                      <p className="text-sm text-gray-500 mb-3">{user.email}</p>
                    )}

                    {/* Level Badge - visible for everyone */}
                    <div className="mt-3 inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-md">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-white font-bold text-sm">
                        Level {user.level ?? 1}
                      </span>
                    </div>

                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-2 sm:items-start">
                    {isOwnProfile ? (
                      <div className="flex flex-wrap gap-2">
                        <Link
                          to="/user/edit"
                          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
                        >
                          <Edit2 size={18} />
                          <span>Chỉnh sửa</span>
                        </Link>
                        <Link
                          to="/settings"
                          className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 shadow-sm hover:shadow-md font-medium"
                        >
                          <Settings size={18} />
                          <span>Cài đặt</span>
                        </Link>
                      </div>
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
                  <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <p className="text-gray-700 leading-relaxed text-base">
                      {user.bio}
                    </p>
                  </div>
                )}

                {/* Extra XP info chỉ khi xem profile bản thân */}
                {isOwnProfile && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex items-center justify-between text-xs text-gray-700 mb-2 font-medium">
                      <span>
                        XP: {user.xp ?? 0} / {(user.level ?? 1) * 1000}
                      </span>
                      <span className="text-purple-600 font-semibold">
                        {Math.floor(((user.xp ?? 0) % 1000) / 10)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden shadow-inner">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500 rounded-full"
                        style={{
                          width: `${((user.xp ?? 0) % 1000) / 10}%`,
                        }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Còn {1000 - ((user.xp ?? 0) % 1000)} XP nữa lên Level{" "}
                      {(user.level ?? 1) + 1}
                    </p>
                  </div>
                )}

                {/* Stats */}
                <div className="flex flex-wrap items-center gap-6 lg:gap-8 pt-6 border-t border-gray-200">
                  <button className="flex items-center gap-3 hover:opacity-80 transition-all duration-200 group">
                    <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-colors">
                      <Calendar size={20} className="text-gray-600" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 text-lg">
                        {userPosts.length}
                      </div>
                      <div className="text-sm text-gray-600">Bài viết</div>
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      setFollowModalInitialTab("followers");
                      setFollowModalOpen(true);
                    }}
                    className="flex items-center gap-3 hover:opacity-80 transition-all duration-200 group cursor-pointer"
                  >
                    <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-colors">
                      <Users size={20} className="text-gray-600" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 text-lg">
                        {followersCount}
                      </div>
                      <div className="text-sm text-gray-600">Người theo dõi</div>
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      setFollowModalInitialTab("following");
                      setFollowModalOpen(true);
                    }}
                    className="flex items-center gap-3 hover:opacity-80 transition-all duration-200 group cursor-pointer"
                  >
                    <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-colors">
                      <Users size={20} className="text-gray-600" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 text-lg">
                        {followingCount}
                      </div>
                      <div className="text-sm text-gray-600">Đang theo dõi</div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Posts Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200">
            Bài viết
          </h2>
          <UserPostsList
            posts={userPosts}
            formatDateTime={formatDateTime}
            onPostUpdate={handlePostUpdate}
          />
        </div>
      </div>

      {/* Follow List Modal */}
      <FollowListModal
        isOpen={followModalOpen}
        onClose={() => setFollowModalOpen(false)}
        userId={user?.id}
        initialTab={followModalInitialTab}
      />

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

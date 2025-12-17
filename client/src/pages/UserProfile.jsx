import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Edit2, UserPlus, Check, Settings, Calendar, Users } from 'lucide-react';
import usersData from '../data/users.json';
import postsData from '../data/posts.json';
import SocialHeader from '../components/socialMedia/SocialHeader';

const UserProfile = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedBio, setEditedBio] = useState('');
  
  const isOwnProfile = currentUser && currentUser.id === parseInt(id);

  useEffect(() => {
    const userId = parseInt(id);
    const foundUser = usersData.find(u => u.id === userId);
    
    if (foundUser) {
      setUser(foundUser);
      setEditedBio(foundUser.bio || '');
      
      // Lấy bài đăng của user
      const posts = postsData.filter(p => p.userId === userId);
      // Sắp xếp theo thời gian mới nhất
      posts.sort((a, b) => new Date(b.time) - new Date(a.time));
      setUserPosts(posts);
    }
  }, [id]);

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    // TODO: Implement follow logic khi có backend
  };

  const handleSaveEdit = () => {
    // TODO: Implement save edit logic khi có backend
    // Tạm thời chỉ cập nhật local state
    setUser({ ...user, bio: editedBio });
    setIsEditMode(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100">
        <SocialHeader />
        <div className="pt-14 flex items-center justify-center min-h-screen">
          <p className="text-gray-600">Không tìm thấy người dùng</p>
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
            <div className="flex items-start gap-6">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div 
                  className="w-32 h-32 rounded-full border-4 border-blue-500 bg-cover bg-center"
                  style={{ backgroundImage: `url(${user.avatarUrl})` }}
                />
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
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    {isOwnProfile ? (
                      <>
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
                        className="px-4 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                      >
                        Lưu
                      </button>
                      <button
                        onClick={() => {
                          setIsEditMode(false);
                          setEditedBio(user.bio || '');
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
                    {post.image && (
                      <div className="flex-shrink-0 w-32 h-24 rounded-lg overflow-hidden">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                        {post.content}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(post.time)}
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



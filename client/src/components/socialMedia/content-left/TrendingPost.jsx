import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '@utils/axiosInstance';
import { DEFAULT_POST_THUMBNAIL } from '@utils/placeholderUtils';
import { TrendingUp } from 'lucide-react';

const TrendingPost = () => {
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTrendingPosts();
  }, []);

  const loadTrendingPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get('/trending', {
        params: {
          type: 'views',
          period: '24h',
          limit: 5,
        },
      });
      const posts = response.data || [];
      // Sắp xếp theo views giảm dần
      const sortedPosts = [...posts].sort((a, b) => {
        const aViews = a._count?.views || a.viewsInPeriod || 0;
        const bViews = b._count?.views || b.viewsInPeriod || 0;
        return bViews - aViews;
      });
      setTrendingPosts(sortedPosts);
    } catch (err) {
      console.error('Error loading trending posts:', err);
      setError('Không thể tải bài viết trending');
    } finally {
      setLoading(false);
    }
  };

  // Hàm rút gọn nội dung
  const truncateContent = (content, maxLength = 100) => {
    if (!content) return '';
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  // Hàm lấy thumbnail từ post
  const getPostThumbnail = (post) => {
    if (post.thumbnailUrl) return post.thumbnailUrl;
    if (post.images && post.images.length > 0) {
      return post.images[0].url;
    }
    return DEFAULT_POST_THUMBNAIL;
  };

  // Hàm format thời gian
  const formatTimeAgo = (dateString) => {
    const postTime = new Date(dateString);
    const now = new Date();
    const diffInMs = now - postTime;
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays > 0) {
      return `${diffInDays} ngày trước`;
    } else if (diffInHours > 0) {
      return `${diffInHours} giờ trước`;
    } else {
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      return diffInMinutes > 0 ? `${diffInMinutes} phút trước` : 'Vừa xong';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm flex flex-col h-full min-h-0">
        <div className="flex items-center gap-2 mb-4 flex-shrink-0">
          <TrendingUp className="text-orange-500" size={20} />
          <h3 className="font-semibold text-gray-900">Bài viết nổi bật</h3>
        </div>
        <div className="animate-pulse space-y-4 flex-1 overflow-y-auto">
          <div className="h-48 bg-gray-200 rounded-lg"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm flex flex-col h-full min-h-0">
        <div className="flex items-center gap-2 mb-4 flex-shrink-0">
          <TrendingUp className="text-orange-500" size={20} />
          <h3 className="font-semibold text-gray-900">Bài viết nổi bật</h3>
        </div>
        <p className="text-red-500 text-sm">{error}</p>
        <button
          onClick={loadTrendingPosts}
          className="mt-2 text-sm text-blue-600 hover:text-blue-700"
        >
          Thử lại
        </button>
      </div>
    );
  }

  if (trendingPosts.length === 0) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm flex flex-col h-full min-h-0">
        <div className="flex items-center gap-2 mb-4 flex-shrink-0">
          <TrendingUp className="text-orange-500" size={20} />
          <h3 className="font-semibold text-gray-900">Bài viết nổi bật</h3>
        </div>
        <p className="text-gray-500 text-sm">Chưa có bài viết trending</p>
      </div>
    );
  }

  const topPost = trendingPosts[0];
  const otherPosts = trendingPosts.slice(1, 5);

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm flex flex-col h-full min-h-0">
      <div className="flex items-center gap-2 mb-4 flex-shrink-0">
        <TrendingUp className="text-orange-500" size={20} />
        <h3 className="font-semibold text-gray-900">Bài viết nổi bật</h3>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto flex flex-col">
      {/* Post nhiều view nhất - Format lớn */}
      {topPost && (
        <Link
          to={`/post/${topPost.id}`}
            className="block mb-4 hover:opacity-90 transition-opacity flex-shrink-0"
        >
          <div className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200 relative">
            {/* TOP 1 Badge */}
            <div className="absolute top-2 left-2 z-10 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold text-xs px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
              <span>🏆</span>
              <span>TOP 1</span>
            </div>
            {/* Thumbnail */}
            <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
              <img
                src={getPostThumbnail(topPost)}
                alt={topPost.title || 'Post thumbnail'}
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = DEFAULT_POST_THUMBNAIL;
                }}
              />
            </div>

            {/* Content */}
            <div className="p-4">
              {/* Title */}
              <h4 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
                {topPost.title || 'Bài viết không có tiêu đề'}
              </h4>

              {/* User info */}
              <div className="flex items-center gap-2 mb-2">
                <img
                  src={
                    topPost.user?.avatarUrl ||
                    `https://ui-avatars.com/api/?name=${topPost.user?.userName || 'User'}&background=4267B2&color=fff`
                  }
                  alt={topPost.user?.fullName || topPost.user?.userName || 'User'}
                  className="w-8 h-8 rounded-full object-cover border-2 border-blue-500"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-700 truncate">
                    {topPost.user?.fullName ||
                      topPost.user?.userName ||
                      'Người dùng'}
                  </p>
                </div>
              </div>

              {/* Content preview */}
              <p className="text-gray-600 text-sm line-clamp-3">
                {truncateContent(topPost.contentText || topPost.content, 180)}
              </p>
            </div>
          </div>
        </Link>
      )}

      {/* 4 bài còn lại - Format nhỏ */}
        <div className="space-y-3 flex-shrink-0">
        {otherPosts.map((post, index) => {
          const rank = index + 2; // Top 2, 3, 4, 5
          const getRankBadge = (rank) => {
            const badges = {
              2: { bg: 'from-gray-300 to-gray-400', emoji: '🥈', text: 'TOP 2' },
              3: { bg: 'from-amber-600 to-amber-700', emoji: '🥉', text: 'TOP 3' },
              4: { bg: 'from-blue-400 to-blue-500', emoji: '4️⃣', text: 'TOP 4' },
              5: { bg: 'from-purple-400 to-purple-500', emoji: '5️⃣', text: 'TOP 5' },
            };
            return badges[rank] || { bg: 'from-gray-400 to-gray-500', emoji: `${rank}️⃣`, text: `TOP ${rank}` };
          };
          const badge = getRankBadge(rank);

          return (
            <Link
              key={post.id}
              to={`/post/${post.id}`}
              className="block hover:opacity-90 transition-opacity"
            >
              <div className="flex gap-3">
                {/* Thumbnail bên trái */}
                <div className="flex-shrink-0 w-24 relative">
                  <div
                    className="relative rounded-lg overflow-hidden"
                    style={{ paddingTop: '56.25%' }}
                  >
                    <img
                      src={getPostThumbnail(post)}
                      alt={post.title || 'Post thumbnail'}
                      className="absolute inset-0 w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = DEFAULT_POST_THUMBNAIL;
                      }}
                    />
                    {/* Rank Badge */}
                    <div className={`absolute top-1 left-1 z-10 bg-gradient-to-r ${badge.bg} text-white font-bold text-[10px] px-2 py-0.5 rounded-full shadow-md flex items-center gap-0.5`}>
                      <span>{badge.emoji}</span>
                      <span>{badge.text}</span>
                    </div>
                  </div>
                </div>

              {/* Content bên phải */}
              <div className="flex-1 min-w-0 flex flex-col justify-between">
                {/* Title ở trên */}
                <h5 className="font-semibold text-sm text-gray-900 line-clamp-2 mb-1">
                  {post.title || 'Bài viết không có tiêu đề'}
                </h5>

                {/* Nội dung ngắn gọn */}
                <p className="text-gray-600 text-xs line-clamp-3 mb-2">
                  {truncateContent(post.contentText || post.content, 120)}
                </p>

                {/* Avatar và tên người đăng ở dưới cùng */}
                <div className="flex items-center gap-2">
                  <img
                    src={
                      post.user?.avatarUrl ||
                      `https://ui-avatars.com/api/?name=${post.user?.userName || 'User'}&background=4267B2&color=fff`
                    }
                    alt={post.user?.fullName || post.user?.userName || 'User'}
                    className="w-6 h-6 rounded-full object-cover border border-blue-500"
                  />
                  <span className="text-xs text-gray-600 truncate">
                    {post.user?.fullName ||
                      post.user?.userName ||
                      'Người dùng'}
                  </span>
                </div>
              </div>
            </div>
          </Link>
          );
        })}
        </div>
      </div>
    </div>
  );
};

export default TrendingPost;


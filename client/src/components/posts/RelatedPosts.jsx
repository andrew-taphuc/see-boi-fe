import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '@utils/axiosInstance';
import { DEFAULT_POST_THUMBNAIL } from '@utils/placeholderUtils';
import { Link2 } from 'lucide-react';

const RelatedPosts = ({ postId, limit = 5 }) => {
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (postId) {
      loadRelatedPosts();
    }
  }, [postId]);

  const loadRelatedPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(`/post/${postId}/related`, {
        params: {
          limit,
        },
      });
      const posts = response.data || [];
      setRelatedPosts(posts);
    } catch (err) {
      console.error('Error loading related posts:', err);
      setError('Không thể tải bài viết liên quan');
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
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <Link2 className="text-blue-600" size={20} />
          <h3 className="font-semibold text-gray-900">Bài viết liên quan</h3>
        </div>
        <div className="animate-pulse space-y-4">
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
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <Link2 className="text-blue-600" size={20} />
          <h3 className="font-semibold text-gray-900">Bài viết liên quan</h3>
        </div>
        <p className="text-red-500 text-sm">{error}</p>
        <button
          onClick={loadRelatedPosts}
          className="mt-2 text-sm text-blue-600 hover:text-blue-700"
        >
          Thử lại
        </button>
      </div>
    );
  }

  if (relatedPosts.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <Link2 className="text-blue-600" size={20} />
          <h3 className="font-semibold text-gray-900">Bài viết liên quan</h3>
        </div>
        <p className="text-gray-500 text-sm">Chưa có bài viết liên quan</p>
      </div>
    );
  }

  const topPost = relatedPosts[0];
  const otherPosts = relatedPosts.slice(1, limit);

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <Link2 className="text-blue-600" size={20} />
        <h3 className="font-semibold text-gray-900">Bài viết liên quan</h3>
      </div>

      {/* Post đầu tiên - Format lớn */}
      {topPost && (
        <Link
          to={`/post/${topPost.id}`}
          className="block mb-4 hover:opacity-90 transition-opacity"
        >
          <div className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200 relative">
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

      {/* Các bài còn lại - Format nhỏ */}
      <div className="space-y-3">
        {otherPosts.map((post) => {
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
  );
};

export default RelatedPosts;


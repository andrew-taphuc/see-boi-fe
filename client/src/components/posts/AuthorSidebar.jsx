import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ThumbsUp, User } from 'lucide-react';
import axiosInstance from '@utils/axiosInstance';
import FollowButton from '@components/userProfile/FollowButton';
import ThumbnailImage from './ThumbnailImage';
import { DEFAULT_POST_THUMBNAIL } from '@utils/placeholderUtils';

const AuthorSidebar = ({ authorId, currentUserId }) => {
  const navigate = useNavigate();
  const [author, setAuthor] = useState(null);
  const [topPosts, setTopPosts] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authorId) return;

    const loadAuthorData = async () => {
      setIsLoading(true);
      try {
        // Load thông tin tác giả
        const userRes = await axiosInstance.get(`/user/${authorId}`);
        setAuthor(userRes.data);

        // Load posts của tác giả
        const postsRes = await axiosInstance.get(`/post/${authorId}/posts`);
        const posts = Array.isArray(postsRes.data) ? postsRes.data : [];
        
        // Sắp xếp theo số lượt thích và lấy 2 bài viết đầu tiên
        const sortedPosts = posts
          .sort((a, b) => {
            const likesA = a.likes?.length || a.likeCount || 0;
            const likesB = b.likes?.length || b.likeCount || 0;
            return likesB - likesA;
          })
          .slice(0, 2);
        
        setTopPosts(sortedPosts);

        // Kiểm tra follow status nếu có currentUser
        if (currentUserId && currentUserId !== authorId) {
          try {
            const followRes = await axiosInstance.get(`/user/${authorId}/is-following`);
            setIsFollowing(followRes.data?.isFollowing || false);
          } catch (err) {
            console.error('Error checking follow status:', err);
            setIsFollowing(false);
          }
        }
      } catch (error) {
        console.error('Error loading author data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAuthorData();
  }, [authorId, currentUserId]);

  const getPostThumbnail = (post) => {
    if (post.thumbnailUrl) return post.thumbnailUrl;
    if (post.images && post.images.length > 0) {
      return post.images[0].url;
    }
    return DEFAULT_POST_THUMBNAIL;
  };

  if (isLoading) {
    return (
      <div className="w-80 space-y-4">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="animate-pulse">
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!author) {
    return null;
  }

  return (
    <div className="w-80 space-y-4">
      {/* Thông tin tác giả */}
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
        <div className="flex flex-col items-center text-center mb-4">
          <Link to={`/user/${author.id}`} className="block mb-3">
            <div
              className="w-20 h-20 rounded-full border-2 border-blue-500 bg-cover bg-center mx-auto"
              style={{ backgroundImage: `url(${author.avatarUrl || ''})` }}
            />
          </Link>
          <Link
            to={`/user/${author.id}`}
            className="font-semibold text-gray-900 hover:text-blue-600 transition-colors text-lg"
          >
            {author.fullName || author.userName || 'Người dùng'}
          </Link>
          {author.userName && (
            <p className="text-sm text-gray-500">@{author.userName}</p>
          )}
          {author.bio && (
            <p className="text-sm text-gray-600 mt-2 line-clamp-3">{author.bio}</p>
          )}
        </div>

        {/* Follow button */}
        {currentUserId && currentUserId !== author.id && (
          <div className="flex justify-center mb-4">
            <FollowButton
              userId={author.id}
              initialIsFollowing={isFollowing}
              onFollowChange={setIsFollowing}
              size="sm"
            />
          </div>
        )}

        {/* Stats */}
        <div className="flex justify-center gap-4 pt-4 border-t border-gray-200">
          <div className="text-center">
            <p className="text-sm font-semibold text-gray-900">
              {author.postsCount || 0}
            </p>
            <p className="text-xs text-gray-500">Bài viết</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-gray-900">
              {author.followersCount || 0}
            </p>
            <p className="text-xs text-gray-500">Người theo dõi</p>
          </div>
        </div>
      </div>

      {/* 2 bài viết nhiều tim nhất */}
      {topPosts.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <ThumbsUp size={18} className="text-blue-600" />
            <span>Bài viết nổi bật</span>
          </h3>
          <div className="space-y-4">
            {topPosts.map((post) => (
              <Link
                key={post.id}
                to={`/post/${post.id}`}
                className="block hover:opacity-90 transition-opacity"
              >
                <div className="flex gap-3">
                  {/* Thumbnail */}
                  <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden">
                    <img
                      src={getPostThumbnail(post)}
                      alt={post.title || 'Post thumbnail'}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = DEFAULT_POST_THUMBNAIL;
                      }}
                    />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {post.title && (
                      <h4 className="font-medium text-sm text-gray-900 line-clamp-2 mb-1">
                        {post.title}
                      </h4>
                    )}
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <ThumbsUp size={14} />
                      <span>{post.likes?.length || post.likeCount || 0}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthorSidebar;


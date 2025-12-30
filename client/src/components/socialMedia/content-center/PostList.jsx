import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "@utils/axiosInstance";
import { useAuth } from "@context/AuthContext";
import { DEFAULT_POST_THUMBNAIL } from "@utils/placeholderUtils";

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    loadMixedFeed();
  }, []);

  // Hàm lấy trending posts
  const getTrendingPosts = async (type, limit = 5) => {
    try {
      const response = await axiosInstance.get("/trending", {
        params: {
          type, // 'views' hoặc 'likes'
          period: "24h",
          limit,
        },
      });
      return response.data || [];
    } catch (err) {
      console.error(`Error loading trending ${type}:`, err);
      return [];
    }
  };

  // Hàm lấy posts từ người mình follow (sử dụng API mới)
  const getFollowingPosts = async (skip = 0, limit = 5) => {
    if (!currentUser) return [];

    try {
      // Gọi API following-feed mới từ backend
      const response = await axiosInstance.get("/post/following-feed", {
        params: {
          skip,
          take: limit
        }
      });

      // Backend trả về { posts, total, skip, take, hasMore }
      return response.data.posts || [];
    } catch (err) {
      console.error("Error loading following posts:", err);
      return [];
    }
  };

  // Hàm load mixed feed theo pattern: Trending Views -> Following -> Trending Likes -> Following
  const loadMixedFeed = async () => {
    setLoading(true);
    setError(null);

    try {
      const [trendingViews, followingPosts1, trendingLikes, followingPosts2] =
        await Promise.all([
          getTrendingPosts("views", 5),
          getFollowingPosts(0, 5),  // Skip 0, lấy 5 bài đầu
          getTrendingPosts("likes", 5),
          getFollowingPosts(5, 5),  // Skip 5, lấy 5 bài tiếp theo
        ]);

      // Kết hợp theo pattern
      const mixedPosts = [
        ...trendingViews,
        ...followingPosts1,
        ...trendingLikes,
        ...followingPosts2,
      ];

      setPosts(mixedPosts);
    } catch (err) {
      console.error("Error loading mixed feed:", err);
      setError("Không thể tải bài viết. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
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
      return diffInMinutes > 0 ? `${diffInMinutes} phút trước` : "Vừa xong";
    }
  };

  // Hàm rút gọn nội dung
  const truncateContent = (content, maxLength = 150) => {
    if (!content) return "";
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  // Hàm lấy thumbnail từ post
  const getPostThumbnail = (post) => {
    // Ưu tiên thumbnailUrl
    if (post.thumbnailUrl) return post.thumbnailUrl;

    // Nếu không có, lấy ảnh đầu tiên từ images array
    if (post.images && post.images.length > 0) {
      return post.images[0].url;
    }

    // Default placeholder (SVG data URI - không cần internet)
    return DEFAULT_POST_THUMBNAIL;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Đang tải bài viết...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <p className="text-red-500">{error}</p>
        <button
          onClick={loadMixedFeed}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Thử lại
        </button>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <p className="text-gray-500">Chưa có bài viết nào</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {posts.map((post, index) => {
        // Xác định loại section để hiển thị badge
        let sectionBadge = null;
        if (index < 5) {
          sectionBadge = (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
              🔥 Trending Views
            </span>
          );
        } else if (index >= 5 && index < 10) {
          sectionBadge = (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
              👥 Following
            </span>
          );
        } else if (index >= 10 && index < 15) {
          sectionBadge = (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-pink-100 text-pink-800">
              ❤️ Trending Likes
            </span>
          );
        } else if (index >= 15) {
          sectionBadge = (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
              👥 Following
            </span>
          );
        }

        return (
          <article
            key={`${post.id}-${index}`}
            className="flex gap-4 p-4 hover:bg-gray-50 transition-colors duration-200 border-b last:border-b-0"
          >
            {/* Ảnh đại diện bài viết bên trái với aspect ratio 16:9 */}
            <div className="flex-shrink-0 w-40">
              <Link to={`/post/${post.id}`} className="block">
                <div
                  className="relative rounded-lg overflow-hidden"
                  style={{ paddingTop: "56.25%" }}
                >
                  <img
                    src={getPostThumbnail(post)}
                    alt={post.title || "Post thumbnail"}
                    className="absolute inset-0 w-full h-full object-cover rounded-lg"
                    onError={(e) => {
                      // Fallback nếu image load lỗi
                      e.target.src = DEFAULT_POST_THUMBNAIL;
                    }}
                  />
                </div>
              </Link>
            </div>

            {/* Nội dung bên phải */}
            <div className="flex-1 flex flex-col justify-between min-w-0">
              <div>
                {/* Badge section */}
                <div className="mb-2">{sectionBadge}</div>

                {/* Tiêu đề in đậm với link */}
                <Link to={`/post/${post.id}`} className="block mb-2">
                  <h4 className="font-bold text-lg text-gray-800 line-clamp-2 hover:text-blue-600 transition-colors">
                    {post.title || "Bài viết không có tiêu đề"}
                  </h4>
                </Link>

                {/* Nội dung ngắn với link */}
                <Link to={`/post/${post.id}`} className="block mb-3">
                  <p className="text-gray-600 text-sm line-clamp-2 hover:text-gray-800 transition-colors">
                    {truncateContent(post.contentText || post.content)}
                  </p>
                </Link>
              </div>

              {/* Footer với avatar, tên user và stats */}
              <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center gap-2">
                  <Link to={`/user/${post.userId}`} className="block">
                    <img
                      src={
                        post.user?.avatarUrl ||
                        "https://ui-avatars.com/api/?name=User"
                      }
                      alt={post.user?.fullName || "User"}
                      className="w-8 h-8 rounded-full border border-blue-500 min-w-[32px] min-h-[32px]"
                    />
                  </Link>
                  <div className="flex flex-col">
                    <Link to={`/user/${post.userId}`} className="block">
                      <span className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
                        {post.user?.fullName ||
                          post.user?.userName ||
                          "Người dùng"}
                      </span>
                    </Link>
                    <span className="text-xs text-gray-500">
                      {formatTimeAgo(post.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <span>👁️</span>
                    {post._count?.views || post.viewsInPeriod || 0}
                  </span>
                  <span className="flex items-center gap-1">
                    <span>❤️</span>
                    {post._count?.likes || post.likesInPeriod || 0}
                  </span>
                  <span className="flex items-center gap-1">
                    <span>💬</span>
                    {post._count?.comments || 0}
                  </span>
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
};

export default PostList;

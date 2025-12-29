import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ThumbsUp,
  MessageSquare,
  Share2,
  Bookmark,
  MoreHorizontal,
  Flag,
} from "lucide-react";
import { toggleLike, toggleBookmark } from "@utils/postService";
import { useAuth } from "@context/AuthContext";
import { useToast } from "@context/ToastContext";
import BookmarkModal from "./BookmarkModal";
import ReportModal from "@components/common/ReportModal";

const PostCard = ({ post, onUpdate }) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { success, error: showError } = useToast();

  // Calculate if current user has liked/bookmarked from arrays
  const userHasLiked =
    currentUser && post?.likes?.some((like) => like.userId === currentUser.id);
  const userHasBookmarked =
    currentUser &&
    post?.bookmarks?.some((bookmark) => bookmark.userId === currentUser.id);

  // Local state for optimistic updates
  const [isLiked, setIsLiked] = useState(userHasLiked || false);
  const [likeCount, setLikeCount] = useState(
    post?.likes?.length || post?.likeCount || 0
  );
  const [isBookmarked, setIsBookmarked] = useState(userHasBookmarked || false);
  const [isLikeProcessing, setIsLikeProcessing] = useState(false);
  const [isBookmarkProcessing, setIsBookmarkProcessing] = useState(false);
  const [showBookmarkModal, setShowBookmarkModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showPostMenu, setShowPostMenu] = useState(false);

  // Format time ago
  const getTimeAgo = (timestamp) => {
    const postTime = new Date(timestamp);
    const now = new Date();
    const diffInMs = now - postTime;
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays > 0) return `${diffInDays} ngày trước`;
    if (diffInHours > 0) return `${diffInHours} giờ trước`;
    if (diffInMinutes > 0) return `${diffInMinutes} phút trước`;
    return "Vừa xong";
  };

  // Truncate content
  const truncateContent = (content, maxLength = 150) => {
    if (!content) return "";
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  // Handle like toggle
  const handleLikeToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!currentUser) {
      showError("Vui lòng đăng nhập để thích bài viết");
      navigate("/?login=true");
      return;
    }

    if (isLikeProcessing) return;

    // Optimistic update
    const newLikeState = !isLiked;
    const previousLikeState = isLiked;
    const previousLikeCount = likeCount;

    setIsLiked(newLikeState);
    setLikeCount((prev) => (newLikeState ? prev + 1 : Math.max(0, prev - 1)));
    setIsLikeProcessing(true);

    try {
      const result = await toggleLike(post.id, previousLikeState);

      if (!result.success) {
        // Rollback on error
        setIsLiked(previousLikeState);
        setLikeCount(previousLikeCount);

        if (result.needsAuth) {
          navigate("/?login=true");
        } else if (!result.alreadyLiked && !result.notLiked) {
          showError(result.error || "Có lỗi xảy ra");
        }
      } else {
        // Notify parent component if needed
        onUpdate?.({
          ...post,
          isLikedByCurrentUser: newLikeState,
          likeCount: newLikeState ? likeCount + 1 : likeCount - 1,
        });
      }
    } catch (err) {
      // Rollback on error
      setIsLiked(previousLikeState);
      setLikeCount(previousLikeCount);
      showError("Lỗi kết nối mạng");
      console.error("Error toggling like:", err);
    } finally {
      setIsLikeProcessing(false);
    }
  };

  // Handle bookmark toggle
  const handleBookmarkToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!currentUser) {
      showError("Vui lòng đăng nhập để lưu bài viết");
      navigate("/?login=true");
      return;
    }

    // If already bookmarked, remove it directly
    if (isBookmarked) {
      if (isBookmarkProcessing) return;

      const previousBookmarkState = isBookmarked;
      setIsBookmarked(false);
      setIsBookmarkProcessing(true);

      try {
        const result = await toggleBookmark(post.id, previousBookmarkState);

        if (result.success) {
          success("Đã bỏ lưu bài viết");
          onUpdate?.({ ...post, isBookmarkedByCurrentUser: false });
        } else {
          // Rollback on error
          setIsBookmarked(previousBookmarkState);
          if (result.needsAuth) {
            navigate("/?login=true");
          } else if (!result.notBookmarked) {
            showError(result.error || "Có lỗi xảy ra");
          }
        }
      } catch (err) {
        setIsBookmarked(previousBookmarkState);
        showError("Lỗi kết nối mạng");
        console.error("Error toggling bookmark:", err);
      } finally {
        setIsBookmarkProcessing(false);
      }
    } else {
      // If not bookmarked, show modal to choose collection
      setShowBookmarkModal(true);
    }
  };

  // Handle bookmark success from modal
  const handleBookmarkSuccess = () => {
    setIsBookmarked(true);
    onUpdate?.({ ...post, isBookmarkedByCurrentUser: true });
  };

  if (!post) return null;

  const author = post.user || post.author || {};
  const authorName = author.fullName || author.userName || "Người dùng";
  const authorAvatar =
    author.avatarUrl || "https://ui-avatars.com/api/?name=User";
  const timeAgo = getTimeAgo(post.createdAt || post.time || Date.now());

  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to={`/user/${post.userId || author.id}`} className="block">
            <img
              src={authorAvatar}
              alt={authorName}
              className="w-10 h-10 rounded-full border-2 border-blue-500"
            />
          </Link>
          <div>
            <Link
              to={`/user/${post.userId || author.id}`}
              className="font-semibold text-gray-900 hover:text-blue-600 transition-colors"
            >
              {authorName}
            </Link>
            <p className="text-xs text-gray-500">{timeAgo}</p>
          </div>
        </div>
        {currentUser && post.userId !== currentUser.id && (
          <div className="relative">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowPostMenu(!showPostMenu);
              }}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <MoreHorizontal size={20} className="text-gray-600" />
            </button>

            {showPostMenu && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setShowPostMenu(false)}
                />
                <div className="absolute right-0 top-10 z-40 bg-white border border-gray-200 rounded-lg shadow-xl overflow-visible min-w-[120px] max-h-none">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowReportModal(true);
                      setShowPostMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Flag size={16} />
                    Báo cáo
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <Link to={`/post/${post.id}`} className="block">
        {post.title && (
          <div className="px-4 pb-2">
            <h3 className="font-bold text-lg text-gray-900 hover:text-blue-600 transition-colors line-clamp-2">
              {post.title}
            </h3>
          </div>
        )}

        {(post.content || post.contentText) && (
          <div className="px-4 pb-3">
            <p className="text-gray-600 text-sm line-clamp-3">
              {truncateContent(post.contentText || post.content)}
            </p>
          </div>
        )}

        {post.image && (
          <div className="w-full">
            <img
              src={post.image}
              alt={post.title || "Post image"}
              className="w-full h-auto object-cover max-h-96"
            />
          </div>
        )}
      </Link>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="px-4 py-2 border-t border-gray-100">
          <div className="flex flex-wrap gap-2">
            {post.tags.map(({ tag }) => (
              <button
                key={tag.id}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  navigate(`/tag/${tag.id}`);
                }}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors cursor-pointer"
              >
                #{tag.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center justify-around">
          <button
            onClick={handleLikeToggle}
            disabled={isLikeProcessing}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
              isLiked
                ? "bg-blue-50 text-blue-600 hover:bg-blue-100"
                : "hover:bg-gray-100 text-gray-600"
            } ${isLikeProcessing ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <ThumbsUp size={18} className={isLiked ? "fill-current" : ""} />
            <span className="text-sm font-medium">{likeCount}</span>
          </button>

          <Link
            to={`/post/${post.id}#comments`}
            className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
          >
            <MessageSquare size={18} />
            <span className="text-sm font-medium">
              {post.comments?.length || post.commentCount || 0}
            </span>
          </Link>

          <button className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600">
            <Share2 size={18} />
            <span className="text-sm font-medium">Chia sẻ</span>
          </button>

          <button
            onClick={handleBookmarkToggle}
            disabled={isBookmarkProcessing}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
              isBookmarked
                ? "bg-yellow-50 text-yellow-600 hover:bg-yellow-100"
                : "hover:bg-gray-100 text-gray-600"
            } ${isBookmarkProcessing ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <Bookmark
              size={18}
              className={isBookmarked ? "fill-current" : ""}
            />
          </button>
        </div>
      </div>

      {/* Bookmark Modal */}
      <BookmarkModal
        isOpen={showBookmarkModal}
        onClose={() => setShowBookmarkModal(false)}
        postId={post.id}
        onBookmarkSuccess={handleBookmarkSuccess}
      />

      {/* Report Modal */}
      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        postId={post.id}
      />
    </article>
  );
};

export default PostCard;

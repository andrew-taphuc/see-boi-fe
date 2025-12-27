import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Share2,
  ThumbsUp,
  MessageSquare,
  // Heart, // Not used in the code
  Bookmark,
  Eye,
} from "lucide-react";
import axiosInstance from "@utils/axiosInstance";
import FollowButton from "../components/userProfile/FollowButton";
import TiptapViewer from "@components/richtext/TiptapViewer";
import CommentList from "@components/comments/CommentList";
import { useAuth } from "@context/AuthContext";
import { toggleLike, toggleBookmark } from "@utils/postService";
import { useToast } from "@context/ToastContext";
import BookmarkModal from "@components/socialMedia/BookmarkModal";

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { success, error: showError } = useToast();
  const [post, setPost] = useState(null);
  const [user, setUser] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [formattedDate, setFormattedDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Like & Bookmark state
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLikeProcessing, setIsLikeProcessing] = useState(false);
  const [isBookmarkProcessing, setIsBookmarkProcessing] = useState(false);
  const [showBookmarkModal, setShowBookmarkModal] = useState(false);

  // View tracking state
  const [viewStats, setViewStats] = useState({
    totalViews: 0,
    uniqueViews: 0,
    anonymousViews: 0,
  });

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const postId = parseInt(id);
      if (!postId || Number.isNaN(postId)) {
        setErrorMsg("ID bài viết không hợp lệ");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setErrorMsg("");
      try {
        const res = await axiosInstance.get(`/post/${postId}`);
        if (cancelled) return;
        const p = res.data;

        // Parse contentJson nếu là string
        if (p?.contentJson && typeof p.contentJson === "string") {
          try {
            p.contentJson = JSON.parse(p.contentJson);
          } catch (e) {
            console.error("Error parsing contentJson:", e);
            p.contentJson = null;
          }
        }

        setPost(p);
        setUser(p?.user || null);

        // Debug: Log để kiểm tra response từ backend
        console.log("Post data:", p);
        console.log("Current user:", currentUser);
        console.log("Likes array:", p?.likes);
        console.log("Bookmarks array:", p?.bookmarks);

        // Initialize like and bookmark states
        // Check if current user has liked the post by checking the likes array
        const userHasLiked =
          currentUser &&
          p?.likes?.some((like) => like.userId === currentUser.id);
        setIsLiked(userHasLiked || false);
        setLikeCount(p?.likes?.length || p?.likeCount || 0);

        // Check if current user has bookmarked the post
        const userHasBookmarked =
          currentUser &&
          p?.bookmarks?.some((bookmark) => bookmark.userId === currentUser.id);
        setIsBookmarked(userHasBookmarked || false);

        const postDate = new Date(p?.createdAt || Date.now());
        const formatted = postDate.toLocaleDateString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
        setFormattedDate(formatted);

        // Fetch view statistics
        try {
          const viewsRes = await axiosInstance.get(`/post/${postId}/views`);
          if (!cancelled && viewsRes?.data) {
            setViewStats({
              totalViews: viewsRes.data.totalViews || 0,
              uniqueViews: viewsRes.data.uniqueViews || 0,
              anonymousViews: viewsRes.data.anonymousViews || 0,
            });
          }
        } catch (viewErr) {
          console.error("Error fetching view stats:", viewErr);
          // Don't show error to user, just keep views at 0
        }
      } catch (e) {
        if (cancelled) return;
        const status = e?.response?.status;
        if (status === 404) setErrorMsg("Không tìm thấy bài viết");
        else
          setErrorMsg(
            e?.response?.data?.message ||
              "Không thể tải bài viết. Vui lòng thử lại."
          );
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [id, currentUser]);

  // Check follow status khi user hoặc currentUser thay đổi
  useEffect(() => {
    let cancelled = false;

    const checkFollowStatus = async () => {
      if (user?.id && currentUser?.id && user.id !== currentUser.id) {
        try {
          const isFollowingRes = await axiosInstance.get(
            `/user/${user.id}/is-following`
          );
          if (!cancelled && isFollowingRes?.data) {
            setIsFollowing(isFollowingRes.data.isFollowing || false);
          }
        } catch (err) {
          console.error("Error checking follow status:", err);
          if (!cancelled) {
            setIsFollowing(false);
          }
        }
      } else {
        setIsFollowing(false);
      }
    };

    checkFollowStatus();
    return () => {
      cancelled = true;
    };
  }, [user?.id, currentUser?.id]);

  // Handle like toggle
  const handleLikeToggle = async () => {
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
      const result = await toggleLike(parseInt(id), previousLikeState);

      if (!result.success) {
        // Rollback on error
        setIsLiked(previousLikeState);
        setLikeCount(previousLikeCount);

        if (result.needsAuth) {
          navigate("/?login=true");
        } else if (!result.alreadyLiked && !result.notLiked) {
          showError(result.error || "Có lỗi xảy ra");
        }
      }
    } catch (error) {
      // Rollback on error
      setIsLiked(previousLikeState);
      setLikeCount(previousLikeCount);
      showError("Lỗi kết nối mạng");
      // rename "err" to "error"
      console.error("Error toggling like:", error);
    } finally {
      setIsLikeProcessing(false);
    }
  };

  // Handle bookmark toggle
  const handleBookmarkToggle = async () => {
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
        const result = await toggleBookmark(
          parseInt(id),
          previousBookmarkState
        );

        if (result.success) {
          success("Đã bỏ lưu bài viết");
        } else {
          // Rollback on error
          setIsBookmarked(previousBookmarkState);
          if (result.needsAuth) {
            navigate("/?login=true");
          } else if (!result.notBookmarked) {
            showError(result.error || "Có lỗi xảy ra");
          }
        }
      } catch (error) {
        setIsBookmarked(previousBookmarkState);
        showError("Lỗi kết nối mạng");
        console.error("Error toggling bookmark:", error);
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
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Đang tải bài viết...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">{errorMsg || "Không tìm thấy bài viết"}</p>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Quay lại</span>
        </button>

        {/* Single white container for all content */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Thread Title */}
          {post.title && (
            <div className="p-6">
              <h1 className="text-2xl font-bold text-gray-900 leading-tight">
                {post.title}
              </h1>
            </div>
          )}

          {/* Thread Info */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Link
                  to={user?.id ? `/user/${user.id}` : "#"}
                  className="block"
                >
                  <div
                    className="w-12 h-12 rounded-full border-2 border-blue-500 bg-cover bg-center"
                    style={{ backgroundImage: `url(${user?.avatarUrl || ""})` }}
                  />
                </Link>
                <div>
                  <div className="flex items-center gap-2">
                    <Link
                      to={user?.id ? `/user/${user.id}` : "#"}
                      className="font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                    >
                      {user?.fullName || user?.userName || "Người dùng"}
                    </Link>
                    <FollowButton
                      userId={user?.id}
                      initialIsFollowing={isFollowing}
                      onFollowChange={setIsFollowing}
                      size="sm"
                    />
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                    <span>{formattedDate}</span>
                    {/* View count */}
                    <div className="flex items-center gap-1 text-gray-500">
                      <Eye size={16} />
                      <span>
                        {viewStats.totalViews.toLocaleString()} lượt xem
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <Share2 size={20} className="text-gray-600" />
                </button>
              </div>
            </div>
          </div>

          {/* Thread Cover Image */}
          {post.thumbnailUrl && (
            <div className="w-full overflow-hidden">
              <img
                src={post.thumbnailUrl}
                alt={post.title}
                className="w-full h-auto object-cover"
              />
            </div>
          )}

          {/* Article Content */}
          <article className="p-6 border-b border-gray-200">
            <div className="prose max-w-none">
              {post?.contentJson && typeof post.contentJson === "object" ? (
                <TiptapViewer contentJson={post.contentJson} />
              ) : post?.contentText || post?.content ? (
                <div className="text-gray-800 leading-relaxed whitespace-pre-line text-base">
                  {(post.contentText || post.content || "")
                    .split("\n")
                    .map((paragraph, index) => (
                      <p key={index} className="mb-4">
                        {paragraph}
                      </p>
                    ))}
                </div>
              ) : (
                <div className="text-gray-500 italic">Không có nội dung</div>
              )}
            </div>
          </article>

          {/* Actions */}
          <div className="p-4">
            <div className="flex items-center justify-around">
              <button
                onClick={handleLikeToggle}
                disabled={isLikeProcessing}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  isLiked
                    ? "bg-blue-50 text-blue-600 hover:bg-blue-100"
                    : "hover:bg-gray-100 text-gray-600"
                } ${isLikeProcessing ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <ThumbsUp size={20} className={isLiked ? "fill-current" : ""} />
                <span className="font-medium">
                  {likeCount} {isLiked ? "đã thích" : "lượt thích"}
                </span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors">
                <MessageSquare size={20} className="text-gray-600" />
                <span className="font-medium text-gray-600">Bình luận</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Share2 size={20} className="text-gray-600" />
                <span className="font-medium text-gray-600">Chia sẻ</span>
              </button>
              <button
                onClick={handleBookmarkToggle}
                disabled={isBookmarkProcessing}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  isBookmarked
                    ? "bg-yellow-50 text-yellow-600 hover:bg-yellow-100"
                    : "hover:bg-gray-100 text-gray-600"
                } ${
                  isBookmarkProcessing ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <Bookmark
                  size={20}
                  className={isBookmarked ? "fill-current" : ""}
                />
                <span className="font-medium">
                  {isBookmarked ? "Đã lưu" : "Lưu"}
                </span>
              </button>
            </div>
          </div>

          {/* Comments Section */}
          <CommentList postId={parseInt(id)} />
        </div>
      </div>

      {/* Bookmark Modal */}
      <BookmarkModal
        isOpen={showBookmarkModal}
        onClose={() => setShowBookmarkModal(false)}
        postId={parseInt(id)}
        onBookmarkSuccess={handleBookmarkSuccess}
      />
    </>
  );
};

export default PostDetail;

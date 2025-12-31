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
  Edit,
  Trash2,
  Lock,
  Users,
  Flag,
  MoreVertical,
} from "lucide-react";
import axiosInstance from "@utils/axiosInstance";
import FollowButton from "../components/userProfile/FollowButton";
import TiptapViewer from "@components/richtext/TiptapViewer";
import CommentList from "@components/comments/CommentList";
import { useAuth } from "@context/AuthContext";
import { toggleLike, toggleBookmark } from "@utils/postService";
import { useToast } from "@context/ToastContext";
import BookmarkModal from "@components/socialMedia/BookmarkModal";
import PollDisplay from "@components/posts/PollDisplay";
import ReportModal from "@components/common/ReportModal";
import ThumbnailImage from "@components/posts/ThumbnailImage";
import CommonFooter from "@components/common/CommonFooter";
import AuthorSidebar from "@components/posts/AuthorSidebar";
import RelatedPosts from "@components/posts/RelatedPosts";

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
  const [isLoadingNewPost, setIsLoadingNewPost] = useState(false);
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

  // Delete confirmation state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Report modal state
  const [showReportModal, setShowReportModal] = useState(false);
  const [showPostMenu, setShowPostMenu] = useState(false);

  // Scroll về đầu trang khi vào trang hoặc khi postId thay đổi
  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [id]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const postId = parseInt(id);
      if (!postId || Number.isNaN(postId)) {
        setErrorMsg("ID bài viết không hợp lệ");
        setIsLoading(false);
        setIsLoadingNewPost(false);
        return;
      }

      // Nếu đã có post (đang chuyển sang post khác), chỉ set loading overlay
      if (post) {
        setIsLoadingNewPost(true);
      } else {
        setIsLoading(true);
      }
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
        if (!cancelled) {
          setIsLoading(false);
          setIsLoadingNewPost(false);
        }
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

  // Refetch post data (e.g., after voting)
  const refetchPost = async () => {
    try {
      const postId = parseInt(id);
      const res = await axiosInstance.get(`/post/${postId}`);
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
    } catch (error) {
      console.error("Failed to refetch post:", error);
    }
  };

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

  // Handle delete post
  const handleDeletePost = async () => {
    if (isDeleting) return;

    setIsDeleting(true);
    try {
      await axiosInstance.delete(`/post/${id}`);
      success("Đã xóa bài viết thành công");
      setShowDeleteModal(false);
      // Redirect về trang UserProfile của user sau khi xóa
      setTimeout(() => {
        navigate(`/user/${post.userId}`);
      }, 500);
    } catch (err) {
      console.error("Error deleting post:", err);
      showError(
        err?.response?.data?.message ||
          "Không thể xóa bài viết. Vui lòng thử lại."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  // Ngăn overscroll và đặt background trắng
  useEffect(() => {
    const originalBodyBg = document.body.style.backgroundColor;
    const originalHtmlBg = document.documentElement.style.backgroundColor;
    const originalBodyOverscroll = document.body.style.overscrollBehavior;
    const originalHtmlOverscroll = document.documentElement.style.overscrollBehavior;
    
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
      <div className="min-h-screen bg-white relative" style={{ overscrollBehavior: 'none' }}>
        {/* Loading overlay khi đang load post mới */}
        {isLoadingNewPost && post && (
          <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="text-gray-600 font-medium">Đang tải bài viết...</p>
            </div>
          </div>
        )}
        {/* Back button - Fixed (dưới header 64px + padding 16px = 80px) */}
        <button
          onClick={() => navigate(-1)}
          className="fixed top-20 left-4 z-50 flex items-center gap-2 px-4 py-2 bg-white text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg shadow-md transition-all duration-200"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">Quay lại</span>
        </button>

        {/* Sidebar bên trái - Tạm thời ẩn */}
        {/* {post.userId && (
          <div className="fixed top-28 left-4 w-80 max-h-[calc(100vh-7rem)] overflow-y-auto z-40">
            <AuthorSidebar 
              authorId={post.userId} 
              currentUserId={currentUser?.id}
            />
          </div>
        )} */}

        {/* Content chính - Centered */}
        <div className="max-w-4xl mx-auto px-4 pt-4 pb-6">
              {/* Single white container for all content */}
              <div className="bg-white overflow-hidden">
          {/* Thread Title */}
          {post.title && (
            <div className="p-6">
              <h1 className="text-2xl font-bold text-gray-900 leading-tight">
                {post.title}
              </h1>
            </div>
          )}

          {/* Thread Info */}
          <div className="p-4">
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
                {/* Visibility badge và Edit/Delete buttons - chỉ hiện cho chủ bài viết */}
                {currentUser && post.userId === currentUser.id && (
                  <>
                    {/* Visibility Badge */}
                    <div
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium
                      ${post.visibility === 'PUBLIC' ? 'bg-green-50 text-green-700' : ''}
                      ${post.visibility === 'FOLLOWERS' ? 'bg-blue-50 text-blue-700' : ''}
                      ${post.visibility === 'PRIVATE' ? 'bg-gray-100 text-gray-700' : ''}"
                    >
                      {post.visibility === "PUBLIC" && (<><Eye size={16} /><span>Công khai</span></>)}
                      {post.visibility === "FOLLOWERS" && (<><Users size={16} /><span>Người theo dõi</span></>)}
                      {post.visibility === "PRIVATE" && (<><Lock size={16} /><span>Chỉ mình tôi</span></>)}
                    </div>
                    <button
                      onClick={() => navigate(`/post/${id}/edit`)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                      title="Chỉnh sửa bài viết"
                    >
                      <Edit size={20} className="text-gray-600" />
                    </button>
                    <button
                      onClick={() => setShowDeleteModal(true)}
                      className="p-2 hover:bg-red-50 rounded-full transition-colors"
                      title="Xóa bài viết"
                    >
                      <Trash2 size={20} className="text-red-600" />
                    </button>
                  </>
                )}

                {/* Report button - chỉ hiện cho người không phải tác giả */}
                {currentUser && post.userId !== currentUser.id && (
                  <div className="relative">
                    <button
                      onClick={() => setShowPostMenu(!showPostMenu)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                      title="Tùy chọn"
                    >
                      <MoreVertical size={20} className="text-gray-600" />
                    </button>

                    {showPostMenu && (
                      <>
                        <div
                          className="fixed inset-0 z-30"
                          onClick={() => setShowPostMenu(false)}
                        />
                        <div className="absolute right-0 top-10 z-40 bg-white border border-gray-200 rounded-lg shadow-xl overflow-visible min-w-[120px] max-h-none">
                          <button
                            onClick={() => {
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
            </div>
          </div>

          {/* Thread Cover Image */}
          {post.thumbnailUrl && (
            <ThumbnailImage
              src={post.thumbnailUrl}
              alt={post.title}
              className="w-full h-auto object-cover rounded-xl"
            />
          )}

          {/* Article Content hoặc Poll */}
          <article className="p-6">
            {/* Hiển thị nội dung (cho cả POLL và NORMAL) */}
            {(post?.contentJson && typeof post.contentJson === "object") ||
            post?.contentText ||
            post?.content ? (
              <div className="prose max-w-none mb-6">
                {post?.contentJson && typeof post.contentJson === "object" ? (
                  <TiptapViewer contentJson={post.contentJson} />
                ) : (
                  <div className="text-gray-800 leading-relaxed whitespace-pre-line text-base">
                    {(post.contentText || post.content || "")
                      .split("\n")
                      .map((paragraph, index) => (
                        <p key={index} className="mb-4">
                          {paragraph}
                        </p>
                      ))}
                  </div>
                )}
              </div>
            ) : null}

            {/* Hiển thị Poll nếu có */}
            {post.type === "POLL" && post.poll && (
              <PollDisplay
                pollId={post.poll.id}
                expiresAt={post.poll.expiresAt}
                options={post.poll.options || []}
                userVotedOptionId={post.poll.userVotedOptionId || null}
                onVoteSuccess={refetchPost}
              />
            )}

            {/* Hiển thị thông báo nếu không có content và không có poll */}
            {!(
              (post?.contentJson && typeof post.contentJson === "object") ||
              post?.contentText ||
              post?.content
            ) &&
              !(post.type === "POLL" && post.poll) && (
                <div className="text-gray-500 italic">Không có nội dung</div>
              )}
          </article>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="px-6 py-3">
              <div className="flex flex-wrap gap-2">
                {post.tags.map(({ tag }) => (
                  <button
                    key={tag.id}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      navigate(`/tag/${tag.id}`);
                    }}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-sm hover:shadow-lg transition-shadow cursor-pointer"
                  >
                    #{tag.name}
                  </button>
                ))}
              </div>
            </div>
          )}

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

          {/* Related Posts Section - Dưới comment */}
          <div className="mt-8">
            <RelatedPosts postId={parseInt(id)} limit={5} />
          </div>
        </div>
        
        {/* Footer */}
        <CommonFooter variant="social" />
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Xác nhận xóa bài viết
            </h3>
            <p className="text-gray-600 mb-6">
              Bạn có chắc chắn muốn xóa bài viết này? Hành động này không thể
              hoàn tác.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                onClick={handleDeletePost}
                disabled={isDeleting}
                className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    Đang xóa...
                  </>
                ) : (
                  "Xóa bài viết"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bookmark Modal */}
      <BookmarkModal
        isOpen={showBookmarkModal}
        onClose={() => setShowBookmarkModal(false)}
        postId={parseInt(id)}
        onBookmarkSuccess={handleBookmarkSuccess}
      />

      {/* Report Modal */}
      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        postId={parseInt(id)}
      />
    </>
  );
};

export default PostDetail;

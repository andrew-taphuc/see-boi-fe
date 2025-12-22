import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  MoreVertical,
  Edit2,
  Trash2,
  Check,
  X,
  ThumbsUp,
  ThumbsDown,
  Reply,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../utils/axiosInstance";
import CommentInput from "./CommentInput";

const CommentItem = ({ comment, onEdit, onDelete, onReply, level = 0 }) => {
  const { currentUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [showMenu, setShowMenu] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [showAllReplies, setShowAllReplies] = useState(false);
  const [votes, setVotes] = useState(
    comment.voteCounts || { upvotes: 0, downvotes: 0, total: 0 }
  );
  const [userVote, setUserVote] = useState(null); // 'up', 'down', or null

  // Normalize user IDs for comparison
  const normalizeId = (user) => {
    if (!user) return null;
    // Handle both object and primitive values
    if (typeof user === "object") {
      return user._id || user.id;
    }
    return user;
  };

  const currentUserId = normalizeId(currentUser);
  // BE returns userId as number, user as object
  const commentUserId = comment.userId || normalizeId(comment.user);

  // Check if current user is the comment author
  // Use == for comparison to handle string vs number
  const isAuthor =
    currentUserId && commentUserId && currentUserId == commentUserId;

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Vừa xong";
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 7) return `${diffDays} ngày trước`;

    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleSaveEdit = async () => {
    if (!editContent.trim()) {
      alert("Nội dung không được để trống");
      return;
    }

    try {
      await onEdit(comment.id || comment._id, editContent.trim());
      setIsEditing(false);
      setShowMenu(false);
    } catch (error) {
      console.error("Error editing comment:", error);
      alert("Không thể sửa bình luận. Vui lòng thử lại.");
    }
  };

  const handleCancelEdit = () => {
    setEditContent(comment.content);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (!window.confirm("Bạn có chắc muốn xóa bình luận này?")) {
      return;
    }

    setIsDeleting(true);
    try {
      await onDelete(comment.id || comment._id);
      setShowMenu(false);
    } catch (error) {
      console.error("Error deleting comment:", error);
      alert("Không thể xóa bình luận. Vui lòng thử lại.");
      setIsDeleting(false);
    }
  };

  // Handle upvote/downvote
  const handleVote = async (voteType) => {
    try {
      const endpoint = voteType === "up" ? "upvote" : "downvote";
      await axiosInstance.post(`/comment/${comment.id}/${endpoint}`);

      // Update local vote state
      if (userVote === voteType) {
        // Un-vote
        setUserVote(null);
        setVotes((prev) => ({
          ...prev,
          [voteType === "up" ? "upvotes" : "downvotes"]:
            prev[voteType === "up" ? "upvotes" : "downvotes"] - 1,
          total: prev.total + (voteType === "up" ? -1 : 1),
        }));
      } else {
        // New vote or change vote
        setUserVote(voteType);
        const oldVote = userVote;
        setVotes((prev) => {
          let newVotes = { ...prev };
          if (oldVote) {
            // Remove old vote
            newVotes[oldVote === "up" ? "upvotes" : "downvotes"]--;
            newVotes.total += oldVote === "up" ? -1 : 1;
          }
          // Add new vote
          newVotes[voteType === "up" ? "upvotes" : "downvotes"]++;
          newVotes.total += voteType === "up" ? 1 : -1;
          return newVotes;
        });
      }
    } catch (error) {
      console.error("Error voting:", error);
      alert("Không thể vote. Vui lòng thử lại.");
    }
  };

  // Handle reply submission
  const handleReplySubmit = async (content, isAnonymous) => {
    try {
      await onReply(content, isAnonymous, comment.id || comment._id);
      setIsReplying(false);
    } catch (error) {
      console.error("Error replying:", error);
      throw error;
    }
  };

  // Get user info from comment
  // Use displayName from BE if available (handles anonymous + isOwner logic)
  const displayName =
    comment.displayName ||
    (comment.isAnonymous
      ? "Ẩn danh"
      : comment.isOwner
      ? "Bạn"
      : comment.user?.fullName ||
        comment.user?.name ||
        comment.user?.userName ||
        "Người dùng");

  const avatarUrl = comment.isAnonymous
    ? ""
    : comment.user?.avatarUrl || comment.user?.avatar || "";
  const userId = comment.user?.id || comment.user?._id;

  return (
    <>
      <div
        className={`flex gap-3 p-4 hover:bg-gray-50 transition-colors relative overflow-visible ${
          isDeleting ? "opacity-50" : ""
        }`}
        style={{ marginLeft: level > 0 ? `${level * 40}px` : "0" }}
      >
        {/* Avatar */}
        <Link
          to={userId && !comment.isAnonymous ? `/user/${userId}` : "#"}
          className="flex-shrink-0"
        >
          <div
            className="w-10 h-10 rounded-full bg-gray-300 bg-cover bg-center"
            style={{
              backgroundImage: avatarUrl ? `url(${avatarUrl})` : "none",
              backgroundColor: avatarUrl ? "transparent" : "#e5e7eb",
            }}
          >
            {!avatarUrl && (
              <div className="w-full h-full flex items-center justify-center text-gray-600 font-semibold">
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        </Link>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Link
                  to={userId && !comment.isAnonymous ? `/user/${userId}` : "#"}
                  className="font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                >
                  {displayName}
                </Link>
                <span className="text-xs text-gray-500">
                  {formatDate(comment.createdAt)}
                  {comment.updatedAt !== comment.createdAt}
                </span>
              </div>

              {/* Edit mode */}
              {isEditing ? (
                <div className="mt-2">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows="3"
                    autoFocus
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={handleSaveEdit}
                      className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      <Check size={16} />
                      Lưu
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="flex items-center gap-1 px-3 py-1.5 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      <X size={16} />
                      Hủy
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-gray-800 text-sm whitespace-pre-wrap break-words">
                    {comment.content}
                  </p>

                  {/* Voting and Reply buttons */}
                  <div className="flex items-center gap-4 mt-2">
                    {/* Upvote */}
                    <button
                      onClick={() => handleVote("up")}
                      className={`flex items-center gap-1 text-xs transition-colors ${
                        userVote === "up"
                          ? "text-blue-600 font-semibold"
                          : "text-gray-500 hover:text-blue-600"
                      }`}
                    >
                      <ThumbsUp
                        size={14}
                        fill={userVote === "up" ? "currentColor" : "none"}
                      />
                      <span>{votes.upvotes}</span>
                    </button>

                    {/* Downvote */}
                    <button
                      onClick={() => handleVote("down")}
                      className={`flex items-center gap-1 text-xs transition-colors ${
                        userVote === "down"
                          ? "text-red-600 font-semibold"
                          : "text-gray-500 hover:text-red-600"
                      }`}
                    >
                      <ThumbsDown
                        size={14}
                        fill={userVote === "down" ? "currentColor" : "none"}
                      />
                      <span>{votes.downvotes}</span>
                    </button>

                    {/* Score */}
                    <span className="text-xs text-gray-500">
                      Điểm: {votes.total}
                    </span>

                    {/* Reply button - only for root comments */}
                    {level === 0 && (
                      <button
                        onClick={() => setIsReplying(!isReplying)}
                        className="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-600 transition-colors"
                      >
                        <Reply size={14} />
                        <span>Phản hồi</span>
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Menu for author */}
            {isAuthor && !isEditing && (
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <MoreVertical size={16} className="text-gray-600" />
                </button>

                {showMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-30"
                      onClick={() => setShowMenu(false)}
                    />
                    <div className="absolute right-0 top-8 z-40 bg-white border border-gray-200 rounded-lg shadow-xl overflow-visible min-w-[120px] max-h-none">
                      <button
                        onClick={() => {
                          setIsEditing(true);
                          setShowMenu(false);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <Edit2 size={16} />
                        Sửa
                      </button>
                      {level === 0 && (
                        <button
                          onClick={() => {
                            setIsReplying(true);
                            setShowMenu(false);
                          }}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          <Reply size={16} />
                          Phản hồi
                        </button>
                      )}
                      <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={16} />
                        Xóa
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reply Input */}
      {isReplying && (
        <div
          style={{ marginLeft: level > 0 ? `${(level + 1) * 20}px` : "20px" }}
          className="p-4 pt-0"
        >
          <CommentInput
            onSubmit={handleReplySubmit}
            placeholder="Viết phản hồi..."
            buttonText="Trả lời"
            onCancel={() => setIsReplying(false)}
          />
        </div>
      )}

      {/* Nested Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <>
          {/* Show first 2-3 replies or all if expanded */}
          {(showAllReplies ? comment.replies : comment.replies.slice(0, 3)).map(
            (reply) => (
              <CommentItem
                key={reply.id || reply._id}
                comment={reply}
                onEdit={onEdit}
                onDelete={onDelete}
                onReply={onReply}
                level={level + 1}
              />
            )
          )}

          {/* Show "View all" button if there are more than 3 replies */}
          {!showAllReplies && comment.replies.length > 3 && (
            <div
              style={{
                marginLeft: level > 0 ? `${(level + 1) * 20}px` : "20px",
              }}
              className="p-4 pt-2"
            >
              <button
                onClick={() => setShowAllReplies(true)}
                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                <ChevronDown size={16} />
                Hiển thị tất cả phản hồi
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default CommentItem;

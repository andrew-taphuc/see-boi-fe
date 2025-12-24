import React, { useState, useEffect } from "react";
import { MessageSquare, ChevronDown, ArrowUpDown } from "lucide-react";
import CommentItem from "./CommentItem";
import CommentInput from "./CommentInput";
import axiosInstance from "@utils/axiosInstance";
import { getSocket } from "@utils/socket";

const CommentList = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [totalComments, setTotalComments] = useState(0); // Tổng tất cả comments (gốc + reply) - hiển thị trên UI
  const [totalRootComments, setTotalRootComments] = useState(0); // Tổng comment gốc - dùng cho pagination
  const [displayedCount, setDisplayedCount] = useState(5);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState("score"); // score, newest, oldest

  // Fetch comments
  const fetchComments = async (limit = 10, sort = sortBy) => {
    try {
      setIsLoading(true);
      setError("");

      // Get comments
      const response = await axiosInstance.get(`/post/${postId}/comments`, {
        params: { take: limit, skip: 0, sort },
      });

      setComments(response.data.comments || response.data || []);

      // Get total count from pagination
      setTotalComments(
        response.data.pagination?.totalComments ||
          response.data.totalComments ||
          (response.data.comments || response.data).length
      );

      // Get total root comments for pagination
      setTotalRootComments(
        response.data.pagination?.total ||
          (response.data.comments || response.data).length
      );
    } catch (err) {
      console.error("Error fetching comments:", err);
      setError("Không thể tải bình luận. Vui lòng thử lại.");
      setComments([]);
      setTotalComments(0);
    } finally {
      setIsLoading(false);
    }
  };

  // Load more comments
  const loadMoreComments = async () => {
    setIsLoadingMore(true);
    const newLimit = displayedCount + 10;
    setDisplayedCount(newLimit);

    try {
      const response = await axiosInstance.get(`/post/${postId}/comments`, {
        params: { take: newLimit, skip: 0, sort: sortBy },
      });
      setComments(response.data.comments || response.data || []);

      // Update totals if needed
      if (response.data.pagination?.totalComments) {
        setTotalComments(response.data.pagination.totalComments);
      }
      if (response.data.pagination?.total) {
        setTotalRootComments(response.data.pagination.total);
      }
    } catch (err) {
      console.error("Error loading more comments:", err);
      alert("Không thể tải thêm bình luận");
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Add new comment
  const handleAddComment = async (
    content,
    isAnonymous = false,
    parentId = null,
    images = []
  ) => {
    try {
      let response;

      if (parentId) {
        // REPLY: Dùng endpoint /comment/{id}/reply
        if (images && images.length > 0) {
          // Reply với ảnh - dùng FormData
          const formData = new FormData();
          formData.append("content", content);
          formData.append("isAnonymous", isAnonymous.toString());

          images.forEach((file) => {
            formData.append("images", file);
          });

          console.log(
            `📤 Replying to comment ${parentId} with ${images.length} images`
          );
          response = await axiosInstance.post(
            `/comment/${parentId}/reply`,
            formData
          );
        } else {
          // Reply không có ảnh - dùng JSON
          console.log(`📤 Replying to comment ${parentId} (no images)`);
          response = await axiosInstance.post(`/comment/${parentId}/reply`, {
            content,
            isAnonymous,
          });
        }
      } else {
        // ROOT COMMENT: Dùng endpoint /post/{id}/comment
        if (images && images.length > 0) {
          // Comment gốc với ảnh - dùng FormData
          const formData = new FormData();
          formData.append("content", content);
          formData.append("isAnonymous", isAnonymous.toString());

          images.forEach((file) => {
            formData.append("images", file);
          });

          console.log(`📤 Adding root comment with ${images.length} images`);
          response = await axiosInstance.post(
            `/post/${postId}/comment`,
            formData
          );
        } else {
          // Comment gốc không có ảnh - dùng JSON
          console.log(`📤 Adding root comment (no images)`);
          response = await axiosInstance.post(`/post/${postId}/comment`, {
            content,
            isAnonymous,
          });
        }
      }

      console.log("📦 Response:", response.data);
      const newComment = response.data.comment || response.data;

      if (images && images.length > 0) {
        console.log("📸 Comment with images:", newComment);
        console.log("📸 Images:", newComment.images);
      }

      if (parentId) {
        // If it's a reply, add to the parent comment's replies array
        setComments((prev) =>
          prev.map((c) => {
            if (c.id === parentId || c._id === parentId) {
              return {
                ...c,
                replies: [...(c.replies || []), newComment],
                _count: {
                  ...c._count,
                  replies: (c._count?.replies || 0) + 1,
                },
              };
            }
            return c;
          })
        );
      } else {
        // If it's a root comment, add to the beginning of the list
        setComments((prev) => [newComment, ...prev]);
        setDisplayedCount((prev) => prev + 1);
      }

      setTotalComments((prev) => prev + 1);
    } catch (err) {
      console.error("Error adding comment:", err);
      throw err; // Re-throw to let CommentInput handle the error
    }
  };

  // Edit comment
  const handleEditComment = async (commentId, newContent) => {
    try {
      const response = await axiosInstance.patch(`/comment/${commentId}`, {
        content: newContent,
      });

      const updatedComment = response.data.comment || response.data;

      // Update comment in the list (support both id and _id)
      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId || c._id === commentId
            ? { ...c, ...updatedComment }
            : c
        )
      );
    } catch (err) {
      console.error("Error editing comment:", err);
      throw err;
    }
  };

  // Delete comment
  const handleDeleteComment = async (commentId) => {
    try {
      await axiosInstance.delete(`/comment/${commentId}`);

      // Remove comment from the list (support both id and _id)
      setComments((prev) =>
        prev.filter((c) => c.id !== commentId && c._id !== commentId)
      );
      setTotalComments((prev) => Math.max(0, prev - 1));
      setDisplayedCount((prev) => Math.max(10, prev - 1));
    } catch (err) {
      console.error("Error deleting comment:", err);
      throw err;
    }
  };

  // Initial load
  useEffect(() => {
    if (postId) {
      fetchComments(5, sortBy); // Always start with 5
    }
  }, [postId, sortBy]); // Re-fetch when sort changes

  // Socket.io real-time updates
  useEffect(() => {
    if (!postId) return;

    const socket = getSocket();
    socket.connect();

    // Join post room
    socket.emit("joinPost", postId);

    // Listen for new comments
    socket.on("newComment", (newComment) => {
      console.log("New comment received via socket:", newComment);

      // Get current user from localStorage
      const currentUser = JSON.parse(
        localStorage.getItem("currentUser") || "{}"
      );
      const currentUserId = currentUser.id || currentUser._id;
      const commentUserId = newComment.userId || newComment.user?.id;

      // Skip if this comment is from the current user (they already added it locally)
      if (currentUserId && commentUserId && currentUserId == commentUserId) {
        console.log("Skipping own comment from socket (same user)");
        return;
      }

      // Only add if it's for this post and not already in list
      if (newComment.postId == postId) {
        setComments((prev) => {
          // Check if comment already exists
          const exists = prev.some(
            (c) =>
              (c.id && c.id === newComment.id) ||
              (c._id && c._id === newComment._id)
          );
          if (exists) {
            console.log("Comment already exists, skipping");
            return prev;
          }

          // Check if this is a reply (has parentId)
          if (newComment.parentId) {
            console.log("Adding reply to parent comment", newComment.parentId);
            // Add to parent comment's replies
            return prev.map((c) => {
              if (
                c.id === newComment.parentId ||
                c._id === newComment.parentId
              ) {
                return {
                  ...c,
                  replies: [...(c.replies || []), newComment],
                  _count: {
                    ...c._count,
                    replies: (c._count?.replies || 0) + 1,
                  },
                };
              }
              return c;
            });
          }

          console.log("Adding new root comment from socket");
          return [newComment, ...prev];
        });
        setTotalComments((prev) => prev + 1);
        if (!newComment.parentId) {
          setDisplayedCount((prev) => prev + 1);
        }
      }
    });

    // Listen for updated comments
    socket.on("updateComment", (updatedComment) => {
      console.log("Comment updated via socket:", updatedComment);

      setComments((prev) =>
        prev.map((c) =>
          c.id === updatedComment.id || c._id === updatedComment._id
            ? { ...c, ...updatedComment }
            : c
        )
      );
    });

    // Listen for deleted comments
    socket.on("deleteComment", (deletedCommentId) => {
      console.log("Comment deleted via socket:", deletedCommentId);

      setComments((prev) => {
        // Check if deleted comment is a root comment
        const isRootComment = prev.some(
          (c) => c.id === deletedCommentId || c._id === deletedCommentId
        );

        if (isRootComment) {
          // Remove root comment
          return prev.filter(
            (c) => c.id !== deletedCommentId && c._id !== deletedCommentId
          );
        } else {
          // Remove reply from parent's replies array
          return prev.map((c) => {
            if (c.replies && c.replies.length > 0) {
              const filteredReplies = c.replies.filter(
                (r) => r.id !== deletedCommentId && r._id !== deletedCommentId
              );
              if (filteredReplies.length !== c.replies.length) {
                return {
                  ...c,
                  replies: filteredReplies,
                  _count: {
                    ...c._count,
                    replies: (c._count?.replies || 0) - 1,
                  },
                };
              }
            }
            return c;
          });
        }
      });
      setTotalComments((prev) => Math.max(0, prev - 1));
    });

    // Cleanup on unmount
    return () => {
      socket.emit("leavePost", postId);
      socket.off("newComment");
      socket.off("updateComment");
      socket.off("deleteComment");
    };
  }, [postId]);

  // Debug log
  useEffect(() => {
    console.log("CommentList Debug:", {
      totalComments,
      totalRootComments,
      commentsLength: comments.length,
      displayedCount,
      hasMore: comments.length < totalRootComments,
    });
  }, [comments.length, totalComments, totalRootComments, displayedCount]);

  const hasMore = comments.length < totalRootComments;

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare size={20} className="text-gray-600" />
            <h3 className="font-semibold text-gray-900">
              Bình luận ({totalComments})
            </h3>
          </div>

          {/* Sort dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-300 rounded-lg bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="score">Theo điểm</option>
              <option value="newest">Mới nhất</option>
              <option value="oldest">Cũ nhất</option>
            </select>
          </div>
        </div>
      </div>

      {/* Comment Input */}
      <CommentInput onSubmit={handleAddComment} />

      {/* Comments List */}
      <div className="divide-y divide-gray-100 overflow-visible pb-11">
        {isLoading && comments.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <div className="animate-pulse">Đang tải bình luận...</div>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">
            {error}
            <button
              onClick={() => fetchComments(displayedCount)}
              className="block mx-auto mt-2 text-blue-500 hover:text-blue-600"
            >
              Thử lại
            </button>
          </div>
        ) : comments.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <MessageSquare size={48} className="mx-auto mb-2 text-gray-300" />
            <p>Chưa có bình luận nào</p>
            <p className="text-sm mt-1">Hãy là người đầu tiên bình luận!</p>
          </div>
        ) : (
          <>
            {comments.map((comment) => (
              <CommentItem
                key={comment.id || comment._id}
                comment={comment}
                onEdit={handleEditComment}
                onDelete={handleDeleteComment}
                onReply={handleAddComment}
              />
            ))}

            {/* Load More Button */}
            {hasMore && (
              <div className="p-4 text-center border-t border-gray-200">
                <button
                  onClick={loadMoreComments}
                  disabled={isLoadingMore}
                  className="inline-flex items-center gap-2 px-6 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors disabled:text-gray-400 disabled:cursor-not-allowed font-medium"
                >
                  {isLoadingMore ? (
                    <>
                      <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                      Đang tải...
                    </>
                  ) : (
                    <>
                      <ChevronDown size={20} />
                      Hiển thị thêm bình luận
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CommentList;

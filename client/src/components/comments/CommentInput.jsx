import React, { useState } from "react";
import { Send, UserX } from "lucide-react";
import { useAuth } from "@context/AuthContext";

const CommentInput = ({
  onSubmit,
  placeholder = "Viết bình luận...",
  parentId = null,
  buttonText = "Gửi",
  onCancel = null,
}) => {
  const { currentUser } = useAuth();
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim()) {
      alert("Vui lòng nhập nội dung bình luận");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(content.trim(), isAnonymous, parentId);
      setContent(""); // Clear input after successful submission
      setIsAnonymous(false); // Reset anonymous mode
    } catch (error) {
      console.error("Error submitting comment:", error);
      alert("Không thể gửi bình luận. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e) => {
    // Submit on Ctrl+Enter or Cmd+Enter
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      handleSubmit(e);
    }
  };

  if (!currentUser) {
    return (
      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <p className="text-center text-gray-600 text-sm">
          Vui lòng{" "}
          <a
            href="/login"
            className="text-blue-500 hover:text-blue-600 font-semibold"
          >
            đăng nhập
          </a>{" "}
          để bình luận
        </p>
      </div>
    );
  }

  // Normalize user data (same priority as CommentItem)
  const avatarUrl = currentUser.avatarUrl || currentUser.avatar || "";
  const userName =
    currentUser.fullName ||
    currentUser.name ||
    currentUser.userName ||
    currentUser.email?.split("@")[0] ||
    "Bạn";

  return (
    <div className="p-4 bg-white border-t border-gray-200">
      <form onSubmit={handleSubmit} className="flex gap-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div
            className="w-10 h-10 rounded-full bg-gray-300 bg-cover bg-center"
            style={{
              backgroundImage: avatarUrl ? `url(${avatarUrl})` : "none",
              backgroundColor: avatarUrl ? "transparent" : "#e5e7eb",
            }}
          >
            {!avatarUrl && (
              <div className="w-full h-full flex items-center justify-center text-gray-600 font-semibold">
                {userName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        </div>

        {/* Input field */}
        <div className="flex-1 flex gap-2">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={isSubmitting}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
            rows="2"
          />

          {/* Submit button */}
          <button
            type="submit"
            disabled={isSubmitting || !content.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2 self-end"
          >
            {isSubmitting ? (
              <span className="text-sm">Đang gửi...</span>
            ) : (
              <>
                <Send size={18} />
                <span className="text-sm font-medium">{buttonText}</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Footer with anonymous toggle and cancel button */}
      <div className="flex items-center justify-between mt-2 ml-13">
        <p className="text-xs text-gray-500">Nhấn Ctrl+Enter để gửi nhanh</p>

        <div className="flex items-center gap-2">
          {/* Anonymous toggle */}
          <button
            type="button"
            onClick={() => setIsAnonymous(!isAnonymous)}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs rounded-full transition-colors ${
              isAnonymous
                ? "bg-orange-100 text-orange-700 hover:bg-orange-200"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <UserX size={14} />
            <span>
              {isAnonymous ? "Chế độ ẩn danh" : "Bình luận công khai"}
            </span>
          </button>

          {/* Cancel button (only show if onCancel is provided) */}
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-3 py-1.5 text-xs text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
            >
              Hủy
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentInput;

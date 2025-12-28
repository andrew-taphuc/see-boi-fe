import { useState, useEffect } from "react";
import { followTag, unfollowTag, checkIsFollowingTag } from "@utils/tagService";
import { useAuth } from "@context/AuthContext";
import { useToast } from "@context/ToastContext";

const TagFollowButton = ({
  tagId,
  initialIsFollowing = false,
  onFollowChange,
}) => {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  // Check follow status when component mounts if user is logged in
  useEffect(() => {
    const checkFollowStatus = async () => {
      if (!currentUser || !tagId) return;

      const result = await checkIsFollowingTag(tagId);
      if (result.success) {
        setIsFollowing(result.data.isFollowing);
      }
    };

    checkFollowStatus();
  }, [tagId, currentUser]);

  const handleClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!currentUser) {
      showToast("Vui lòng đăng nhập để theo dõi tag", "warning");
      return;
    }

    setLoading(true);
    try {
      let result;
      if (isFollowing) {
        result = await unfollowTag(tagId);
        if (result.success) {
          setIsFollowing(false);
          showToast("Đã bỏ theo dõi tag", "success");
          onFollowChange?.(false);
        }
      } else {
        result = await followTag(tagId);
        if (result.success) {
          setIsFollowing(true);
          showToast("Đã theo dõi tag", "success");
          onFollowChange?.(true);
        }
      }

      if (!result.success) {
        showToast(result.error, "error");
      }
    } catch (error) {
      console.error("Error toggling follow:", error);
      showToast("Có lỗi xảy ra", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`
        px-4 py-2 rounded-lg font-medium text-sm
        transition-all duration-200
        ${
          isFollowing
            ? "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
            : "bg-blue-500 text-white hover:bg-blue-600"
        }
        ${loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        disabled:opacity-50 disabled:cursor-not-allowed
      `}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>...</span>
        </span>
      ) : isFollowing ? (
        "Đang theo dõi"
      ) : (
        "Theo dõi"
      )}
    </button>
  );
};

export default TagFollowButton;

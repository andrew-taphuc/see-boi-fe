import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getFollowingTags } from "@utils/tagService";
import { useToast } from "@context/ToastContext";
import { useAuth } from "@context/AuthContext";

const MyFollowingTagsPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { currentUser } = useAuth();
  const [followingTags, setFollowingTags] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFollowingTags = async () => {
      if (!currentUser) {
        showToast("Vui lòng đăng nhập", "warning");
        navigate("/?login=true");
        return;
      }

      setLoading(true);
      try {
        const result = await getFollowingTags();
        if (result.success) {
          setFollowingTags(result.data);
        } else {
          if (result.needsAuth) {
            navigate("/?login=true");
          } else {
            showToast(result.error, "error");
          }
        }
      } catch (error) {
        console.error("Error fetching following tags:", error);
        showToast("Có lỗi xảy ra", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchFollowingTags();
  }, [currentUser, navigate, showToast]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Tags đang theo dõi
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {followingTags.length} tags
          </p>
        </div>

        {/* Tags Grid */}
        {followingTags.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {followingTags.map((tag) => (
              <div
                key={tag.id}
                onClick={() => navigate(`/tag/${tag.id}`)}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    #{tag.name}
                  </h3>
                  <svg
                    className="w-6 h-6 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <span>{tag._count?.posts || 0} bài viết</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    <span>{tag._count?.followers || 0} người theo dõi</span>
                  </div>
                </div>

                {tag.followedAt && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 border-t dark:border-gray-700 pt-3">
                    Theo dõi từ: {formatDate(tag.followedAt)}
                  </p>
                )}

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/tag/${tag.id}`);
                  }}
                  className="mt-4 w-full px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
                >
                  Xem bài viết
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-12 shadow-sm text-center">
            <svg
              className="w-16 h-16 mx-auto text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Chưa theo dõi tag nào
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Hãy khám phá và theo dõi các tags bạn quan tâm!
            </p>
            <button
              onClick={() => navigate("/socialmedia")}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
            >
              Khám phá ngay
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyFollowingTagsPage;

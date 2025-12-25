import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bookmark, Loader2, ArrowLeft } from "lucide-react";
import SocialHeader from "@components/socialMedia/SocialHeader";
import PostCard from "@components/socialMedia/PostCard";
import axiosInstance from "@utils/axiosInstance";
import { useAuth } from "@context/AuthContext";
import { useToast } from "@context/ToastContext";
import { toggleBookmark } from "@utils/postService";

const SavedPosts = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { success, error: showError } = useToast();
  const [bookmarkedPosts, setBookmarkedPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!currentUser) {
      navigate("/?login=true");
      return;
    }

    const fetchBookmarkedPosts = async () => {
      setIsLoading(true);
      setErrorMsg("");
      try {
        // Fetch all posts
        const response = await axiosInstance.get("/post");
        const allPosts = response.data || [];

        // Filter posts that current user has bookmarked
        const bookmarked = allPosts.filter((post) => {
          return (
            post?.bookmarks &&
            Array.isArray(post.bookmarks) &&
            post.bookmarks.some(
              (bookmark) => bookmark.userId === currentUser.id
            )
          );
        });

        // Sort by bookmark date (most recent first)
        bookmarked.sort((a, b) => {
          const aBookmark = a.bookmarks.find(
            (bm) => bm.userId === currentUser.id
          );
          const bBookmark = b.bookmarks.find(
            (bm) => bm.userId === currentUser.id
          );
          return (
            new Date(bBookmark?.createdAt || 0) -
            new Date(aBookmark?.createdAt || 0)
          );
        });

        setBookmarkedPosts(bookmarked);
      } catch (err) {
        console.error("Error fetching bookmarked posts:", err);
        setErrorMsg("Không thể tải bài viết đã lưu. Vui lòng thử lại.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookmarkedPosts();
  }, [currentUser, navigate]);

  const handleRemoveBookmark = async (postId) => {
    if (!currentUser) return;

    try {
      const result = await toggleBookmark(postId, true); // true = currently bookmarked, so remove it

      if (result.success) {
        success("Đã bỏ lưu bài viết");
        // Remove post from list
        setBookmarkedPosts((prevPosts) =>
          prevPosts.filter((post) => post.id !== postId)
        );
      } else {
        showError(result.error || "Có lỗi xảy ra");
      }
    } catch (err) {
      showError("Lỗi kết nối mạng");
      console.error("Error removing bookmark:", err);
    }
  };

  const handlePostUpdate = (updatedPost) => {
    // Check if post is still bookmarked
    const isStillBookmarked =
      updatedPost?.bookmarks &&
      Array.isArray(updatedPost.bookmarks) &&
      updatedPost.bookmarks.some(
        (bookmark) => bookmark.userId === currentUser?.id
      );

    if (!isStillBookmarked) {
      // Remove from list if no longer bookmarked
      setBookmarkedPosts((prevPosts) =>
        prevPosts.filter((post) => post.id !== updatedPost.id)
      );
    } else {
      // Update the post in list
      setBookmarkedPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === updatedPost.id ? updatedPost : post
        )
      );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <SocialHeader />
        <div className="pt-14 flex items-center justify-center min-h-screen">
          <div className="flex items-center gap-2 text-gray-600">
            <Loader2 className="animate-spin" size={18} />
            <span>Đang tải bài viết đã lưu...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <SocialHeader />

      <div className="pt-14 max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Quay lại</span>
          </button>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-2">
              <Bookmark size={24} className="text-yellow-600" />
              <h1 className="text-2xl font-bold text-gray-900">
                Bài viết đã lưu
              </h1>
            </div>
            <p className="text-gray-600">
              {bookmarkedPosts.length} bài viết đã lưu
            </p>
          </div>
        </div>

        {/* Error Message */}
        {errorMsg && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMsg}
          </div>
        )}

        {/* Posts List */}
        {bookmarkedPosts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Bookmark size={48} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg mb-2">
              Chưa có bài viết nào được lưu
            </p>
            <p className="text-gray-500 text-sm">
              Nhấn vào biểu tượng bookmark để lưu bài viết yêu thích
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookmarkedPosts.map((post) => (
              <div key={post.id} className="relative group">
                <PostCard post={post} onUpdate={handlePostUpdate} />
                {/* Overlay Remove Button */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleRemoveBookmark(post.id);
                  }}
                  className="absolute top-4 right-4 px-3 py-2 bg-red-500 text-white text-sm font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 flex items-center gap-2 shadow-lg z-10"
                >
                  <Bookmark size={16} className="fill-current" />
                  <span>Bỏ lưu</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedPosts;

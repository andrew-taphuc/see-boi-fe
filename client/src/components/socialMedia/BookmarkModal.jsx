import React, { useState, useEffect } from "react";
import { X, Bookmark, Plus, Folder } from "lucide-react";
import { bookmarkPost } from "@utils/postService";
import { useToast } from "@context/ToastContext";
import axiosInstance from "@utils/axiosInstance";
import CreateCollectionModal from "./CreateCollectionModal";

const BookmarkModal = ({ isOpen, onClose, postId, onBookmarkSuccess }) => {
  const { success, error, warning } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [collections, setCollections] = useState([]);
  const [isLoadingCollections, setIsLoadingCollections] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Fetch collections when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchCollections();
    }
  }, [isOpen]);

  const fetchCollections = async () => {
    setIsLoadingCollections(true);
    try {
      const response = await axiosInstance.get("/collection/mine");
      setCollections(response.data || []);
    } catch (err) {
      console.error("Error fetching collections:", err);
      // Không hiển thị error toast để không làm phiền user
    } finally {
      setIsLoadingCollections(false);
    }
  };

  if (!isOpen) return null;

  const handleQuickSave = async () => {
    setIsProcessing(true);
    try {
      const result = await bookmarkPost(postId);

      if (result.success) {
        success("Đã lưu bài viết");
        onBookmarkSuccess?.();
        onClose();
      } else {
        if (result.alreadyBookmarked) {
          warning("Bạn đã lưu bài viết này rồi!");
        } else {
          error(result.error || "Có lỗi xảy ra");
        }
      }
    } catch (err) {
      error("Lỗi kết nối mạng");
      console.error("Error quick saving:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveToCollection = async (collectionId) => {
    setIsProcessing(true);
    try {
      const result = await bookmarkPost(postId, collectionId);

      if (result.success) {
        const collectionName = collections.find(
          (c) => c.id === collectionId
        )?.name;
        success(`Đã lưu vào "${collectionName}"`);
        onBookmarkSuccess?.();
        onClose();
      } else {
        if (result.alreadyBookmarked) {
          warning("Bạn đã lưu bài viết này rồi!");
        } else {
          error(result.error || "Có lỗi xảy ra");
        }
      }
    } catch (err) {
      error("Lỗi kết nối mạng");
      console.error("Error bookmarking to collection:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCollectionCreated = (newCollection) => {
    // Thêm collection mới vào danh sách
    setCollections((prev) => [...prev, newCollection]);
    setShowCreateModal(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Bookmark size={20} className="text-blue-600" />
            Lưu bài viết
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            disabled={isProcessing}
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Quick Save Button */}
          <button
            onClick={handleQuickSave}
            disabled={isProcessing}
            className={`w-full flex items-center gap-3 p-4 mb-4 rounded-lg border-2 border-blue-500 bg-blue-50 hover:bg-blue-100 transition-colors ${
              isProcessing ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <Bookmark size={24} className="text-blue-600" />
            <div className="flex-1 text-left">
              <p className="font-semibold text-gray-900">Lưu nhanh</p>
              <p className="text-sm text-gray-600">
                Lưu mà không cần chọn bộ sưu tập
              </p>
            </div>
          </button>

          {/* Create New Collection Button */}
          <button
            onClick={() => setShowCreateModal(true)}
            className="w-full flex items-center justify-center gap-2 p-3 mt-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-colors text-gray-600 hover:text-blue-600"
            disabled={isProcessing}
          >
            <Plus size={20} />
            <span className="font-medium">Tạo bộ sưu tập mới</span>
          </button>

          {/* Collections List */}
          {isLoadingCollections ? (
            <div className="mt-4 text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="text-sm text-gray-500 mt-2">
                Đang tải bộ sưu tập...
              </p>
            </div>
          ) : collections.length > 0 ? (
            <>
              <div className="mt-4 mb-3">
                <p className="text-sm font-medium text-gray-700">
                  Hoặc chọn bộ sưu tập:
                </p>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto">
                {collections.map((collection) => (
                  <button
                    key={collection.id}
                    onClick={() => handleSaveToCollection(collection.id)}
                    disabled={isProcessing}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-colors ${
                      isProcessing ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    <Folder size={20} className="text-blue-600 flex-shrink-0" />
                    <div className="flex-1 text-left">
                      <p className="font-medium text-gray-900">
                        {collection.name}
                      </p>
                      {collection._count?.bookmarks !== undefined && (
                        <p className="text-xs text-gray-500">
                          {collection._count.bookmarks} bài viết
                        </p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="mt-4 text-center py-6 bg-gray-50 rounded-lg">
              <Folder size={32} className="text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Chưa có bộ sưu tập nào</p>
              <p className="text-xs text-gray-500 mt-1">
                Tạo bộ sưu tập để tổ chức bài viết
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Create Collection Modal */}
      <CreateCollectionModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCollectionCreated={handleCollectionCreated}
      />
    </div>
  );
};

export default BookmarkModal;

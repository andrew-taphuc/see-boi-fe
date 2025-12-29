import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Clock,
  Edit3,
  Trash2,
  Loader2,
  ArrowLeft,
  BarChart3,
} from "lucide-react";
import { getMyDrafts, deleteDraft } from "@utils/postService";
import { useToast } from "@context/ToastContext";

const DraftList = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [drafts, setDrafts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    loadDrafts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadDrafts = async () => {
    setIsLoading(true);
    try {
      const result = await getMyDrafts();
      if (result.success) {
        setDrafts(result.data || []);
      } else {
        showToast(result.error || "Không thể tải danh sách bản nháp", "error");
      }
    } catch (error) {
      console.error("Error loading drafts:", error);
      showToast("Có lỗi xảy ra khi tải danh sách bản nháp", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (draftId) => {
    navigate(`/post/create?draftId=${draftId}`);
  };

  const handleDelete = async (draftId) => {
    if (
      !confirm(
        "Bạn có chắc muốn xóa bản nháp này? Hành động này không thể hoàn tác."
      )
    ) {
      return;
    }

    setDeletingId(draftId);
    try {
      const result = await deleteDraft(draftId);
      if (result.success) {
        showToast("Đã xóa bản nháp", "success");
        // Remove from list
        setDrafts(drafts.filter((d) => d.id !== draftId));
      } else {
        showToast(result.error || "Không thể xóa bản nháp", "error");
      }
    } catch (error) {
      console.error("Error deleting draft:", error);
      showToast("Có lỗi xảy ra khi xóa bản nháp", "error");
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

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

  if (isLoading) {
    return (
      <div
        className="flex justify-center items-center"
        style={{ minHeight: "400px" }}
      >
        <Loader2 className="animate-spin text-purple-600" size={40} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
          >
            <ArrowLeft size={18} />
            <span>Quay lại</span>
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Bản nháp của tôi</h1>
        </div>
        <p className="text-sm text-gray-500">{drafts.length} bản nháp</p>
      </div>

      {/* Empty State */}
      {drafts.length === 0 && (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <FileText className="mx-auto text-gray-300 mb-4" size={64} />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Chưa có bản nháp nào
          </h3>
          <p className="text-gray-500 mb-6">
            Các bài viết nháp của bạn sẽ hiển thị ở đây
          </p>
          <button
            onClick={() => navigate("/post/create")}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Tạo bài viết mới
          </button>
        </div>
      )}

      {/* Draft List */}
      <div className="space-y-4">
        {drafts.map((draft) => (
          <div
            key={draft.id}
            className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between gap-4">
              {/* Content */}
              <div className="flex-1 min-w-0">
                {/* Title */}
                <div className="flex items-center gap-2 mb-2">
                  {draft.type === "POLL" ? (
                    <BarChart3 className="text-purple-600 shrink-0" size={18} />
                  ) : (
                    <FileText className="text-gray-600 shrink-0" size={18} />
                  )}
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {draft.title || "Không có tiêu đề"}
                  </h3>
                </div>

                {/* Preview */}
                {draft.contentText && (
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {draft.contentText}
                  </p>
                )}

                {/* Meta Info */}
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>Tạo: {formatDate(draft.createdAt)}</span>
                  </div>
                  {draft.updatedAt !== draft.createdAt && (
                    <div className="flex items-center gap-1">
                      <Edit3 size={14} />
                      <span>Sửa: {formatDate(draft.updatedAt)}</span>
                    </div>
                  )}
                  <span className="px-2 py-1 bg-gray-100 rounded-full text-gray-700">
                    {draft.visibility === "PUBLIC"
                      ? "Công khai"
                      : draft.visibility === "FOLLOWERS"
                      ? "Người theo dõi"
                      : draft.visibility === "PRIVATE"
                      ? "Riêng tư"
                      : "Ẩn danh"}
                  </span>
                  {draft.type === "POLL" && (
                    <span className="px-2 py-1 bg-purple-100 rounded-full text-purple-700">
                      Poll
                    </span>
                  )}
                </div>
              </div>

              {/* Thumbnail */}
              {draft.thumbnailUrl && (
                <img
                  src={draft.thumbnailUrl}
                  alt={draft.title}
                  className="w-24 h-24 object-cover rounded-lg shrink-0"
                />
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
              <button
                onClick={() => handleEdit(draft.id)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <Edit3 size={16} />
                <span>Chỉnh sửa</span>
              </button>
              <button
                onClick={() => handleDelete(draft.id)}
                disabled={deletingId === draft.id}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm ml-auto ${
                  deletingId === draft.id
                    ? "bg-red-400 text-white cursor-not-allowed"
                    : "bg-red-600 text-white hover:bg-red-700"
                } transition-colors`}
              >
                {deletingId === draft.id ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <Trash2 size={16} />
                )}
                <span>Xóa</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DraftList;

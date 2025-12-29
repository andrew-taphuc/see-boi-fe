import React, { useState } from "react";
import { X, Flag, AlertTriangle } from "lucide-react";
import axiosInstance from "@utils/axiosInstance";
import { useToast } from "@context/ToastContext";

// 5 lý do report định nghĩa sẵn
const REPORT_REASONS = [
  "Nội dung không phù hợp",
  "Spam hoặc quảng cáo",
  "Nội dung bạo lực hoặc gây hại",
  "Vi phạm bản quyền",
  "Thông tin sai lệch",
];

const ReportModal = ({ isOpen, onClose, postId, commentId }) => {
  const { success, error: showError } = useToast();
  const [selectedReason, setSelectedReason] = useState(null);
  const [customReason, setCustomReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset state when modal opens/closes
  React.useEffect(() => {
    if (isOpen) {
      setSelectedReason(null);
      setCustomReason("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleReasonSelect = async (reason) => {
    setSelectedReason(reason);
    
    // Nếu chọn lý do có sẵn (không phải "Khác"), tự động submit
    if (reason !== "other") {
      await handleSubmit(reason);
    }
  };

  const handleSubmit = async (reasonToSubmit = null) => {
    const reason = reasonToSubmit || (selectedReason === "other" ? customReason.trim() : selectedReason);

    // Validation
    if (!reason || reason.trim() === "") {
      showError("Vui lòng chọn hoặc nhập lý do báo cáo");
      return;
    }

    // Validate: chỉ truyền postId hoặc commentId, không truyền cả hai
    if (postId && commentId) {
      showError("Chỉ có thể báo cáo bài viết hoặc bình luận, không thể báo cáo cả hai");
      return;
    }

    if (!postId && !commentId) {
      showError("Vui lòng cung cấp ID bài viết hoặc bình luận");
      return;
    }

    setIsSubmitting(true);

    try {
      const body = {
        reason: reason.trim(),
      };

      if (postId) {
        body.postId = postId;
      } else if (commentId) {
        body.commentId = commentId;
      }

      await axiosInstance.post("/report", body);
      
      success("Đã gửi báo cáo thành công. Cảm ơn bạn đã giúp cải thiện cộng đồng!");
      onClose();
    } catch (err) {
      console.error("Error reporting:", err);
      const errorMessage = err?.response?.data?.message || "Không thể gửi báo cáo. Vui lòng thử lại.";
      showError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
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
            <Flag size={20} className="text-red-600" />
            Báo cáo {postId ? "bài viết" : "bình luận"}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            disabled={isSubmitting}
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-4">
              Vui lòng chọn lý do báo cáo. Báo cáo của bạn sẽ được xem xét bởi đội ngũ quản trị.
            </p>

            {/* Danh sách lý do có sẵn */}
            <div className="space-y-2 mb-4">
              {REPORT_REASONS.map((reason, index) => (
                <button
                  key={index}
                  onClick={() => handleReasonSelect(reason)}
                  disabled={isSubmitting}
                  className={`w-full text-left p-3 rounded-lg border-2 transition-colors ${
                    selectedReason === reason
                      ? "border-red-500 bg-red-50"
                      : "border-gray-200 hover:border-red-300 hover:bg-red-50"
                  } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <div className="flex items-center gap-2">
                    <AlertTriangle
                      size={16}
                      className={selectedReason === reason ? "text-red-600" : "text-gray-400"}
                    />
                    <span className="text-sm font-medium text-gray-900">{reason}</span>
                  </div>
                </button>
              ))}

              {/* Option "Khác" */}
              <button
                onClick={() => handleReasonSelect("other")}
                disabled={isSubmitting}
                className={`w-full text-left p-3 rounded-lg border-2 transition-colors ${
                  selectedReason === "other"
                    ? "border-red-500 bg-red-50"
                    : "border-gray-200 hover:border-red-300 hover:bg-red-50"
                } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <div className="flex items-center gap-2">
                  <AlertTriangle
                    size={16}
                    className={selectedReason === "other" ? "text-red-600" : "text-gray-400"}
                  />
                  <span className="text-sm font-medium text-gray-900">Khác</span>
                </div>
              </button>
            </div>

            {/* Input cho lý do tùy chỉnh */}
            {selectedReason === "other" && (
              <div className="mb-4">
                <textarea
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  placeholder="Vui lòng mô tả lý do báo cáo..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                  rows="4"
                  disabled={isSubmitting}
                />
              </div>
            )}
          </div>

          {/* Action buttons - chỉ hiện khi chọn "Khác" */}
          {selectedReason === "other" && (
            <div className="flex gap-3 justify-end">
              <button
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                onClick={() => handleSubmit()}
                disabled={isSubmitting || !customReason.trim()}
                className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    Đang gửi...
                  </>
                ) : (
                  <>
                    <Flag size={16} />
                    Gửi báo cáo
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportModal;


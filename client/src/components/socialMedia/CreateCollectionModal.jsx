import React, { useState } from "react";
import { X, Folder } from "lucide-react";
import { useToast } from "@context/ToastContext";
import axiosInstance from "@utils/axiosInstance";

const CreateCollectionModal = ({ isOpen, onClose, onCollectionCreated }) => {
  const { success, error: showError } = useToast();
  const [collectionName, setCollectionName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!collectionName.trim()) {
      showError("Vui lòng nhập tên bộ sưu tập");
      return;
    }

    setIsProcessing(true);
    try {
      const response = await axiosInstance.post("/collection", {
        name: collectionName.trim(),
      });

      if (response.status === 201) {
        success("Tạo bộ sưu tập thành công!");
        onCollectionCreated?.(response.data); // Callback với collection mới
        setCollectionName("");
        onClose();
      }
    } catch (err) {
      console.error("Error creating collection:", err);
      showError(err?.response?.data?.message || "Không thể tạo bộ sưu tập");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    if (!isProcessing) {
      setCollectionName("");
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Folder size={20} className="text-blue-600" />
            Tạo bộ sưu tập mới
          </h3>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            disabled={isProcessing}
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <label
              htmlFor="collectionName"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Tên bộ sưu tập
            </label>
            <input
              type="text"
              id="collectionName"
              value={collectionName}
              onChange={(e) => setCollectionName(e.target.value)}
              placeholder="Ví dụ: Yêu thích, Đọc sau..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isProcessing}
              autoFocus
              maxLength={50}
            />
            <p className="text-xs text-gray-500 mt-1">
              {collectionName.length}/50 ký tự
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={isProcessing}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isProcessing || !collectionName.trim()}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? "Đang tạo..." : "Tạo"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCollectionModal;

import React, { useEffect, useState } from "react";
import { Tag as TagIcon } from "lucide-react";
import axiosInstance from "@utils/axiosInstance";

const TagSelector = ({ selectedTags = [], onTagsChange }) => {
  const [allTags, setAllTags] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTags = async () => {
      setIsLoading(true);
      setError("");
      try {
        const response = await axiosInstance.get("/tag");
        console.log("Tags response:", response.data);

        // Kiểm tra response structure
        if (Array.isArray(response.data)) {
          setAllTags(response.data);
        } else if (response.data?.data && Array.isArray(response.data.data)) {
          setAllTags(response.data.data);
        } else {
          console.warn("Unexpected response format:", response.data);
          setAllTags([]);
        }
      } catch (err) {
        console.error("Error fetching tags:", err);
        console.error("Error response:", err.response?.data);
        console.error("Error status:", err.response?.status);
        setError("Không thể tải danh sách tags. Vui lòng thử lại sau.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTags();
  }, []);

  const toggleTag = (tagId) => {
    if (selectedTags.includes(tagId)) {
      // Bỏ chọn tag
      onTagsChange(selectedTags.filter((id) => id !== tagId));
    } else {
      // Chọn tag
      onTagsChange([...selectedTags, tagId]);
    }
  };

  if (isLoading) {
    return (
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tags
        </label>
        <p className="text-sm text-gray-500">Đang tải tags...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
          <TagIcon size={16} />
          Chọn Tags (tùy chọn)
        </label>
        <div className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          {error}
        </div>
      </div>
    );
  }

  // Nếu không có tags nào
  if (!isLoading && allTags.length === 0) {
    return (
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
          <TagIcon size={16} />
          Chọn Tags (tùy chọn)
        </label>
        <p className="text-sm text-gray-500 italic">Chưa có tags nào</p>
      </div>
    );
  }

  return (
    <div className="mb-3">
      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
        <TagIcon size={16} />
        Chọn Tags (tùy chọn)
      </label>
      <div className="flex flex-wrap gap-2">
        {allTags.map((tag) => (
          <button
            key={tag.id}
            type="button"
            onClick={() => toggleTag(tag.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              selectedTags.includes(tag.id)
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md scale-105"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300"
            }`}
          >
            #{tag.name}
          </button>
        ))}
      </div>
      {selectedTags.length > 0 && (
        <p className="text-xs text-gray-500 mt-2">
          Đã chọn {selectedTags.length} tag{selectedTags.length > 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
};

export default TagSelector;

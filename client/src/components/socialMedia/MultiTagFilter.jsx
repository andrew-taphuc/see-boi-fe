import { useState, useEffect } from "react";
import { getAllTags } from "@utils/tagService";

const MultiTagFilter = ({
  selectedTags = [],
  onTagsChange,
  className = "",
}) => {
  const [allTags, setAllTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchTags = async () => {
      setLoading(true);
      try {
        const result = await getAllTags();
        if (result.success) {
          setAllTags(result.data);
        }
      } catch (error) {
        console.error("Error fetching tags:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, []);

  const toggleTag = (tagId) => {
    const newSelection = selectedTags.includes(tagId)
      ? selectedTags.filter((id) => id !== tagId)
      : [...selectedTags, tagId];

    onTagsChange(newSelection);
  };

  const clearAllTags = () => {
    onTagsChange([]);
  };

  const displayedTags = showAll ? allTags : allTags.slice(0, 10);

  if (loading) {
    return (
      <div
        className={`bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm ${className}`}
      >
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-3"></div>
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-8 bg-gray-200 dark:bg-gray-700 rounded-full w-20"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm ${className}`}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          Lọc theo tags
        </h3>
        {selectedTags.length > 0 && (
          <button
            onClick={clearAllTags}
            className="text-sm text-red-500 hover:text-red-600 font-medium transition-colors"
          >
            Xóa bộ lọc ({selectedTags.length})
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {displayedTags.map((tag) => {
          const isSelected = selectedTags.includes(tag.id);
          return (
            <button
              key={tag.id}
              onClick={() => toggleTag(tag.id)}
              className={`
                px-4 py-2 rounded-full text-sm font-medium
                transition-all duration-200
                flex items-center gap-2
                ${
                  isSelected
                    ? "bg-blue-500 text-white hover:bg-blue-600 shadow-md"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }
              `}
            >
              <span>#{tag.name}</span>
              {isSelected && (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </button>
          );
        })}
      </div>

      {allTags.length > 10 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-3 text-sm text-blue-500 hover:text-blue-600 font-medium transition-colors"
        >
          {showAll ? "Thu gọn" : `Xem thêm ${allTags.length - 10} tags`}
        </button>
      )}

      {allTags.length === 0 && !loading && (
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Chưa có tag nào
        </p>
      )}
    </div>
  );
};

export default MultiTagFilter;

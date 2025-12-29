import React from "react";
import { BarChart3, Plus, X, Clock } from "lucide-react";

/**
 * Component form tạo poll/vote
 * Props:
 * - pollOptions: string[]
 * - onPollOptionsChange: (options: string[]) => void
 * - pollExpiresAt: string (yyyy-MM-ddThh:mm)
 * - onPollExpiresAtChange: (value: string) => void
 * - onCancel?: () => void
 */
const PollForm = ({ pollOptions, onPollOptionsChange, pollExpiresAt, onPollExpiresAtChange, onCancel }) => {

  const addPollOption = () => {
    if (pollOptions.length >= 10) return;
    onPollOptionsChange([...pollOptions, '']);
  };

  const removePollOption = (idx) => {
    if (pollOptions.length <= 2) return;
    onPollOptionsChange(pollOptions.filter((_, i) => i !== idx));
  };

  const updatePollOption = (idx, value) => {
    onPollOptionsChange(pollOptions.map((x, i) => (i === idx ? value : x)));
  };

  return (
    <div className="mb-4 rounded-xl border-2 border-purple-300 bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
            <BarChart3 size={20} className="text-white" />
          </div>
          <div>
            <p className="text-base font-bold text-gray-900">
              Tạo Poll Bình Chọn
            </p>
            <p className="text-xs text-gray-600">
              Nhập 2–10 lựa chọn. Các lựa chọn không được trùng nhau.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={addPollOption}
            disabled={pollOptions.length >= 10}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1 ${
              pollOptions.length >= 10
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-white border-2 border-purple-300 text-purple-600 hover:bg-purple-100 hover:border-purple-400 shadow-sm"
            }`}
          >
            <Plus size={16} />
            Thêm lựa chọn
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-3 py-2 rounded-lg text-sm font-medium bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-100 shadow-sm transition-all"
            >
              Hủy
            </button>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {pollOptions.map((opt, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center text-sm font-bold">
              {idx + 1}
            </div>
            <input
              value={opt}
              onChange={(e) => updatePollOption(idx, e.target.value)}
              className="flex-1 px-4 py-3 border-2 border-purple-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              placeholder={`Lựa chọn ${idx + 1}`}
            />
            {pollOptions.length > 2 && (
              <button
                type="button"
                onClick={() => removePollOption(idx)}
                className="px-3 py-3 rounded-lg bg-white border-2 border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 text-sm transition-all shadow-sm"
                aria-label="Xoá lựa chọn"
              >
                <X size={16} />
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t-2 border-purple-200">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <Clock size={16} className="text-purple-500" />
          Thời gian hết hạn (tùy chọn)
        </label>
        <input
          type="datetime-local"
          value={pollExpiresAt}
          onChange={(e) => onPollExpiresAtChange(e.target.value)}
          className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
        />
        <p className="text-xs text-gray-500 mt-2">
          💡 Để trống nếu muốn poll không giới hạn thời gian
        </p>
      </div>
    </div>
  );
};

export default PollForm;

import React from 'react';

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
    <div className="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-sm font-semibold text-gray-900">Tạo vote</p>
          <p className="text-xs text-gray-600">
            Nhập 2–10 lựa chọn. Các lựa chọn không được trùng nhau.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={addPollOption}
            disabled={pollOptions.length >= 10}
            className={`px-3 py-1 rounded-lg text-xs ${
              pollOptions.length >= 10
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
            }`}
          >
            + Thêm lựa chọn
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-3 py-1 rounded-lg text-xs bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Hủy
            </button>
          )}
        </div>
      </div>

      <div className="space-y-2">
        {pollOptions.map((opt, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <input
              value={opt}
              onChange={(e) => updatePollOption(idx, e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={`Lựa chọn ${idx + 1}`}
            />
            {pollOptions.length > 2 && (
              <button
                type="button"
                onClick={() => removePollOption(idx)}
                className="px-3 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 text-sm"
                aria-label="Xoá lựa chọn"
              >
                X
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="mt-3">
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Hạn vote (tuỳ chọn)
        </label>
        <input
          type="datetime-local"
          value={pollExpiresAt}
          onChange={(e) => onPollExpiresAtChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
};

export default PollForm;


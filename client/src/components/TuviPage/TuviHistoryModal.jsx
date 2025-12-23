import React, { useState, useEffect } from "react";
import { getMyCharts } from "../../utils/tuviService";

const TuviHistoryModal = ({ isOpen, onClose, onSelectChart }) => {
  const [charts, setCharts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchCharts();
    }
  }, [isOpen]);

  const fetchCharts = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getMyCharts();
      setCharts(data);
    } catch (err) {
      console.error("Lỗi khi tải danh sách:", err);
      setError(err.message || "Không thể tải danh sách lá số!");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const formatHour = (hour) => {
    return `${hour}:00`;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#fdfbf7] rounded-lg shadow-2xl w-full max-w-3xl max-h-[80vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-red-800 text-white px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl md:text-2xl font-bold font-['Playfair_Display'] uppercase">
            📜 Lịch sử lá số đã lưu
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:text-yellow-300 text-2xl font-bold w-8 h-8 flex items-center justify-center cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading && (
            <div className="text-center py-8">
              <p className="text-gray-600 text-lg">Đang tải...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-8">
              <p className="text-red-600 text-lg">{error}</p>
              <button
                onClick={fetchCharts}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
              >
                Thử lại
              </button>
            </div>
          )}

          {!loading && !error && charts.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-600 text-lg mb-2">
                Bạn chưa có lá số nào được lưu
              </p>
              <p className="text-gray-500 text-sm">
                Hãy tạo lá số mới và nhấn "Lưu lá số" để lưu vào danh sách
              </p>
            </div>
          )}

          {!loading && !error && charts.length > 0 && (
            <div className="space-y-3">
              {charts.map((chart) => (
                <div
                  key={chart.chartId}
                  onClick={() => {
                    onSelectChart(chart.chartId);
                    onClose();
                  }}
                  className="border-2 border-yellow-700 rounded-lg p-4 hover:bg-yellow-50 cursor-pointer transition-all hover:shadow-lg"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4">
                    {/* Thông tin chính */}
                    <div className="md:col-span-2">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-bold text-white bg-red-800 px-2 py-1 rounded">
                          {chart.isLunar ? "ÂM LỊCH" : "DƯƠNG LỊCH"}
                        </span>
                        <span className="text-xs font-bold text-white bg-blue-800 px-2 py-1 rounded uppercase">
                          {chart.gender}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600 font-medium">
                            Ngày sinh:
                          </span>
                          <span className="text-base font-bold text-red-800">
                            {formatDate(chart.birthDate)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600 font-medium">
                            Giờ sinh:
                          </span>
                          <span className="text-base font-bold text-red-800">
                            {formatHour(chart.birthHour)}
                          </span>
                        </div>
                        {chart.canChi && (
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600 font-medium">
                              Can Chi:
                            </span>
                            <span className="text-base font-bold text-red-800">
                              {chart.canChi}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Ngày tạo */}
                    <div className="flex flex-col justify-center items-start md:items-end">
                      <span className="text-xs text-gray-500 mb-1">
                        Ngày lưu:
                      </span>
                      <span className="text-sm font-medium text-gray-700">
                        {formatDate(chart.createdAt)}
                      </span>
                      <button className="mt-2 text-blue-700 hover:text-blue-900 font-bold text-sm">
                        Xem chi tiết →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TuviHistoryModal;

import React from "react";

/**
 * Popup hiển thị phân tích chi tiết của 1 cung
 *
 * @param {boolean} isOpen - Hiển thị popup hay không
 * @param {Function} onClose - Hàm đóng popup
 * @param {Object} cungData - Dữ liệu cung cần hiển thị
 */
const CungAnalysisPopup = ({ isOpen, onClose, cungData }) => {
  if (!isOpen || !cungData) return null;

  // Lấy tên các sao chính
  const majorStars =
    cungData.chinhTinh?.map((s) => s.name).join(", ") || "Vô chính diệu";

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-[#fdfbf7] rounded shadow-2xl overflow-hidden border-4 border-yellow-700"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-red-900 p-4 border-b-4 border-yellow-600">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-['Playfair_Display'] text-xl md:text-2xl font-bold text-yellow-400 uppercase tracking-widest">
                Cung {cungData.tenCung}
              </h3>
              <p className="text-sm text-yellow-300 font-serif mt-1">
                Địa chi: {cungData.diaChi}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-yellow-400 hover:text-white text-2xl font-bold transition-colors w-8 h-8 flex items-center justify-center"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-yellow-700">
          {/* Sao chính trong cung */}
          <div className="bg-yellow-50/50 rounded p-4 border-2 border-yellow-600 shadow">
            <h4 className="font-['Playfair_Display'] font-bold text-red-800 mb-3 text-lg uppercase tracking-wide border-b border-yellow-600 pb-2">
              Chính Tinh
            </h4>
            <div className="flex flex-wrap gap-2">
              {cungData.chinhTinh && cungData.chinhTinh.length > 0 ? (
                cungData.chinhTinh.map((star, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-red-800 text-yellow-300 rounded text-sm font-bold border-2 border-yellow-600 font-serif"
                  >
                    {star.name}
                  </span>
                ))
              ) : (
                <span className="text-gray-500 italic font-serif">
                  Vô chính diệu
                </span>
              )}
            </div>
          </div>

          {/* Phân tích */}
          <div className="bg-yellow-50/50 rounded p-4 border-2 border-yellow-600 shadow">
            <h4 className="font-['Playfair_Display'] font-bold text-red-800 mb-3 text-lg uppercase tracking-wide border-b border-yellow-600 pb-2">
              Luận Giải
            </h4>
            <div className="prose prose-sm max-w-none">
              <p className="text-gray-800 leading-relaxed text-justify whitespace-pre-line font-['Be_Vietnam_Pro']">
                {cungData.analysis ||
                  "Chưa có phân tích chi tiết cho cung này."}
              </p>
            </div>
          </div>

          {/* Phụ tinh (nếu có) */}
          {cungData.phuTinh &&
            (cungData.phuTinh.tot?.length > 0 ||
              cungData.phuTinh.xau?.length > 0) && (
              <div className="bg-yellow-50/50 rounded p-4 border-2 border-yellow-600 shadow">
                <h4 className="font-['Playfair_Display'] font-bold text-red-800 mb-3 text-lg uppercase tracking-wide border-b border-yellow-600 pb-2">
                  Phụ Tinh
                </h4>
                <div className="space-y-2">
                  {cungData.phuTinh.tot?.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold text-green-700 mb-1">
                        Cát tinh:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {cungData.phuTinh.tot.map((star, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 bg-green-100 text-green-800 rounded text-xs"
                          >
                            {star}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {cungData.phuTinh.xau?.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold text-red-700 mb-1">
                        Hung tinh:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {cungData.phuTinh.xau.map((star, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 bg-red-100 text-red-800 rounded text-xs"
                          >
                            {star}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
        </div>

        {/* Footer */}
        <div className="bg-yellow-100 p-3 border-t-2 border-yellow-400 text-center">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-red-800 hover:bg-red-700 text-white font-semibold rounded-full shadow-lg transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default CungAnalysisPopup;

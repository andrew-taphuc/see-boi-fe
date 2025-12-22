import React, { useState } from "react";
import AspectsBars from "./AspectsBars";
import CungAnalysisPopup from "./CungAnalysisPopup";
import { requestAIInterpretation } from "../../utils/tuviService";

// --- 1. Component Ô Cung (Giữ nguyên logic, tinh chỉnh CSS một chút) ---
const CungCell = ({ data, cssClass, isMobile, onClick }) => {
  if (!data)
    return (
      <div
        className={`border border-yellow-700/30 bg-[#FFFBF0] ${cssClass}`}
      ></div>
    );

  return (
    <div
      onClick={() => onClick && onClick(data)}
      className={`relative border border-yellow-700/50 bg-[#FFFBF0] flex flex-col justify-between 
      ${isMobile ? "min-h-[160px] mb-3 rounded shadow-sm" : "min-h-[140px]"} 
      ${
        onClick
          ? "cursor-pointer hover:bg-yellow-50 hover:shadow-md transition-all"
          : ""
      }
      ${cssClass}`}
    >
      {/* Header */}
      <div
        className={`flex justify-between items-center px-2 py-1 ${
          data.isThan
            ? "bg-yellow-200 text-red-800"
            : "bg-yellow-800/10 text-gray-700"
        } ${isMobile ? "rounded-t" : ""}`}
      >
        <span className="font-['Playfair_Display'] font-bold uppercase text-xs md:text-xs">
          {data.tenCung}
        </span>
        <span className="text-xs text-gray-500 font-bold font-serif">
          {data.diaChi}
        </span>
      </div>

      {/* Body */}
      <div className="flex-1 flex justify-between px-1 py-2 text-[11px] leading-tight">
        {/* Sao Tốt (Bên trái) */}
        <div className="flex flex-col gap-0.5 text-left w-1/3">
          {data.phuTinh.tot.map((sao, i) => (
            <span key={i} className="font-medium text-black">
              {sao}
            </span>
          ))}
        </div>

        {/* Chính Tinh (Ở giữa) */}
        <div className="flex flex-col items-center w-1/3 text-center">
          {data.chinhTinh.length > 0 ? (
            data.chinhTinh.map((sao, i) => (
              <span
                key={i}
                className={`font-bold uppercase text-red-700 block ${
                  data.chinhTinh.length > 1 ? "text-[11px]" : "text-sm"
                }`}
              >
                {sao.name}{" "}
                <span className="text-[9px] text-gray-400">({sao.daq})</span>
              </span>
            ))
          ) : (
            <span className="text-gray-300 text-[10px] italic">
              Vô Chính Diệu
            </span>
          )}
        </div>

        {/* Sao Xấu (Bên phải) */}
        <div className="flex flex-col gap-0.5 text-right w-1/3">
          {data.phuTinh.xau.map((sao, i) => (
            <span key={i} className="font-medium text-gray-500">
              {sao}
            </span>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-end text-[10px] font-bold px-2 py-1 mt-1 border-t border-dashed border-yellow-700/30">
        <span className="text-gray-400">{data.tieuVan}</span>
        <span className="bg-yellow-600 text-white px-1.5 rounded-sm">
          {data.daiVan}
        </span>
      </div>
    </div>
  );
};

// --- 2. Component Thiên Bàn (Thông tin trung tâm) ---
const ThienBanInfo = ({ info, isMobile }) => {
  return (
    <div
      className={`bg-white flex flex-col items-center justify-center p-4 border border-yellow-700/50 relative ${
        isMobile ? "rounded-lg shadow-md mb-4" : "h-full"
      }`}
    >
      {!isMobile && (
        <div className="absolute inset-0 opacity-5 bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Yin_yang_black_and_white_symbol.svg/1200px-Yin_yang_black_and_white_symbol.svg.png')] bg-center bg-no-repeat bg-contain pointer-events-none"></div>
      )}

      <div className="relative z-10 text-center w-full">
        <h2 className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-red-800 uppercase tracking-widest mb-1">
          Lá Số Tử Vi
        </h2>
        <div className="w-24 h-0.5 bg-yellow-600 mx-auto mb-4"></div>

        <div
          className={`grid ${
            isMobile ? "grid-cols-1 gap-1" : "grid-cols-2 gap-x-8 gap-y-2"
          } text-left text-sm font-['Be_Vietnam_Pro'] text-gray-800 px-2 md:px-8`}
        >
          <p>
            <span className="font-['Playfair_Display'] font-bold text-yellow-800">
              Họ tên:
            </span>{" "}
            {info.hoTen}
          </p>
          <p>
            <span className="font-['Playfair_Display'] font-bold text-yellow-800">
              Năm xem:
            </span>{" "}
            {info.namXem}
          </p>
          <p>
            <span className="font-['Playfair_Display'] font-bold text-yellow-800">
              Ngày sinh:
            </span>{" "}
            {info.ngaySinh}
          </p>
          <p>
            <span className="font-['Playfair_Display'] font-bold text-yellow-800">
              Lịch:
            </span>{" "}
            {info.amLich}
          </p>
          <p>
            <span className="font-['Playfair_Display'] font-bold text-yellow-800">
              Giờ:
            </span>{" "}
            {info.gioSinh}
          </p>
          <p>
            <span className="font-['Playfair_Display'] font-bold text-yellow-800">
              Giới tính:
            </span>{" "}
            {info.gioiTinh}
          </p>
        </div>

        <div className="mt-4 bg-yellow-50/80 p-3 rounded border border-yellow-200 text-sm">
          <div className="grid grid-cols-2 gap-4 text-left">
            <p>
              <span className="font-['Playfair_Display'] font-bold">Mệnh:</span>{" "}
              {info.banMenh}
            </p>
            <p>
              <span className="font-['Playfair_Display'] font-bold">Cục:</span>{" "}
              {info.cuc}
            </p>
          </div>
          <p className="font-['Playfair_Display'] mt-2 font-bold text-red-700 uppercase text-xs tracking-wider text-center">
            {info.tuongQuan}
          </p>
        </div>
      </div>
    </div>
  );
};

// --- 3. Component Chính ---
const TuviResult = ({ isOpen, onClose, data }) => {
  const [selectedCung, setSelectedCung] = useState(null);
  const [showAnalysisPopup, setShowAnalysisPopup] = useState(false);
  const [aiInterpretation, setAiInterpretation] = useState(
    data?.binhGiai?.aiInterpretation || null
  );
  const [showAiPopup, setShowAiPopup] = useState(false);
  const [loadingAi, setLoadingAi] = useState(false);
  const [aiError, setAiError] = useState("");

  if (!isOpen || !data) return null;

  // Xử lý gọi AI luận giải
  const handleRequestAI = async () => {
    if (!data?.chartId) {
      setAiError("Không tìm thấy chartId");
      return;
    }

    setLoadingAi(true);
    setAiError("");

    try {
      const response = await requestAIInterpretation(data.chartId);
      setAiInterpretation(response.aiResponse);
      setShowAiPopup(true);
    } catch (error) {
      console.error("Lỗi khi gọi AI:", error);
      setAiError(
        error.message || "Không thể lấy luận giải AI. Vui lòng thử lại!"
      );
    } finally {
      setLoadingAi(false);
    }
  };

  const getCungData = (chi) => data.cacCung.find((c) => c.diaChi === chi);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  // Xử lý click vào cung
  const handleCungClick = (cungData) => {
    setSelectedCung(cungData);
    setShowAnalysisPopup(true);
  };

  // Thứ tự 12 cung chuẩn để hiển thị trên Mobile
  const zodiacOrder = [
    "Tý",
    "Sửu",
    "Dần",
    "Mão",
    "Thìn",
    "Tỵ",
    "Ngọ",
    "Mùi",
    "Thân",
    "Dậu",
    "Tuất",
    "Hợi",
  ];

  return (
    <div
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-0 md:p-4"
    >
      <div className="relative w-full max-w-6xl h-full md:h-auto md:max-h-[95vh] bg-[#fdfbf7] md:rounded shadow-2xl overflow-hidden flex flex-col">
        {/* Hiển thị Chart ID */}
        {data?.chartId && (
          <div className="absolute top-14 left-2 md:top-4 md:left-4 z-40 bg-blue-800 text-white px-3 py-1 rounded-full text-xs font-bold border border-blue-500 shadow-lg">
            ID: {data.chartId}
          </div>
        )}

        {/* Nút đóng */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 md:top-4 md:right-4 z-50 text-white bg-red-800 hover:bg-red-700 w-10 h-10 md:w-8 md:h-8 rounded-full font-bold border-2 border-yellow-500 shadow-lg flex items-center justify-center text-lg cursor-pointer"
        >
          ✕
        </button>

        {/* Scroll Container */}
        <div className="flex-1 overflow-y-auto pt-16 px-2 pb-2 md:pt-16 md:px-4 md:pb-4 scrollbar-thin scrollbar-thumb-yellow-700">
          {/* ================= MOBILE VIEW (< 768px) ================= */}
          <div className="block md:hidden">
            {/* 1. Thiên Bàn (Thông tin) */}
            <ThienBanInfo info={data.thienBan} isMobile={true} />

            {/* 2. Aspects - Chỉ số vận mệnh */}
            {data.aspects && <AspectsBars aspects={data.aspects} />}

            {/* 3. Danh sách 12 Cung (Grid 1 cột hoặc 2 cột tùy ý) */}
            <h3 className="font-['Playfair_Display'] text-center font-bold text-yellow-800 uppercase mb-2 border-b border-yellow-200 pb-1">
              Chi Tiết 12 Cung
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {zodiacOrder.map((chi) => (
                <CungCell
                  key={chi}
                  data={getCungData(chi)}
                  isMobile={true}
                  onClick={handleCungClick}
                />
              ))}
            </div>
          </div>

          {/* ================= DESKTOP VIEW (>= 768px) ================= */}
          <div className="hidden md:block bg-[#fdfbf7] p-1 rounded border border-yellow-600 mb-6">
            {/* Giữ nguyên Grid 4x4 truyền thống */}
            <div className="grid grid-cols-4 gap-0 border-2 border-yellow-800 bg-yellow-800">
              {/* HÀNG 1 */}
              <CungCell data={getCungData("Tỵ")} onClick={handleCungClick} />
              <CungCell data={getCungData("Ngọ")} onClick={handleCungClick} />
              <CungCell data={getCungData("Mùi")} onClick={handleCungClick} />
              <CungCell data={getCungData("Thân")} onClick={handleCungClick} />

              {/* HÀNG 2 */}
              <CungCell data={getCungData("Thìn")} onClick={handleCungClick} />
              <div className="col-span-2 row-span-2 bg-white">
                <ThienBanInfo info={data.thienBan} isMobile={false} />
              </div>
              <CungCell data={getCungData("Dậu")} onClick={handleCungClick} />

              {/* HÀNG 3 */}
              <CungCell data={getCungData("Mão")} onClick={handleCungClick} />
              <CungCell data={getCungData("Tuất")} onClick={handleCungClick} />

              {/* HÀNG 4 */}
              <CungCell data={getCungData("Dần")} onClick={handleCungClick} />
              <CungCell data={getCungData("Sửu")} onClick={handleCungClick} />
              <CungCell data={getCungData("Tý")} onClick={handleCungClick} />
              <CungCell data={getCungData("Hợi")} onClick={handleCungClick} />
            </div>
          </div>

          {/* === ASPECTS - CHỈ SỐ VẬN MỆNH (Hiển thị cả Desktop & Mobile) === */}
          <div className="hidden md:block ">
            {data.aspects && <AspectsBars aspects={data.aspects} />}
          </div>

          {/* === NÚT XEM LUẬN GIẢI AI === */}
          <div className="mt-6 mb-4 text-center">
            <button
              onClick={handleRequestAI}
              disabled={loadingAi}
              className="bg-red-800 hover:bg-red-900 text-yellow-400 font-bold py-3 px-10 rounded shadow-lg border-2 border-yellow-600 transform transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest font-['Playfair_Display'] cursor-pointer"
            >
              {loadingAi ? "Đang phân tích..." : "Xem Luận Giải AI"}
            </button>
            {aiError && (
              <p className="text-red-600 mt-2 text-sm font-serif">{aiError}</p>
            )}
          </div>
        </div>
      </div>

      {/* Popup phân tích chi tiết cung */}
      <CungAnalysisPopup
        isOpen={showAnalysisPopup}
        onClose={() => setShowAnalysisPopup(false)}
        cungData={selectedCung}
      />

      {/* Popup hiển thị AI luận giải */}
      {showAiPopup && aiInterpretation && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4">
          <div className="bg-[#fdfbf7] rounded shadow-2xl max-w-3xl w-full max-h-[80vh] overflow-hidden border-4 border-yellow-700">
            {/* Header */}
            <div className="bg-red-900 p-4 flex justify-between items-center border-b-4 border-yellow-600">
              <h3 className="font-['Playfair_Display'] text-xl font-bold text-yellow-400 uppercase tracking-widest">
                Luận Giải AI
              </h3>
              <button
                onClick={() => setShowAiPopup(false)}
                className="text-yellow-400 hover:text-white text-2xl font-bold w-8 h-8 flex items-center justify-center transition-all"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-100px)] scrollbar-thin scrollbar-thumb-yellow-700">
              <div className="bg-yellow-50/50 rounded p-5 border-2 border-yellow-600">
                <p className="font-['Playfair_Display'] text-gray-800 leading-relaxed whitespace-pre-wrap text-justify">
                  {aiInterpretation}
                </p>
              </div>

              {/* Footer note */}
              <div className="mt-4 text-center text-xs text-gray-600 italic font-serif">
                ※ Kết quả chỉ mang tính chất tham khảo ※
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TuviResult;

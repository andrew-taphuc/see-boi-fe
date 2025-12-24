import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import AspectsBars from "@components/TuviPage/AspectsBars";
import CungAnalysisPopup from "@components/TuviPage/CungAnalysisPopup";
import {
  requestAIInterpretation,
  getTuViChart,
  saveTuViChart,
} from "../utils/tuviService";
import { adaptBackendToFrontend } from "../utils/tuviDataAdapter";
import ReactMarkdown from "react-markdown";

// Import CungCell component từ TuviResult
import CungCell from "@components/TuviPage/CungCell";

// ThienBanInfo component (giữ nguyên từ thiết kế cũ)
const ThienBanInfo = ({ info, isMobile }) => {
  if (!info) {
    return (
      <div
        className={`bg-white flex items-center justify-center p-4 border border-yellow-700/50 ${
          isMobile ? "rounded-lg shadow-md mb-4" : "h-full"
        }`}
      >
        <p className="text-gray-500">Đang tải thông tin...</p>
      </div>
    );
  }

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
          <p>
            <span className="font-['Playfair_Display'] font-bold text-yellow-800">
              Năm xem:
            </span>{" "}
            {info.namXemCanChi || info.namXem}
          </p>
        </div>

        <div className="mt-4 bg-yellow-50/80 p-3 rounded border border-yellow-200 text-sm">
          <div className="text-center">
            <p>
              <span className="font-['Playfair_Display'] font-bold">Mệnh:</span>{" "}
              <span className="text-red-700 font-bold">{info.banMenh}</span>
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

const TuviResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { chartId: urlChartId } = useParams();

  const [data, setData] = useState(location.state?.chartData || null);
  const [loading, setLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(location.state?.isSaved || false);
  const [chartId, setChartId] = useState(
    location.state?.chartId || urlChartId || null
  );
  const [formData, setFormData] = useState(location.state?.formData || null);

  const [selectedCung, setSelectedCung] = useState(null);
  const [showAnalysisPopup, setShowAnalysisPopup] = useState(false);
  const [aiInterpretation, setAiInterpretation] = useState(
    data?.binhGiai?.aiInterpretation || null
  );
  const [showAiPopup, setShowAiPopup] = useState(false);
  const [loadingAi, setLoadingAi] = useState(false);
  const [aiError, setAiError] = useState("");

  // Nếu có chartId trong URL nhưng không có data, fetch từ API
  useEffect(() => {
    if (urlChartId && !data) {
      const fetchChart = async () => {
        setLoading(true);
        try {
          const chartData = await getTuViChart(urlChartId);

          // Wrap data giống như khi calculate
          const wrappedData = {
            chartId: urlChartId,
            output: chartData,
          };

          // Adapt sang format frontend (cần formData giả)
          const dummyFormData = {
            name: "User", // Placeholder
            calendarType: "duong",
          };

          const adaptedData = adaptBackendToFrontend(
            wrappedData,
            dummyFormData
          );

          setData(adaptedData);
          setChartId(urlChartId);
          setIsSaved(true);
        } catch (error) {
          console.error("Lỗi khi tải lá số:", error);
          alert("Không thể tải lá số. Vui lòng thử lại!");
          navigate("/tuvi");
        } finally {
          setLoading(false);
        }
      };
      fetchChart();
    }
  }, [urlChartId, data, navigate]);

  // Xử lý lưu lá số
  const handleSaveChart = async () => {
    if (isSaved) {
      alert("Lá số này đã được lưu rồi!");
      return;
    }

    if (!formData) {
      alert("Không có thông tin để lưu!");
      return;
    }

    setLoading(true);

    try {
      const apiData = {
        birthDate: `${formData.year}-${String(formData.month).padStart(
          2,
          "0"
        )}-${String(formData.day).padStart(2, "0")}`,
        birthHour: formData.hour,
        gender: formData.gender,
        birthPlace: "",
        isLunar: formData.calendarType === "am",
      };

      const response = await saveTuViChart(apiData);

      setIsSaved(true);
      setChartId(response.chartId);
      setData((prevData) => ({
        ...prevData,
        chartId: response.chartId,
      }));

      alert("Đã lưu lá số thành công!");
    } catch (error) {
      console.error("Lỗi khi lưu lá số:", error);
      alert(error.message || "Không thể lưu lá số!");
    } finally {
      setLoading(false);
    }
  };

  // Xử lý gọi AI luận giải
  const handleRequestAI = async () => {
    if (!data?.chartId && !chartId) {
      setAiError("Bạn cần LƯU LÁ SỐ trước khi sử dụng tính năng Luận Giải AI!");
      alert("⚠️ Vui lòng nhấn nút 'Lưu lá số' trước khi xem Luận Giải AI!");
      return;
    }

    setLoadingAi(true);
    setAiError("");

    try {
      const response = await requestAIInterpretation(data?.chartId || chartId);
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

  const getCungData = (chi) => data?.cacCung?.find((c) => c.diaChi === chi);

  const handleCungClick = (cungData) => {
    setSelectedCung(cungData);
    setShowAnalysisPopup(true);
  };

  // Thứ tự 12 cung chuẩn
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

  const sortedCung = zodiacOrder
    .map((chi) => getCungData(chi))
    .filter((c) => c !== undefined);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-white text-xl">Đang tải...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-white text-xl mb-4">Không có dữ liệu lá số</p>
          <button
            onClick={() => navigate("/tuvi")}
            className="bg-yellow-700 hover:bg-yellow-600 text-white px-6 py-2 rounded"
          >
            Quay về
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      {/* Nút quay về */}
      <button
        onClick={() => navigate("/tuvi")}
        className="mb-4 bg-red-800 hover:bg-red-700 text-white px-6 py-2 rounded shadow-lg border-2 border-yellow-500 font-bold"
      >
        ← Quay về
      </button>

      <div className="bg-[#fdfbf7] rounded shadow-2xl overflow-hidden">
        {/* Content Container */}
        <div className="p-4 md:p-6">
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
            {/* Grid 4x4 truyền thống */}
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

          {/* === ASPECTS - CHỈ SỐ VẬN MỆNH (Hiển thị Desktop) === */}
          <div className="hidden md:block mb-6">
            {data.aspects && <AspectsBars aspects={data.aspects} />}
          </div>

          {/* === NÚT LƯU LÁ SỐ (nếu chưa lưu) === */}
          {!isSaved && formData && (
            <div className="mt-4 mb-4 text-center">
              <button
                onClick={handleSaveChart}
                disabled={loading}
                className={`font-bold py-3 px-10 rounded shadow-lg border-2 transform transition-all duration-200 uppercase tracking-widest ${
                  loading
                    ? "bg-gray-600 text-gray-300 border-gray-500 cursor-not-allowed opacity-60"
                    : "bg-blue-700 hover:bg-blue-600 text-white border-blue-500 hover:scale-105 cursor-pointer"
                }`}
              >
                {loading ? "Đang lưu..." : "💾 Lưu lá số"}
              </button>
              <p className="text-blue-600 mt-2 text-sm font-serif">
                Lưu lá số để sử dụng tính năng Luận Giải AI
              </p>
            </div>
          )}

          {/* === THÔNG BÁO ĐÃ LƯU === */}
          {isSaved && (
            <div className="mt-4 mb-4 text-center">
              <p className="text-green-600 font-bold text-lg">
                ✓ Lá số đã được lưu thành công
              </p>
            </div>
          )}

          {/* NÚT XEM LUẬN GIẢI AI */}
          <div className="mt-2 mb-4 text-center">
            <button
              onClick={handleRequestAI}
              disabled={loadingAi || (!data?.chartId && !chartId)}
              className={`font-bold py-3 px-10 rounded shadow-lg border-2 transform transition-all duration-200 uppercase tracking-widest font-['Playfair_Display'] ${
                !data?.chartId && !chartId
                  ? "bg-gray-600 text-gray-300 border-gray-500 cursor-not-allowed opacity-60"
                  : loadingAi
                  ? "bg-red-700 text-yellow-400 border-yellow-500 opacity-50 cursor-not-allowed"
                  : "bg-red-800 hover:bg-red-900 text-yellow-400 border-yellow-600 hover:scale-105 cursor-pointer"
              }`}
              title={
                !data?.chartId && !chartId
                  ? "Vui lòng lưu lá số trước khi sử dụng tính năng này"
                  : ""
              }
            >
              {loadingAi ? "Đang phân tích..." : "Xem Luận Giải thầy Tùng"}
            </button>
            {!data?.chartId && !chartId && (
              <p className="text-orange-500 mt-2 text-sm font-serif">
                ⚠️ Bạn cần <strong>Lưu lá số</strong> trước khi sử dụng tính
                năng AI
              </p>
            )}
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
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4"
          onClick={() => setShowAiPopup(false)}
        >
          <div
            className="bg-white rounded-lg shadow-2xl max-w-3xl w-full max-h-[80vh] overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4 border-b pb-3">
              <h2 className="text-2xl font-bold text-red-900 font-['Playfair_Display']">
                Luận Giải thầy Tùng
              </h2>
              <button
                onClick={() => setShowAiPopup(false)}
                className="text-gray-500 hover:text-red-700 text-2xl font-bold"
              >
                ✕
              </button>
            </div>
            <div className="prose prose-sm max-w-none text-gray-800">
              <ReactMarkdown>{aiInterpretation}</ReactMarkdown>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TuviResultPage;

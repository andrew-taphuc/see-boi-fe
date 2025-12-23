// components/TuViIntro.jsx
import React from "react";

const TuViIntro = () => {
  return (
    <div className="w-full max-w-4xl mx-auto mt-8 mb-10 px-4">
      <div className="space-y-6">
        {/* Box 1: Giới thiệu chung */}
        <div className="bg-black/60 backdrop-blur-sm border-2 border-yellow-700 rounded overflow-hidden shadow-2xl">
          <div className="bg-red-900 border-b-4 border-yellow-600 p-4">
            <h3 className="font-['Playfair_Display'] text-xl md:text-2xl font-bold text-yellow-400 uppercase tracking-widest text-center">
              Giới thiệu về Tử Vi
            </h3>
          </div>
          <div className="p-6 md:p-8 text-gray-200 leading-relaxed text-base md:text-lg space-y-4">
            <p>
              <strong className="text-yellow-300 font-['Playfair_Display']">
                Tử Vi
              </strong>{" "}
              (hay Tử Vi Đẩu Số) là một bộ môn huyền học phương Đông được dùng
              để luận đoán về tính cách, hoàn cảnh, và dự đoán về các "vận hạn"
              trong cuộc đời.
            </p>
            <p>
              Cơ sở của Tử Vi dựa trên thuyết{" "}
              <span className="text-yellow-400 font-semibold">Âm Dương</span>,{" "}
              <span className="text-yellow-400 font-semibold">Ngũ Hành</span> và{" "}
              <span className="text-yellow-400 font-semibold">Can Chi</span>. Lá
              số được lập thành dựa trên 4 yếu tố chính (Tứ trụ):{" "}
              <span className="text-yellow-200 font-bold border-b-2 border-yellow-600">
                Giờ - Ngày - Tháng - Năm sinh
              </span>{" "}
              (theo Âm lịch) và Giới tính.
            </p>
          </div>
        </div>

        {/* Box 2: Để làm gì */}
        <div className="bg-black/60 backdrop-blur-sm border-2 border-yellow-700 rounded overflow-hidden shadow-2xl">
          <div className="bg-red-900 border-b-4 border-yellow-600 p-4">
            <h3 className="font-['Playfair_Display'] text-xl md:text-2xl font-bold text-yellow-400 uppercase tracking-widest text-center">
              Lá số tử vi để làm gì?
            </h3>
          </div>
          <div className="p-6 md:p-8 text-gray-200 leading-relaxed text-base md:text-lg">
            <p className="mb-6">
              Xem lá số tử vi trọn đời có bình giải chi tiết sẽ giúp quý bạn
              mệnh nắm bắt cơ hội tốt để phát triển sự nghiệp, công danh hoặc đề
              phòng những rủi ro, tai ương để hóa giải.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 text-gray-200 bg-yellow-900/20 p-3 rounded border border-yellow-700/30">
                <span className="text-yellow-500 text-xl mt-0.5">✦</span>
                <span>Luận giải Cung Mệnh, Thân</span>
              </div>
              <div className="flex items-start gap-3 text-gray-200 bg-yellow-900/20 p-3 rounded border border-yellow-700/30">
                <span className="text-yellow-500 text-xl mt-0.5">✦</span>
                <span>Đường Công danh, Tài lộc</span>
              </div>
              <div className="flex items-start gap-3 text-gray-200 bg-yellow-900/20 p-3 rounded border border-yellow-700/30">
                <span className="text-yellow-500 text-xl mt-0.5">✦</span>
                <span>Tình duyên, Gia đạo</span>
              </div>
              <div className="flex items-start gap-3 text-gray-200 bg-yellow-900/20 p-3 rounded border border-yellow-700/30">
                <span className="text-yellow-500 text-xl mt-0.5">✦</span>
                <span>Sức khỏe và Vận hạn</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TuViIntro;

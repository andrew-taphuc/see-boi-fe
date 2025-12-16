// components/TuViIntro.jsx
import React from "react";

const TuViIntro = () => {
  const namXemTuVi = [2026, 2025, 2024, 2023, 2022];

  return (
    <div className="w-full max-w-6xl mx-auto mt-8 p-4 text-justify">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* === CỘT TRÁI: GIỚI THIỆU === */}
        <div className="md:col-span-3 space-y-8">
          {/* Box 1: Giới thiệu chung */}
          <div className="bg-black/60 backdrop-blur-sm border border-yellow-700/50 rounded-lg overflow-hidden shadow-lg">
            <div className="bg-red-900/90 border-b-2 border-yellow-600 p-4">
              <h3 className="!font-['Playfair_Display'] text-xl font-bold text-yellow-400 uppercase font-serif tracking-wider flex items-center gap-2">
                Giới thiệu về Tử Vi
              </h3>
            </div>
            <div className="p-6 text-gray-300 leading-relaxed text-lg">
              <p className="mb-4">
                <strong className="text-yellow-200">Tử Vi</strong> (hay Tử Vi
                Đẩu Số) là một bộ môn huyền học phương Đông được dùng để luận
                đoán về tính cách, hoàn cảnh, và dự đoán về các "vận hạn" trong
                cuộc đời.
              </p>
              <p>
                Cơ sở của Tử Vi dựa trên thuyết{" "}
                <span className="text-yellow-500">Âm Dương</span>,{" "}
                <span className="text-yellow-500">Ngũ Hành</span> và{" "}
                <span className="text-yellow-500">Can Chi</span>. Lá số được lập
                thành dựa trên 4 yếu tố chính (Tứ trụ):{" "}
                <span className="text-white font-bold border-b border-yellow-500">
                  Giờ - Ngày - Tháng - Năm sinh
                </span>{" "}
                (theo Âm lịch) và Giới tính.
              </p>
            </div>
          </div>
          {/* Box 2: Để làm gì */}
          <div className="bg-black/60 backdrop-blur-sm border border-yellow-700/50 rounded-lg overflow-hidden shadow-lg">
            <div className="bg-red-900/90 border-b-2 border-yellow-600 p-4">
              <h3 className="!font-['Playfair_Display'] text-xl font-bold text-yellow-400 uppercase font-serif tracking-wider flex items-center gap-2">
                Lá số tử vi để làm gì?
              </h3>
            </div>
            <div className="p-6 text-gray-300 leading-relaxed text-lg">
              <p>
                Xem lá số tử vi trọn đời có bình giải chi tiết sẽ giúp quý bạn
                mệnh nắm bắt cơ hội tốt để phát triển sự nghiệp, công danh hoặc
                đề phòng những rủi ro, tai ương để hóa giải.
              </p>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-yellow-100">
                  <span className="text-yellow-500">✦</span> Luận giải Cung
                  Mệnh, Thân
                </div>
                <div className="flex items-center gap-2 text-yellow-100">
                  <span className="text-yellow-500">✦</span> Đường Công danh,
                  Tài lộc
                </div>
                <div className="flex items-center gap-2 text-yellow-100">
                  <span className="text-yellow-500">✦</span> Tình duyên, Gia đạo
                </div>
                <div className="flex items-center gap-2 text-yellow-100">
                  <span className="text-yellow-500">✦</span> Sức khỏe và Vận hạn
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* === CỘT PHẢI: SIDEBAR  === */}
        <div className="md:col-span-1">
          <div className="bg-black/60 backdrop-blur-sm border border-yellow-700/50 rounded-lg overflow-hidden shadow-lg sticky top-4">
            <div className="bg-red-900/90 border-b-2 border-yellow-600 p-4">
              <h3 className="text-lg font-bold text-yellow-400 uppercase text-center font-serif">
                Xem tử vi các năm
              </h3>
            </div>
            <div className="p-0">
              <ul className="divide-y divide-yellow-900/30">
                {namXemTuVi.map((nam) => (
                  <li key={nam} className="group">
                    <a
                      href="#"
                      className="flex items-center px-4 py-3 hover:bg-red-900/20 transition-colors duration-200"
                    >
                      <span className="w-1.5 h-1.5 bg-yellow-600 rounded-full mr-3 group-hover:bg-yellow-400 shadow-[0_0_5px_rgba(234,179,8,0.8)]"></span>
                      <span className="text-gray-300 group-hover:text-yellow-200 font-medium">
                        Tử vi năm {nam}
                      </span>
                    </a>
                  </li>
                ))}
                <li className="group">
                  <a
                    href="#"
                    className="flex items-center px-4 py-3 hover:bg-red-900/20 transition-colors duration-200"
                  >
                    <span className="w-1.5 h-1.5 bg-yellow-600 rounded-full mr-3 group-hover:bg-yellow-400 shadow-[0_0_5px_rgba(234,179,8,0.8)]"></span>
                    <span className="text-gray-300 group-hover:text-yellow-200 font-medium">
                      Xem sao hạn
                    </span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TuViIntro;

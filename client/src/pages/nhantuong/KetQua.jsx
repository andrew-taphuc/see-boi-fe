import Header from "../../components/nhantuong/Header";
import ImageBackground from "../../assets/nhantuong/bg.jpg";
import ButtonInfo from "../../assets/nhantuong/button_info.svg";
import Hook from "../../assets/nhantuong/hook.svg";
import { analysisData } from "../../data/analysisData";

const KetQua = () => {
  const analysisTags = [
    { label: "Năm nay:", value: "Giáp Thân" },
    { label: "Tháng sinh:", value: "Nhâm Thân" },
    { label: "Ngày sinh:", value: "Đinh Sửu" },
    { label: "Tiền kiếp:", value: "Tuyển Trung Thủy" },
    { label: "Tháng thai mẫu:", value: "Thần Thiên Pháp" },
    { label: "Quẻ:", value: "Càn Trực Độc (Quẻ thái chủ)" },
    { label: "Dung môn:", value: "Mộc" },
    { label: "Hỷ thần:", value: "Hỏa" },
  ];

  const navigationButtons = {
    left: [
      { href: "/landingpage", label: "Trang chủ" },
      { href: "/tuvi", label: "Tử vi" },
    ],
    right: [
      { href: "/tarot", label: "Xem Tarot" },
      { href: "/socialmedia", label: "Social" },
    ],
  };

  const NavButton = ({ href, label }) => (
    <a href={href} className="relative flex flex-col items-center gap-2 group">
      <div className="relative w-32 h-32">
        <img src={ButtonInfo} alt={label} className="w-full h-full" />
        <p className="absolute inset-0 flex items-center justify-center text-yellow-900 text-xl font-semibold">
          {label}
        </p>
      </div>
    </a>
  );

  return (
    <div
      className="min-h-screen bg-[#2d0a0a] relative"
      style={{
        backgroundImage: `linear-gradient(rgba(45, 10, 10, 0.5), rgba(45, 10, 10, 0.7)), url(${ImageBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center top",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="relative z-10">
        {/* Header with background */}
        <Header />
        {/* Content Section with 3 columns */}
        <div className="container mx-auto px-20 pb-10">
          <div className="flex gap-6 items-start justify-center">
            {/* Left Column - Navigation Buttons */}
            <div className="flex flex-col gap-6 sticky top-24 self-start">
              {navigationButtons.left.map((btn, idx) => (
                <NavButton key={idx} {...btn} />
              ))}
              <div className="flex justify-center">
                <img src={Hook} alt="decoration" className="w-20 h-auto" />
              </div>
            </div>

            {/* Center Column - Main Content */}
            <div className="max-w-5xl mx-auto flex-shrink-0">
              <div className="relative bg-gradient-to-br from-red-900/40 via-red-800/30 to-red-900/40 backdrop-blur-xs rounded-3xl border-2 border-yellow-600/40 p-12 shadow-2xl">
                {/* Corner decorations */}
                {[
                  "top-4 left-4 border-t-2 border-l-2 rounded-tl-lg",
                  "top-4 right-4 border-t-2 border-r-2 rounded-tr-lg",
                  "bottom-4 left-4 border-b-2 border-l-2 rounded-bl-lg",
                  "bottom-4 right-4 border-b-2 border-r-2 rounded-br-lg",
                ].map((className, idx) => (
                  <div
                    key={idx}
                    className={`absolute w-12 h-12 border-yellow-500/60 ${className}`}
                  />
                ))}

                <div className="space-y-8">
                  {/* Header Section */}
                  <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-light text-yellow-300">
                      Kết quả phân tích khuôn mặt
                    </h1>
                    <button className="flex items-center gap-2 text-yellow-300 border border-yellow-400/60 px-4 py-2 rounded-lg hover:bg-yellow-400/10 transition-colors">
                      <span className="text-sm">Luận Giải Mẫu</span>
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
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </div>

                  {/* User Info Card */}
                  <div className="flex gap-6 bg-red-900/30 rounded-xl p-6 border border-yellow-600/20">
                    <div className="flex-shrink-0">
                      <img
                        src="https://via.placeholder.com/150"
                        alt="Avatar"
                        className="w-32 h-32 rounded-lg object-cover border-2 border-yellow-500/40"
                      />
                    </div>

                    <div className="flex-1 space-y-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        {[
                          { label: "Họ và tên", value: "Bùi Quang Hưng" },
                          { label: "Giới tính", value: "Nam" },
                          { label: "Ngày sinh", value: "26-08-2004" },
                          { label: "Tuổi", value: "21" },
                        ].map((info, idx) => (
                          <div key={idx}>
                            <span className="text-yellow-400">
                              {info.label}
                            </span>
                            <p className="text-yellow-100/90 mt-1">
                              {info.value}
                            </p>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center gap-4 pt-2">
                        <button className="border border-yellow-400/60 text-yellow-300 px-6 py-2 rounded-full text-sm hover:bg-yellow-400/10 transition-colors">
                          Đổi ảnh luận giải
                        </button>
                      </div>
                      <p className="text-yellow-100/70 text-xs">
                        Đã có <span className="text-yellow-400">0</span> khách
                        hàng lựa chọn gói này.
                      </p>
                    </div>
                  </div>

                  {/* Analysis Tags Section */}
                  <div>
                    <h3 className="text-xl font-semibold text-yellow-300 mb-4">
                      Phân tích khuôn mặt chi tiết
                    </h3>
                    <div className="flex flex-wrap gap-3 mb-6">
                      {analysisTags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 rounded-full text-xs border border-yellow-500/40 text-yellow-100/90"
                        >
                          <span className="text-yellow-400">{tag.label}</span>{" "}
                          {tag.value}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Analysis Sections */}
                  <div className="space-y-4">
                    {analysisData.map((section) => (
                      <div
                        key={section.num}
                        className="bg-red-900/20 rounded-xl p-6 border border-yellow-600/20"
                      >
                        <h4 className="text-lg font-semibold text-yellow-300 mb-3">
                          <span className="text-yellow-500">{section.num}</span>{" "}
                          - {section.title}
                        </h4>
                        <p className="text-yellow-100/80 text-sm mb-2">
                          {section.desc}
                        </p>
                        {section.italic && (
                          <p className="text-yellow-100/70 text-sm italic mb-3">
                            {section.italic}
                          </p>
                        )}
                        <button className="flex items-center gap-2 text-yellow-400 text-sm hover:text-yellow-300 transition-colors">
                          <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path
                              fillRule="evenodd"
                              d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span>{section.note}</span>
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Bottom Buttons */}
                  <div className="flex items-center justify-center gap-4 pt-6 border-t border-yellow-600/20">
                    <button className="border border-yellow-400/60 text-yellow-300 px-8 py-3 rounded-full hover:bg-yellow-400/10 transition-colors">
                      Đổi ảnh luận giải
                    </button>
                  </div>

                  <p className="text-center text-yellow-100/70 text-xs">
                    Đã có <span className="text-yellow-400">0</span> khách hàng
                    lựa chọn gói này.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Navigation Buttons */}
            <div className="flex flex-col gap-6 sticky top-24 self-start">
              {navigationButtons.right.map((btn, idx) => (
                <NavButton key={idx} {...btn} />
              ))}
              <div className="flex justify-center">
                <img src={Hook} alt="decoration" className="w-16 h-auto" />
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-40 pb-10">
          <div className="mt-12 pt-6 text-center">
            <div className="text-yellow-100/70 text-xs">
              Copyright © 2025 by{" "}
              <span className="text-yellow-300">nhantuong.vn</span>. All rights
              reserved.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KetQua;

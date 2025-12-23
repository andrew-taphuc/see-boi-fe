import { useState } from "react";
import Header from "@components/nhantuong/Header";
import ImageBackground from "@assets/nhantuong/bg.jpg";
import ButtonInfo from "@assets/nhantuong/button_info.svg";
import Hook from "@assets/nhantuong/hook.svg";
import { analysisData } from "@/data/analysisData";
import BackgroundMenu from "@assets/nhantuong/background_menu.svg";
import MenuIcon from "@assets/nhantuong/menu.svg";
import CloseIcon from "@assets/nhantuong/close2.svg";
import BtnBackground from "@assets/nhantuong/btn.svg";
import BackToTop from "@assets/nhantuong/gps-navigation.png";

const KetQua = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const mobileMenuItems = [
    { label: "Trang chủ", href: "/landingpage" },
    { label: "Tử Vi", href: "/tuvi" },
    { label: "Xem Tarot", href: "/tarot" },
    { label: "Social", href: "/socialmedia" },
    { label: "Nhân Tướng", href: "/nhantuong" },
    { label: "Luận giải", href: "/nhantuong#xem-tuong" },
    { label: "Tính năng", href: "/nhantuong#tinh-nang" },
    { label: "Giới thiệu", href: "/nhantuong/gioi-thieu" },
    { label: "Liên hệ", href: "/nhantuong#nhantuong-footer" },
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
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className={`md:hidden fixed top-4 -left-3 z-[60] transition-opacity duration-300 ${
          isMobileMenuOpen ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
        aria-label="Toggle menu"
      >
        <div className="relative">
          <img
            src={BackgroundMenu}
            alt="background_menu"
            className="w-16 h-auto"
          />
          <img
            src={MenuIcon}
            alt="Menu"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6"
          />
        </div>
      </button>

      {/* Mobile Sidebar Menu */}
      <div
        className={`md:hidden fixed top-0 left-0 h-full bg-[#7F0200] z-50 transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } shadow-2xl overflow-y-auto rounded-tr-[20px] rounded-br-[20px]`}
        style={{ width: "calc(100vw - 60px)" }}
      >
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          className="absolute top-6 left-1/2 -translate-x-1/2 z-10 w-12 h-12"
          aria-label="Close menu"
        >
          <img src={CloseIcon} alt="Close" className="w-full h-full" />
        </button>

        <div className="flex flex-col gap-6 mt-25 px-6">
          {mobileMenuItems.map((item, index) => (
            <a
              key={index}
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block relative"
            >
              <div className="relative h-[50px] flex items-center justify-center">
                <img
                  src={BtnBackground}
                  alt="button"
                  className="absolute inset-0 w-full h-full object-contain"
                />
                <span className="text-yellow-900 font-medium text-lg relative z-10">
                  {item.label}
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Back to Top Button */}
      <a
        href="#top"
        className="fixed bottom-2 md:bottom-6 right-2 md:right-4 w-12 h-12 z-50 cursor-pointer"
        title="Back to Top"
      >
        <img src={BackToTop} alt="Back to Top" className="w-full h-full" />
      </a>

      <div className="relative z-10">
        {/* Header with background */}
        <Header />
        {/* Content Section with 3 columns */}
        <div className="container mx-auto px-4 md:px-20">
          <div className="flex gap-6 items-start justify-center">
            {/* Left Column - Navigation Buttons - Desktop Only */}
            <div className="hidden md:flex flex-col gap-6 sticky top-24 self-start">
              {navigationButtons.left.map((btn, idx) => (
                <NavButton key={idx} {...btn} />
              ))}
              <div className="flex justify-center">
                <img src={Hook} alt="decoration" className="w-20 h-auto" />
              </div>
            </div>

            {/* Center Column - Main Content */}
            <div className="w-full md:max-w-5xl mx-auto flex-shrink-0">
              <div className="relative bg-gradient-to-br from-red-900/40 via-red-800/30 to-red-900/40 backdrop-blur-xs rounded-3xl border-2 border-yellow-600/40 p-6 md:p-12 shadow-2xl">
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
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
                    <h1 className="text-2xl md:text-3xl font-light text-yellow-300">
                      Kết quả phân tích khuôn mặt
                    </h1>
                    <button className="flex items-center gap-2 text-yellow-300 border border-yellow-400/60 px-4 py-2 rounded-lg hover:bg-yellow-400/10 transition-colors whitespace-nowrap">
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
                  <div className="flex gap-4 md:gap-6 bg-red-900/30 rounded-xl p-4 md:p-6 border border-yellow-600/20">
                    {/* Avatar Column */}
                    <div className="flex-shrink-0">
                      <img
                        src="https://via.placeholder.com/150"
                        alt="Avatar"
                        className="w-40 h-46 md:w-48 md:h-48 rounded-lg object-cover border-2 border-yellow-500/40 shadow-lg"
                      />
                    </div>

                    {/* Info Column */}
                    <div className="flex-1 flex flex-col justify-between space-y-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-1 md:gap-4 text-sm">
                        {[
                          { label: "Họ và tên", value: "Bùi Quang Hưng" },
                          { label: "Giới tính", value: "Nam" },
                          { label: "Ngày sinh", value: "26-08-2004" },
                          { label: "Tuổi", value: "21" },
                        ].map((info, idx) => (
                          <div key={idx}>
                            <span className="text-yellow-400 font-medium">
                              {info.label}
                            </span>
                            <p className="text-yellow-100/90 mt-1 font-light">
                              {info.value}
                            </p>
                          </div>
                        ))}
                      </div>

                      <div className="hidden md:flex md:flex-col md:gap-2 md:pt-2">
                        <button className="border border-yellow-400/60 text-yellow-300 px-6 py-2 rounded-full text-sm hover:bg-yellow-400/10 transition-colors w-fit">
                          Đổi ảnh luận giải
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Analysis Tags Section */}
                  <div>
                    <h3 className="text-lg md:text-xl font-semibold text-yellow-300 mb-4">
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
                        className="bg-red-900/20 rounded-xl p-4 md:p-6 border border-yellow-600/20"
                      >
                        <h4 className="text-base md:text-lg font-semibold text-yellow-300 mb-3">
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
                    <button className="w-48 md:w-auto border border-yellow-400/60 text-yellow-300 px-8 py-3 rounded-full hover:bg-yellow-400/10 transition-colors">
                      Đổi ảnh luận giải
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Navigation Buttons - Desktop Only */}
            <div className="hidden md:flex flex-col gap-6 sticky top-24 self-start">
              {navigationButtons.right.map((btn, idx) => (
                <NavButton key={idx} {...btn} />
              ))}
              <div className="flex justify-center">
                <img src={Hook} alt="decoration" className="w-16 h-auto" />
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 md:px-40 pb-5 md:pb-10">
          <div className="mt-10 pt-6 text-center">
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

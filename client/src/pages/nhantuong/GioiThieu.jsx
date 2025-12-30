import { useState, useEffect } from "react";
import Header from "@components/nhantuong/Header";
import ImageBackground from "@assets/nhantuong/bg.jpg";
import ButtonInfo from "@assets/nhantuong/button_info.svg";
import Hook from "@assets/nhantuong/hook.svg";
import MenuBackground from "@assets/nhantuong/menu_background.svg";
import BackgroundMenu from "@assets/nhantuong/background_menu.svg";
import MenuIcon from "@assets/nhantuong/menu.svg";
import CloseIcon from "@assets/nhantuong/close2.svg";
import BtnBackground from "@assets/nhantuong/btn.svg";

// Navigation Buttons Configuration
// const navigationButtons = {
//   left: [
//     { href: "/landingpage", label: "Trang chủ" },
//     { href: "/tuvi", label: "Tử vi" },
//   ],
//   right: [
//     { href: "/tarot", label: "Xem Tarot" },
//     { href: "/socialmedia", label: "Social" },
//   ],
// };

// Reusable Navigation Button Component
const NavButton = ({ href, label }) => (
  <a href={href} className="relative flex flex-col items-center gap-2 group">
    <div className="relative w-36 h-36">
      <img src={ButtonInfo} alt={label} className="w-full h-full" />
      <p className="absolute inset-0 flex items-center justify-center text-yellow-900 text-xl font-semibold">
        {label}
      </p>
    </div>
  </a>
);

const GioiThieu = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 200);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // const menuItems = [
  //   { label: "Nhân tướng", href: "/nhantuong" },
  //   { label: "Luận giải", href: "/nhantuong#xem-tuong" },
  //   { label: "Tính năng", href: "/nhantuong#tinh-nang" },
  //   { label: "Giới thiệu", href: "/nhantuong/gioi-thieu" },
  //   { label: "Liên hệ", href: "/nhantuong#nhantuong-footer" },
  // ];

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

  return (
    <div className="min-h-screen bg-[#2d0a0a] relative">
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

      {/* Back Button */}
      <a
        href="/nhantuong"
        className="fixed top-4 left-4 md:top-8 md:left-8 z-50 flex items-center gap-2 bg-gradient-to-r from-yellow-600/80 to-yellow-500/80 hover:from-yellow-600 hover:to-yellow-500 backdrop-blur-sm text-white px-4 md:px-5 py-2 md:py-2.5 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-sm md:text-base border border-yellow-400/30"
      >
        <svg
          className="w-4 h-4 md:w-5 md:h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        <span className="hidden md:inline">Quay lại</span>
      </a>

      {/* Sticky Navigation Bar - Shows on Scroll - Desktop Only */}
      {/* <div
        className={`hidden md:block fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0"
        }`}
      >
        <div className="relative bg-red-950/10 backdrop-blur-md shadow-[0_4px_20px_rgba(124,109,72,0.1)] before:absolute before:inset-0 before:bg-red-950/25 before:backdrop-blur-sm before:-z-10">
          <div className="container mx-auto relative z-10">
            <div className="flex justify-center">
              <div
                className="px-32 py-5"
                style={{
                  backgroundImage: `url(${MenuBackground})`,
                  backgroundSize: "contain",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              >
                <ul className="flex gap-24 items-center text-xl">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <a
                        href={item.href}
                        className="text-yellow-100/90 hover:text-yellow-300 transition-colors font-medium"
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      <div className="relative z-10">
        <div
          className="min-h-screen"
          style={{
            backgroundImage: `linear-gradient(rgba(45, 10, 10, 0.5), rgba(45, 10, 10, 0.7)), url(${ImageBackground})`,
            backgroundSize: "cover",
            backgroundPosition: "center top",
            backgroundRepeat: "no-repeat",
            backgroundAttachment: "fixed",
          }}
        >
          <Header />

          {/* Content Section */}
          <div className="container mx-auto px-4 md:px-40 pb-5 md:pb-10">
            <div className="flex gap-8 items-start justify-center">
              {/* Left Column - Navigation Buttons - Desktop Only */}
              {/* <div className="hidden md:flex flex-col gap-6 sticky top-32 self-start z-40">
                {navigationButtons.left.map((btn, idx) => (
                  <NavButton key={idx} {...btn} />
                ))}
                <div className="flex justify-center">
                  <img src={Hook} alt="decoration" className="w-20 h-auto" />
                </div>
              </div> */}

              {/* Center Column - Main Content */}
              <div className="w-full md:max-w-5xl mx-auto">
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
                    {/* Title */}
                    <h1 className="text-2xl md:text-4xl font-light text-yellow-300 text-center leading-tight mb-6 md:mb-8">
                      Giới thiệu về nhân tướng học
                    </h1>
                    {/* Content */}
                    <div
                      className={`space-y-6 text-yellow-50/90 text-sm md:text-base leading-relaxed ${
                        !isExpanded ? "md:block" : ""
                      }`}
                    >
                      {/* Nội dung luôn hiển thị */}
                      <div
                        className={
                          !isExpanded
                            ? "line-clamp-[20] md:line-clamp-none"
                            : ""
                        }
                      >
                        {/* Section 1 */}
                        <div>
                          <h3 className="text-xl md:text-2xl font-semibold text-yellow-300 mb-4">
                            1. Nhân tướng học – nghệ thuật nhìn người từ ngàn
                            đời
                          </h3>
                          <p className="mb-4">
                            Từ xa xưa, ông cha ta đã đúc kết ra{" "}
                            <strong className="text-yellow-500">
                              Nhân tướng học{" "}
                            </strong>{" "}
                            – bộ môn nghiên cứu đường nét khuôn mặt để thấu hiểu{" "}
                            <strong className="text-yellow-500">
                              tính cách, vận mệnh, phúc lộc và nhân duyên{" "}
                            </strong>{" "}
                            của một người.
                          </p>
                          <ul className="space-y-2 ml-6 list-disc">
                            <li>
                              <strong className="text-yellow-500">
                                Đôi mắt
                              </strong>{" "}
                              tiết lộ thần thái, trí tuệ và tâm trạng
                            </li>
                            <li>
                              <strong className="text-yellow-500">Mũi</strong>{" "}
                              biểu thị tài lộc, sự nghiệp và ý chí
                            </li>
                            <li>
                              <strong className="text-yellow-500">
                                Miệng và cằm
                              </strong>{" "}
                              phản ánh cách giao tiếp, hậu vận và phúc khí
                            </li>
                            <li>
                              <strong className="text-yellow-500">
                                Trán và khuôn mặt
                              </strong>{" "}
                              cho thấy thiên hướng, con đường công danh
                            </li>
                          </ul>
                          <p className="mt-4">
                            Nhân tướng học không chỉ là{" "}
                            <strong className="text-yellow-500">
                              bói toán
                            </strong>{" "}
                            mà còn là{" "}
                            <strong className="text-yellow-500">
                              một bộ môn khoa học kinh nghiệm
                            </strong>
                            , giúp con người{" "}
                            <strong className="text-yellow-500">
                              tự nhận thức bản thân và hoàn thiện chính mình
                            </strong>
                            . Tuy nhiên, việc{" "}
                            <strong className="text-yellow-500">
                              luận giải tướng số
                            </strong>{" "}
                            phụ thuộc nhiều vào{" "}
                            <strong className="text-yellow-500">
                              kiến thức và kinh nghiệm cá nhân
                            </strong>
                            , đôi khi thiếu khách quan hoặc khó tiếp cận với thế
                            hệ trẻ.
                          </p>
                        </div>

                        {/* Section 2 */}
                        <div>
                          <h3 className="text-xl md:text-2xl font-semibold text-yellow-300 my-4">
                            2. See Bói – Kết hợp trí tuệ nhân tạo với tinh hoa
                            nhân tướng truyền thống
                          </h3>
                          <p className="mb-4">
                            <strong className="text-yellow-500">
                              See Bói{" "}
                            </strong>{" "}
                            ra đời để{" "}
                            <strong className="text-yellow-500">
                              hiện đại hóa nhân tướng học
                            </strong>
                            , đưa bộ môn truyền thống này đến gần hơn với mọi
                            người thông qua{" "}
                            <strong className="text-yellow-500">
                              công nghệ tiên tiến
                            </strong>
                            .
                          </p>
                          <p className="mb-4">
                            Chỉ với{" "}
                            <strong className="text-yellow-500">
                              một bức ảnh chân dung
                            </strong>
                            , hệ thống sẽ:
                          </p>
                          <ul className="space-y-2 ml-6 list-disc">
                            <li>
                              <strong className="text-yellow-500">
                                Ứng dụng sẽ phân tích Tam Đình
                              </strong>{" "}
                              <em>
                                để đánh giá tổng quan về trí tuệ, công danh,
                                nhân duyên và hậu vận
                              </em>
                              .
                            </li>
                            <li>
                              Đồng thời{" "}
                              <strong className="text-yellow-500">
                                nhận diện Ngũ Nhạc
                              </strong>{" "}
                              <em>(trán, mũi, miệng, hai gò má)</em> nhằm soi
                              chiếu{" "}
                              <strong className="text-yellow-500">
                                tính cách, phúc lộc và vận mệnh
                              </strong>{" "}
                              theo Nhân tướng học truyền thống.
                            </li>
                            <li>
                              Từ những dữ liệu này, hệ thống sẽ{" "}
                              <strong className="text-yellow-500">
                                đưa ra luận giải tham khảo
                              </strong>
                              , giúp mọi người{" "}
                              <strong className="text-yellow-500">
                                hiểu rõ hơn về bản thân, nhận diện ưu – nhược
                                điểm
                              </strong>
                              , và từ đó{" "}
                              <strong className="text-yellow-500">
                                định hướng phát triển cuộc sống một cách hài hòa
                                và tốt đẹp hơn
                              </strong>
                              .
                            </li>
                          </ul>
                        </div>

                        {/* Section 3 - Features */}
                        <div>
                          <h3 className="text-xl md:text-2xl font-semibold text-yellow-300 my-4">
                            Tính năng nổi bật
                          </h3>
                          <ol className="space-y-3 ml-6 list-decimal">
                            <li>
                              <strong className="text-yellow-500">
                                {" "}
                                tích chi tiết & toàn diện:
                              </strong>{" "}
                              Ứng dụng soi chiếu{" "}
                              <strong className="text-yellow-500">
                                Tam Đình, Ngũ Nhạc
                              </strong>{" "}
                              và từng bộ vị trên gương mặt (mắt, mày, mũi,
                              miệng,nhân trung…) theo Nhân tướng học Đông
                              phương, giúp phản ánh{" "}
                              <strong className="text-yellow-500">
                                khí chất, tính cách và vận mệnh
                              </strong>
                              .
                            </li>
                            <li>
                              <strong className="text-yellow-500">
                                Luận giải cá nhân hóa:
                              </strong>{" "}
                              Mỗi kết quả là{" "}
                              <strong className="text-yellow-500">
                                bản luận giải độc nhất
                              </strong>
                              , kết hợp tinh hoa{" "}
                              <strong className="text-yellow-500">
                                nhân tướng cổ truyền
                              </strong>{" "}
                              và{" "}
                              <strong className="text-yellow-500">
                                công nghệ hiện đại
                              </strong>
                              , phù hợp với đặc điểm và hành trình riêng của
                              bạn.
                            </li>
                            <li>
                              <strong className="text-yellow-500">
                                Nhanh chóng & dễ hiểu:
                              </strong>{" "}
                              Chỉ sau{" "}
                              <strong className="text-yellow-500">
                                chưa đầy một phút
                              </strong>
                              , bạn có ngay kết quả{" "}
                              <strong className="text-yellow-500">
                                chi tiết, sắc sảo, dễ tiếp cận
                              </strong>{" "}
                              và có thể lưu lại để tham khảo bất kỳ lúc nào.
                            </li>
                            <li>
                              <strong className="text-yellow-500">
                                Bảo mật tuyệt đối:
                              </strong>{" "}
                              Ảnh và dữ liệu{" "}
                              <strong className="text-yellow-500">
                                không lưu trữ, không chia sẻ
                              </strong>
                              , toàn bộ quá trình phân tích diễn ra tự động, đảm
                              bảo{" "}
                              <strong className="text-yellow-500">
                                an toàn thông tin cá nhân
                              </strong>
                              .
                            </li>
                          </ol>
                        </div>
                      </div>

                      {/* Xem thêm button - Mobile only */}
                      <div className="md:hidden mt-6 flex justify-center">
                        <button
                          onClick={() => setIsExpanded(!isExpanded)}
                          className="inline-flex items-center gap-2 px-6 py-2 bg-yellow-600/80 hover:bg-yellow-600 text-yellow-50 rounded-full transition-colors font-medium"
                        >
                          {isExpanded ? "Thu gọn" : "Xem thêm"}
                          <svg
                            className={`w-4 h-4 transition-transform ${
                              isExpanded ? "rotate-180" : ""
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Navigation Buttons - Desktop Only */}
              {/* <div className="hidden md:flex flex-col gap-6 sticky top-32 self-start z-40">
                {navigationButtons.right.map((btn, idx) => (
                  <NavButton key={idx} {...btn} />
                ))}
                <div className="flex justify-center">
                  <img src={Hook} alt="decoration" className="w-20 h-auto" />
                </div>
              </div> */}
            </div>
            <div className="mt-12 pt-6 text-center">
              <div className="text-yellow-100/70 text-xs">
                Copyright © 2025 by{" "}
                <span className="text-yellow-300">nhantuong.vn</span>. All
                rights reserved.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GioiThieu;

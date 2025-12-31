import { useState, useEffect } from "react";
import ThemedHeader from "@components/common/ThemedHeader";
import NhanTuongClassicHeader from "@components/nhantuong/Header";
import HeroSection from "@components/nhantuong/HeroSection";
import ButtonInfo from "@assets/nhantuong/button_info.svg";
import Hook from "@assets/nhantuong/hook.svg";
import MenuBackground from "@assets/nhantuong/menu_background.svg";
import BackgroundMenu from "@assets/nhantuong/background_menu.svg";
import MenuIcon from "@assets/nhantuong/menu.svg";
import CloseIcon from "@assets/nhantuong/close2.svg";
import FaceAnalysisForm from "@components/nhantuong/FaceAnalysisForm";
import Features from "@components/nhantuong/Features";
import FAQ from "@components/nhantuong/FAQ";
import ImageBackground from "@assets/nhantuong/bg7.jpg";
import ImageBackground2 from "@assets/nhantuong/pattern7.png";
import BackToTop from "@assets/nhantuong/gps-navigation.png";
import BtnBackground from "@assets/nhantuong/btn.svg";
import CommonFooter from "@components/common/CommonFooter";

// NavButton component - moved outside to avoid re-creation during render
const NavButton = () => (
  <a className="relative flex flex-col items-center gap-1 group">
    <div className="relative w-23 h-23">
      <img src={ButtonInfo} className="w-full h-full" />
      <p className="absolute inset-0 flex items-center justify-center text-yellow-900 text-base font-medium">
      </p>
    </div>
  </a>
);

const NhanTuong = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 200);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Ngăn overscroll và đặt background để tránh lộ nền trắng
  useEffect(() => {
    const originalBodyBg = document.body.style.backgroundColor;
    const originalHtmlBg = document.documentElement.style.backgroundColor;
    const originalBodyOverscroll = document.body.style.overscrollBehavior;
    const originalHtmlOverscroll = document.documentElement.style.overscrollBehavior;
    
    // Đặt màu nền và ngăn overscroll
    document.body.style.backgroundColor = '#500001';
    document.documentElement.style.backgroundColor = '#500001';
    document.body.style.overscrollBehavior = 'none';
    document.documentElement.style.overscrollBehavior = 'none';
    
    // Cleanup khi unmount
    return () => {
      document.body.style.backgroundColor = originalBodyBg;
      document.documentElement.style.backgroundColor = originalHtmlBg;
      document.body.style.overscrollBehavior = originalBodyOverscroll;
      document.documentElement.style.overscrollBehavior = originalHtmlOverscroll;
    };
  }, []);

  // const menuItems = [
  //   { label: "Nhân tướng", href: "/nhantuong" },
  //   { label: "Luận giải", href: "/nhantuong#xem-tuong" },
  //   { label: "Tính năng", href: "/nhantuong#tinh-nang" },
  //   { label: "Giới thiệu", href: "/nhantuong/gioi-thieu" },
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
    <div 
      className="min-h-screen bg-[#500001] relative overflow-hidden flex flex-col"
      style={{
        overscrollBehavior: 'none',
        overscrollBehaviorY: 'none',
        overflowX: 'hidden',
      }}
    >
      {/* Mobile Menu Button - Fixed in top left */}
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
        {/* Close Button */}
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          className="absolute top-6 left-1/2 -translate-x-1/2 z-10 w-12 h-12"
          aria-label="Close menu"
        >
          <img src={CloseIcon} alt="Close" className="w-full h-full" />
        </button>

        {/* Menu Items */}
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
        className=" fixed bottom-2 md:bottom-6 right-2 md:right-4 w-12 h-12 z-50 cursor-pointer"
        title="Back to Top"
      >
        <img src={BackToTop} alt="Back to Top" className="w-full h-full" />
      </a>

      {/* Left Navigation - Fixed Position - Desktop Only */}
      {/* <div className="hidden md:flex fixed left-15 top-20 flex-col gap-6 z-40">
        {navigationButtons.left.map((btn, idx) => (
          <NavButton key={idx} {...btn} disabled />
        ))}
        <NavButton/>
        <NavButton/>
        <div className="flex justify-center">
          <img src={Hook} alt="decoration" className="w-20 h-auto" />
        </div>
      </div> */}

      {/* Right Navigation - Fixed Position - Desktop Only */}
      {/* <div className="hidden md:flex fixed right-15 top-20 flex-col gap-6 z-40">
        {navigationButtons.right.map((btn, idx) => (
          <NavButton key={idx} {...btn} disabled />
        ))}
        <NavButton/>
        <NavButton/>
        <div className="flex justify-center">
          <img src={Hook} alt="decoration" className="w-20 h-auto" />
        </div>
      </div> */}

      {/* Main Content */}
      <div 
        className="relative z-10 flex-1 flex flex-col"
        style={{
          overscrollBehavior: 'none',
          overscrollBehaviorY: 'none',
        }}
      >
        <div
          style={{
            backgroundImage: `linear-gradient(rgba(45, 10, 10, 0.1), rgba(45, 10, 10, 0.3)), url(${ImageBackground})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <ThemedHeader variant="nhantuong" />
          <div className="pt-16 md:pt-20">
            <NhanTuongClassicHeader />
          </div>
          <HeroSection />
        </div>
        <div className="pt-4">
          <FaceAnalysisForm />
        </div>
        <Features />
        <div
          className="mt-auto"
          style={{
            backgroundImage: `linear-gradient(rgba(45, 10, 10, 0.5), rgba(45, 10, 10, 0.7)), url(${ImageBackground2})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          {/* <FAQ /> */}
          <CommonFooter variant="nhantuong" />
        </div>
      </div>
    </div>
  );
};

export default NhanTuong;

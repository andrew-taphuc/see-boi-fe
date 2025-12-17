import { useState, useEffect } from "react";
import Header from "../../components/nhantuong/Header";
import HeroSection from "../../components/nhantuong/HeroSection";
import ButtonInfo from "../../assets/nhantuong/button_info.svg";
import Hook from "../../assets/nhantuong/hook.svg";
import MenuBackground from "../../assets/nhantuong/menu_background.svg";
import FaceAnalysisForm from "../../components/nhantuong/FaceAnalysisForm";
import Features from "../../components/nhantuong/Features";
import FAQ from "../../components/nhantuong/FAQ";
import Footer from "../../components/nhantuong/Footer";
import ImageBackground from "../../assets/nhantuong/bg.jpg";
import ImageBackground2 from "../../assets/nhantuong/pattern7.png";
import BackToTop from "../../assets/nhantuong/gps-navigation.png";

const NhanTuong = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 200);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    { label: "Nhân tướng", href: "/nhantuong" },
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
        <p className="absolute inset-0 flex items-center justify-center text-yellow-900 text-xl font-medium">
          {label}
        </p>
      </div>
    </a>
  );

  return (
    <div className="min-h-screen bg-[#500001] relative overflow-hidden">
      {/* Back to Top Button */}
      <a
        href="#top"
        className="fixed bottom-6 right-4 w-12 h-12 z-50 cursor-pointer"
        title="Back to Top"
      >
        <img src={BackToTop} alt="Back to Top" className="w-full h-full" />
      </a>

      {/* Sticky Navigation Bar - Shows on Scroll */}
      <div
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0"
        }`}
      >
        <div className="relative bg-red-950/10 backdrop-blur-md shadow-[0_4px_20px_rgba(124,109,72,0.1)] before:absolute before:inset-0 before:bg-red-950/25 before:backdrop-blur-sm before:-z-10">
          <div className="container mx-auto relative z-10">
            <div className="flex justify-center">
              <div
                className="px-32 py-4"
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
      </div>

      {/* Left Navigation - Fixed Position */}
      <div className="fixed left-30 top-45 flex flex-col gap-6 z-40">
        {navigationButtons.left.map((btn, idx) => (
          <NavButton key={idx} {...btn} />
        ))}
        <div className="flex justify-center">
          <img src={Hook} alt="decoration" className="w-20 h-auto" />
        </div>
      </div>

      {/* Right Navigation - Fixed Position */}
      <div className="fixed right-30 top-45 flex flex-col gap-6 z-40">
        {navigationButtons.right.map((btn, idx) => (
          <NavButton key={idx} {...btn} />
        ))}
        <div className="flex justify-center">
          <img src={Hook} alt="decoration" className="w-20 h-auto" />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        <div
          style={{
            backgroundImage: `linear-gradient(rgba(45, 10, 10, 0.5), rgba(45, 10, 10, 0.7)), url(${ImageBackground})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <Header />
          {/* <div className="max-w-5xl mx-auto"> */}
          <HeroSection />
          {/* </div> */}
        </div>

        <FaceAnalysisForm />
        <Features />

        <div
          style={{
            backgroundImage: `linear-gradient(rgba(45, 10, 10, 0.5), rgba(45, 10, 10, 0.7)), url(${ImageBackground2})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <FAQ />
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default NhanTuong;

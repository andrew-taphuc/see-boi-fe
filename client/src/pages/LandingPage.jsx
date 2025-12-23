import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import heroImage from "@assets/hero-tarot.jpg";
import tarotCard1 from "@assets/tarot-card-1.jpg";
import tarotCard2 from "@assets/tarot-card-2.jpg";
import tuViWheel from "@assets/tu-vi-wheel.jpg";
import nhanTuongImage from "@assets/nhan-tuong.jpg";
import Header from "@components/landingPage/Header";
import Footer from "@components/landingPage/Footer";
import Login from "@components/Login&Register/Login";
import Register from "@components/Login&Register/Register";

const LandingPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [popupType, setPopupType] = useState(null);
  const openLogin = () => setPopupType("login");
  const openRegister = () => setPopupType("register");
  const closePopup = () => {
    setPopupType(null);
    // Xóa query param khi đóng popup
    if (searchParams.get('login')) {
      searchParams.delete('login');
      setSearchParams(searchParams, { replace: true });
    }
  };

  // Tự động mở popup login khi có query param ?login=true
  useEffect(() => {
    const loginParam = searchParams.get('login');
    if (loginParam === 'true' && popupType !== 'login') {
      setPopupType("login");
      // Xóa query param sau khi mở popup để URL sạch
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete('login');
      setSearchParams(newSearchParams, { replace: true });
    }
  }, [searchParams, popupType, setSearchParams]);

  return (
    <div className="min-h-screen bg-[#E8DCC4]">
      <Header
        isScrolled={isScrolled}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        onOpenLogin={openLogin}
        onOpenRegister={openRegister}
      />

      {/* Hero Section */}
      <section
        id="hero"
        className="relative pt-24 lg:pt-32 pb-16 lg:pb-24 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#D4B08A] to-[#C4996C] opacity-50"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-gray-900 mb-6 leading-tight">
                HỆ THỐNG XEM BÓI ONLINE <br />
                <span className="text-amber-600">ĐẦU TIÊN</span> TẠI VIỆT NAM
              </h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-xl">
                Thiên Lý xác định tương lai của bạn nằm ở cung cấp đầy đủ bản vẽ
                tâm hồn của bạn giúp mở ra những bí mật sâu xa về cuộc đời, dẫn
                lối cho bạn đến với "Sứ Mệnh."
              </p>
              <button className="inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-amber-800 text-white hover:bg-amber-900 focus-visible:ring-amber-800 h-11 px-8 shadow-xl">
                Xác định vận mệnh
              </button>
            </div>

            {/* Hero Image */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-xl">
                <img
                  src={heroImage}
                  alt="Mystical Tarot Cards"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tarot Section */}
      <section id="tarot" className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-gray-900 mb-4">
                Tarot
              </h2>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Tarot Cards */}
              <div className="flex justify-center gap-6">
                {/* Tarot Card 1 */}
                <div className="relative">
                  <img
                    src={tarotCard1}
                    alt="The Lovers Tarot Card"
                    className="w-40 sm:w-48 h-auto rounded-lg shadow-lg"
                  />
                </div>

                {/* Tarot Card 2 */}
                <div className="relative">
                  <img
                    src={tarotCard2}
                    alt="The Moon Tarot Card"
                    className="w-40 sm:w-48 h-auto rounded-lg shadow-lg"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="animate-fade-in-up">
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry's
                  standard dummy text ever since the 1500s, when an unknown
                  printer took a galley of type and scrambled it to make a type
                  specimen book. It has survived not only centuries, but also
                  the leap into electronic typesetting, remaining essentially
                  unchanged.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tử Vi Section */}
      <section id="tu-vi" className="py-16 lg:py-24 bg-[#F0E9DC]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-gray-900 mb-4">
                Tử vi
              </h2>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Description */}
              <div className="order-2 lg:order-1">
                <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry's
                  standard dummy text ever since the 1500s, when an unknown
                  printer took a galley of type and scrambled it to make a type
                  specimen book. It has survived not only centuries, but also
                  the leap into electronic typesetting, remaining essentially
                  unchanged.
                </p>
              </div>

              {/* Tử Vi Wheel */}
              <div className="flex justify-center order-1 lg:order-2">
                <div className="relative">
                  <img
                    src={tuViWheel}
                    alt="Vietnamese Zodiac Wheel"
                    className="w-full max-w-md h-auto rounded-lg shadow-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nhân tướng học Section */}
      <section id="nhan-tuong" className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 animate-fade-in">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-gray-900 mb-4">
                Nhân tướng học
              </h2>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Nhân tướng học Image */}
              <div className="flex justify-center">
                <img
                  src={nhanTuongImage}
                  alt="Face Reading Diagram"
                  className="w-full max-w-lg h-auto rounded-lg shadow-lg"
                />
              </div>

              {/* Description */}
              <div className="">
                <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry's
                  standard dummy text ever since the 1500s, when an unknown
                  printer took a galley of type and scrambled it to make a type
                  specimen book. It has survived not only centuries, but also
                  the leap into electronic typesetting, remaining essentially
                  unchanged.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="lien-he" className="py-16 lg:py-24 bg-[#F0E9DC]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-gray-900 mb-4">
                Liên hệ
              </h2>
            </div>

            <div className="rounded-lg border border-gray-300 bg-gray-50 text-gray-900 shadow-lg p-6 sm:p-8">
              <form className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-900 mb-2"
                  >
                    Họ và tên
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Nhập họ và tên của bạn"
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-900 mb-2"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="Nhập email của bạn"
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-900 mb-2"
                  >
                    Số điện thoại
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    placeholder="Nhập số điện thoại của bạn"
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-amber-800 text-white hover:bg-amber-900 focus-visible:ring-amber-800 h-11 px-8 w-full"
                >
                  Gửi
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* --- PHẦN POPUP MODAL --- */}
      {popupType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={closePopup} // Bấm ra ngoài thì đóng popup
          ></div>

          <div className="relative z-10 w-full max-w-md animate-fade-in-up">
            {popupType === "login" && (
              <Login onClose={closePopup} onSwitchToRegister={openRegister} />
            )}

            {popupType === "register" && (
              <Register onClose={closePopup} onSwitchToLogin={openLogin} />
            )}
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default LandingPage;

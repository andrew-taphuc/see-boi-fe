import { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "@context/AuthContext";
// Sử dụng video từ public folder
const heroVideo = "/video3.mp4";
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
  const { currentUser } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Refs cho scroll animation
  const tarotSectionRef = useRef(null);
  const tuviSectionRef = useRef(null);
  const nhanTuongSectionRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState({
    tarot: 0,
    tuvi: 0,
    nhanTuong: 0,
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      
      // Tính toán scroll progress cho mỗi section
      const calculateProgress = (ref) => {
        if (!ref.current) return 0;
        const rect = ref.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const sectionTop = rect.top;
        
        // Bắt đầu animation khi section còn cách viewport 200px
        // Hoàn thành khi section vào giữa viewport (50% viewport)
        const triggerPoint = windowHeight * 0.7; // Bắt đầu khi section còn cách 30% viewport
        const endPoint = windowHeight * 0.3; // Hoàn thành khi section ở 30% từ trên xuống
        
        if (sectionTop < triggerPoint && sectionTop > -rect.height) {
          // Tính progress từ 0 đến 1
          const distance = triggerPoint - endPoint;
          const currentDistance = triggerPoint - sectionTop;
          const progress = Math.min(1, Math.max(0, currentDistance / distance));
          return progress;
        }
        return 0;
      };
      
      setScrollProgress({
        tarot: calculateProgress(tarotSectionRef),
        tuvi: calculateProgress(tuviSectionRef),
        nhanTuong: calculateProgress(nhanTuongSectionRef),
      });
    };
    
    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Gọi ngay để tính toán ban đầu
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

  // Redirect đến /socialmedia khi đăng nhập thành công
  useEffect(() => {
    if (currentUser) {
      navigate("/socialmedia");
    }
  }, [currentUser, navigate]);

  // Ngăn viền trắng khi overscroll
  useEffect(() => {
    const originalBodyBg = document.body.style.backgroundColor;
    const originalHtmlBg = document.documentElement.style.backgroundColor;
    const originalBodyOverflow = document.body.style.overscrollBehavior;
    const originalHtmlOverflow = document.documentElement.style.overscrollBehavior;
    
    document.body.style.backgroundColor = '#E8DCC4';
    document.documentElement.style.backgroundColor = '#E8DCC4';
    document.body.style.overscrollBehavior = 'none';
    document.documentElement.style.overscrollBehavior = 'none';
    
    // Cleanup khi unmount
    return () => {
      document.body.style.backgroundColor = originalBodyBg;
      document.documentElement.style.backgroundColor = originalHtmlBg;
      document.body.style.overscrollBehavior = originalBodyOverflow;
      document.documentElement.style.overscrollBehavior = originalHtmlOverflow;
    };
  }, []);


  return (
    <div className="min-h-screen bg-[#E8DCC4]" style={{ fontFamily: "'Lexend', sans-serif" }}>
      <Header
        onOpenLogin={openLogin}
        onOpenRegister={openRegister}
      />

      {/* Hero Section */}
      <section
        id="hero"
        className="relative overflow-hidden flex items-center"
        style={{ minHeight: '100vh' }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#D4B08A] to-[#C4996C] opacity-50"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative w-full">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="mt-8 lg:mt-12">
              <div className="flex items-start gap-4 mb-6">
                {/* See Bói - vertical stack */}
                <div className="flex flex-col">
                  <span className="text-6xl sm:text-7xl lg:text-8xl font-serif font-bold text-amber-600 leading-none">SEE</span>
                  <span className="text-6xl sm:text-7xl lg:text-8xl font-serif font-bold text-amber-600 leading-none">BÓI</span>
                </div>
                {/* Right side text */}
                <div className="flex flex-col justify-start pt-2">
                  <div className="font-serif font-bold text-gray-900 leading-tight text-center">
                    <br />
                    <div className="text-5xl sm:text-6xl lg:text-7xl mb-2">HỆ THỐNG</div>
                    <br />
                    <div className="text-3xl sm:text-4xl lg:text-5xl">XEM BÓI ONLINE</div>
                  </div>
                </div>
              </div>
              <div className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-gray-900 mb-6">
                ĐẦU TIÊN TẠI VIỆT NAM
              </div>
              <p 
                className="text-xl sm:text-2xl text-gray-600 mb-8 leading-relaxed font-serif"
                style={{ 
                  maxWidth: '42ch',
                  wordSpacing: '0.05em'
                }}
              >
                Thiên Lý xác định tương lai của bạn nằm ở cung cấp đầy đủ bản vẽ tâm hồn của bạn giúp mở ra những bí mật sâu xa về cuộc đời, dẫn lối cho bạn đến với "Sứ Mệnh."
              </p>
              <button className="inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-amber-800 text-white hover:bg-amber-900 focus-visible:ring-amber-800 h-12 px-8 shadow-xl text-lg font-serif">
                Xác định vận mệnh
              </button>
            </div>

            {/* Hero Video */}
            <div className="relative flex justify-center">
              <div className="relative rounded-2xl overflow-hidden shadow-xl" style={{ width: '110%', maxWidth: '110%' }}>
                <video
                  src={heroVideo}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tarot Section */}
      <section 
        id="tarot" 
        ref={tarotSectionRef}
        className="py-16 lg:py-20 relative"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#E8DCC4] to-[#D4B08A] opacity-30"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                Tarot
              </h2>
            </div>

            <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
              {/* Tarot Card 1 - Bên trái, nghiêng trái */}
              <div 
                className="relative"
                style={{
                  transform: `translateX(${(1 - scrollProgress.tarot) * -100}px) rotate(${(1 - scrollProgress.tarot) * -15}deg)`,
                  opacity: scrollProgress.tarot,
                  transition: 'transform 0.1s ease-out, opacity 0.1s ease-out',
                }}
              >
                <img
                  src={tarotCard1}
                  alt="The Lovers Tarot Card"
                  className="w-40 sm:w-48 h-auto rounded-lg shadow-lg"
                />
              </div>

              {/* Description - Ở giữa */}
              <div
                className="flex-1 max-w-2xl"
                style={{
                  opacity: scrollProgress.tarot,
                  transform: `scale(${0.8 + scrollProgress.tarot * 0.2})`,
                  transition: 'transform 0.1s ease-out, opacity 0.1s ease-out',
                }}
              >
                <p className="text-lg sm:text-xl text-gray-700 leading-relaxed text-center" style={{ fontFamily: "'Lexend', sans-serif" }}>
                  <strong className="text-amber-800">Tarot</strong> là một hệ thống <em className="text-purple-700">bói bài cổ xưa</em> với <span className="font-bold text-amber-700">78 lá bài</span> chứa đựng những thông điệp sâu sắc về cuộc sống. Mỗi lá bài là một <em className="text-indigo-600">câu chuyện</em>, một <strong className="text-amber-800">bài học</strong> về tình yêu, công việc, và vận mệnh. 
                  <br /><br />
                  Thông qua việc <span className="font-semibold text-purple-700">trải bài Tarot</span>, bạn có thể <em className="text-amber-700">khám phá</em> những góc khuất trong tâm hồn, <strong className="text-indigo-800">hiểu rõ</strong> những thách thức đang đối mặt, và tìm thấy <span className="font-bold text-amber-600">hướng đi</span> cho tương lai. Mỗi lần rút bài là một <em className="text-purple-600">hành trình</em> khám phá bản thân đầy <strong className="text-amber-800">ý nghĩa</strong>.
                </p>
              </div>

              {/* Tarot Card 2 - Bên phải, nghiêng phải */}
              <div 
                className="relative"
                style={{
                  transform: `translateX(${(1 - scrollProgress.tarot) * 100}px) rotate(${(1 - scrollProgress.tarot) * 15}deg)`,
                  opacity: scrollProgress.tarot,
                  transition: 'transform 0.1s ease-out, opacity 0.1s ease-out',
                }}
              >
                <img
                  src={tarotCard2}
                  alt="The Moon Tarot Card"
                  className="w-40 sm:w-48 h-auto rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tử Vi Section */}
      <section 
        id="tu-vi" 
        ref={tuviSectionRef}
        className="py-16 lg:py-20 bg-[#F0E9DC] relative"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#F0E9DC] to-[#E8DCC4] opacity-40"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                Tử vi
              </h2>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Description */}
              <div 
                className="order-2 lg:order-1"
                style={{
                  transform: `translateX(${(1 - scrollProgress.tuvi) * -100}px)`,
                  opacity: scrollProgress.tuvi,
                  transition: 'transform 0.1s ease-out, opacity 0.1s ease-out',
                }}
              >
                <p className="text-lg sm:text-xl text-gray-700 leading-relaxed" style={{ fontFamily: "'Lexend', sans-serif" }}>
                  <strong className="text-red-800">Tử Vi Đẩu Số</strong> là một <em className="text-amber-700">môn khoa học dự đoán</em> cổ xưa của người Việt, dựa trên <span className="font-bold text-red-700">ngày tháng năm sinh</span> và <em className="text-amber-600">giờ sinh</em> để luận giải vận mệnh. 
                  <br /><br />
                  Hệ thống <strong className="text-red-800">12 cung</strong> và <span className="font-semibold text-amber-700">108 sao</span> sẽ tiết lộ những <em className="text-indigo-600">bí mật</em> về <strong className="text-red-700">công danh</strong>, <em className="text-purple-600">tài lộc</em>, <span className="font-bold text-amber-800">tình duyên</span>, và <strong className="text-indigo-800">sức khỏe</strong>. Mỗi <em className="text-amber-700">cung mệnh</em> là một <span className="font-semibold text-red-800">bản đồ</span> chỉ đường cho cuộc đời bạn.
                </p>
              </div>

              {/* Tử Vi Wheel */}
              <div 
                className="flex justify-center order-1 lg:order-2"
                style={{
                  transform: `translateX(${(1 - scrollProgress.tuvi) * 100}px)`,
                  opacity: scrollProgress.tuvi,
                  transition: 'transform 0.1s ease-out, opacity 0.1s ease-out',
                }}
              >
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
      <section 
        id="nhan-tuong" 
        ref={nhanTuongSectionRef}
        className="py-16 lg:py-20 relative"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#E8DCC4] to-[#D4B08A] opacity-30"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                Nhân tướng học
              </h2>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Nhân tướng học Image */}
              <div 
                className="flex justify-center"
                style={{
                  transform: `translateX(${(1 - scrollProgress.nhanTuong) * -100}px)`,
                  opacity: scrollProgress.nhanTuong,
                  transition: 'transform 0.1s ease-out, opacity 0.1s ease-out',
                }}
              >
                <img
                  src={nhanTuongImage}
                  alt="Face Reading Diagram"
                  className="w-full max-w-lg h-auto rounded-lg shadow-lg"
                />
              </div>

              {/* Description */}
              <div
                style={{
                  transform: `translateX(${(1 - scrollProgress.nhanTuong) * 100}px)`,
                  opacity: scrollProgress.nhanTuong,
                  transition: 'transform 0.1s ease-out, opacity 0.1s ease-out',
                }}
              >
                <p className="text-lg sm:text-xl text-gray-700 leading-relaxed" style={{ fontFamily: "'Lexend', sans-serif" }}>
                  <strong className="text-indigo-800">Nhân Tướng Học</strong> là nghệ thuật <em className="text-purple-700">đọc vị tính cách</em> và <span className="font-bold text-indigo-700">vận mệnh</span> thông qua <strong className="text-amber-800">đặc điểm khuôn mặt</strong>. Mỗi <em className="text-purple-600">đường nét</em>, <span className="font-semibold text-indigo-800">ánh mắt</span>, và <strong className="text-amber-700">nụ cười</strong> đều mang <em className="text-purple-700">ý nghĩa</em> riêng.
                  <br /><br />
                  Thông qua việc <span className="font-bold text-indigo-800">phân tích</span> <em className="text-amber-600">68 điểm trên khuôn mặt</em>, bạn sẽ <strong className="text-purple-800">khám phá</strong> được <span className="font-semibold text-indigo-700">tính cách</span> ẩn sâu, <em className="text-purple-600">tiềm năng</em> phát triển, và <strong className="text-amber-800">điểm mạnh</strong> của bản thân. Đây là <em className="text-indigo-700">chìa khóa</em> để <span className="font-bold text-purple-800">hiểu rõ</span> và <strong className="text-amber-700">phát huy</strong> tối đa năng lực của bạn.
                </p>
              </div>
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

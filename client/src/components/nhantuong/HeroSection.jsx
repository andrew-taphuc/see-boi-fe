const HeroSection = () => {
  const cornerClasses = [
    "top-2 left-2 md:top-4 md:left-4 border-t-2 border-l-2 rounded-tl-lg",
    "top-2 right-2 md:top-4 md:right-4 border-t-2 border-r-2 rounded-tr-lg",
    "bottom-2 left-2 md:bottom-4 md:left-4 border-b-2 border-l-2 rounded-bl-lg",
    "bottom-2 right-2 md:bottom-4 md:right-4 border-b-2 border-r-2 rounded-br-lg",
  ];

  return (
    <div className="relative pb-10 md:pb-20">
      <div className="container mx-auto px-4 pb-10 md:pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="relative bg-gradient-to-br from-red-900/40 via-red-800/30 to-red-900/40 backdrop-blur-xs rounded-2xl md:rounded-3xl border-2 border-yellow-600/40 p-6 md:p-12 shadow-2xl">
            {/* Corner decorations */}
            {cornerClasses.map((className, idx) => (
              <div
                key={idx}
                className={`absolute w-8 h-8 md:w-12 md:h-12 border-yellow-500/60 ${className}`}
              />
            ))}

            <div className="space-y-4 md:space-y-8 text-center">
              <h2 className="text-xl md:text-4xl lg:text-5xl font-light text-white leading-tight px-2">
                Xem tướng hiểu mình
                <br className="md:hidden" />{" "}
                <span className="md:inline">-</span> Khai Mở Vận Mệnh
              </h2>

              <div className="space-y-4 md:space-y-6 text-yellow-50/90 text-sm md:text-base lg:text-lg leading-relaxed max-w-4xl mx-auto">
                <p>
                  Nền tảng{" "}
                  <span className="text-yellow-400 font-semibold">
                    xem tướng mặt online
                  </span>{" "}
                  dựa trên tinh hoa huyền học Đông phương kết hợp với trí tuệ
                  nhân tạo và công nghệ thị giác máy tính hiện đại. Chúng tôi
                  mang đến cho bạn trải nghiệm khám phá bản thân một cách khoa
                  học, sâu sắc và hoàn toàn bảo mật{" "}
                  <a
                    href="#"
                    className="text-yellow-400 underline hover:text-yellow-300 transition-colors"
                  >
                    (Xem Chính sách bảo mật)
                  </a>
                  .
                </p>

                <p className="hidden md:block">
                  Thông qua từng đường nét trên gương mặt - từ Tam Đình, Ngũ
                  Nhạc đến các bộ vị như là Ấn Đường, Mắt, Mũi, Miệng, Nhân
                  Trung - hệ thống sẽ giúp bạn hiểu rõ tính cách, khí chất, cũng
                  như xu hướng vận mệnh và tiềm năng phát triển trong từng giai
                  đoạn cuộc đời.
                </p>
              </div>

              <div className="flex flex-col md:flex-row gap-4 md:gap-6 justify-center items-center pt-4 md:pt-8">
                <a href="#xem-tuong">
                  <button className="group flex items-center justify-center gap-2 md:gap-3 bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-white px-6 md:px-8 py-3 md:py-4 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-sm md:text-base">
                    <span>Xem thêm</span>
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
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;

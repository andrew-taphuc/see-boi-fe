const HeroSection = () => {
  const cornerClasses = [
    "top-1 left-1 md:top-2 md:left-2 border-t-2 border-l-2 rounded-tl-lg",
    "top-1 right-1 md:top-2 md:right-2 border-t-2 border-r-2 rounded-tr-lg",
    "bottom-1 left-1 md:bottom-2 md:left-2 border-b-2 border-l-2 rounded-bl-lg",
    "bottom-1 right-1 md:bottom-2 md:right-2 border-b-2 border-r-2 rounded-br-lg",
  ];

  return (
    <div className="relative pb-4 md:pb-7">
      <div className="container mx-auto px-2 pb-4 md:pb-7">
        <div className="max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto">
          <div className="relative bg-gradient-to-br from-red-900/40 via-red-800/30 to-red-900/40 backdrop-blur-xs rounded-xl md:rounded-2xl border-2 border-yellow-600/40 p-3 md:p-6 shadow-xl">
            {/* Corner decorations */}
            {cornerClasses.map((className, idx) => (
              <div
                key={idx}
                className={`absolute w-4 h-4 md:w-7 md:h-7 border-yellow-500/60 ${className}`}
              />
            ))}

            <div className="space-y-2 md:space-y-4 text-center">
              <h2 className="text-lg md:text-2xl lg:text-3xl font-light text-white leading-snug px-1">
                Xem tướng hiểu mình
                <br className="md:hidden" />{" "}
                <span className="md:inline">-</span> Khai Mở Vận Mệnh
              </h2>

              <div className="space-y-2 md:space-y-3 text-yellow-50/90 text-xs md:text-sm lg:text-base leading-relaxed max-w-2xl md:max-w-3xl mx-auto">
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

              <div className="flex flex-col md:flex-row gap-2 md:gap-4 justify-center items-center pt-2 md:pt-4">
                <a href="#xem-tuong">
                  <button className="group flex items-center justify-center gap-1.5 md:gap-2 bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-white px-4 md:px-6 py-2 md:py-2.5 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-xs md:text-sm">
                    <span>Xem thêm</span>
                    <svg
                      className="w-3.5 h-3.5 md:w-4 md:h-4"
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

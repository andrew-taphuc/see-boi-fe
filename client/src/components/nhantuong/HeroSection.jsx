const HeroSection = () => {
  const cornerClasses = [
    "top-4 left-4 border-t-2 border-l-2 rounded-tl-lg",
    "top-4 right-4 border-t-2 border-r-2 rounded-tr-lg",
    "bottom-4 left-4 border-b-2 border-l-2 rounded-bl-lg",
    "bottom-4 right-4 border-b-2 border-r-2 rounded-br-lg",
  ];

  return (
    <div className="relative pb-20">
      <div className="container mx-auto px-4 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="relative bg-gradient-to-br from-red-900/40 via-red-800/30 to-red-900/40 backdrop-blur-xs rounded-3xl border-2 border-yellow-600/40 p-12 shadow-2xl">
              {/* Corner decorations */}
              {cornerClasses.map((className, idx) => (
                <div
                  key={idx}
                  className={`absolute w-12 h-12 border-yellow-500/60 ${className}`}
                />
              ))}

              <div className="space-y-8 text-center">
                <h2 className="text-4xl md:text-5xl font-light text-white leading-tight">
                  Xem tướng hiểu mình - Khai Mở Vận Mệnh
                </h2>

                <div className="space-y-6 text-yellow-50/90 text-base md:text-lg leading-relaxed max-w-4xl mx-auto">
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

                  <p>
                    Thông qua từng đường nét trên gương mặt - từ Tam Đình, Ngũ
                    Nhạc đến các bộ vị như là Ấn Đường, Mắt, Mũi, Miệng, Nhân
                    Trung - hệ thống sẽ giúp bạn hiểu rõ tính cách, khí chất,
                    cũng như xu hướng vận mệnh và tiềm năng phát triển trong
                    từng giai đoạn cuộc đời.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
                  <a href="#xem-tuong">
                    <button className="group flex items-center gap-3 bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-white px-8 py-4 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                      <span>Xem Tướng Mặt</span>
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

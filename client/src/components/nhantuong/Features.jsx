import { useRef, useEffect } from "react";
import pattern3 from "../../assets/nhantuong/pattern3.svg";
import func1 from "../../assets/nhantuong/func1.svg";
import func2 from "../../assets/nhantuong/func2.svg";
import func3 from "../../assets/nhantuong/func3.svg";
import func4 from "../../assets/nhantuong/func4.svg";

const FeatureCard = ({ icon, title, description }) => (
  <div className="relative group">
    <div className="relative bg-gradient-to-br from-red-900/30 via-red-800/20 to-red-900/30 hover:bg-red-900 backdrop-blur-sm rounded-2xl border-2 border-red-700 p-8 hover:border-yellow-500 transition-all duration-300 min-h-[420px] flex flex-col">
      {/* Pattern3 with Icon Circle inside */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 z-10">
        <img src={pattern3} alt="pattern" className="w-full h-full" />

        {/* Icon Circle positioned inside pattern3 */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-3/5 w-16 h-16 rounded-ful flex items-center justify-center shadow-xl ">
          <img src={icon} alt={title} className="w-8 h-8" />
        </div>
      </div>

      {/* Spacing to account for top pattern */}
      <div className="h-12"></div>

      <h3 className="text-lg md:text-xl text-yellow-400 font-medium mb-4 text-center mt-4">
        {title}
      </h3>

      <div className="flex-grow">
        <p className="text-yellow-50/90 text-sm leading-relaxed text-center px-2">
          {description}
        </p>
      </div>
    </div>
  </div>
);

const Features = () => {
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || window.innerWidth >= 768) return;

    const handleScroll = () => {
      const clientWidth = container.clientWidth;
      const scrollLeft = container.scrollLeft;

      // Mỗi card chiếm toàn bộ width + gap
      const cardWidth = clientWidth;
      const totalCards = 4;
      const singleSetWidth = cardWidth * totalCards;

      // Khi scroll đến cuối set giữa, nhảy về đầu set giữa
      if (scrollLeft >= singleSetWidth * 2 - clientWidth / 2) {
        container.scrollLeft = singleSetWidth;
      }
      // Khi scroll về đầu set giữa, nhảy về cuối set giữa
      else if (scrollLeft <= singleSetWidth) {
        container.scrollLeft = singleSetWidth * 2 - clientWidth / 2;
      }
    };

    container.addEventListener("scroll", handleScroll, { passive: true });

    // Set vị trí ban đầu ở giữa
    setTimeout(() => {
      const cardWidth = container.clientWidth;
      container.scrollLeft = cardWidth * 4; // Bắt đầu từ card đầu tiên của set giữa
    }, 100);

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const features = [
    {
      icon: func1,
      title: "Luận giải chi tiết",
      description:
        "Phân tích và luận giải từng vùng trên gương mặt như Tam Đình, Ngũ Nhạc và các bộ vị trọng yếu theo hệ thống nhân tướng học Đông phương, nhằm đưa ra những nhận định chính xác, sâu sắc. Mỗi đặc điểm phản ánh rõ khí chất nội tâm, tư duy ứng xử và những dịch chuyển tiềm ẩn trong vận mệnh.",
    },
    {
      icon: func2,
      title: "Luận giải cá nhân hoá",
      description:
        "Chúng tôi kết hợp giữa nền tảng nhân tướng học cổ truyền và công nghệ hiện đại để phân tích và qua đó đưa ra những luận giải chuyên sâu, riêng biệt. Mỗi kết quả là một bản luận giải độc nhất — phản ánh đúng đặc điểm cá nhân, khí chất và hành trình vận mệnh của riêng bạn.",
    },
    {
      icon: func3,
      title: "Kết quả nhanh chóng",
      description:
        "Chỉ với chưa đầy một phút, bạn đã nhận được bản luận giải chi tiết cho từng vùng trên khuôn mặt. Không cần chờ đợi, không tốn chi phí cao — bạn tiết kiệm được thời gian, công sức mà vẫn có ngay một kết quả sắc sảo, dễ hiểu và có thể lưu trữ lâu dài để xem lại bất cứ lúc nào.",
    },
    {
      icon: func4,
      title: "Bảo mật tuyệt đối",
      description:
        "Với cam kết mạnh mẽ và rõ ràng. Chúng tôi không lưu trữ ảnh gốc, không chia sẻ dữ liệu và không sử dụng thông tin của bạn cho bất kỳ mục đích nào khác. Mọi phân tích được thực hiện tự động, khép kín — đảm bảo thông tin cá nhân luôn được bảo vệ.",
    },
  ];

  // Tạo 3 bộ cards để infinite scroll
  const tripleFeatures = [...features, ...features, ...features];

  return (
    <div id="tinh-nang" className="container mx-auto px-4 md:py-20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 md:mb-32">
          <h2 className="text-3xl md:text-4xl font-light text-white mb-2">
            Tính năng nổi bật
          </h2>
        </div>

        {/* Mobile: Horizontal Infinite Scroll Carousel */}
        <div className="md:hidden">
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-scroll snap-x snap-mandatory scrollbar-hide pt-20 pb-8"
            style={{
              scrollBehavior: "smooth",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {tripleFeatures.map((feature, idx) => (
              <div key={idx} className="flex-shrink-0 w-full snap-start px-2">
                <FeatureCard {...feature} />
              </div>
            ))}
          </div>
        </div>

        {/* Desktop: Grid Layout */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 pt-20">
          {features.map((feature, idx) => (
            <FeatureCard key={idx} {...feature} index={idx} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;

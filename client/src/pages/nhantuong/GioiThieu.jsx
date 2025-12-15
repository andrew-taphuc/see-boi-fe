import Header from "../../components/nhantuong/Header";
import Navigation from "../../components/nhantuong/Navigation";
import ImageBackground from "../../assets/nhantuong/bg.jpg";
import ButtonInfo from "../../assets/nhantuong/button_info.svg";
import Hook from "../../assets/nhantuong/hook.svg";

// Navigation Buttons Configuration
const navigationButtons = {
  left: [
    { href: "/landingpage", label: "Trang chủ" },
    { href: "/tuvi", label: "Tử vi" },
  ],
  right: [
    { href: "/tarot", label: "Xem Tarot" },
    { href: "/socialmedia", label: "MXH tâm linh" },
  ],
};

// Reusable Navigation Button Component
const NavButton = ({ href, label }) => (
  <a href={href} className="relative flex flex-col items-center gap-2 group">
    <div className="relative w-20 h-20">
      <img src={ButtonInfo} alt={label} className="w-full h-full" />
      <p className="absolute inset-0 flex items-center justify-center text-yellow-900 text-xs font-medium">
        {label}
      </p>
    </div>
  </a>
);

const GioiThieu = () => {
  return (
    <div className="min-h-screen bg-[#2d0a0a] relative overflow-hidden">
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
          <Navigation />

          {/* Content Section */}
          <div className="container mx-auto px-40 pb-10">
            <div className="flex gap-8 items-start justify-center">
              {/* Left Column - Navigation Buttons */}
              <div className="flex flex-col gap-6">
                {navigationButtons.left.map((btn, idx) => (
                  <NavButton key={idx} {...btn} />
                ))}
                <div className="flex justify-center">
                  <img src={Hook} alt="decoration" className="w-16 h-auto" />
                </div>
              </div>

              {/* Center Column - Main Content */}
              <div className="max-w-5xl mx-auto">
                <div className="relative bg-gradient-to-br from-red-900/40 via-red-800/30 to-red-900/40 backdrop-blur-xs rounded-3xl border-2 border-yellow-600/40 p-12 shadow-2xl">
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
                    <h1 className="text-4xl md:text-5xl font-light text-yellow-300 text-center leading-tight mb-8">
                      Giới thiệu về nhân tướng học
                    </h1>
                    {/* Content */}
                    <div className="space-y-6 text-yellow-50/90 text-base leading-relaxed">
                      {/* Section 1 */}
                      <div>
                        <h3 className="text-2xl font-semibold text-yellow-300 mb-4">
                          1. Nhân tướng học – nghệ thuật nhìn người từ ngàn đời
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
                            <strong className="text-yellow-500">Đôi mắt</strong>{" "}
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
                          <strong className="text-yellow-500">bói toán</strong>{" "}
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
                        <h3 className="text-2xl font-semibold text-yellow-300 mb-4">
                          2. See Bói – Kết hợp trí tuệ nhân tạo với tinh hoa
                          nhân tướng truyền thống
                        </h3>
                        <p className="mb-4">
                          <strong className="text-yellow-500">See Bói </strong>{" "}
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
                              để đánh giá tổng quan về trí tuệ, công danh, nhân
                              duyên và hậu vận
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
                              hiểu rõ hơn về bản thân, nhận diện ưu – nhược điểm
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
                        <h3 className="text-2xl font-semibold text-yellow-300 mb-4">
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
                            miệng,nhân trung…) theo Nhân tướng học Đông phương,
                            giúp phản ánh{" "}
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
                            , phù hợp với đặc điểm và hành trình riêng của bạn.
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
                  </div>
                </div>
              </div>

              {/* Right Column - Navigation Buttons */}
              <div className="flex flex-col gap-6">
                {navigationButtons.right.map((btn, idx) => (
                  <NavButton key={idx} {...btn} />
                ))}
                <div className="flex justify-center">
                  <img src={Hook} alt="decoration" className="w-16 h-auto" />
                </div>
              </div>
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

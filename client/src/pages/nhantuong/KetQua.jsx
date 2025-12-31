import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ThemedHeader from "@components/common/ThemedHeader";
import Header from "@components/nhantuong/Header";
import ImageBackground from "@assets/nhantuong/bg.jpg";
import ButtonInfo from "@assets/nhantuong/button_info.svg";
import Hook from "@assets/nhantuong/hook.svg";
import { analysisData } from "@/data/analysisData";
import BackgroundMenu from "@assets/nhantuong/background_menu.svg";
import MenuIcon from "@assets/nhantuong/menu.svg";
import CloseIcon from "@assets/nhantuong/close2.svg";
import BtnBackground from "@assets/nhantuong/btn.svg";
import BackToTop from "@assets/nhantuong/gps-navigation.png";
import FaceImageWithLandmarks from "@components/nhantuong/FaceImageWithLandmarks";
import { calculateZodiacSign, calculateLunarYear, calculateMenh } from "@utils/astrologyUtils";
import physiognomyService from "@utils/physiognomyService";
import { DEFAULT_AVATAR_PLACEHOLDER } from "@utils/placeholderUtils";

const KetQua = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [resultData, setResultData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    // Lấy data từ location.state
    if (location.state) {
      setResultData(location.state);
    } else {
      // Nếu không có data, redirect về trang nhân tướng
      navigate('/nhantuong');
    }
  }, [location, navigate]);

  // Format ngày sinh để hiển thị
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Tính tuổi từ ngày sinh
  const calculateAge = (dateString) => {
    if (!dateString) return '';
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Chuyển đổi gender từ API format sang hiển thị
  const formatGender = (gender) => {
    if (!gender) return '';
    return gender === 'MALE' ? 'Nam' : gender === 'FEMALE' ? 'Nữ' : gender;
  };

  if (!resultData) {
    return (
      <div className="min-h-screen bg-[#2d0a0a] flex items-center justify-center">
        <div className="text-yellow-300 text-xl">Đang tải...</div>
      </div>
    );
  }

  const { previewResult, interpretResult, personalInfo, originalImageFile } = resultData;
  const { report, landmarks, image_base64 } = previewResult || {};
  const interpret = interpretResult?.interpret || null;

  // Hàm xử lý lưu kết quả
  const handleSave = async () => {
    if (!previewResult || !personalInfo) {
      setSaveError("Thiếu dữ liệu để lưu");
      return;
    }

    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      // Bước 1: Upload ảnh và lấy URL
      let imageUrl = image_base64;
      
      // Nếu có file gốc, upload file
      if (originalImageFile) {
        const uploadResult = await physiognomyService.uploadImage(originalImageFile);
        console.log('Upload result:', uploadResult);
        // Thử nhiều cách lấy URL từ response
        imageUrl = uploadResult?.url || uploadResult?.data?.url || uploadResult?.data?.imageUrl || uploadResult?.imageUrl || imageUrl;
        console.log('Image URL after upload:', imageUrl);
      } else if (image_base64 && image_base64.startsWith('data:image')) {
        // Nếu là base64, convert sang File và upload
        const response = await fetch(image_base64);
        const blob = await response.blob();
        const file = new File([blob], 'face-image.jpg', { type: blob.type });
        const uploadResult = await physiognomyService.uploadImage(file);
        console.log('Upload result (from base64):', uploadResult);
        // Thử nhiều cách lấy URL từ response
        imageUrl = uploadResult?.url || uploadResult?.data?.url || uploadResult?.data?.imageUrl || uploadResult?.imageUrl || imageUrl;
        console.log('Image URL after upload (from base64):', imageUrl);
      }
      
      // Đảm bảo imageUrl không null
      if (!imageUrl) {
        throw new Error('Không thể lấy URL ảnh sau khi upload');
      }

      // Bước 2: Chuẩn bị data để lưu
      // Lấy từ interpret trước, nếu không có thì lấy từ preview
      const saveData = {
        name: personalInfo.name,
        birthday: personalInfo.birthday,
        gender: personalInfo.gender,
        report: report || previewResult.report,
        interpret: interpret || interpretResult?.interpret,
        landmarks: landmarks || previewResult.landmarks,
        imageUrl
      };

      // Bước 3: Gọi API save
      const result = await physiognomyService.save(saveData);
      
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Error saving result:", error);
      setSaveError(error.message || "Có lỗi xảy ra khi lưu kết quả");
    } finally {
      setIsSaving(false);
    }
  };

  // Tính toán các thông tin tử vi
  const zodiacSign = personalInfo?.birthday ? calculateZodiacSign(personalInfo.birthday) : "N/A";
  const lunarYear = personalInfo?.birthday ? calculateLunarYear(personalInfo.birthday) : "N/A";
  const menh = personalInfo?.birthday ? calculateMenh(personalInfo.birthday) : "N/A";

  const analysisTags = [
    { label: "Năm nay:", value: "Giáp Thân" },
    { label: "Tháng sinh:", value: "Nhâm Thân" },
    { label: "Ngày sinh:", value: "Đinh Sửu" },
    { label: "Tiền kiếp:", value: "Tuyển Trung Thủy" },
    { label: "Tháng thai mẫu:", value: "Thần Thiên Pháp" },
    { label: "Quẻ:", value: "Càn Trực Độc (Quẻ thái chủ)" },
    { label: "Dung môn:", value: "Mộc" },
    { label: "Hỷ thần:", value: "Hỏa" },
  ];

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

  const NavButton = ({ href, label, disabled }) => (
    <div className="relative flex flex-col items-center gap-2 group cursor-not-allowed pointer-events-none">
      <div className="relative w-32 h-32">
        <img src={ButtonInfo} alt={label || ""} className="w-full h-full" />
      </div>
    </div>
  );

  return (
    <div
      className="min-h-screen bg-[#2d0a0a] relative"
      style={{
        backgroundImage: `linear-gradient(rgba(45, 10, 10, 0.5), rgba(45, 10, 10, 0.7)), url(${ImageBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center top",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
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

      {/* Back to Top Button */}
      <a
        href="#top"
        className="fixed bottom-2 md:bottom-6 right-2 md:right-4 w-12 h-12 z-50 cursor-pointer"
        title="Back to Top"
      >
        <img src={BackToTop} alt="Back to Top" className="w-full h-full" />
      </a>

      <div className="relative z-10">
        {/* ThemedHeader */}
        <ThemedHeader variant="nhantuong" />
        {/* Header with background */}
        <div className="pt-16 md:pt-20">
          <Header />
        </div>
        {/* Content Section with 3 columns */}
        <div className="container mx-auto px-4 md:px-20">
          <div className="flex gap-6 items-start justify-center">
            {/* Left Column - Navigation Buttons - Desktop Only */}
            <div className="hidden md:flex flex-col gap-6 sticky top-24 self-start">
              {navigationButtons.left.map((btn, idx) => (
                <NavButton key={idx} {...btn} disabled />
              ))}
              <div className="flex justify-center">
                <img src={Hook} alt="decoration" className="w-20 h-auto" />
              </div>
            </div>

            {/* Center Column - Main Content */}
            <div className="w-full md:max-w-5xl mx-auto flex-shrink-0">
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
                  {/* Header Section */}
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-yellow-300">
                      <b>Kết quả phân tích khuôn mặt</b>
                    </h1>

                  </div>

                  {/* User Info Card */}
                  <div className="flex flex-col md:flex-row gap-6 md:gap-8 bg-red-900/60 rounded-xl p-6 md:p-8 border border-yellow-600/20">
                    {/* Avatar Column - Larger */}
                    <div className="flex-shrink-0 w-full md:w-80 lg:w-96">
                      {image_base64 ? (
                        <div className="w-full">
                          <FaceImageWithLandmarks
                            imageSrc={image_base64}
                            landmarks={landmarks}
                          />
                        </div>
                      ) : (
                        <img
                          src={DEFAULT_AVATAR_PLACEHOLDER}
                          alt="Avatar"
                          className="w-full h-auto rounded-lg object-cover border-2 border-yellow-500/40 shadow-lg"
                          onError={(e) => {
                            // Fallback nếu image load lỗi
                            e.target.src = DEFAULT_AVATAR_PLACEHOLDER;
                          }}
                        />
                      )}
                    </div>

                    {/* Info Column - Larger */}
                    <div className="flex-1 flex flex-col justify-between space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 text-base md:text-lg">
                        {[
                          { label: "Họ và tên", value: personalInfo?.name || "N/A" },
                          { label: "Giới tính", value: formatGender(personalInfo?.gender) },
                          { label: "Ngày sinh", value: formatDate(personalInfo?.birthday) },
                          { label: "Tuổi", value: personalInfo?.birthday ? calculateAge(personalInfo.birthday) : "N/A" },
                          { label: "Cung hoàng đạo", value: zodiacSign },
                          { label: "Năm sinh âm lịch", value: lunarYear },
                          { label: "Mệnh", value: menh },
                        ].map((info, idx) => (
                          <div key={idx} className="space-y-2">
                            <span className="text-yellow-400 font-semibold text-lg md:text-xl block">
                              {info.label}
                            </span>
                            <p className="text-yellow-100/90 font-medium text-base md:text-lg">
                              {info.value}
                            </p>
                          </div>
                        ))}
                      </div>

                      <div className="flex flex-col items-center gap-3 md:pt-4">
                        <button 
                          onClick={() => navigate('/nhantuong')}
                          className="border border-yellow-400/60 text-yellow-300 px-6 py-3 rounded-full text-base md:text-lg hover:bg-yellow-400/10 transition-colors w-fit font-bold"
                        >
                          <b>Đổi ảnh luận giải</b>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Analysis Sections */}
                  <div className="space-y-6">
                    {/* Phần 1: Tổng quan mệnh cục */}
                    {interpret && interpret['tong-quan'] && (
                      <div className="bg-red-900/70 rounded-xl p-4 md:p-6 border border-yellow-600/20">
                        <h4 className="text-xl md:text-2xl font-semibold text-yellow-300 mb-4">
                          <span className="text-yellow-500">I.</span> Tổng quan mệnh cục
                        </h4>
                        <div className="text-yellow-100/80 text-base md:text-lg leading-relaxed whitespace-pre-line">
                          {interpret['tong-quan']}
                        </div>
                      </div>
                    )}

                    {/* Phần 2: Luận giải chi tiết */}
                    {interpret && (
                      <div className="bg-red-900/70 rounded-xl p-4 md:p-6 border border-yellow-600/20">
                        <h4 className="text-xl md:text-2xl font-semibold text-yellow-300 mb-4">
                          <span className="text-yellow-500">II.</span> Luận giải chi tiết
                        </h4>
                        <div className="space-y-5">
                          {/* Tam Đình */}
                          {interpret.tam_dinh && (
                            <div className="space-y-3">
                              <h5 className="text-yellow-400 font-bold text-base md:text-lg">
                                Tam Đình
                              </h5>
                              {interpret.tam_dinh.thuong_dinh && (
                                <div className="pl-4 border-l-2 border-yellow-500/30">
                                  <p className="text-yellow-300/90 font-bold text-base md:text-lg mb-1">
                                    Thượng Đình:
                                  </p>
                                  <p className="text-yellow-100/80 text-base md:text-lg leading-relaxed whitespace-pre-line">
                                    {interpret.tam_dinh.thuong_dinh}
                                  </p>
                                </div>
                              )}
                              {interpret.tam_dinh.trung_dinh && (
                                <div className="pl-4 border-l-2 border-yellow-500/30">
                                  <p className="text-yellow-300/90 font-bold text-base md:text-lg mb-1">
                                    Trung Đình:
                                  </p>
                                  <p className="text-yellow-100/80 text-base md:text-lg leading-relaxed whitespace-pre-line">
                                    {interpret.tam_dinh.trung_dinh}
                                  </p>
                                </div>
                              )}
                              {(interpret.tam_dinh.ha_dinh || interpret.tam_dinh.tam_dinh) && (
                                <div className="pl-4 border-l-2 border-yellow-500/30">
                                  <p className="text-yellow-300/90 font-bold text-base md:text-lg mb-1">
                                    Hạ Đình:
                                  </p>
                                  <p className="text-yellow-100/80 text-base md:text-lg leading-relaxed whitespace-pre-line">
                                    {interpret.tam_dinh.ha_dinh || interpret.tam_dinh.tam_dinh}
                                  </p>
                                </div>
                              )}
                              {interpret.tam_dinh.tong_quan && (
                                <div className="pl-4 border-l-2 border-yellow-500/30 mt-3">
                                  <p className="text-yellow-300/90 font-bold text-base md:text-lg mb-1">
                                    Tổng quan Tam Đình:
                                  </p>
                                  <p className="text-yellow-100/80 text-base md:text-lg leading-relaxed whitespace-pre-line">
                                    {interpret.tam_dinh.tong_quan}
                                  </p>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Ngũ Quan */}
                          {interpret.ngu_quan && (
                            <div className="space-y-3">
                              <h5 className="text-yellow-400 font-bold text-base md:text-lg">
                                Ngũ Quan
                              </h5>
                              {interpret.ngu_quan.long_may && (
                                <div className="pl-4 border-l-2 border-yellow-500/30">
                                  <p className="text-yellow-300/90 font-bold text-base md:text-lg mb-1">
                                    Lông Mày:
                                  </p>
                                  <p className="text-yellow-100/80 text-base md:text-lg leading-relaxed whitespace-pre-line">
                                    {interpret.ngu_quan.long_may}
                                  </p>
                                </div>
                              )}
                              {interpret.ngu_quan.mat && (
                                <div className="pl-4 border-l-2 border-yellow-500/30">
                                  <p className="text-yellow-300/90 font-bold text-base md:text-lg mb-1">
                                    Mắt:
                                  </p>
                                  <p className="text-yellow-100/80 text-base md:text-lg leading-relaxed whitespace-pre-line">
                                    {interpret.ngu_quan.mat}
                                  </p>
                                </div>
                              )}
                              {interpret.ngu_quan.mui && (
                                <div className="pl-4 border-l-2 border-yellow-500/30">
                                  <p className="text-yellow-300/90 font-bold text-base md:text-lg mb-1">
                                    Mũi:
                                  </p>
                                  <p className="text-yellow-100/80 text-base md:text-lg leading-relaxed whitespace-pre-line">
                                    {interpret.ngu_quan.mui}
                                  </p>
                                </div>
                              )}
                              {interpret.ngu_quan.tai && (
                                <div className="pl-4 border-l-2 border-yellow-500/30">
                                  <p className="text-yellow-300/90 font-bold text-base md:text-lg mb-1">
                                    Tai:
                                  </p>
                                  <p className="text-yellow-100/80 text-base md:text-lg leading-relaxed whitespace-pre-line">
                                    {interpret.ngu_quan.tai}
                                  </p>
                                </div>
                              )}
                              {interpret.ngu_quan.mieng_cam && (
                                <div className="pl-4 border-l-2 border-yellow-500/30">
                                  <p className="text-yellow-300/90 font-bold text-base md:text-lg mb-1">
                                    Miệng & Cằm:
                                  </p>
                                  <p className="text-yellow-100/80 text-base md:text-lg leading-relaxed whitespace-pre-line">
                                    {interpret.ngu_quan.mieng_cam}
                                  </p>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Ấn Đường */}
                          {interpret.an_duong && (
                            <div className="space-y-3">
                              <h5 className="text-yellow-400 font-bold text-base md:text-lg">
                                Ấn Đường
                              </h5>
                              <div className="pl-4 border-l-2 border-yellow-500/30">
                                {interpret.an_duong.mo_ta && (
                                  <div className="mb-2">
                                    <p className="text-yellow-300/90 font-bold text-base md:text-lg mb-1">
                                      Mô tả:
                                    </p>
                                    <p className="text-yellow-100/80 text-base md:text-lg leading-relaxed whitespace-pre-line">
                                      {interpret.an_duong.mo_ta}
                                    </p>
                                  </div>
                                )}
                                {interpret.an_duong.y_nghia && (
                                  <div className="mb-2">
                                    <p className="text-yellow-300/90 font-bold text-base md:text-lg mb-1">
                                      Ý nghĩa:
                                    </p>
                                    <p className="text-yellow-100/80 text-base md:text-lg leading-relaxed whitespace-pre-line">
                                      {interpret.an_duong.y_nghia}
                                    </p>
                                  </div>
                                )}
                                {interpret.an_duong.danh_gia && (
                                  <div>
                                    <p className="text-yellow-300/90 font-bold text-base md:text-lg mb-1">
                                      Đánh giá:
                                    </p>
                                    <p className="text-yellow-100/80 text-base md:text-lg leading-relaxed whitespace-pre-line">
                                      {interpret.an_duong.danh_gia}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Phần 3: Lời khuyên */}
                    {interpret && interpret.loi_khuyen && Array.isArray(interpret.loi_khuyen) && interpret.loi_khuyen.length > 0 && (
                      <div className="bg-red-900/70 rounded-xl p-4 md:p-6 border border-yellow-600/20">
                        <h4 className="text-xl md:text-2xl font-semibold text-yellow-300 mb-4">
                          <span className="text-yellow-500">III.</span> Lời khuyên
                        </h4>
                        <ul className="space-y-3">
                          {interpret.loi_khuyen.map((khuyen, index) => (
                            <li key={index} className="flex items-start gap-3">
                              <span className="text-yellow-500 font-bold text-xl mt-0.5">•</span>
                              <p className="text-yellow-100/80 text-base md:text-lg leading-relaxed flex-1">
                                {khuyen}
                              </p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Hiển thị thông báo nếu chưa có dữ liệu interpret */}
                    {!interpret && (
                      <div className="bg-red-900/70 rounded-xl p-4 md:p-6 border border-yellow-600/20">
                        <p className="text-yellow-100/70 text-sm md:text-base text-center">
                          Đang tải dữ liệu luận giải...
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Bottom Buttons */}
                  <div className="flex flex-col items-center gap-4 pt-6 border-t border-yellow-600/20">
                    {saveError && (
                      <div className="text-red-400 text-sm text-center">
                        {saveError}
                      </div>
                    )}
                    {saveSuccess && (
                      <div className="text-green-400 text-sm text-center">
                        Lưu kết quả thành công!
                      </div>
                    )}
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="border border-yellow-400/70 text-yellow-200 font-bold px-6 py-3 rounded-full text-base md:text-lg hover:bg-yellow-400/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      type="button"
                    >
                      {isSaving ? "Đang lưu..." : "Lưu kết quả luận giải"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Navigation Buttons - Desktop Only */}
            <div className="hidden md:flex flex-col gap-6 sticky top-24 self-start">
              {navigationButtons.right.map((btn, idx) => (
                <NavButton key={idx} {...btn} disabled />
              ))}
              <div className="flex justify-center">
                <img src={Hook} alt="decoration" className="w-16 h-auto" />
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 md:px-40 pb-5 md:pb-10">
          <div className="mt-10 pt-6 text-center">
            <div className="text-yellow-100/70 text-xs">
              Copyright © 2025 by{" "}
              <span className="text-yellow-300">nhantuong.vn</span>. All rights
              reserved.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KetQua;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import physiognomyService from "@utils/physiognomyService";
import { validateAndCropFace } from "@utils/faceDetection";

// Form field configurations
const formFields = {
  textInputs: [
    {
      name: "fullName",
      label: "Họ và tên",
      placeholder: "Nhập họ và tên",
      required: true,
      colSpan: "col-span-8 md:col-span-7",
    },
    {
      name: "email",
      label: "Email nhận file PDF kết quả (không bắt buộc)",
      placeholder: "Nhập email",
      required: false,
      colSpan: "col-span-12",
    },
  ],
  selects: [
    {
      name: "gender",
      label: "Giới tính",
      options: [
        { value: "", label: "Chọn" },
        { value: "male", label: "Nam" },
        { value: "female", label: "Nữ" },
      ],
      required: true,
      colSpan: "col-span-4 md:col-span-5",
    },
  ],
};

const FaceAnalysisForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    gender: "",
    day: "",
    month: "",
    year: "",
    email: "",
    imageFile: null,
    agreeTerms: false,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [processingImage, setProcessingImage] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setProcessingImage(true);
    setError(null);

    try {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setError("Định dạng ảnh không hợp lệ. Vui lòng chọn ảnh JPG, JPEG, PNG hoặc WEBP");
        setProcessingImage(false);
        return;
      }

      // Validate file size
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        setError("Kích thước ảnh quá lớn. Vui lòng chọn ảnh nhỏ hơn 5MB");
        setProcessingImage(false);
        return;
      }

      // Validate và crop face
      const result = await validateAndCropFace(file);
      
      if (!result.success) {
        setError(result.error);
        setProcessingImage(false);
        return;
      }

      // Sử dụng ảnh đã crop
      const croppedFile = result.file;
      setFormData({ ...formData, imageFile: croppedFile });
      
      // Preview ảnh đã crop
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(croppedFile);
    } catch (err) {
      console.error('Error processing image:', err);
      setError(err.message || "Có lỗi xảy ra khi xử lý ảnh. Vui lòng thử lại.");
    } finally {
      setProcessingImage(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validate form
    if (!formData.imageFile) {
      setError("Vui lòng tải ảnh khuôn mặt");
      return;
    }

    if (!formData.fullName || !formData.gender || !formData.day || !formData.month || !formData.year) {
      setError("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    if (!formData.agreeTerms) {
      setError("Vui lòng đồng ý với điều khoản và dịch vụ");
      return;
    }

    // Validate image file
    const file = formData.imageFile;
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError("Định dạng ảnh không hợp lệ. Vui lòng chọn ảnh JPG, JPEG, PNG hoặc WEBP");
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setError("Kích thước ảnh quá lớn. Vui lòng chọn ảnh nhỏ hơn 5MB");
      return;
    }

    setLoading(true);
    try {
      // Gọi API preview
      const previewResult = await physiognomyService.preview(formData.imageFile);

      // Chuyển đổi gender từ "male"/"female" sang "MALE"/"FEMALE"
      const genderMapping = {
        male: "MALE",
        female: "FEMALE"
      };

      // Format birthday từ day, month, year
      const birthday = `${formData.year}-${String(formData.month).padStart(2, '0')}-${String(formData.day).padStart(2, '0')}`;

      // Chuẩn bị personalInfo để gọi API interpret
      const personalInfo = {
        name: formData.fullName,
        birthday: birthday,
        gender: genderMapping[formData.gender] || formData.gender.toUpperCase()
      };

      // Gọi API interpret sau khi có preview result
      let interpretResult = null;
      try {
        interpretResult = await physiognomyService.interpret(previewResult.data, personalInfo);
      } catch (interpretErr) {
        console.error("Error interpreting face analysis:", interpretErr);
        // Nếu interpret lỗi, vẫn tiếp tục với preview result
        // Có thể hiển thị warning hoặc bỏ qua
      }

      // Chuẩn bị data để truyền sang trang kết quả
      const resultData = {
        previewResult: previewResult.data,
        interpretResult: interpretResult?.data || null,
        personalInfo: {
          ...personalInfo,
          email: formData.email
        },
        originalImageFile: formData.imageFile // Lưu file gốc để có thể upload lại
      };

      // Navigate đến trang kết quả với data
      navigate('/nhantuong/ket-qua', { state: resultData });
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra khi phân tích ảnh. Vui lòng thử lại.");
      console.error("Error previewing face analysis:", err);
    } finally {
      setLoading(false);
    }
  };

  // Hàm lấy lịch sử
  const handleShowHistory = async () => {
    setShowHistory(true);
    setLoadingHistory(true);
    setError(null);
    
    try {
      const historyData = await physiognomyService.getHistory();
      setHistory(Array.isArray(historyData) ? historyData : []);
    } catch (err) {
      console.error("Error fetching history:", err);
      setError(err.message || "Có lỗi xảy ra khi lấy lịch sử");
      setHistory([]);
    } finally {
      setLoadingHistory(false);
    }
  };

  // Hàm xử lý khi chọn một kết quả từ lịch sử
  const handleSelectHistoryItem = (item) => {
    // Lấy image URL từ response - có thể là imageUrl hoặc image_base64
    // Ưu tiên imageUrl (URL) nếu có, nếu không thì dùng image_base64
    const imageUrl = item.imageUrl || item.image_base64;
    
    // Chuyển đổi dữ liệu từ history sang format của resultData
    const resultData = {
      previewResult: {
        report: item.report,
        landmarks: item.landmarks,
        image_base64: imageUrl // Có thể là URL hoặc base64, FaceImageWithLandmarks sẽ xử lý
      },
      interpretResult: item.metrics ? {
        interpret: item.metrics
      } : null,
      personalInfo: {
        name: item.name,
        birthday: item.dob ? new Date(item.dob).toISOString().split('T')[0] : null,
        gender: item.gender
      },
      originalImageFile: null // Không có file gốc từ lịch sử
    };

    // Navigate đến trang kết quả
    navigate('/nhantuong/ket-qua', { state: resultData });
    setShowHistory(false);
  };

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const years = Array.from(
    { length: 100 },
    (_, i) => new Date().getFullYear() - i
  );

  return (
    <div id="xem-tuong" className="container mt-10 md:mt-20 mx-auto px-4 pb-20 relative">
      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md">
          <div className="relative w-40 h-40 mb-8">
            {/* Vòng tròn 1 - Lớn nhất, xoay chậm nhất */}
            <div 
              className="absolute top-1/2 left-1/2 w-40 h-40 border-4 border-yellow-400 rounded-full -translate-x-1/2 -translate-y-1/2"
              style={{
                borderTopColor: 'transparent',
                borderRightColor: 'transparent',
                boxShadow: '0 0 25px rgba(251, 191, 36, 0.8), 0 0 50px rgba(251, 191, 36, 0.5), inset 0 0 20px rgba(251, 191, 36, 0.3)',
                animation: 'spin 3s linear infinite'
              }}
            />
            {/* Vòng tròn 2 - Trung bình, xoay ngược */}
            <div 
              className="absolute top-1/2 left-1/2 w-28 h-28 border-4 border-yellow-400 rounded-full -translate-x-1/2 -translate-y-1/2"
              style={{
                borderTopColor: 'transparent',
                borderLeftColor: 'transparent',
                boxShadow: '0 0 20px rgba(251, 191, 36, 0.8), 0 0 40px rgba(251, 191, 36, 0.5), inset 0 0 15px rgba(251, 191, 36, 0.3)',
                animation: 'spin 2s linear infinite reverse'
              }}
            />
            {/* Vòng tròn 3 - Nhỏ nhất, xoay nhanh nhất */}
            <div 
              className="absolute top-1/2 left-1/2 w-16 h-16 border-4 border-yellow-400 rounded-full -translate-x-1/2 -translate-y-1/2"
              style={{
                borderBottomColor: 'transparent',
                borderRightColor: 'transparent',
                boxShadow: '0 0 15px rgba(251, 191, 36, 0.8), 0 0 30px rgba(251, 191, 36, 0.5), inset 0 0 10px rgba(251, 191, 36, 0.3)',
                animation: 'spin 1s linear infinite'
              }}
            />
          </div>
          <p className="text-yellow-400 text-xl md:text-2xl font-semibold">
            Đang luận giải ...
          </p>
        </div>
      )}

      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-light text-white mb-2">
          Luận giải
        </h2>
      </div>
      <div className="max-w-6xl mx-auto pt-10">
        <div className="bg-gradient-to-br from-red-900/60 via-red-800/50 to-red-900/60 backdrop-blur-sm rounded-3xl border-2 border-yellow-600/40 p-4 md:p-8 shadow-2xl">
          {/* Main Layout: Stacked (Mobile < 768px) | Side by Side (Desktop >= 768px) */}
          <div className="flex flex-col md:flex-row gap-6 md:gap-8">
            {/* Upload Image Section - Top (Mobile) / Left (Desktop) */}
            <div className="md:w-1/3">
              {/* Mobile: Image upload box with dashed border */}
              <div className="md:hidden">
                <label htmlFor="fileInput" className="block cursor-pointer">
                  {!imagePreview && !processingImage && (
                    <h3 className="text-base text-yellow-400 font-medium mb-3">
                      Tải ảnh khuôn mặt vào đây
                    </h3>
                  )}

                  {/* Upload box or preview */}
                  {processingImage ? (
                    <div className="relative w-full aspect-[4/3] rounded-2xl border-2 border-dashed border-yellow-500/40 flex flex-col items-center justify-center bg-red-950/30">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mb-3"></div>
                      <p className="text-yellow-100/70 text-sm">Đang xử lý ảnh...</p>
                    </div>
                  ) : imagePreview ? (
                    <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border-2 border-yellow-500/40">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-full aspect-[4/3] rounded-2xl border-2 border-dashed border-yellow-500/40 flex flex-col items-center justify-center bg-red-950/30 hover:border-yellow-400 transition-all duration-300">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border-2 border-yellow-500/40 flex items-center justify-center mb-3">
                        <svg
                          className="w-8 h-8 text-yellow-400"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M18 15v3H6v-3H4v3c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-3zM7 9l1.41 1.41L11 7.83V16h2V7.83l2.59 2.58L17 9l-5-5z" />
                        </svg>
                      </div>
                    </div>
                  )}

                  {!imagePreview && !processingImage && (
                    <p className="text-yellow-100/70 text-xs leading-relaxed mt-3">
                      Vui lòng tải ảnh khuôn mặt chụp chính diện, rõ nét. Ảnh
                      không được che mặt, thiếu sáng, điểm hoặc dùng app làm đẹp.
                    </p>
                  )}
                </label>
                <input
                  id="fileInput"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>

              {/* Desktop: Original horizontal layout */}
              <div className="hidden md:block">
                {!imagePreview && !processingImage && (
                  <label
                    htmlFor="fileInputDesktop"
                    className="flex items-start gap-4 cursor-pointer"
                  >
                    {/* Upload Icon with Conic Border */}
                    <div className="relative flex-shrink-0">
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border-2 border-yellow-500/40 flex items-center justify-center hover:border-yellow-400 transition-all duration-300">
                        <svg
                          className="w-10 h-10 text-yellow-400"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M18 15v3H6v-3H4v3c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-3zM7 9l1.41 1.41L11 7.83V16h2V7.83l2.59 2.58L17 9l-5-5z" />
                        </svg>
                      </div>
                    </div>

                    {/* Upload Text */}
                    <div className="flex-1">
                      <h3 className="text-lg text-yellow-400 font-medium mb-2">
                        Tải ảnh khuôn mặt vào đây
                      </h3>
                      <p className="text-yellow-100/70 text-sm leading-relaxed">
                        Vui lòng tải ảnh khuôn mặt chụp chính diện, rõ nét.
                        <br />
                        Tránh dùng ảnh mờ, thiếu sáng, nghiêng mặt, đeo khẩu trang
                        hoặc chỉnh sửa.
                      </p>
                    </div>
                  </label>
                )}
                <input
                  id="fileInputDesktop"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />

                {/* Image Preview */}
                {processingImage ? (
                  <div className="mt-6">
                    <div className="relative w-full aspect-square rounded-2xl border-2 border-dashed border-yellow-500/40 flex flex-col items-center justify-center bg-red-950/30">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mb-3"></div>
                      <p className="text-yellow-100/70 text-sm">Đang xử lý ảnh...</p>
                    </div>
                  </div>
                ) : imagePreview && (
                  <div className="mt-6">
                    <div className="relative w-full aspect-square rounded-2xl overflow-hidden border-2 border-yellow-500/40">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Form Fields - Bottom (Mobile) / Right (Desktop) */}
            <div className="md:w-2/3">
              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
                {/* Full Name and Gender Row */}
                <div className="grid grid-cols-12 gap-3 md:gap-4">
                  <div className={formFields.textInputs[0].colSpan}>
                    <label className="block text-yellow-400 text-sm font-medium mb-2">
                      {formFields.textInputs[0].label}{" "}
                      {formFields.textInputs[0].required && (
                        <span className="text-yellow-300">*</span>
                      )}
                    </label>
                    <input
                      type="text"
                      name={formFields.textInputs[0].name}
                      value={formData[formFields.textInputs[0].name]}
                      onChange={handleInputChange}
                      placeholder={formFields.textInputs[0].placeholder}
                      className="w-full px-3 md:px-4 py-2 md:py-2.5 bg-red-950/50 border border-yellow-600/30 rounded-lg text-white placeholder-yellow-100/40 focus:border-yellow-500 focus:outline-none transition-colors text-sm"
                      required={formFields.textInputs[0].required}
                    />
                  </div>
                  <div className={formFields.selects[0].colSpan}>
                    <label className="block text-yellow-400 text-sm font-medium mb-2">
                      {formFields.selects[0].label}{" "}
                      {formFields.selects[0].required && (
                        <span className="text-yellow-300">*</span>
                      )}
                    </label>
                    <select
                      name={formFields.selects[0].name}
                      value={formData[formFields.selects[0].name]}
                      onChange={handleInputChange}
                      className="w-full px-3 md:px-4 py-2 md:py-2.5 bg-red-950/50 border border-yellow-600/30 rounded-lg text-white focus:border-yellow-500 focus:outline-none transition-colors text-sm"
                      required={formFields.selects[0].required}
                    >
                      {formFields.selects[0].options.map((opt, idx) => (
                        <option key={idx} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Date of Birth Row */}
                <div className="grid grid-cols-3 gap-3 md:gap-4">
                  {[
                    {
                      name: "day",
                      label: "Ngày sinh",
                      placeholder: "Chọn",
                      options: days,
                    },
                    {
                      name: "month",
                      label: "Tháng sinh",
                      placeholder: "Chọn",
                      options: months,
                    },
                    {
                      name: "year",
                      label: "Năm sinh",
                      placeholder: "Chọn",
                      options: years,
                    },
                  ].map((field, idx) => (
                    <div key={idx}>
                      <label className="block text-yellow-400 text-sm font-medium mb-2">
                        {field.label} <span className="text-yellow-300">*</span>
                      </label>
                      <select
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleInputChange}
                        className="w-full px-2 md:px-3 py-2 md:py-2.5 bg-red-950/50 border border-yellow-600/30 rounded-lg text-white focus:border-yellow-500 focus:outline-none transition-colors text-sm"
                        required
                      >
                        <option value="">{field.placeholder}</option>
                        {field.options.map((val) => (
                          <option key={val} value={val}>
                            {val}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-yellow-400 text-sm font-medium mb-2">
                    {formFields.textInputs[1].label}
                  </label>
                  <input
                    type="email"
                    name={formFields.textInputs[1].name}
                    value={formData[formFields.textInputs[1].name]}
                    onChange={handleInputChange}
                    placeholder={formFields.textInputs[1].placeholder}
                    className="w-full px-3 md:px-4 py-2 md:py-2.5 bg-red-950/50 border border-yellow-600/30 rounded-lg text-white placeholder-yellow-100/40 focus:border-yellow-500 focus:outline-none transition-colors text-sm"
                  />
                </div>

                <p className="text-yellow-300/70 text-xs">
                  * (Chọn ngày sinh dương lịch)
                </p>
              </form>
            </div>
          </div>

          {/* Bottom Section: Checkbox and Buttons */}
          <div className="mt-6 md:mt-8 pt-6 border-t border-yellow-600/20">
            {/* Error Message */}
            {error && (
              <div className="mb-4 p-4 bg-red-900/50 border border-red-500/50 rounded-lg">
                <div className="text-red-200 text-sm whitespace-pre-line leading-relaxed">
                  {error}
                </div>
              </div>
            )}

            <div className="flex flex-col md:flex-row items-start md:items-center justify-center gap-4">
              {/* Action Buttons */}
              <div className="flex items-center gap-3 md:gap-4 w-full md:w-auto">
                <button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="relative group flex-1 md:flex-initial disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-600 to-yellow-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300" />
                  <div className="relative bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-white px-6 md:px-8 py-2.5 md:py-3 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm md:text-base">
                    {loading ? "Đang phân tích..." : "Luận Giải"}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={handleShowHistory}
                  className="border border-yellow-400/60 text-yellow-300 px-4 md:px-6 py-2.5 md:py-3 rounded-full text-sm md:text-base hover:bg-yellow-400/10 transition-colors font-medium whitespace-nowrap"
                >
                  Xem lịch sử luận giải
                </button>

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* History Modal */}
      {showHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-red-900/95 via-red-800/95 to-red-900/95 rounded-2xl border-2 border-yellow-600/40 shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-yellow-600/20">
              <h3 className="text-xl md:text-2xl font-bold text-yellow-300">
                Lịch sử luận giải
              </h3>
              <button
                onClick={() => setShowHistory(false)}
                className="text-yellow-400 hover:text-yellow-300 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {loadingHistory ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
                  <p className="text-yellow-100/70">Đang tải lịch sử...</p>
                </div>
              ) : history.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-yellow-100/70">Chưa có lịch sử luận giải</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {history.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleSelectHistoryItem(item)}
                      className="bg-red-900/30 rounded-xl p-4 border border-yellow-600/20 hover:border-yellow-500/40 cursor-pointer transition-all hover:bg-red-900/40"
                    >
                      <div className="flex items-start gap-4">
                        {(item.imageUrl || item.image_base64) && (
                          <img
                            src={
                              item.imageUrl 
                                ? item.imageUrl 
                                : item.image_base64?.startsWith('data:') 
                                  ? item.image_base64 
                                  : item.image_base64?.startsWith('http://') || item.image_base64?.startsWith('https://')
                                    ? item.image_base64
                                    : `data:image/jpeg;base64,${item.image_base64}`
                            }
                            alt="Face"
                            className="w-20 h-20 object-cover rounded-lg border border-yellow-500/40"
                          />
                        )}
                        <div className="flex-1">
                          <h4 className="text-yellow-300 font-semibold text-lg mb-2">
                            {item.name || "Không tên"}
                          </h4>
                          <div className="text-yellow-100/70 text-sm space-y-1">
                            {item.dob && (
                              <p>Ngày sinh: {new Date(item.dob).toLocaleDateString('vi-VN')}</p>
                            )}
                            {item.gender && (
                              <p>Giới tính: {item.gender === 'MALE' ? 'Nam' : item.gender === 'FEMALE' ? 'Nữ' : item.gender}</p>
                            )}
                            {item.createdAt && (
                              <p>Ngày tạo: {new Date(item.createdAt).toLocaleDateString('vi-VN')}</p>
                            )}
                          </div>
                        </div>
                        <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FaceAnalysisForm;

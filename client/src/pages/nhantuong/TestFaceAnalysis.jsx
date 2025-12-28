import { useState } from "react";
import { useNavigate } from "react-router-dom";
import physiognomyService from "@utils/physiognomyService";
import FaceImageWithLandmarks from "@components/nhantuong/FaceImageWithLandmarks";
import { validateAndCropFace } from "@utils/faceDetection";

const TestFaceAnalysis = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "Trịnh Trần Phương Tuấn",
    gender: "male",
    day: "12",
    month: "4",
    year: "1997",
    email: "",
    imageFile: null,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [previewResult, setPreviewResult] = useState(null);
  const [processingImage, setProcessingImage] = useState(false);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setProcessingImage(true);
    setError(null);
    setPreviewResult(null);

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
    setPreviewResult(null);

    // Validate form
    if (!formData.imageFile) {
      setError("Vui lòng tải ảnh khuôn mặt");
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
      const result = await physiognomyService.preview(formData.imageFile);

      // Debug: Kiểm tra format image_base64
      console.log('Preview result:', result);
      if (result.data && result.data.image_base64) {
        console.log('Image base64 length:', result.data.image_base64.length);
        console.log('Image base64 starts with:', result.data.image_base64.substring(0, 50));
      }

      // Lưu kết quả để hiển thị
      setPreviewResult(result.data);
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra khi phân tích ảnh. Vui lòng thử lại.");
      console.error("Error previewing face analysis:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#2d0a0a] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-red-900/60 via-red-800/50 to-red-900/60 backdrop-blur-sm rounded-3xl border-2 border-yellow-600/40 p-6 md:p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-light text-yellow-300 mb-2">
              Test Phân Tích Khuôn Mặt
            </h1>
            <p className="text-yellow-100/70 text-sm">
              Upload ảnh và xem kết quả phân tích với landmarks
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Upload Image Section */}
            <div>
              <label className="block text-yellow-400 text-sm font-medium mb-2">
                Tải ảnh khuôn mặt <span className="text-yellow-300">*</span>
              </label>
              <div className="flex flex-col md:flex-row gap-4">
                {/* Upload Input */}
                <div className="flex-1">
                  <label
                    htmlFor="fileInput"
                    className="block cursor-pointer"
                  >
                    {processingImage ? (
                      <div className="w-full aspect-square rounded-2xl border-2 border-dashed border-yellow-500/40 flex flex-col items-center justify-center bg-red-950/30">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mb-3"></div>
                        <p className="text-yellow-100/70 text-sm text-center px-4">
                          Đang xử lý ảnh...
                        </p>
                      </div>
                    ) : imagePreview ? (
                      <div className="relative w-full aspect-square rounded-2xl overflow-hidden border-2 border-yellow-500/40">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-full aspect-square rounded-2xl border-2 border-dashed border-yellow-500/40 flex flex-col items-center justify-center bg-red-950/30 hover:border-yellow-400 transition-all duration-300">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border-2 border-yellow-500/40 flex items-center justify-center mb-3">
                          <svg
                            className="w-8 h-8 text-yellow-400"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M18 15v3H6v-3H4v3c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-3zM7 9l1.41 1.41L11 7.83V16h2V7.83l2.59 2.58L17 9l-5-5z" />
                          </svg>
                        </div>
                        <p className="text-yellow-100/70 text-sm text-center px-4">
                          Click để chọn ảnh
                        </p>
                      </div>
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
              </div>
              <p className="text-yellow-100/70 text-xs mt-2">
                Vui lòng tải ảnh khuôn mặt chụp chính diện, rõ nét. Định dạng: JPG, JPEG, PNG, WEBP. Kích thước tối đa: 5MB
              </p>
            </div>

            {/* Personal Info Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label className="block text-yellow-400 text-sm font-medium mb-2">
                  Họ và tên <span className="text-yellow-300">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-red-950/50 border border-yellow-600/30 rounded-lg text-white placeholder-yellow-100/40 focus:border-yellow-500 focus:outline-none transition-colors"
                  required
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-yellow-400 text-sm font-medium mb-2">
                  Giới tính <span className="text-yellow-300">*</span>
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-red-950/50 border border-yellow-600/30 rounded-lg text-white focus:border-yellow-500 focus:outline-none transition-colors"
                  required
                >
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                </select>
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-yellow-400 text-sm font-medium mb-2">
                  Ngày sinh <span className="text-yellow-300">*</span>
                </label>
                <input
                  type="number"
                  name="day"
                  value={formData.day}
                  onChange={handleInputChange}
                  min="1"
                  max="31"
                  className="w-full px-4 py-2.5 bg-red-950/50 border border-yellow-600/30 rounded-lg text-white placeholder-yellow-100/40 focus:border-yellow-500 focus:outline-none transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-yellow-400 text-sm font-medium mb-2">
                  Tháng sinh <span className="text-yellow-300">*</span>
                </label>
                <input
                  type="number"
                  name="month"
                  value={formData.month}
                  onChange={handleInputChange}
                  min="1"
                  max="12"
                  className="w-full px-4 py-2.5 bg-red-950/50 border border-yellow-600/30 rounded-lg text-white placeholder-yellow-100/40 focus:border-yellow-500 focus:outline-none transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-yellow-400 text-sm font-medium mb-2">
                  Năm sinh <span className="text-yellow-300">*</span>
                </label>
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  min="1900"
                  max={new Date().getFullYear()}
                  className="w-full px-4 py-2.5 bg-red-950/50 border border-yellow-600/30 rounded-lg text-white placeholder-yellow-100/40 focus:border-yellow-500 focus:outline-none transition-colors"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-yellow-400 text-sm font-medium mb-2">
                  Email (không bắt buộc)
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-red-950/50 border border-yellow-600/30 rounded-lg text-white placeholder-yellow-100/40 focus:border-yellow-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-900/50 border border-red-500/50 rounded-lg">
                <div className="text-red-200 text-sm whitespace-pre-line leading-relaxed">
                  {error}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className="relative group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-600 to-yellow-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300" />
                <div className="relative bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                  {loading ? "Đang phân tích..." : "Phân Tích Khuôn Mặt"}
                </div>
              </button>
            </div>
          </form>

          {/* Result Section */}
          {previewResult && (
            <div className="mt-8 pt-8 border-t border-yellow-600/20">
              <h2 className="text-2xl md:text-3xl font-light text-yellow-300 mb-6 text-center">
                Kết Quả Phân Tích
              </h2>

              {/* Face Image with Landmarks */}
              <div className="mb-6">
                <h3 className="text-lg text-yellow-400 font-medium mb-4">
                  Ảnh với Landmarks
                </h3>
                <div className="bg-red-900/30 rounded-xl p-4 border border-yellow-600/20">
                  {previewResult.image_base64 ? (
                    <FaceImageWithLandmarks
                      imageSrc={previewResult.image_base64}
                      landmarks={previewResult.landmarks}
                    />
                  ) : (
                    <div className="w-full aspect-square rounded-lg border-2 border-yellow-500/40 flex items-center justify-center bg-red-950/30">
                      <p className="text-yellow-100/70 text-sm">Không có ảnh trong kết quả</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Report Summary */}
              {previewResult.report && (
                <div className="bg-red-900/30 rounded-xl p-6 border border-yellow-600/20">
                  <h3 className="text-lg text-yellow-400 font-medium mb-4">
                    Tóm Tắt Phân Tích
                  </h3>
                  <div className="space-y-3">
                    {previewResult.report.tam_dinh && previewResult.report.tam_dinh.length > 0 && (
                      <div>
                        <span className="text-yellow-300 font-medium">Tam Đình: </span>
                        <span className="text-yellow-100/90">
                          {previewResult.report.tam_dinh.map((item, idx) => item.trait).join(", ")}
                        </span>
                      </div>
                    )}
                    {previewResult.report.long_may && previewResult.report.long_may.length > 0 && (
                      <div>
                        <span className="text-yellow-300 font-medium">Lông Mày: </span>
                        <span className="text-yellow-100/90">
                          {previewResult.report.long_may.map((item, idx) => item.trait).join(", ")}
                        </span>
                      </div>
                    )}
                    {previewResult.report.mat && previewResult.report.mat.length > 0 && (
                      <div>
                        <span className="text-yellow-300 font-medium">Mắt: </span>
                        <span className="text-yellow-100/90">
                          {previewResult.report.mat.map((item, idx) => item.trait).join(", ")}
                        </span>
                      </div>
                    )}
                    {previewResult.report.mui && previewResult.report.mui.length > 0 && (
                      <div>
                        <span className="text-yellow-300 font-medium">Mũi: </span>
                        <span className="text-yellow-100/90">
                          {previewResult.report.mui.map((item, idx) => item.trait).join(", ")}
                        </span>
                      </div>
                    )}
                    {previewResult.report.tai && previewResult.report.tai.length > 0 && (
                      <div>
                        <span className="text-yellow-300 font-medium">Tai: </span>
                        <span className="text-yellow-100/90">
                          {previewResult.report.tai.map((item, idx) => item.trait).join(", ")}
                        </span>
                      </div>
                    )}
                    {previewResult.report.mieng_cam && previewResult.report.mieng_cam.length > 0 && (
                      <div>
                        <span className="text-yellow-300 font-medium">Miệng & Cằm: </span>
                        <span className="text-yellow-100/90">
                          {previewResult.report.mieng_cam.map((item, idx) => item.trait).join(", ")}
                        </span>
                      </div>
                    )}
                    {previewResult.report.an_duong && previewResult.report.an_duong.length > 0 && (
                      <div>
                        <span className="text-yellow-300 font-medium">Ấn Đường: </span>
                        <span className="text-yellow-100/90">
                          {previewResult.report.an_duong.map((item, idx) => item.trait).join(", ")}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestFaceAnalysis;


import React, { useState } from "react";

// Form field configurations
const formFields = {
  textInputs: [
    {
      name: "fullName",
      label: "Họ và tên",
      placeholder: "Nhập họ và tên",
      required: true,
      colSpan: "col-span-12 sm:col-span-7",
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
      colSpan: "col-span-12 sm:col-span-5",
    },
  ],
};

const FaceAnalysisForm = () => {
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, imageFile: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Handle form submission
  };

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const years = Array.from(
    { length: 100 },
    (_, i) => new Date().getFullYear() - i
  );

  return (
    <div id="xem-tuong" className="container mt-20 mx-auto px-4 pb-20">
      <div className="max-w-6xl mx-auto pt-10">
        <div className="bg-gradient-to-br from-red-900/60 via-red-800/50 to-red-900/60 backdrop-blur-sm rounded-3xl border-2 border-yellow-600/40 p-8 shadow-2xl">
          {/* Main Layout: Upload Left, Form Right */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Upload Image Section - Left Side */}
            <div className="lg:w-1/3">
              <label
                htmlFor="fileInput"
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
              <input
                id="fileInput"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />

              {/* Image Preview */}
              {imagePreview && (
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

            {/* Form Fields - Right Side */}
            <div className="lg:w-2/3">
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Full Name and Gender Row */}
                <div className="grid grid-cols-12 gap-4">
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
                      className="w-full px-4 py-2.5 bg-red-950/50 border border-yellow-600/30 rounded-lg text-white placeholder-yellow-100/40 focus:border-yellow-500 focus:outline-none transition-colors text-sm"
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
                      className="w-full px-4 py-2.5 bg-red-950/50 border border-yellow-600/30 rounded-lg text-white focus:border-yellow-500 focus:outline-none transition-colors text-sm"
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
                <div className="grid grid-cols-12 gap-4">
                  {[
                    {
                      name: "day",
                      label: "Ngày sinh",
                      placeholder: "Chọn ngày sinh",
                      options: days,
                    },
                    {
                      name: "month",
                      label: "Tháng sinh",
                      placeholder: "Chọn tháng sinh",
                      options: months,
                    },
                    {
                      name: "year",
                      label: "Năm sinh",
                      placeholder: "Chọn năm sinh",
                      options: years,
                    },
                  ].map((field, idx) => (
                    <div key={idx} className="col-span-4">
                      <label className="block text-yellow-400 text-sm font-medium mb-2">
                        {field.label} <span className="text-yellow-300">*</span>
                      </label>
                      <select
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2.5 bg-red-950/50 border border-yellow-600/30 rounded-lg text-white focus:border-yellow-500 focus:outline-none transition-colors text-sm"
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
                    className="w-full px-4 py-2.5 bg-red-950/50 border border-yellow-600/30 rounded-lg text-white placeholder-yellow-100/40 focus:border-yellow-500 focus:outline-none transition-colors text-sm"
                  />
                </div>

                <p className="text-yellow-300/70 text-xs">
                  * (Chọn ngày sinh dương lịch)
                </p>
              </form>
            </div>
          </div>

          {/* Bottom Section: Checkbox and Buttons */}
          <div className="mt-8 pt-6 border-t border-yellow-600/20">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              {/* Terms Checkbox */}
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.agreeTerms}
                  onChange={(e) =>
                    setFormData({ ...formData, agreeTerms: e.target.checked })
                  }
                  className="mt-1 w-5 h-5 rounded border-yellow-600/30 bg-red-950/50 text-yellow-500 focus:ring-yellow-500 focus:ring-offset-0 cursor-pointer"
                  required
                />
                <span className="text-yellow-100/90 text-sm">
                  Đồng ý với{" "}
                  <a
                    href="#"
                    className="text-yellow-400 underline hover:text-yellow-300"
                  >
                    điều khoản và dịch vụ
                  </a>
                </span>
              </label>

              {/* Action Buttons */}
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="relative group flex-1 sm:flex-initial"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-600 to-yellow-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300" />
                  <div className="relative bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                    Luận Giải
                  </div>
                </button>

                <a
                  href="#"
                  className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition-colors text-sm font-medium whitespace-nowrap"
                >
                  <span>Nhân Tướng Mẫu</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaceAnalysisForm;

import React, { useState } from "react"; // 1. Import useState
import { Link } from "react-router-dom";
import LoginRegisterButton from "../components/Login&RegisterButton";
import { validatePassword } from "../utils/validatePassword"; // 2. Import hàm validate

const Register = () => {
  // 3. Tạo state để lưu dữ liệu form
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState(""); // State lưu lỗi để hiển thị

  // Hàm xử lý khi nhập liệu
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Xóa lỗi khi người dùng bắt đầu sửa lại
    if (error) setError("");
  };

  // Hàm xử lý khi bấm Đăng ký
  const handleSubmit = (e) => {
    e.preventDefault(); // Chặn reload trang

    // Kiểm tra mật khẩu khớp nhau trước
    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp!");
      return;
    }

    // Gọi hàm validate từ utils
    const validation = validatePassword(formData.password);
    if (!validation.isValid) {
      setError(validation.error);
      return;
    }

    // Nếu mọi thứ OK
    console.log("Đăng ký thành công với dữ liệu:", formData);
    alert("Đăng ký thành công!");
    // Logic gọi API backend sẽ đặt ở đây...
  };

  return (
    <div>
      <div className="relative justify-center items-center flex h-screen bg-gradient-to-br from-yellow-300 to-purple-700">
        <Link
          to="/"
          className="absolute top-6 left-6 text-purple-900 text-lg font-semibold transition-transform hover:scale-110 origin-left flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>
          Trang chủ
        </Link>
        <div className="bg-white p-10 rounded-xl shadow-lg w-full max-w-md">
          <h2 className="text-4xl font-bold mb-6 text-center">Đăng ký</h2>

          {/* Thêm sự kiện onSubmit cho form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="block text-gray-700 mb-2">Email</label>
              <input
                type="email"
                name="email" // Quan trọng: name phải trùng với key trong state
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="abc@email.com"
                required
              />
            </div>

            <div className="mb-3">
              <label className="block text-gray-700 mb-2">Mật khẩu</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Mật khẩu"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">
                Xác nhận mật khẩu
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Xác nhận mật khẩu"
                required
              />
            </div>

            {/* Hiển thị lỗi màu đỏ nếu có */}
            {error && (
              <div className="mt-2 text-red-500 text-sm italic">* {error}</div>
            )}

            <div className="flex justify-end items-center mt-3 mb-5 text-sm">
              <div>
                <span className="text-gray-600">Đã có tài khoản? </span>
                <Link
                  to="/login"
                  className="text-blue-500 hover:underline font-semibold"
                >
                  Đăng nhập
                </Link>
              </div>
            </div>

            <div className="mt-8">
              {/* Giả sử component Button này có type="submit" hoặc nhận onClick */}
              {/* Nếu component Button của bạn là thẻ div thuần, bạn cần thêm prop onClick={handleSubmit} vào nó */}
              <button type="submit" className="w-full">
                <LoginRegisterButton ButtonName="Đăng ký" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;

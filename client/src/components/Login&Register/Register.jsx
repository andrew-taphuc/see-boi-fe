import React, { useState } from "react";
import LoginRegisterButton from "./Login&RegisterButton";
import { validatePassword } from "../../utils/validatePassword";

// Nhận props: onClose, onSwitchToLogin
const Register = ({ onClose, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp!");
      return;
    }
    const validation = validatePassword(formData.password);
    if (!validation.isValid) {
      setError(validation.error);
      return;
    }
    alert("Đăng ký thành công!");
    onSwitchToLogin(); // Chuyển về login sau khi đăng ký xong
  };

  return (
    <div className="bg-white p-10 rounded-xl shadow-2xl w-full max-w-md relative">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 cursor-pointer"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      <h2 className="text-4xl font-bold mb-6 text-center text-gray-800">
        Đăng ký
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2 font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            placeholder="abc@email.com"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2 font-medium">
            Mật khẩu
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            placeholder="Mật khẩu"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2 font-medium">
            Xác nhận mật khẩu
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            placeholder="Xác nhận mật khẩu"
            required
          />
        </div>

        {error && (
          <div className="mb-4 text-red-500 text-sm italic font-medium text-center">
            * {error}
          </div>
        )}

        <div className="flex justify-end items-center mb-6 text-sm">
          <div>
            <span className="text-gray-600">Đã có tài khoản? </span>
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-amber-700 hover:underline font-bold cursor-pointer"
            >
              Đăng nhập
            </button>
          </div>
        </div>

        <div className="mt-4">
          <button type="submit" className="w-full">
            <LoginRegisterButton ButtonName="Đăng ký" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;

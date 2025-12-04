import React from "react";
import LoginRegisterButton from "./Login&RegisterButton";

// Nhận props: onClose (để tắt popup), onSwitchToRegister (để chuyển sang đăng ký)
const Login = ({ onClose, onSwitchToRegister }) => {
  return (
    // Xóa h-screen và background gradient. Chỉ giữ lại khung trắng.
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
        Đăng nhập
      </h2>

      <form action="">
        <div className="mb-4">
          <label className="block text-gray-700 mb-2 font-medium">Email</label>
          <input
            type="email"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
            placeholder="abc@email.com"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-2 font-medium">
            Mật khẩu
          </label>
          <input
            type="password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
            placeholder="Mật khẩu"
          />
        </div>

        <div className="flex justify-between items-center mb-6 text-sm">
          <button
            type="button"
            className="text-amber-700 hover:underline cursor-pointer"
          >
            Quên mật khẩu?
          </button>

          <div>
            <span className="text-gray-600">Chưa có tài khoản? </span>
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="text-amber-700 hover:underline font-bold cursor-pointer"
            >
              Đăng ký
            </button>
          </div>
        </div>

        <div className="mt-4">
          <LoginRegisterButton ButtonName="Đăng nhập" />
        </div>
      </form>
    </div>
  );
};

export default Login;

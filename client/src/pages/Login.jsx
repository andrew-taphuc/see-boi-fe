import React from "react";
import { Link } from "react-router-dom";
import LoginRegisterButton from "../components/Login&RegisterButton";

const Login = () => {
  return (
    <div>
      <div className="relative justify-center items-center flex h-screen bg-gradient-to-br from-purple-700 to-yellow-300">
        <Link
          to="/LandingPage"
          className="absolute top-6 left-6 text-white text-lg font-semibold transition-transform hover:scale-110 origin-left flex items-center gap-2"
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
          <h2 className="text-4xl font-bold mb-6 text-center">Đăng nhập</h2>
          <form action="">
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Email</label>
              <input
                type="email"
                className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="abc@email.com"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Mật khẩu</label>
              <input
                type="password"
                className="w-full px-4 py-2  border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Mật khẩu"
              />
            </div>
            <div className="flex justify-between items-center mt-1 mb-5 text-sm">
              <Link to="/login" className="text-blue-500 hover:underline">
                Quên mật khẩu?
              </Link>

              <div>
                <span className="text-gray-600">Chưa có tài khoản? </span>
                <Link
                  to="/register"
                  className="text-blue-500 hover:underline font-semibold"
                >
                  Đăng ký
                </Link>
              </div>
            </div>

            <div className="mt-10">
              <LoginRegisterButton ButtonName="Đăng nhập" />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

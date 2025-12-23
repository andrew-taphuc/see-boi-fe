import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@context/AuthContext";
import axiosInstance from "@utils/axiosInstance";
import LoginRegisterButton from "./Login&RegisterButton";
import { validatePassword } from "@utils/validatePassword";

// Nhận props: onClose, onSwitchToLogin
const Register = ({ onClose, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    userName: "",
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { loginAPI } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Tự động set fullName = userName khi userName thay đổi
    if (name === "userName") {
      setFormData({ ...formData, userName: value, fullName: value });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp!");
      return;
    }

    const validation = validatePassword(formData.password);
    if (!validation.isValid) {
      setError(validation.error);
      return;
    }

    setLoading(true);

    try {
      // Đảm bảo fullName = userName nếu chưa được set
      const finalFullName = formData.fullName || formData.userName;
      
      const response = await axiosInstance.post("/auth/register", {
        userName: formData.userName,
        fullName: finalFullName,
        email: formData.email,
        password: formData.password,
      }, {
        skipAuthRedirect: true // Flag để interceptor biết không redirect
      });

      if (response.data) {
        // Lấy access_token và user từ response
        const { access_token, user } = response.data;
        
        if (!access_token || !user) {
          throw new Error("Response không hợp lệ từ server");
        }
        
        // Tự động đăng nhập sau khi đăng ký thành công
        loginAPI(user, access_token);
        
        // Đóng popup nếu có (khi được gọi từ popup)
        if (onClose) {
          onClose();
        }
        
        // Redirect đến trang cập nhật thông tin cá nhân
        navigate("/user/edit");
      }
    } catch (err) {
      // Xử lý các loại lỗi khác nhau
      if (err.response) {
        // Backend trả về response với status code
        const status = err.response.status;
        const message = err.response.data?.message;
        
        switch (status) {
          case 409:
            setError(message || "Email hoặc userName đã tồn tại. Vui lòng thử lại.");
            break;
          case 400:
            setError(message || "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.");
            break;
          case 500:
            setError("Lỗi hệ thống. Vui lòng thử lại sau.");
            break;
          default:
            setError(message || "Đăng ký thất bại. Vui lòng thử lại.");
        }
      } else if (err.request) {
        // Request được gửi nhưng không nhận được response (mất kết nối)
        setError("Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.");
      } else {
        // Lỗi khi setup request
        setError("Đã xảy ra lỗi. Vui lòng thử lại.");
      }
    } finally {
      setLoading(false);
    }
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
          <label className="block text-gray-700 mb-2 font-medium">Tên người dùng</label>
          <input
            type="text"
            name="userName"
            value={formData.userName}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            placeholder="userName"
            required
          />
        </div>

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
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {error}
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
          <button
            type="submit"
            disabled={loading}
            className="w-full"
          >
            <LoginRegisterButton 
              ButtonName={loading ? "Đang đăng ký..." : "Đăng ký"} 
            />
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@context/AuthContext";
import axiosInstance from "@utils/axiosInstance";

// Nhận props: onClose (để tắt popup), onSwitchToRegister (để chuyển sang đăng ký)
const Login = ({ onClose, onSwitchToRegister }) => {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { loginAPI } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axiosInstance.post("/auth/login", {
        email: usernameOrEmail, // Backend tự động phát hiện username hoặc email
        password,
      }, {
        skipAuthRedirect: true // Flag để interceptor biết không redirect
      });

      if (response.data) {
        // Lưu token và user info
        const { access_token, user } = response.data;
        
        if (!access_token || !user) {
          throw new Error("Response không hợp lệ từ server");
        }
        
        loginAPI(user, access_token);
        
        // Đóng popup nếu có (khi được gọi từ popup)
        if (onClose) {
          onClose();
        }
        
        // Kiểm tra role ADMIN (case-insensitive để đảm bảo hoạt động đúng)
        const userRole = user.role?.toUpperCase();
        console.log('User role after login:', userRole, 'Full user object:', user);
        
        // Nếu là ADMIN thì chuyển đến trang quản lý admin
        if (userRole === "ADMIN") {
          console.log('Redirecting to admin page');
          navigate("/admin", { replace: true });
        } else if (!user.avatarUrl || !user.birthday || !user.gender) {
          // Nếu thiếu avatarUrl, birthday hoặc gender, redirect đến trang cập nhật thông tin cá nhân
          navigate("/user/edit", { replace: true });
        } else {
          // Redirect đến socialmedia page
          navigate("/socialmedia", { replace: true });
        }
      }
    } catch (err) {
      // Xử lý các loại lỗi khác nhau theo status codes:
      // 200 OK: Đăng nhập thành công (đã xử lý trong try block)
      // 400 Bad Request: Dữ liệu đầu vào không hợp lệ
      // 401 Unauthorized: Mật khẩu không chính xác
      // 403 Forbidden: Tài khoản OAuth (không có password)
      // 404 Not Found: Tài khoản không tồn tại
      // 500 Internal Server Error: Lỗi server/database
      if (err.response) {
        // Backend trả về response với status code
        const status = err.response.status;
        const message = err.response.data?.message;
        
        switch (status) {
          case 400:
            // Bad Request: Dữ liệu đầu vào không hợp lệ
            setError(message || "Dữ liệu đầu vào không hợp lệ. Vui lòng kiểm tra lại.");
            break;
          case 401:
            // Unauthorized: Mật khẩu không chính xác
            setError("Mật khẩu không chính xác. Vui lòng kiểm tra lại.");
            break;
          case 403:
            // Forbidden: Tài khoản OAuth (không có password)
            setError("Tài khoản này được đăng nhập qua OAuth. Vui lòng sử dụng phương thức đăng nhập khác.");
            break;
          case 404:
            // Not Found: Tài khoản không tồn tại
            setError("Tài khoản không tồn tại. Vui lòng kiểm tra lại email hoặc username.");
            break;
          case 500:
            // Internal Server Error: Lỗi server/database
            setError("Lỗi hệ thống. Vui lòng thử lại sau.");
            break;
          default:
            setError(message || "Đăng nhập thất bại. Vui lòng thử lại.");
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

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2 font-medium">Email hoặc Username</label>
          <input
            type="text"
            value={usernameOrEmail}
            onChange={(e) => setUsernameOrEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
            placeholder="Email hoặc username"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-2 font-medium">
            Mật khẩu
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
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
          <button
            type="submit"
            disabled={loading}
            className="text-xl w-full bg-amber-600 text-white font-semibold py-3 rounded-lg hover:bg-amber-800 transition duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;

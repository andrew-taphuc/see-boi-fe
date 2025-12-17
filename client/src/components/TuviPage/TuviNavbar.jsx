import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Settings, LogOut, User, HelpCircle, Bell } from "lucide-react"; // Đã thêm Bell

const Navbar = () => {
  const menuItems = [
    { name: "Trang chủ", path: "/" },
    { name: "Tử Vi", path: "/tuvi" },
    { name: "Tarot", path: "/tarot" },
    { name: "Nhân tướng", path: "/nhantuong" },
    { name: "Diễn đàn", path: "/socialmedia" },
  ];

  const navigate = useNavigate();

  // --- STATE & REF CHO AVATAR ---
  const [isAvatarOpen, setIsAvatarOpen] = useState(false);
  const avatarRef = useRef(null);

  // --- STATE & REF CHO THÔNG BÁO (Đã thêm mới để sửa lỗi) ---
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const notificationRef = useRef(null);

  // --- XỬ LÝ CLICK RA NGOÀI (Cập nhật cho cả 2 dropdown) ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Đóng Avatar nếu click ra ngoài
      if (avatarRef.current && !avatarRef.current.contains(event.target)) {
        setIsAvatarOpen(false);
      }
      // Đóng Thông báo nếu click ra ngoài
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const userData = {
    name: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    avatar:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTG3lfMOpNq0uh7wbVh3ER14gQdTt_ydu1zfQ&s",
  };

  return (
    <nav className="w-full bg-red-900 border-b-2 border-yellow-600 shadow-lg relative z-50">
      {/* THAY ĐỔI QUAN TRỌNG: 
         - Dùng 'w-full' thay vì 'container mx-auto' để full màn hình.
         - Dùng 'px-6' hoặc 'px-8' để tạo khoảng cách an toàn với mép màn hình.
      */}
      <div className="w-full px-4 md:px-8 py-3 flex items-center justify-between">
        {/* PHẦN 1: LOGO (Căn trái) */}
        <div className="flex-1 flex justify-start">
          <Link
            to="/"
            className="!font-['Playfair_Display'] text-2xl font-bold text-yellow-400 font-serif tracking-wider uppercase cursor-pointer whitespace-nowrap"
          >
            SEE BÓI TỬ VI
          </Link>
        </div>

        {/* PHẦN 2: MENU ITEMS (Căn giữa) */}
        {/* hidden md:flex để ẩn menu trên mobile nếu cần, hiện tại giữ nguyên logic cũ */}
        <ul className="hidden md:flex space-x-8 justify-center flex-1">
          {menuItems.map((item, index) => (
            <li key={index} className="cursor-pointer group relative">
              <Link
                to={item.path}
                className="text-yellow-100 font-medium text-lg hover:text-yellow-400 transition-colors duration-300 block py-1 whitespace-nowrap"
              >
                {item.name}
              </Link>
              <div className="absolute bottom-0 left-0 h-0.5 bg-yellow-500 w-0 group-hover:w-full transition-all duration-300"></div>
            </li>
          ))}
        </ul>

        {/* PHẦN 3: USER INFO & NOTIFICATION (Căn phải sát lề) */}
        <div className="flex-1 flex justify-end items-center gap-4">
          {/* --- Notification Bell --- */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="relative p-2 hover:bg-red-800 rounded-full transition-colors focus:outline-none"
            >
              <Bell size={24} className="text-yellow-100" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 border-2 border-red-900 rounded-full"></span>
            </button>

            {/* Notification Dropdown */}
            {isNotificationOpen && (
              <div className="absolute right-0 mt-3 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-[60] max-h-96 overflow-y-auto animate-fade-in-down">
                <div className="p-4 border-b border-gray-200 bg-gray-50 rounded-t-lg">
                  <h3 className="font-bold text-gray-800">Thông báo</h3>
                </div>
                <div className="divide-y divide-gray-100">
                  {[
                    {
                      id: 1,
                      text: "Lá số của bạn đã được luận giải xong",
                      time: "5 phút trước",
                      unread: true,
                    },
                    {
                      id: 2,
                      text: "Có bài viết mới trong diễn đàn Tử Vi",
                      time: "1 giờ trước",
                      unread: false,
                    },
                  ].map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                        notification.unread ? "bg-red-50" : ""
                      }`}
                    >
                      <p className="text-sm text-gray-800 font-medium">
                        {notification.text}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {notification.time}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-gray-200 text-center bg-gray-50 rounded-b-lg">
                  <button className="text-xs font-bold text-red-700 hover:text-red-900 uppercase tracking-wide">
                    Xem tất cả
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* --- Avatar User --- */}
          <div className="relative" ref={avatarRef}>
            <button
              onClick={() => setIsAvatarOpen(!isAvatarOpen)}
              className="flex items-center gap-3 focus:outline-none group"
            >
              {/* Ảnh Avatar */}
              <div className="w-10 h-10 rounded-full border-2 border-yellow-600 overflow-hidden group-hover:border-yellow-400 transition-all shadow-md">
                <img
                  src={userData.avatar}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
            </button>

            {/* Avatar Dropdown Menu */}
            {isAvatarOpen && (
              <div className="absolute right-0 mt-3 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-[60] animate-fade-in-down">
                {/* Mũi tên trang trí */}
                <div className="absolute -top-2 right-4 w-4 h-4 bg-white transform rotate-45 border-l border-t border-gray-200"></div>

                <div className="p-4 border-b border-gray-100 bg-gray-50 rounded-t-lg">
                  <div className="flex items-center gap-3">
                    <img
                      src={userData.avatar}
                      alt="Avatar"
                      className="w-12 h-12 rounded-full border border-gray-300 object-cover"
                    />
                    <div className="overflow-hidden">
                      <p className="text-sm font-bold text-gray-900 truncate">
                        {userData.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {userData.email}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="py-2">
                  <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-900 transition-colors">
                    <User size={18} />
                    <span>Hồ sơ cá nhân</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-900 transition-colors">
                    <Settings size={18} />
                    <span>Cài đặt tài khoản</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-900 transition-colors">
                    <HelpCircle size={18} />
                    <span>Trung tâm trợ giúp</span>
                  </button>

                  <div className="border-t border-gray-100 my-1"></div>

                  <button
                    onClick={() => navigate("/login")}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
                  >
                    <LogOut size={18} />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

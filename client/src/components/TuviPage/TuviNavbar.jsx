import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Settings,
  LogOut,
  User,
  HelpCircle,
  Bell,
  Menu,
  X,
} from "lucide-react"; // Đã thêm Menu, X
import { useAuth } from "@context/AuthContext";

const Navbar = () => {
  const menuItems = [
    { name: "Trang chủ", path: "/" },
    { name: "Tử Vi", path: "/tuvi" },
    { name: "Tarot", path: "/tarot" },
    { name: "Nhân tướng", path: "/nhantuong" },
    { name: "Diễn đàn", path: "/socialmedia" },
  ];

  const navigate = useNavigate();
  const { logout } = useAuth();

  // --- STATE & REF CHO AVATAR ---
  const [isAvatarOpen, setIsAvatarOpen] = useState(false);
  const avatarRef = useRef(null);

  // --- STATE & REF CHO THÔNG BÁO ---
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const notificationRef = useRef(null);

  // --- STATE CHO MOBILE MENU (MỚI) ---
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // --- XỬ LÝ CLICK RA NGOÀI ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (avatarRef.current && !avatarRef.current.contains(event.target)) {
        setIsAvatarOpen(false);
      }
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
      <div className="w-full px-4 md:px-8 py-3">
        {/* Container chính: Flex row */}
        <div className="flex items-center justify-between">
          {/* PHẦN 1: LOGO (Căn trái) */}
          <div className="flex items-center">
            <Link
              to="/"
              className="!font-['Playfair_Display'] text-xl md:text-2xl font-bold text-yellow-400 font-serif tracking-wider uppercase cursor-pointer whitespace-nowrap"
            >
              SEE BÓI TỬ VI
            </Link>
          </div>

          {/* PHẦN 2: DESKTOP MENU (Căn giữa - Ẩn trên mobile) */}
          <ul className="hidden md:flex space-x-6 lg:space-x-8 items-center">
            {menuItems.map((item, index) => (
              <li key={index} className="cursor-pointer group relative">
                <Link
                  to={item.path}
                  className="text-yellow-100 font-medium text-base lg:text-lg hover:text-yellow-400 transition-colors duration-300 block py-1 whitespace-nowrap"
                >
                  {item.name}
                </Link>
                <div className="absolute bottom-0 left-0 h-0.5 bg-yellow-500 w-0 group-hover:w-full transition-all duration-300"></div>
              </li>
            ))}
          </ul>

          {/* PHẦN 3: RIGHT SECTION (User, Noti, Mobile Button) */}
          <div className="flex items-center gap-3 md:gap-4">
            {/* --- Notification Bell --- */}
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="relative p-2 hover:bg-red-800 rounded-full transition-colors focus:outline-none"
              >
                <Bell size={20} className="text-yellow-100 md:w-6 md:h-6" />{" "}
                {/* Resize icon cho mobile */}
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 border-2 border-red-900 rounded-full"></span>
              </button>

              {/* Notification Dropdown (Giữ nguyên logic cũ) */}
              {isNotificationOpen && (
                <div className="absolute right-[-60px] md:right-0 mt-3 w-72 md:w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-[60] max-h-96 overflow-y-auto">
                  <div className="p-4 border-b border-gray-200 bg-gray-50 rounded-t-lg">
                    <h3 className="font-bold text-gray-800">Thông báo</h3>
                  </div>
                  {/* ... (Nội dung notification giữ nguyên) ... */}
                  <div className="p-4 text-sm text-gray-500">
                    Chức năng thông báo demo
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
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-yellow-600 overflow-hidden group-hover:border-yellow-400 transition-all shadow-md">
                  <img
                    src={userData.avatar}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
              </button>

              {/* Avatar Dropdown Menu (Giữ nguyên logic cũ) */}
              {isAvatarOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-[60]">
                  {/* ... (Nội dung dropdown avatar giữ nguyên) ... */}
                  <div className="p-4 border-b border-gray-100 bg-gray-50 rounded-t-lg">
                    <p className="font-bold text-gray-900">{userData.name}</p>
                    <p className="text-xs text-gray-500">{userData.email}</p>
                  </div>
                  <div className="py-2">
                    <button
                      onClick={() => {
                        logout();
                        setIsAvatarOpen(false);
                        navigate("/?login=true");
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut size={18} /> Đăng xuất
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* --- MOBILE HAMBURGER BUTTON (Hiện trên mobile, ẩn trên desktop) --- */}
            <button
              className="md:hidden text-yellow-100 p-1 hover:bg-red-800 rounded focus:outline-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* --- MOBILE MENU CONTENT (Dropdown) --- */}
        {/* Chỉ hiện khi isMobileMenuOpen = true VÀ màn hình nhỏ (md:hidden) */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-red-800 animate-fade-in-down">
            <ul className="flex flex-col space-y-2 mt-4">
              {menuItems.map((item, index) => (
                <li key={index}>
                  <Link
                    to={item.path}
                    className="block px-4 py-3 text-yellow-100 font-medium hover:bg-red-800 hover:text-yellow-400 rounded-lg transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)} // Đóng menu khi click link
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

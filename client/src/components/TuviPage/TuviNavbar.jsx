import React from "react";
import { Link } from "react-router-dom"; // 1. Import Link

const Navbar = () => {
  const menuItems = [
    { name: "Trang chủ", path: "/" },
    { name: "Tử Vi", path: "/tuvi" },
    { name: "Nhân tướng học", path: "/nhantuong" },
    { name: "Tarot", path: "/tarot" },
    { name: "Diễn đàn", path: "/socialmedia" },
    { name: "Liên hệ", path: "" },
  ];

  return (
    <nav className="w-full bg-red-900 border-b-2 border-yellow-600 shadow-lg">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link
          to="/"
          className="!font-['Playfair_Display'] text-2xl font-bold text-yellow-400 font-serif tracking-wider uppercase cursor-pointer"
        >
          SEE BÓI TỬ VI
        </Link>

        {/* Menu Items */}
        <ul className="flex space-x-6">
          {menuItems.map((item, index) => (
            <li key={index} className="cursor-pointer group relative">
              <Link
                to={item.path}
                className="text-yellow-100 font-medium text-lg hover:text-yellow-400 transition-colors duration-300 block py-1"
              >
                {item.name}
              </Link>

              {/* Hiệu ứng gạch chân khi hover */}
              <div className="absolute bottom-0 left-0 h-0.5 bg-yellow-500 w-0 group-hover:w-full transition-all duration-300"></div>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;

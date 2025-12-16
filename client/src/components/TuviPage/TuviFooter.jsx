import React from "react";
import { Link } from "react-router-dom";

const TuviFooter = () => {
  return (
    <footer className="bg-red-900 border-t-4 border-yellow-600 text-yellow-100 pt-12 pb-6 mt-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* CỘT 1: THÔNG TIN CHUNG */}
          <div className="space-y-4">
            <h2 className="!font-['Playfair_Display'] text-2xl font-bold text-yellow-400 uppercase tracking-wider">
              Tử Vi
            </h2>
            <p className="text-sm leading-relaxed text-yellow-100/80 text-justify">
              Chuyên trang nghiên cứu và luận giải Tử Vi Đẩu Số, Nhân Tướng Học
              và Tarot. Giúp bạn khám phá vận mệnh, nắm bắt cơ hội và hóa giải
              vận hạn trong cuộc sống.
            </p>
            <div className="pt-2">
              <p className="font-bold text-yellow-500">Liên hệ:</p>
              <p>Email: contact@tuvi.com</p>
              <p>Hotline: 0988.888.888</p>
            </div>
          </div>

          {/* MẠNG XÃ HỘI */}
          <div>
            <h3 className="!font-['Playfair_Display'] text-xl font-bold text-yellow-400 mb-4 border-b border-yellow-700 inline-block pb-1">
              Kết Nối
            </h3>
            <p className="text-sm mb-4 text-yellow-100/80">
              Theo dõi chúng tôi trên các nền tảng mạng xã hội để cập nhật những
              kiến thức huyền học mới nhất.
            </p>
            <div className="flex gap-4">
              {/* Facebook Button */}
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-yellow-700 hover:bg-yellow-500 flex items-center justify-center transition-all text-white font-bold"
              >
                F
              </a>
              {/* Youtube Button */}
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-red-700 hover:bg-red-600 flex items-center justify-center transition-all text-white font-bold border border-yellow-600"
              >
                Y
              </a>
              {/* Tiktok Button */}
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-black hover:bg-gray-800 flex items-center justify-center transition-all text-white font-bold border border-yellow-600"
              >
                T
              </a>
            </div>
          </div>
        </div>

        {/* BẢN QUYỀN */}
        <div className="border-t border-yellow-800 pt-6 text-center text-sm text-yellow-600">
          <p>&copy; {new Date().getFullYear()} SEEBOI. Bảo lưu mọi quyền.</p>
          <p className="mt-1 text-xs">Thiết kế bởi SEEBOI TEAM</p>
        </div>
      </div>
    </footer>
  );
};

export default TuviFooter;

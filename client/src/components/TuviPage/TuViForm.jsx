// components/HoroscopeForm.jsx
import React, { useState } from "react";

const TuViForm = () => {
  // 1. KHỞI TẠO STATE ĐỂ QUẢN LÝ DỮ LIỆU
  // Chúng ta cần lưu giá trị để kiểm tra logic
  const [formData, setFormData] = useState({
    day: 1,
    month: 1,
    year: 1995,
  });

  const [error, setError] = useState(""); // State lưu thông báo lỗi

  // Hàm xử lý khi người dùng chọn/nhập liệu
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: parseInt(value), // Chuyển sang số nguyên để tính toán
    });
    setError(""); // Xóa lỗi ngay khi người dùng chọn lại
  };

  // 2. HÀM KIỂM TRA NGÀY HỢP LỆ
  const validateDate = () => {
    const { day, month, year } = formData;

    // Logic: Tạo một ngày mới từ JS, sau đó so sánh ngược lại
    // Mẹo: new Date(year, month, 0).getDate() sẽ trả về số ngày tối đa của tháng đó
    const daysInMonth = new Date(year, month, 0).getDate();

    if (day > daysInMonth) {
      return false; // Ngày không hợp lệ
    }
    return true; // Hợp lệ
  };

  // 3. HÀM XỬ LÝ KHI BẤM NÚT SUBMIT
  const handleSubmit = () => {
    if (!validateDate()) {
      setError(
        `Lỗi: Tháng ${formData.month} năm ${formData.year} chỉ có ${new Date(
          formData.year,
          formData.month,
          0
        ).getDate()} ngày!`
      );
      // Có thể thêm alert nếu muốn
      alert("Ngày sinh không hợp lệ!");
      return;
    }

    // Nếu hợp lệ thì xử lý tiếp (ví dụ: gửi API)
    alert("Dữ liệu hợp lệ! Đang lập lá số...");
    console.log("Data:", formData);
  };

  // Tạo mảng dữ liệu (giữ nguyên như cũ)
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);
  const currentYear = new Date().getFullYear();

  return (
    <div className="w-full max-w-6xl mx-auto p-1">
      <div className="relative bg-black/60 backdrop-blur-sm border-y-8 border-x-8 border-yellow-700 rounded-lg p-6 shadow-2xl">
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-red-800 border-2 border-yellow-500 px-8 py-2 rounded-full shadow-lg z-10">
          <h2 className="!font-['Playfair_Display'] text-2xl font-bold text-white uppercase tracking-widest font-serif drop-shadow-md whitespace-nowrap">
            Lập Lá Số Tử Vi
          </h2>
        </div>

        <form className="mt-6 space-y-6 text-yellow-100">
          {/* ... Phần Họ Tên giữ nguyên ... */}
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-yellow-200">Họ Tên</label>
            <input
              type="text"
              placeholder="Nhập họ tên..."
              className="w-full bg-gray-900 border border-gray-600 rounded p-3 focus:outline-none focus:border-yellow-500 text-white placeholder-gray-500"
            />
          </div>

          {/* ... Phần Ngày Sinh ... */}
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-yellow-200">
              Ngày sinh (Dương lịch)
            </label>

            {/* Hiển thị lỗi màu đỏ nếu có */}
            {error && (
              <p className="text-red-500 bg-red-900/30 p-2 rounded border border-red-500 text-sm font-bold animate-pulse">
                ⚠️ {error}
              </p>
            )}

            <div className="grid grid-cols-3 gap-4">
              {/* SELECT NGÀY */}
              <select
                name="day"
                value={formData.day}
                onChange={handleChange}
                className={`bg-gray-900 border rounded p-3 text-white focus:border-yellow-500 cursor-pointer scrollbar-thin ${
                  error ? "border-red-500" : "border-gray-600"
                }`}
              >
                {days.map((day) => (
                  <option key={day} value={day}>
                    Ngày {day}
                  </option>
                ))}
              </select>

              {/* SELECT THÁNG */}
              <select
                name="month"
                value={formData.month}
                onChange={handleChange}
                className={`bg-gray-900 border rounded p-3 text-white focus:border-yellow-500 cursor-pointer ${
                  error ? "border-red-500" : "border-gray-600"
                }`}
              >
                {months.map((month) => (
                  <option key={month} value={month}>
                    Tháng {month}
                  </option>
                ))}
              </select>

              {/* INPUT NĂM */}
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleChange}
                min="1900"
                max={currentYear}
                className={`bg-gray-900 border rounded p-3 text-white focus:border-yellow-500 ${
                  error ? "border-red-500" : "border-gray-600"
                }`}
              />
            </div>
            {/* ... Radio Lịch giữ nguyên ... */}
            <div className="flex items-center gap-6 mt-1 ml-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="radio"
                  name="calendarType"
                  defaultChecked
                  className="accent-yellow-500 w-4 h-4 cursor-pointer"
                />
                <span className="group-hover:text-yellow-400">Lịch dương</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="radio"
                  name="calendarType"
                  className="accent-yellow-500 w-4 h-4 cursor-pointer"
                />
                <span className="group-hover:text-yellow-400">Lịch âm</span>
              </label>
            </div>
          </div>

          {/* ... Các phần Giờ sinh, Giới tính giữ nguyên (chỉ cần copy lại code cũ vào đây) ... */}
          {/* 3. Giờ sinh */}
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-yellow-200">Giờ sinh</label>
            <div className="grid grid-cols-3 gap-4">
              <select className="bg-gray-900 border border-gray-600 rounded p-3 text-white focus:border-yellow-500">
                <option value="7">GMT +7 (Vietnam)</option>
                <option value="0">GMT +0</option>
              </select>

              <select className="bg-gray-900 border border-gray-600 rounded p-3 text-white focus:border-yellow-500 cursor-pointer">
                {hours.map((h) => (
                  <option key={h} value={h}>
                    {h} Giờ
                  </option>
                ))}
              </select>

              <select className="bg-gray-900 border border-gray-600 rounded p-3 text-white focus:border-yellow-500 cursor-pointer">
                {minutes.map((m) => (
                  <option key={m} value={m}>
                    {m} Phút
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 4. Giới tính */}
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-yellow-200">Giới tính</label>
            <div className="flex items-center gap-6 ml-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="radio"
                  name="gender"
                  defaultChecked
                  className="accent-yellow-500 w-4 h-4 cursor-pointer"
                />
                <span className="group-hover:text-yellow-400">Nam</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="radio"
                  name="gender"
                  className="accent-yellow-500 w-4 h-4 cursor-pointer"
                />
                <span className="group-hover:text-yellow-400">Nữ</span>
              </label>
            </div>
          </div>

          {/* 5. Năm xem & Tháng xem */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-yellow-200">Năm xem</label>
              <input
                type="number"
                defaultValue={currentYear}
                className="bg-gray-900 border border-gray-600 rounded p-3 text-white focus:border-yellow-500"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-yellow-200">
                Tháng xem (Âm lịch)
              </label>
              <select className="bg-gray-900 border border-gray-600 rounded p-3 text-white focus:border-yellow-500 cursor-pointer">
                {months.map((month) => (
                  <option key={month} value={month}>
                    Tháng {month}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Nút Submit đã sửa sự kiện onClick */}
          <div className="flex justify-center mt-8">
            <button
              type="button"
              onClick={handleSubmit} // <--- GỌI HÀM KIỂM TRA TẠI ĐÂY
              className="px-10 py-3 bg-yellow-700 hover:bg-yellow-600 text-white font-bold text-lg rounded shadow-lg border-2 border-yellow-500 uppercase transition-transform transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              Lập lá số
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TuViForm;

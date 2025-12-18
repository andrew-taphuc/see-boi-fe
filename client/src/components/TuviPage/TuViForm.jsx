// components/HoroscopeForm.jsx
import React, { useState } from "react";
import TuviResult from "./TuviResult";
import laSoMau from "../../data/mockHoroscopeData.json";

const TuViForm = () => {
  const currentYear = new Date().getFullYear();

  // 1. STATE
  const [formData, setFormData] = useState({
    name: "",
    day: 1,
    month: 1,
    year: 1995,
    hour: 0,
    minute: 0,
    calendarType: "duong",
    gender: "nam",
    viewYear: currentYear,
    viewMonth: 1,
    timeZone: 7,
  });

  const [error, setError] = useState("");
  const [showResult, setShowResult] = useState(false);

  // 2. HANDLER
  const handleChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;
    if (name !== "name" && name !== "gender" && name !== "calendarType") {
      processedValue = parseInt(value);
    }
    setFormData({ ...formData, [name]: processedValue });
    setError("");
  };

  // 3. VALIDATION
  const validateDate = () => {
    const { day, month, year } = formData;
    const daysInMonth = new Date(year, month, 0).getDate();
    return day <= daysInMonth;
  };

  // 4. SUBMIT
  const handleSubmit = () => {
    if (!formData.name.trim()) {
      setError("Vui lòng nhập họ tên!");
      return;
    }
    if (!validateDate()) {
      setError(
        `Tháng ${formData.month}/${formData.year} chỉ có ${new Date(
          formData.year,
          formData.month,
          0
        ).getDate()} ngày!`
      );
      return;
    }
    setShowResult(true);
  };

  // DATA ARRAYS
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  return (
    // THAY ĐỔI 1: Thêm mt-10 để chừa chỗ cho tiêu đề absolute
    <div className="w-full max-w-4xl mx-auto p-2 md:p-4 mt-10 mb-10">
      <TuviResult
        isOpen={showResult}
        onClose={() => setShowResult(false)}
        data={laSoMau}
        userInfo={formData}
      />

      {/* THAY ĐỔI 2: Padding nhỏ hơn trên mobile (p-4) và lớn hơn trên desktop (md:p-8) */}
      <div className="relative bg-black/60 backdrop-blur-sm border-y-4 md:border-y-8 border-x-4 md:border-x-8 border-yellow-700 rounded-lg p-4 md:p-8 shadow-2xl">
        {/* Tiêu đề nổi */}
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-red-800 border-2 border-yellow-500 px-6 py-2 rounded-full shadow-lg z-10 w-max max-w-[90%] text-center">
          {/* THAY ĐỔI 3: Font chữ linh hoạt (text-lg trên mobile, text-2xl trên desktop) */}
          <h2 className="!font-['Playfair_Display'] text-lg md:text-2xl font-bold text-white uppercase tracking-widest font-serif drop-shadow-md whitespace-nowrap overflow-hidden text-ellipsis">
            Lập Lá Số Tử Vi
          </h2>
        </div>

        <form className="mt-6 space-y-4 md:space-y-6 text-yellow-100">
          {/* --- HỌ TÊN --- */}
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-yellow-200 text-sm md:text-base">
              Họ Tên
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nhập họ tên..."
              className="w-full bg-gray-900 border border-gray-600 rounded p-3 focus:outline-none focus:border-yellow-500 text-white placeholder-gray-500 text-sm md:text-base"
            />
          </div>

          {/* --- NGÀY SINH --- */}
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-yellow-200 text-sm md:text-base">
              Ngày sinh (Dương lịch)
            </label>

            {error && (
              <div className="text-red-200 bg-red-900/50 p-2 rounded border border-red-500 text-xs md:text-sm font-bold animate-pulse">
                ⚠️ {error}
              </div>
            )}

            {/* THAY ĐỔI 4: Grid chuyển từ 1 cột (mobile) sang 3 cột (tablet/desktop) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
              <select
                name="day"
                value={formData.day}
                onChange={handleChange}
                className={`bg-gray-900 border rounded p-3 text-white focus:border-yellow-500 cursor-pointer text-sm md:text-base ${
                  error && error.includes("ngày")
                    ? "border-red-500"
                    : "border-gray-600"
                }`}
              >
                {days.map((day) => (
                  <option key={day} value={day}>
                    Ngày {day}
                  </option>
                ))}
              </select>

              <select
                name="month"
                value={formData.month}
                onChange={handleChange}
                className="bg-gray-900 border border-gray-600 rounded p-3 text-white focus:border-yellow-500 cursor-pointer text-sm md:text-base"
              >
                {months.map((month) => (
                  <option key={month} value={month}>
                    Tháng {month}
                  </option>
                ))}
              </select>

              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleChange}
                className="bg-gray-900 border border-gray-600 rounded p-3 text-white focus:border-yellow-500 text-sm md:text-base"
              />
            </div>

            {/* Radio Lịch - Responsive text size */}
            <div className="flex items-center gap-6 mt-1 ml-1">
              <label className="flex items-center gap-2 cursor-pointer group text-sm md:text-base">
                <input
                  type="radio"
                  name="calendarType"
                  value="duong"
                  checked={formData.calendarType === "duong"}
                  onChange={handleChange}
                  className="accent-yellow-500 w-4 h-4 cursor-pointer"
                />
                <span className="group-hover:text-yellow-400">Lịch dương</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer group text-sm md:text-base">
                <input
                  type="radio"
                  name="calendarType"
                  value="am"
                  checked={formData.calendarType === "am"}
                  onChange={handleChange}
                  className="accent-yellow-500 w-4 h-4 cursor-pointer"
                />
                <span className="group-hover:text-yellow-400">Lịch âm</span>
              </label>
            </div>
          </div>

          {/* --- GIỜ SINH --- */}
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-yellow-200 text-sm md:text-base">
              Giờ sinh
            </label>
            {/* THAY ĐỔI 5: Grid tương tự, xếp chồng trên mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
              <select
                name="timeZone"
                value={formData.timeZone}
                onChange={handleChange}
                className="bg-gray-900 border border-gray-600 rounded p-3 text-white focus:border-yellow-500 text-sm md:text-base"
              >
                <option value="7">GMT +7 (VN)</option>
                <option value="0">GMT +0</option>
              </select>

              <select
                name="hour"
                value={formData.hour}
                onChange={handleChange}
                className="bg-gray-900 border border-gray-600 rounded p-3 text-white focus:border-yellow-500 cursor-pointer text-sm md:text-base"
              >
                {hours.map((h) => (
                  <option key={h} value={h}>
                    {h} Giờ
                  </option>
                ))}
              </select>

              <select
                name="minute"
                value={formData.minute}
                onChange={handleChange}
                className="bg-gray-900 border border-gray-600 rounded p-3 text-white focus:border-yellow-500 cursor-pointer text-sm md:text-base"
              >
                {minutes.map((m) => (
                  <option key={m} value={m}>
                    {m} Phút
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* --- GIỚI TÍNH --- */}
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-yellow-200 text-sm md:text-base">
              Giới tính
            </label>
            <div className="flex items-center gap-6 ml-1">
              <label className="flex items-center gap-2 cursor-pointer group text-sm md:text-base">
                <input
                  type="radio"
                  name="gender"
                  value="nam"
                  checked={formData.gender === "nam"}
                  onChange={handleChange}
                  className="accent-yellow-500 w-4 h-4 cursor-pointer"
                />
                <span className="group-hover:text-yellow-400">Nam</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer group text-sm md:text-base">
                <input
                  type="radio"
                  name="gender"
                  value="nu"
                  checked={formData.gender === "nu"}
                  onChange={handleChange}
                  className="accent-yellow-500 w-4 h-4 cursor-pointer"
                />
                <span className="group-hover:text-yellow-400">Nữ</span>
              </label>
            </div>
          </div>

          {/* --- NĂM XEM & THÁNG XEM --- */}
          {/* THAY ĐỔI 6: Xếp chồng trên mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-yellow-200 text-sm md:text-base">
                Năm xem
              </label>
              <input
                type="number"
                name="viewYear"
                value={formData.viewYear}
                onChange={handleChange}
                className="bg-gray-900 border border-gray-600 rounded p-3 text-white focus:border-yellow-500 text-sm md:text-base"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-yellow-200 text-sm md:text-base">
                Tháng xem (Âm lịch)
              </label>
              <select
                name="viewMonth"
                value={formData.viewMonth}
                onChange={handleChange}
                className="bg-gray-900 border border-gray-600 rounded p-3 text-white focus:border-yellow-500 cursor-pointer text-sm md:text-base"
              >
                {months.map((month) => (
                  <option key={month} value={month}>
                    Tháng {month}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* --- NÚT SUBMIT --- */}
          <div className="flex justify-center mt-6 md:mt-8">
            <button
              type="button"
              onClick={handleSubmit}
              className="w-full sm:w-auto px-10 py-3 bg-yellow-700 hover:bg-yellow-600 text-white font-bold text-base md:text-lg rounded shadow-lg border-2 border-yellow-500 uppercase transition-transform transform hover:scale-105 active:scale-95 cursor-pointer"
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

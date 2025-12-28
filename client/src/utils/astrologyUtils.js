/**
 * Utility functions for astrology calculations
 * - Zodiac sign calculation
 * - Lunar year conversion
 * - 60 Hoa Giáp (Sexagenary cycle) calculation
 */

/**
 * Tính cung hoàng đạo từ ngày sinh (dương lịch)
 * @param {string} birthday - Ngày sinh dạng YYYY-MM-DD
 * @returns {string} Tên cung hoàng đạo
 */
export const calculateZodiacSign = (birthday) => {
  if (!birthday) return "N/A";
  
  const date = new Date(birthday);
  const month = date.getMonth() + 1; // 1-12
  const day = date.getDate();
  
  // Bảng cung hoàng đạo
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) {
    return "Bạch Dương";
  } else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) {
    return "Kim Ngưu";
  } else if ((month === 5 && day >= 21) || (month === 6 && day <= 21)) {
    return "Song Tử";
  } else if ((month === 6 && day >= 22) || (month === 7 && day <= 22)) {
    return "Cự Giải";
  } else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) {
    return "Sư Tử";
  } else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) {
    return "Xử Nữ";
  } else if ((month === 9 && day >= 23) || (month === 10 && day <= 23)) {
    return "Thiên Bình";
  } else if ((month === 10 && day >= 24) || (month === 11 && day <= 22)) {
    return "Bọ Cạp";
  } else if ((month === 11 && day >= 23) || (month === 12 && day <= 21)) {
    return "Nhân Mã";
  } else if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) {
    return "Ma Kết";
  } else if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) {
    return "Bảo Bình";
  } else if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) {
    return "Song Ngư";
  }
  
  return "N/A";
};

/**
 * Tính năm âm lịch từ năm dương lịch
 * Lưu ý: Đây là ước tính, năm âm lịch thường bắt đầu từ tháng 1-2 dương lịch
 * @param {string} birthday - Ngày sinh dạng YYYY-MM-DD
 * @returns {string} Năm âm lịch (Can Chi)
 */
export const calculateLunarYear = (birthday) => {
  if (!birthday) return "N/A";
  
  const date = new Date(birthday);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  // Năm âm lịch thường bắt đầu từ khoảng tháng 1-2 dương lịch
  // Nếu sinh trước tháng 2, có thể thuộc năm âm lịch trước đó
  let lunarYear = year;
  
  // Ước tính: Nếu sinh trước ngày 15/2, có thể thuộc năm âm lịch trước
  if (month === 1 || (month === 2 && day < 15)) {
    lunarYear = year - 1;
  }
  
  // Bảng 60 hoa giáp (Can Chi)
  const can = ["Giáp", "Ất", "Bính", "Đinh", "Mậu", "Kỷ", "Canh", "Tân", "Nhâm", "Quý"];
  const chi = ["Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"];
  
  // Tính chỉ số can và chi
  // Năm 1984 là Giáp Tý (index 0, 0)
  const baseYear = 1984;
  let offset = (lunarYear - baseYear) % 60;
  if (offset < 0) offset += 60;
  
  const canIndex = offset % 10;
  const chiIndex = offset % 12;
  
  return `${can[canIndex]} ${chi[chiIndex]}`;
};

/**
 * Tính mệnh từ năm âm lịch (theo bảng 60 hoa giáp)
 * @param {string} birthday - Ngày sinh dạng YYYY-MM-DD
 * @returns {string} Mệnh (Ngũ hành)
 */
export const calculateMenh = (birthday) => {
  if (!birthday) return "N/A";
  
  const date = new Date(birthday);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  // Năm âm lịch thường bắt đầu từ khoảng tháng 1-2 dương lịch
  let lunarYear = year;
  if (month === 1 || (month === 2 && day < 15)) {
    lunarYear = year - 1;
  }
  
  // Bảng mệnh theo Can Chi (60 hoa giáp)
  // Canh Tý, Tân Sửu: Thổ
  // Nhâm Dần, Quý Mão: Kim
  // Giáp Thìn, Ất Tỵ: Hỏa
  // Bính Ngọ, Đinh Mùi: Thủy
  // Mậu Thân, Kỷ Dậu: Mộc
  // Canh Tuất, Tân Hợi: Thổ
  // ... và lặp lại
  
  const can = ["Giáp", "Ất", "Bính", "Đinh", "Mậu", "Kỷ", "Canh", "Tân", "Nhâm", "Quý"];
  const chi = ["Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"];
  
  const baseYear = 1984; // Giáp Tý
  const offset = (lunarYear - baseYear) % 60;
  const adjustedOffset = offset < 0 ? offset + 60 : offset;
  
  const canIndex = adjustedOffset % 10;
  const chiIndex = adjustedOffset % 12;
  
  // Bảng mệnh theo Can Chi
  // Mỗi cặp Can-Chi có một mệnh
  const menhTable = {
    // Giáp Tý, Ất Sửu: Hải Trung Kim
    "0-0": "Hải Trung Kim", "1-1": "Hải Trung Kim",
    // Bính Dần, Đinh Mão: Lư Trung Hỏa
    "2-2": "Lư Trung Hỏa", "3-3": "Lư Trung Hỏa",
    // Mậu Thìn, Kỷ Tỵ: Đại Lâm Mộc
    "4-4": "Đại Lâm Mộc", "5-5": "Đại Lâm Mộc",
    // Canh Ngọ, Tân Mùi: Lộ Bàng Thổ
    "6-6": "Lộ Bàng Thổ", "7-7": "Lộ Bàng Thổ",
    // Nhâm Thân, Quý Dậu: Kiếm Phong Kim
    "8-8": "Kiếm Phong Kim", "9-9": "Kiếm Phong Kim",
    // Giáp Tuất, Ất Hợi: Sơn Đầu Hỏa
    "0-10": "Sơn Đầu Hỏa", "1-11": "Sơn Đầu Hỏa",
    // Bính Tý, Đinh Sửu: Giản Hạ Thủy
    "2-0": "Giản Hạ Thủy", "3-1": "Giản Hạ Thủy",
    // Mậu Dần, Kỷ Mão: Thành Đầu Thổ
    "4-2": "Thành Đầu Thổ", "5-3": "Thành Đầu Thổ",
    // Canh Thìn, Tân Tỵ: Bạch Lạp Kim
    "6-4": "Bạch Lạp Kim", "7-5": "Bạch Lạp Kim",
    // Nhâm Ngọ, Quý Mùi: Dương Liễu Mộc
    "8-6": "Dương Liễu Mộc", "9-7": "Dương Liễu Mộc",
    // Giáp Thân, Ất Dậu: Tuyền Trung Thủy
    "0-8": "Tuyền Trung Thủy", "1-9": "Tuyền Trung Thủy",
    // Bính Tuất, Đinh Hợi: Ốc Thượng Thổ
    "2-10": "Ốc Thượng Thổ", "3-11": "Ốc Thượng Thổ",
    // Mậu Tý, Kỷ Sửu: Tích Lịch Hỏa
    "4-0": "Tích Lịch Hỏa", "5-1": "Tích Lịch Hỏa",
    // Canh Dần, Tân Mão: Tùng Bách Mộc
    "6-2": "Tùng Bách Mộc", "7-3": "Tùng Bách Mộc",
    // Nhâm Thìn, Quý Tỵ: Trường Lưu Thủy
    "8-4": "Trường Lưu Thủy", "9-5": "Trường Lưu Thủy",
    // Giáp Ngọ, Ất Mùi: Sa Trung Kim
    "0-6": "Sa Trung Kim", "1-7": "Sa Trung Kim",
    // Bính Thân, Đinh Dậu: Sơn Hạ Hỏa
    "2-8": "Sơn Hạ Hỏa", "3-9": "Sơn Hạ Hỏa",
    // Mậu Tuất, Kỷ Hợi: Bình Địa Mộc
    "4-10": "Bình Địa Mộc", "5-11": "Bình Địa Mộc",
    // Canh Tý, Tân Sửu: Bích Thượng Thổ
    "6-0": "Bích Thượng Thổ", "7-1": "Bích Thượng Thổ",
    // Nhâm Dần, Quý Mão: Kim Bạch Kim
    "8-2": "Kim Bạch Kim", "9-3": "Kim Bạch Kim",
    // Giáp Thìn, Ất Tỵ: Phú Đăng Hỏa
    "0-4": "Phú Đăng Hỏa", "1-5": "Phú Đăng Hỏa",
    // Bính Ngọ, Đinh Mùi: Thiên Hà Thủy
    "2-6": "Thiên Hà Thủy", "3-7": "Thiên Hà Thủy",
    // Mậu Thân, Kỷ Dậu: Đại Dịch Thổ
    "4-8": "Đại Dịch Thổ", "5-9": "Đại Dịch Thổ",
    // Canh Tuất, Tân Hợi: Thoa Xuyến Kim
    "6-10": "Thoa Xuyến Kim", "7-11": "Thoa Xuyến Kim",
    // Nhâm Tý, Quý Sửu: Tang Đố Mộc
    "8-0": "Tang Đố Mộc", "9-1": "Tang Đố Mộc",
    // Giáp Dần, Ất Mão: Đại Khê Thủy
    "0-2": "Đại Khê Thủy", "1-3": "Đại Khê Thủy",
    // Bính Thìn, Đinh Tỵ: Sa Trung Thổ
    "2-4": "Sa Trung Thổ", "3-5": "Sa Trung Thổ",
    // Mậu Ngọ, Kỷ Mùi: Thiên Thượng Hỏa
    "4-6": "Thiên Thượng Hỏa", "5-7": "Thiên Thượng Hỏa",
    // Canh Thân, Tân Dậu: Thạch Lựu Mộc
    "6-8": "Thạch Lựu Mộc", "7-9": "Thạch Lựu Mộc",
    // Nhâm Tuất, Quý Hợi: Đại Hải Thủy
    "8-10": "Đại Hải Thủy", "9-11": "Đại Hải Thủy",
  };
  
  const key = `${canIndex}-${chiIndex}`;
  return menhTable[key] || "N/A";
};


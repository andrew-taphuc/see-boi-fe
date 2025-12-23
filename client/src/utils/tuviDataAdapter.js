/**
 * ADAPTER: Chuyển đổi dữ liệu từ Backend sang format Frontend
 *
 * Backend trả về format:
 * {
 *   chartId, input, houses, aspects, interpretationAI
 * }
 *
 * Frontend cần format:
 * {
 *   thienBan, cacCung, binhGiai
 * }
 */

/**
 * Chuyển đổi địa chi từ tiếng Việt sang ID
 */
const DIA_CHI_MAP = {
  Tý: "ty_dia",
  Sửu: "suu",
  Dần: "dan",
  Mão: "mao",
  Thìn: "thin",
  Tỵ: "ty",
  Ngọ: "ngo",
  Mùi: "mui",
  Thân: "than",
  Dậu: "dau",
  Tuất: "tuat",
  Hợi: "hoi",
};

/**
 * Chuyển đổi dữ liệu Backend → Frontend
 */
export const adaptBackendToFrontend = (backendData, userInfo) => {
  if (!backendData) {
    console.error("adaptBackendToFrontend: backendData is null or undefined");
    return null;
  }

  // Backend trả về {chartId, output: {input, houses, aspects, interpretationAI}}
  const { chartId, output } = backendData;

  if (!output) {
    console.error("adaptBackendToFrontend: output is missing", backendData);
    return null;
  }

  const { input, houses, aspects, interpretationAI } = output;

  // KIỂM TRA houses có tồn tại không
  if (!houses || !Array.isArray(houses)) {
    console.error(
      "adaptBackendToFrontend: houses is missing or not an array",
      backendData
    );
    return null;
  }

  // Helper function: Tính Can Chi cho năm
  const getCanChiYear = (year) => {
    const can = [
      "Giáp",
      "Ất",
      "Bính",
      "Đinh",
      "Mậu",
      "Kỷ",
      "Canh",
      "Tân",
      "Nhâm",
      "Quý",
    ];
    const chi = [
      "Tý",
      "Sửu",
      "Dần",
      "Mão",
      "Thìn",
      "Tỵ",
      "Ngọ",
      "Mùi",
      "Thân",
      "Dậu",
      "Tuất",
      "Hợi",
    ];
    const canIndex = (year - 4) % 10;
    const chiIndex = (year - 4) % 12;
    return `${can[canIndex]} ${chi[chiIndex]}`;
  };

  // Lấy năm xem và tháng xem từ userInfo
  const viewYear = userInfo?.viewYear || new Date().getFullYear();
  const viewMonth = userInfo?.viewMonth || 1;
  const viewYearCanChi = getCanChiYear(viewYear);

  // 1. Tạo phần Thiên Bàn (thông tin tổng quan)
  const thienBan = {
    hoTen: userInfo?.name || "Chưa có tên",
    ngaySinh: input?.birthDate || "",
    amLich: input?.isLunar ? "Âm lịch" : "Dương lịch",
    gioSinh: `${userInfo?.hour || input?.birthHour || 0} giờ ${
      userInfo?.minute || 0
    } phút`,
    gioiTinh: (userInfo?.gender || input?.gender) === "nam" ? "Nam" : "Nữ",
    namXem: viewYear,
    namXemCanChi: `${viewYearCanChi} (${viewYear})`,
    thangXem: viewMonth,
    banMenh: input?.menh || "Chưa xác định",
    chuMenh: "Đang cập nhật",
    chuThan: "Đang cập nhật",
    amDuong:
      (userInfo?.gender || input?.gender) === "nam" ? "Dương Nam" : "Âm Nữ",
    tuongQuan: "Âm Dương Thuận Lý",
  };

  // 2. Chuyển đổi houses → cacCung
  const cacCung = houses.map((house, index) => {
    return {
      id: DIA_CHI_MAP[house.branch] || `cung_${index}`,
      diaChi: house.branch || "",
      tenCung: house.cung_name || "",
      isThan: house.cung_name === "Mệnh", // Cung Mệnh được đánh dấu đặc biệt

      // Chính tinh: các sao chính (major_stars)
      chinhTinh: (house.major_stars || []).map((star) => ({
        name: star,
        daq: "M", // Mặc định, có thể customize sau
      })),

      // Phụ tinh: tạm thời để rỗng vì Backend chưa trả về minor_stars
      phuTinh: {
        tot: [],
        xau: [],
      },

      // Phân tích từ Backend
      analysis: house.analysis || "Chưa có phân tích",

      // Đại vận & Tiểu vận: chưa có từ Backend
      daiVan: null,
      tieuVan: null,
    };
  });

  // 3. Tạo phần Bình giải
  const binhGiai = {
    tongQuan: [],
    luanGiai12Cung: houses.map((house) => ({
      tenCung: house.cung_name,
      noiDung: house.analysis || "Chưa có phân tích",
    })),
  };

  // Nếu có AI interpretation, thêm vào
  if (interpretationAI) {
    binhGiai.aiInterpretation = interpretationAI;
  }

  return {
    chartId,
    thienBan,
    cacCung,
    binhGiai,
    aspects, // Giữ nguyên aspects để dùng sau
    rawBackendData: backendData, // Lưu data gốc để debug
  };
};

/**
 * Format ngày sinh để hiển thị
 */
export const formatBirthDate = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

/**
 * Format giờ sinh
 */
export const formatBirthHour = (hour) => {
  const hourRanges = {
    0: "Tý (23h - 1h)",
    1: "Sửu (1h - 3h)",
    2: "Sửu (1h - 3h)",
    3: "Dần (3h - 5h)",
    4: "Dần (3h - 5h)",
    5: "Mão (5h - 7h)",
    6: "Mão (5h - 7h)",
    7: "Thìn (7h - 9h)",
    8: "Thìn (7h - 9h)",
    9: "Tỵ (9h - 11h)",
    10: "Tỵ (9h - 11h)",
    11: "Ngọ (11h - 13h)",
    12: "Ngọ (11h - 13h)",
    13: "Mùi (13h - 15h)",
    14: "Mùi (13h - 15h)",
    15: "Thân (15h - 17h)",
    16: "Thân (15h - 17h)",
    17: "Dậu (17h - 19h)",
    18: "Dậu (17h - 19h)",
    19: "Tuất (19h - 21h)",
    20: "Tuất (19h - 21h)",
    21: "Hợi (21h - 23h)",
    22: "Hợi (21h - 23h)",
    23: "Tý (23h - 1h)",
  };

  return hourRanges[hour] || `Giờ ${hour}`;
};

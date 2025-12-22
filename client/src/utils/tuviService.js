import axiosInstance from './axiosInstance';

/**
 * SERVICE XỬ LÝ API TỬ VI
 * 
 * Chứa các hàm gọi API Backend:
 * - Tạo lá số Tử Vi mới
 * - Lấy thông tin lá số đã tạo
 * - Yêu cầu AI luận giải
 */

// ====================
// API 1: TẠO LÁ SỐ MỚI
// ====================
/**
 * Gửi thông tin sinh lên Backend để tạo lá số Tử Vi
 * 
 * @param {Object} data - Thông tin sinh
 * @param {string} data.birthDate - Ngày sinh (YYYY-MM-DD)
 * @param {number} data.birthHour - Giờ sinh (0-23)
 * @param {string} data.gender - Giới tính ("nam" hoặc "nữ")
 * @param {string} data.birthPlace - Nơi sinh (tùy chọn)
 * @param {boolean} data.isLunar - Lịch âm hay dương (true/false)
 * 
 * @returns {Promise<Object>} - Lá số Tử Vi đầy đủ (chartId, houses, aspects...)
 */
export const createTuViChart = async (data) => {
  try {
    // Gửi POST request lên Backend
    const response = await axiosInstance.post('/tuvi/create-chart', data);
    
    // Trả về dữ liệu lá số
    return response.data;
  } catch (error) {
    // Xử lý lỗi
    console.error('Lỗi khi tạo lá số Tử Vi:', error);
    
    // Ném lỗi để component có thể catch và hiển thị
    throw new Error(
      error.response?.data?.message || 'Không thể tạo lá số. Vui lòng thử lại!'
    );
  }
};

// =============================
// API 2: LẤY LÁ SỐ THEO ID
// =============================
/**
 * Lấy thông tin lá số đã tạo trước đó
 * 
 * @param {number} chartId - ID của lá số
 * @returns {Promise<Object>} - Thông tin lá số
 */
export const getTuViChart = async (chartId) => {
  try {
    const response = await axiosInstance.get(`/tuvi/${chartId}`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy lá số:', error);
    throw new Error(
      error.response?.data?.message || 'Không tìm thấy lá số!'
    );
  }
};

// =============================
// API 3: YÊU CẦU AI LUẬN GIẢI
// =============================
/**
 * Gửi yêu cầu AI luận giải lá số Tử Vi
 * 
 * @param {number} chartId - ID của lá số cần luận giải
 * @returns {Promise<Object>} - Bài luận giải từ AI
 */
export const requestAIInterpretation = async (chartId) => {
  try {
    const response = await axiosInstance.post(`/tuvi/${chartId}/interpret-ai`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi yêu cầu AI luận giải:', error);
    throw new Error(
      error.response?.data?.message || 'AI không thể luận giải lúc này!'
    );
  }
};

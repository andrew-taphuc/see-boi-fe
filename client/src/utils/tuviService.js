import axiosInstance from './axiosInstance';

/**
 * SERVICE XỬ LÝ API TỬ VI
 * 
 * Chứa các hàm gọi API Backend:
 * - Tính toán lá số (không lưu, cần auth)
 * - Lưu lá số vào database (cần auth)
 * - Lấy thông tin lá số đã lưu
 * - Yêu cầu AI luận giải
 */

// ====================
// API 1: TÍNH TOÁN LÁ SỐ (KHÔNG LƯU, CẦN AUTH)
// ====================
/**
 * Tính toán lá số Tử Vi mà không lưu vào database
 * Yêu cầu đăng nhập (JWT token)
 * 
 * @param {Object} data - Thông tin sinh
 * @returns {Promise<Object>} - Lá số Tử Vi (không có chartId)
 */
export const calculateTuViChart = async (data) => {
  try {
    const response = await axiosInstance.post('/tuvi/calculate', data);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi tính toán lá số:', error);
    throw new Error(
      error.response?.data?.message || 'Không thể tính toán lá số. Vui lòng đăng nhập!'
    );
  }
};

// ====================
// API 2: LƯU LÁ SỐ VÀO DATABASE (CẦN AUTH)
// ====================
/**
 * Lưu lá số Tử Vi vào database của user
 * Yêu cầu đăng nhập (JWT token)
 * 
 * @param {Object} data - Thông tin sinh
 * @returns {Promise<Object>} - Lá số với chartId
 */
export const saveTuViChart = async (data) => {
  try {
    const response = await axiosInstance.post('/tuvi/create-chart', data);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lưu lá số:', error);
    throw new Error(
      error.response?.data?.message || 'Không thể lưu lá số. Vui lòng đăng nhập!'
    );
  }
};

// ====================
// API 3 (DEPRECATED): TẠO LÁ SỐ
// ====================
/**
 * @deprecated Sử dụng saveTuViChart() thay thế
 */
export const createTuViChart = async (data) => {
  return saveTuViChart(data);
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

// =============================
// API 4: LẤY DANH SÁCH LÁ SỐ ĐÃ LƯU (CẦN AUTH)
// =============================
/**
 * Lấy danh sách tất cả lá số đã lưu của user
 * Yêu cầu đăng nhập (JWT token)
 * 
 * @returns {Promise<Array>} - Danh sách lá số
 */
export const getMyCharts = async () => {
  try {
    const response = await axiosInstance.get('/tuvi/my-charts');
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách lá số:', error);
    throw new Error(
      error.response?.data?.message || 'Không thể lấy danh sách lá số. Vui lòng đăng nhập!'
    );
  }
};

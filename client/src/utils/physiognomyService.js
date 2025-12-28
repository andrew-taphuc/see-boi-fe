import axiosInstance from './axiosInstance';

/**
 * Service để gọi các API Nhân Tướng (Physiognomy)
 */
class PhysiognomyService {
  /**
   * Gọi API Preview - Phân tích khuôn mặt (không lưu)
   * @param {File} imageFile - File ảnh khuôn mặt
   * @returns {Promise} Response từ API
   */
  async preview(imageFile) {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);

      const response = await axiosInstance.post('/physiognomy/preview', formData);
      return response.data;
    } catch (error) {
      // Xử lý lỗi
      if (error.response) {
        // Server trả về lỗi
        const status = error.response.status;
        const errorData = error.response.data;
        
        if (status === 400) {
          throw new Error(errorData.message || 'File ảnh không hợp lệ, thiếu file, hoặc định dạng không được hỗ trợ');
        } else if (status === 401) {
          throw new Error('Chưa đăng nhập hoặc token không hợp lệ');
        } else if (status === 500) {
          throw new Error(errorData.message || 'Lỗi server khi xử lý ảnh hoặc gọi Python service');
        } else {
          throw new Error(errorData.message || 'Có lỗi xảy ra');
        }
      } else {
        // Lỗi network hoặc lỗi khác
        throw new Error(error.message || 'Không thể kết nối đến server');
      }
    }
  }

  /**
   * Gọi API Interpret - Luận giải chi tiết bằng AI
   * @param {object} previewData - Dữ liệu từ API preview (chứa report)
   * @param {object} personalInfo - Thông tin cá nhân { name, birthday, gender }
   * @returns {Promise} Response từ API
   */
  async interpret(previewData, personalInfo) {
    try {
      const requestData = {
        data: {
          name: personalInfo.name,
          birthday: personalInfo.birthday,
          gender: personalInfo.gender, // "MALE" hoặc "FEMALE"
          report: previewData.report
        }
      };

      const response = await axiosInstance.post('/physiognomy/interpret', requestData);
      return response.data;
    } catch (error) {
      // Xử lý lỗi
      if (error.response) {
        // Server trả về lỗi
        const status = error.response.status;
        const errorData = error.response.data;
        
        if (status === 400) {
          throw new Error(errorData.message || 'Thiếu dữ liệu phân tích (report data)');
        } else if (status === 401) {
          throw new Error('Chưa đăng nhập hoặc token không hợp lệ');
        } else if (status === 500) {
          throw new Error(errorData.message || 'Lỗi server khi gọi AI service');
        } else {
          throw new Error(errorData.message || 'Có lỗi xảy ra');
        }
      } else {
        // Lỗi network hoặc lỗi khác
        throw new Error(error.message || 'Không thể kết nối đến server');
      }
    }
  }

  /**
   * Upload ảnh và lấy URL
   * @param {File} imageFile - File ảnh
   * @returns {Promise} Response chứa URL của ảnh
   */
  async uploadImage(imageFile) {
    try {
      const formData = new FormData();
      formData.append('file', imageFile);

      const response = await axiosInstance.post('/upload/image', formData);
      return response.data;
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        const errorData = error.response.data;
        
        if (status === 400) {
          throw new Error(errorData.message || 'File ảnh không hợp lệ');
        } else if (status === 401) {
          throw new Error('Chưa đăng nhập hoặc token không hợp lệ');
        } else if (status === 500) {
          throw new Error(errorData.message || 'Lỗi server khi upload ảnh');
        } else {
          throw new Error(errorData.message || 'Có lỗi xảy ra');
        }
      } else {
        throw new Error(error.message || 'Không thể kết nối đến server');
      }
    }
  }

  /**
   * Lưu kết quả phân tích vào database
   * @param {object} data - Dữ liệu cần lưu { name, birthday, gender, report, interpret, landmarks, imageUrl }
   * @returns {Promise} Response từ API
   */
  async save(data) {
    try {
      const requestData = {
        data: {
          name: data.name,
          birthday: data.birthday,
          gender: data.gender,
          report: data.report,
          interpret: data.interpret,
          landmarks: data.landmarks,
          imageUrl: data.imageUrl
        }
      };

      const response = await axiosInstance.post('/physiognomy/save', requestData);
      return response.data;
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        const errorData = error.response.data;
        
        if (status === 400) {
          throw new Error(errorData.message || 'Thiếu dữ liệu phân tích');
        } else if (status === 401) {
          throw new Error('Chưa đăng nhập hoặc token không hợp lệ');
        } else if (status === 500) {
          throw new Error(errorData.message || 'Lỗi server khi lưu vào database');
        } else {
          throw new Error(errorData.message || 'Có lỗi xảy ra');
        }
      } else {
        throw new Error(error.message || 'Không thể kết nối đến server');
      }
    }
  }

  /**
   * Lấy lịch sử phân tích của người dùng hiện tại
   * @returns {Promise} Mảng các lần phân tích đã lưu
   */
  async getHistory() {
    try {
      const response = await axiosInstance.get('/physiognomy/history/me');
      return response.data;
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        const errorData = error.response.data;
        
        if (status === 401) {
          throw new Error('Chưa đăng nhập hoặc token không hợp lệ');
        } else {
          throw new Error(errorData.message || 'Có lỗi xảy ra khi lấy lịch sử');
        }
      } else {
        throw new Error(error.message || 'Không thể kết nối đến server');
      }
    }
  }
}

export default new PhysiognomyService();


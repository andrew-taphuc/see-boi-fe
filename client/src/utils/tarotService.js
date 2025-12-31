import axiosInstance from './axiosInstance';

/**
 * Service để gọi các API Tarot
 */
class TarotService {
  /**
   * Gọi API One Card Tarot
   * @param {Object} data - { question: string, card: string }
   * @returns {Promise} Response từ API
   */
  async getOneCardReading(data) {
    try {
      const response = await axiosInstance.post('/tarot/one-card', {
        question: data.question,
        card: data.card
      });
      return response.data;
    } catch (error) {
      // Xử lý lỗi
      if (error.response) {
        // Server trả về lỗi
        const status = error.response.status;
        const errorData = error.response.data;
        
        if (status === 400) {
          throw new Error(errorData.message || 'Thiếu thông tin (câu hỏi hoặc tên lá bài)');
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
   * Gọi API Daily Tarot
   * @param {Object} data - { name: string, birthday: string, card1: string, card2: string, card3: string }
   * @returns {Promise} Response từ API
   */
  async getDailyReading(data) {
    try {
      const response = await axiosInstance.post('/tarot/daily', {
        name: data.name,
        birthday: data.birthday,
        card1: data.card1,
        card2: data.card2,
        card3: data.card3
      });
      return response.data;
    } catch (error) {
      // Xử lý lỗi
      if (error.response) {
        // Server trả về lỗi
        const status = error.response.status;
        const errorData = error.response.data;
        
        if (status === 400) {
          throw new Error(errorData.message || 'Thiếu thông tin (tên, sinh nhật hoặc tên lá bài)');
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
   * Gọi API Yes/No Tarot
   * @param {Object} data - { question: string, card1: string, card2: string, revealedCard: "card1" | "card2" }
   * @returns {Promise} Response từ API
   */
  async getYesNoReading(data) {
    try {
      const response = await axiosInstance.post('/tarot/yes-no', {
        question: data.question,
        card1: data.card1,
        card2: data.card2,
        revealedCard: data.revealedCard
      });
      return response.data;
    } catch (error) {
      // Xử lý lỗi
      if (error.response) {
        // Server trả về lỗi
        const status = error.response.status;
        const errorData = error.response.data;
        
        if (status === 400) {
          throw new Error(errorData.message || 'Thiếu thông tin (câu hỏi, lá bài hoặc thông tin lá bài đã lật)');
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
   * Gọi API Love Simple Tarot
   * @param {Object} data - { question: string, card1: string, card2: string, card3: string }
   * @returns {Promise} Response từ API
   */
  async getLoveSimpleReading(data) {
    try {
      const response = await axiosInstance.post('/tarot/love/simple', {
        question: data.question,
        card1: data.card1,
        card2: data.card2,
        card3: data.card3
      });
      return response.data;
    } catch (error) {
      // Xử lý lỗi
      if (error.response) {
        // Server trả về lỗi
        const status = error.response.status;
        const errorData = error.response.data;
        
        if (status === 400) {
          throw new Error(errorData.message || 'Thiếu thông tin (câu hỏi hoặc tên lá bài)');
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
   * Gọi API Love Deep Tarot
   * @param {Object} data - { question: string, card1: string, card2: string, card3: string, card4: string, card5: string }
   * @returns {Promise} Response từ API
   */
  async getLoveDeepReading(data) {
    try {
      const response = await axiosInstance.post('/tarot/love/deep', {
        question: data.question,
        card1: data.card1,
        card2: data.card2,
        card3: data.card3,
        card4: data.card4,
        card5: data.card5
      });
      return response.data;
    } catch (error) {
      // Xử lý lỗi
      if (error.response) {
        // Server trả về lỗi
        const status = error.response.status;
        const errorData = error.response.data;
        
        if (status === 400) {
          throw new Error(errorData.message || 'Thiếu thông tin (câu hỏi hoặc tên lá bài)');
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
   * Lấy danh sách ngẫu nhiên 22 lá bài từ 78 lá (id từ 1 đến 78)
   * @returns {Array<number>} Mảng chứa 22 id lá bài được chọn ngẫu nhiên
   */
  getRandomCardIds() {
    // Tạo mảng id từ 1 đến 78
    const allCardIds = Array.from({ length: 78 }, (_, i) => i + 1);
    
    // Shuffle mảng bằng Fisher-Yates algorithm
    const shuffled = [...allCardIds];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    // Lấy 22 id đầu tiên
    const selectedIds = shuffled.slice(0, 22);
    
    // Console log danh sách id
    console.log('Danh sách id các lá bài được chọn:', selectedIds);
    
    return selectedIds;
  }
}

export default new TarotService();


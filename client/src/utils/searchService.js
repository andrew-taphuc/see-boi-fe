import axiosInstance from "./axiosInstance";

/**
 * Tìm kiếm người dùng
 * @param {string} query - Từ khóa tìm kiếm
 * @returns {Promise<Array>} Danh sách user
 */
export const searchUsers = async (query) => {
  try {
    const response = await axiosInstance.get("/search/users", {
      params: { q: query },
    });
    return response.data;
  } catch (error) {
    console.error("Error searching users:", error);
    throw error;
  }
};

/**
 * Tìm kiếm bài viết
 * @param {string} query - Từ khóa tìm kiếm
 * @param {number} limit - Số lượng kết quả
 * @returns {Promise<Array>} Danh sách posts
 */
export const searchPosts = async (query, limit = 50) => {
  try {
    const response = await axiosInstance.get("/search/posts", {
      params: { q: query, limit },
    });
    return response.data;
  } catch (error) {
    console.error("Error searching posts:", error);
    throw error;
  }
};

/**
 * Tìm kiếm tổng hợp (cả users và posts)
 * @param {string} query - Từ khóa tìm kiếm
 * @returns {Promise<{users: Array, posts: Array}>}
 */
export const searchAll = async (query) => {
  try {
    const [users, posts] = await Promise.all([
      searchUsers(query),
      searchPosts(query, 10), // Giới hạn 10 posts trong dropdown
    ]);
    return { users, posts };
  } catch (error) {
    console.error("Error searching all:", error);
    throw error;
  }
};

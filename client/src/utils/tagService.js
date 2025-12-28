import axiosInstance from "./axiosInstance";

/**
 * Get tag detail with follow status
 * @param {number} tagId - ID of the tag
 * @returns {Promise} Response data containing tag details
 */
export const getTagDetail = async (tagId) => {
  try {
    const response = await axiosInstance.get(`/tag/${tagId}/detail`);
    return { success: true, data: response.data };
  } catch (error) {
    const status = error?.response?.status;
    const message =
      error?.response?.data?.message || "Lỗi khi lấy thông tin tag";

    if (status === 404) {
      return { success: false, error: "Không tìm thấy tag" };
    }

    return { success: false, error: message };
  }
};

/**
 * Follow a tag
 * @param {number} tagId - ID of the tag to follow
 * @returns {Promise} Response data containing the follow record
 */
export const followTag = async (tagId) => {
  try {
    const response = await axiosInstance.post(`/tag/${tagId}/follow`);
    return { success: true, data: response.data };
  } catch (error) {
    const status = error?.response?.status;
    const message = error?.response?.data?.message || "Lỗi khi theo dõi tag";

    if (status === 403) {
      return {
        success: false,
        error: "Bạn đã theo dõi tag này rồi!",
        alreadyFollowing: true,
      };
    } else if (status === 404) {
      return { success: false, error: "Không tìm thấy tag" };
    } else if (status === 401) {
      return {
        success: false,
        error: "Vui lòng đăng nhập để theo dõi tag",
        needsAuth: true,
      };
    }

    return { success: false, error: message };
  }
};

/**
 * Unfollow a tag
 * @param {number} tagId - ID of the tag to unfollow
 * @returns {Promise} Response data
 */
export const unfollowTag = async (tagId) => {
  try {
    const response = await axiosInstance.post(`/tag/${tagId}/unfollow`);
    return { success: true, data: response.data };
  } catch (error) {
    const status = error?.response?.status;
    const message = error?.response?.data?.message || "Lỗi khi bỏ theo dõi tag";

    if (status === 404) {
      return {
        success: false,
        error: "Bạn chưa theo dõi tag này",
        notFollowing: true,
      };
    } else if (status === 401) {
      return {
        success: false,
        error: "Vui lòng đăng nhập",
        needsAuth: true,
      };
    }

    return { success: false, error: message };
  }
};

/**
 * Check if user is following a tag
 * @param {number} tagId - ID of the tag
 * @returns {Promise} Response data containing isFollowing status
 */
export const checkIsFollowingTag = async (tagId) => {
  try {
    const response = await axiosInstance.get(`/tag/${tagId}/is-following`);
    return { success: true, data: response.data };
  } catch (error) {
    const message =
      error?.response?.data?.message || "Lỗi khi kiểm tra trạng thái";
    return { success: false, error: message };
  }
};

/**
 * Get list of tags user is following
 * @returns {Promise} Response data containing array of following tags
 */
export const getFollowingTags = async () => {
  try {
    const response = await axiosInstance.get("/tag/following/me");
    return { success: true, data: response.data };
  } catch (error) {
    const status = error?.response?.status;
    const message =
      error?.response?.data?.message || "Lỗi khi lấy danh sách tags";

    if (status === 401) {
      return {
        success: false,
        error: "Vui lòng đăng nhập",
        needsAuth: true,
      };
    }

    return { success: false, error: message };
  }
};

/**
 * Get all tags
 * @returns {Promise} Response data containing array of all tags
 */
export const getAllTags = async () => {
  try {
    const response = await axiosInstance.get("/tag");
    return { success: true, data: response.data };
  } catch (error) {
    const message =
      error?.response?.data?.message || "Lỗi khi lấy danh sách tags";
    return { success: false, error: message };
  }
};

/**
 * Get posts filtered by tag(s) with sorting
 * @param {Object} params - Filter parameters
 * @param {string|number|Array} params.tagIds - Tag ID(s) to filter by (single ID, comma-separated string, or array)
 * @param {string} params.sortBy - Sort type: 'recent' | 'likes' | 'views'
 * @param {number} params.skip - Number of posts to skip (default: 0)
 * @param {number} params.take - Number of posts to take (default: 20)
 * @returns {Promise} Response data containing posts array and pagination info
 */
export const getPostsByTags = async ({
  tagIds,
  sortBy = "recent",
  skip = 0,
  take = 20,
}) => {
  try {
    // Convert tagIds to comma-separated string if it's an array
    const tagIdsParam = Array.isArray(tagIds) ? tagIds.join(",") : tagIds;

    const response = await axiosInstance.get("/post", {
      params: {
        tagIds: tagIdsParam,
        sortBy,
        skip,
        take,
      },
    });
    return { success: true, data: response.data };
  } catch (error) {
    const message =
      error?.response?.data?.message || "Lỗi khi lấy danh sách bài viết";
    return { success: false, error: message };
  }
};

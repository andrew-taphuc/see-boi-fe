import axiosInstance from "./axiosInstance";

/**
 * Like a post
 * @param {number} postId - ID of the post to like
 * @returns {Promise} Response data containing the like record
 */
export const likePost = async (postId) => {
  try {
    const response = await axiosInstance.post(`/post/${postId}/like`);
    return { success: true, data: response.data };
  } catch (error) {
    const status = error?.response?.status;
    const message = error?.response?.data?.message || "Lỗi khi thích bài viết";

    if (status === 500) {
      // Already liked
      return {
        success: false,
        error: "Bạn đã thích bài viết này rồi!",
        alreadyLiked: true,
      };
    } else if (status === 404) {
      return { success: false, error: "Không tìm thấy bài viết" };
    } else if (status === 401) {
      return {
        success: false,
        error: "Vui lòng đăng nhập để thích bài viết",
        needsAuth: true,
      };
    }

    return { success: false, error: message };
  }
};

/**
 * Unlike a post
 * @param {number} postId - ID of the post to unlike
 * @returns {Promise} Response data containing the unlike record
 */
export const unlikePost = async (postId) => {
  try {
    const response = await axiosInstance.post(`/post/${postId}/unlike`);
    return { success: true, data: response.data };
  } catch (error) {
    const status = error?.response?.status;
    const message =
      error?.response?.data?.message || "Lỗi khi bỏ thích bài viết";

    if (status === 404) {
      return {
        success: false,
        error: "Bạn chưa thích bài viết này",
        notLiked: true,
      };
    } else if (status === 401) {
      return { success: false, error: "Vui lòng đăng nhập", needsAuth: true };
    }

    return { success: false, error: message };
  }
};

/**
 * Bookmark a post
 * @param {number} postId - ID of the post to bookmark
 * @param {number|null} collectionId - Optional collection ID to save the post to
 * @returns {Promise} Response data containing the bookmark record
 */
export const bookmarkPost = async (postId, collectionId = null) => {
  try {
    const body = collectionId ? { collectionId } : {};
    const response = await axiosInstance.post(`/post/${postId}/bookmark`, body);
    return { success: true, data: response.data };
  } catch (error) {
    const status = error?.response?.status;
    const message = error?.response?.data?.message || "Lỗi khi lưu bài viết";

    if (status === 403) {
      return {
        success: false,
        error: "Bạn đã lưu bài viết này rồi!",
        alreadyBookmarked: true,
      };
    } else if (status === 404) {
      return {
        success: false,
        error: "Không tìm thấy bài viết hoặc bài viết không khả dụng",
      };
    } else if (status === 401) {
      return {
        success: false,
        error: "Vui lòng đăng nhập để lưu bài viết",
        needsAuth: true,
      };
    }

    return { success: false, error: message };
  }
};

/**
 * Remove bookmark from a post
 * @param {number} postId - ID of the post to unbookmark
 * @returns {Promise} Response data
 */
export const unbookmarkPost = async (postId) => {
  try {
    const response = await axiosInstance.delete(`/post/${postId}/bookmark`);
    return { success: true, data: response.data };
  } catch (error) {
    const status = error?.response?.status;
    const message = error?.response?.data?.message || "Lỗi khi bỏ lưu bài viết";

    if (status === 404) {
      return {
        success: false,
        error: "Bạn chưa lưu bài viết này",
        notBookmarked: true,
      };
    } else if (status === 401) {
      return { success: false, error: "Vui lòng đăng nhập", needsAuth: true };
    }

    return { success: false, error: message };
  }
};

/**
 * Toggle like status for a post
 * @param {number} postId - ID of the post
 * @param {boolean} isLiked - Current like status
 * @returns {Promise} Response data
 */
export const toggleLike = async (postId, isLiked) => {
  if (isLiked) {
    return await unlikePost(postId);
  } else {
    return await likePost(postId);
  }
};

/**
 * Toggle bookmark status for a post
 * @param {number} postId - ID of the post
 * @param {boolean} isBookmarked - Current bookmark status
 * @param {number|null} collectionId - Optional collection ID
 * @returns {Promise} Response data
 */
export const toggleBookmark = async (
  postId,
  isBookmarked,
  collectionId = null
) => {
  if (isBookmarked) {
    return await unbookmarkPost(postId);
  } else {
    return await bookmarkPost(postId, collectionId);
  }
};

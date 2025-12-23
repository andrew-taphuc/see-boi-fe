/**
 * Default avatar URLs based on gender
 */
export const DEFAULT_AVATARS = {
  Nam: 'https://res.cloudinary.com/dzvvhdqoq/image/upload/v1766502334/avatars/aolxzvvfvh5adc47oskb.png',
  Nữ: 'https://res.cloudinary.com/dzvvhdqoq/image/upload/v1766502377/avatars/bcmlbmvvmasiglui0rq1.png',
  Khác: 'https://res.cloudinary.com/dzvvhdqoq/image/upload/v1766502399/avatars/jrtupw0heikbr5btb4yq.png',
};

/**
 * Get default avatar URL based on gender
 * @param {string} gender - Gender value (Nam, Nữ, Khác)
 * @returns {string} Default avatar URL
 */
export const getDefaultAvatar = (gender) => {
  return DEFAULT_AVATARS[gender] || DEFAULT_AVATARS.Khác;
};


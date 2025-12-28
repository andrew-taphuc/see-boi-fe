/**
 * Default avatar URLs based on gender
 */
export const DEFAULT_AVATARS = {
  Nam: 'https://i.postimg.cc/N0s0xNXJ/default-Avatar.png',
  Nữ: 'https://i.postimg.cc/MG9p3y0s/Chat-GPT-Image-22-06-06-23-thg-12-2025.png',
  Khác: 'https://i.postimg.cc/HL6kvQ03/Chat-GPT-Image-22-06-03-23-thg-12-2025.png',
};

/**
 * Get default avatar URL based on gender
 * @param {string} gender - Gender value (Nam, Nữ, Khác)
 * @returns {string} Default avatar URL
 */
export const getDefaultAvatar = (gender) => {
  return DEFAULT_AVATARS[gender] || DEFAULT_AVATARS.Khác;
};


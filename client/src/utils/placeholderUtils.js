/**
 * Utility functions for creating placeholder images
 * Sử dụng SVG data URI để không cần kết nối internet
 */

/**
 * Tạo placeholder image dạng SVG data URI
 * @param {number} width - Chiều rộng (mặc định: 400)
 * @param {number} height - Chiều cao (mặc định: 225)
 * @param {string} text - Text hiển thị (mặc định: "No Image")
 * @param {string} bgColor - Màu nền (mặc định: "#e5e7eb")
 * @param {string} textColor - Màu chữ (mặc định: "#9ca3af")
 * @returns {string} SVG data URI
 */
export const createPlaceholderImage = (
  width = 400,
  height = 225,
  text = "No Image",
  bgColor = "#e5e7eb",
  textColor = "#9ca3af"
) => {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${bgColor}"/>
      <text 
        x="50%" 
        y="50%" 
        font-family="Arial, sans-serif" 
        font-size="16" 
        fill="${textColor}" 
        text-anchor="middle" 
        dominant-baseline="middle"
      >
        ${text}
      </text>
    </svg>
  `.trim();

  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
};

/**
 * Placeholder image mặc định cho post thumbnail (400x225)
 */
export const DEFAULT_POST_THUMBNAIL = createPlaceholderImage(
  400,
  225,
  "No Image",
  "#e5e7eb",
  "#9ca3af"
);

/**
 * Placeholder image mặc định cho avatar (150x150)
 */
export const DEFAULT_AVATAR_PLACEHOLDER = createPlaceholderImage(
  150,
  150,
  "Avatar",
  "#e5e7eb",
  "#9ca3af"
);


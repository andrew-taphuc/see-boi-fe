/**
 * Hàm kiểm tra độ mạnh của mật khẩu
 * @param {string} password - Mật khẩu cần kiểm tra
 * @returns {object} - { isValid: boolean, error: string }
 */
export const validatePassword = (password) => {
  // 1. Kiểm tra độ dài (ví dụ: tối thiểu 6 ký tự)
  if (password.length < 6) {
    return {
      isValid: false,
      error: "Mật khẩu phải có ít nhất 6 ký tự.",
    };
  }

  // 2. Kiểm tra chữ thường
  if (!/[a-z]/.test(password)) {
    return {
      isValid: false,
      error: "Mật khẩu phải chứa ít nhất 1 chữ thường (a-z).",
    };
  }

  // 3. Kiểm tra chữ hoa
  if (!/[A-Z]/.test(password)) {
    return {
      isValid: false,
      error: "Mật khẩu phải chứa ít nhất 1 chữ hoa (A-Z).",
    };
  }

  // 4. Kiểm tra số
  if (!/[0-9]/.test(password)) {
    return {
      isValid: false,
      error: "Mật khẩu phải chứa ít nhất 1 số (0-9).",
    };
  }

  // 5. Kiểm tra ký tự đặc biệt (Tùy chọn, nếu muốn gắt hơn thì bỏ comment dòng dưới)
  // if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
  //   return { isValid: false, error: "Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt." };
  // }

  // Nếu thỏa mãn tất cả
  return { isValid: true, error: "" };
};
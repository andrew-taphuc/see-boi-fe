import React from "react";
import { Link } from "react-router-dom";

// Footer navigation data
const footerSections = [
  {
    title: "Chính sách",
    links: [
      { text: "Chính sách bản quyền" },
      { text: "Chính sách bảo mật" },
      { text: "Điều khoản & Dịch vụ" },
      { text: "Chính sách bình luận & Góp ý" },
    ],
  },
  {
    title: "Nhận tư vấn",
    links: [
      { text: "Liên hệ See Bói", href: "/lien-he" },
      {
        text: "Sđt/Zalo: ",
        highlight: "0976121084",
        href: "https://zalo.me/0976121084",
        external: true,
      },
    ],
  },
];

// Variant configurations for colors
const variantStyles = {
  nhantuong: {
    bg: "bg-red-950/90",
    titleColor: "text-yellow-400",
    textColor: "text-yellow-100/80",
    linkHover: "hover:text-yellow-300",
    highlightColor: "text-yellow-300",
    highlightHover: "hover:text-yellow-400",
    borderColor: "border-yellow-600/20",
    copyrightText: "text-yellow-100/70",
    copyrightHighlight: "text-yellow-400",
    brandName: "See Bói",
  },
  tarot: {
    bg: "bg-[#0f0519]",
    titleColor: "text-[#d9b193]",
    textColor: "text-[#d9b193]",
    linkHover: "hover:opacity-80",
    highlightColor: "text-[#f0c9a8]",
    highlightHover: "hover:opacity-80",
    borderColor: "border-[#d9b193]",
    copyrightText: "text-[#d9b193]",
    copyrightHighlight: "text-[#d9b193]",
    brandName: "See Bói",
  },
  tuvi: {
    bg: "bg-red-900",
    titleColor: "text-yellow-400",
    textColor: "text-yellow-100/80",
    linkHover: "hover:text-yellow-300",
    highlightColor: "text-yellow-300",
    highlightHover: "hover:text-yellow-400",
    borderColor: "border-yellow-800",
    copyrightText: "text-yellow-600",
    copyrightHighlight: "text-yellow-500",
    brandName: "See Bói",
  },
  social: {
    bg: "bg-white",
    titleColor: "text-gray-800",
    textColor: "text-gray-600",
    linkHover: "hover:text-gray-900",
    highlightColor: "text-purple-600",
    highlightHover: "hover:text-purple-700",
    borderColor: "border-gray-200",
    copyrightText: "text-gray-500",
    copyrightHighlight: "text-gray-700",
    brandName: "See Bói",
  },
};

const CommonFooter = ({ variant = "nhantuong" }) => {
  const styles = variantStyles[variant] || variantStyles.nhantuong;

  return (
    <footer className={`${styles.bg} ${variant === "social" ? "border-t border-gray-200" : ""} py-12 md:py-16`}>
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* CỘT 1: THÔNG TIN CHUNG */}
            <div className="space-y-4">
              <h2
                className={`text-2xl font-bold ${styles.titleColor} uppercase tracking-wider`}
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {styles.brandName}
              </h2>
              <p className={`text-sm leading-relaxed ${styles.textColor}`}>
                Chuyên trang nghiên cứu và luận giải Tử Vi Đẩu Số, Nhân Tướng
                Học và Tarot. Giúp bạn khám phá vận mệnh, nắm bắt cơ hội và hóa
                giải vận hạn trong cuộc sống.
              </p>
            </div>

            {/* CỘT 2: CHÍNH SÁCH */}
            <div className="space-y-4">
              <h3
                className={`text-lg font-semibold ${styles.titleColor} uppercase tracking-wide`}
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {footerSections[0].title}
              </h3>
              <ul className="space-y-2">
                {footerSections[0].links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    {link.href ? (
                      <Link
                        to={link.href}
                        className={`text-sm ${styles.textColor} ${styles.linkHover} transition-colors`}
                      >
                        {link.text}
                      </Link>
                    ) : (
                      <span
                        className={`text-sm ${styles.textColor} cursor-pointer ${styles.linkHover} transition-colors`}
                      >
                        {link.text}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* CỘT 3: LIÊN HỆ & MẠNG XÃ HỘI */}
            <div className="space-y-4">
              <h3
                className={`text-lg font-semibold ${styles.titleColor} uppercase tracking-wide`}
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {footerSections[1].title}
              </h3>
              <ul className="space-y-2">
                {footerSections[1].links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    {link.href ? (
                      link.highlight ? (
                        <>
                          <span className={`text-sm ${styles.textColor}`}>
                            {link.text}
                          </span>
                          <a
                            href={link.href}
                            {...(link.external && {
                              target: "_blank",
                              rel: "noopener noreferrer",
                            })}
                            className={`text-sm ${styles.highlightColor} ${styles.highlightHover} transition-colors`}
                          >
                            {link.highlight}
                          </a>
                        </>
                      ) : (
                        <Link
                          to={link.href}
                          className={`text-sm ${styles.textColor} ${styles.linkHover} transition-colors`}
                        >
                          {link.text}
                        </Link>
                      )
                    ) : (
                      <span className={`text-sm ${styles.textColor}`}>
                        {link.text}
                      </span>
                    )}
                  </li>
                ))}
              </ul>

              {/* Social Media Icons */}
              <div className="pt-2">
                <p className={`text-sm mb-3 ${styles.textColor}`}>
                  Theo dõi chúng tôi trên mạng xã hội
                </p>
                <div className="flex gap-4">
                  {/* Facebook */}
                  <a
                    href="#"
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all border-2 ${
                      variant === "tarot"
                        ? "border-[#d9b193] text-[#d9b193] hover:bg-[#d9b193]/10 hover:border-[#f0c9a8] hover:text-[#f0c9a8]"
                        : variant === "tuvi"
                        ? "bg-yellow-700 hover:bg-yellow-500 text-white"
                        : variant === "social"
                        ? "border-gray-300 text-gray-600 hover:bg-gray-100 hover:border-gray-400 hover:text-gray-800"
                        : "border-yellow-600/50 text-yellow-400 hover:bg-yellow-600/20 hover:border-yellow-500"
                    }`}
                    aria-label="Facebook"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </a>

                  {/* YouTube */}
                  <a
                    href="#"
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all border-2 ${
                      variant === "tarot"
                        ? "border-[#d9b193] text-[#d9b193] hover:bg-[#d9b193]/10 hover:border-[#f0c9a8] hover:text-[#f0c9a8]"
                        : variant === "tuvi"
                        ? "bg-red-700 hover:bg-red-600 text-white border-yellow-600"
                        : variant === "social"
                        ? "border-gray-300 text-gray-600 hover:bg-gray-100 hover:border-gray-400 hover:text-gray-800"
                        : "border-yellow-600/50 text-yellow-400 hover:bg-yellow-600/20 hover:border-yellow-500"
                    }`}
                    aria-label="YouTube"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  </a>

                  {/* TikTok */}
                  <a
                    href="#"
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all border-2 ${
                      variant === "tarot"
                        ? "border-[#d9b193] text-[#d9b193] hover:bg-[#d9b193]/10 hover:border-[#f0c9a8] hover:text-[#f0c9a8]"
                        : variant === "tuvi"
                        ? "bg-black hover:bg-gray-800 text-white border-yellow-600"
                        : variant === "social"
                        ? "border-gray-300 text-gray-600 hover:bg-gray-100 hover:border-gray-400 hover:text-gray-800"
                        : "border-yellow-600/50 text-yellow-400 hover:bg-yellow-600/20 hover:border-yellow-500"
                    }`}
                    aria-label="TikTok"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* BẢN QUYỀN */}
          <div
            className={`border-t ${styles.borderColor} ${
              variant === "tarot" ? "opacity-50" : ""
            } pt-6 text-center text-sm ${styles.copyrightText}`}
          >
            <p>
              &copy; {new Date().getFullYear()}{" "}
              <span className={styles.copyrightHighlight}>SEEBOI</span>. Bảo lưu
              mọi quyền.
            </p>
            <p className="mt-1 text-xs">Thiết kế bởi SEEBOI TEAM</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default CommonFooter;

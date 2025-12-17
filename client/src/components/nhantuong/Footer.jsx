import Logo1 from "../../assets/nhantuong/introLogo1.svg";
import Logo2 from "../../assets/nhantuong/introLogo2.svg";

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

const Footer = () => {
  return (
    <footer id="nhantuong-footer" className="bg-red-950/90 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Main Footer Content */}
          <div className="flex flex-col md:flex-row items-start md:items-start justify-between gap-8 md:gap-12">
            {/* Logo Section */}
            <div className="w-full md:w-auto md:shrink-0 text-center">
              <div className="md:text-left">
                <a
                  href="/nhantuong"
                  className="inline-flex flex-col items-center mb-4 hover:opacity-80 transition-opacity"
                  title="Trang chủ"
                >
                  {/* Logo with clouds */}
                  <div className="flex items-center gap-2 mb-2">
                    <img
                      src={Logo1}
                      width="60"
                      height="20"
                      alt="Intro Logo 1"
                    />
                    <div className="text-yellow-400 font-bold text-2xl">
                      Nhân Tướng
                    </div>
                    <img
                      src={Logo2}
                      width="60"
                      height="20"
                      alt="Intro Logo 2"
                    />
                  </div>
                  <p className="text-yellow-300/80 text-xs">
                    Xem tướng hiểu mình
                  </p>
                </a>
              </div>
            </div>

            {/* Chính sách và Nhận tư vấn Sections */}
            {footerSections.map((section, idx) => (
              <div key={idx} className="w-full md:w-auto px-4">
                <h3 className="text-yellow-400 font-semibold mb-3 text-sm md:text-2xl">
                  {section.title}
                </h3>
                <ul className="space-y-1.5 text-sm md:text-base">
                  {section.links.map((link, linkIdx) => (
                    <li key={linkIdx}>
                      {link.href ? (
                        link.highlight ? (
                          <>
                            <span className="text-yellow-100/80">
                              {link.text}
                            </span>
                            <a
                              href={link.href}
                              {...(link.external && {
                                target: "_blank",
                                rel: "noopener noreferrer",
                              })}
                              className="text-yellow-300 hover:text-yellow-400 transition-colors"
                            >
                              {link.highlight}
                            </a>
                          </>
                        ) : (
                          <a
                            href={link.href}
                            className="text-yellow-100/80 hover:text-yellow-300 transition-colors"
                          >
                            {link.text}
                          </a>
                        )
                      ) : (
                        <span className="text-yellow-100/80 hover:text-yellow-300 transition-colors">
                          {link.text}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom Section - Copyright */}
          <div className="mt-12 pt-6 border-t border-yellow-600/20 text-center">
            <div className="text-yellow-100/70 text-xs">
              Copyright © 2025 by{" "}
              <span className="text-yellow-400">hoinhungnguoideptrai.vn</span>.
              All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

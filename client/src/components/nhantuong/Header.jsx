import Logo1 from "@assets/nhantuong/introLogo1.svg";
import Logo2 from "@assets/nhantuong/introLogo2.svg";
import MenuBackground from "@assets/nhantuong/menu_background.svg";

const Header = () => {
  // const menuItems = [
  //   { label: "Nhân tướng", href: "/nhantuong", active: false },
  //   { label: "Luận giải", href: "/nhantuong#xem-tuong" },
  //   { label: "Tính năng", href: "/nhantuong#tinh-nang" },
  //   { label: "Giới thiệu", href: "/nhantuong/gioi-thieu" },
  //   { label: "Liên hệ", href: "/nhantuong#nhantuong-footer" },
  // ];

  return (
    <div className="container mx-auto px-4 pt-4 md:pt-8 pb-4">
      {/* Header Section */}
      <div className="flex flex-col items-center mb-4 md:mb-6">
        <a
          href="/nhantuong"
          className="flex items-center gap-1 md:gap-4 mb-3 md:mb-4"
        >
          <img
            src={Logo1}
            className="w-12 h-6 md:w-[110px] md:h-[49px]"
            alt="Intro Logo 1"
          />
          <div className="text-center">
            <h1
              className="text-2xl md:text-5xl font-serif text-yellow-400 tracking-wider"
              style={{
                fontFamily: "'Crimson Text', serif",
                textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
              }}
            >
              Nhân Tướng
            </h1>
            <p className="text-yellow-500 text-xs md:text-sm tracking-[0.2em] md:tracking-[0.3em]">
              Xem tướng hiểu mình
            </p>
          </div>
          <img
            src={Logo2}
            className="w-12 h-6 md:w-[110px] md:h-[49px]"
            alt="Intro Logo 2"
          />
        </a>
      </div>

    

      {/* Desktop Navigation Section */}
      {/* <div className="hidden md:flex justify-center">
        <div
          className="px-32 py-12"
          style={{
            backgroundImage: `url(${MenuBackground})`,
            backgroundSize: "contain",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <ul className="flex gap-24 items-center text-xl">
            {menuItems.map((item, index) => (
              <li key={index}>
                <a
                  href={item.href}
                  className={`${
                    item.active
                      ? "text-yellow-400 font-medium"
                      : "text-yellow-100/90"
                  } hover:text-yellow-300 transition-colors`}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div> */}
    </div>
  );
};

export default Header;

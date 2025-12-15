import MenuBackground from "../../assets/nhantuong/menu_background.svg";

const Navigation = () => {
  const menuItems = [
    { label: "Trang chủ", href: "/nhantuong", active: false },
    { label: "Nhân Tướng", href: "/nhantuong#xem-tuong" },
    { label: "Tính năng", href: "/nhantuong#tinh-nang" },
    { label: "Giới thiệu", href: "/nhantuong/gioi-thieu" },
    { label: "Kiến thức", href: "#" },
    { label: "Liên hệ", href: "#" },
  ];

  return (
    <nav className="container mx-auto px-4 mb-12">
      <div className="flex justify-center">
        <div
          className="px-27 py-10"
          style={{
            backgroundImage: `url(${MenuBackground})`,
            backgroundSize: "contain",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <ul className="flex gap-20 items-center text-lg">
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
      </div>
    </nav>
  );
};

export default Navigation;

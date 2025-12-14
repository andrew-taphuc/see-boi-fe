import Logo1 from "../../assets/nhantuong/introLogo1.svg";
import Logo2 from "../../assets/nhantuong/introLogo2.svg";

const Header = () => {
  return (
    <div className="container mx-auto px-4 pt-8 pb-4">
      <div className="flex flex-col items-center">
        <a href="/" className="flex items-center gap-4 mb-4">
          <img src={Logo1} width="110" height="49" alt="Intro Logo 1" />
          <div className="text-center">
            <h1
              className="text-5xl font-serif text-yellow-400 tracking-wider"
              style={{
                fontFamily: "'Crimson Text', serif",
                textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
              }}
            >
              Nhân Tướng
            </h1>
            <p className="text-yellow-500 text-sm tracking-[0.3em] mt-1">
              Xem tướng hiểu mình
            </p>
          </div>
          <img src={Logo2} width="110" height="49" alt="Intro Logo 2" />
        </a>
      </div>
    </div>
  );
};

export default Header;

import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import ThemeToggle from "../ThemeToggle";

const Header = ({
  isScrolled,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  onOpenLogin,
  onOpenRegister,
}) => {
  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#E8DCC4]/95 backdrop-blur-md shadow-[0_4px_20px_rgba(124,109,72,0.1)]"
          : "bg-transparent"
      }`}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-gray-900">See Bói</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className="text-gray-900 hover:text-amber-600 transition-colors"
            >
              Trang chủ
            </Link>
            <Link
              to="/tarot"
              className="text-gray-900 hover:text-amber-600 transition-colors"
            >
              Tarot
            </Link>
            <Link
              to="/tuvi"
              className="text-gray-900 hover:text-amber-600 transition-colors"
            >
              Tử vi
            </Link>
            <Link
              to="/nhantuong"
              className="text-gray-900 hover:text-amber-600 transition-colors"
            >
              Nhân tướng học
            </Link>
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenLogin}
                className="bg-amber-800 text-white px-4 py-2 rounded hover:bg-amber-900 transition-colors cursor-pointer"
              >
                Đăng nhập
              </button>

              <button
                onClick={onOpenRegister}
                className="bg-amber-800 text-white px-4 py-2 rounded hover:bg-amber-900 transition-colors cursor-pointer"
              >
                Đăng ký
              </button>
            </div>
            <div className="border-l border-gray-300 pl-2">
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-[#4D3F33]"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-300">
            <div className="flex flex-col space-y-3">
              <Link
                to="/"
                className="text-gray-900 hover:text-amber-600 transition-colors text-left py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Trang chủ
              </Link>
              <Link
                to="/tarot"
                className="text-gray-900 hover:text-amber-600 transition-colors text-left py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Tarot
              </Link>
              <Link
                to="/tuvi"
                className="text-gray-900 hover:text-amber-600 transition-colors text-left py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Tử vi
              </Link>
              <Link
                to="/nhantuong"
                className="text-gray-900 hover:text-amber-600 transition-colors text-left py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Nhân tướng học
              </Link>
              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={() => {
                    onOpenLogin();
                    setIsMobileMenuOpen(false);
                  }}
                  className="bg-amber-800 text-white px-4 py-2 rounded w-full hover:bg-amber-900 transition-colors"
                >
                  Đăng nhập
                </button>

                <button
                  onClick={() => {
                    onOpenRegister();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-center py-2 text-gray-900 border border-gray-300 rounded hover:bg-gray-50"
                >
                  Đăng ký
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;

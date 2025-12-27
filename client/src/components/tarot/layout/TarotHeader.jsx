import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import TarotLogo from './TarotLogo';
import TarotMenu from './TarotMenu';
import '../common/TarotFonts.css';
import './TarotHeader.css';

const TarotHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLogoHovered, setIsLogoHovered] = useState(false);

  const handleLogoMouseEnter = () => {
    setIsLogoHovered(true);
  };

  const handleLogoMouseLeave = () => {
    setIsLogoHovered(false);
  };

  return (
    <div className="tarot-header">
      {/* Logo luôn hiển thị ở vị trí cố định */}
      <div 
        className="tarot-header__logo-wrapper"
        onMouseEnter={() => {
          setIsLogoHovered(true);
        }}
        onMouseLeave={() => {
          setIsLogoHovered(false);
        }}
        onClick={(e) => {
          // Scroll về đầu trang ngay lập tức trước khi navigate
          window.scrollTo(0, 0);
          document.documentElement.scrollTop = 0;
          document.body.scrollTop = 0;
          // Navigate về trang /tarot khi click vào wrapper hoặc logo
          navigate('/tarot');
        }}
        style={{
          backgroundColor: 'rgba(0, 255, 0, 0.2)', // Màu xanh để thấy wrapper
          padding: '10px',
          border: '2px solid green'
        }}
      >
        <TarotLogo 
          onMouseEnter={handleLogoMouseEnter}
          onMouseLeave={handleLogoMouseLeave}
        />
      </div>
      
      {/* Menu với logic ẩn/hiện */}
      <TarotMenu isLogoHovered={isLogoHovered} currentPath={location.pathname} />
    </div>
  );
};

export default TarotHeader;


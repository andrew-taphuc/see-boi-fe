import React from 'react';
import { useNavigate } from 'react-router-dom';
import './TarotLogo.css';

const TarotLogo = ({ onMouseEnter, onMouseLeave }) => {
  const navigate = useNavigate();
  const handleMouseEnter = (e) => {
    if (onMouseEnter) onMouseEnter(e);
  };

  const handleMouseLeave = (e) => {
    if (onMouseLeave) onMouseLeave(e);
  };

  // Thêm event listeners trực tiếp vào element
  React.useEffect(() => {
    const logoElement = document.querySelector('.header__logo');
    if (logoElement) {
      const handleMouseOver = (e) => {
        // Event handler
      };
      
      const handleMouseEnterDirect = (e) => {
        // Event handler
      };
      
      logoElement.addEventListener('mouseover', handleMouseOver);
      logoElement.addEventListener('mouseenter', handleMouseEnterDirect);
      
      return () => {
        logoElement.removeEventListener('mouseover', handleMouseOver);
        logoElement.removeEventListener('mouseenter', handleMouseEnterDirect);
      };
    }
  }, []);

  const handleLogoClick = (e) => {
    e.preventDefault();
    e.stopPropagation(); // Ngăn event bubble lên wrapper để tránh double navigation
    // Scroll về đầu trang ngay lập tức trước khi navigate
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    navigate('/tarot');
  };

  return (
    <a 
      href="/tarot" 
      className="header__logo" 
      aria-label="Tarot Home"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleLogoClick}
      style={{ 
        position: 'relative',
        zIndex: 1000,
        pointerEvents: 'auto',
        backgroundColor: 'rgba(255, 0, 0, 0.3)', // Tạm thời để thấy vùng logo
        cursor: 'pointer',
        display: 'block',
        width: 'fit-content',
        height: 'fit-content'
      }}
    >
      <img 
        className="logo-tt" 
        src="https://tarotoo.com/wp-content/themes/tarotootheme/assets/svg/logo-typo.svg" 
        alt="Tarotoo" 
        decoding="async"
      />
      
      <div className="logo-symbol-wrap">
        <img 
          className="star" 
          src="https://tarotoo.com/wp-content/themes/tarotootheme/assets/svg/star.svg" 
          alt="Tarotoo" 
          decoding="async"
        />
        <img 
          className="logo-symbol" 
          src="https://tarotoo.com/wp-content/themes/tarotootheme/assets/svg/logo-symbol.svg" 
          alt="Tarotoo" 
          decoding="async"
        />
      </div>
    </a>
  );
};

export default TarotLogo;


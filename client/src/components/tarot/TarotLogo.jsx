import React from 'react';
import { useNavigate } from 'react-router-dom';
import './TarotLogo.css';

const TarotLogo = ({ onMouseEnter, onMouseLeave }) => {
  const navigate = useNavigate();
  const handleMouseEnter = (e) => {
    console.log('🎯 TarotLogo onMouseEnter triggered', e);
    console.log('📍 Element:', e.currentTarget);
    console.log('📍 Element position:', e.currentTarget.getBoundingClientRect());
    if (onMouseEnter) onMouseEnter(e);
  };

  const handleMouseLeave = (e) => {
    console.log('🎯 TarotLogo onMouseLeave triggered', e);
    if (onMouseLeave) onMouseLeave(e);
  };

  // Thêm event listeners trực tiếp vào element
  React.useEffect(() => {
    const logoElement = document.querySelector('.header__logo');
    if (logoElement) {
      console.log('✅ Logo element found:', logoElement);
      console.log('📍 Logo position:', logoElement.getBoundingClientRect());
      console.log('📍 Logo z-index:', window.getComputedStyle(logoElement).zIndex);
      console.log('📍 Logo pointer-events:', window.getComputedStyle(logoElement).pointerEvents);
      
      const handleMouseOver = (e) => {
        console.log('🖱️ Direct mouseover on logo element', e);
      };
      
      const handleMouseEnterDirect = (e) => {
        console.log('🖱️ Direct mouseenter on logo element', e);
      };
      
      logoElement.addEventListener('mouseover', handleMouseOver);
      logoElement.addEventListener('mouseenter', handleMouseEnterDirect);
      
      return () => {
        logoElement.removeEventListener('mouseover', handleMouseOver);
        logoElement.removeEventListener('mouseenter', handleMouseEnterDirect);
      };
    } else {
      console.log('❌ Logo element NOT found!');
    }
  }, []);

  const handleLogoClick = (e) => {
    e.preventDefault();
    e.stopPropagation(); // Ngăn event bubble lên wrapper để tránh double navigation
    console.log('🖱️ Logo clicked - navigating to /tarot');
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
      onMouseDown={(e) => {
        console.log('🖱️ Logo mousedown', e);
      }}
      onMouseUp={(e) => {
        console.log('🖱️ Logo mouseup', e);
      }}
      onPointerEnter={(e) => {
        console.log('🖱️ Logo pointerEnter', e);
      }}
      onPointerOver={(e) => {
        console.log('🖱️ Logo pointerOver', e);
      }}
      onMouseOver={(e) => {
        console.log('🖱️ Logo onMouseOver', e);
      }}
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


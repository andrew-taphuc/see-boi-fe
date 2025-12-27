import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './TarotMenu.css';
import './TarotFonts.css';

const TarotMenu = ({ isLogoHovered: isLogoHoveredProp, currentPath = '' }) => {
  const navigate = useNavigate();
  // Nếu ở các trang spread, menu mặc định ẩn
  const spreadPages = ['/tarot/spread', '/tarot/yes-no', '/tarot/love-simple', '/tarot/love-deep', '/tarot/daily', '/tarot/one-card'];
  const isSpreadPage = spreadPages.includes(currentPath);
  const [isVisible, setIsVisible] = useState(!isSpreadPage);
  // Ban đầu, hover mặc định là false dù prop truyền vào có thế nào
  const [isLogoHovered, setIsLogoHovered] = useState(false);

  const prevScrollY = useRef(0);
  const hideTimeoutRef = useRef(null);

  const tarotItems = [
    { 
      id: 'love-tarot', 
      label: 'Love', 
      path: '/tarot/love',
      iconBase: 'https://tarotoo.com/wp-content/themes/tarotootheme/assets/navigation-icon/icon-love-50_base.svg',
      iconElA: 'https://tarotoo.com/wp-content/themes/tarotootheme/assets/navigation-icon/icon-love-50_el-a.svg',
      iconElB: 'https://tarotoo.com/wp-content/themes/tarotootheme/assets/navigation-icon/icon-love-50_el-b.svg',
      type: 'love',
      position: 'left'
    },
    { 
      id: 'yes-no', 
      label: 'Yes / No', 
      path: '/tarot/yes-no',
      iconBase: 'https://tarotoo.com/wp-content/themes/tarotootheme/assets/navigation-icon/icon-three-50_base.svg',
      iconElA: 'https://tarotoo.com/wp-content/themes/tarotootheme/assets/navigation-icon/icon-three-50_el-a.svg',
      iconElB: 'https://tarotoo.com/wp-content/themes/tarotootheme/assets/navigation-icon/icon-three-50_el-b.svg',
      type: 'yesno',
      position: 'left-center'
    },
    { 
      id: 'daily-tarot', 
      label: 'Daily', 
      path: '/tarot/daily',
      iconBase: 'https://tarotoo.com/wp-content/themes/tarotootheme/assets/navigation-icon/icon-yesno-50_base.svg',
      iconElA: 'https://tarotoo.com/wp-content/themes/tarotootheme/assets/navigation-icon/icon-yesno-50_el-a.svg',
      iconElB: 'https://tarotoo.com/wp-content/themes/tarotootheme/assets/navigation-icon/icon-yesno-50_el-b.svg',
      iconElC: 'https://tarotoo.com/wp-content/themes/tarotootheme/assets/navigation-icon/icon-yesno-50_el-c.svg',
      iconElD: 'https://tarotoo.com/wp-content/themes/tarotootheme/assets/navigation-icon/icon-yesno-50_el-d.svg',
      type: 'three',
      position: 'right-center'
    },
    { 
      id: 'one-card', 
      label: 'One Card', 
      path: '/tarot/one-card',
      iconBase: 'https://tarotoo.com/wp-content/themes/tarotootheme/assets/navigation-icon/icon-one-50_base.svg',
      iconElA: 'https://tarotoo.com/wp-content/themes/tarotootheme/assets/navigation-icon/icon-one-50_el-a.svg',
      iconElB: 'https://tarotoo.com/wp-content/themes/tarotootheme/assets/navigation-icon/icon-one-50_el-b.svg',
      type: 'one',
      position: 'right'
    },
  ];

  // Cập nhật visibility khi route thay đổi
  useEffect(() => {
    if (isSpreadPage) {
      setIsVisible(false);
    } else if (window.scrollY === 0) {
      setIsVisible(true);
    }
  }, [currentPath, isSpreadPage]);

  // Mỗi khi prop thay đổi, ta update lại state -- nhưng chỉ gọi từ lần thứ 2
  useEffect(() => {
    setIsLogoHovered(isLogoHoveredProp ?? false);
  }, [isLogoHoveredProp]);

  // Khi hover logo: hiện menu, bỏ hover thì vẫn hiện menu 3 giây rồi mới ẩn
  useEffect(() => {
    // Nếu ở trang spread, không hiện menu khi hover logo
    if (isSpreadPage) {
      return;
    }
    
    if (isLogoHovered) {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }
      setIsVisible(true);
    } else {
      if (window.scrollY > 0) {
        if (!hideTimeoutRef.current) {
          hideTimeoutRef.current = setTimeout(() => {
            setIsVisible(false);
            hideTimeoutRef.current = null;
          }, 900);
        }
      } else {
        if (hideTimeoutRef.current) {
          clearTimeout(hideTimeoutRef.current);
          hideTimeoutRef.current = null;
        }
        setIsVisible(true);
      }
    }
    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }
    };
  }, [isLogoHovered, isSpreadPage]);

  // Effect cho scroll – vẫn giữ logic như trước
  useEffect(() => {
    // Nếu ở trang spread, không xử lý scroll
    if (isSpreadPage) {
      return;
    }

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY === 0) {
        setIsVisible(true);
        if (hideTimeoutRef.current) {
          clearTimeout(hideTimeoutRef.current);
          hideTimeoutRef.current = null;
        }
      }

      if (
        currentScrollY > prevScrollY.current &&
        !isLogoHovered &&
        isVisible
      ) {
        if (!hideTimeoutRef.current) {
          hideTimeoutRef.current = setTimeout(() => {
            setIsVisible(false);
            hideTimeoutRef.current = null;
          }, 300);
        }
      }

      prevScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    prevScrollY.current = window.scrollY;
    if (window.scrollY === 0) setIsVisible(true);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }
    };
    // eslint-disable-next-line
  }, [isLogoHovered, isVisible, isSpreadPage]);

  // Hover lên menu thì giữ menu hiện và clear timeout
  // Bỏ hover thì đợi 3 giây mới ẩn menu nếu đang ở giữa trang
  const handleMenuMouseEnter = () => {
    // Nếu ở trang spread, không hiện menu
    if (isSpreadPage) return;
    
    setIsVisible(true);
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  };

  const handleMenuMouseLeave = () => {
    // Nếu ở trang spread, không xử lý
    if (isSpreadPage) return;
    
    if (window.scrollY > 0) {
      if (!hideTimeoutRef.current) {
        hideTimeoutRef.current = setTimeout(() => {
          setIsVisible(false);
          hideTimeoutRef.current = null;
        }, 900);
      }
    } else {
      setIsVisible(true);
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }
    }
  };

  const handleItemClick = (path) => {
    // Scroll về đầu trang ngay lập tức trước khi navigate
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    // Navigate đến trang mới
    navigate(path);
  };

  return (
    <nav
      className={`tarot-menu ${isVisible ? 'visible' : 'hidden'}`}
      onMouseEnter={handleMenuMouseEnter}
      onMouseLeave={handleMenuMouseLeave}
    >
      {tarotItems.map((item) => (
        <div key={item.id} className={`nav-item ${item.position} ${item.type}`}>
          <a
            href={item.path}
            className="link-animation"
            onClick={(e) => {
              e.preventDefault();
              handleItemClick(item.path);
            }}
          >
            <div className="icon">
              {item.type === 'usual' && (
                <>
                  <img className="base" src={item.iconBase} alt="" />
                  <img className="el" src={item.iconEl} alt="" />
                </>
              )}
              {item.type === 'love' && (
                <>
                  <img className="base" src={item.iconBase} alt="" />
                  <div className="tail">
                    <img src={item.iconElA} alt="" />
                  </div>
                  <img className="el-b" src={item.iconElB} alt="" />
                  <div className="arrowhead">
                    <img src={item.iconElA} alt="" />
                  </div>
                </>
              )}
              {item.type === 'yesno' && (
                <>
                  <img className="base" src={item.iconBase} alt="" />
                  <img className="el-a" src={item.iconElA} alt="" />
                  <img className="el-b" src={item.iconElB} alt="" />
                </>
              )}
              {item.type === 'three' && (
                <>
                  <img className="base" src={item.iconBase} alt="" />
                  <img className="el-a" src={item.iconElA} alt="" />
                  <img className="el-b" src={item.iconElB} alt="" />
                  <img className="el-c" src={item.iconElC} alt="" />
                  <div className="shine">
                    <img src={item.iconElD} alt="" />
                  </div>
                </>
              )}
              {item.type === 'one' && (
                <>
                  <img className="base" src={item.iconBase} alt="" />
                  <img className="el-a" src={item.iconElA} alt="" />
                  <img className="el-b" src={item.iconElB} alt="" />
                </>
              )}
            </div>
            <div className="link">
              <div className="basic">{item.label}</div>
              <div className="hover">{item.label}</div>
            </div>
          </a>
        </div>
      ))}
    </nav>
  );
};

export default TarotMenu;

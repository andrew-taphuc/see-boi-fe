import React, { useState, useRef, useEffect } from 'react';
import './TarotCard.css';

const TarotCard = ({ 
  cardName, 
  cardUrl, 
  videoUrl, 
  cardBackImage = "https://tarotoo.com/wp-content/themes/tarotootheme/assets/card-back/card-back-usual.jpg.webp",
  onCardClick 
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const animationRef = useRef(null);
  const startTimeRef = useRef(null);
  const cardRef = useRef(null);
  const currentRotationRef = useRef(0);

  const handleCardClick = (e) => {
    e.preventDefault();
    if (onCardClick) {
      onCardClick();
    }
  };

  // Calculate rotation based on progress with overshoot
  const getRotation = (progress) => {
    if (progress <= 0.6) {
      // 0% to 60%: go to 200deg
      return (progress / 0.6) * 200;
    } else if (progress <= 0.75) {
      // 60% to 75%: go back to 175deg
      const t = (progress - 0.6) / 0.15;
      return 200 - (200 - 175) * t;
    } else if (progress <= 0.9) {
      // 75% to 90%: go to 182deg
      const t = (progress - 0.75) / 0.15;
      return 175 + (182 - 175) * t;
    } else {
      // 90% to 100%: settle at 180deg
      const t = (progress - 0.9) / 0.1;
      return 182 - (182 - 180) * t;
    }
  };

  useEffect(() => {
    if (isFlipped) {
      startTimeRef.current = Date.now();
      const animate = () => {
        const elapsed = Date.now() - startTimeRef.current;
        const progress = Math.min(elapsed / 2000, 1);
        const rotation = getRotation(progress);
        currentRotationRef.current = rotation;
        
        if (cardRef.current) {
          cardRef.current.style.transform = `rotateY(${rotation}deg)`;
        }
        
        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          if (cardRef.current) {
            cardRef.current.style.transform = 'rotateY(180deg)';
          }
          currentRotationRef.current = 180;
        }
      };
      animationRef.current = requestAnimationFrame(animate);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      
      // Reverse from current position
      const startRotation = currentRotationRef.current;
      const startTime = Date.now();
      const duration = (startRotation / 180) * 2000; // Proportional to how far we got
      
      const reverseAnimate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const rotation = startRotation * (1 - progress);
        currentRotationRef.current = rotation;
        
        if (cardRef.current) {
          cardRef.current.style.transform = `rotateY(${rotation}deg)`;
          cardRef.current.style.transition = 'none';
        }
        
        if (progress < 1) {
          animationRef.current = requestAnimationFrame(reverseAnimate);
        } else {
          if (cardRef.current) {
            cardRef.current.style.transform = 'rotateY(0deg)';
            cardRef.current.style.transition = '';
          }
          currentRotationRef.current = 0;
        }
      };
      
      if (startRotation > 0) {
        animationRef.current = requestAnimationFrame(reverseAnimate);
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isFlipped]);

  return (
    <div className="card-list__item">
      <a 
        href={cardUrl || '#'} 
        className="card-blog-item"
        onClick={handleCardClick}
        onMouseEnter={() => setIsFlipped(true)}
        onMouseLeave={() => setIsFlipped(false)}
      >
        <div className="video" style={{ '--t-rotate': '' }} data-rotate="">
          <div className="play-card">
            <div 
              ref={cardRef}
              className="flip-card-inner"
            >
              <div className="flip-card-back">
                <img 
                  src={cardBackImage} 
                  alt="Tarot card back" 
                  className="lazyload"
                  loading="lazy"
                />
              </div>
              <div className="flip-card-front">
                {videoUrl && (
                  <video 
                    className="card-video" 
                    autoPlay 
                    muted 
                    playsInline 
                    loop
                  >
                    <source type="video/mp4" src={videoUrl} />
                  </video>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="card-blog-item__l-star">
          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path 
              fillRule="evenodd" 
              clipRule="evenodd" 
              d="M3.93934 6.06066L0 5L3.93934 3.93934L5 0L6.06066 3.93934L10 5L6.06066 6.06066L5 10L3.93934 6.06066Z" 
              fill="#D2A17D"
            />
          </svg>
        </div>
        <div className="card-blog-item__r-star">
          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path 
              fillRule="evenodd" 
              clipRule="evenodd" 
              d="M3.93934 6.06066L0 5L3.93934 3.93934L5 0L6.06066 3.93934L10 5L6.06066 6.06066L5 10L3.93934 6.06066Z" 
              fill="#D2A17D"
            />
          </svg>
        </div>

        <div className="card-blog-item__center-line"></div>
        <div className="card-blog-item__left-decore"></div>
        <div className="card-blog-item__right-decore"></div>
        <div className="card-blog-item__decorative-circle-container">
          <div className="card-blog-item__decorative-circle bottom"></div>
        </div>
        <h5 className="title card-blog-item__title">
          <span className="-h5 -m-p">{cardName || 'Tarot Card'}</span>
        </h5>
      </a>
    </div>
  );
};

export default TarotCard;


import React, { useState } from 'react';
import './TarotCard.css';

const TarotCard = ({ 
  cardName, 
  cardUrl, 
  videoUrl, 
  cardBackImage = "https://tarotoo.com/wp-content/themes/tarotootheme/assets/card-back/card-back-usual.jpg.webp",
  onCardClick 
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleCardClick = (e) => {
    e.preventDefault();
    if (onCardClick) {
      onCardClick();
    }
  };

  return (
    <div className="card-list__item">
      <a 
        href={cardUrl || '#'} 
        className="card-blog-item"
        onClick={handleCardClick}
      >
        <div className="video" style={{ '--t-rotate': '' }} data-rotate="">
          <div className="play-card">
            <div 
              className={`flip-card-inner ${isFlipped ? 'flipped' : ''}`}
              onMouseEnter={() => setIsFlipped(true)}
              onMouseLeave={() => setIsFlipped(false)}
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


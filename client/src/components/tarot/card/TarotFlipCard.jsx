import React, { useState, useRef } from 'react';
import './TarotFlipCard.css';

const TarotFlipCard = ({ 
  card, 
  cardBackImage = "https://tarotoo.com/wp-content/themes/tarotootheme/assets/card-back/card-back-usual.jpg.webp",
  width = 300,
  height = 500,
  canFlip = true,
  showCardName = true,
  allowUnflip = true,
  onFlip = null
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const videoRef = useRef(null);

  const handleCardClick = () => {
    if (!canFlip) return;
    
    // Nếu không cho phép unflip và đã lật rồi thì không làm gì
    if (!allowUnflip && isFlipped) return;
    
    const newFlippedState = !isFlipped;
    setIsFlipped(newFlippedState);
    
    // Notify parent khi thẻ được lật
    if (onFlip && newFlippedState) {
      onFlip();
    }
    
    // Play video when card is flipped
    if (newFlippedState && videoRef.current) {
      videoRef.current.play();
    }
  };

  return (
    <div className="tarot-flip-card-container" style={{ width: `${width}px` }}>
      <div 
        className={`tarot-flip-card-wrapper ${isFlipped ? 'flipped' : ''} ${!canFlip ? 'flip-disabled' : ''}`}
        onClick={handleCardClick}
        style={{ 
          width: `${width}px`, 
          height: `${height}px`,
          cursor: canFlip ? 'pointer' : 'default'
        }}
      >
        <div className="tarot-flip-card">
          <div className="card-face card-back">
            <img 
              src={cardBackImage} 
              alt="Tarot card back" 
              className="card-back-image"
            />
          </div>
          <div className="card-face card-front">
            {card?.video_mp4 && (
              <video 
                ref={videoRef}
                className="card-video" 
                autoPlay 
                muted 
                playsInline 
                loop
              >
                <source type="video/mp4" src={card.video_mp4} />
              </video>
            )}
          </div>
        </div>
      </div>
      {showCardName && isFlipped && card?.card_name && (
        <div className="card-name">
          {card.card_name}
        </div>
      )}
    </div>
  );
};

export default TarotFlipCard;


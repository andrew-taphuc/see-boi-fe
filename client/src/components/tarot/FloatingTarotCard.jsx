import React, { useState, useEffect, useRef } from 'react';
import './FloatingTarotCard.css';

const FloatingTarotCard = ({ cards, cardBackImage = "https://tarotoo.com/wp-content/themes/tarotootheme/assets/card-back/card-back-usual.jpg.webp" }) => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    // Trigger entrance animation
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    // Animation is 6 seconds total: 0-3s (0deg to 180deg), 3-6s (180deg to 360deg)
    // Change video when card is completely showing back (at 180deg = 50% = 3 seconds)
    // This happens at 3 seconds, 9 seconds, 15 seconds, etc.
    const interval = setInterval(() => {
      // Change video when back is fully visible (at 180deg)
      setCurrentCardIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % cards.length;
        return nextIndex;
      });
    }, 3000); // Change video every 3 seconds (when back is fully visible at 180deg)

    return () => clearInterval(interval);
  }, [cards.length]);

  const currentCard = cards[currentCardIndex];

  return (
    <div 
      className={`floating-card-container ${isLoaded ? 'loaded' : ''}`}
    >
      <div className="floating-card-wrapper">
        <div className="floating-card">
          <div className="card-face card-back">
            <img 
              src={cardBackImage} 
              alt="Tarot card back" 
              className="card-back-image"
            />
          </div>
          <div className="card-face card-front">
            {currentCard?.video_mp4 && (
              <video 
                ref={videoRef}
                className="card-video" 
                autoPlay 
                muted 
                playsInline 
                loop
                key={currentCard.video_mp4} // Force re-render when video changes
              >
                <source type="video/mp4" src={currentCard.video_mp4} />
              </video>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloatingTarotCard;


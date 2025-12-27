import React from 'react';
import FloatingTarotCard from '../card/FloatingTarotCard';
import './DailyTarotResult.css';

const DailyTarotResult = ({ result, onClose, cardsData }) => {
  if (!result) return null;

  const { name, birthday, cards, reading } = result;

  return (
    <div className="daily-tarot-result-overlay" onClick={onClose}>
      <div 
        className="daily-tarot-result-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          className="daily-tarot-result-close"
          onClick={onClose}
          aria-label="Đóng"
        >
          ×
        </button>

        <div className="daily-tarot-result-header">
          <h2 className="daily-tarot-result-title">Kết Quả Bói Bài</h2>
          {cardsData && cardsData.length === 3 && (
            <div className="daily-tarot-result-cards">
              {cardsData.map((cardData, index) => (
                <div key={index} className="daily-tarot-result-card-item">
                  <FloatingTarotCard 
                    cards={[cardData]}
                    inline={true}
                  />
                  <div className="daily-tarot-result-card-label">
                    <div className="daily-tarot-result-card-name">{cardData.card_name}</div>
                    <div className="daily-tarot-result-card-category">
                      {index === 0 && 'Tình yêu'}
                      {index === 1 && 'Tâm trạng'}
                      {index === 2 && 'Tiền bạc'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="daily-tarot-result-intro">
          <p className="daily-tarot-result-intro-text">
            Dưới đây là tổng quan ngày hôm nay của <strong>{name}</strong> dựa trên 3 lá bài đã bốc:
          </p>
        </div>

        <div className="daily-tarot-result-reading">
          <div className="daily-tarot-result-section">
            <h3 className="daily-tarot-result-section-title">💕 Tình Yêu</h3>
            <p className="daily-tarot-result-section-text">{reading['tinh-yeu']}</p>
          </div>

          <div className="daily-tarot-result-section">
            <h3 className="daily-tarot-result-section-title">😊 Tâm Trạng</h3>
            <p className="daily-tarot-result-section-text">{reading['tam-trang']}</p>
          </div>

          <div className="daily-tarot-result-section">
            <h3 className="daily-tarot-result-section-title">💰 Tiền Bạc</h3>
            <p className="daily-tarot-result-section-text">{reading['tien-bac']}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyTarotResult;


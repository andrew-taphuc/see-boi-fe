import React from 'react';
import FloatingTarotCard from '../card/FloatingTarotCard';
import './LoveSimpleResult.css';

const LoveSimpleResult = ({ result, onClose, cardsData }) => {
  if (!result) return null;

  const { question, cards, reading } = result;

  return (
    <div className="love-simple-result-overlay" onClick={onClose}>
      <div 
        className="love-simple-result-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          className="love-simple-result-close"
          onClick={onClose}
          aria-label="Đóng"
        >
          ×
        </button>

        <div className="love-simple-result-header">
          <h2 className="love-simple-result-title">Kết Quả Bói Bài Tình Yêu</h2>
          {cardsData && cardsData.length === 3 && (
            <div className="love-simple-result-cards">
              {cardsData.map((cardData, index) => (
                <div key={index} className="love-simple-result-card-item">
                  <FloatingTarotCard 
                    cards={[cardData]}
                    inline={true}
                  />
                  <div className="love-simple-result-card-label">
                    <div className="love-simple-result-card-name">{cardData.card_name}</div>
                    <div className="love-simple-result-card-category">
                      {index === 0 && 'Quá khứ'}
                      {index === 1 && 'Hiện tại'}
                      {index === 2 && 'Tương lai'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="love-simple-result-question">
          <p className="love-simple-result-question-label">Câu hỏi của bạn:</p>
          <p className="love-simple-result-question-text">"{question}"</p>
        </div>

        <div className="love-simple-result-reading">
          <div className="love-simple-result-section">
            <h3 className="love-simple-result-section-title">Quá Khứ</h3>
            <p className="love-simple-result-section-text">{reading['qua-khu']}</p>
          </div>

          <div className="love-simple-result-section">
            <h3 className="love-simple-result-section-title">Hiện Tại</h3>
            <p className="love-simple-result-section-text">{reading['hien-tai']}</p>
          </div>

          <div className="love-simple-result-section">
            <h3 className="love-simple-result-section-title">Tương Lai</h3>
            <p className="love-simple-result-section-text">{reading['tuong-lai']}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoveSimpleResult;


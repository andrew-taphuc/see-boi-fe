import React from 'react';
import FloatingTarotCard from '../card/FloatingTarotCard';
import './OneCardResult.css';

const OneCardResult = ({ result, onClose, cardData }) => {
  if (!result) return null;

  const { question, card, reading } = result;

  return (
    <div className="one-card-result-overlay" onClick={onClose}>
      <div 
        className="one-card-result-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          className="one-card-result-close"
          onClick={onClose}
          aria-label="Đóng"
        >
          ×
        </button>

        <div className="one-card-result-header">
          <h2 className="one-card-result-title">Kết Quả Bói Bài</h2>
          {cardData && (
            <div className="one-card-result-floating-card">
              <FloatingTarotCard 
                cards={[cardData]}
                inline={true}
              />
            </div>
          )}
          <div className="one-card-result-card-info">
            <span className="one-card-result-card-name">{card.name}</span>
          </div>
        </div>

        <div className="one-card-result-question">
          <p className="one-card-result-question-label">Câu hỏi của bạn:</p>
          <p className="one-card-result-question-text">"{question}"</p>
        </div>

        <div className="one-card-result-reading">
          <div className="one-card-result-section">
            <h3 className="one-card-result-section-title">Luận Giải</h3>
            <p className="one-card-result-section-text">{reading.interpretation}</p>
          </div>

          <div className="one-card-result-section">
            <h3 className="one-card-result-section-title">Lời Khuyên</h3>
            <p className="one-card-result-section-text">{reading.guidance}</p>
          </div>

          <div className="one-card-result-section one-card-result-key-message">
            <h3 className="one-card-result-section-title">Thông Điệp Chính</h3>
            <p className="one-card-result-key-message-text">{reading.keyMessage}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OneCardResult;


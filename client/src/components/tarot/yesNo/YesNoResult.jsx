import React from 'react';
import FloatingTarotCard from '../card/FloatingTarotCard';
import './YesNoResult.css';

const YesNoResult = ({ result, onClose, cardData }) => {
  if (!result) return null;

  const { question, revealedCard, answer } = result;

  return (
    <div className="yesno-result-overlay" onClick={onClose}>
      <div 
        className="yesno-result-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          className="yesno-result-close"
          onClick={onClose}
          aria-label="Đóng"
        >
          ×
        </button>

        <div className="yesno-result-header">
          <h2 className="yesno-result-title">Kết Quả Bói Bài</h2>
          {cardData && (
            <div className="yesno-result-floating-card">
              <FloatingTarotCard 
                cards={[cardData]}
                inline={true}
              />
            </div>
          )}
          <div className="yesno-result-card-info">
            <span className="yesno-result-card-name">{revealedCard.name}</span>
          </div>
        </div>

        <div className="yesno-result-question">
          <p className="yesno-result-question-label">Câu hỏi của bạn:</p>
          <p className="yesno-result-question-text">"{question}"</p>
        </div>

        <div className="yesno-result-answer">
          <div className="yesno-result-yesno">
            <span className={`yesno-result-yesno-badge ${answer.yesNo === 'yes' ? 'yes' : 'no'}`}>
              {answer.yesNo === 'yes' ? 'CÓ' : 'KHÔNG'}
            </span>
          </div>
        </div>

        <div className="yesno-result-reading">
          <div className="yesno-result-section">
            <h3 className="yesno-result-section-title">Giải Thích</h3>
            <p className="yesno-result-section-text">{answer.explanation}</p>
          </div>

          <div className="yesno-result-section">
            <h3 className="yesno-result-section-title">Góc Nhìn Sâu Hơn</h3>
            <p className="yesno-result-section-text">{answer.deeperInsight}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YesNoResult;


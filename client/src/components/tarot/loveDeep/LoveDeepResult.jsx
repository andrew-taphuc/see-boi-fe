import React from 'react';
import FloatingTarotCard from '../card/FloatingTarotCard';
import './LoveDeepResult.css';

const LoveDeepResult = ({ result, onClose, cardsData }) => {
  if (!result) return null;

  const { question, cards, reading } = result;

  const cardLabels = [
    'Năng lượng khi bước vào mối quan hệ',
    'Thử thách hay vấn đề trên hành trình yêu thương',
    'Dư âm từ những mối tình đã qua',
    'Điều cần chữa lành, hoàn thiện hoặc học hỏi',
    'Thông điệp về yêu thương bản thân'
  ];

  const readingKeys = [
    'nang-luong',
    'thu-thach',
    'du-am',
    'chua-lanh',
    'yeu-thuong-ban-than'
  ];

  const readingTitles = [
    'Năng Lượng',
    'Thử Thách',
    'Dư Âm',
    'Chữa Lành',
    'Yêu Thương Bản Thân'
  ];

  return (
    <div className="love-deep-result-overlay" onClick={onClose}>
      <div 
        className="love-deep-result-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          className="love-deep-result-close"
          onClick={onClose}
          aria-label="Đóng"
        >
          ×
        </button>

        <div className="love-deep-result-header">
          <h2 className="love-deep-result-title">Kết Quả Bói Bài Tình Yêu Sâu Sắc</h2>
          {cardsData && cardsData.length === 5 && (
            <div className="love-deep-result-cards">
              {cardsData.map((cardData, index) => (
                <div key={index} className="love-deep-result-card-item">
                  <FloatingTarotCard 
                    cards={[cardData]}
                    inline={true}
                  />
                  <div className="love-deep-result-card-label">
                    <div className="love-deep-result-card-name">{cardData.card_name}</div>
                    <div className="love-deep-result-card-category">
                      {cardLabels[index]}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="love-deep-result-question">
          <p className="love-deep-result-question-label">Câu hỏi của bạn:</p>
          <p className="love-deep-result-question-text">"{question}"</p>
        </div>

        <div className="love-deep-result-reading">
          {readingKeys.map((key, index) => (
            <div key={key} className="love-deep-result-section">
              <h3 className="love-deep-result-section-title">
                {index + 1}. {readingTitles[index]}
              </h3>
              <p className="love-deep-result-section-text">{reading[key]}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoveDeepResult;


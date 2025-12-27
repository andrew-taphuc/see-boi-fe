import React, { useState } from 'react';
import './TarotQuestionModal.css';

const TarotQuestionModal = ({ isOpen, onClose, onSubmit }) => {
  const [question, setQuestion] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (question.trim()) {
      onSubmit(question.trim());
      setQuestion('');
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      // Không cho phép đóng modal khi click vào overlay
      // Modal chỉ đóng khi submit
    }
  };

  return (
    <div
      className="tarot-question-modal-overlay"
      onClick={handleOverlayClick}
    >
      {/* Hiệu ứng khói mờ ảo màu trắng */}
      <div className="tarot-question-smoke-effect"></div>
      
      {/* Modal Content - chỉ hiện input, button và title */}
      <div 
        className="tarot-question-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="tarot-question-title">
          Nhập câu hỏi của bạn
        </h2>
        
        <form onSubmit={handleSubmit} className="tarot-question-form">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Nhập câu hỏi của bạn..."
            className="tarot-question-input"
            autoFocus
          />
          
          <button
            type="submit"
            className="tarot-question-submit-btn"
            disabled={!question.trim()}
          >
            Gửi
          </button>
        </form>
      </div>
    </div>
  );
};

export default TarotQuestionModal;


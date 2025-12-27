import React, { useState } from 'react';
import './DailyTarotInfoModal.css';

const DailyTarotInfoModal = ({ isOpen, onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [birthday, setBirthday] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() && birthday.trim()) {
      onSubmit({
        name: name.trim(),
        birthday: birthday.trim()
      });
      setName('');
      setBirthday('');
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
      className="daily-tarot-info-modal-overlay"
      onClick={handleOverlayClick}
    >
      {/* Hiệu ứng khói mờ ảo màu trắng */}
      <div className="daily-tarot-info-smoke-effect"></div>
      
      {/* Modal Content - chỉ hiện input, button và title */}
      <div 
        className="daily-tarot-info-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="daily-tarot-info-title">
          Nhập thông tin của bạn
        </h2>
        
        <form onSubmit={handleSubmit} className="daily-tarot-info-form">
          <div className="daily-tarot-info-inputs-row">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Họ và tên..."
              className="daily-tarot-info-input"
              autoFocus
            />
            
            <input
              type="date"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              className="daily-tarot-info-input daily-tarot-info-date-input"
            />
          </div>
          
          <button
            type="submit"
            className="daily-tarot-info-submit-btn"
            disabled={!name.trim() || !birthday.trim()}
          >
            Gửi
          </button>
        </form>
      </div>
    </div>
  );
};

export default DailyTarotInfoModal;


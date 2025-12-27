import React from 'react'
import { useNavigate } from 'react-router-dom'
import FloatingTarotCard from '@components/tarot/card/FloatingTarotCard'
import TarotFlipCard from '@components/tarot/card/TarotFlipCard'
import tarotCardsData from '@data/tarot_card.json'
import TarotCardList from '@pages/tarot/TarotCardList'

const Tarot = () => {
  const navigate = useNavigate()

  return (
    <div className="relative" style={{ backgroundColor: '#1a0d2e', color: '#d9b193' }}>
      {/* Phần nội dung chính */}
      <div className="min-h-screen flex flex-col items-center justify-start px-4 pt-6 pb-12 relative overflow-hidden">
        {/* FloatingTarotCard ở gần menu */}
        <div 
          className="mb-16 relative z-20 cursor-pointer"
          onClick={() => navigate('/tarot/card')}
          style={{ cursor: 'pointer' }}
        >
          <FloatingTarotCard cards={tarotCardsData} inline={true} />
        </div>
        
        {/* Phần text */}
        <div className="max-w-4xl w-full text-center relative z-20">
          <p className="uppercase tracking-[0.3em] mb-4 text-sm" style={{ color: '#d9b193' }}>Khám phá Tarot</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: '#d9b193' }}>Hành trình cùng 78 lá bài</h1>
          <p className="mb-10 max-w-2xl mx-auto" style={{ color: '#d9b193' }}>
            Chạm vào lá bài để bước vào thư viện Tarot và khám phá ý nghĩa chi tiết của từng lá.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Tarot


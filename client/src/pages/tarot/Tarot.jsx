import React from 'react'
import { useNavigate } from 'react-router-dom'
import FloatingTarotCard from '@components/tarot/FloatingTarotCard'
import tarotCardsData from '@data/tarot_card.json'
import TarotCardList from '@pages/tarot/TarotCardList'

const Tarot = () => {
  const navigate = useNavigate()

  return (
    <div className="relative" style={{ backgroundColor: '#1a0d2e', color: '#d9b193' }}>
      {/* Phần nội dung chính */}
      <div className="min-h-screen flex  justify-center px-4 relative overflow-hidden">
        {/* <FloatingTarotCard cards={tarotCardsData} /> */}
        
        <div className="max-w-4xl w-full text-center relative z-20">
          <p className="uppercase tracking-[0.3em] mb-4 text-sm" style={{ color: '#d9b193' }}>Khám phá Tarot</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: '#d9b193' }}>Hành trình cùng 78 lá bài</h1>
          <p className="mb-10 max-w-2xl mx-auto" style={{ color: '#d9b193' }}>
            Chạm vào lá bài để bước vào thư viện Tarot và khám phá ý nghĩa chi tiết của từng lá.
          </p>

          <div className="flex flex-col items-center gap-6">
            <button
              onClick={() => navigate('/tarot/card')}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold shadow-lg relative z-30"
            >
              Xem danh sách 78 lá bài
            </button>
            {/* <div><TarotCardList /> </div> */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Tarot


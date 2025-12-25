import React from 'react'
import { useNavigate } from 'react-router-dom'
import TarotCard from '@components/tarot/TarotCard'
import tarotCardsData from '@data/tarot_card.json'

const Tarot = () => {
  const navigate = useNavigate()
  const featuredCard = tarotCardsData?.[0]

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#1a0d2e', color: '#d9b193' }}>
      <div className="max-w-4xl w-full text-center">
        <p className="uppercase tracking-[0.3em] mb-4 text-sm" style={{ color: '#d9b193' }}>Khám phá Tarot</p>
        <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: '#d9b193' }}>Hành trình cùng 78 lá bài</h1>
        <p className="mb-10 max-w-2xl mx-auto" style={{ color: '#d9b193' }}>
          Chạm vào lá bài để bước vào thư viện Tarot và khám phá ý nghĩa chi tiết của từng lá.
        </p>

        <div className="flex flex-col items-center gap-6">
          {featuredCard && (
            <div className="w-full max-w-md" onClick={() => navigate('/tarot/card')}>
              <TarotCard
                cardName={featuredCard.card_name}
                cardUrl="/tarot/card"
                videoUrl={featuredCard.video_mp4}
                onCardClick={() => navigate('/tarot/card')}
              />
            </div>
          )}

          <button
            onClick={() => navigate('/tarot/card')}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold shadow-lg"
          >
            Xem danh sách 78 lá bài
          </button>
        </div>
      </div>
    </div>
  )
}

export default Tarot
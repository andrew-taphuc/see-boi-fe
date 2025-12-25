import React from 'react'
import { useNavigate } from 'react-router-dom'
import TarotCard from '@components/tarot/TarotCard'
import tarotCardsData from '@data/tarot_card.json'

const TarotCardList = () => {
  const navigate = useNavigate()

  const handleCardClick = (cardId) => {
    navigate(`/tarot/card/${cardId}`)
  }

  return (
    <div className="min-h-screen py-12 px-4" style={{ backgroundColor: '#1a0d2e', color: '#d9b193' }}>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-4" style={{ color: '#d9b193' }}>Bộ Bài Tarot</h1>
        <p className="text-center mb-12" style={{ color: '#d9b193' }}>
          Khám phá ý nghĩa của từng lá bài tarot
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {tarotCardsData.map((card) => (
            <TarotCard
              key={card.id}
              cardName={card.card_name}
              cardUrl={`/tarot/card/${card.id}`}
              videoUrl={card.video_mp4}
              onCardClick={() => handleCardClick(card.id)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default TarotCardList


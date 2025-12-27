import React, { useState, useEffect } from 'react'
import TarotCardSpread from '@components/tarot/card/TarotCardSpread'
import tarotService from '@utils/tarotService'
import tarotCardsData from '@data/tarot_card.json'

const TarotSpread = () => {
  const [randomCards, setRandomCards] = useState([])

  useEffect(() => {
    // Lấy danh sách id lá bài ngẫu nhiên
    const randomCardIds = tarotService.getRandomCardIds()
    // Filter tarotCardsData dựa trên các id đã chọn
    const selectedCardsData = tarotCardsData.filter(card => randomCardIds.includes(card.id))
    setRandomCards(selectedCardsData)
  }, [])

  return (
    <div className="relative" style={{ backgroundColor: '#1a0d2e', color: '#d9b193', minHeight: '100vh' }}>
      {/* Component xòe bài ở đầu trang */}
      <TarotCardSpread 
        cards={randomCards} 
        cardCount={22}
        cardBackImage="https://tarotoo.com/wp-content/themes/tarotootheme/assets/card-back/card-back-usual.jpg.webp"
      />
    </div>
  )
}

export default TarotSpread


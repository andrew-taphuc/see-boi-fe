import React from 'react'
import TarotCardSpread from '@components/tarot/TarotCardSpread'
import tarotCardsData from '@data/tarot_card.json'

const TarotLoveSimple = () => {
  return (
    <div className="relative" style={{ backgroundColor: '#1a0d2e', color: '#d9b193', minHeight: '100vh' }}>
      {/* Component xòe bài ở đầu trang */}
      <TarotCardSpread 
        cards={tarotCardsData.slice(0, 22)} 
        cardCount={22}
        cardBackImage="https://tarotoo.com/wp-content/themes/tarotootheme/assets/card-back/card-back-usual.jpg.webp"
      />
    </div>
  )
}

export default TarotLoveSimple


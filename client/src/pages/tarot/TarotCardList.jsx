import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import TarotCard from '@components/tarot/card/TarotCard'
import tarotCardsData from '@data/tarot_card.json'
import './TarotCardList.css'

const TarotCardList = () => {
  const navigate = useNavigate()

  const handleCardClick = (cardId) => {
    navigate(`/tarot/card/${cardId}`)
  }

  // Group cards by type
  const cardsByType = useMemo(() => {
    const grouped = {}
    tarotCardsData.forEach((card) => {
      if (!grouped[card.type]) {
        grouped[card.type] = []
      }
      grouped[card.type].push(card)
    })
    return grouped
  }, [])

  // Chunk cards into rows of 3
  const chunkIntoRows = (cards) => {
    const rows = []
    for (let i = 0; i < cards.length; i += 3) {
      rows.push(cards.slice(i, i + 3))
    }
    return rows
  }

  // Type display names
  const typeNames = {
    'Major Arcana': 'Major Arcana',
    'Wands': 'Wands',
    'Cups': 'Cups',
    'Swords': 'Swords',
    'Pentacles': 'Pentacles'
  }

  // Section IDs for navigation
  const sectionIds = {
    'Major Arcana': 'major-arcana',
    'Wands': 'wands',
    'Cups': 'cups',
    'Swords': 'swords',
    'Pentacles': 'pentacles'
  }

  // Handle navigation to section
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const titleElement = element.querySelector('.section-title')
      if (titleElement) {
        const titlePosition = titleElement.getBoundingClientRect().top + window.pageYOffset
        window.scrollTo({
          top: titlePosition - 150,
          behavior: 'smooth'
        })
      } else {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }

  // Get all section types in order
  const sectionTypes = ['Major Arcana', 'Wands', 'Cups', 'Swords', 'Pentacles']

  return (
    <div className="min-h-screen pt-0 pb-12 px-4" style={{ backgroundColor: '#1a0d2e', color: '#d9b193' }}>
      <div className="max-w-7xl mx-auto">
        <h1 className="page-title text-center mb-12" style={{ color: '#ffffff', fontFamily: "'Playfair Display', serif" }}>
          <span className="title-line-1">Ý nghĩa của lá bài Tarot</span>
          <span className="title-line-2">Giải thích ý nghĩa của 78 lá bài cùng video minh họa sống động</span>
        </h1>

        {/* Navigation buttons */}
        <div className="section-navigation mb-12">
          {sectionTypes.map((type) => (
            <button
              key={type}
              onClick={() => scrollToSection(sectionIds[type])}
              className="nav-button"
            >
              {typeNames[type] || type}
            </button>
          ))}
        </div>

        {Object.entries(cardsByType).map(([type, cards]) => (
          <section key={type} id={sectionIds[type]} className="tarot-section mb-16">
            <h2 className="section-title text-3xl font-bold mb-8 text-center" style={{ color: '#d9b193' }}>
              {typeNames[type] || type}
            </h2>
            
            {chunkIntoRows(cards).map((row, rowIndex) => (
              <div key={rowIndex} className="card-row">
                {row.map((card, cardIndex) => {
                  const isMiddle = cardIndex === 1 && row.length === 3
                  return (
                    <div 
                      key={card.id} 
                      className={`card-row-item ${isMiddle ? 'card-middle' : ''}`}
                    >
                      <TarotCard
                        cardName={card.card_name}
                        cardUrl={`/tarot/card/${card.id}`}
                        videoUrl={card.video_mp4}
                        onCardClick={() => handleCardClick(card.id)}
                      />
                    </div>
                  )
                })}
              </div>
            ))}
          </section>
        ))}
      </div>
    </div>
  )
}

export default TarotCardList


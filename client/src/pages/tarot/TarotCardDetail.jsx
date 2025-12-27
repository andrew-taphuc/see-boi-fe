import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import tarotCardsData from '@data/tarot_card.json'
import tarotCardsContent from '@data/tarot_cards_content.json'

const TarotCardDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [card, setCard] = useState(null)
  const [cardContent, setCardContent] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Tìm thẻ bài từ tarot_card.json
    const foundCard = tarotCardsData.find(c => c.id === parseInt(id))
    
    if (foundCard) {
      setCard(foundCard)
      
      // Tìm nội dung HTML từ tarot_cards_content.json
      const foundContent = tarotCardsContent.find(c => c.cardId === parseInt(id))
      
      if (foundContent) {
        setCardContent(foundContent)
      }
    }
    
    setLoading(false)
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen py-12 px-4 flex items-center justify-center" style={{ backgroundColor: '#1a0d2e' }}>
        <div className="text-white text-xl">Đang tải...</div>
      </div>
    )
  }

  if (!card) {
    return (
      <div className="min-h-screen py-12 px-4 flex items-center justify-center" style={{ backgroundColor: '#1a0d2e' }}>
        <div className="text-center">
          <div className="text-white text-xl mb-4">Không tìm thấy thẻ bài</div>
          <button
            onClick={() => navigate('/tarot/card')}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            Quay lại danh sách
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 px-4" style={{ backgroundColor: '#1a0d2e' }}>
      <div className="max-w-4xl mx-auto">
        {/* Header với nút quay lại */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/tarot/card')}
            className="mb-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Quay lại danh sách
          </button>
        </div>

        {/* Video thẻ bài */}
        <div className="mb-8 flex justify-center">
          <div className="relative w-full max-w-md">
            <video 
              className="w-full rounded-lg shadow-2xl" 
              autoPlay 
              muted 
              playsInline 
              loop
            >
              <source type="video/mp4" src={card.video_mp4} />
            </video>
          </div>
        </div>

        {/* Tên thẻ bài */}
        <h1 className="text-4xl font-bold text-center mb-4" style={{ color: '#d9b193' }}>
          {card.card_name}
        </h1>
        
        <div className="text-center mb-8">
          <span className="inline-block px-4 py-2 bg-purple-600/30 text-purple-100 rounded-full text-sm">
            {card.type}
          </span>
        </div>

        {/* Nội dung HTML */}
        {cardContent && cardContent.blocks && (
          <div className="bg-gray-900/50 rounded-lg p-6 md:p-8">
            <style>{`
              .tarot-content p {
                margin-bottom: 1rem;
                line-height: 1.7;
                color: #ffffff;
              }
              .tarot-content p:last-child {
                margin-bottom: 0;
              }
              .tarot-content strong {
                color: #d9b193;
                font-weight: 600;
              }
              .tarot-content ul {
                margin: 1rem 0;
                padding-left: 1.5rem;
                list-style-type: disc;
              }
              .tarot-content li {
                margin-bottom: 0.5rem;
                line-height: 1.7;
                color: #ffffff;
              }
              .tarot-content h3 {
                font-size: 1.5rem;
                font-weight: 700;
                color: #ffffff;
                margin-top: 2rem;
                margin-bottom: 1rem;
              }
              .tarot-content h3:first-child {
                margin-top: 0;
              }
            `}</style>
            <div className="tarot-content">
              {cardContent.blocks.map((block, index) => (
                <div 
                  key={index}
                  dangerouslySetInnerHTML={{ __html: block.html }}
                />
              ))}
            </div>
          </div>
        )}

        {!cardContent && (
          <div className="text-center text-gray-400 py-8">
            Nội dung chi tiết đang được cập nhật...
          </div>
        )}

        {/* Danh sách các lá cùng bộ */}
        {card && (
          <div className="mt-12">
            <h3 className="text-2xl font-semibold mb-4" style={{ color: '#d9b193' }}>
              Các lá khác trong bộ {card.type}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {tarotCardsData
                .filter((c) => c.type === card.type && c.id !== card.id)
                .map((c) => (
                  <Link
                    key={c.id}
                    to={`/tarot/card/${c.id}`}
                    className="w-full px-4 py-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors text-sm"
                    style={{ color: '#d9b193' }}
                  >
                    {c.card_name}
                  </Link>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TarotCardDetail


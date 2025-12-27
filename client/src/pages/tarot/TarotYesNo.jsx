import React, { useState, useEffect } from 'react'
import TarotCardSpread from '@components/tarot/card/TarotCardSpread'
import TarotQuestionModal from '@components/tarot/question/TarotQuestionModal'
import YesNoResult from '@components/tarot/yesNo/YesNoResult'
import tarotService from '@utils/tarotService'
import tarotCardsData from '@data/tarot_card.json'

const TarotYesNo = () => {
  const [showQuestionModal, setShowQuestionModal] = useState(false)
  const [question, setQuestion] = useState('')
  const [selectedCards, setSelectedCards] = useState([]) // Array of {cardName, index} - theo thứ tự chọn
  const [revealedCard, setRevealedCard] = useState(null) // {cardName} - lá bài đã lật đầu tiên
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [randomCards, setRandomCards] = useState([])

  useEffect(() => {
    // Lấy danh sách id lá bài ngẫu nhiên
    const randomCardIds = tarotService.getRandomCardIds()
    // Filter tarotCardsData dựa trên các id đã chọn
    const selectedCardsData = tarotCardsData.filter(card => randomCardIds.includes(card.id))
    setRandomCards(selectedCardsData)
  }, [])

  useEffect(() => {
    // Hiển thị modal sau 1.3 giây khi vào trang
    const timer = setTimeout(() => {
      setShowQuestionModal(true)
    }, 1300)

    return () => clearTimeout(timer)
  }, [])

  // Gọi API khi có question và 1 lá bài được lật
  useEffect(() => {
    const fetchReading = async () => {
      // Chỉ gọi API khi có question, đã chọn 2 lá bài, đã lật 1 lá, chưa loading và chưa có result
      if (!question || selectedCards.length !== 2 || !revealedCard || loading || result) {
        return
      }

      setLoading(true)
      setError(null)

      try {
        // Xác định card1 và card2 dựa trên thứ tự chọn
        const card1 = selectedCards[0].cardName
        const card2 = selectedCards[1].cardName
        
        // Xác định revealedCard là "card1" hay "card2" dựa trên cardName
        const revealedCardIndex = selectedCards.findIndex(
          card => card.cardName === revealedCard.cardName
        )
        const revealedCardPosition = revealedCardIndex === 0 ? 'card1' : 'card2'

        const response = await tarotService.getYesNoReading({
          question: question,
          card1: card1,
          card2: card2,
          revealedCard: revealedCardPosition
        })

        if (response.success && response.data) {
          setResult(response.data)
        } else {
          setError('Không thể nhận được kết quả từ server')
        }
      } catch (err) {
        setError(err.message || 'Có lỗi xảy ra khi gọi API')
        console.error('Error fetching yes/no reading:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchReading()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question, selectedCards, revealedCard])

  const handleQuestionSubmit = (submittedQuestion) => {
    setQuestion(submittedQuestion)
    setShowQuestionModal(false)
  }

  const handleCardSelected = (cardName) => {
    // Track lá bài đã chọn theo thứ tự (card1, card2)
    if (!selectedCards.find(c => c.cardName === cardName)) {
      // Tìm index của card trong tarotCardsData
      const cardIndex = tarotCardsData.findIndex(card => card.card_name === cardName)
      if (cardIndex !== -1) {
        setSelectedCards(prev => [...prev, { cardName, index: cardIndex }])
      }
    }
  }

  const handleCardFlipped = (cardName, cardIndex) => {
    // Khi lá bài được lật, lưu thông tin lá bài đã lật
    // Chỉ lưu lá bài đầu tiên được lật
    if (!revealedCard) {
      setRevealedCard({ cardName })
    }
  }

  const handleCloseResult = () => {
    // Reload trang để reset hoàn toàn
    window.location.reload()
  }

  return (
    <div className="relative" style={{ backgroundColor: '#1a0d2e', color: '#d9b193', minHeight: '100vh' }}>
      {/* Component xòe bài ở đầu trang */}
      <TarotCardSpread 
        cards={randomCards} 
        cardCount={22}
        cardBackImage="https://tarotoo.com/wp-content/themes/tarotootheme/assets/card-back/card-back-usual.jpg.webp"
        maxSelectedCards={2}
        onCardSelected={handleCardSelected}
        onCardFlipped={handleCardFlipped}
      />
      
      {/* Modal nhập câu hỏi */}
      <TarotQuestionModal
        isOpen={showQuestionModal}
        onClose={() => setShowQuestionModal(false)}
        onSubmit={handleQuestionSubmit}
      />

      {/* Loading indicator */}
      {loading && (
        <div 
          className="fixed inset-0 z-1500 flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(4px)' }}
        >
          <div className="text-center">
            <div className="text-2xl text-[#d9b193] mb-4">Đang luận giải...</div>
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#d9b193] mx-auto"></div>
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div 
          className="fixed top-4 left-1/2 transform -translate-x-1/2 z-1500 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg"
        >
          <p>{error}</p>
          <button 
            onClick={() => setError(null)}
            className="mt-2 text-sm underline"
          >
            Đóng
          </button>
        </div>
      )}

      {/* Result modal */}
      {result && (
        <YesNoResult 
          result={result}
          onClose={handleCloseResult}
          cardData={tarotCardsData.find(card => card.card_name === result.revealedCard.name)}
        />
      )}
    </div>
  )
}

export default TarotYesNo


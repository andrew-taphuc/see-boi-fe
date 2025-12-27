import React, { useState, useEffect } from 'react'
import TarotCardSpread from '@components/tarot/card/TarotCardSpread'
import TarotQuestionModal from '@components/tarot/question/TarotQuestionModal'
import OneCardResult from '@components/tarot/oneCard/OneCardResult'
import tarotService from '@utils/tarotService'
import tarotCardsData from '@data/tarot_card.json'

const TarotOneCard = () => {
  const [showQuestionModal, setShowQuestionModal] = useState(false)
  const [question, setQuestion] = useState('')
  const [selectedCardName, setSelectedCardName] = useState(null)
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

  // Gọi API khi có đủ cả question và card
  useEffect(() => {
    const fetchReading = async () => {
      // Chỉ gọi API khi có đủ cả question và card, chưa loading và chưa có result
      if (!question || !selectedCardName || loading || result) {
        return
      }

      setLoading(true)
      setError(null)

      try {
        const response = await tarotService.getOneCardReading({
          question: question,
          card: selectedCardName
        })

        if (response.success && response.data) {
          setResult(response.data)
        } else {
          setError('Không thể nhận được kết quả từ server')
        }
      } catch (err) {
        setError(err.message || 'Có lỗi xảy ra khi gọi API')
        console.error('Error fetching one card reading:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchReading()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question, selectedCardName])

  const handleQuestionSubmit = (submittedQuestion) => {
    setQuestion(submittedQuestion)
    setShowQuestionModal(false)
  }

  const handleCardSelected = (cardName) => {
    setSelectedCardName(cardName)
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
        maxSelectedCards={1}
        onCardSelected={handleCardSelected}
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
        <OneCardResult 
          result={result}
          onClose={handleCloseResult}
          cardData={tarotCardsData.find(card => card.card_name === result.card.name)}
        />
      )}
    </div>
  )
}

export default TarotOneCard


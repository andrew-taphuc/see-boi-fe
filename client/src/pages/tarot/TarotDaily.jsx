import React, { useState, useEffect } from 'react'
import TarotCardSpread from '@components/tarot/card/TarotCardSpread'
import DailyTarotInfoModal from '@components/tarot/daily/DailyTarotInfoModal'
import DailyTarotResult from '@components/tarot/daily/DailyTarotResult'
import tarotService from '@utils/tarotService'
import tarotCardsData from '@data/tarot_card.json'

const TarotDaily = () => {
  const [showInfoModal, setShowInfoModal] = useState(false)
  const [userInfo, setUserInfo] = useState({ name: '', birthday: '' })
  const [selectedCards, setSelectedCards] = useState([]) // Thứ tự chọn
  const [flippedCards, setFlippedCards] = useState([]) // Thứ tự flip (quan trọng)
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
      setShowInfoModal(true)
    }, 1300)

    return () => clearTimeout(timer)
  }, [])

  // Gọi API khi có đủ cả userInfo, đã chọn 3 lá bài VÀ đã flip cả 3 lá
  useEffect(() => {
    const fetchReading = async () => {
      // Chỉ gọi API khi có đủ cả userInfo, đã chọn 3 lá, đã flip 3 lá, chưa loading và chưa có result
      if (!userInfo.name || !userInfo.birthday || selectedCards.length !== 3 || flippedCards.length !== 3 || loading || result) {
        return
      }

      setLoading(true)
      setError(null)

      try {
        // Gửi theo thứ tự flip, không phải thứ tự chọn
        const response = await tarotService.getDailyReading({
          name: userInfo.name,
          birthday: userInfo.birthday,
          card1: flippedCards[0],
          card2: flippedCards[1],
          card3: flippedCards[2]
        })

        if (response.success && response.data) {
          setResult(response.data)
        } else {
          setError('Không thể nhận được kết quả từ server')
        }
      } catch (err) {
        setError(err.message || 'Có lỗi xảy ra khi gọi API')
        console.error('Error fetching daily reading:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchReading()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo.name, userInfo.birthday, selectedCards.length, flippedCards.length])

  const handleInfoSubmit = (info) => {
    setUserInfo(info)
    setShowInfoModal(false)
  }

  const handleCardSelected = (cardName) => {
    // Chỉ thêm card vào selectedCards, không cho phép bỏ chọn
    setSelectedCards(prev => {
      // Nếu card đã được chọn, không làm gì
      if (prev.includes(cardName)) {
        return prev
      }
      // Nếu chưa đủ 3 lá, thêm vào
      if (prev.length < 3) {
        return [...prev, cardName]
      }
      // Nếu đã đủ 3 lá, không thêm nữa
      return prev
    })
  }

  const handleCardFlipped = (cardName) => {
    // Thêm card vào flippedCards theo thứ tự flip
    setFlippedCards(prev => {
      // Nếu card đã được flip, không thêm lại
      if (prev.includes(cardName)) {
        return prev
      }
      // Thêm vào cuối danh sách (theo thứ tự flip)
      return [...prev, cardName]
    })
  }

  const handleCloseResult = () => {
    // Reload trang để reset hoàn toàn
    window.location.reload()
  }

  // Tìm card data từ tarotCardsData
  const getCardsData = () => {
    if (!result || !result.cards) return []
    return [
      tarotCardsData.find(card => card.card_name === result.cards.card1.name),
      tarotCardsData.find(card => card.card_name === result.cards.card2.name),
      tarotCardsData.find(card => card.card_name === result.cards.card3.name)
    ].filter(Boolean)
  }

  return (
    <div className="relative" style={{ backgroundColor: '#1a0d2e', color: '#d9b193', minHeight: '100vh' }}>
      {/* Component xòe bài ở đầu trang */}
      <TarotCardSpread 
        cards={randomCards} 
        cardCount={22}
        cardBackImage="https://tarotoo.com/wp-content/themes/tarotootheme/assets/card-back/card-back-usual.jpg.webp"
        maxSelectedCards={3}
        onCardSelected={handleCardSelected}
        onCardFlipped={handleCardFlipped}
      />
      
      {/* Modal nhập thông tin */}
      <DailyTarotInfoModal
        isOpen={showInfoModal}
        onClose={() => setShowInfoModal(false)}
        onSubmit={handleInfoSubmit}
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
        <DailyTarotResult 
          result={result}
          onClose={handleCloseResult}
          cardsData={getCardsData()}
        />
      )}
    </div>
  )
}

export default TarotDaily


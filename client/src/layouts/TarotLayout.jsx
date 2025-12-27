import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import ThemedHeader from '@components/common/ThemedHeader'
import TarotHeader from '@components/tarot/TarotHeader'
import '@components/tarot/TarotFonts.css'

const TarotLayout = ({ children }) => {
  const location = useLocation()

  // Scroll về đầu trang mỗi khi route thay đổi
  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [location.pathname])

  useEffect(() => {
    // Đặt background cho body và html để tránh lộ nền trắng khi overscroll
    const originalBodyBg = document.body.style.backgroundColor
    const originalHtmlBg = document.documentElement.style.backgroundColor
    const originalBodyOverflow = document.body.style.overflow
    
    document.body.style.backgroundColor = '#1a0d2e'
    document.documentElement.style.backgroundColor = '#1a0d2e'
    document.body.style.overscrollBehavior = 'none'
    document.documentElement.style.overscrollBehavior = 'none'
    
    // Cleanup khi unmount
    return () => {
      document.body.style.backgroundColor = originalBodyBg
      document.documentElement.style.backgroundColor = originalHtmlBg
      document.body.style.overscrollBehavior = ''
      document.documentElement.style.overscrollBehavior = ''
    }
  }, [])

  // Giảm padding khi ở các trang spread (spread, yes-no, love-simple, love-deep, daily, one-card)
  const spreadPages = ['/tarot/spread', '/tarot/yes-no', '/tarot/love-simple', '/tarot/love-deep', '/tarot/daily', '/tarot/one-card'];
  const isSpreadPage = spreadPages.includes(location.pathname);
  const paddingClass = isSpreadPage ? 'pt-16' : 'pt-72 md:pt-80';

  return (
    <div className="min-h-screen tarot-page" style={{ backgroundColor: '#1a0d2e' }}>
      <ThemedHeader variant="tarot" />
      <TarotHeader />
      <div className={paddingClass}>{children}</div>
    </div>
  )
}

export default TarotLayout


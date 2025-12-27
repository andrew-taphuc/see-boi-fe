import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import ThemedHeader from '@components/common/ThemedHeader'
import TarotHeader from '@components/tarot/layout/TarotHeader'
import TarotFooter from '@components/tarot/layout/TarotFooter'
import '@components/tarot/common/TarotFonts.css'

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
  const isHomePage = location.pathname === '/tarot';
  const isLovePage = location.pathname === '/tarot/love';
  const paddingClass = isSpreadPage ? 'pt-16' : isHomePage ? 'pt-68' : isLovePage ? 'pt-30' : 'pt-72 md:pt-80';

  return (
    <div className="min-h-screen tarot-page flex flex-col" style={{ backgroundColor: '#1a0d2e' }}>
      <ThemedHeader variant="tarot" />
      <TarotHeader />
      <div className={`flex-grow ${paddingClass}`}>{children}</div>
      <TarotFooter />
    </div>
  )
}

export default TarotLayout


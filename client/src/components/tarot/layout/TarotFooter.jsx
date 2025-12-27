import React from 'react'
import { Link } from 'react-router-dom'

const TarotFooter = () => {
  return (
    <footer className="tarot-footer" style={{ backgroundColor: '#0f0519', color: '#d9b193' }}>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* CỘT 1: THÔNG TIN CHUNG */}
            <div className="space-y-4">
              <h2 
                className="text-2xl font-bold uppercase tracking-wider"
                style={{ fontFamily: "'Playfair Display', serif", color: '#d9b193' }}
              >
                Tarot
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: '#d9b193', opacity: 0.9 }}>
                Khám phá ý nghĩa của 78 lá bài Tarot và tìm hiểu những thông điệp ẩn chứa trong từng lá bài. 
                Hành trình khám phá bản thân và vận mệnh qua Tarot.
              </p>
            </div>

            {/* CỘT 2: LIÊN KẾT NHANH */}
            <div className="space-y-4">
              <h3 
                className="text-lg font-semibold uppercase tracking-wide"
                style={{ fontFamily: "'Playfair Display', serif", color: '#d9b193' }}
              >
                Liên kết nhanh
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link 
                    to="/tarot" 
                    className="text-sm hover:opacity-80 transition-opacity"
                    style={{ color: '#d9b193' }}
                  >
                    Trang chủ Tarot
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/tarot/card" 
                    className="text-sm hover:opacity-80 transition-opacity"
                    style={{ color: '#d9b193' }}
                  >
                    Danh sách 78 lá bài
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/tarot/spread" 
                    className="text-sm hover:opacity-80 transition-opacity"
                    style={{ color: '#d9b193' }}
                  >
                    Trải bài Tarot
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/tarot/daily" 
                    className="text-sm hover:opacity-80 transition-opacity"
                    style={{ color: '#d9b193' }}
                  >
                    Lá bài hôm nay
                  </Link>
                </li>
              </ul>
            </div>

            {/* CỘT 3: LIÊN HỆ & MẠNG XÃ HỘI */}
            <div className="space-y-4">
              <h3 
                className="text-lg font-semibold uppercase tracking-wide"
                style={{ fontFamily: "'Playfair Display', serif", color: '#d9b193' }}
              >
                Kết nối
              </h3>
              <p className="text-sm" style={{ color: '#d9b193', opacity: 0.9 }}>
                Theo dõi chúng tôi để cập nhật những kiến thức Tarot mới nhất.
              </p>
              <div className="flex gap-4">
                {/* Facebook Button */}
                <div className="relative group">
                  <a
                    href="#"
                    className="w-10 h-10 rounded-full flex items-center justify-center transition-all border-2 relative"
                    style={{ 
                      backgroundColor: 'transparent',
                      borderColor: '#d9b193',
                      color: '#d9b193'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(217, 177, 147, 0.1)'
                      e.currentTarget.style.transform = 'scale(1.1)'
                      e.currentTarget.style.borderColor = '#f0c9a8'
                      e.currentTarget.style.color = '#f0c9a8'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent'
                      e.currentTarget.style.transform = 'scale(1)'
                      e.currentTarget.style.borderColor = '#d9b193'
                      e.currentTarget.style.color = '#d9b193'
                    }}
                    aria-label="Facebook"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                  <span 
                    className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10"
                    style={{ 
                      backgroundColor: '#d9b193',
                      color: '#0f0519',
                      fontFamily: "'Playfair Display', serif"
                    }}
                  >
                    Facebook
                  </span>
                </div>
                {/* Youtube Button */}
                <div className="relative group">
                  <a
                    href="#"
                    className="w-10 h-10 rounded-full flex items-center justify-center transition-all border-2 relative"
                    style={{ 
                      backgroundColor: 'transparent',
                      borderColor: '#d9b193',
                      color: '#d9b193'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(217, 177, 147, 0.1)'
                      e.currentTarget.style.transform = 'scale(1.1)'
                      e.currentTarget.style.borderColor = '#f0c9a8'
                      e.currentTarget.style.color = '#f0c9a8'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent'
                      e.currentTarget.style.transform = 'scale(1)'
                      e.currentTarget.style.borderColor = '#d9b193'
                      e.currentTarget.style.color = '#d9b193'
                    }}
                    aria-label="Youtube"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </a>
                  <span 
                    className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10"
                    style={{ 
                      backgroundColor: '#d9b193',
                      color: '#0f0519',
                      fontFamily: "'Playfair Display', serif"
                    }}
                  >
                    Youtube
                  </span>
                </div>
                {/* Tiktok Button */}
                <div className="relative group">
                  <a
                    href="#"
                    className="w-10 h-10 rounded-full flex items-center justify-center transition-all border-2 relative"
                    style={{ 
                      backgroundColor: 'transparent',
                      borderColor: '#d9b193',
                      color: '#d9b193'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(217, 177, 147, 0.1)'
                      e.currentTarget.style.transform = 'scale(1.1)'
                      e.currentTarget.style.borderColor = '#f0c9a8'
                      e.currentTarget.style.color = '#f0c9a8'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent'
                      e.currentTarget.style.transform = 'scale(1)'
                      e.currentTarget.style.borderColor = '#d9b193'
                      e.currentTarget.style.color = '#d9b193'
                    }}
                    aria-label="TikTok"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                    </svg>
                  </a>
                  <span 
                    className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10"
                    style={{ 
                      backgroundColor: '#d9b193',
                      color: '#0f0519',
                      fontFamily: "'Playfair Display', serif"
                    }}
                  >
                    TikTok
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* BẢN QUYỀN */}
          <div 
            className="border-t pt-6 text-center text-sm"
            style={{ borderColor: '#d9b193', opacity: 0.5 }}
          >
            <p style={{ color: '#d9b193' }}>
              &copy; {new Date().getFullYear()} SEEBOI. Bảo lưu mọi quyền.
            </p>
            <p className="mt-1 text-xs" style={{ color: '#d9b193', opacity: 0.8 }}>
              Thiết kế bởi SEEBOI TEAM
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default TarotFooter


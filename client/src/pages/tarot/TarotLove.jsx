import React from 'react'
import { useNavigate } from 'react-router-dom'

const TarotLove = () => {
  const navigate = useNavigate()
  const cardBackImage = "https://tarotoo.com/wp-content/themes/tarotootheme/assets/card-back/card-back-usual.jpg.webp"

  return (
    <div className="relative flex items-center justify-center min-h-screen" style={{ backgroundColor: '#1a0d2e', color: '#d9b193' }}>
      <div className="max-w-5xl w-full px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-16" style={{ color: '#d9b193', fontFamily: "'Playfair Display', serif" }}>
          Love Tarot Reading
        </h1>
        
        <div className="flex flex-col md:flex-row gap-12 justify-center items-center">
          {/* Simple Love Tarot Button */}
          <button
            onClick={() => navigate('/tarot/love-simple')}
            className="relative group cursor-pointer transition-all duration-300 hover:scale-105"
            style={{ width: '280px', height: '490px' }}
          >
            <div 
              className="w-full h-full rounded-xl overflow-hidden shadow-2xl border-2 transition-all group-hover:shadow-[0_0_30px_rgba(217,177,147,0.5)]"
              style={{ 
                borderColor: '#d9b193',
                backgroundColor: 'rgba(217, 177, 147, 0.05)',
                backdropFilter: 'blur(10px)'
              }}
            >
              {/* Card Image */}
              <div className="w-full h-3/4 relative overflow-hidden">
                <img 
                  src={cardBackImage}
                  alt="Simple Love Tarot"
                  className="w-full h-full object-cover"
                  style={{ transform: 'scale(1.1)' }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#1a0d2e]" />
              </div>
              
              {/* Text Content */}
              <div className="h-1/4 flex flex-col items-center justify-center p-4">
                <h2 
                  className="text-xl font-bold mb-2"
                  style={{ color: '#d9b193', fontFamily: "'Playfair Display', serif" }}
                >
                  Simple Love Tarot
                </h2>
                <p 
                  className="text-xs opacity-80"
                  style={{ color: '#d9b193' }}
                >
                  Quick insights
                </p>
              </div>
            </div>
          </button>

          {/* Deep Love Tarot Button */}
          <button
            onClick={() => navigate('/tarot/love-deep')}
            className="relative group cursor-pointer transition-all duration-300 hover:scale-105"
            style={{ width: '280px', height: '490px' }}
          >
            <div 
              className="w-full h-full rounded-xl overflow-hidden shadow-2xl border-2 transition-all group-hover:shadow-[0_0_30px_rgba(217,177,147,0.5)]"
              style={{ 
                borderColor: '#d9b193',
                backgroundColor: 'rgba(217, 177, 147, 0.05)',
                backdropFilter: 'blur(10px)'
              }}
            >
              {/* Card Image */}
              <div className="w-full h-3/4 relative overflow-hidden">
                <img 
                  src={cardBackImage}
                  alt="Deep Love Tarot"
                  className="w-full h-full object-cover"
                  style={{ transform: 'scale(1.1)' }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#1a0d2e]" />
              </div>
              
              {/* Text Content */}
              <div className="h-1/4 flex flex-col items-center justify-center p-4">
                <h2 
                  className="text-xl font-bold mb-2"
                  style={{ color: '#d9b193', fontFamily: "'Playfair Display', serif" }}
                >
                  Deep Love Tarot
                </h2>
                <p 
                  className="text-xs opacity-80"
                  style={{ color: '#d9b193' }}
                >
                  Comprehensive analysis
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}

export default TarotLove


import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { CalendarDays, Sparkles, Eye } from 'lucide-react'
import ballLogo from '@assets/ball.png'

const navItems = [
  { path: '/tuvi', label: 'Tử Vi', icon: <CalendarDays size={18} /> },
  { path: '/nhantuong', label: 'Nhân Tướng', icon: <Eye size={18} /> },
  { path: '/tarot', label: 'Tarot', icon: <Sparkles size={18} /> },
]

const Header = ({
  onOpenLogin,
  onOpenRegister,
}) => {
  const location = useLocation()
  const config = {
    title: 'See Bói',
    gradient: 'linear-gradient(90deg, #8B6F47, #6B5438)',
    accent: '#F5E6D3',
    textColor: '#ffffff',
    navInactiveColor: '#F5E6D3',
    navActiveBg: 'bg-white/15',
    navHoverBg: 'hover:bg-white/10',
  }

  return (
    <header
      className="fixed top-0 w-full shadow-md"
      style={{ background: config.gradient, color: config.textColor, zIndex: 1500 }}
    >
      <div className="relative flex items-center px-10 h-16">
        {/* Left: Logo + Title */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="relative">
            <div className="absolute inset-0 blur-md rounded-full bg-amber-400/30 animate-pulse" />
            <img src={ballLogo} alt="See Bói Logo" className="h-12 w-auto drop-shadow-lg object-contain relative" />
          </div>
          <Link
            to="/"
            className="flex items-center hover:opacity-80 transition-opacity"
          >
            <span
              className="text-2xl font-semibold"
              style={{ color: config.accent, fontFamily: "'Playfair Display', 'Merriweather', serif", letterSpacing: '0.02em' }}
            >
              {config.title}
            </span>
          </Link>
        </div>

        {/* Center: Navigation */}
        <div className="flex-1 flex justify-center">
          <nav className="flex items-center gap-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  location.pathname === item.path || location.pathname.startsWith(`${item.path}/`)
                    ? `${config.navActiveBg}`
                    : `${config.navHoverBg}`
                }`}
                style={{
                  fontFamily: "'Playfair Display', 'Merriweather', serif",
                  fontWeight: 500,
                  color:
                    location.pathname === item.path || location.pathname.startsWith(`${item.path}/`)
                      ? config.textColor
                      : config.navInactiveColor,
                }}
              >
                {item.icon}
                <span className="whitespace-nowrap">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-5 justify-end flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenLogin}
              className="px-4 py-2 rounded-lg font-medium transition-colors hover:bg-white/10"
              style={{
                fontFamily: "'Playfair Display', 'Merriweather', serif",
                color: config.textColor,
              }}
            >
              Đăng nhập
            </button>
            <button
              onClick={onOpenRegister}
              className="px-4 py-2 rounded-lg font-medium transition-colors bg-white/15 hover:bg-white/20"
              style={{
                fontFamily: "'Playfair Display', 'Merriweather', serif",
                color: config.textColor,
              }}
            >
              Đăng ký
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header

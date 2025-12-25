import React, { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Bell, CalendarDays, Sparkles, Eye, User, Settings, LogOut, HelpCircle } from 'lucide-react'
import { useAuth } from '@context/AuthContext'
import ballLogo from '@assets/ball.png'

const headerConfigs = {
  tarot: {
    title: 'See Bói Tarot',
    gradient: 'linear-gradient(90deg, #2c1a45, #3b235c)',
    accent: '#d9b193',
    bellColor: '#d9b193',
    textColor: '#ffffff',
    navInactiveColor: '#d9b193',
    navActiveBg: 'bg-white/15',
    navHoverBg: 'hover:bg-white/10',
  },
  tuvi: {
    title: 'See Bói Tử Vi',
    gradient: 'linear-gradient(90deg, #3c1f1a, #5a2c24)',
    accent: '#d9b193',
    bellColor: '#d9b193',
    textColor: '#ffffff',
    navInactiveColor: '#d9b193',
    navActiveBg: 'bg-white/15',
    navHoverBg: 'hover:bg-white/10',
  },
  nhantuong: {
    title: 'See Bói Nhân Tướng',
    gradient: 'linear-gradient(90deg, #3b0d0d, #5c1b1b)',
    accent: '#d9b193',
    bellColor: '#d9b193',
    textColor: '#ffffff',
    navInactiveColor: '#d9b193',
    navActiveBg: 'bg-white/15',
    navHoverBg: 'hover:bg-white/10',
  },
  social: {
    title: 'See Bói Social',
    gradient: 'linear-gradient(90deg, #f8fafc, #e5e7eb)',
    accent: '#4b5563',
    bellColor: '#e5e7eb',
    textColor: '#111827',
    navInactiveColor: '#374151',
    navActiveBg: 'bg-gray-200',
    navHoverBg: 'hover:bg-gray-100',
  },
  default: {
    title: 'See Bói',
    gradient: 'linear-gradient(90deg, #2c1a45, #3b235c)',
    accent: '#d9b193',
    bellColor: '#d9b193',
    textColor: '#ffffff',
    navInactiveColor: '#d9b193',
    navActiveBg: 'bg-white/15',
    navHoverBg: 'hover:bg-white/10',
  },
}

const navItems = [
  { path: '/tuvi', label: 'Tử Vi', icon: <CalendarDays size={18} /> },
  { path: '/nhantuong', label: 'Nhân Tướng', icon: <Eye size={18} /> },
  { path: '/tarot', label: 'Tarot', icon: <Sparkles size={18} /> },
]

const ClassicHeader = ({ variant = 'default' }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { currentUser, logout } = useAuth()
  const [isAvatarOpen, setIsAvatarOpen] = useState(false)
  const avatarRef = useRef(null)

  const config = headerConfigs[variant] || headerConfigs.default

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (avatarRef.current && !avatarRef.current.contains(event.target)) {
        setIsAvatarOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header
      className="fixed top-0 w-full z-50 shadow-md"
      style={{ background: config.gradient, color: config.textColor }}
    >
      <div className="flex items-center justify-between px-6 h-14">
        {/* Logo + title (clickable) */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Link
            to="/socialmedia"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <img src={ballLogo} alt="See Bói Logo" className="h-10 w-auto drop-shadow-lg object-contain" />
            <span
              className="text-xl font-semibold"
              style={{ color: config.accent, fontFamily: "'Playfair Display', 'Merriweather', serif", letterSpacing: '0.02em' }}
            >
              {config.title}
            </span>
          </Link>
        </div>

        {/* Nav visible by default */}
        <nav className="flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg font-medium transition-colors border border-white/10 backdrop-blur-sm ${
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
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            aria-label="Thông báo"
            className="relative p-2 rounded-full transition-colors hover:bg-white/10"
            style={{ color: config.bellColor }}
          >
            <Bell size={20} />
          </button>

          {currentUser && (
            <div className="relative" ref={avatarRef}>
              <button
                onClick={() => setIsAvatarOpen(!isAvatarOpen)}
                className="w-9 h-9 rounded-full border-2 border-purple-500 overflow-hidden hover:opacity-80 transition-opacity"
              >
                <div
                  className="w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${currentUser.avatarUrl})` }}
                />
              </button>

              {isAvatarOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                  <div className="p-3 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full border-2 border-purple-500 bg-cover bg-center flex-shrink-0"
                        style={{ backgroundImage: `url(${currentUser.avatarUrl})` }}
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{currentUser.userName}</p>
                        <p className="text-xs text-gray-500 truncate">{currentUser.email}</p>
                      </div>
                    </div>
                  </div>
                  <div className="py-1">
                    <Link
                      to={`/user/${currentUser.id}`}
                      onClick={() => setIsAvatarOpen(false)}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <User size={18} className="text-gray-500" />
                      <span>Trang cá nhân</span>
                    </Link>
                    <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      <Settings size={18} className="text-gray-500" />
                      <span>Cài đặt</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      <HelpCircle size={18} className="text-gray-500" />
                      <span>Trợ giúp</span>
                    </button>
                    <div className="border-t border-gray-200 my-1"></div>
                    <button
                      onClick={() => {
                        logout()
                        setIsAvatarOpen(false)
                        navigate('/')
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={18} />
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default ClassicHeader


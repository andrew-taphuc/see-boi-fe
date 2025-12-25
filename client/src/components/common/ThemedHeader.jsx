import React, { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Bell, CalendarDays, Sparkles, Eye } from 'lucide-react'
import { useAuth } from '@context/AuthContext'
import ballLogo from '@assets/ball.png'
import ProfileDropdown from '@components/common/ProfileDropdown'

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
    title: 'Diễn đàn See Bói',
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

const ThemedHeader = ({ variant = 'default' }) => {
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
      <div className="relative flex items-center px-6 h-14">
        {/* Left text link */}
        <div className="w-1/3 flex">
          <Link
            to="/socialmedia"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity flex-shrink-0"
          >
            <span
              className="text-xl font-semibold"
              style={{ color: config.accent, fontFamily: "'Playfair Display', 'Merriweather', serif", letterSpacing: '0.02em' }}
            >
              {config.title}
            </span>
          </Link>
        </div>

        {/* Center logo with overlay nav (hover trigger) */}
        <div className="w-1/3 flex justify-center relative">
          <div className="group inline-flex items-center justify-center relative">
            <div className="flex items-center justify-center transition-opacity flex-shrink-0 relative z-10 group-hover:opacity-0 group-hover:scale-90 duration-300 select-none pointer-events-none">
            <div className="relative">
              <div className="absolute inset-0 blur-md rounded-full bg-purple-400/40 animate-pulse" />
              <img src={ballLogo} alt="See Bói Logo" className="h-10 w-auto drop-shadow-lg object-contain relative" />
            </div>
          </div>

            <nav
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto transition duration-300 ease-out min-w-[320px] flex justify-center"
            >
              <div className="flex items-center gap-1 bg-black/20 backdrop-blur-md px-3 py-2 rounded-full border border-white/10">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
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
              </div>
            </nav>
          </div>
        </div>

        {/* Right actions */}
        <div className="w-1/3 flex items-center gap-3 justify-end flex-shrink-0">
          <button
            aria-label="Thông báo"
            className="relative p-2 rounded-full transition-colors hover:bg-white/10"
            style={{ color: config.bellColor }}
          >
            <Bell size={20} />
          </button>

          {currentUser && (
            <ProfileDropdown
              user={currentUser}
              accentColor={config.accent}
              onLogout={() => {
                logout()
                navigate('/')
              }}
            />
          )}
        </div>
      </div>
    </header>
  )
}

export default ThemedHeader


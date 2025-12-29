import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Settings, FileText, LogOut, User, HelpCircle, FileEdit } from 'lucide-react'

const ProfileDropdown = ({
  user,
  accentColor = '#d9b193',
  onLogout,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef(null)

  const displayName = user?.userName || user?.fullName || user?.email || 'Người dùng'
  const displayEmail = user?.email || ''
  const avatarUrl = user?.avatarUrl || user?.avatar || ''

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative flex items-center h-full" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-11 h-11 rounded-full border-2 border-purple-500 overflow-hidden hover:opacity-80 transition-opacity flex items-center justify-center"
      >
        <div
          className="w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${avatarUrl})` }}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-85 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
          <div className="p-3 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-full border-2 border-purple-500 bg-cover bg-center shrink-0"
                style={{ backgroundImage: `url(${avatarUrl})` }}
              />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {displayName}
                </p>
                <p className="text-xs text-gray-500 truncate">{displayEmail}</p>
              </div>
            </div>
          </div>

          <div className="py-1">
            <Link
              to={user?.id ? `/user/${user.id}` : "#"}
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <User size={18} className="text-gray-500" />
              <span>Trang cá nhân</span>
            </Link>
            <Link
              to="/drafts"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <FileEdit size={18} className="text-gray-500" />
              <span>Bản nháp</span>
            </Link>
            <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
              <Settings size={18} className="text-gray-500" />
              <span>Cài đặt</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
              <HelpCircle size={18} className="text-gray-500" />
              <span>Trợ giúp</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
              <FileText size={18} className="text-gray-500" />
              <span>Điều khoản</span>
            </button>
            <div className="border-t border-gray-200 my-1"></div>
            <button
              onClick={() => {
                onLogout?.()
                setIsOpen(false)
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
  )
}

export default ProfileDropdown

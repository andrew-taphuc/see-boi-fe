import React from 'react'
import { Outlet } from 'react-router-dom'
import ThemedHeader from '@components/common/ThemedHeader'

const SocialLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <ThemedHeader variant="social" />
      <div className="pt-20">
        {children || <Outlet />}
      </div>
    </div>
  )
}

export default SocialLayout


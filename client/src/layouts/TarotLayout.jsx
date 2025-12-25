import React from 'react'
import ThemedHeader from '@components/common/ThemedHeader'

const TarotLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <ThemedHeader variant="tarot" />
      <div className="pt-16">{children}</div>
    </div>
  )
}

export default TarotLayout


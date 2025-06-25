import React from 'react'
import { generateAdminPhotoUrl, PhotoReference } from '@/lib/utils/photo-utils'

interface PlacePhotoProps {
  photoReferences?: PhotoReference[]
  placeName: string
  maxWidth?: number
  className?: string
  style?: React.CSSProperties
  fallbackText?: string
}

export function PlacePhoto({ 
  photoReferences, 
  placeName, 
  maxWidth = 300, 
  className = '',
  style = {},
  fallbackText = 'No photo'
}: PlacePhotoProps) {
  // Get the first photo reference if available
  const firstPhoto = photoReferences?.[0]

  if (!firstPhoto || !firstPhoto.photo_reference) {
    return (
      <div 
        className={`bg-gray-700 flex items-center justify-center text-gray-400 text-xs ${className}`}
        style={{
          width: '50px',
          height: '50px',
          borderRadius: '4px',
          fontSize: '12px',
          ...style
        }}
      >
        {fallbackText}
      </div>
    )
  }

  const photoUrl = generateAdminPhotoUrl(firstPhoto.photo_reference, maxWidth)

  if (!photoUrl) {
    return (
      <div 
        className={`bg-gray-700 flex items-center justify-center text-gray-400 text-xs ${className}`}
        style={{
          width: '50px',
          height: '50px',
          borderRadius: '4px',
          fontSize: '12px',
          ...style
        }}
      >
        API Key Missing
      </div>
    )
  }

  return (
    <img
      src={photoUrl}
      alt={`Photo of ${placeName}`}
      className={`object-cover ${className}`}
      style={{
        width: '50px',
        height: '50px',
        borderRadius: '4px',
        ...style
      }}
      loading="lazy"
      onError={(e) => {
        // Replace with fallback on error
        const target = e.target as HTMLImageElement
        target.style.display = 'none'
        const fallback = document.createElement('div')
        fallback.className = 'bg-gray-700 flex items-center justify-center text-gray-400 text-xs'
        fallback.style.cssText = `
          width: 50px;
          height: 50px;
          border-radius: 4px;
          font-size: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        `
        fallback.textContent = 'Error'
        target.parentNode?.insertBefore(fallback, target)
      }}
    />
  )
}
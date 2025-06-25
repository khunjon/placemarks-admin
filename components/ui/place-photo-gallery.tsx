import React from 'react'
import { generateAdminPhotoUrl, PhotoReference } from '@/lib/utils/photo-utils'

interface PlacePhotoGalleryProps {
  photoReferences?: PhotoReference[]
  placeName: string
  maxPhotos?: number
  maxWidth?: number
  className?: string
  style?: React.CSSProperties
}

export function PlacePhotoGallery({ 
  photoReferences, 
  placeName, 
  maxPhotos = 5,
  maxWidth = 300,
  className = '',
  style = {}
}: PlacePhotoGalleryProps) {
  if (!photoReferences || photoReferences.length === 0) {
    return (
      <div 
        className={`text-gray-400 text-sm italic ${className}`}
        style={style}
      >
        No photos available
      </div>
    )
  }

  const photosToShow = photoReferences.slice(0, maxPhotos)

  return (
    <div 
      className={`photo-gallery grid gap-2 ${className}`}
      style={{
        gridTemplateColumns: `repeat(${Math.min(photosToShow.length, 3)}, 1fr)`,
        ...style
      }}
    >
      {photosToShow.map((photo, index) => {
        const photoUrl = generateAdminPhotoUrl(photo.photo_reference, maxWidth)
        
        if (!photoUrl) {
          return (
            <div
              key={index}
              className="bg-gray-700 flex items-center justify-center text-gray-400 text-xs"
              style={{
                aspectRatio: '1',
                borderRadius: '4px',
                fontSize: '10px'
              }}
            >
              API Key Missing
            </div>
          )
        }

        return (
          <img
            key={index}
            src={photoUrl}
            alt={`Photo ${index + 1} of ${placeName}`}
            className="place-photo object-cover"
            style={{
              aspectRatio: '1',
              borderRadius: '4px'
            }}
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.style.display = 'none'
              const fallback = document.createElement('div')
              fallback.className = 'bg-gray-700 flex items-center justify-center text-gray-400 text-xs'
              fallback.style.cssText = `
                aspect-ratio: 1;
                border-radius: 4px;
                font-size: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
              `
              fallback.textContent = 'Error'
              target.parentNode?.insertBefore(fallback, target)
            }}
          />
        )
      })}
    </div>
  )
}
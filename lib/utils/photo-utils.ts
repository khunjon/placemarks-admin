/**
 * Utility functions for handling Google Places photos
 */

export interface PhotoReference {
  photo_reference: string
  height: number
  width: number
  html_attributions?: string[]
}

/**
 * Generate a Google Places photo URL using the admin API key
 * @param photoReference - The photo reference string from Google Places API
 * @param maxWidth - Maximum width for the photo (default: 400px)
 * @returns Complete photo URL with admin API key
 */
export function generateAdminPhotoUrl(photoReference: string, maxWidth: number = 400): string {
  // For admin UI, use the public API key (client-side) or server API key (server-side)
  // In admin UI context, we use NEXT_PUBLIC_GOOGLE_PLACES_API_KEY for client-side rendering
  const adminApiKey = typeof window !== 'undefined' 
    ? process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY  // Client-side
    : process.env.GOOGLE_PLACES_API_KEY              // Server-side
  
  if (!adminApiKey) {
    console.warn('⚠️ Google Places API key not found. Photos will not load properly.')
    return ''
  }

  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photo_reference=${photoReference}&key=${adminApiKey}`
}

/**
 * Extract photo references from Google Places API response
 * @param photos - Photos array from Google Places API response
 * @returns Array of photo reference objects
 */
export function extractPhotoReferences(photos: unknown[]): PhotoReference[] {
  if (!photos || !Array.isArray(photos)) {
    return []
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return photos.map((photo: any) => ({
    photo_reference: photo.photo_reference,
    height: photo.height,
    width: photo.width,
    html_attributions: photo.html_attributions || []
  }))
}

/**
 * Check if a photo reference is valid (non-empty string)
 * @param photoReference - The photo reference to validate
 * @returns True if photo reference is valid
 */
export function isValidPhotoReference(photoReference: string): boolean {
  return typeof photoReference === 'string' && photoReference.trim().length > 0
}
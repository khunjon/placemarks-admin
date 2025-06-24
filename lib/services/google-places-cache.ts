import { createClient } from '@/lib/supabase/client'

interface GooglePlacesCacheEntry {
  place_id: string
  name: string
  formatted_address: string
  geometry: {
    location: {
      lat: number
      lng: number
    }
  }
  types: string[]
  rating?: number
  price_level?: number
  photos?: Array<{
    photo_reference: string
    height: number
    width: number
  }>
  cached_at: string
  expires_at: string
}

interface GooglePlaceDetailsCache extends GooglePlacesCacheEntry {
  formatted_phone_number?: string
  website?: string
  opening_hours?: {
    open_now: boolean
    periods: Array<{
      close: { day: number; time: string }
      open: { day: number; time: string }
    }>
    weekday_text: string[]
  }
  reviews?: Array<{
    author_name: string
    rating: number
    text: string
    time: number
  }>
}

export class GooglePlacesCacheService {
  private supabase = createClient()
  private readonly CACHE_DURATION_DAYS = 30

  /**
   * Search for places in cache by text query
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async searchPlacesInCache(query: string, _location?: { lat: number; lng: number }, _radius?: number): Promise<GooglePlacesCacheEntry[]> {
    try {
      console.log(`🔍 [GooglePlacesCache] Searching cache for: "${query}"`)
      
      // Try multiple search patterns for better matching
      const searchTerms = this.getSearchPatterns(query)
      console.log(`🔍 [GooglePlacesCache] Using search patterns:`, searchTerms)
      
      const { data, error } = await this.supabase!
        .from('google_places_cache')
        .select('*')
        .or(searchTerms.join(','))
        .gt('expires_at', new Date().toISOString())
        .order('cached_at', { ascending: false })
        .limit(20)

      if (error) {
        console.error('❌ [GooglePlacesCache] Cache search error:', error)
        return []
      }

      console.log(`✅ [GooglePlacesCache] Found ${data?.length || 0} cached results`)
      return data ?? []
    } catch (error) {
      console.error('❌ [GooglePlacesCache] Unexpected cache search error:', error)
      return []
    }
  }

  /**
   * Generate multiple search patterns for better matching
   */
  private getSearchPatterns(query: string): string[] {
    const patterns = []
    const trimmedQuery = query.trim()
    
    // Pattern 1: Exact query with wildcards
    patterns.push(`name.ilike."%${trimmedQuery}%"`)
    patterns.push(`formatted_address.ilike."%${trimmedQuery}%"`)
    
    // Pattern 2: Individual words for multi-word queries
    const words = trimmedQuery.split(/\s+/).filter(word => word.length > 2)
    if (words.length > 1) {
      words.forEach(word => {
        patterns.push(`name.ilike."%${word}%"`)
      })
    }
    
    return patterns
  }

  /**
   * Get a specific place from cache by place_id
   */
  async getPlaceFromCache(placeId: string): Promise<GooglePlaceDetailsCache | null> {
    console.log(`🔍 [GooglePlacesCache] Looking up place_id: ${placeId}`)
    
    try {
      const { data, error } = await this.supabase!
        .from('google_places_cache')
        .select('*')
        .eq('google_place_id', placeId)
        .gt('expires_at', new Date().toISOString())
        .single()

      if (error) {
        console.log(`📭 [GooglePlacesCache] Place ${placeId} not in cache or expired`)
        return null
      }

      console.log(`✅ [GooglePlacesCache] Found cached place: ${data?.name || 'Unknown'}`)
      return data
    } catch (error) {
      console.error(`❌ [GooglePlacesCache] Error getting place ${placeId}:`, error)
      return null
    }
  }

  /**
   * Cache a place from Google Places API response
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async cachePlaces(places: any[]): Promise<void> {
    if (!places || places.length === 0) return

    try {
      const now = new Date()
      const expiresAt = new Date(now.getTime() + (this.CACHE_DURATION_DAYS * 24 * 60 * 60 * 1000))

      const cacheEntries = places.map(place => ({
        google_place_id: place.place_id,
        place_id: place.place_id,
        name: place.name,
        formatted_address: place.formatted_address || place.vicinity,
        geometry: place.geometry,
        types: place.types || [],
        rating: place.rating,
        price_level: place.price_level,
        photos: place.photos || [],
        cached_at: now.toISOString(),
        expires_at: expiresAt.toISOString()
      }))

      await this.supabase!
        .from('google_places_cache')
        .upsert(cacheEntries, { 
          onConflict: 'google_place_id',
          ignoreDuplicates: false 
        })
    } catch (error) {
      // Silently fail cache operations - log for debugging
      console.log('❌ [Cache] Cache operation failed:', error)
    }
  }

  /**
   * Cache detailed place information
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async cachePlace(place: any): Promise<void> {
    console.log(`💾 [GooglePlacesCache] Caching detailed place: ${place.name}`)

    try {
      const now = new Date()
      const expiresAt = new Date(now.getTime() + (this.CACHE_DURATION_DAYS * 24 * 60 * 60 * 1000))

      const cacheEntry = {
        google_place_id: place.place_id,
        place_id: place.place_id,
        name: place.name,
        formatted_address: place.formatted_address,
        geometry: place.geometry,
        types: place.types || [],
        rating: place.rating,
        price_level: place.price_level,
        photos: place.photos || [],
        formatted_phone_number: place.formatted_phone_number,
        website: place.website,
        opening_hours: place.opening_hours,
        reviews: place.reviews || [],
        cached_at: now.toISOString(),
        expires_at: expiresAt.toISOString()
      }

      const { error } = await this.supabase!
        .from('google_places_cache')
        .upsert(cacheEntry, { 
          onConflict: 'google_place_id',
          ignoreDuplicates: false 
        })

      if (error) {
        console.error('❌ [GooglePlacesCache] Error caching place details:', error)
      } else {
        console.log(`✅ [GooglePlacesCache] Successfully cached place details: ${place.name}`)
      }
    } catch (error) {
      console.error('❌ [GooglePlacesCache] Unexpected error caching place details:', error)
    }
  }

  /**
   * Get cache statistics
   */
  async getCacheStats(): Promise<{ total: number; expired: number; fresh: number }> {
    try {
      const now = new Date().toISOString()

      const [totalResult, expiredResult] = await Promise.all([
        this.supabase!
          .from('google_places_cache')
          .select('place_id', { count: 'exact', head: true }),
        this.supabase!
          .from('google_places_cache')
          .select('place_id', { count: 'exact', head: true })
          .lt('expires_at', now)
      ])

      const total = totalResult.count || 0
      const expired = expiredResult.count || 0
      const fresh = total - expired

      console.log(`📊 [GooglePlacesCache] Cache stats - Total: ${total}, Fresh: ${fresh}, Expired: ${expired}`)
      
      return { total, expired, fresh }
    } catch (error) {
      console.error('❌ [GooglePlacesCache] Error getting cache stats:', error)
      return { total: 0, expired: 0, fresh: 0 }
    }
  }

  /**
   * Clean up expired cache entries
   */
  async cleanupExpiredEntries(): Promise<number> {
    console.log('🧹 [GooglePlacesCache] Cleaning up expired entries')

    try {
      const { data, error } = await this.supabase!
        .from('google_places_cache')
        .delete()
        .lt('expires_at', new Date().toISOString())
        .select('place_id')

      if (error) {
        console.error('❌ [GooglePlacesCache] Error cleaning up expired entries:', error)
        return 0
      }

      const deletedCount = data?.length || 0
      console.log(`✅ [GooglePlacesCache] Cleaned up ${deletedCount} expired entries`)
      return deletedCount
    } catch (error) {
      console.error('❌ [GooglePlacesCache] Unexpected error during cleanup:', error)
      return 0
    }
  }
} 
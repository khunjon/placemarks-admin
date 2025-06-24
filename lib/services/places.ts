import { GooglePlacesCacheService } from './google-places-cache'
import { createClient } from '@/lib/supabase/client'

interface PlaceSearchResult {
  id: string
  name: string
  address: string
  lat?: number
  lng?: number
  rating?: number
  price_level?: number
  place_id?: string
  types?: string[]
  photos?: Array<{
    photo_reference: string
    height: number
    width: number
  }>
}

export class PlacesService {
  private cacheService: GooglePlacesCacheService
  private supabase = createClient()

  constructor() {
    this.cacheService = new GooglePlacesCacheService()
  }

  /**
   * Search for places with caching layer
   */
  async searchPlaces(query: string, location?: { lat: number; lng: number }, radius?: number): Promise<PlaceSearchResult[]> {
    if (!query.trim()) return []

    console.log(`🔍 [PlacesService] Starting search for: "${query}"`)

    // Step 1: Check main places table for recently added places (exact query first)
    const databaseResults = await this.searchPlacesInDatabase(query)
    
    if (databaseResults.length > 0) {
      console.log(`✅ [PlacesService] Found ${databaseResults.length} results in main database`)
      return databaseResults
    }

    // Step 2: Check cache for Google Places results (exact query first)
    const cachedResults = await this.cacheService.searchPlacesInCache(query, location, radius)
    
    if (cachedResults.length > 0) {
      console.log(`✅ [PlacesService] Found ${cachedResults.length} cached results`)
      return this.formatCachedResults(cachedResults)
    }

    // Step 3: Call Google Places API as last resort
    try {
      console.log(`🟢 [Google Places API] Searching for: "${query}"`)
      const apiResults = await this.callGooglePlacesAPI(query, location, radius)
      
      if (apiResults.length > 0) {
        // Cache the results for future use
        await this.cacheService.cachePlaces(apiResults)
      }

      return this.formatAPIResults(apiResults)
    } catch (error) {
      console.error('❌ [Google Places API] Error:', error)
      return this.getMockResults(query) // Fallback to mock data on error
    }
  }

  /**
   * Search for places in the main database table
   */
  private async searchPlacesInDatabase(query: string): Promise<PlaceSearchResult[]> {
    try {
      console.log(`🗄️ [PlacesService] Searching main database for: "${query}"`)
      
      // Use the same flexible search patterns as cache
      const searchTerms = this.getSearchPatterns(query)
      console.log(`🗄️ [PlacesService] Using search patterns:`, searchTerms)
      
      const { data, error } = await this.supabase!
        .from('places')
        .select('*')
        .or(searchTerms.join(','))
        .order('created_at', { ascending: false })
        .limit(20)

      if (error) {
        console.error('❌ [PlacesService] Database search error:', error)
        return []
      }

      console.log(`✅ [PlacesService] Found ${data?.length || 0} database results`)
      return data?.map(place => this.formatDatabaseResult(place)) ?? []
    } catch (error) {
      console.error('❌ [PlacesService] Unexpected database search error:', error)
      return []
    }
  }

  /**
   * Generate multiple search patterns for better matching (same as cache service)
   */
  private getSearchPatterns(query: string): string[] {
    const patterns = []
    const trimmedQuery = query.trim()
    
    // Pattern 1: Exact query with wildcards
    patterns.push(`name.ilike."%${trimmedQuery}%"`)
    patterns.push(`address.ilike."%${trimmedQuery}%"`)
    
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
   * Get detailed place information by place_id
   */
  async getPlaceDetails(placeId: string): Promise<PlaceSearchResult | null> {
    console.log(`🔍 [PlacesService] Getting details for place_id: ${placeId}`)

    // Check cache first
    const cachedPlace = await this.cacheService.getPlaceFromCache(placeId)
    if (cachedPlace) {
      console.log(`✅ [PlacesService] Using cached details for: ${cachedPlace.name}`)
      return this.formatCachedResult(cachedPlace)
    }

    // Call Google Places API for details via our API route

    try {
      console.log(`🟢 [PlacesService] Making Google Places Details API call for: ${placeId}`)
      const placeDetails = await this.callGooglePlaceDetailsAPI(placeId)
      
      if (placeDetails) {
        // Cache the detailed result
        await this.cacheService.cachePlace(placeDetails)
        return this.formatAPIResult(placeDetails)
      }

      return null
    } catch (error) {
      console.error('❌ [PlacesService] Error getting place details:', error)
      return null
    }
  }

  /**
   * Call Google Places Text Search API via our API route
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async callGooglePlacesAPI(query: string, location?: { lat: number; lng: number }, radius?: number): Promise<any[]> {
    const params = new URLSearchParams({
      query
    })

    if (location) {
      params.append('location', `${location.lat},${location.lng}`)
      if (radius) {
        params.append('radius', radius.toString())
      }
    }

    const response = await fetch(`/api/places/search?${params}`)
    
    if (!response.ok) {
      let errorMessage = `HTTP ${response.status} ${response.statusText}`
      try {
        const errorData = await response.json()
        errorMessage = errorData.error || errorMessage
      } catch {
        // If we can't parse the error response, use the HTTP status
      }
      console.error('❌ [Google Places API] Request failed:', {
        status: response.status,
        statusText: response.statusText,
        error: errorMessage,
        url: `/api/places/search?${params}`
      })
      throw new Error(`Places API error: ${errorMessage}`)
    }

    const data = await response.json()
    
    if (data.error) {
      console.error('❌ [Google Places API] API returned error:', data.error)
      throw new Error(`Places API error: ${data.error}`)
    }

    console.log(`✅ [Google Places API] Received ${data.results?.length || 0} results`)
    return data.results || []
  }

  /**
   * Call Google Places Details API (placeholder for future implementation)
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async callGooglePlaceDetailsAPI(placeId: string): Promise<any | null> {
    // TODO: Create API route for place details when needed
    console.log(`⚠️ [PlacesService] Place details API not implemented yet for: ${placeId}`)
    return null
  }

  /**
   * Format cached results for the UI
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private formatCachedResults(cachedResults: any[]): PlaceSearchResult[] {
    return cachedResults.map(place => this.formatCachedResult(place))
  }

  /**
   * Format a single cached result
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private formatCachedResult(place: any): PlaceSearchResult {
    return {
      id: place.place_id,
      name: place.name,
      address: place.formatted_address,
      lat: place.geometry?.location?.lat,
      lng: place.geometry?.location?.lng,
      rating: place.rating,
      price_level: place.price_level,
      place_id: place.place_id,
      types: place.types,
      photos: place.photos
    }
  }

  /**
   * Format a database result
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private formatDatabaseResult(place: any): PlaceSearchResult {
    // Extract coordinates from PostGIS Point if available
    let lat, lng
    if (place.coordinates && typeof place.coordinates === 'object') {
      // PostGIS Point format: {x: lng, y: lat}
      lat = place.coordinates.y
      lng = place.coordinates.x
    }

    return {
      id: place.google_place_id,
      name: place.name,
      address: place.address,
      lat: lat,
      lng: lng,
      rating: undefined, // Not stored in main places table
      price_level: place.price_level,
      place_id: place.google_place_id,
      types: place.google_types,
      photos: [] // Not stored in main places table
    }
  }

  /**
   * Format API results for the UI
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private formatAPIResults(apiResults: any[]): PlaceSearchResult[] {
    return apiResults.map(place => this.formatAPIResult(place))
  }

  /**
   * Format a single API result
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private formatAPIResult(place: any): PlaceSearchResult {
    return {
      id: place.place_id,
      name: place.name,
      address: place.formatted_address || place.vicinity,
      lat: place.geometry?.location?.lat,
      lng: place.geometry?.location?.lng,
      rating: place.rating,
      price_level: place.price_level,
      place_id: place.place_id,
      types: place.types,
      photos: place.photos
    }
  }

  /**
   * Mock results for development/fallback
   */
  private getMockResults(query: string): PlaceSearchResult[] {
    const mockPlaces = [
      { 
        id: 'mock-1', 
        name: 'Gaggan', 
        address: '68/1 Soi Langsuan, Ploenchit Rd, Bangkok 10330',
        place_id: 'ChIJXxxxxxxxxxxxxxxxxxxxxxx1',
        rating: 4.5,
        types: ['restaurant', 'food']
      },
      { 
        id: 'mock-2', 
        name: 'Le Du', 
        address: '399/3 Silom Rd, Bangkok 10500',
        place_id: 'ChIJXxxxxxxxxxxxxxxxxxxxxxx2',
        rating: 4.6,
        types: ['restaurant', 'food']
      },
      { 
        id: 'mock-3', 
        name: 'Sorn', 
        address: '56 Sukhumvit 26, Bangkok 10110',
        place_id: 'ChIJXxxxxxxxxxxxxxxxxxxxxxx3',
        rating: 4.7,
        types: ['restaurant', 'food']
      },
      { 
        id: 'mock-4', 
        name: 'Blue Elephant', 
        address: '233 S Sathorn Rd, Bangkok 10120',
        place_id: 'ChIJXxxxxxxxxxxxxxxxxxxxxxx4',
        rating: 4.3,
        types: ['restaurant', 'food']
      },
      { 
        id: 'mock-5', 
        name: 'Issaya Siamese Club', 
        address: '4 Soi Si Akson, Bangkok 10120',
        place_id: 'ChIJXxxxxxxxxxxxxxxxxxxxxxx5',
        rating: 4.4,
        types: ['restaurant', 'food']
      }
    ]
    
    const filtered = mockPlaces.filter(place => 
      place.name.toLowerCase().includes(query.toLowerCase()) ||
      place.address.toLowerCase().includes(query.toLowerCase())
    )

    console.log(`🎭 [PlacesService] Using ${filtered.length} mock results for "${query}" (development mode)`)
    return filtered
  }

  /**
   * Get cache statistics
   */
  async getCacheStats() {
    return await this.cacheService.getCacheStats()
  }

  /**
   * Clean up expired cache entries
   */
  async cleanupCache() {
    return await this.cacheService.cleanupExpiredEntries()
  }
} 
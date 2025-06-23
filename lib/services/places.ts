import { GooglePlacesCacheService } from './google-places-cache'

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

  constructor() {
    this.cacheService = new GooglePlacesCacheService()
  }

  /**
   * Search for places with caching layer
   */
  async searchPlaces(query: string, location?: { lat: number; lng: number }, radius?: number): Promise<PlaceSearchResult[]> {
    if (!query.trim()) return []

    console.log(`🔍 [PlacesService] Searching for: "${query}"`)

    // First, try to get results from cache
    const cachedResults = await this.cacheService.searchPlacesInCache(query, location, radius)
    
    if (cachedResults.length > 0) {
      console.log(`✅ [PlacesService] Using ${cachedResults.length} cached results for "${query}"`)
      return this.formatCachedResults(cachedResults)
    }

    // If no cache results, call Google Places API via our API route

    try {
      console.log(`🌐 [PlacesService] Making Google Places API call for: "${query}"`)
      const apiResults = await this.callGooglePlacesAPI(query, location, radius)
      
      if (apiResults.length > 0) {
        // Cache the results for future use
        await this.cacheService.cachePlaces(apiResults)
        console.log(`✅ [PlacesService] API returned ${apiResults.length} results, cached for future use`)
      } else {
        console.log(`📭 [PlacesService] No results from Google Places API for: "${query}"`)
      }

      return this.formatAPIResults(apiResults)
    } catch (error) {
      console.error('❌ [PlacesService] Error calling Google Places API:', error)
      return this.getMockResults(query) // Fallback to mock data on error
    }
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
      console.log(`🌐 [PlacesService] Making Google Places Details API call for: ${placeId}`)
      const placeDetails = await this.callGooglePlaceDetailsAPI(placeId)
      
      if (placeDetails) {
        // Cache the detailed result
        await this.cacheService.cachePlace(placeDetails)
        console.log(`✅ [PlacesService] Got place details from API, cached for future use`)
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
      const errorData = await response.json()
      throw new Error(`Places API error: ${response.status} ${errorData.error || response.statusText}`)
    }

    const data = await response.json()
    
    if (data.error) {
      throw new Error(`Places API error: ${data.error}`)
    }

    return data.results || []
  }

  /**
   * Call Google Places Details API (placeholder for future implementation)
   */
  private async callGooglePlaceDetailsAPI(placeId: string): Promise<any | null> {
    // TODO: Create API route for place details when needed
    console.log(`⚠️ [PlacesService] Place details API not implemented yet for: ${placeId}`)
    return null
  }

  /**
   * Format cached results for the UI
   */
  private formatCachedResults(cachedResults: any[]): PlaceSearchResult[] {
    return cachedResults.map(place => this.formatCachedResult(place))
  }

  /**
   * Format a single cached result
   */
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
   * Format API results for the UI
   */
  private formatAPIResults(apiResults: any[]): PlaceSearchResult[] {
    return apiResults.map(place => this.formatAPIResult(place))
  }

  /**
   * Format a single API result
   */
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
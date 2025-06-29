import { createClient } from '@supabase/supabase-js'
import { Database } from '@/lib/database.types'
import { GooglePlacesCacheService } from './google-places-cache'

interface EnhancementResult {
  enhanced: boolean
  error?: string
  fieldsAdded: {
    phone: boolean
    website: boolean
    rating: boolean
    hours: boolean
    photos: boolean
  }
}

interface GooglePlaceDetails {
  place_id: string
  name: string
  formatted_address: string
  geometry: {
    location: {
      lat: number
      lng: number
    }
  }
  formatted_phone_number?: string
  website?: string
  rating?: number
  user_ratings_total?: number
  price_level?: number
  types?: string[]
  business_status?: string
  opening_hours?: {
    open_now?: boolean
    periods?: Array<{
      close: { day: number; time: string }
      open: { day: number; time: string }
    }>
    weekday_text?: string[]
  }
  photos?: Array<{
    photo_reference: string
    height: number
    width: number
  }>
}

export class PlaceEnhancementService {
  private supabase: ReturnType<typeof createClient<Database>> | null
  private cacheService: GooglePlacesCacheService

  constructor() {
    this.cacheService = new GooglePlacesCacheService()
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.warn('⚠️ [PlaceEnhancement] Missing Supabase environment variables. Place enhancement will be disabled.')
      console.warn('⚠️ [PlaceEnhancement] Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_KEY')
      this.supabase = null
      return
    }
    
    // Use service role key for admin operations
    this.supabase = createClient<Database>(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  }

  private checkClient() {
    if (!this.supabase) {
      throw new Error('Supabase client not initialized. Please check environment variables.')
    }
    return this.supabase
  }

  /**
   * Validate that all required environment variables are available
   */
  public validateConfiguration(): { valid: boolean; errors: string[] } {
    const errors: string[] = []
    
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      errors.push('Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
    }
    
    if (!process.env.SUPABASE_SERVICE_KEY) {
      errors.push('Missing SUPABASE_SERVICE_KEY environment variable')
    }
    
    if (!process.env.GOOGLE_PLACES_API_KEY) {
      errors.push('Missing GOOGLE_PLACES_API_KEY environment variable')
    }
    
    return {
      valid: errors.length === 0,
      errors
    }
  }

  /**
   * Check if a place needs enhancement
   * 
   * @param googlePlaceId - The Google Place ID to check
   * @param forcePhotoUpdate - Force check for photo structure issues (string arrays vs object arrays)
   *                          Added during photo migration to detect and fix incorrect photo formats
   * @returns Promise<boolean> - true if the place needs enhancement
   */
  async needsEnhancement(googlePlaceId: string, forcePhotoUpdate = false): Promise<boolean> {
    try {
      const client = this.checkClient()
      const { data: place, error } = await client
        .from('places')
        .select('phone, website, google_rating, hours_open, photo_references')
        .eq('google_place_id', googlePlaceId)
        .single()

      if (error || !place) {
        // If we can't find the place, it needs enhancement
        return true
      }

      // Check for photo structure issue - need to force update if photos are string arrays
      // This detects the migration issue where photo_references were stored as:
      // INCORRECT: ["photo_ref_string1", "photo_ref_string2"] 
      // CORRECT: [{ photo_reference: "...", width: 123, height: 456, html_attributions: [...] }]
      let needsPhotoFix = false
      if (forcePhotoUpdate && place.photo_references) {
        try {
          const photoRefs = Array.isArray(place.photo_references) ? place.photo_references : JSON.parse(JSON.stringify(place.photo_references))
          if (Array.isArray(photoRefs) && photoRefs.length > 0) {
            // Check if first element is a string (old format) instead of object (new format)
            needsPhotoFix = typeof photoRefs[0] === 'string'
          }
        } catch {
          needsPhotoFix = true // If we can't parse, assume it needs fixing
        }
      }

      // A place needs enhancement if ANY of these conditions are true
      const needsEnhancement = (
        !place.phone ||
        !place.website ||
        !place.google_rating ||
        !place.hours_open ||
        !place.photo_references ||
        needsPhotoFix ||
        (typeof place.hours_open === 'object' && place.hours_open && Object.keys(place.hours_open).length === 0)
      )

      return needsEnhancement
    } catch (error) {
      console.error('❌ [PlaceEnhancement] Error checking enhancement needs:', error)
      return true // Default to needing enhancement on error
    }
  }

  /**
   * Enhance a place with Google Places details
   * 
   * @param googlePlaceId - The Google Place ID to enhance
   * @param forcePhotoUpdate - Force photo structure validation and re-enhancement
   *                          Used during migration to fix string array photo format issues
   * @returns Promise<EnhancementResult> - Results including fields that were added/updated
   */
  async enhancePlace(googlePlaceId: string, forcePhotoUpdate = false): Promise<EnhancementResult> {
    const result: EnhancementResult = {
      enhanced: false,
      fieldsAdded: {
        phone: false,
        website: false,
        rating: false,
        hours: false,
        photos: false
      }
    }

    try {
      console.log(`🔍 [PlaceEnhancement] Starting enhancement for place: ${googlePlaceId}${forcePhotoUpdate ? ' (forcing photo update)' : ''}`)

      // Check if enhancement is needed
      const needsUpdate = await this.needsEnhancement(googlePlaceId, forcePhotoUpdate)
      if (!needsUpdate) {
        console.log(`✅ [PlaceEnhancement] Place ${googlePlaceId} already has complete data`)
        result.enhanced = false
        return result
      }

      // Fetch Google Places details
      const placeDetails = await this.fetchGooglePlaceDetails(googlePlaceId)
      if (!placeDetails) {
        result.error = 'Failed to fetch place details from Google Places API'
        return result
      }

      // Update places table
      const updateResult = await this.updatePlaceInDatabase(placeDetails)
      if (!updateResult.success) {
        result.error = updateResult.error
        return result
      }

      // Update cache
      await this.updatePlaceInCache(placeDetails)

      result.enhanced = true
      result.fieldsAdded = updateResult.fieldsAdded

      console.log(`✅ [PlaceEnhancement] Successfully enhanced place ${googlePlaceId}`, {
        fieldsAdded: result.fieldsAdded
      })

      return result
    } catch (error) {
      console.error(`❌ [PlaceEnhancement] Error enhancing place ${googlePlaceId}:`, error)
      result.error = error instanceof Error ? error.message : 'Unknown error'
      return result
    }
  }

  /**
   * Fetch detailed place information from Google Places API
   */
  private async fetchGooglePlaceDetails(googlePlaceId: string): Promise<GooglePlaceDetails | null> {
    try {
      // Build the correct base URL for internal API calls
      let baseUrl = ''
      
      if (process.env.NEXT_PUBLIC_APP_URL) {
        // Production or explicitly set URL
        baseUrl = process.env.NEXT_PUBLIC_APP_URL
      } else if (process.env.NODE_ENV === 'development') {
        // Development - use correct localhost port (Next.js defaults to 3000)
        baseUrl = 'http://localhost:3000'
      } else {
        // Server-side in production - try to determine the base URL from headers or use localhost as fallback
        // In most production environments, we can use localhost for internal API calls
        baseUrl = 'http://localhost:3000'
      }
      
      const apiUrl = `${baseUrl}/api/places/details?place_id=${encodeURIComponent(googlePlaceId)}`
      console.log(`🌐 [PlaceEnhancement] Fetching place details from: ${apiUrl}`)
      
      const response = await fetch(apiUrl)
      
      if (!response.ok) {
        console.error(`❌ [PlaceEnhancement] API call failed: ${response.status} ${response.statusText}`)
        console.error(`❌ [PlaceEnhancement] Failed URL: ${apiUrl}`)
        return null
      }

      const data = await response.json()
      
      if (data.error) {
        console.error('❌ [PlaceEnhancement] API returned error:', data.error)
        if (data.details) {
          console.error('❌ [PlaceEnhancement] Error details:', data.details)
        }
        return null
      }

      if (!data.result) {
        console.error('❌ [PlaceEnhancement] API returned no result data')
        return null
      }

      console.log(`✅ [PlaceEnhancement] Successfully fetched place details for ${googlePlaceId}`)
      return data.result as GooglePlaceDetails
    } catch (error) {
      console.error('❌ [PlaceEnhancement] Error calling Google Places API:', error)
      if (error instanceof Error) {
        console.error('❌ [PlaceEnhancement] Error message:', error.message)
        console.error('❌ [PlaceEnhancement] Error stack:', error.stack)
      }
      return null
    }
  }

  /**
   * Update place in the database
   */
  private async updatePlaceInDatabase(placeDetails: GooglePlaceDetails): Promise<{
    success: boolean
    error?: string
    fieldsAdded: EnhancementResult['fieldsAdded']
  }> {
    try {
      const client = this.checkClient()
      
      // Prepare update data, only including fields that have values
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const updateData: any = {}
      const fieldsAdded: EnhancementResult['fieldsAdded'] = {
        phone: false,
        website: false,
        rating: false,
        hours: false,
        photos: false
      }

      // Phone
      if (placeDetails.formatted_phone_number) {
        updateData.phone = placeDetails.formatted_phone_number
        fieldsAdded.phone = true
      }

      // Website
      if (placeDetails.website && this.isValidWebsite(placeDetails.website)) {
        updateData.website = placeDetails.website
        fieldsAdded.website = true
      }

      // Rating
      if (placeDetails.rating) {
        updateData.google_rating = placeDetails.rating
        fieldsAdded.rating = true
      }

      // Hours
      if (placeDetails.opening_hours && this.isValidHours(placeDetails.opening_hours)) {
        updateData.hours_open = placeDetails.opening_hours
        fieldsAdded.hours = true
      }

      // Photos - Store complete photo objects with metadata
      // IMPORTANT: Store full photo objects, not just reference strings
      // Correct format: [{ photo_reference: "...", width: 123, height: 456, html_attributions: [...] }]
      // This prevents the migration issue that occurred with string arrays: ["ref1", "ref2"]
      if (placeDetails.photos && placeDetails.photos.length > 0) {
        // Store the complete photo objects with metadata, not just the photo_reference strings
        updateData.photo_references = placeDetails.photos
        fieldsAdded.photos = true
      }

      // Only update if we have data to update
      if (Object.keys(updateData).length === 0) {
        console.log(`ℹ️ [PlaceEnhancement] No additional data available for place ${placeDetails.place_id}`)
        return { success: true, fieldsAdded }
      }

      // Perform the update
      const { error } = await client
        .from('places')
        .update(updateData)
        .eq('google_place_id', placeDetails.place_id)

      if (error) {
        console.error(`❌ [PlaceEnhancement] Database update failed:`, error)
        return { success: false, error: error.message, fieldsAdded }
      }

      return { success: true, fieldsAdded }
    } catch (error) {
      console.error(`❌ [PlaceEnhancement] Error updating database:`, error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown database error',
        fieldsAdded: {
          phone: false,
          website: false,
          rating: false,
          hours: false,
          photos: false
        }
      }
    }
  }

  /**
   * Update place in the cache
   */
  private async updatePlaceInCache(placeDetails: GooglePlaceDetails): Promise<void> {
    try {
      await this.cacheService.cachePlace(placeDetails)
    } catch (error) {
      // Cache failures are not critical, just log them
      console.error('⚠️ [PlaceEnhancement] Cache update failed:', error)
    }
  }

  /**
   * Validate website URL
   */
  private isValidWebsite(website: string): boolean {
    try {
      return website.length > 5 && (
        website.startsWith('http://') || 
        website.startsWith('https://') || 
        website.startsWith('www.')
      )
    } catch {
      return false
    }
  }

  /**
   * Validate hours data
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private isValidHours(hours: any): boolean {
    try {
      return hours && 
             typeof hours === 'object' && 
             (hours.weekday_text || hours.periods || hours.open_now !== undefined)
    } catch {
      return false
    }
  }

  /**
   * Fix photo data structure for curated list places
   * 
   * This method was created to resolve a specific migration issue where curated list places
   * had photo_references stored as string arrays instead of proper object arrays with metadata.
   * 
   * Background:
   * - During initial place creation, photos were incorrectly stored as ["ref1", "ref2"]
   * - Should be stored as [{ photo_reference: "ref1", width: 123, height: 456, html_attributions: [...] }]
   * - This caused photos to disappear in curated lists within the app
   * 
   * This method forces re-enhancement with forcePhotoUpdate=true to fix the structure.
   * 
   * @param googlePlaceIds - Array of Google Place IDs that need photo structure fixes
   * @param batchSize - Number of places to process in parallel (default: 3, rate limiting)
   * @param delayMs - Delay between batches in milliseconds (default: 2000ms)
   * @returns Promise with processing results and statistics
   */
  async fixPhotoStructures(googlePlaceIds: string[], batchSize: number = 3, delayMs: number = 2000): Promise<{
    totalProcessed: number
    enhanced: number
    skipped: number
    errors: number
    results: Array<{ placeId: string; result: EnhancementResult }>
  }> {
    const results: Array<{ placeId: string; result: EnhancementResult }> = []
    let enhanced = 0
    let skipped = 0
    let errors = 0

    console.log(`🔧 [PlaceEnhancement] Starting photo structure fix for ${googlePlaceIds.length} places`)

    // Process in batches
    for (let i = 0; i < googlePlaceIds.length; i += batchSize) {
      const batch = googlePlaceIds.slice(i, i + batchSize)
      
      console.log(`🔧 [PlaceEnhancement] Processing photo fix batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(googlePlaceIds.length / batchSize)}`)

      // Process batch in parallel
      const batchPromises = batch.map(async (placeId) => {
        const result = await this.enhancePlace(placeId, true) // Force photo update
        return { placeId, result }
      })

      const batchResults = await Promise.all(batchPromises)
      results.push(...batchResults)

      // Count results
      batchResults.forEach(({ result }) => {
        if (result.error) {
          errors++
        } else if (result.enhanced) {
          enhanced++
        } else {
          skipped++
        }
      })

      // Delay between batches to respect rate limits
      if (i + batchSize < googlePlaceIds.length) {
        await new Promise(resolve => setTimeout(resolve, delayMs))
      }
    }

    console.log(`✅ [PlaceEnhancement] Photo structure fix completed`, {
      totalProcessed: googlePlaceIds.length,
      enhanced,
      skipped,
      errors
    })

    return {
      totalProcessed: googlePlaceIds.length,
      enhanced,
      skipped,
      errors,
      results
    }
  }

  /**
   * Batch enhance multiple places with rate limiting
   */
  async enhancePlaces(googlePlaceIds: string[], batchSize: number = 5, delayMs: number = 1000): Promise<{
    totalProcessed: number
    enhanced: number
    skipped: number
    errors: number
    results: Array<{ placeId: string; result: EnhancementResult }>
  }> {
    const results: Array<{ placeId: string; result: EnhancementResult }> = []
    let enhanced = 0
    let skipped = 0
    let errors = 0

    console.log(`🚀 [PlaceEnhancement] Starting batch enhancement of ${googlePlaceIds.length} places`)

    // Process in batches
    for (let i = 0; i < googlePlaceIds.length; i += batchSize) {
      const batch = googlePlaceIds.slice(i, i + batchSize)
      
      console.log(`📦 [PlaceEnhancement] Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(googlePlaceIds.length / batchSize)}`)

      // Process batch in parallel
      const batchPromises = batch.map(async (placeId) => {
        const result = await this.enhancePlace(placeId)
        return { placeId, result }
      })

      const batchResults = await Promise.all(batchPromises)
      results.push(...batchResults)

      // Count results
      batchResults.forEach(({ result }) => {
        if (result.error) {
          errors++
        } else if (result.enhanced) {
          enhanced++
        } else {
          skipped++
        }
      })

      // Delay between batches to respect rate limits
      if (i + batchSize < googlePlaceIds.length) {
        await new Promise(resolve => setTimeout(resolve, delayMs))
      }
    }

    console.log(`✅ [PlaceEnhancement] Batch enhancement completed`, {
      totalProcessed: googlePlaceIds.length,
      enhanced,
      skipped,
      errors
    })

    return {
      totalProcessed: googlePlaceIds.length,
      enhanced,
      skipped,
      errors,
      results
    }
  }
}

// Export singleton instance
export const placeEnhancement = new PlaceEnhancementService()
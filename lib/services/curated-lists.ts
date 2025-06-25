import { createClient } from '@supabase/supabase-js'
import { Database } from '@/lib/database.types'
import { extractPhotoReferences } from '@/lib/utils/photo-utils'

// Admin service for curated lists operations
class CuratedListsAdminService {
  private supabase: ReturnType<typeof createClient<Database>> | null

  constructor() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY
    
    if (!supabaseUrl || !supabaseServiceKey) {
      // During build time, environment variables may not be available
      // Create a dummy client that will throw meaningful errors at runtime
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

  // Get admin statistics
  async getStats() {
    try {
      const client = this.checkClient()
      const { data, error } = await client.rpc('get_curated_lists_stats')
      return { data: data?.[0] || null, error }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Get unique publisher names
  async getUniquePublishers() {
    try {
      const client = this.checkClient()
      const { data, error } = await client
        .from('lists')
        .select('publisher_name')
        .not('publisher_name', 'is', null)
        .neq('publisher_name', '')
        .order('publisher_name', { ascending: true })
      
      if (error) return { data: null, error }
      
      // Extract unique publisher names and filter out duplicates
      const uniquePublishers = [...new Set(data.map(item => item.publisher_name))]
        .filter(Boolean)
        .sort()
      
      return { data: uniquePublishers, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Get unique location scopes
  async getUniqueLocationScopes() {
    try {
      const client = this.checkClient()
      const { data, error } = await client
        .from('lists')
        .select('location_scope')
        .not('location_scope', 'is', null)
        .neq('location_scope', '')
        .order('location_scope', { ascending: true })
      
      if (error) return { data: null, error }
      
      // Extract unique location scopes and filter out duplicates
      const uniqueLocationScopes = [...new Set(data.map(item => item.location_scope))]
        .filter(Boolean)
        .sort()
      
      return { data: uniqueLocationScopes, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Get all curated lists with optional filtering
  async getCuratedLists(filters?: {
    location_scope?: string | null
    list_type?: string | null
    publisher_name?: string | null
    min_priority?: number | null
  }) {
    try {
      const client = this.checkClient()
      const { data, error } = await client
        .rpc('get_curated_lists', {
          p_location_scope: filters?.location_scope || null,
          p_list_type: filters?.list_type || null,
          p_publisher_name: filters?.publisher_name || null,
          p_min_priority: filters?.min_priority || null,
        })
      
      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Get all lists (both curated and user-created)
  async getAllLists() {
    try {
      const client = this.checkClient()
      const { data, error } = await client
        .from('lists')
        .select('*')
        .order('created_at', { ascending: false })
      
      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Get detailed curated list with places
  async getCuratedListWithPlaces(listId: string) {
    try {
      const client = this.checkClient()
      const { data, error } = await client
        .rpc('get_curated_list_with_places', {
          list_uuid: listId
        })
      
      return { data: data?.[0] || null, error }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Create new curated list
  async createCuratedList(listData: Database['public']['Tables']['lists']['Insert'] & {
    is_curated: true
    type: 'curated'
    user_id: null
  }) {
    try {
      const client = this.checkClient()
      const { data, error } = await client
        .from('lists')
        .insert({
          user_id: null, // Always null for curated lists
          name: listData.name,
          auto_generated: false,
          visibility: listData.visibility || 'public',
          description: listData.description,
          list_type: listData.list_type,
          icon: listData.icon,
          color: listData.color,
          type: 'curated',
          is_default: false,
          is_curated: true,
          publisher_name: listData.publisher_name,
          publisher_logo_url: listData.publisher_logo_url,
          external_link: listData.external_link,
          location_scope: listData.location_scope,
          curator_priority: listData.curator_priority || 0,
        })
        .select()
        .single()

      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Update curated list
  async updateCuratedList(listId: string, updates: Database['public']['Tables']['lists']['Update']) {
    try {
      const client = this.checkClient()
      const { data, error } = await client
        .from('lists')
        .update(updates)
        .eq('id', listId)
        .eq('is_curated', true)
        .select()
        .single()

      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Delete curated list
  async deleteCuratedList(listId: string) {
    try {
      const client = this.checkClient()
      
      // First, delete all associated list_places records to avoid foreign key constraint violations
      const { error: placesError } = await client
        .from('list_places')
        .delete()
        .eq('list_id', listId)

      if (placesError) {
        console.error(`Failed to delete places for list ${listId}:`, placesError)
        return { error: placesError }
      }

      // Then delete the list itself
      const { error: listError } = await client
        .from('lists')
        .delete()
        .eq('id', listId)
        .eq('is_curated', true)

      if (listError) {
        console.error(`Failed to delete list ${listId}:`, listError)
        return { error: listError }
      }

      console.log(`Successfully deleted curated list ${listId} and its associated places`)
      return { error: null }
    } catch (error) {
      console.error(`Unexpected error deleting list ${listId}:`, error)
      return { error }
    }
  }

  // Add place to curated list
  async addPlaceToList(listId: string, placeId: string, notes?: string) {
    try {
      const client = this.checkClient()
      const { data, error } = await client
        .from('list_places')
        .insert({
          list_id: listId,
          place_id: placeId,
          notes,
        })
        .select()

      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Remove place from curated list
  async removePlaceFromList(listId: string, placeId: string) {
    try {
      const client = this.checkClient()
      const { error } = await client
        .from('list_places')
        .delete()
        .eq('list_id', listId)
        .eq('place_id', placeId)

      return { error }
    } catch (error) {
      return { error }
    }
  }

  // Batch update curator priorities
  async updateCuratorPriorities(priorityUpdates: { id: string; priority: number }[]) {
    try {
      const client = this.checkClient()
      const { data, error } = await client
        .rpc('update_curator_priorities', {
          list_priorities: JSON.stringify(priorityUpdates)
        })

      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Get place by Google Place ID
  async getPlaceByGoogleId(googlePlaceId: string) {
    try {
      const client = this.checkClient()
      const { data, error } = await client
        .from('places')
        .select('*')
        .eq('google_place_id', googlePlaceId)
        .single()

      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Search places by location
  async searchNearbyPlaces(lat: number, lng: number, radiusMeters: number = 5000) {
    try {
      const client = this.checkClient()
      const { data, error } = await client
        .rpc('search_places_near_location', {
          lat,
          lng,
          radius_meters: radiusMeters,
        })

      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Create place if it doesn't exist, return existing or new place ID
  async createPlaceIfNotExists(placeData: {
    google_place_id: string
    name: string
    address: string
    lat?: number
    lng?: number
    photos?: unknown[]
  }) {
    try {
      const client = this.checkClient()
      
      // First check if place already exists
      const { data: existingPlace, error: findError } = await client
        .from('places')
        .select('id')
        .eq('google_place_id', placeData.google_place_id)
        .single()
      
      if (!findError && existingPlace) {
        return { data: existingPlace, error: null }
      }

      // Create new place if it doesn't exist
      const coordinates = placeData.lat && placeData.lng 
        ? `POINT(${placeData.lng} ${placeData.lat})`
        : null

      // Extract photo references instead of storing full URLs
      const photoReferences = extractPhotoReferences(placeData.photos || [])

      const { data, error } = await client
        .from('places')
        .insert({
          google_place_id: placeData.google_place_id,
          name: placeData.name,
          address: placeData.address,
          coordinates: coordinates as unknown,
          place_type: 'restaurant', // Default type - primary_type is generated automatically
          photo_references: photoReferences.length > 0 ? photoReferences : null,
          photos_urls: null // Explicitly set to null to avoid storing URLs
        })
        .select('id')
        .single()

      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Update all places for a list (removes existing, adds new ones)
  async updateListPlaces(listId: string, places: Array<{
    id: string // This is the Google Place ID
    name: string
    address: string
    lat?: number
    lng?: number
    photos?: unknown[]
  }>) {
    try {
      const client = this.checkClient()

      // Start a transaction-like operation
      // First, remove all existing places from the list
      const { error: removeError } = await client
        .from('list_places')
        .delete()
        .eq('list_id', listId)

      if (removeError) {
        return { error: removeError }
      }

      // Process each place and add to list
      const results = []
      for (const place of places) {
        // Create place if it doesn't exist
        const { data: placeRecord, error: placeError } = await this.createPlaceIfNotExists({
          google_place_id: place.id,
          name: place.name,
          address: place.address,
          lat: place.lat,
          lng: place.lng,
          photos: place.photos
        })

        if (placeError || !placeRecord) {
          console.error(`Failed to create/find place ${place.name}:`, placeError)
          continue
        }

        // Add place to list
        const { data: listPlaceData, error: listPlaceError } = await client
          .from('list_places')
          .insert({
            list_id: listId,
            place_id: placeRecord.id
          })
          .select()

        if (listPlaceError) {
          console.error(`Failed to add place ${place.name} to list:`, listPlaceError)
          continue
        }

        results.push(listPlaceData)
      }

      return { data: results, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Get places for a specific list
  async getListPlaces(listId: string) {
    try {
      const client = this.checkClient()
      const { data, error } = await client
        .from('list_places')
        .select(`
          place_id,
          added_at,
          notes,
          places (
            id,
            google_place_id,
            name,
            address,
            coordinates
          )
        `)
        .eq('list_id', listId)
        .order('added_at', { ascending: true })

      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  }
}

// Export singleton instance
export const curatedListsAdmin = new CuratedListsAdminService()

// Export types for convenience
export type CuratedList = Database['public']['Tables']['lists']['Row']
export type Place = Database['public']['Tables']['places']['Row']
export type ListPlace = Database['public']['Tables']['list_places']['Row']
export type CuratedListStats = {
  total_curated_lists: number
  total_places_in_curated_lists: number
  publishers_count: number
  location_scopes_count: number
  avg_places_per_list: number
  most_recent_update: string
  total_all_lists?: number
  private_percentage?: number
  public_lists?: number
  private_lists?: number
}
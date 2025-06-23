import { createClient } from '@supabase/supabase-js'
import { Database } from '@/lib/database.types'

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
      const { error } = await client
        .from('lists')
        .delete()
        .eq('id', listId)
        .eq('is_curated', true)

      return { error }
    } catch (error) {
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
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      lists: {
        Row: {
          id: string
          user_id: string | null
          name: string
          auto_generated: boolean
          visibility: 'private' | 'friends' | 'public' | 'curated'
          description: string | null
          list_type: string | null
          icon: string | null
          color: string | null
          type: 'user' | 'auto' | 'curated' | null
          is_default: boolean
          is_curated: boolean
          publisher_name: string | null
          publisher_logo_url: string | null
          external_link: string | null
          location_scope: string | null
          curator_priority: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          name: string
          auto_generated?: boolean
          visibility?: 'private' | 'friends' | 'public' | 'curated'
          description?: string | null
          list_type?: string | null
          icon?: string | null
          color?: string | null
          type?: 'user' | 'auto' | 'curated' | null
          is_default?: boolean
          is_curated?: boolean
          publisher_name?: string | null
          publisher_logo_url?: string | null
          external_link?: string | null
          location_scope?: string | null
          curator_priority?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          name?: string
          auto_generated?: boolean
          visibility?: 'private' | 'friends' | 'public' | 'curated'
          description?: string | null
          list_type?: string | null
          icon?: string | null
          color?: string | null
          type?: 'user' | 'auto' | 'curated' | null
          is_default?: boolean
          is_curated?: boolean
          publisher_name?: string | null
          publisher_logo_url?: string | null
          external_link?: string | null
          location_scope?: string | null
          curator_priority?: number
          created_at?: string
          updated_at?: string
        }
      }
      places: {
        Row: {
          id: string
          google_place_id: string
          name: string
          address: string
          coordinates: unknown // PostGIS Point
          place_type: string | null
          google_types: string[] | null
          primary_type: string | null
          price_level: number | null
          phone: string | null
          website: string | null
          google_rating: number | null
          user_ratings_total: number | null
          hours_open: Json | null
          photo_references: Json | null
          photos_urls: Json | null
          business_status: string | null
          city_context: Json | null
          bangkok_context: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          google_place_id: string
          name: string
          address: string
          coordinates: unknown
          place_type?: string | null
          google_types?: string[] | null
          primary_type?: string | null
          price_level?: number | null
          phone?: string | null
          website?: string | null
          google_rating?: number | null
          user_ratings_total?: number | null
          hours_open?: Json | null
          photo_references?: Json | null
          photos_urls?: Json | null
          business_status?: string | null
          city_context?: Json | null
          bangkok_context?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          google_place_id?: string
          name?: string
          address?: string
          coordinates?: unknown
          place_type?: string | null
          google_types?: string[] | null
          primary_type?: string | null
          price_level?: number | null
          phone?: string | null
          website?: string | null
          google_rating?: number | null
          user_ratings_total?: number | null
          hours_open?: Json | null
          photo_references?: Json | null
          photos_urls?: Json | null
          business_status?: string | null
          city_context?: Json | null
          bangkok_context?: Json | null
          created_at?: string
        }
      }
      list_places: {
        Row: {
          list_id: string
          place_id: string
          added_at: string
          notes: string | null
        }
        Insert: {
          list_id: string
          place_id: string
          added_at?: string
          notes?: string | null
        }
        Update: {
          list_id?: string
          place_id?: string
          added_at?: string
          notes?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_curated_lists: {
        Args: {
          p_location_scope?: string | null
          p_list_type?: string | null
          p_publisher_name?: string | null
          p_min_priority?: number | null
        }
        Returns: Database['public']['Tables']['lists']['Row'][]
      }
      get_curated_list_with_places: {
        Args: {
          list_uuid: string
        }
        Returns: (Database['public']['Tables']['lists']['Row'] & {
          places: Database['public']['Tables']['places']['Row'][]
        })[]
      }
      get_curated_lists_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          total_curated_lists: number
          total_places_in_curated_lists: number
          publishers_count: number
          location_scopes_count: number
          avg_places_per_list: number
          most_recent_update: string
        }[]
      }
      search_places_near_location: {
        Args: {
          lat: number
          lng: number
          radius_meters?: number
        }
        Returns: Database['public']['Tables']['places']['Row'][]
      }
      update_curator_priorities: {
        Args: {
          list_priorities: string
        }
        Returns: void
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
        Database["public"]["Views"])
    ? (Database["public"]["Tables"] &
        Database["public"]["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
    ? Database["public"]["Enums"][PublicEnumNameOrOptions]
    : never

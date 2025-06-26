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
      check_ins: {
        Row: {
          comment: string | null
          companion_type: string | null
          context: Json | null
          created_at: string | null
          id: string
          meal_type: string | null
          notes: string | null
          photos: string[] | null
          place_id: string | null
          rating: string | null
          tags: string[] | null
          timestamp: string | null
          transportation_method: string | null
          updated_at: string | null
          user_id: string | null
          visit_duration: number | null
          weather_context: Json | null
          would_return: boolean | null
        }
        Insert: {
          comment?: string | null
          companion_type?: string | null
          context?: Json | null
          created_at?: string | null
          id?: string
          meal_type?: string | null
          notes?: string | null
          photos?: string[] | null
          place_id?: string | null
          rating?: string | null
          tags?: string[] | null
          timestamp?: string | null
          transportation_method?: string | null
          updated_at?: string | null
          user_id?: string | null
          visit_duration?: number | null
          weather_context?: Json | null
          would_return?: boolean | null
        }
        Update: {
          comment?: string | null
          companion_type?: string | null
          context?: Json | null
          created_at?: string | null
          id?: string
          meal_type?: string | null
          notes?: string | null
          photos?: string[] | null
          place_id?: string | null
          rating?: string | null
          tags?: string[] | null
          timestamp?: string | null
          transportation_method?: string | null
          updated_at?: string | null
          user_id?: string | null
          visit_duration?: number | null
          weather_context?: Json | null
          would_return?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "check_ins_place_id_fkey"
            columns: ["place_id"]
            isOneToOne: false
            referencedRelation: "places"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "check_ins_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      google_places_cache: {
        Row: {
          access_count: number | null
          business_status: string | null
          cached_at: string | null
          created_at: string | null
          current_opening_hours: Json | null
          expires_at: string | null
          formatted_address: string | null
          formatted_phone_number: string | null
          geometry: Json | null
          google_place_id: string
          has_basic_data: boolean | null
          has_contact_data: boolean | null
          has_hours_data: boolean | null
          has_photos_data: boolean | null
          has_reviews_data: boolean | null
          international_phone_number: string | null
          last_accessed: string | null
          name: string | null
          opening_hours: Json | null
          photo_urls: string[] | null
          photos: Json | null
          place_id: string | null
          plus_code: Json | null
          price_level: number | null
          rating: number | null
          reviews: Json | null
          types: string[] | null
          updated_at: string | null
          user_ratings_total: number | null
          website: string | null
        }
        Insert: {
          access_count?: number | null
          business_status?: string | null
          cached_at?: string | null
          created_at?: string | null
          current_opening_hours?: Json | null
          expires_at?: string | null
          formatted_address?: string | null
          formatted_phone_number?: string | null
          geometry?: Json | null
          google_place_id: string
          has_basic_data?: boolean | null
          has_contact_data?: boolean | null
          has_hours_data?: boolean | null
          has_photos_data?: boolean | null
          has_reviews_data?: boolean | null
          international_phone_number?: string | null
          last_accessed?: string | null
          name?: string | null
          opening_hours?: Json | null
          photo_urls?: string[] | null
          photos?: Json | null
          place_id?: string | null
          plus_code?: Json | null
          price_level?: number | null
          rating?: number | null
          reviews?: Json | null
          types?: string[] | null
          updated_at?: string | null
          user_ratings_total?: number | null
          website?: string | null
        }
        Update: {
          access_count?: number | null
          business_status?: string | null
          cached_at?: string | null
          created_at?: string | null
          current_opening_hours?: Json | null
          expires_at?: string | null
          formatted_address?: string | null
          formatted_phone_number?: string | null
          geometry?: Json | null
          google_place_id?: string
          has_basic_data?: boolean | null
          has_contact_data?: boolean | null
          has_hours_data?: boolean | null
          has_photos_data?: boolean | null
          has_reviews_data?: boolean | null
          international_phone_number?: string | null
          last_accessed?: string | null
          name?: string | null
          opening_hours?: Json | null
          photo_urls?: string[] | null
          photos?: Json | null
          place_id?: string | null
          plus_code?: Json | null
          price_level?: number | null
          rating?: number | null
          reviews?: Json | null
          types?: string[] | null
          updated_at?: string | null
          user_ratings_total?: number | null
          website?: string | null
        }
        Relationships: []
      }
      lists: {
        Row: {
          auto_generated: boolean | null
          color: string | null
          created_at: string | null
          curator_priority: number | null
          description: string | null
          external_link: string | null
          icon: string | null
          id: string
          is_curated: boolean | null
          is_default: boolean | null
          list_type: string | null
          location_scope: string | null
          name: string
          publisher_logo_url: string | null
          publisher_name: string | null
          type: string | null
          updated_at: string | null
          user_id: string | null
          visibility: string | null
        }
        Insert: {
          auto_generated?: boolean | null
          color?: string | null
          created_at?: string | null
          curator_priority?: number | null
          description?: string | null
          external_link?: string | null
          icon?: string | null
          id?: string
          is_curated?: boolean | null
          is_default?: boolean | null
          list_type?: string | null
          location_scope?: string | null
          name: string
          publisher_logo_url?: string | null
          publisher_name?: string | null
          type?: string | null
          updated_at?: string | null
          user_id?: string | null
          visibility?: string | null
        }
        Update: {
          auto_generated?: boolean | null
          color?: string | null
          created_at?: string | null
          curator_priority?: number | null
          description?: string | null
          external_link?: string | null
          icon?: string | null
          id?: string
          is_curated?: boolean | null
          is_default?: boolean | null
          list_type?: string | null
          location_scope?: string | null
          name?: string
          publisher_logo_url?: string | null
          publisher_name?: string | null
          type?: string | null
          updated_at?: string | null
          user_id?: string | null
          visibility?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lists_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      places: {
        Row: {
          address: string | null
          bangkok_context: Json | null
          coordinates: unknown | null
          created_at: string | null
          google_place_id: string
          google_rating: number | null
          google_types: string[]
          hours: Json | null
          hours_open: Json | null
          id: string
          name: string
          phone: string | null
          photo_references: Json | null
          photos_urls: string[] | null
          place_type: string | null
          price_level: number | null
          primary_type: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          bangkok_context?: Json | null
          coordinates?: unknown | null
          created_at?: string | null
          google_place_id: string
          google_rating?: number | null
          google_types?: string[]
          hours?: Json | null
          hours_open?: Json | null
          id?: string
          name: string
          phone?: string | null
          photo_references?: Json | null
          photos_urls?: string[] | null
          place_type?: string | null
          price_level?: number | null
          primary_type?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          bangkok_context?: Json | null
          coordinates?: unknown | null
          created_at?: string | null
          google_place_id?: string
          google_rating?: number | null
          google_types?: string[]
          hours?: Json | null
          hours_open?: Json | null
          id?: string
          name?: string
          phone?: string | null
          photo_references?: Json | null
          photos_urls?: string[] | null
          place_type?: string | null
          price_level?: number | null
          primary_type?: string | null
          website?: string | null
        }
        Relationships: []
      }
      list_places: {
        Row: {
          added_at: string | null
          list_id: string
          notes: string | null
          personal_rating: number | null
          place_id: string
          sort_order: number | null
          visit_count: number | null
        }
        Insert: {
          added_at?: string | null
          list_id: string
          notes?: string | null
          personal_rating?: number | null
          place_id: string
          sort_order?: number | null
          visit_count?: number | null
        }
        Update: {
          added_at?: string | null
          list_id?: string
          notes?: string | null
          personal_rating?: number | null
          place_id?: string
          sort_order?: number | null
          visit_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "list_places_list_id_fkey"
            columns: ["list_id"]
            isOneToOne: false
            referencedRelation: "lists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "list_places_place_id_fkey"
            columns: ["place_id"]
            isOneToOne: false
            referencedRelation: "places"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          auth_provider: string
          avatar_url: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          preferences: Json | null
          updated_at: string | null
        }
        Insert: {
          auth_provider?: string
          avatar_url?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          preferences?: Json | null
          updated_at?: string | null
        }
        Update: {
          auth_provider?: string
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          preferences?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_curated_lists: {
        Args: {
          p_location_scope?: string
          p_list_type?: string
          p_publisher_name?: string
          p_min_priority?: number
        }
        Returns: {
          id: string
          name: string
          description: string
          list_type: string
          icon: string
          color: string
          type: string
          visibility: string
          is_curated: boolean
          publisher_name: string
          publisher_logo_url: string
          external_link: string
          location_scope: string
          curator_priority: number
          created_at: string
          updated_at: string
          place_count: number
        }[]
      }
      get_curated_list_with_places: {
        Args: { list_uuid: string }
        Returns: {
          id: string
          name: string
          description: string
          list_type: string
          icon: string
          color: string
          type: string
          visibility: string
          is_curated: boolean
          publisher_name: string
          publisher_logo_url: string
          external_link: string
          location_scope: string
          curator_priority: number
          created_at: string
          updated_at: string
          places: Json
        }[]
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
      upsert_place_with_rich_data: {
        Args: {
          google_place_id_param: string
          name_param: string
          address_param: string
          place_type_param?: string
          google_types_param?: string[]
          primary_type_param?: string
          price_level_param?: number
          bangkok_context_param?: Json
          google_rating_param?: number
          phone_param?: string
          website_param?: string
          hours_open_param?: Json
          photos_urls_param?: string[]
          coordinates_param?: unknown
        }
        Returns: string
      }
      update_curator_priorities: {
        Args: { list_priorities: Json }
        Returns: number
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

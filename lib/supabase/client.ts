import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // During build time or SSR, window might not be available
  if (typeof window === 'undefined') {
    // Return null during server-side rendering to prevent build errors
    return null
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY')
    return null
  }

  // Validate URL format
  try {
    new URL(supabaseUrl)
  } catch {
    console.error('Invalid NEXT_PUBLIC_SUPABASE_URL format')
    return null
  }

  try {
    return createBrowserClient(supabaseUrl, supabaseAnonKey)
  } catch (error) {
    console.error('Failed to create Supabase client:', error)
    return null
  }
}

// Type for the client that can be null
export type SupabaseClient = ReturnType<typeof createBrowserClient> | null 
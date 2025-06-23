import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // During build time or SSR, window might not be available
  if (typeof window === 'undefined') {
    // Return null during server-side rendering to prevent build errors
    return null
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Debug logging to see what we actually have
  console.log('Environment check:')
  console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? 'Present' : 'Missing')
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Present' : 'Missing')
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY')
    console.error('URL value:', supabaseUrl)
    console.error('Key value:', supabaseAnonKey ? 'Present but hidden' : 'Missing')
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
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/lib/database.types'

export const dynamic = 'force-dynamic'

// GET - Get total count of places in the Google cache
export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY
    
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: 'Database configuration not found' }, 
        { status: 500 }
      )
    }
    
    // Use service role key for admin operations
    const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
    
    const { count, error } = await supabase
      .from('google_places_cache')
      .select('*', { count: 'exact', head: true })
    
    if (error) {
      console.error('Failed to fetch cached places count:', error)
      return NextResponse.json(
        { error: 'Failed to fetch cached places count' }, 
        { status: 500 }
      )
    }

    return NextResponse.json({ count: count || 0 })
  } catch (error) {
    console.error('Unexpected error in cached places count GET:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}
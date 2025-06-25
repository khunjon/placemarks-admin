import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/lib/database.types'

export const dynamic = 'force-dynamic'

// GET - Fetch places from the database with optional limit and search
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '15', 10)
    const search = searchParams.get('search')
    
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
    
    let query = supabase
      .from('places')
      .select('*')
      .order('created_at', { ascending: false })
    
    // Add search filter if provided
    if (search && search.trim()) {
      query = query.or(`name.ilike.%${search}%,address.ilike.%${search}%,place_type.ilike.%${search}%`)
    }
    
    // Apply limit (default 15, max 100 for safety)
    const safeLimit = Math.min(Math.max(limit, 1), 100)
    query = query.limit(safeLimit)
    
    const { data, error } = await query
    
    if (error) {
      console.error('Failed to fetch places:', error)
      return NextResponse.json(
        { error: 'Failed to fetch places' }, 
        { status: 500 }
      )
    }

    // Enhance places data with source information
    const placesWithSource = await Promise.all((data || []).map(async (place) => {
      try {
        // Check if place exists in Google cache
        const { data: cacheData } = await supabase
          .from('google_places_cache')
          .select('place_id')
          .eq('place_id', place.google_place_id)
          .single()
        
        return {
          ...place,
          source: cacheData ? 'BOTH' : 'DB'
        }
      } catch {
        // If cache check fails, assume DB only
        return {
          ...place,
          source: 'DB'
        }
      }
    }))

    return NextResponse.json(placesWithSource)
  } catch (error) {
    console.error('Unexpected error in places GET:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}
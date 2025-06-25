import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/lib/database.types'

export const dynamic = 'force-dynamic'

// GET - Fetch place name suggestions for autocomplete
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    
    // Require at least 2 characters for suggestions
    if (!query || query.trim().length < 2) {
      return NextResponse.json([])
    }
    
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
    
    const { data, error } = await supabase
      .from('places')
      .select('name')
      .or(`name.ilike.%${query}%,address.ilike.%${query}%`)
      .order('name')
      .limit(10)
    
    if (error) {
      console.error('Failed to fetch place suggestions:', error)
      return NextResponse.json(
        { error: 'Failed to fetch suggestions' }, 
        { status: 500 }
      )
    }

    // Extract unique place names
    const suggestions = [...new Set(data?.map(place => place.name) || [])]
    
    return NextResponse.json(suggestions)
  } catch (error) {
    console.error('Unexpected error in places suggestions GET:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}
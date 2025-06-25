import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/lib/database.types'

export const dynamic = 'force-dynamic'

// GET - Fetch all places from the database
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
    
    const { data, error } = await supabase
      .from('places')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100) // Limit to prevent overwhelming the UI
    
    if (error) {
      console.error('Failed to fetch places:', error)
      return NextResponse.json(
        { error: 'Failed to fetch places' }, 
        { status: 500 }
      )
    }

    return NextResponse.json(data || [])
  } catch (error) {
    console.error('Unexpected error in places GET:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}
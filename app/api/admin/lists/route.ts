import { NextRequest, NextResponse } from 'next/server'
import { curatedListsAdmin } from '@/lib/services/curated-lists'
import { Database } from '@/lib/database.types'

export const dynamic = 'force-dynamic'

// GET - Fetch curated lists with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const filters = {
      location_scope: searchParams.get('location_scope'),
      list_type: searchParams.get('list_type'),
      publisher_name: searchParams.get('publisher_name'),
      min_priority: searchParams.get('min_priority') ? 
        parseInt(searchParams.get('min_priority')!) : null,
    }

    const { data, error } = await curatedListsAdmin.getCuratedLists(filters)
    
    if (error) {
      console.error('Failed to fetch curated lists:', error)
      return NextResponse.json(
        { error: 'Failed to fetch curated lists' }, 
        { status: 500 }
      )
    }

    return NextResponse.json(data || [])
  } catch (error) {
    console.error('Unexpected error in lists GET:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}

// POST - Create new curated list
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.name || !body.publisher_name) {
      return NextResponse.json(
        { error: 'Name and publisher_name are required' }, 
        { status: 400 }
      )
    }

    const listData = {
      name: body.name,
      description: body.description || null,
      publisher_name: body.publisher_name,
      publisher_logo_url: body.publisher_logo_url || null,
      external_link: body.external_link || null,
      location_scope: body.location_scope || null,
      curator_priority: body.curator_priority || 0,
      list_type: body.list_type || null,
      icon: body.icon || null,
      color: body.color || null,
      visibility: (body.visibility as 'public' | 'curated' | 'private' | 'friends') || 'public',
      is_curated: true,
      type: 'curated' as const,
      user_id: null,
    } satisfies Database['public']['Tables']['lists']['Insert'] & {
      is_curated: true
      type: 'curated'
      user_id: null
    }

    const { data, error } = await curatedListsAdmin.createCuratedList(listData)
    
    if (error) {
      console.error('Failed to create curated list:', error)
      return NextResponse.json(
        { error: 'Failed to create curated list' }, 
        { status: 500 }
      )
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Unexpected error in lists POST:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}
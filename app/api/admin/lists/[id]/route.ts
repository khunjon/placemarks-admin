import { NextRequest, NextResponse } from 'next/server'
import { curatedListsAdmin } from '@/lib/services/curated-lists'

export const dynamic = 'force-dynamic'

// GET - Fetch specific curated list with places
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { data, error } = await curatedListsAdmin.getCuratedListWithPlaces(id)
    
    if (error) {
      console.error('Failed to fetch curated list:', error)
      return NextResponse.json(
        { error: 'Failed to fetch curated list' }, 
        { status: 500 }
      )
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Curated list not found' }, 
        { status: 404 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Unexpected error in list GET:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}

// PUT - Update curated list
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json()
    
    const updates = {
      name: body.name,
      description: body.description,
      publisher_name: body.publisher_name,
      publisher_logo_url: body.publisher_logo_url,
      external_link: body.external_link,
      location_scope: body.location_scope,
      curator_priority: body.curator_priority,
      list_type: body.list_type,
      icon: body.icon,
      color: body.color,
      visibility: body.visibility,
    }

    // Remove undefined values
    Object.keys(updates).forEach(key => {
      if (updates[key as keyof typeof updates] === undefined) {
        delete updates[key as keyof typeof updates]
      }
    })

    const { id } = await params
    const { data, error } = await curatedListsAdmin.updateCuratedList(id, updates)
    
    if (error) {
      console.error('Failed to update curated list:', error)
      return NextResponse.json(
        { error: 'Failed to update curated list' }, 
        { status: 500 }
      )
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Curated list not found' }, 
        { status: 404 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Unexpected error in list PUT:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}

// DELETE - Delete curated list
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { error } = await curatedListsAdmin.deleteCuratedList(id)
    
    if (error) {
      console.error('Failed to delete curated list:', error)
      return NextResponse.json(
        { error: 'Failed to delete curated list' }, 
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true }, { status: 204 })
  } catch (error) {
    console.error('Unexpected error in list DELETE:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}
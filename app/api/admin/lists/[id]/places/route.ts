import { NextRequest, NextResponse } from 'next/server'
import { curatedListsAdmin } from '@/lib/services/curated-lists'

export const dynamic = 'force-dynamic'

// GET - Get places for a specific curated list
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { data, error } = await curatedListsAdmin.getListPlaces(id)
    
    if (error) {
      console.error('Failed to fetch list places:', error)
      return NextResponse.json(
        { error: 'Failed to fetch list places' }, 
        { status: 500 }
      )
    }

    // Transform the data to match the frontend format
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const places = (data || []).map((listPlace: any) => ({
      id: listPlace.places.google_place_id,
      name: listPlace.places.name,
      address: listPlace.places.address,
      lat: listPlace.places.coordinates?.coordinates?.[1], // PostGIS Point format [lng, lat]
      lng: listPlace.places.coordinates?.coordinates?.[0]
    }))

    return NextResponse.json(places)
  } catch (error) {
    console.error('Unexpected error in list places GET:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}
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
    const places = (data || []).map((listPlace: any) => {
      // Handle different PostGIS coordinate formats
      let lat, lng
      if (listPlace.places.coordinates) {
        const coords = listPlace.places.coordinates
        if (coords.coordinates && Array.isArray(coords.coordinates)) {
          // GeoJSON format: {coordinates: [lng, lat]}
          lng = coords.coordinates[0]
          lat = coords.coordinates[1]
        } else if (coords.x !== undefined && coords.y !== undefined) {
          // PostGIS Point format: {x: lng, y: lat}
          lng = coords.x
          lat = coords.y
        }
      }

      return {
        id: listPlace.places.google_place_id,
        name: listPlace.places.name,
        address: listPlace.places.address,
        lat: lat,
        lng: lng
      }
    })

    return NextResponse.json(places)
  } catch (error) {
    console.error('Unexpected error in list places GET:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}
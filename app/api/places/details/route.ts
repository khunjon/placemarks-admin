import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const placeId = searchParams.get('place_id')

  if (!placeId) {
    return NextResponse.json({ error: 'place_id parameter is required' }, { status: 400 })
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY
  if (!apiKey) {
    console.error('❌ [PlaceDetailsAPI] GOOGLE_PLACES_API_KEY not found in environment variables')
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
  }

  try {
    console.log(`🌐 [PlaceDetailsAPI] Fetching details for place: "${placeId}"`)
    
    const baseUrl = 'https://maps.googleapis.com/maps/api/place/details/json'
    const params = new URLSearchParams({
      place_id: placeId,
      key: apiKey,
      fields: 'place_id,name,formatted_address,geometry,photos,rating,price_level,types,formatted_phone_number,website,opening_hours'
    })

    const response = await fetch(`${baseUrl}?${params}`)
    
    if (!response.ok) {
      throw new Error(`Google Places Details API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    
    if (data.status !== 'OK') {
      throw new Error(`Google Places Details API error: ${data.status} - ${data.error_message || 'Unknown error'}`)
    }

    console.log(`✅ [PlaceDetailsAPI] Successfully fetched details for place ${placeId}`)
    
    return NextResponse.json({
      result: data.result,
      status: data.status
    })
  } catch (error) {
    console.error('❌ [PlaceDetailsAPI] Error calling Google Places Details API:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch place details',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
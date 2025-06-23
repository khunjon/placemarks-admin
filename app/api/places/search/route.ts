import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('query')
  const location = searchParams.get('location')
  const radius = searchParams.get('radius')

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 })
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY
  if (!apiKey) {
    console.error('❌ [PlacesAPI] GOOGLE_PLACES_API_KEY not found in environment variables')
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
  }

  try {
    console.log(`🌐 [PlacesAPI] Making Google Places API call for: "${query}"`)
    
    const baseUrl = 'https://maps.googleapis.com/maps/api/place/textsearch/json'
    const params = new URLSearchParams({
      query,
      key: apiKey,
      type: 'restaurant', // Focus on restaurants for this use case
    })

    if (location) {
      params.append('location', location)
      if (radius) {
        params.append('radius', radius)
      }
    }

    const response = await fetch(`${baseUrl}?${params}`)
    
    if (!response.ok) {
      throw new Error(`Google Places API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    
    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      throw new Error(`Google Places API error: ${data.status} - ${data.error_message || 'Unknown error'}`)
    }

    console.log(`✅ [PlacesAPI] Google Places API returned ${data.results?.length || 0} results`)
    
    return NextResponse.json({
      results: data.results || [],
      status: data.status
    })
  } catch (error) {
    console.error('❌ [PlacesAPI] Error calling Google Places API:', error)
    return NextResponse.json({ 
      error: 'Failed to search places',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 
import { NextRequest, NextResponse } from 'next/server'
import { placeEnhancement } from '@/lib/services/place-enhancement'

export const dynamic = 'force-dynamic'

// GET - Check configuration and test basic functionality
export async function GET() {
  try {
    // Validate configuration
    const config = placeEnhancement.validateConfiguration()
    
    if (!config.valid) {
      return NextResponse.json({
        status: 'error',
        message: 'Configuration validation failed',
        errors: config.errors
      }, { status: 500 })
    }

    return NextResponse.json({
      status: 'success',
      message: 'Place enhancement service is properly configured',
      configuration: {
        supabaseConfigured: !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.SUPABASE_SERVICE_KEY,
        googleApiConfigured: !!process.env.GOOGLE_PLACES_API_KEY,
        nodeEnv: process.env.NODE_ENV,
        appUrl: process.env.NEXT_PUBLIC_APP_URL || 'not set'
      }
    })
  } catch (error) {
    console.error('❌ [DebugPlaceEnhancement] Configuration check failed:', error)
    return NextResponse.json({
      status: 'error',
      message: 'Configuration check failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// POST - Test place enhancement for a specific Google Place ID
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { googlePlaceId, forcePhotoUpdate = false } = body

    if (!googlePlaceId) {
      return NextResponse.json({
        status: 'error',
        message: 'googlePlaceId is required'
      }, { status: 400 })
    }

    console.log(`🧪 [DebugPlaceEnhancement] Testing enhancement for place: ${googlePlaceId}`)

    // First check if place needs enhancement
    const needsEnhancement = await placeEnhancement.needsEnhancement(googlePlaceId, forcePhotoUpdate)
    console.log(`🔍 [DebugPlaceEnhancement] Place needs enhancement: ${needsEnhancement}`)

    // Attempt to enhance the place
    const result = await placeEnhancement.enhancePlace(googlePlaceId, forcePhotoUpdate)
    
    return NextResponse.json({
      status: 'success',
      googlePlaceId,
      needsEnhancement,
      enhancementResult: result,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('❌ [DebugPlaceEnhancement] Enhancement test failed:', error)
    return NextResponse.json({
      status: 'error',
      message: 'Enhancement test failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}

// PUT - Test the Google Places API directly (bypassing enhancement logic)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { googlePlaceId } = body

    if (!googlePlaceId) {
      return NextResponse.json({
        status: 'error',
        message: 'googlePlaceId is required'
      }, { status: 400 })
    }

    console.log(`🌐 [DebugPlaceEnhancement] Testing direct Google Places API call for: ${googlePlaceId}`)

    // Make direct API call to our Places Details endpoint
    const apiUrl = `/api/places/details?place_id=${encodeURIComponent(googlePlaceId)}`
    console.log(`🌐 [DebugPlaceEnhancement] Calling: ${apiUrl}`)

    const response = await fetch(`http://localhost:3000${apiUrl}`)
    
    if (!response.ok) {
      throw new Error(`API call failed: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    
    return NextResponse.json({
      status: 'success',
      googlePlaceId,
      apiResponse: data,
      hasResult: !!data.result,
      hasError: !!data.error,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('❌ [DebugPlaceEnhancement] Direct API test failed:', error)
    return NextResponse.json({
      status: 'error',
      message: 'Direct API test failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}
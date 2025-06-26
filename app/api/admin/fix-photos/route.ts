import { NextRequest, NextResponse } from 'next/server'
import { placeEnhancement } from '@/lib/services/place-enhancement'

export const dynamic = 'force-dynamic'

// POST - Fix photo data structure for curated list places
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { googlePlaceIds } = body

    if (!googlePlaceIds || !Array.isArray(googlePlaceIds)) {
      return NextResponse.json(
        { error: 'googlePlaceIds array is required' },
        { status: 400 }
      )
    }

    console.log(`🔧 [PhotoFix] Starting photo structure fix for ${googlePlaceIds.length} places`)

    const result = await placeEnhancement.fixPhotoStructures(googlePlaceIds)

    return NextResponse.json({
      success: true,
      ...result
    })
  } catch (error) {
    console.error('❌ [PhotoFix] Error fixing photo structures:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fix photo structures',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
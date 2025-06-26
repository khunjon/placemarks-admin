import { NextRequest, NextResponse } from 'next/server'
import { placeEnhancement } from '@/lib/services/place-enhancement'

export const dynamic = 'force-dynamic'

/**
 * Photo Structure Fix API Endpoint
 * 
 * This endpoint was created to resolve a specific data migration issue where
 * curated list places had photo_references stored as string arrays instead of
 * the proper object arrays with metadata (width, height, html_attributions).
 * 
 * Purpose:
 * - Batch fix photo data structure issues in curated list places
 * - Force re-enhancement of places to ensure proper photo object format
 * - Maintain consistency between normal and curated list photo handling
 * 
 * When to use:
 * - If photo data structure issues arise again in the future
 * - For migrating places that have incorrect photo reference formats
 * - As a recovery tool if photo enhancements need to be re-run
 * 
 * Expected photo structure:
 * - CORRECT: [{ photo_reference: "...", width: 123, height: 456, html_attributions: [...] }]
 * - INCORRECT: ["photo_reference_string", "another_string"]
 * 
 * @param googlePlaceIds - Array of Google Place IDs to fix
 * @returns Enhancement results with success/error counts
 */
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
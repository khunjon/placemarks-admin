import { NextRequest, NextResponse } from 'next/server'
import { placeEnhancementMigration } from '@/lib/utils/place-enhancement-migration'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    console.log('🔍 [Migration API] Starting place enhancement analysis...')
    
    // Find places that need enhancement
    const placesToEnhance = await placeEnhancementMigration.findPlacesNeedingEnhancement()
    
    return NextResponse.json({
      success: true,
      analysis: {
        totalPlacesNeedingEnhancement: placesToEnhance.length,
        places: placesToEnhance.map(place => ({
          googlePlaceId: place.googlePlaceId,
          name: place.name,
          listName: place.listName,
          needsEnhancement: place.needsEnhancement
        }))
      }
    })
  } catch (error) {
    console.error('❌ [Migration API] Error analyzing places:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to analyze places',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      dryRun = false, 
      batchSize = 5, 
      delayBetweenBatches = 2000 
    } = body

    console.log(`🚀 [Migration API] Starting place enhancement migration`, {
      dryRun,
      batchSize,
      delayBetweenBatches
    })

    // Run the migration
    const report = await placeEnhancementMigration.migrateCuratedListPlaces({
      dryRun,
      batchSize,
      delayBetweenBatches
    })

    // Generate detailed report
    const detailedReport = placeEnhancementMigration.generateMigrationReport(report)

    // If not a dry run, also run validation
    let validation = null
    if (!dryRun) {
      validation = await placeEnhancementMigration.validateEnhancement()
    }

    return NextResponse.json({
      success: true,
      report,
      detailedReport,
      validation
    })
  } catch (error) {
    console.error('❌ [Migration API] Migration failed:', error)
    return NextResponse.json({
      success: false,
      error: 'Migration failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function PUT() {
  try {
    console.log('🔍 [Migration API] Running enhancement validation...')
    
    // Validate current enhancement status
    const validation = await placeEnhancementMigration.validateEnhancement()
    
    const completionRate = validation.totalCuratedListPlaces > 0 
      ? Math.round((validation.placesWithCompleteData / validation.totalCuratedListPlaces) * 100)
      : 0

    return NextResponse.json({
      success: true,
      validation: {
        ...validation,
        completionRate,
        summary: {
          totalPlaces: validation.totalCuratedListPlaces,
          completeData: validation.placesWithCompleteData,
          incompleteData: validation.totalCuratedListPlaces - validation.placesWithCompleteData,
          completionPercentage: completionRate
        }
      }
    })
  } catch (error) {
    console.error('❌ [Migration API] Validation failed:', error)
    return NextResponse.json({
      success: false,
      error: 'Validation failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
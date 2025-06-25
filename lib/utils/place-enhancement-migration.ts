// Migration utility for enhancing existing curated list places
import { placeEnhancement } from '@/lib/services/place-enhancement'
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/lib/database.types'

interface MigrationReport {
  totalCuratedListPlaces: number
  placesNeedingEnhancement: number
  enhanced: number
  skipped: number
  errors: number
  processingTime: number
  placesProcessed: Array<{
    googlePlaceId: string
    name: string
    status: 'enhanced' | 'skipped' | 'error'
    error?: string
    fieldsAdded?: {
      phone: boolean
      website: boolean
      rating: boolean
      hours: boolean
      photos: boolean
    }
  }>
}

export class PlaceEnhancementMigration {
  private supabase: ReturnType<typeof createClient<Database>> | null

  constructor() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY
    
    if (!supabaseUrl || !supabaseServiceKey) {
      this.supabase = null
      return
    }
    
    // Use service role key for admin operations
    this.supabase = createClient<Database>(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  }

  private checkClient() {
    if (!this.supabase) {
      throw new Error('Supabase client not initialized. Please check environment variables.')
    }
    return this.supabase
  }

  /**
   * Find all places in curated lists that need enhancement
   */
  async findPlacesNeedingEnhancement(): Promise<Array<{
    googlePlaceId: string
    name: string
    listName: string
    needsEnhancement: {
      phone: boolean
      website: boolean
      rating: boolean
      hours: boolean
      photos: boolean
    }
  }>> {
    try {
      const client = this.checkClient()
      
      // Query places that are in curated lists
      const { data: placesInCuratedLists, error } = await client
        .from('places')
        .select(`
          id,
          google_place_id,
          name,
          phone,
          website,
          google_rating,
          hours_open,
          photo_references,
          list_places!inner (
            list_id,
            lists!inner (
              name,
              is_curated
            )
          )
        `)
        .eq('list_places.lists.is_curated', true)

      if (error) {
        console.error('❌ [Migration] Error fetching curated list places:', error)
        return []
      }

      if (!placesInCuratedLists) {
        console.log('ℹ️ [Migration] No curated list places found')
        return []
      }

      // Analyze which places need enhancement
      const placesNeedingEnhancement = placesInCuratedLists
        .filter(place => {
          const needsPhone = !place.phone
          const needsWebsite = !place.website
          const needsRating = !place.google_rating
          const needsHours = !place.hours_open || 
                           (typeof place.hours_open === 'object' && 
                            place.hours_open && 
                            Object.keys(place.hours_open).length === 0)
          const needsPhotos = !place.photo_references ||
                            (Array.isArray(place.photo_references) && place.photo_references.length === 0)

          return needsPhone || needsWebsite || needsRating || needsHours || needsPhotos
        })
        .map(place => ({
          googlePlaceId: place.google_place_id,
          name: place.name,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          listName: (place.list_places as any)?.[0]?.lists?.name || 'Unknown List',
          needsEnhancement: {
            phone: !place.phone,
            website: !place.website,
            rating: !place.google_rating,
            hours: !place.hours_open || 
                   (typeof place.hours_open === 'object' && 
                    place.hours_open && 
                    Object.keys(place.hours_open).length === 0),
            photos: !place.photo_references ||
                   (Array.isArray(place.photo_references) && place.photo_references.length === 0)
          }
        }))

      console.log(`🔍 [Migration] Found ${placesNeedingEnhancement.length} places needing enhancement out of ${placesInCuratedLists.length} total curated list places`)

      return placesNeedingEnhancement
    } catch (error) {
      console.error('❌ [Migration] Error in findPlacesNeedingEnhancement:', error)
      return []
    }
  }

  /**
   * Run migration to enhance all places in curated lists
   */
  async migrateCuratedListPlaces(options: {
    batchSize?: number
    delayBetweenBatches?: number
    dryRun?: boolean
  } = {}): Promise<MigrationReport> {
    const startTime = Date.now()
    const { 
      batchSize = 5, 
      delayBetweenBatches = 2000, 
      dryRun = false 
    } = options

    console.log(`🚀 [Migration] Starting curated list places enhancement migration`, {
      batchSize,
      delayBetweenBatches,
      dryRun
    })

    const report: MigrationReport = {
      totalCuratedListPlaces: 0,
      placesNeedingEnhancement: 0,
      enhanced: 0,
      skipped: 0,
      errors: 0,
      processingTime: 0,
      placesProcessed: []
    }

    try {
      // Find places that need enhancement
      const placesToEnhance = await this.findPlacesNeedingEnhancement()
      
      report.placesNeedingEnhancement = placesToEnhance.length
      
      if (placesToEnhance.length === 0) {
        console.log('✅ [Migration] No places need enhancement!')
        report.processingTime = Date.now() - startTime
        return report
      }

      if (dryRun) {
        console.log(`🔍 [Migration] DRY RUN - Would enhance ${placesToEnhance.length} places:`)
        placesToEnhance.forEach(place => {
          console.log(`  - ${place.name} (${place.googlePlaceId}) from "${place.listName}"`)
          console.log(`    Needs: ${Object.entries(place.needsEnhancement)
            .filter(([, needed]) => needed)
            .map(([field]) => field)
            .join(', ')}`)
        })
        report.processingTime = Date.now() - startTime
        return report
      }

      // Extract Google Place IDs for batch processing
      const googlePlaceIds = placesToEnhance.map(place => place.googlePlaceId)

      // Use the PlaceEnhancementService for batch processing
      const batchResult = await placeEnhancement.enhancePlaces(
        googlePlaceIds,
        batchSize,
        delayBetweenBatches
      )

      // Process results and create detailed report
      report.enhanced = batchResult.enhanced
      report.skipped = batchResult.skipped
      report.errors = batchResult.errors

      report.placesProcessed = batchResult.results.map(({ placeId, result }) => {
        const originalPlace = placesToEnhance.find(p => p.googlePlaceId === placeId)
        
        return {
          googlePlaceId: placeId,
          name: originalPlace?.name || 'Unknown',
          status: result.error ? 'error' : (result.enhanced ? 'enhanced' : 'skipped'),
          error: result.error,
          fieldsAdded: result.fieldsAdded
        }
      })

      report.processingTime = Date.now() - startTime

      console.log(`✅ [Migration] Migration completed!`, {
        totalProcessed: batchResult.totalProcessed,
        enhanced: report.enhanced,
        skipped: report.skipped,
        errors: report.errors,
        processingTimeMinutes: Math.round(report.processingTime / 1000 / 60 * 10) / 10
      })

      return report
    } catch (error) {
      console.error('❌ [Migration] Migration failed:', error)
      report.processingTime = Date.now() - startTime
      return report
    }
  }

  /**
   * Generate a detailed migration report
   */
  generateMigrationReport(report: MigrationReport): string {
    const successRate = report.placesNeedingEnhancement > 0 
      ? Math.round((report.enhanced / report.placesNeedingEnhancement) * 100) 
      : 0

    let reportText = `
# Curated List Places Enhancement Migration Report

## Summary
- **Total Places Needing Enhancement**: ${report.placesNeedingEnhancement}
- **Successfully Enhanced**: ${report.enhanced}
- **Skipped (Already Complete)**: ${report.skipped}
- **Errors**: ${report.errors}
- **Success Rate**: ${successRate}%
- **Processing Time**: ${Math.round(report.processingTime / 1000)} seconds

## Enhancement Details
`

    // Group by status
    const enhanced = report.placesProcessed.filter(p => p.status === 'enhanced')
    const skipped = report.placesProcessed.filter(p => p.status === 'skipped')
    const errors = report.placesProcessed.filter(p => p.status === 'error')

    if (enhanced.length > 0) {
      reportText += `\n### Successfully Enhanced Places (${enhanced.length})\n`
      enhanced.forEach(place => {
        const fieldsAdded = Object.entries(place.fieldsAdded || {})
          .filter(([, added]) => added)
          .map(([field]) => field)
          .join(', ')
        reportText += `- **${place.name}** (${place.googlePlaceId})\n`
        if (fieldsAdded) {
          reportText += `  - Fields added: ${fieldsAdded}\n`
        }
      })
    }

    if (errors.length > 0) {
      reportText += `\n### Places with Errors (${errors.length})\n`
      errors.forEach(place => {
        reportText += `- **${place.name}** (${place.googlePlaceId})\n`
        reportText += `  - Error: ${place.error}\n`
      })
    }

    if (skipped.length > 0) {
      reportText += `\n### Skipped Places (${skipped.length})\n`
      skipped.forEach(place => {
        reportText += `- **${place.name}** (${place.googlePlaceId}) - Already has complete data\n`
      })
    }

    reportText += `\n## Recommendations\n`
    
    if (report.errors > 0) {
      reportText += `- Review and retry the ${report.errors} places that failed enhancement\n`
    }
    
    if (successRate < 90) {
      reportText += `- Consider investigating why ${100 - successRate}% of places couldn't be enhanced\n`
    }
    
    reportText += `- Run validation queries to verify enhancement success\n`
    reportText += `- Monitor mobile app to confirm "Quick Info" sections now display complete data\n`

    return reportText
  }

  /**
   * Validate enhancement results
   */
  async validateEnhancement(): Promise<{
    totalCuratedListPlaces: number
    placesWithCompleteData: number
    incompleteFields: Record<string, number>
  }> {
    try {
      const client = this.checkClient()
      
      const { data: places, error } = await client
        .from('places')
        .select(`
          google_place_id,
          name,
          phone,
          website,
          google_rating,
          hours_open,
          photo_references,
          list_places!inner (
            lists!inner (
              is_curated
            )
          )
        `)
        .eq('list_places.lists.is_curated', true)

      if (error || !places) {
        console.error('❌ [Migration] Validation query failed:', error)
        return { totalCuratedListPlaces: 0, placesWithCompleteData: 0, incompleteFields: {} }
      }

      const incompleteFields: Record<string, number> = {
        phone: 0,
        website: 0,
        rating: 0,
        hours: 0,
        photos: 0
      }

      let placesWithCompleteData = 0

      places.forEach(place => {
        let isComplete = true

        if (!place.phone) {
          incompleteFields.phone++
          isComplete = false
        }
        if (!place.website) {
          incompleteFields.website++
          isComplete = false
        }
        if (!place.google_rating) {
          incompleteFields.rating++
          isComplete = false
        }
        if (!place.hours_open || (typeof place.hours_open === 'object' && Object.keys(place.hours_open || {}).length === 0)) {
          incompleteFields.hours++
          isComplete = false
        }
        if (!place.photo_references || (Array.isArray(place.photo_references) && place.photo_references.length === 0)) {
          incompleteFields.photos++
          isComplete = false
        }

        if (isComplete) {
          placesWithCompleteData++
        }
      })

      return {
        totalCuratedListPlaces: places.length,
        placesWithCompleteData,
        incompleteFields
      }
    } catch (error) {
      console.error('❌ [Migration] Validation failed:', error)
      return { totalCuratedListPlaces: 0, placesWithCompleteData: 0, incompleteFields: {} }
    }
  }
}

// Export singleton instance
export const placeEnhancementMigration = new PlaceEnhancementMigration()
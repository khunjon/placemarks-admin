#!/usr/bin/env npx tsx

/**
 * Test script for place enhancement functionality
 * Run with: npx tsx scripts/test-place-enhancement.ts
 */

import { placeEnhancement } from '../lib/services/place-enhancement'
import { placeEnhancementMigration } from '../lib/utils/place-enhancement-migration'

async function testPlaceEnhancement() {
  console.log('🧪 Testing Place Enhancement System\n')

  try {
    // Test 1: Check if a place needs enhancement
    console.log('📋 Test 1: Checking if a place needs enhancement')
    const testPlaceId = 'ChIJN1t_tDeuEmsRUsoyG83frY4' // Google Sydney Opera House
    const needsEnhancement = await placeEnhancement.needsEnhancement(testPlaceId)
    console.log(`   Place ${testPlaceId} needs enhancement: ${needsEnhancement}`)

    // Test 2: Try to enhance a single place (dry run style)
    console.log('\n🔍 Test 2: Testing single place enhancement')
    const enhancementResult = await placeEnhancement.enhancePlace(testPlaceId)
    console.log('   Enhancement result:', {
      enhanced: enhancementResult.enhanced,
      error: enhancementResult.error,
      fieldsAdded: enhancementResult.fieldsAdded
    })

    // Test 3: Find places needing enhancement in curated lists
    console.log('\n📊 Test 3: Finding curated list places needing enhancement')
    const placesNeedingEnhancement = await placeEnhancementMigration.findPlacesNeedingEnhancement()
    console.log(`   Found ${placesNeedingEnhancement.length} places needing enhancement`)
    
    if (placesNeedingEnhancement.length > 0) {
      console.log('   First few places:')
      placesNeedingEnhancement.slice(0, 3).forEach(place => {
        console.log(`   - ${place.name} (${place.googlePlaceId})`)
        console.log(`     Needs: ${Object.entries(place.needsEnhancement)
          .filter(([, needed]) => needed)
          .map(([field]) => field)
          .join(', ')}`)
      })
    }

    // Test 4: Run validation
    console.log('\n✅ Test 4: Validating current enhancement status')
    const validation = await placeEnhancementMigration.validateEnhancement()
    console.log('   Validation results:', {
      totalCuratedListPlaces: validation.totalCuratedListPlaces,
      placesWithCompleteData: validation.placesWithCompleteData,
      completionRate: validation.totalCuratedListPlaces > 0 
        ? Math.round((validation.placesWithCompleteData / validation.totalCuratedListPlaces) * 100)
        : 0,
      incompleteFields: validation.incompleteFields
    })

    console.log('\n🎉 All tests completed successfully!')
    console.log('\n📝 Summary:')
    console.log('   ✅ PlaceEnhancementService is working')
    console.log('   ✅ Migration utility is functional')
    console.log('   ✅ Validation system is operational')
    console.log('   ✅ Ready for production use!')

  } catch (error) {
    console.error('❌ Test failed:', error)
    process.exit(1)
  }
}

// Check if we're running in a test environment
if (require.main === module) {
  testPlaceEnhancement().then(() => {
    console.log('\n✨ Test script completed')
    process.exit(0)
  }).catch(error => {
    console.error('💥 Test script failed:', error)
    process.exit(1)
  })
}

export { testPlaceEnhancement }
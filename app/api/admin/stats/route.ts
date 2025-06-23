import { NextResponse } from 'next/server'
import { curatedListsAdmin, CuratedList } from '@/lib/services/curated-lists'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const { data: stats, error } = await curatedListsAdmin.getStats()
    
    if (error) {
      console.error('Failed to fetch stats:', error)
      return NextResponse.json(
        { error: 'Failed to fetch statistics' }, 
        { status: 500 }
      )
    }

    // If no stats function exists yet, return basic counts
    if (!stats) {
      // Fallback: get counts for curated lists and all lists
      const [curatedResult, allListsResult] = await Promise.all([
        curatedListsAdmin.getCuratedLists(),
        curatedListsAdmin.getAllLists()
      ])
      
      if (curatedResult.error) {
        console.error('Failed to fetch curated lists for fallback stats:', curatedResult.error)
        return NextResponse.json(
          { error: 'Failed to fetch statistics' }, 
          { status: 500 }
        )
      }

      const curatedLists = curatedResult.data || []
      const allLists = allListsResult.data || []

      // Calculate basic stats from lists data
      const totalAllLists = allLists.length
      const totalCuratedLists = curatedLists.length
      const privateLists = curatedLists.filter((list: CuratedList) => list.visibility === 'private').length
      const publicLists = curatedLists.filter((list: CuratedList) => list.visibility === 'public' || list.visibility === 'curated').length
      const privatePercentage = totalCuratedLists > 0 ? Math.round((privateLists / totalCuratedLists) * 100) : 0

      const fallbackStats = {
        total_all_lists: totalAllLists,
        total_curated_lists: totalCuratedLists,
        total_places_in_curated_lists: 0, // Would need to join with list_places
        publishers_count: new Set(curatedLists.map((list: CuratedList) => list.publisher_name).filter(Boolean)).size,
        location_scopes_count: new Set(curatedLists.map((list: CuratedList) => list.location_scope).filter(Boolean)).size,
        avg_places_per_list: 0,
        most_recent_update: curatedLists.length > 0 ? 
          curatedLists.reduce((latest: string, list: CuratedList) => 
            new Date(list.updated_at) > new Date(latest) ? list.updated_at : latest, 
            curatedLists[0].updated_at
          ) : new Date().toISOString(),
        private_percentage: privatePercentage,
        public_lists: publicLists,
        private_lists: privateLists
      }

      return NextResponse.json(fallbackStats)
    }

    // Calculate additional metrics
    const [curatedResult, allListsResult] = await Promise.all([
      curatedListsAdmin.getCuratedLists(),
      curatedListsAdmin.getAllLists()
    ])
    
    const lists = curatedResult.data || []
    const allLists = allListsResult.data || []
    const privateLists = lists.filter((list: CuratedList) => list.visibility === 'private').length
    const publicLists = lists.filter((list: CuratedList) => list.visibility === 'public' || list.visibility === 'curated').length
    const privatePercentage = stats.total_curated_lists > 0 ? 
      Math.round((privateLists / stats.total_curated_lists) * 100) : 0

    const enhancedStats = {
      ...stats,
      total_all_lists: allLists.length,
      private_percentage: privatePercentage,
      public_lists: publicLists,
      private_lists: privateLists
    }

    return NextResponse.json(enhancedStats)
  } catch (error) {
    console.error('Unexpected error in stats API:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}
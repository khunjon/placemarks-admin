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
      // Fallback: get basic counts directly
      const { data: lists, error: listsError } = await curatedListsAdmin.getCuratedLists()
      
      if (listsError) {
        console.error('Failed to fetch lists for fallback stats:', listsError)
        return NextResponse.json(
          { error: 'Failed to fetch statistics' }, 
          { status: 500 }
        )
      }

      // Calculate basic stats from lists data
      const totalLists = lists?.length || 0
      const privateLists = lists?.filter((list: CuratedList) => list.visibility === 'private').length || 0
      const publicLists = lists?.filter((list: CuratedList) => list.visibility === 'public' || list.visibility === 'curated').length || 0
      const privatePercentage = totalLists > 0 ? Math.round((privateLists / totalLists) * 100) : 0

      const fallbackStats = {
        total_curated_lists: totalLists,
        total_places_in_curated_lists: 0, // Would need to join with list_places
        publishers_count: new Set(lists?.map((list: CuratedList) => list.publisher_name).filter(Boolean)).size,
        location_scopes_count: new Set(lists?.map((list: CuratedList) => list.location_scope).filter(Boolean)).size,
        avg_places_per_list: 0,
        most_recent_update: lists?.length > 0 ? 
          lists.reduce((latest: string, list: CuratedList) => 
            new Date(list.updated_at) > new Date(latest) ? list.updated_at : latest, 
            lists[0].updated_at
          ) : new Date().toISOString(),
        private_percentage: privatePercentage,
        public_lists: publicLists,
        private_lists: privateLists
      }

      return NextResponse.json(fallbackStats)
    }

    // Calculate additional metrics
    const { data: lists } = await curatedListsAdmin.getCuratedLists()
    const privateLists = lists?.filter((list: CuratedList) => list.visibility === 'private').length || 0
    const publicLists = lists?.filter((list: CuratedList) => list.visibility === 'public' || list.visibility === 'curated').length || 0
    const privatePercentage = stats.total_curated_lists > 0 ? 
      Math.round((privateLists / stats.total_curated_lists) * 100) : 0

    const enhancedStats = {
      ...stats,
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
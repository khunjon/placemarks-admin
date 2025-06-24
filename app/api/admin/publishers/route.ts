import { NextResponse } from 'next/server'
import { curatedListsAdmin } from '@/lib/services/curated-lists'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const { data: publishers, error } = await curatedListsAdmin.getUniquePublishers()
    
    if (error) {
      console.error('Error fetching publishers:', error)
      return NextResponse.json({ error: 'Failed to fetch publishers' }, { status: 500 })
    }
    
    return NextResponse.json(publishers || [])
  } catch (error) {
    console.error('Unexpected error in publishers API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
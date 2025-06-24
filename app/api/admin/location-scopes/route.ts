import { NextResponse } from 'next/server'
import { curatedListsAdmin } from '@/lib/services/curated-lists'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const { data: locationScopes, error } = await curatedListsAdmin.getUniqueLocationScopes()
    
    if (error) {
      console.error('Error fetching location scopes:', error)
      return NextResponse.json({ error: 'Failed to fetch location scopes' }, { status: 500 })
    }
    
    return NextResponse.json(locationScopes || [])
  } catch (error) {
    console.error('Unexpected error in location scopes API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
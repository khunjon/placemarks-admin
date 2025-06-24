import { NextResponse } from 'next/server'

export async function GET() {
  console.log('🚀 [TEST API] Test endpoint hit!')
  return NextResponse.json({ message: 'Test endpoint working', timestamp: new Date().toISOString() })
}

export async function PUT() {
  console.log('🚀 [TEST API] Test PUT endpoint hit!')
  return NextResponse.json({ message: 'Test PUT endpoint working', timestamp: new Date().toISOString() })
}
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const articles = await db.query('SELECT * FROM knowledge_base ORDER BY views DESC')
    return NextResponse.json(articles)
  } catch (error) {
    console.error('Error fetching knowledge base:', error)
    return NextResponse.json({ error: 'Failed to fetch knowledge base' }, { status: 500 })
  }
}

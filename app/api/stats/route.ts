// app/api/stats/route.ts
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    console.log('Fetching stats from database...')
    
    // Execute all queries
    const totalTickets = await db.query<{ count: number }>('SELECT COUNT(*) as count FROM tickets')
    const openTickets = await db.query<{ count: number }>("SELECT COUNT(*) as count FROM tickets WHERE status = 'open'")
    const totalAssets = await db.query<{ count: number }>('SELECT COUNT(*) as count FROM assets')
    const activeAssets = await db.query<{ count: number }>("SELECT COUNT(*) as count FROM assets WHERE status = 'active'")
    const ticketsByCategory = await db.query<{ category: string; count: number }>('SELECT category, COUNT(*) as count FROM tickets GROUP BY category')
    const ticketsByPriority = await db.query<{ priority: string; count: number }>('SELECT priority, COUNT(*) as count FROM tickets GROUP BY priority')

    console.log('Query results:', {
      totalTickets,
      openTickets,
      totalAssets,
      activeAssets,
      ticketsByCategory,
      ticketsByPriority
    })

    const stats = {
      totalTickets: totalTickets[0]?.count || 0,
      openTickets: openTickets[0]?.count || 0,
      totalAssets: totalAssets[0]?.count || 0,
      activeAssets: activeAssets[0]?.count || 0,
      ticketsByCategory,
      ticketsByPriority
    }

    console.log('Stats to return:', stats)
    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch statistics',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
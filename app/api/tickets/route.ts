import { NextRequest, NextResponse } from 'next/server'
import { db, categorizeTicket } from '@/lib/db'

export async function GET() {
  try {
    const tickets = await db.query('SELECT * FROM tickets ORDER BY created_at DESC')
    return NextResponse.json(tickets)
  } catch (error) {
    console.error('Error fetching tickets:', error)
    return NextResponse.json({ error: 'Failed to fetch tickets' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, department, staffId, staffName, email } = body

    const { category, priority } = categorizeTicket(description)
    const ticketId = 'TKT' + Date.now()
    const status = 'open'

    await db.run(
      `INSERT INTO tickets (ticket_id, title, description, category, priority, status, department, staff_id, staff_name, email, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
      [ticketId, title, description, category, priority, status, department, staffId, staffName, email]
    )

    return NextResponse.json({
      success: true,
      ticketId,
      category,
      priority,
      message: 'Ticket created successfully!'
    })
  } catch (error) {
    console.error('Error creating ticket:', error)
    return NextResponse.json({ error: 'Failed to create ticket' }, { status: 500 })
  }
}

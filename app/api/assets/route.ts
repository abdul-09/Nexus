import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const assets = await db.query('SELECT * FROM assets ORDER BY created_at DESC')
    return NextResponse.json(assets)
  } catch (error) {
    console.error('Error fetching assets:', error)
    return NextResponse.json({ error: 'Failed to fetch assets' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { assetType, assetTag, serialNumber, assignedTo, staffId, department } = body

    const assetId = 'AST' + Date.now()

    await db.run(
      `INSERT INTO assets (asset_id, asset_type, asset_tag, serial_number, assigned_to, staff_id, department, status, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, 'active', datetime('now'))`,
      [assetId, assetType, assetTag, serialNumber, assignedTo, staffId, department]
    )

    return NextResponse.json({ success: true, assetId })
  } catch (error) {
    console.error('Error creating asset:', error)
    return NextResponse.json({ error: 'Failed to add asset' }, { status: 500 })
  }
}

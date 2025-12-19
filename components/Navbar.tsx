'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path ? 'active' : ''
  }

  return (
    <nav className="navbar">
      <div className="nav-container">
        <h1 className="logo">Nexus</h1>
        <div className="nav-links">
          <Link href="/" className={isActive('/')}>
            Dashboard
          </Link>
          <Link href="/submit-ticket" className={isActive('/submit-ticket')}>
            Submit Ticket
          </Link>
          <Link href="/assets" className={isActive('/assets')}>
            Assets
          </Link>
          <Link href="/knowledge-base" className={isActive('/knowledge-base')}>
            Knowledge Base
          </Link>
          <Link href="/reports" className={isActive('/reports')}>
            Reports
          </Link>
        </div>
      </div>
    </nav>
  )
}

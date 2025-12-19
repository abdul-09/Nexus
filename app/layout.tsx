import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ICT Nexus - Internal Support & Asset Portal',
  description: 'Streamlining ICT support operations and asset management',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

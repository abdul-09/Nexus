import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { DoughnutChart, LineChart } from '@/components/Charts'

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="container">
        <div className="welcome-section">
          <h2>Welcome to Nexus ICT Support Portal</h2>
          <p className="subtitle">Streamlining IT support and asset management for You</p>
        </div>

        <div className="action-cards">
          <Link href="/submit-ticket" style={{ textDecoration: 'none' }}>
            <div className="action-card">
              <div className="card-icon">🎫</div>
              <h3>Submit Issue</h3>
              <p>Report IT problems and get quick support</p>
              <button className="btn-primary">Create Ticket</button>
            </div>
          </Link>

          <Link href="/assets" style={{ textDecoration: 'none' }}>
            <div className="action-card">
              <div className="card-icon">💻</div>
              <h3>Asset Lookup</h3>
              <p>Track and manage ICT equipment</p>
              <button className="btn-primary">View Assets</button>
            </div>
          </Link>

          <Link href="/reports" style={{ textDecoration: 'none' }}>
            <div className="action-card">
              <div className="card-icon">📊</div>
              <h3>Admin Reports</h3>
              <p>Generate weekly performance reports</p>
              <button className="btn-primary">View Reports</button>
            </div>
          </Link>
        </div>

        <div className="stats-section">
          <h3>Quick Stats</h3>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">12</div>
              <div className="stat-label">Open Tickets</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">5</div>
              <div className="stat-label">Resolved Today</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">156</div>
              <div className="stat-label">Active Assets</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">45m</div>
              <div className="stat-label">Avg Response Time</div>
            </div>
          </div>
        </div>

        <div className="chart-section">
          <DoughnutChart
            title="Tickets by Category"
            labels={['Software', 'Hardware', 'Network', 'Access', 'General']}
            data={[35, 25, 20, 15, 5]}
          />
          <LineChart
            title="Weekly Ticket Trend"
            labels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']}
            datasets={[
              {
                label: 'Tickets Submitted',
                data: [12, 19, 8, 15, 22, 5, 3],
                borderColor: '#0066cc',
                backgroundColor: 'rgba(0, 102, 204, 0.1)'
              },
              {
                label: 'Tickets Resolved',
                data: [10, 15, 12, 18, 20, 8, 5],
                borderColor: '#28a745',
                backgroundColor: 'rgba(40, 167, 69, 0.1)'
              }
            ]}
          />
        </div>
      </div>
      <Footer />
    </>
  )
}

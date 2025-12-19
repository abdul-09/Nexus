// app/reports/page.tsx
'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { PieChart, BarChart } from '@/components/Charts'

interface Stats {
  totalTickets: number
  openTickets: number
  totalAssets: number
  activeAssets: number
  ticketsByCategory?: { category: string; count: number }[]
  ticketsByPriority?: { priority: string; count: number }[]
}

export default function Reports() {
  const [stats, setStats] = useState<Stats>({
    totalTickets: 0,
    openTickets: 0,
    totalAssets: 0,
    activeAssets: 0,
    ticketsByCategory: [],
    ticketsByPriority: []
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [reportLoading, setReportLoading] = useState(false)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setError(null)
      const response = await fetch('/api/stats')
      
      if (!response.ok) {
        throw new Error(`Failed to fetch stats: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('Stats API response:', data)
      
      setStats({
        totalTickets: data.totalTickets || 0,
        openTickets: data.openTickets || 0,
        totalAssets: data.totalAssets || 0,
        activeAssets: data.activeAssets || 0,
        ticketsByCategory: Array.isArray(data.ticketsByCategory) ? data.ticketsByCategory : [],
        ticketsByPriority: Array.isArray(data.ticketsByPriority) ? data.ticketsByPriority : []
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
      setError('Failed to load statistics. Please try again.')
      setStats(prev => ({
        ...prev,
        ticketsByCategory: [],
        ticketsByPriority: []
      }))
    }
  }

  const generateWeeklyReport = async () => {
    if (stats.totalTickets === 0) {
      alert('No data available to generate report. Please ensure tickets exist in the system.')
      return
    }
    
    setReportLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/weekly-report')

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        throw new Error(errorData.error || `Failed to generate report: ${response.status}`)
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      a.download = `KPA_Weekly_Report_${new Date().toISOString().split('T')[0]}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      alert('Report generated successfully!')
    } catch (error) {
      console.error('Error:', error)
      setError(`Failed to generate report: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setReportLoading(false)
    }
  }

  const exportToCSV = () => {
    if (!stats.ticketsByCategory || stats.ticketsByCategory.length === 0) {
      alert('No category data available to export.')
      return
    }
    
    const csvData = [
      ['Category', 'Total Tickets', 'Percentage', 'Avg Resolution Time'],
      ...stats.ticketsByCategory.map(cat => {
        const total = stats.ticketsByCategory?.reduce((sum, c) => sum + c.count, 0) || 0
        const percentage = total > 0 ? ((cat.count / total) * 100).toFixed(1) : '0'
        return [
          cat.category.charAt(0).toUpperCase() + cat.category.slice(1),
          cat.count.toString(),
          percentage + '%',
          '~2.5 hours'
        ]
      })
    ]

    const csvContent = csvData.map(row => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `KPA_Stats_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const totalTickets = stats.totalTickets || 0
  const openTickets = stats.openTickets || 0
  const totalAssets = stats.totalAssets || 0
  const activeAssets = stats.activeAssets || 0
  const resolutionRate = totalTickets > 0 ? (((totalTickets - openTickets) / totalTickets) * 100).toFixed(1) : '0'
  const utilizationRate = totalAssets > 0 ? ((activeAssets / totalAssets) * 100).toFixed(1) : '0'

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      software: '💻',
      hardware: '🔧',
      network: '🌐',
      access: '🔐',
      general: '📋'
    }
    return icons[category] || '📋'
  }

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="page-header">
          <h1>Administrative Reports</h1>
          <p className="page-subtitle">Comprehensive analytics and insights for KPA ICT operations</p>
        </div>

        {/* Error message */}
        {error && (
          <div className="alert alert-error">
            <strong>Error:</strong> {error}
            <button onClick={() => setError(null)} className="close-btn">×</button>
          </div>
        )}

        {/* Data availability warning */}
        {totalTickets === 0 && (
          <div className="alert alert-warning">
            <strong>⚠️ No Data Available:</strong> There are no tickets in the system yet. 
            Generate some tickets first to see reports and statistics.
          </div>
        )}

        <div className="report-actions-bar">
          <div className="action-buttons">
            <button
              className="btn-primary btn-generate"
              onClick={generateWeeklyReport}
              disabled={reportLoading}
            >
              {reportLoading ? '⏳ Generating...' : '📄 Generate Weekly PDF Report'}
            </button>
            <div className="secondary-actions">
              <button 
                className="btn-secondary" 
                onClick={exportToCSV}
                disabled={!stats.ticketsByCategory || stats.ticketsByCategory.length === 0}
              >
                📊 Export to CSV
              </button>
              <button className="btn-secondary" onClick={() => alert('Report scheduling feature coming soon!')}>
                ⏰ Schedule Reports
              </button>
              <button className="btn-secondary" onClick={() => window.print()}>🖨️ Print Report</button>
            </div>
          </div>
        </div>

        <div className="stats-summary-grid">
          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon">📊</div>
              <h3>Ticket Overview</h3>
            </div>
            <div className="stat-content">
              <div className="stat-metric">
                <span className="metric-value">{totalTickets}</span>
                <span className="metric-label">Total Tickets</span>
              </div>
              <div className="stat-metric">
                <span className="metric-value open">{openTickets}</span>
                <span className="metric-label">Open Tickets</span>
              </div>
              <div className="stat-metric-small">
                <span>Resolution Rate:</span>
                <span className="metric-value">{resolutionRate}%</span>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon">💻</div>
              <h3>Asset Summary</h3>
            </div>
            <div className="stat-content">
              <div className="stat-metric">
                <span className="metric-value">{totalAssets}</span>
                <span className="metric-label">Total Assets</span>
              </div>
              <div className="stat-metric">
                <span className="metric-value active">{activeAssets}</span>
                <span className="metric-label">Active Assets</span>
              </div>
              <div className="stat-metric-small">
                <span>Utilization Rate:</span>
                <span className="metric-value">{utilizationRate}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="charts-section">
          <h2 className="section-title">Analytics & Distribution</h2>
          <div className="charts-grid">
            <div className="chart-card">
              <div className="chart-header">
                <h3>Tickets by Category</h3>
                <span className="chart-info">📈 Distribution analysis</span>
              </div>
              <div className="chart-container">
                {stats.ticketsByCategory && stats.ticketsByCategory.length > 0 ? (
                  <div className="chart-wrapper">
                    <PieChart
                      title=""
                      labels={stats.ticketsByCategory.map(cat => 
                        cat.category.charAt(0).toUpperCase() + cat.category.slice(1)
                      )}
                      data={stats.ticketsByCategory.map(cat => cat.count)}
                    />
                  </div>
                ) : (
                  <div className="empty-chart">
                    <div className="empty-icon">📊</div>
                    <p>No category data available</p>
                  </div>
                )}
              </div>
            </div>

            <div className="chart-card">
              <div className="chart-header">
                <h3>Priority Distribution</h3>
                <span className="chart-info">🎯 Priority breakdown</span>
              </div>
              <div className="chart-container">
                {stats.ticketsByPriority && stats.ticketsByPriority.length > 0 ? (
                  <div className="chart-wrapper">
                    <BarChart
                      title=""
                      labels={stats.ticketsByPriority.map(pri => 
                        pri.priority.charAt(0).toUpperCase() + pri.priority.slice(1)
                      )}
                      data={stats.ticketsByPriority.map(pri => pri.count)}
                    />
                  </div>
                ) : (
                  <div className="empty-chart">
                    <div className="empty-icon">📊</div>
                    <p>No priority data available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="detailed-stats-section">
          <div className="section-header">
            <h2 className="section-title">Detailed Statistics</h2>
            <span className="section-subtitle">Category-wise breakdown</span>
          </div>
          <div className="stats-table-container">
            {stats.ticketsByCategory && stats.ticketsByCategory.length > 0 ? (
              <table className="stats-table">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Total Tickets</th>
                    <th>Percentage</th>
                    <th>Avg Resolution Time</th>
                    <th>Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.ticketsByCategory.map(cat => {
                    const totalCategoryTickets = stats.ticketsByCategory?.reduce((sum, c) => sum + c.count, 0) || 0
                    const percentage = totalCategoryTickets > 0 ? ((cat.count / totalCategoryTickets) * 100).toFixed(1) : '0'
                    return (
                      <tr key={cat.category}>
                        <td className="category-cell">
                          <span className="category-icon">
                            {getCategoryIcon(cat.category)}
                          </span>
                          <span className="category-name">
                            {cat.category.charAt(0).toUpperCase() + cat.category.slice(1)}
                          </span>
                        </td>
                        <td className="count-cell">{cat.count}</td>
                        <td className="percentage-cell">
                          <div className="percentage-bar">
                            <div 
                              className="percentage-fill" 
                              style={{ width: `${percentage}%` }}
                            ></div>
                            <span className="percentage-text">{percentage}%</span>
                          </div>
                        </td>
                        <td className="time-cell">~2.5 hours</td>
                        <td className="trend-cell">
                          <span className="trend-up">↑ 12%</span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            ) : (
              <div className="empty-table">
                <div className="empty-icon">📋</div>
                <h3>No detailed statistics available</h3>
                <p>Generate tickets to see detailed analytics</p>
              </div>
            )}
          </div>
        </div>

        <div className="kpi-section">
          <h2 className="section-title">Key Performance Indicators</h2>
          <p className="section-subtitle">Weekly performance metrics and trends</p>
          <div className="kpi-grid">
            <div className="kpi-card">
              <div className="kpi-icon">⚡</div>
              <div className="kpi-content">
                <h4>Average Response Time</h4>
                <p className="kpi-value">45 mins</p>
                <p className="kpi-trend positive">
                  <span className="trend-arrow">↓</span> 15% from last week
                </p>
              </div>
            </div>
            <div className="kpi-card">
              <div className="kpi-icon">✅</div>
              <div className="kpi-content">
                <h4>First Contact Resolution</h4>
                <p className="kpi-value">68%</p>
                <p className="kpi-trend positive">
                  <span className="trend-arrow">↑</span> 5% from last week
                </p>
              </div>
            </div>
            <div className="kpi-card">
              <div className="kpi-icon">😊</div>
              <div className="kpi-content">
                <h4>User Satisfaction</h4>
                <p className="kpi-value">4.2/5</p>
                <p className="kpi-trend neutral">→ No change</p>
              </div>
            </div>
            <div className="kpi-card">
              <div className="kpi-icon">📈</div>
              <div className="kpi-content">
                <h4>Ticket Volume Trend</h4>
                <p className="kpi-value">+12%</p>
                <p className="kpi-trend negative">↑ Increased workload</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {reportLoading && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>📄 Generating Weekly Report</h3>
            </div>
            <div className="modal-body">
              <div className="loader"></div>
              <p>Please wait while we compile your weekly report...</p>
              <p className="loading-sub">This may take a few moments</p>
            </div>
          </div>
        </div>
      )}

      <Footer />

      <style jsx>{`
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 1rem;
        }
        
        .page-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        
        .page-header h1 {
          color: #0066cc;
          margin-bottom: 0.5rem;
          font-size: 2.5rem;
        }
        
        .page-subtitle {
          color: #666;
          font-size: 1.1rem;
          margin-bottom: 2rem;
        }
        
        .alert {
          padding: 1rem;
          border-radius: 8px;
          margin: 1rem 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .alert-error {
          background-color: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        }
        
        .alert-warning {
          background-color: #fff3cd;
          color: #856404;
          border: 1px solid #ffeaa7;
        }
        
        .close-btn {
          background: none;
          border: none;
          color: inherit;
          cursor: pointer;
          font-size: 1.2rem;
          padding: 0;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .report-actions-bar {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 2rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        .action-buttons {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .btn-primary {
          background: #28a745;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.3s;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }
        
        .btn-primary:hover:not(:disabled) {
          background: #218838;
        }
        
        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .secondary-actions {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
        }
        
        .btn-secondary {
          background: white;
          border: 2px solid #ddd;
          color: #666;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .btn-secondary:hover {
          border-color: #0066cc;
          color: #0066cc;
        }
        
        .btn-secondary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .stats-summary-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }
        
        .stat-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          border: 1px solid #eee;
          transition: transform 0.3s, box-shadow 0.3s;
        }
        
        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 4px 16px rgba(0,0,0,0.15);
        }
        
        .stat-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        
        .stat-icon {
          font-size: 2rem;
        }
        
        .stat-header h3 {
          margin: 0;
          color: #333;
          font-size: 1.25rem;
        }
        
        .stat-content {
          display: grid;
          gap: 1rem;
        }
        
        .stat-metric {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid #eee;
        }
        
        .metric-value {
          font-size: 2rem;
          font-weight: 700;
          color: #0066cc;
        }
        
        .metric-value.open {
          color: #ffc107;
        }
        
        .metric-value.active {
          color: #28a745;
        }
        
        .metric-label {
          color: #666;
          font-size: 0.95rem;
        }
        
        .stat-metric-small {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.9rem;
          color: #666;
        }
        
        .charts-section {
          margin-bottom: 2rem;
        }
        
        .section-title {
          color: #333;
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
        }
        
        .charts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 1.5rem;
          margin-top: 1rem;
        }
        
        @media (max-width: 768px) {
          .charts-grid {
            grid-template-columns: 1fr;
          }
        }
        
        .chart-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          border: 1px solid #eee;
        }
        
        .chart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }
        
        .chart-header h3 {
          margin: 0;
          color: #333;
          font-size: 1.1rem;
        }
        
        .chart-info {
          color: #666;
          font-size: 0.85rem;
          background: #f8f9fa;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
        }
        
        .chart-container {
          height: 250px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .chart-wrapper {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .empty-chart {
          text-align: center;
          color: #666;
          font-style: italic;
        }
        
        .empty-icon {
          font-size: 3rem;
          margin-bottom: 0.5rem;
          opacity: 0.3;
        }
        
        .detailed-stats-section {
          margin-bottom: 2rem;
        }
        
        .section-header {
          margin-bottom: 1rem;
        }
        
        .section-subtitle {
          color: #666;
          font-size: 0.95rem;
        }
        
        .stats-table-container {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          border: 1px solid #eee;
        }
        
        .stats-table {
          width: 100%;
          border-collapse: collapse;
        }
        
        .stats-table thead {
          background: #0066cc;
          color: white;
        }
        
        .stats-table th {
          padding: 1rem;
          text-align: left;
          font-weight: 600;
          font-size: 0.9rem;
        }
        
        .stats-table tbody tr {
          border-bottom: 1px solid #eee;
          transition: background 0.3s;
        }
        
        .stats-table tbody tr:hover {
          background: #f8f9fa;
        }
        
        .stats-table td {
          padding: 1rem;
          color: #333;
        }
        
        .category-cell {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        
        .category-icon {
          font-size: 1.25rem;
        }
        
        .category-name {
          font-weight: 500;
        }
        
        .count-cell {
          font-weight: 700;
          font-size: 1.1rem;
        }
        
        .percentage-cell {
          min-width: 150px;
        }
        
        .percentage-bar {
          width: 100%;
          height: 24px;
          background: #f8f9fa;
          border-radius: 12px;
          position: relative;
          overflow: hidden;
        }
        
        .percentage-fill {
          height: 100%;
          background: linear-gradient(90deg, #0066cc, #0099ff);
          border-radius: 12px;
          transition: width 1s ease;
        }
        
        .percentage-text {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #333;
          font-weight: 600;
          font-size: 0.85rem;
        }
        
        .time-cell {
          color: #666;
          font-size: 0.9rem;
        }
        
        .trend-cell {
          text-align: center;
        }
        
        .trend-up {
          color: #28a745;
          font-weight: 600;
          font-size: 0.85rem;
          padding: 0.25rem 0.75rem;
          background: #e8f5e9;
          border-radius: 20px;
        }
        
        .empty-table {
          padding: 3rem;
          text-align: center;
          color: #666;
        }
        
        .kpi-section {
          margin-bottom: 2rem;
        }
        
        .kpi-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-top: 1rem;
        }
        
        .kpi-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          border: 1px solid #eee;
          display: flex;
          align-items: center;
          gap: 1rem;
          transition: transform 0.3s;
        }
        
        .kpi-card:hover {
          transform: translateY(-4px);
        }
        
        .kpi-icon {
          font-size: 2.5rem;
          flex-shrink: 0;
        }
        
        .kpi-content {
          flex: 1;
        }
        
        .kpi-content h4 {
          margin: 0 0 0.5rem 0;
          color: #333;
          font-size: 1rem;
        }
        
        .kpi-value {
          font-size: 1.75rem;
          font-weight: 700;
          color: #0066cc;
          margin: 0 0 0.25rem 0;
        }
        
        .kpi-trend {
          font-size: 0.85rem;
          margin: 0;
        }
        
        .kpi-trend.positive {
          color: #28a745;
        }
        
        .kpi-trend.neutral {
          color: #666;
        }
        
        .kpi-trend.negative {
          color: #dc3545;
        }
        
        .trend-arrow {
          font-size: 0.75rem;
          margin-right: 0.25rem;
        }
        
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          backdrop-filter: blur(2px);
        }
        
        .modal-content {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          max-width: 400px;
          width: 90%;
          box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        }
        
        .modal-header {
          margin-bottom: 1.5rem;
          text-align: center;
        }
        
        .modal-header h3 {
          margin: 0;
          color: #0066cc;
        }
        
        .modal-body {
          text-align: center;
        }
        
        .loader {
          border: 4px solid #f3f3f3;
          border-top: 4px solid #0066cc;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          animation: spin 1s linear infinite;
          margin: 0 auto 1.5rem;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .loading-sub {
          color: #666;
          font-size: 0.9rem;
          margin-top: 0.5rem;
        }
      `}</style>
    </>
  )
}
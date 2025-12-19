'use client'

import { useState, FormEvent, ChangeEvent } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const departments = [
  'Operations',
  'Finance',
  'Human Resources',
  'Security',
  'Engineering',
  'ICT',
  'Legal',
  'Procurement'
]

export default function SubmitTicket() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: '',
    staffName: '',
    staffId: '',
    email: '',
    department: '',
    description: ''
  })
  const [prediction, setPrediction] = useState({ category: '', priority: '' })
  const [showPrediction, setShowPrediction] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [ticketResult, setTicketResult] = useState({ ticketId: '', category: '', priority: '' })

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    if (name === 'description' && value.length > 10) {
      predictCategory(value)
    }
  }

  const predictCategory = (description: string) => {
    const keywords = {
      software: ['kwatos', 'login', 'password', 'software', 'system', 'error', 'crash', 'application', 'app'],
      hardware: ['printer', 'scanner', 'computer', 'laptop', 'mouse', 'keyboard', 'screen', 'monitor', 'device'],
      network: ['internet', 'wifi', 'connection', 'network', 'lan', 'ethernet', 'slow', 'connectivity'],
      access: ['gate', 'card', 'badge', 'access', 'entry', 'permission', 'security', 'door']
    }

    const lowerDesc = description.toLowerCase()
    let category = 'general'
    let priority = 'medium'

    for (const [cat, words] of Object.entries(keywords)) {
      if (words.some(word => lowerDesc.includes(word))) {
        category = cat
        break
      }
    }

    if (lowerDesc.includes('urgent') || lowerDesc.includes('critical') || lowerDesc.includes('down') || lowerDesc.includes('emergency')) {
      priority = 'high'
    } else if (lowerDesc.includes('minor') || lowerDesc.includes('low') || lowerDesc.includes('whenever')) {
      priority = 'low'
    }

    setPrediction({ category, priority })
    setShowPrediction(true)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch('/api/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const result = await response.json()

      if (result.success) {
        setTicketResult({
          ticketId: result.ticketId,
          category: result.category,
          priority: result.priority
        })
        setShowModal(true)
        setFormData({
          title: '',
          staffName: '',
          staffId: '',
          email: '',
          department: '',
          description: ''
        })
        setShowPrediction(false)
      } else {
        alert('Error submitting ticket. Please try again.')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Network error. Please try again.')
    }
  }

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="form-container">
          <h2>Submit Support Ticket</h2>
          <p className="form-subtitle">Describe your issue and our smart system will categorize it automatically</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Issue Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                placeholder="Brief description of your issue"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="staffName">Your Name *</label>
                <input
                  type="text"
                  id="staffName"
                  name="staffName"
                  value={formData.staffName}
                  onChange={handleInputChange}
                  required
                  placeholder="John Kamau"
                />
              </div>
              <div className="form-group">
                <label htmlFor="staffId">Staff ID *</label>
                <input
                  type="text"
                  id="staffId"
                  name="staffId"
                  value={formData.staffId}
                  onChange={handleInputChange}
                  required
                  placeholder="EMP1234"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="j.kamau@kpa.co.ke"
                />
              </div>
              <div className="form-group">
                <label htmlFor="department">Department *</label>
                <select
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description">Detailed Description *</label>
              <textarea
                id="description"
                name="description"
                rows={6}
                value={formData.description}
                onChange={handleInputChange}
                required
                placeholder="Please provide detailed information about your issue. Include any error messages, when the problem started, and what you were trying to do."
              />
              <small className="help-text">
                Include keywords like &apos;Kwatos&apos;, &apos;printer&apos;, &apos;login&apos;, &apos;urgent&apos; to help us categorize your ticket
              </small>
            </div>

            {showPrediction && (
              <div className="smart-categorization">
                <div className="category-preview">
                  <h4>🤖 Smart Categorization Preview</h4>
                  <p>
                    Category: <span className={`badge ${prediction.category}`}>
                      {prediction.category.charAt(0).toUpperCase() + prediction.category.slice(1)}
                    </span>
                  </p>
                  <p>
                    Priority: <span className={`badge ${prediction.priority}`}>
                      {prediction.priority.charAt(0).toUpperCase() + prediction.priority.slice(1)}
                    </span>
                  </p>
                </div>
              </div>
            )}

            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={() => router.push('/')}>
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Submit Ticket
              </button>
            </div>
          </form>
        </div>

        <div className="help-section">
          <h3>💡 Quick Tips</h3>
          <ul>
            <li><strong>Kwatos Issues:</strong> Check our Knowledge Base for password reset guides</li>
            <li><strong>Urgent Issues:</strong> Include &quot;urgent&quot; in your description for high priority handling</li>
            <li><strong>Hardware Problems:</strong> Include device model and serial number if available</li>
            <li><strong>Multiple Issues:</strong> Submit separate tickets for different problems</li>
          </ul>
        </div>
      </div>

      {showModal && (
        <div className="modal show">
          <div className="modal-content">
            <h3>✅ Ticket Submitted Successfully!</h3>
            <p>Your ticket ID: <strong>{ticketResult.ticketId}</strong></p>
            <p>
              Category: <span className={`badge ${ticketResult.category}`}>{ticketResult.category}</span>
            </p>
            <p>
              Priority: <span className={`badge ${ticketResult.priority}`}>{ticketResult.priority}</span>
            </p>
            <p className="modal-info">You will receive email updates on your ticket status.</p>
            <button className="btn-primary" onClick={() => router.push('/')}>
              Back to Dashboard
            </button>
          </div>
        </div>
      )}

      <Footer />
    </>
  )
}

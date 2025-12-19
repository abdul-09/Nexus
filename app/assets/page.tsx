'use client'

import { useState, useEffect, ChangeEvent, FormEvent } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Asset } from '@/lib/db'

const departments = [
  'Operations', 'Finance', 'Human Resources', 'Security',
  'Engineering', 'ICT', 'Legal', 'Procurement'
]

const assetTypes = [
  'Laptop', 'Printer', 'Radio', 'Scanner', 'Access Card',
  'Desktop', 'Monitor', 'Other'
]

export default function Assets() {
  const [assets, setAssets] = useState<Asset[]>([])
  const [filteredAssets, setFilteredAssets] = useState<Asset[]>([])
  const [showModal, setShowModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [formData, setFormData] = useState({
    assetType: '',
    assetTag: '',
    serialNumber: '',
    assignedTo: '',
    staffId: '',
    department: ''
  })

  useEffect(() => {
    fetchAssets()
  }, [])

  useEffect(() => {
    filterAssets()
  }, [searchTerm, typeFilter, statusFilter, assets])

  const fetchAssets = async () => {
    try {
      const response = await fetch('/api/assets')
      const data = await response.json()
      setAssets(data)
      setFilteredAssets(data)
    } catch (error) {
      console.error('Error fetching assets:', error)
    }
  }

  const filterAssets = () => {
    let filtered = [...assets]

    if (searchTerm) {
      filtered = filtered.filter(asset =>
        asset.asset_tag.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.assigned_to.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (asset.serial_number && asset.serial_number.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    if (typeFilter) {
      filtered = filtered.filter(asset => asset.asset_type === typeFilter)
    }

    if (statusFilter) {
      filtered = filtered.filter(asset => asset.status === statusFilter)
    }

    setFilteredAssets(filtered)
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch('/api/assets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const result = await response.json()

      if (result.success) {
        alert('Asset added successfully!')
        setShowModal(false)
        setFormData({
          assetType: '',
          assetTag: '',
          serialNumber: '',
          assignedTo: '',
          staffId: '',
          department: ''
        })
        fetchAssets()
      } else {
        alert('Error adding asset. Please try again.')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Network error. Please try again.')
    }
  }

  const getAssetIcon = (type: string) => {
    const icons: { [key: string]: string } = {
      'Laptop': '💻',
      'Printer': '🖨️',
      'Radio': '📻',
      'Scanner': '📷',
      'Access Card': '🎫',
      'Desktop': '🖥️',
      'Monitor': '🖥️',
      'Other': '📦'
    }
    return icons[type] || '📦'
  }

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="page-header">
          <h2>ICT Asset Management</h2>
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            + Add New Asset
          </button>
        </div>

        <div className="search-section">
          <input
            type="text"
            placeholder="Search by asset tag, serial number, or assigned staff..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="filter-select"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="">All Types</option>
            {assetTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="maintenance">Maintenance</option>
            <option value="retired">Retired</option>
          </select>
        </div>

        <div className="assets-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Asset ID</th>
                <th>Type</th>
                <th>Asset Tag</th>
                <th>Serial Number</th>
                <th>Assigned To</th>
                <th>Department</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssets.map(asset => (
                <tr key={asset.id}>
                  <td>{asset.asset_id}</td>
                  <td>
                    <span className="asset-type">
                      {getAssetIcon(asset.asset_type)} {asset.asset_type}
                    </span>
                  </td>
                  <td><strong>{asset.asset_tag}</strong></td>
                  <td>{asset.serial_number || 'N/A'}</td>
                  <td>{asset.assigned_to}</td>
                  <td>{asset.department}</td>
                  <td>
                    <span className={`status-badge ${asset.status}`}>
                      {asset.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal show">
          <div className="modal-content">
            <h3>Add New Asset</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="assetType">Asset Type *</label>
                <select
                  id="assetType"
                  name="assetType"
                  value={formData.assetType}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Type</option>
                  {assetTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="assetTag">Asset Tag *</label>
                  <input
                    type="text"
                    id="assetTag"
                    name="assetTag"
                    value={formData.assetTag}
                    onChange={handleInputChange}
                    required
                    placeholder="KPA-LT-2024-001"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="serialNumber">Serial Number</label>
                  <input
                    type="text"
                    id="serialNumber"
                    name="serialNumber"
                    value={formData.serialNumber}
                    onChange={handleInputChange}
                    placeholder="Optional"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="assignedTo">Assigned To *</label>
                  <input
                    type="text"
                    id="assignedTo"
                    name="assignedTo"
                    value={formData.assignedTo}
                    onChange={handleInputChange}
                    required
                    placeholder="Staff name or location"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="staffId">Staff ID</label>
                  <input
                    type="text"
                    id="staffId"
                    name="staffId"
                    value={formData.staffId}
                    onChange={handleInputChange}
                    placeholder="EMP1234"
                  />
                </div>
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

              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Add Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </>
  )
}

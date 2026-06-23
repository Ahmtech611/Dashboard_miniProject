import { useState } from 'react'
import OTPVerification from '../components/OTPVerification'
import '../styles/Dashboard.css'

export default function Dashboard({ data, onAddClick, onEdit, onDelete }) {
  const [showOTP, setShowOTP] = useState(false)
  const [otpAction, setOtpAction] = useState(null)
  const [selectedId, setSelectedId] = useState(null)
  const [previewData, setPreviewData] = useState(null)

  const handleEditClick = (id) => {
    setSelectedId(id)
    setOtpAction('edit')
    setShowOTP(true)
  }

  const handleDeleteClick = (id) => {
    setSelectedId(id)
    setOtpAction('delete')
    setShowOTP(true)
  }

  const handlePreview = (item) => {
    setPreviewData(item)
  }

  const handleOTPSuccess = () => {
    if (otpAction === 'edit') {
      onEdit(selectedId)
    } else if (otpAction === 'delete') {
      onDelete(selectedId)
    }
    setShowOTP(false)
    setOtpAction(null)
    setSelectedId(null)
  }

  if (showOTP) {
    return (
      <OTPVerification
        onSuccess={handleOTPSuccess}
        onCancel={() => {
          setShowOTP(false)
          setOtpAction(null)
          setSelectedId(null)
        }}
        action={otpAction}
      />
    )
  }

  if (previewData) {
    return (
      <div className="preview-container">
        <h2>Preview</h2>
        <div className="preview-content">
          <p><strong>Name:</strong> {previewData.name}</p>
          <p><strong>Email:</strong> {previewData.email}</p>
          <p><strong>Phone:</strong> {previewData.phone}</p>
          <p><strong>Message:</strong> {previewData.message}</p>
        </div>
        <button onClick={() => setPreviewData(null)} className="btn-secondary">
          Back
        </button>
      </div>
    )
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>📊 Dashboard</h1>
        <button onClick={onAddClick} className="btn-primary">
          ➕ Add New Form
        </button>
      </div>

      {data.length === 0 ? (
        <div className="empty-state">
          <p>No forms added yet. Please click "Add New Form" to get started!</p>
        </div>
      ) : (
        <div className="forms-grid">
          {data.map((item) => (
            <div key={item.id} className="form-card">
              <h3>{item.name}</h3>
              <p><strong>Email:</strong> {item.email}</p>
              <p><strong>Phone:</strong> {item.phone}</p>
              <div className="card-actions">
                <button
                  onClick={() => handlePreview(item)}
                  className="btn-preview"
                  title="Preview"
                >
                  👁️ Preview
                </button>
                <button
                  onClick={() => handleEditClick(item.id)}
                  className="btn-edit"
                  title="Edit (requires OTP)"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDeleteClick(item.id)}
                  className="btn-delete"
                  title="Delete (requires OTP)"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

import { useState, useEffect } from 'react'
import '../styles/FormPage.css'

export default function FormPage({ onSubmit, editingData, onCancel }) {
  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })

  useEffect(() => {
    if (editingData) {
      setFormValues({
        name: editingData.name,
        email: editingData.email,
        phone: editingData.phone,
        message: editingData.message
      })
    }
  }, [editingData])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (formValues.name && formValues.email && formValues.phone) {
      onSubmit(formValues)
      setFormValues({ name: '', email: '', phone: '', message: '' })
    } else {
      alert('Please fill in all required fields')
    }
  }

  return (
    <div className="form-page">
      <div className="form-container">
        <h1>{editingData ? '✏️ Edit Form' : '📝 Add New Form'}</h1>

        <form onSubmit={handleSubmit} className="form-content">
          <div className="form-group">
            <label htmlFor="name">Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formValues.name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formValues.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone *</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formValues.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              value={formValues.message}
              onChange={handleChange}
              placeholder="Enter your message (optional)"
              rows="4"
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary">
              {editingData ? '💾 Update' : '➕ Add'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="btn-secondary"
            >
              ❌ Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

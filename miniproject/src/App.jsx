import { useState, useEffect } from 'react'
import './App.css'
import Dashboard from './pages/Dashboard'
import FormPage from './pages/FormPage'

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [formData, setFormData] = useState(() => {
    const savedData = localStorage.getItem('formData')
    return savedData ? JSON.parse(savedData) : []
  })
  const [editingId, setEditingId] = useState(null)

  // Save formData to localStorage whenever it updates(refresh the webpage)
  useEffect(() => {
    localStorage.setItem('formData', JSON.stringify(formData))
  }, [formData])

  const handleAddForm = (data) => {
    setFormData([...formData, { ...data, id: Date.now() }])
    setCurrentPage('dashboard')
  }

  const handleUpdateForm = (id, data) => {
    setFormData(formData.map(item => item.id === id ? { ...data, id } : item))
    setEditingId(null)
    setCurrentPage('dashboard')
  }

  const handleDeleteForm = (id) => {
    setFormData(formData.filter(item => item.id !== id))
  }

  const handleEditClick = (id) => {
    setEditingId(id)
    setCurrentPage('form')
  }

  return (
    <div className="app-container">
      {currentPage === 'dashboard' ? (
        <Dashboard
          data={formData}
          onAddClick={() => {
            setEditingId(null)
            setCurrentPage('form')
          }}
          onEdit={handleEditClick}
          onDelete={handleDeleteForm}
        />
      ) : (
        <FormPage
          onSubmit={editingId ? (data) => handleUpdateForm(editingId, data) : handleAddForm}
          editingData={editingId ? formData.find(item => item.id === editingId) : null}
          onCancel={() => setCurrentPage('dashboard')}
        />
      )}
    </div>
  )
}

export default App

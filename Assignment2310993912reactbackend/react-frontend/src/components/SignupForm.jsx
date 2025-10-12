import { useState } from 'react'
import axios from 'axios'

const API_URL = 'http://localhost:5000/api'

function SignupForm({ onSignup, onSwitchToLogin }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('') // Clear error when user types
  }

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return false
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long')
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)
    setError('')

    try {
      const { confirmPassword, ...signupData } = formData
      const response = await axios.post(`${API_URL}/signup`, signupData)
      
      if (response.data.success) {
        onSignup(response.data.data)
      } else {
        setError(response.data.message || 'Registration failed')
      }
    } catch (error) {
      console.error('Signup error:', error)
      if (error.response?.data?.message) {
        setError(error.response.data.message)
      } else if (error.message.includes('Network Error')) {
        setError('Cannot connect to server. Please make sure the backend is running on port 5000.')
      } else {
        setError('An error occurred during registration')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>📝 Signup Door</h2>
          <p>Join the Code Academy</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your.email@codeacademy.com"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password (min 6 characters)"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            className="auth-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Registering...
              </>
            ) : (
              'Join Academy'
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already a student? 
            <button 
              type="button"
              onClick={onSwitchToLogin}
              className="link-button"
              disabled={loading}
            >
              Login here
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignupForm
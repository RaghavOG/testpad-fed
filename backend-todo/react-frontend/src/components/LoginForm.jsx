import { useState } from 'react'
import axios from 'axios'

const API_URL = 'http://localhost:5000/api'

function LoginForm({ onLogin, onSwitchToSignup }) {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await axios.post(`${API_URL}/login`, formData)
      
      if (response.data.success) {
        onLogin(response.data.data)
      } else {
        setError(response.data.message || 'Login failed')
      }
    } catch (error) {
      console.error('Login error:', error)
      if (error.response?.data?.message) {
        setError(error.response.data.message)
      } else if (error.message.includes('Network Error')) {
        setError('Cannot connect to server. Please make sure the backend is running on port 5000.')
      } else {
        setError('An error occurred during login')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>🔐 Login</h2>
          <p>Access your todo dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
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
              placeholder="Enter your password"
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
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account? 
            <button 
              type="button"
              onClick={onSwitchToSignup}
              className="link-button"
              disabled={loading}
            >
              Sign up here
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginForm
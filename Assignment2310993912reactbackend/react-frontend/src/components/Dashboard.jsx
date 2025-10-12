import { useState, useEffect } from 'react'
import axios from 'axios'

const API_URL = 'http://localhost:5000/api'

function Dashboard({ user, onLogout }) {
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${API_URL}/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      
      if (response.data.success) {
        setDashboardData(response.data.data)
      } else {
        setError('Failed to load dashboard')
      }
    } catch (error) {
      console.error('Dashboard error:', error)
      if (error.response?.status === 401) {
        // Token expired or invalid
        onLogout()
      } else {
        setError('Failed to load dashboard data')
      }
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    )
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>🎓 Welcome to Code Academy!</h2>
        <p>Hello {user.name}, you're successfully logged in!</p>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="dashboard-content">
        <div className="user-profile-card">
          <h3>👤 Your Profile</h3>
          <div className="profile-info">
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Student ID:</strong> #{user.id}</p>
            <p><strong>Joined:</strong> {user.registeredAt ? new Date(user.registeredAt).toLocaleDateString() : 'N/A'}</p>
          </div>
        </div>

        {dashboardData && (
          <div className="features-card">
            <h3>🚀 Available Features</h3>
            <div className="features-grid">
              {dashboardData.features?.map((feature, index) => (
                <div key={index} className="feature-item">
                  <span className="feature-icon">📚</span>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="quick-actions-card">
          <h3>⚡ Quick Actions</h3>
          <div className="actions-grid">
            <button className="action-button">
              <span>📖</span>
              Browse Courses
            </button>
            <button className="action-button">
              <span>📊</span>
              View Progress
            </button>
            <button className="action-button">
              <span>📝</span>
              Submit Assignment
            </button>
            <button className="action-button">
              <span>👥</span>
              Join Study Group
            </button>
          </div>
        </div>

        <div className="announcements-card">
          <h3>📢 Announcements</h3>
          <div className="announcement-item">
            <p><strong>Welcome!</strong> You've successfully accessed the Code Academy portal. Start your learning journey today!</p>
            <small>Just now</small>
          </div>
          <div className="announcement-item">
            <p><strong>New Courses:</strong> Check out our latest JavaScript and React courses.</p>
            <small>2 hours ago</small>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
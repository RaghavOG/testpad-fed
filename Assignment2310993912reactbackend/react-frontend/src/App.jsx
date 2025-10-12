import { useState, useEffect } from 'react'
import './App.css'
import './responsive.css'
import LoginForm from './components/LoginForm'
import SignupForm from './components/SignupForm'
import Dashboard from './components/Dashboard'

function App() {
  const [currentView, setCurrentView] = useState('login') // 'login', 'signup', 'dashboard'
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (token && userData) {
      setUser(JSON.parse(userData))
      setCurrentView('dashboard')
    }
    setLoading(false)
  }, [])

  const handleLogin = (userData) => {
    setUser(userData)
    localStorage.setItem('token', userData.token)
    localStorage.setItem('user', JSON.stringify(userData))
    setCurrentView('dashboard')
  }

  const handleSignup = (userData) => {
    setUser(userData)
    localStorage.setItem('token', userData.token)
    localStorage.setItem('user', JSON.stringify(userData))
    setCurrentView('dashboard')
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setCurrentView('login')
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading Code Academy...</p>
      </div>
    )
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>🎓 Code Academy</h1>
          <p>Your Learning Portal</p>
          {user && (
            <div className="user-info">
              <span>Welcome, {user.name}!</span>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="app-main">
        {currentView === 'login' && (
          <LoginForm 
            onLogin={handleLogin}
            onSwitchToSignup={() => setCurrentView('signup')}
          />
        )}
        
        {currentView === 'signup' && (
          <SignupForm 
            onSignup={handleSignup}
            onSwitchToLogin={() => setCurrentView('login')}
          />
        )}
        
        {currentView === 'dashboard' && user && (
          <Dashboard 
            user={user}
            onLogout={handleLogout}
          />
        )}
      </main>

      <footer className="app-footer">
        <p>&copy; 2024 Code Academy - Gatekeeper System</p>
      </footer>
    </div>
  )
}

export default App

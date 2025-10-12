import { useState, useEffect } from 'react'
import './App.css'
import LoginForm from './components/LoginForm'
import SignupForm from './components/SignupForm'
import TodoDashboard from './components/TodoDashboard'

function App() {
  const [currentView, setCurrentView] = useState('login') // 'login', 'signup', 'dashboard'
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('todoToken')
    const userData = localStorage.getItem('todoUser')
    
    if (token && userData) {
      setUser(JSON.parse(userData))
      setCurrentView('dashboard')
    }
    setLoading(false)
  }, [])

  const handleLogin = (userData) => {
    setUser(userData)
    localStorage.setItem('todoToken', userData.token)
    localStorage.setItem('todoUser', JSON.stringify(userData))
    setCurrentView('dashboard')
  }

  const handleSignup = (userData) => {
    setUser(userData)
    localStorage.setItem('todoToken', userData.token)
    localStorage.setItem('todoUser', JSON.stringify(userData))
    setCurrentView('dashboard')
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('todoToken')
    localStorage.removeItem('todoUser')
    setCurrentView('login')
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading Todo App...</p>
      </div>
    )
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>📝 Todo App</h1>
          <p>Manage Your Tasks Efficiently</p>
          {user && (
            <div className="user-info">
              <span>Welcome, {user.username}!</span>
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
          <TodoDashboard 
            user={user}
            onLogout={handleLogout}
          />
        )}
      </main>

      <footer className="app-footer">
        <p>&copy; 2024 Todo App - Task Management System</p>
      </footer>
    </div>
  )
}

export default App

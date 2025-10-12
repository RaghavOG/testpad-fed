import { useState, useEffect } from 'react'
import axios from 'axios'

const API_URL = 'http://localhost:5000/api'

function TodoDashboard({ user, onLogout }) {
  const [todos, setTodos] = useState([])
  const [newTodoTitle, setNewTodoTitle] = useState('')
  const [loading, setLoading] = useState(true)
  const [addingTodo, setAddingTodo] = useState(false)
  const [error, setError] = useState('')
  const [editingTodo, setEditingTodo] = useState(null)
  const [editTitle, setEditTitle] = useState('')

  useEffect(() => {
    fetchTodos()
  }, [])

  const getAuthHeader = () => {
    const token = localStorage.getItem('todoToken')
    return { Authorization: `Bearer ${token}` }
  }

  const fetchTodos = async () => {
    try {
      const response = await axios.get(`${API_URL}/todos`, {
        headers: getAuthHeader()
      })
      
      if (response.data.success) {
        setTodos(response.data.data)
      } else {
        setError('Failed to fetch todos')
      }
    } catch (error) {
      console.error('Fetch todos error:', error)
      if (error.response?.status === 401) {
        onLogout()
      } else {
        setError('Failed to load todos')
      }
    } finally {
      setLoading(false)
    }
  }

  const addTodo = async (e) => {
    e.preventDefault()
    if (!newTodoTitle.trim()) return

    setAddingTodo(true)
    try {
      const response = await axios.post(`${API_URL}/todos`, 
        { title: newTodoTitle },
        { headers: getAuthHeader() }
      )
      
      if (response.data.success) {
        setTodos([...todos, response.data.data])
        setNewTodoTitle('')
      } else {
        setError('Failed to add todo')
      }
    } catch (error) {
      console.error('Add todo error:', error)
      setError('Failed to add todo')
    } finally {
      setAddingTodo(false)
    }
  }

  const toggleTodoStatus = async (todoId, currentStatus) => {
    const newStatus = currentStatus === 'pending' ? 'completed' : 'pending'
    
    try {
      const response = await axios.put(`${API_URL}/todos/${todoId}`, 
        { status: newStatus },
        { headers: getAuthHeader() }
      )
      
      if (response.data.success) {
        setTodos(todos.map(todo => 
          todo.id === todoId ? response.data.data : todo
        ))
      } else {
        setError('Failed to update todo')
      }
    } catch (error) {
      console.error('Update todo error:', error)
      setError('Failed to update todo')
    }
  }

  const deleteTodo = async (todoId) => {
    if (!window.confirm('Are you sure you want to delete this todo?')) return

    try {
      const response = await axios.delete(`${API_URL}/todos/${todoId}`, {
        headers: getAuthHeader()
      })
      
      if (response.data.success) {
        setTodos(todos.filter(todo => todo.id !== todoId))
      } else {
        setError('Failed to delete todo')
      }
    } catch (error) {
      console.error('Delete todo error:', error)
      setError('Failed to delete todo')
    }
  }

  const startEdit = (todo) => {
    setEditingTodo(todo.id)
    setEditTitle(todo.title)
  }

  const saveEdit = async () => {
    if (!editTitle.trim()) return

    try {
      const response = await axios.put(`${API_URL}/todos/${editingTodo}`, 
        { title: editTitle },
        { headers: getAuthHeader() }
      )
      
      if (response.data.success) {
        setTodos(todos.map(todo => 
          todo.id === editingTodo ? response.data.data : todo
        ))
        setEditingTodo(null)
        setEditTitle('')
      } else {
        setError('Failed to update todo')
      }
    } catch (error) {
      console.error('Edit todo error:', error)
      setError('Failed to update todo')
    }
  }

  const cancelEdit = () => {
    setEditingTodo(null)
    setEditTitle('')
  }

  const pendingTodos = todos.filter(todo => todo.status === 'pending')
  const completedTodos = todos.filter(todo => todo.status === 'completed')

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading your todos...</p>
      </div>
    )
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>📋 Todo Dashboard</h2>
        <p>Welcome back, {user.username}!</p>
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError('')} className="close-error">×</button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>📝 Total Tasks</h3>
          <p className="stat-number">{todos.length}</p>
        </div>
        <div className="stat-card">
          <h3>⏳ Pending</h3>
          <p className="stat-number">{pendingTodos.length}</p>
        </div>
        <div className="stat-card">
          <h3>✅ Completed</h3>
          <p className="stat-number">{completedTodos.length}</p>
        </div>
      </div>

      {/* Add Todo Form */}
      <div className="add-todo-section">
        <h3>➕ Add New Todo</h3>
        <form onSubmit={addTodo} className="add-todo-form">
          <input
            type="text"
            value={newTodoTitle}
            onChange={(e) => setNewTodoTitle(e.target.value)}
            placeholder="What needs to be done?"
            disabled={addingTodo}
            className="todo-input"
          />
          <button 
            type="submit" 
            disabled={addingTodo || !newTodoTitle.trim()}
            className="add-btn"
          >
            {addingTodo ? (
              <>
                <span className="spinner small"></span>
                Adding...
              </>
            ) : (
              'Add Todo'
            )}
          </button>
        </form>
      </div>

      {/* Todos Lists */}
      <div className="todos-section">
        {/* Pending Todos */}
        <div className="todos-column">
          <h3 className="column-title pending">⏳ Pending Tasks ({pendingTodos.length})</h3>
          <div className="todos-list">
            {pendingTodos.length === 0 ? (
              <div className="empty-state">
                <p>🎉 No pending tasks!</p>
                <small>Add a new todo to get started</small>
              </div>
            ) : (
              pendingTodos.map(todo => (
                <div key={todo.id} className="todo-item pending">
                  {editingTodo === todo.id ? (
                    <div className="edit-todo">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="edit-input"
                      />
                      <div className="edit-actions">
                        <button onClick={saveEdit} className="save-btn">✓</button>
                        <button onClick={cancelEdit} className="cancel-btn">✕</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="todo-content">
                        <h4>{todo.title}</h4>
                        <small>Created: {new Date(todo.createdAt).toLocaleDateString()}</small>
                      </div>
                      <div className="todo-actions">
                        <button 
                          onClick={() => toggleTodoStatus(todo.id, todo.status)}
                          className="complete-btn"
                          title="Mark as completed"
                        >
                          ✓
                        </button>
                        <button 
                          onClick={() => startEdit(todo)}
                          className="edit-btn"
                          title="Edit todo"
                        >
                          ✎
                        </button>
                        <button 
                          onClick={() => deleteTodo(todo.id)}
                          className="delete-btn"
                          title="Delete todo"
                        >
                          🗑
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Completed Todos */}
        <div className="todos-column">
          <h3 className="column-title completed">✅ Completed Tasks ({completedTodos.length})</h3>
          <div className="todos-list">
            {completedTodos.length === 0 ? (
              <div className="empty-state">
                <p>📝 No completed tasks yet</p>
                <small>Complete some tasks to see them here</small>
              </div>
            ) : (
              completedTodos.map(todo => (
                <div key={todo.id} className="todo-item completed">
                  <div className="todo-content">
                    <h4>{todo.title}</h4>
                    <small>Completed: {new Date(todo.updatedAt).toLocaleDateString()}</small>
                  </div>
                  <div className="todo-actions">
                    <button 
                      onClick={() => toggleTodoStatus(todo.id, todo.status)}
                      className="uncomplete-btn"
                      title="Mark as pending"
                    >
                      ↶
                    </button>
                    <button 
                      onClick={() => deleteTodo(todo.id)}
                      className="delete-btn"
                      title="Delete todo"
                    >
                      🗑
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TodoDashboard
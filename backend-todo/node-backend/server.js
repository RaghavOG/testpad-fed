const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = 'todo_app_secret_key';

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// File paths
const usersFilePath = path.join(__dirname, 'users.json');
const todosFilePath = path.join(__dirname, 'todos.json');

// Helper function to read users from file
const readUsers = () => {
  try {
    if (!fs.existsSync(usersFilePath)) {
      fs.writeFileSync(usersFilePath, JSON.stringify([], null, 2));
      return [];
    }
    const data = fs.readFileSync(usersFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading users file:', error);
    return [];
  }
};

// Helper function to write users to file
const writeUsers = (users) => {
  try {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing users file:', error);
    return false;
  }
};

// Helper function to read todos from file
const readTodos = () => {
  try {
    if (!fs.existsSync(todosFilePath)) {
      fs.writeFileSync(todosFilePath, JSON.stringify([], null, 2));
      return [];
    }
    const data = fs.readFileSync(todosFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading todos file:', error);
    return [];
  }
};

// Helper function to write todos to file
const writeTodos = (todos) => {
  try {
    fs.writeFileSync(todosFilePath, JSON.stringify(todos, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing todos file:', error);
    return false;
  }
};

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No token provided.'
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Invalid token.'
    });
  }
};

// Routes

// Health check route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Todo App API is running!',
    endpoints: {
      signup: 'POST /api/signup',
      login: 'POST /api/login',
      todos: 'GET /api/todos',
      createTodo: 'POST /api/todos',
      updateTodo: 'PUT /api/todos/:id',
      deleteTodo: 'DELETE /api/todos/:id'
    }
  });
});

// User Registration
app.post('/api/signup', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validation
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide username and password'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    // Read existing users
    const users = readUsers();

    // Check if user already exists
    const existingUser = users.find(user => user.username === username);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this username already exists'
      });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user with unique ID
    const newUser = {
      id: uuidv4(),
      username,
      password: hashedPassword,
      createdAt: new Date().toISOString()
    };

    // Add user to array
    users.push(newUser);

    // Write to file
    if (writeUsers(users)) {
      // Generate JWT token
      const token = jwt.sign(
        { id: newUser.id, username: newUser.username },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.status(201).json({
        success: true,
        message: 'User registered successfully!',
        data: {
          id: newUser.id,
          username: newUser.username,
          token
        }
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Error saving user data'
      });
    }
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// User Login
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validation
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide username and password'
      });
    }

    // Read users
    const users = readUsers();

    // Find user by username
    const user = users.find(u => u.username === username);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Login successful!',
      data: {
        id: user.id,
        username: user.username,
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get user's todos
app.get('/api/todos', verifyToken, (req, res) => {
  try {
    const todos = readTodos();
    const userTodos = todos.filter(todo => todo.userId === req.user.id);
    
    res.json({
      success: true,
      message: 'Todos retrieved successfully',
      data: userTodos
    });
  } catch (error) {
    console.error('Get todos error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Create new todo
app.post('/api/todos', verifyToken, (req, res) => {
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a todo title'
      });
    }

    const todos = readTodos();

    const newTodo = {
      id: uuidv4(),
      userId: req.user.id,
      title: title.trim(),
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    todos.push(newTodo);

    if (writeTodos(todos)) {
      res.status(201).json({
        success: true,
        message: 'Todo created successfully',
        data: newTodo
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Error saving todo'
      });
    }
  } catch (error) {
    console.error('Create todo error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update todo
app.put('/api/todos/:id', verifyToken, (req, res) => {
  try {
    const todoId = req.params.id;
    const { title, status } = req.body;

    const todos = readTodos();
    const todoIndex = todos.findIndex(todo => todo.id === todoId && todo.userId === req.user.id);

    if (todoIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
    }

    // Update todo
    if (title !== undefined) todos[todoIndex].title = title.trim();
    if (status !== undefined) todos[todoIndex].status = status;
    todos[todoIndex].updatedAt = new Date().toISOString();

    if (writeTodos(todos)) {
      res.json({
        success: true,
        message: 'Todo updated successfully',
        data: todos[todoIndex]
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Error updating todo'
      });
    }
  } catch (error) {
    console.error('Update todo error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Delete todo
app.delete('/api/todos/:id', verifyToken, (req, res) => {
  try {
    const todoId = req.params.id;
    const todos = readTodos();
    
    const todoIndex = todos.findIndex(todo => todo.id === todoId && todo.userId === req.user.id);

    if (todoIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
    }

    const deletedTodo = todos.splice(todoIndex, 1)[0];

    if (writeTodos(todos)) {
      res.json({
        success: true,
        message: 'Todo deleted successfully',
        data: deletedTodo
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Error deleting todo'
      });
    }
  } catch (error) {
    console.error('Delete todo error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get user profile
app.get('/api/profile', verifyToken, (req, res) => {
  try {
    const users = readUsers();
    const user = users.find(u => u.id === req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const todos = readTodos();
    const userTodos = todos.filter(todo => todo.userId === req.user.id);
    
    res.json({
      success: true,
      message: 'Profile retrieved successfully',
      data: {
        id: user.id,
        username: user.username,
        createdAt: user.createdAt,
        todoStats: {
          total: userTodos.length,
          pending: userTodos.filter(todo => todo.status === 'pending').length,
          completed: userTodos.filter(todo => todo.status === 'completed').length
        }
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!'
  });
});

// Handle 404 routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Todo App Server is running on port ${PORT}`);
  console.log(`📋 API Documentation available at http://localhost:${PORT}`);
  
  // Initialize JSON files if they don't exist
  if (!fs.existsSync(usersFilePath)) {
    writeUsers([]);
    console.log('📄 Created users.json file');
  }
  
  if (!fs.existsSync(todosFilePath)) {
    writeTodos([]);
    console.log('📄 Created todos.json file');
  }
});

module.exports = app;
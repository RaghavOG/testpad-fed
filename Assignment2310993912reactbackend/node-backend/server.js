const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = 'code_academy_secret_key';

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Path to users.json file
const usersFilePath = path.join(__dirname, 'users.json');

// Helper function to read users from file
const readUsers = () => {
  try {
    if (!fs.existsSync(usersFilePath)) {
      // Create empty users.json if it doesn't exist
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

// Routes

// Health check route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Code Academy Gatekeeper API is running!',
    endpoints: {
      signup: 'POST /api/signup',
      login: 'POST /api/login',
      users: 'GET /api/users'
    }
  });
});

// Signup Door - Register new students
app.post('/api/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password'
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
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Student with this email already exists'
      });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = {
      id: users.length + 1,
      name,
      email,
      password: hashedPassword,
      registeredAt: new Date().toISOString()
    };

    // Add user to array
    users.push(newUser);

    // Write to file
    if (writeUsers(users)) {
      // Generate JWT token
      const token = jwt.sign(
        { id: newUser.id, email: newUser.email, name: newUser.name },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.status(201).json({
        success: true,
        message: 'Student registered successfully!',
        data: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          registeredAt: newUser.registeredAt,
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

// Login Door - Authenticate existing students
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Read users
    const users = readUsers();

    // Find user by email
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Login successful! Welcome to Code Academy!',
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
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

// Get all users (for development/testing purposes)
app.get('/api/users', (req, res) => {
  try {
    const users = readUsers();
    // Remove passwords from response
    const safeUsers = users.map(({ password, ...user }) => user);
    
    res.json({
      success: true,
      message: 'Users retrieved successfully',
      data: safeUsers,
      count: safeUsers.length
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

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

// Protected route - Dashboard
app.get('/api/dashboard', verifyToken, (req, res) => {
  res.json({
    success: true,
    message: `Welcome to Code Academy Dashboard, ${req.user.name}!`,
    data: {
      user: req.user,
      features: [
        'View Courses',
        'Track Progress',
        'Submit Assignments',
        'Join Study Groups'
      ]
    }
  });
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
  console.log(`🚀 Code Academy Gatekeeper Server is running on port ${PORT}`);
  console.log(`📋 API Documentation available at http://localhost:${PORT}`);
  
  // Initialize users.json if it doesn't exist
  if (!fs.existsSync(usersFilePath)) {
    writeUsers([]);
    console.log('📄 Created users.json file');
  }
});

module.exports = app;
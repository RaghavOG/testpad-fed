# 📝 Todo Application - Full Stack

A complete full-stack Todo application with user authentication, session management, and personalized task management. Built with Node.js/Express backend and React/Vite frontend.

## 🚀 Features

### Backend (Node.js + Express)
- **User Authentication**: Secure signup and login with JWT tokens
- **Session Management**: Token-based authentication with localStorage
- **Unique User IDs**: UUID-based user identification
- **Personal Todo Management**: Each user sees only their own tasks
- **CRUD Operations**: Complete Create, Read, Update, Delete for todos
- **JSON File Storage**: Simple file-based data storage
- **Security**: bcrypt password hashing, CORS enabled

### Frontend (React + Vite)
- **Modern UI**: Clean and responsive design
- **Authentication Forms**: Login and signup with validation
- **Todo Dashboard**: Complete task management interface
- **Real-time Updates**: Instant UI feedback for all operations
- **Task Status Management**: Pending/Completed task organization
- **Statistics**: Task count overview and progress tracking

## 📊 Data Structure

### User Data (users.json)
```json
[
  {
    "id": "uuid-string",
    "username": "johndoe",
    "password": "hashed-password",
    "createdAt": "2024-01-01T12:00:00.000Z"
  }
]
```

### Todo Data (todos.json)
```json
[
  {
    "id": "uuid-string",
    "userId": "user-uuid",
    "title": "Complete project",
    "status": "pending", // or "completed"
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  }
]
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Quick Start (Automatic Installation)

1. **Clone or download the project**
```bash
git clone <repository-url>
cd backend-todo
```

2. **Install all dependencies automatically**
```bash
npm run install:all
```

3. **Start both servers**
```bash
npm run dev
```

This will start:
- Backend server at `http://localhost:5000`
- Frontend development server at `http://localhost:5173`

### Manual Setup

#### Backend Setup
```bash
cd node-backend
npm install
npm run dev
```

#### Frontend Setup
```bash
cd react-frontend
npm install
npm run dev
```

## 📋 API Endpoints

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| GET | `/` | Health check and API info | No |
| POST | `/api/signup` | User registration | No |
| POST | `/api/login` | User authentication | No |
| GET | `/api/todos` | Get user's todos | Yes |
| POST | `/api/todos` | Create new todo | Yes |
| PUT | `/api/todos/:id` | Update todo | Yes |
| DELETE | `/api/todos/:id` | Delete todo | Yes |
| GET | `/api/profile` | Get user profile with stats | Yes |

### Request Examples

#### User Registration
```bash
POST /api/signup
Content-Type: application/json

{
  "username": "johndoe",
  "password": "securepassword123"
}
```

#### User Login
```bash
POST /api/login
Content-Type: application/json

{
  "username": "johndoe",
  "password": "securepassword123"
}
```

#### Create Todo
```bash
POST /api/todos
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "title": "Complete the project documentation"
}
```

#### Update Todo
```bash
PUT /api/todos/:id
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "title": "Updated task title",
  "status": "completed"
}
```

## 🏗️ Project Structure

```
backend-todo/
├── node-backend/              # Express.js backend
│   ├── server.js             # Main server file
│   ├── users.json            # User data storage
│   ├── todos.json            # Todo data storage
│   └── package.json          # Backend dependencies
├── react-frontend/           # React + Vite frontend
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── LoginForm.jsx
│   │   │   ├── SignupForm.jsx
│   │   │   └── TodoDashboard.jsx
│   │   ├── App.jsx           # Main app component
│   │   ├── App.css           # Styles
│   │   └── main.jsx          # Entry point
│   └── package.json          # Frontend dependencies
├── package.json              # Root package.json with scripts
├── Task.md                   # Project requirements
└── README.md                 # This file
```

## 🔐 Authentication Flow

1. **User Registration**
   - User fills signup form with username and password
   - Backend validates input and checks for existing users
   - Password is hashed using bcrypt
   - User data is saved with unique UUID
   - JWT token is generated and returned
   - User is automatically logged in

2. **User Login**
   - User enters username and password
   - Backend validates credentials
   - JWT token is generated and returned
   - Token is stored in localStorage
   - User gains access to todo dashboard

3. **Session Management**
   - JWT token is included in all authenticated requests
   - Token is verified on protected routes
   - User stays logged in until logout or token expiry
   - Automatic logout on token expiration

## 📱 Features Overview

### Dashboard Features
- **Task Statistics**: Overview of total, pending, and completed tasks
- **Add New Todos**: Quick task creation with form validation
- **Task Management**: 
  - Mark tasks as completed/pending
  - Edit task titles inline
  - Delete tasks with confirmation
- **Task Organization**: Separate columns for pending and completed tasks
- **Real-time Updates**: Instant UI updates without page refresh

### UI Features
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern Aesthetics**: Gradient backgrounds and clean cards
- **Interactive Elements**: Hover effects and smooth animations
- **Loading States**: Visual feedback during API operations
- **Error Handling**: User-friendly error messages

## 🧪 Testing the Application

### Test User Flow
1. **Registration**: Create a new account with username/password
2. **Login**: Sign in with created credentials
3. **Add Todos**: Create several tasks to test functionality
4. **Task Operations**: 
   - Mark tasks as completed
   - Edit task titles
   - Delete unnecessary tasks
5. **Session Persistence**: Refresh page to test session management
6. **Logout**: Test logout functionality

### Sample Test Data
```bash
# Test User 1
Username: testuser1
Password: password123

# Test User 2  
Username: testuser2
Password: password456
```

## 🚀 Deployment

### Backend Deployment
- Deploy to platforms like Heroku, Railway, or Vercel
- Ensure JSON file persistence
- Set environment variables for production
- Configure CORS for production frontend URL

### Frontend Deployment
- Build the React app: `npm run build`
- Deploy to Netlify, Vercel, or GitHub Pages
- Update API_URL in components for production backend

## 🛠️ Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start both backend and frontend in development |
| `npm run dev:backend` | Start only backend in development mode |
| `npm run dev:frontend` | Start only frontend in development mode |
| `npm run start` | Start both in production mode |
| `npm run install:all` | Install dependencies for all projects |
| `npm run build` | Build frontend for production |

## 🔧 Configuration

### Environment Variables (Optional)
```env
# Backend (.env file in node-backend/)
PORT=5000
JWT_SECRET=your_jwt_secret_key

# Frontend (for production)
VITE_API_URL=https://your-backend-url.com/api
```

## 🎯 Key Learning Objectives

This project demonstrates:
- Full-stack JavaScript development
- JWT authentication implementation
- Session management best practices
- RESTful API design
- React state management
- CRUD operations
- File-based data storage
- Modern CSS techniques
- Responsive web design
- User experience design

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Server-side validation for all inputs
- **CORS Protection**: Cross-origin request handling
- **User Isolation**: Users can only access their own data
- **Error Handling**: Secure error messages without data leakage

## 📞 Support & Troubleshooting

### Common Issues
1. **Port Conflicts**: Ensure ports 5000 and 5173 are available
2. **CORS Errors**: Verify backend CORS configuration
3. **Authentication Issues**: Check token storage in localStorage
4. **JSON File Permissions**: Ensure write permissions for JSON files

### Debug Steps
1. Check browser console for frontend errors
2. Check terminal output for backend errors
3. Verify API endpoints with tools like Postman
4. Clear localStorage if experiencing auth issues

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**Happy Task Managing! 📝✅**
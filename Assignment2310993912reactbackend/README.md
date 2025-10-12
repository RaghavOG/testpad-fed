# 🎓 Code Academy Gatekeeper

A complete full-stack authentication system for Code Academy students featuring a Node.js backend with Express and a React frontend with Vite.

## 🚀 Features

### Backend (Node.js + Express)
- **Signup Door**: Register new students with secure password hashing
- **Login Door**: Authenticate existing students with JWT tokens
- **File-based Storage**: Simple JSON file storage for user data
- **Security**: bcrypt password hashing, JWT authentication, CORS enabled
- **RESTful API**: Clean API endpoints for frontend integration

### Frontend (React + Vite)
- **Modern UI**: Beautiful, responsive design with gradient backgrounds
- **Authentication Forms**: Login and signup forms with validation
- **Dashboard**: Student portal with profile information and features
- **Real-time Feedback**: Loading states, error handling, and user feedback
- **Token Management**: Automatic token storage and logout functionality

## 📋 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check and API documentation |
| POST | `/api/signup` | Register new student |
| POST | `/api/login` | Authenticate student |
| GET | `/api/users` | Get all users (development) |
| GET | `/api/dashboard` | Protected dashboard data |

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Quick Start

1. **Clone or download the project**
```bash
git clone <repository-url>
cd backend-login-assignment
```

2. **Install all dependencies**
```bash
npm run install:all
```

3. **Start both backend and frontend**
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

## 🏗️ Project Structure

```
backend-login-assignment/
├── node-backend/           # Express.js backend
│   ├── server.js          # Main server file
│   ├── users.json         # User data storage
│   ├── package.json       # Backend dependencies
│   └── README.md          # Backend documentation
├── react-frontend/        # React + Vite frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── LoginForm.jsx
│   │   │   ├── SignupForm.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── App.jsx        # Main app component
│   │   ├── App.css        # Styles
│   │   └── main.jsx       # Entry point
│   ├── package.json       # Frontend dependencies
│   └── index.html         # HTML template
├── package.json           # Root package.json with scripts
└── README.md             # This file
```

## 🎯 How It Works

### Authentication Flow

1. **New Student Registration (Signup Door)**
   - Student fills signup form with name, email, password
   - Backend validates input and checks for existing users
   - Password is hashed using bcrypt
   - User data is saved to `users.json`
   - JWT token is generated and returned
   - Student is automatically logged in

2. **Existing Student Login (Login Door)**
   - Student enters email and password
   - Backend validates credentials against `users.json`
   - Password is verified using bcrypt
   - JWT token is generated and returned
   - Student gains access to dashboard

3. **Protected Dashboard Access**
   - JWT token is stored in localStorage
   - Token is sent with API requests
   - Backend verifies token for protected routes
   - Dashboard displays student information and features

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Input Validation**: Server-side validation
- **CORS Protection**: Cross-origin request handling
- **Error Handling**: Comprehensive error management

## 🎨 UI Features

- **Responsive Design**: Works on desktop and mobile
- **Modern Aesthetics**: Gradient backgrounds, glass morphism
- **Interactive Elements**: Hover effects, loading states
- **User Feedback**: Error messages, success notifications
- **Accessibility**: Proper labels, keyboard navigation

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones

## 🧪 Testing the Application

### Test User Registration
1. Go to `http://localhost:5173`
2. Click "Register here"
3. Fill in the signup form
4. Submit and verify automatic login

### Test User Login
1. Use existing credentials or register first
2. Go back to login form
3. Enter email and password
4. Verify successful authentication

### Test Dashboard
1. After login, explore dashboard features
2. Check profile information
3. Test logout functionality

## 🚀 Deployment

### Backend Deployment
- Deploy Node.js app to platforms like Heroku, Railway, or Vercel
- Ensure `users.json` file persistence
- Set environment variables for production

### Frontend Deployment
- Build the React app: `npm run build`
- Deploy to platforms like Netlify, Vercel, or GitHub Pages
- Update API endpoints for production backend

## 🛠️ Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start both backend and frontend in development |
| `npm run dev:backend` | Start only backend in development |
| `npm run dev:frontend` | Start only frontend in development |
| `npm run start` | Start both in production mode |
| `npm run install:all` | Install dependencies for all projects |
| `npm run build` | Build frontend for production |

## 🎓 Learning Objectives

This project demonstrates:
- Full-stack JavaScript development
- RESTful API design
- JWT authentication implementation
- React component architecture
- State management in React
- Modern CSS techniques
- File-based data storage
- Security best practices

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

If you encounter any issues:
1. Check that both servers are running
2. Verify Node.js version compatibility
3. Check browser console for errors
4. Ensure ports 5000 and 5173 are available

---

**Happy Learning! 🎓**
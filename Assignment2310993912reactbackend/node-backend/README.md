# Code Academy Gatekeeper Backend

A secure authentication system for Code Academy students using Node.js, Express, and file-based storage.

## Features

- **Signup Door**: Register new students
- **Login Door**: Authenticate existing students  
- **JWT Authentication**: Secure token-based authentication
- **File Storage**: Simple JSON file storage for user data
- **Password Hashing**: Secure password storage using bcrypt
- **CORS Enabled**: Frontend integration ready

## API Endpoints

### Base URL: `http://localhost:5000`

### 1. Health Check
```
GET /
```
Returns API status and available endpoints.

### 2. Student Registration (Signup Door)
```
POST /api/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@codeacademy.com",
  "password": "securepassword123"
}
```

### 3. Student Login (Login Door)  
```
POST /api/login
Content-Type: application/json

{
  "email": "john@codeacademy.com",
  "password": "securepassword123"
}
```

### 4. Get All Users (Development)
```
GET /api/users
```

### 5. Protected Dashboard
```
GET /api/dashboard
Authorization: Bearer <jwt_token>
```

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Start production server:
```bash
npm start
```

The server will run on `http://localhost:5000`

## File Structure

```
node-backend/
├── server.js          # Main server file
├── package.json       # Dependencies and scripts
├── users.json         # User data storage
└── README.md          # This file
```

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Input validation
- Error handling
- CORS protection

## Environment

- Node.js v14+ required
- Development: nodemon for auto-restart
- Production: regular node server

## Data Storage

User data is stored in `users.json` with the following structure:
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@codeacademy.com", 
    "password": "$2a$10$...", // hashed
    "registeredAt": "2024-01-01T12:00:00.000Z"
  }
]
```
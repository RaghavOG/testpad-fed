# Multi-Level Marketing (MLM) System

This is a Multi-Level Marketing system built with React (frontend) and Node.js/Express (backend). The system implements a binary tree structure where each member can have up to two direct downlines (left and right positions).

## Features

- User Registration and Login
- Binary Tree Structure Implementation
- Member Position Management (Left/Right)
- Automatic Spillover Logic
- Member Count Tracking
- Profile View
- Downline Member Visualization

## Prerequisites

- Node.js
- MongoDB
- npm or yarn

## Project Structure

```
├── backend/
│   ├── models/
│   │   └── User.js
│   ├── server.js
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Dashboard.jsx
    │   │   ├── LoginPage.jsx
    │   │   └── RegisterPage.jsx
    │   └── App.jsx
    └── package.json
```

## Setup and Running

1. **Backend Setup**
   ```bash
   cd backend
   npm install
   npm run dev
   ```
   The backend server will start on port 5000

2. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   The frontend development server will start on port 5173

3. **Database Setup**
   - Make sure MongoDB is running on your system
   - The backend will connect to MongoDB at: mongodb://localhost:27017/mlm_system

## Usage

1. Create a root user by registering with a fake sponsor code
2. Use the root user's member code as sponsor code for new members
3. Members can be added to left or right positions
4. View your downline in the dashboard

## Features Implemented

1. Member Registration
   - Name
   - Email
   - Mobile
   - Sponsor Code validation
   - Position selection (Left/Right)
   - Automatic member code generation

2. Login System
   - JWT-based authentication
   - Secure password storage

3. Dashboard
   - Profile view
   - Downline member counts
   - Tree visualization

4. Binary Tree Implementation
   - Left/Right position management
   - Automatic spillover
   - Member count tracking

## Technical Details

- Frontend: React with Vite, Material-UI, React Router
- Backend: Node.js, Express, MongoDB
- Authentication: JWT tokens
- Database: MongoDB with Mongoose ODM
# Todo Application Backend

A secure REST API for todo management with user authentication.

## Features

- User registration and login with JWT authentication
- Password hashing with bcrypt
- CRUD operations for todos
- User-specific todo isolation
- JSON file-based storage
- Session management

## API Endpoints

### Authentication

#### POST /api/signup
Register a new user.

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully!",
  "data": {
    "id": "uuid",
    "username": "string",
    "token": "jwt_token"
  }
}
```

#### POST /api/login
Authenticate an existing user.

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful!",
  "data": {
    "id": "uuid",
    "username": "string",
    "token": "jwt_token"
  }
}
```

### Todos (Requires Authentication)

#### GET /api/todos
Get all todos for the authenticated user.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Todos retrieved successfully",
  "data": [
    {
      "id": "uuid",
      "userId": "uuid",
      "title": "string",
      "status": "pending|completed",
      "createdAt": "ISO_date",
      "updatedAt": "ISO_date"
    }
  ]
}
```

#### POST /api/todos
Create a new todo.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "title": "string"
}
```

#### PUT /api/todos/:id
Update an existing todo.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "title": "string (optional)",
  "status": "pending|completed (optional)"
}
```

#### DELETE /api/todos/:id
Delete a todo.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

### Profile

#### GET /api/profile
Get user profile with todo statistics.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "id": "uuid",
    "username": "string",
    "createdAt": "ISO_date",
    "todoStats": {
      "total": 10,
      "pending": 6,
      "completed": 4
    }
  }
}
```

## Installation

```bash
npm install
```

## Running

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## File Structure

- `server.js` - Main server file
- `users.json` - User data storage
- `todos.json` - Todo data storage
- `package.json` - Dependencies and scripts

## Security

- Passwords are hashed using bcrypt
- JWT tokens for authentication
- CORS enabled for frontend integration
- Input validation on all endpoints
- User isolation (users can only access their own data)
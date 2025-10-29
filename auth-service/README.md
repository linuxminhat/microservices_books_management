# Auth Service - JWT Authentication

## Overview
AuthService cung cấp JWT-based authentication cho Library Management System.

## Features
- User Registration
- User Login với JWT token
- Token validation
- Password encryption với BCrypt
- Role-based access (USER, ADMIN)

## API Endpoints

### 1. Register User
```
POST /api/auth/register
Content-Type: application/json

{
    "email": "user@example.com",
    "password": "password123",
    "fullName": "John Doe"
}
```

### 2. Login
```
POST /api/auth/login
Content-Type: application/json

{
    "email": "user@example.com",
    "password": "password123"
}
```

Response:
```json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "userId": 1,
    "email": "user@example.com",
    "fullName": "John Doe",
    "role": "USER"
}
```

### 3. Get User by ID
```
GET /api/auth/user/{userId}
Authorization: Bearer {token}
```

### 4. Get User by Email
```
GET /api/auth/user/email/{email}
Authorization: Bearer {token}
```

### 5. Validate Token
```
GET /api/auth/validate
Authorization: Bearer {token}
```

## Configuration

### JWT Settings
```yaml
app:
  jwt:
    secret: mySecretKey123456789012345678901234567890
    expiration: 86400000 # 24 hours
```

### Database
- MySQL database: `library_app`
- Table: `users`
- Auto-generated schema với Hibernate

## Security Features
- JWT token với expiration
- Password hashing với BCrypt
- CORS configuration
- Stateless authentication
- Role-based authorization

## Demo Users
Sau khi chạy service, bạn có thể tạo demo users:
- admin@cfc.com / 123456 (ADMIN role)
- user@cfc.com / 123456 (USER role)

## Port
Service chạy trên port: **8081**

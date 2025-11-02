# Hướng Dẫn Test API trên Postman
## Tổng Quan Các Backend Services
## AUTH SERVICE (Port 8081)
### Base URL: `http://localhost:8081/api/auth`
### 1.1. Authentication Endpoints
#### Register User

```
POST http://localhost:8081/api/auth/register
Content-Type: application/json

Body:
{
  "email": "user@cfc.com",
  "password": "password123",
  "fullName": "Test User"
}
```

#### Login
```
POST http://localhost:8081/api/auth/login
Content-Type: application/json

Body:
{
  "email": "admin@cfc.com",
  "password": "password123"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": 1,
  "email": "admin@cfc.com",
  "fullName": "Admin User",
  "role": "ADMIN"
}
```

#### Validate Token
```
GET http://localhost:8081/api/auth/validate
Authorization: Bearer {token}
```

#### Get User By ID
```
GET http://localhost:8081/api/auth/user/{userId}
Authorization: Bearer {token}
```

#### Get User By Email
```
GET http://localhost:8081/api/auth/user/email/{email}
Authorization: Bearer {token}
```

### 1.2. Admin User Management Endpoints

#### List All Users
```
GET http://localhost:8081/api/auth/admin/users
Authorization: Bearer {admin_token}
```

#### Get User By ID
```
GET http://localhost:8081/api/auth/admin/users/{id}
Authorization: Bearer {admin_token}
```

#### Update User (Full Name & Role)
```
PUT http://localhost:8081/api/auth/admin/users/{id}
Authorization: Bearer {admin_token}
Content-Type: application/json

Body:
{
  "fullName": "Updated Name",
  "role": "ADMIN",
  "enabled": true,
  "locked": false
}
```

#### Lock/Unlock User Account
```
PATCH http://localhost:8081/api/auth/admin/users/{id}/lock
Authorization: Bearer {admin_token}
Content-Type: application/json

Body:
{
  "locked": true
}
```

#### Change User Role
```
PATCH http://localhost:8081/api/auth/admin/users/{id}/role
Authorization: Bearer {admin_token}
Content-Type: application/json

Body:
{
  "role": "ADMIN"
}

```

#### Delete User
```
DELETE http://localhost:8081/api/auth/admin/users/{id}
Authorization: Bearer {admin_token}
```

---

## 2. BOOK SERVICE (Port 8082)
### Base URL: `http://localhost:8082/api/books`
### 2.1. Public Endpoints (Không cần authentication)
#### Get All Books (Pagination)
```
GET http://localhost:8082/api/books?page=0&size=5
```

#### Get Book By ID
```
GET http://localhost:8082/api/books/{bookId}
```

#### Search Books By Title
```
GET http://localhost:8082/api/books/search/findByTitleContaining?title=Java&page=0&size=5
```

#### Search Books By Category
```
GET http://localhost:8082/api/books/search/findByCategory?category=Fiction&page=0&size=5
```

### 2.2. Secure Endpoints (Cần Authentication)

#### Get Current Loans
```
GET http://localhost:8082/api/books/secure/currentloans
Authorization: Bearer {token}
```

#### Get Current Loans Count
```
GET http://localhost:8082/api/books/secure/currentloans/count
Authorization: Bearer {token}
```

#### Check If Book Checked Out By User
```
GET http://localhost:8082/api/books/secure/ischeckedout/byuser?bookId={bookId}
Authorization: Bearer {token}
```

#### Checkout Book
```
PUT http://localhost:8082/api/books/secure/checkout?bookId={bookId}
Authorization: Bearer {token}
```

#### Return Book
```
PUT http://localhost:8082/api/books/secure/return?bookId={bookId}
Authorization: Bearer {token}
```

#### Renew Loan
```
PUT http://localhost:8082/api/books/secure/renew/loan?bookId={bookId}
Authorization: Bearer {token}
```
### 2.3. Admin Only Endpoints (Cần ADMIN role)

#### Create Book (Internal)
```
POST http://localhost:8082/api/books/internal
Authorization: Bearer {admin_token}
Content-Type: application/json

Body:
{
  "title": "New Book Title",
  "author": "Author Name",
  "description": "Book description",
  "copies": 10,
  "copiesAvailable": 10,
  "category": "Fiction",
  "img": "image-url.jpg"
}
```

#### Update Book (Internal)
```
PUT http://localhost:8082/api/books/internal/{bookId}
Authorization: Bearer {admin_token}
Content-Type: application/json

Body:
{
  "title": "Updated Title",
  "author": "Updated Author",
  "description": "Updated description",
  "copies": 15,
  "copiesAvailable": 12,
  "category": "Non-Fiction",
  "img": "updated-image.jpg"
}
```

#### Delete Book (Internal)
```
DELETE http://localhost:8082/api/books/internal/{bookId}
Authorization: Bearer {admin_token}
```

#### Increase Book Quantity
```
PATCH http://localhost:8082/api/books/internal/{bookId}/quantity/increase?amount=5
Authorization: Bearer {admin_token}
```

#### Decrease Book Quantity
```
PATCH http://localhost:8082/api/books/internal/{bookId}/quantity/decrease?amount=2
Authorization: Bearer {admin_token}
```

---

## 3. MESSAGE SERVICE (Port 8085)
### Base URL: `http://localhost:8085/api/messages`
### 3.1. User Endpoints
#### Post Message (User Question)
```
POST http://localhost:8085/api/messages/secure/add/message
Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "title": "Question Title",
  "question": "My question here",
  "userEmail": "user@cfc.com"
}
```

#### Get User Messages (Repository Endpoint)
```
GET http://localhost:8085/api/messages/search/findByUserEmail?user_email=user@cfc.com&page=0&size=5
Authorization: Bearer {token}
```

### 3.2. Admin Endpoints

#### Admin Response to Message
```
PUT http://localhost:8085/api/messages/secure/admin/message
Authorization: Bearer {admin_token}
Content-Type: application/json

Body:
{
  "id": 1,
  "response": "Admin response to the question"
}
```

#### Get Pending Messages (Repository Endpoint)
```
GET http://localhost:8085/api/messages/search/findByClosed?closed=false&page=0&size=5
Authorization: Bearer {admin_token}
```

---

## 4. REVIEW SERVICE (Port 8084)
### Base URL: `http://localhost:8084/api/reviews`
### All Endpoints require Authentication
#### Check If User Reviewed Book
```
GET http://localhost:8084/api/reviews/secure/user/book?bookId={bookId}
Authorization: Bearer {token}
```

#### Get User Review for Book
```
GET http://localhost:8084/api/reviews/secure/user/review?bookId={bookId}
Authorization: Bearer {token}
```

#### Post Review
```
POST http://localhost:8084/api/reviews/secure
Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "bookId": 1,
  "rating": 5,
  "reviewDescription": "Great book!"
}
```

#### Update Review
```
PUT http://localhost:8084/api/reviews/secure
Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "bookId": 1,
  "rating": 4,
  "reviewDescription": "Updated review"
}
```

#### Delete Review
```
DELETE http://localhost:8084/api/reviews/secure?bookId={bookId}
Authorization: Bearer {token}
```

---

## 5.ADMIN SERVICE (Port 8083)

### Base URL: `http://localhost:8083/api/admin/users`

**Lưu ý**: Service này proxy request đến Auth Service, nên sử dụng trực tiếp Auth Service endpoints.

#### List All Users
```
GET http://localhost:8083/api/admin/users
Authorization: Bearer {admin_token}
```

#### Get User By ID
```
GET http://localhost:8083/api/admin/users/{id}
Authorization: Bearer {admin_token}
```

#### Update User
```
PUT http://localhost:8083/api/admin/users/{id}
Authorization: Bearer {admin_token}
Content-Type: application/json

Body:
{
  "fullName": "Updated Name",
  "role": "ADMIN",
  "enabled": true,
  "locked": false
}
```

#### Lock User
```
PATCH http://localhost:8083/api/admin/users/{id}/lock
Authorization: Bearer {admin_token}
Content-Type: application/json

Body:
{
  "locked": true
}
```

#### Change Role
```
PATCH http://localhost:8083/api/admin/users/{id}/role
Authorization: Bearer {admin_token}
Content-Type: application/json

Body:
{
  "role": "ADMIN"
}
```

#### Delete User
```
DELETE http://localhost:8083/api/admin/users/{id}
Authorization: Bearer {admin_token}
```

---
 
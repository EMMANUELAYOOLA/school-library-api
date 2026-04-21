# 📚 School Library Management API

A production-ready RESTful API for managing a school library system built with Node.js, Express.js, and MongoDB (Mongoose).

## 🎯 Features

### Core Features
- **Author Management**: Create, read, update, and delete authors
- **Book Management**: Full CRUD with ISBN uniqueness validation
- **Student Management**: Register and manage library users
- **Library Attendant Management**: Staff management with JWT authentication
- **Book Borrowing & Returns**: Complete borrowing workflow with validation
- **Data Relationships**: Books linked to authors, students, and attendants

### Bonus Features (Strong Student Implementations)
- ✅ **Pagination**: All GET endpoints support pagination
- ✅ **Search**: Search books by title or ISBN
- ✅ **Duplicate Prevention**: ISBN uniqueness enforced at database level
- ✅ **Input Validation**: Comprehensive validation using express-validator middleware
- ✅ **Overdue Check**: Automatic overdue book detection
- ✅ **JWT Authentication**: Secure authentication for protected endpoints
- ✅ **Error Handling**: Global error handling with operational vs programming errors
- ✅ **Security**: Helmet, CORS, Rate Limiting, and password hashing
- ✅ **MVC Architecture**: Clean separation of concerns

## 🛠 Tech Stack

| Technology | Purpose |
|------------|---------|
| Node.js | Runtime environment |
| Express.js | Web framework |
| MongoDB | Database |
| Mongoose | ODM (Object Document Mapper) |
| JWT | Authentication |
| bcryptjs | Password hashing |
| express-validator | Input validation |
| Helmet | Security headers |
| CORS | Cross-origin resource sharing |
| Morgan | HTTP request logging |

## 📁 Project Structure

```
library-system/
├── config/
│   └── db.js                 # Database connection
├── controllers/
│   ├── authorController.js   # Author request handlers
│   ├── bookController.js     # Book request handlers
│   ├── studentController.js  # Student request handlers
│   └── attendantController.js # Attendant request handlers
├── middleware/
│   ├── auth.js               # JWT authentication
│   ├── errorHandler.js       # Global error handling
│   ├── validate.js           # Validation middleware
│   └── validators.js         # Validation rules
├── models/
│   ├── Author.js             # Author schema
│   ├── Book.js               # Book schema
│   ├── Student.js            # Student schema
│   └── LibraryAttendant.js   # Attendant schema
├── routes/
│   ├── authorRoutes.js       # Author endpoints
│   ├── bookRoutes.js         # Book endpoints
│   ├── studentRoutes.js      # Student endpoints
│   └── attendantRoutes.js    # Attendant endpoints
├── services/
│   ├── authorService.js      # Author business logic
│   ├── bookService.js        # Book business logic
│   ├── studentService.js     # Student business logic
│   └── attendantService.js   # Attendant business logic
├── utils/
│   ├── AppError.js           # Custom error class
│   └── catchAsync.js         # Async error wrapper
├── .env                      # Environment variables
├── .env.example              # Environment template
├── .gitignore                # Git ignore rules
├── package.json              # Dependencies & scripts
└── server.js                 # Application entry point
```

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/school-library-api.git
   cd school-library-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` file:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/school_library
   JWT_SECRET=your_super_secret_key_here
   JWT_EXPIRE=7d
   NODE_ENV=development
   ```

4. **Start the server**
   ```bash
   # Development mode (with auto-reload)
   npm run dev

   # Production mode
   npm start
   ```

5. **Verify installation**
   Visit: `http://localhost:5000/api/health`

## 📖 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication
Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 👤 Author Endpoints

### Create Author
```http
POST /api/authors
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Chinua Achebe",
  "bio": "Nigerian novelist, poet, and critic"
}
```

### Get All Authors
```http
GET /api/authors
```

### Get Single Author
```http
GET /api/authors/:id
```

### Update Author
```http
PUT /api/authors/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Chinua Achebe",
  "bio": "Updated biography"
}
```

### Delete Author
```http
DELETE /api/authors/:id
Authorization: Bearer <token>
```

---

## 📕 Book Endpoints

### Create Book
```http
POST /api/books
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Things Fall Apart",
  "isbn": "ISBN-9780385474542",
  "authors": ["65a1b2c3d4e5f6g7h8i9j0k1"]
}
```

### Get All Books (with Pagination & Search)
```http
GET /api/books?page=1&limit=10&search=things
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page, max 100 (default: 10)
- `search` (optional): Search by title or ISBN

### Get Single Book
```http
GET /api/books/:id
```

**Response when book is OUT:**
```json
{
  "status": "success",
  "data": {
    "book": {
      "title": "Things Fall Apart",
      "status": "OUT",
      "borrowedBy": {
        "name": "John Doe",
        "email": "john@school.edu",
        "studentId": "STU001"
      },
      "issuedBy": {
        "name": "Jane Smith",
        "staffId": "LIB001"
      },
      "returnDate": "2026-04-01T00:00:00.000Z",
      "isOverdue": false
    }
  }
}
```

### Update Book
```http
PUT /api/books/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "authors": ["65a1b2c3d4e5f6g7h8i9j0k1"]
}
```

### Delete Book
```http
DELETE /api/books/:id
Authorization: Bearer <token>
```

---

## 📤 Borrow & Return Endpoints

### Borrow Book
```http
POST /api/books/:id/borrow
Authorization: Bearer <token>
Content-Type: application/json

{
  "studentId": "65a1b2c3d4e5f6g7h8i9j0k1",
  "attendantId": "65a1b2c3d4e5f6g7h8i9j0k2",
  "returnDate": "2026-04-01"
}
```

**Rules:**
- Book must have status `"IN"`
- Sets status to `"OUT"`
- Records student, attendant, and return date

### Return Book
```http
POST /api/books/:id/return
Authorization: Bearer <token>
```

**Rules:**
- Book must have status `"OUT"`
- Sets status to `"IN"`
- Clears borrowedBy, issuedBy, and returnDate

### Get Overdue Books
```http
GET /api/books/overdue
Authorization: Bearer <token>
```

---

## 🎓 Student Endpoints

### Create Student
```http
POST /api/students
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@school.edu",
  "studentId": "STU001"
}
```

### Get All Students
```http
GET /api/students
Authorization: Bearer <token>
```

### Get Single Student (with borrowed books)
```http
GET /api/students/:id
Authorization: Bearer <token>
```

---

## 👔 Library Attendant Endpoints

### Create Attendant
```http
POST /api/attendants
Content-Type: application/json

{
  "name": "Jane Smith",
  "staffId": "LIB001",
  "password": "password123"
}
```

### Get All Attendants
```http
GET /api/attendants
Authorization: Bearer <token>
```

### Login
```http
POST /api/attendants/login
Content-Type: application/json

{
  "staffId": "LIB001",
  "password": "password123"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "attendant": {
      "id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "name": "Jane Smith",
      "staffId": "LIB001",
      "role": "attendant"
    }
  }
}
```

---

## 🔒 Authentication Flow

1. Create an attendant (no auth required for first attendant)
2. Login to get JWT token
3. Use token in `Authorization: Bearer <token>` header for protected endpoints

---

## 🧪 Testing with Postman

### Recommended Postman Collection Structure

1. **Environment Variables:**
   - `base_url`: `http://localhost:5000/api`
   - `token`: (auto-populated after login)

2. **Collection Folders:**
   - 🔓 **Public**: Health check, Login
   - 👤 **Authors**: All author endpoints
   - 📕 **Books**: All book endpoints + borrow/return
   - 🎓 **Students**: All student endpoints
   - 👔 **Attendants**: All attendant endpoints

3. **Pre-request Script for Auth:**
   ```javascript
   pm.request.headers.add({
     key: 'Authorization',
     value: `Bearer ${pm.environment.get('token')}`
   });
   ```

---

## 📊 Data Models

### Author
| Field | Type | Required | Unique |
|-------|------|----------|--------|
| name | String | Yes | No |
| bio | String | No | No |
| createdAt | Date | Auto | No |

### Book
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| title | String | Yes | Max 200 chars |
| isbn | String | Yes | Unique, format: ISBN-XXXXXXXXXXXXX |
| authors | [ObjectId] | Yes | References Author |
| status | String | No | Enum: "IN", "OUT" |
| borrowedBy | ObjectId | No | References Student |
| issuedBy | ObjectId | No | References Attendant |
| returnDate | Date | No | Future date only |
| createdAt | Date | Auto | - |

### Student
| Field | Type | Required | Unique |
|-------|------|----------|--------|
| name | String | Yes | No |
| email | String | Yes | Yes |
| studentId | String | Yes | Yes |
| createdAt | Date | Auto | No |

### LibraryAttendant
| Field | Type | Required | Unique |
|-------|------|----------|--------|
| name | String | Yes | No |
| staffId | String | Yes | Yes |
| password | String | Yes | No (hashed) |
| role | String | No | Enum: "attendant", "admin" |
| createdAt | Date | Auto | No |

---

## ⚠️ Error Handling

The API returns structured error responses:

```json
{
  "status": "fail",
  "message": "Book is already borrowed",
  "statusCode": 400
}
```

**Common Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate data)
- `500` - Internal Server Error

---

## 🚀 Deployment

### Deploy to Render/Railway/Heroku
1. Set environment variables in platform dashboard
2. Add MongoDB Atlas connection string
3. Set `NODE_ENV=production`
4. Deploy from GitHub repository

### Docker (Optional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["node", "server.js"]
```

---

## 📝 Assignment Checklist

- ✅ Node.js & Express.js setup
- ✅ MongoDB with Mongoose ODM
- ✅ Author CRUD endpoints
- ✅ Book CRUD endpoints
- ✅ Student endpoints
- ✅ Library Attendant endpoints
- ✅ Book borrowing logic
- ✅ Book return logic
- ✅ Data relationships (populate)
- ✅ Input validation middleware
- ✅ JWT Authentication
- ✅ Pagination
- ✅ Search functionality
- ✅ Duplicate ISBN prevention
- ✅ Overdue book checking
- ✅ MVC architecture
- ✅ Error handling
- ✅ Security best practices
- ✅ Comprehensive README

---

## 📜 License

MIT License - TS Academy Phoenix Cohort

## 👨‍🏫 Author

**TS Academy Backend Development - Phoenix Cohort**
Assignment Date: 21/03/2026

---

## 🤝 Support

For issues or questions:
1. Check the API health endpoint: `GET /api/health`
2. Verify MongoDB connection
3. Check JWT token validity
4. Review request body format

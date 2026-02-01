# Araby Tutoring Management System API

A comprehensive .NET Web API for managing tutoring sessions, students, payments, grades, and reports with role-based authentication.

## 🚀 Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control (Teacher, Assistant, Student)
- **User Management**: Create and manage students and assistants
- **Session Management**: Schedule and manage tutoring sessions with student enrollment
- **Attendance Tracking**: Record and analyze attendance with comprehensive statistics
- **Grade Management**: Track student grades with automatic percentage calculations
- **Payment Processing**: Manage payments with status tracking and overdue detection
- **Student Groups**: Organize students into groups with fee type assignments
- **Reports & Analytics**: Financial reports, attendance summaries, performance tracking, and payment defaulters
- **Egypt Standard Time**: All datetime operations use Egypt timezone
- **Global Exception Handling**: Centralized error handling with detailed logging

## 📋 Prerequisites

- .NET 10.0 SDK or later
- SQL Server (LocalDB, Express, or Full)
- Visual Studio 2022 or VS Code (optional)

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd araby
```

### 2. Update Configuration

Edit `appsettings.json` and update the connection string:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=YOUR_SERVER;Database=ArabyTutoringDB;Trusted_Connection=True;TrustServerCertificate=True;MultipleActiveResultSets=true"
  },
  "Jwt": {
    "Key": "YourSuperSecretKeyThatIsAtLeast32CharactersLongForHS256Algorithm",
    "Issuer": "ArabyTutoringSystem",
    "Audience": "ArabyTutoringUsers"
  }
}
```

### 3. Apply Database Migrations

```bash
cd araby
dotnet ef database update
```

### 4. Run the Application

```bash
dotnet run
```

The API will be available at:
- HTTPS: `https://localhost:5001`
- HTTP: `http://localhost:5000`
- Swagger UI: `https://localhost:5001/swagger`

## 📚 API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Description | Authorization |
|--------|----------|-------------|---------------|
| POST | `/login` | User login | AllowAnonymous |
| POST | `/logout` | User logout | Authorized |
| GET | `/current-user` | Get current user info | Authorized |

### User Management (`/api/users`)

| Method | Endpoint | Description | Authorization |
|--------|----------|-------------|---------------|
| POST | `/student` | Create student | Teacher, Assistant |
| POST | `/assistant` | Create assistant | Teacher |
| GET | `/students` | Get all students | Teacher, Assistant |
| GET | `/assistants` | Get all assistants | Teacher |
| GET | `/{id}` | Get user by ID | Teacher, Assistant |
| PUT | `/{id}` | Update user | Teacher, Assistant |
| PUT | `/{id}/role` | Change user role | Teacher |
| PUT | `/{id}/toggle-active` | Toggle active status | Teacher, Assistant |
| DELETE | `/{id}` | Delete user | Teacher |
| GET | `/student/{id}/credentials` | Get student credentials | Teacher, Assistant |

### Sessions (`/api/sessions`)

| Method | Endpoint | Description | Authorization |
|--------|----------|-------------|---------------|
| POST | `/` | Create session | Teacher, Assistant |
| GET | `/` | Get all sessions | All |
| GET | `/{id}` | Get session details | All |
| PUT | `/{id}` | Update session | Teacher, Assistant |
| DELETE | `/{id}` | Delete session | Teacher, Assistant |
| POST | `/{id}/students` | Add students to session | Teacher, Assistant |
| DELETE | `/{sessionId}/students/{studentId}` | Remove student | Teacher, Assistant |
| GET | `/upcoming` | Get upcoming sessions | All |
| GET | `/student/{studentId}` | Get student's sessions | All |

### Attendance (`/api/attendance`)

| Method | Endpoint | Description | Authorization |
|--------|----------|-------------|---------------|
| POST | `/` | Record attendance | Teacher, Assistant |
| GET | `/session/{sessionId}` | Get session attendance | All |
| GET | `/student/{studentId}` | Get student attendance | All |
| PUT | `/{id}` | Update attendance | Teacher, Assistant |
| GET | `/statistics/student/{studentId}` | Student statistics | All |
| GET | `/statistics/overall` | Overall statistics | Teacher, Assistant |

### Grades (`/api/grades`)

| Method | Endpoint | Description | Authorization |
|--------|----------|-------------|---------------|
| POST | `/` | Create grade | Teacher, Assistant |
| GET | `/student/{studentId}` | Get student grades | All |
| GET | `/{id}` | Get grade details | All |
| PUT | `/{id}` | Update grade | Teacher, Assistant |
| DELETE | `/{id}` | Delete grade | Teacher, Assistant |
| GET | `/student/{studentId}/statistics` | Student statistics | All |

### Payments (`/api/payments`)

| Method | Endpoint | Description | Authorization |
|--------|----------|-------------|---------------|
| POST | `/` | Record payment | Teacher, Assistant |
| GET | `/student/{studentId}` | Get payment history | All |
| GET | `/` | Get all payments | Teacher, Assistant |
| GET | `/{id}` | Get payment details | All |
| PUT | `/{id}/status` | Update payment status | Teacher, Assistant |
| GET | `/pending` | Get pending payments | Teacher, Assistant |
| GET | `/overdue` | Get overdue payments | Teacher, Assistant |
| GET | `/statistics` | Get statistics | Teacher |

### Fee Types (`/api/fee-types`)

| Method | Endpoint | Description | Authorization |
|--------|----------|-------------|---------------|
| POST | `/` | Create fee type | Teacher |
| GET | `/` | Get all fee types | All |
| GET | `/{id}` | Get fee type by ID | All |
| PUT | `/{id}` | Update fee type | Teacher |
| DELETE | `/{id}` | Delete fee type | Teacher |
| POST | `/{id}/groups` | Assign groups | Teacher |

### Student Groups (`/api/student-groups`)

| Method | Endpoint | Description | Authorization |
|--------|----------|-------------|---------------|
| POST | `/` | Create group | Teacher, Assistant |
| GET | `/` | Get all groups | All |
| GET | `/{id}` | Get group by ID | All |
| PUT | `/{id}` | Update group | Teacher, Assistant |
| DELETE | `/{id}` | Delete group | Teacher, Assistant |
| POST | `/{id}/students` | Add students | Teacher, Assistant |
| DELETE | `/{groupId}/students/{studentId}` | Remove student | Teacher, Assistant |

### Reports (`/api/reports`)

| Method | Endpoint | Description | Authorization |
|--------|----------|-------------|---------------|
| GET | `/financial/monthly?year={year}&month={month}` | Monthly financial report | Teacher |
| GET | `/attendance/summary` | Attendance summary | Teacher, Assistant |
| GET | `/students/performance` | Student performance | Teacher, Assistant |
| GET | `/payments/defaulters` | Payment defaulters | Teacher, Assistant |

## 🔐 Authentication Guide

### 1. Login

**Request:**
```http
POST /api/auth/login
Content-Type: application/json

{
  "userName": "teacher1",
  "password": "Password123!"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": "user-123",
  "userName": "teacher1",
  "fullName": "Ahmed Mohamed",
  "role": 1
}
```

### 2. Use Token in Requests

Add the token to the Authorization header:

```http
GET /api/sessions
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. Roles

- **Teacher (1)**: Full access to all endpoints
- **Assistant (2)**: Limited access (cannot create assistants, change roles, delete users, view payment statistics)
- **Student (3)**: Read-only access to their own data

## 📝 Sample Requests

### Create Student

```http
POST /api/users/student
Authorization: Bearer {token}
Content-Type: application/json

{
  "userName": "student1",
  "password": "Student123!",
  "fullName": "Sara Ali",
  "phoneNumber": "01098765432",
  "academicLevel": "Grade 10"
}
```

### Create Session

```http
POST /api/sessions
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Math Session - Algebra",
  "startTime": "2026-01-25T10:00:00",
  "endTime": "2026-01-25T12:00:00",
  "location": "Room 101",
  "type": 2,
  "maxStudents": 20
}
```

### Record Attendance

```http
POST /api/attendance
Authorization: Bearer {token}
Content-Type: application/json

{
  "sessionId": 5,
  "studentId": "student-id-1",
  "status": 1,
  "notes": "On time"
}
```

### Record Payment

```http
POST /api/payments
Authorization: Bearer {token}
Content-Type: application/json

{
  "studentId": "student-123",
  "feeTypeId": 1,
  "amountPaid": 500.00,
  "paymentDate": "2026-01-24T10:00:00",
  "periodStart": "2026-01-01",
  "periodEnd": "2026-01-31"
}
```

## 🏗️ Project Structure

```
araby/
├── Controllers/          # API Controllers (9 controllers, 58 endpoints)
├── Services/            # Business logic layer (9 services)
│   └── Interfaces/      # Service interfaces
├── Repositories/        # Data access layer (7 repositories)
│   └── Interfaces/      # Repository interfaces
├── Models/              # Entity models and API response
├── DTOs/                # Data transfer objects
├── Data/                # DbContext and configurations
├── Helpers/             # Utility classes (TimeZoneHelper)
├── Middleware/          # Custom middleware (Exception handler)
├── Enums/               # Enumerations
└── Program.cs           # Application entry point
```

## 🛡️ Key Features

### Egypt Standard Time
All datetime operations automatically use Egypt Standard Time through the `TimeZoneHelper` class.

### Global Exception Handling
All exceptions are caught by the global exception handler middleware and returned in a consistent format with Egypt timezone timestamps.

### Validation
- Password requirements: 8+ characters, uppercase, lowercase, digit, special character
- Score validation: Score ≤ MaxScore
- MaxStudents validation for group sessions
- Teacher protection from deletion/deactivation

### Automatic Calculations
- Session duration (EndTime - StartTime)
- Attendance percentage
- Grade percentage ((Score / MaxScore) * 100)
- Payment statistics

## 🧪 Testing with Swagger

1. Navigate to `https://localhost:5001/swagger`
2. Click "Authorize" button
3. Enter: `Bearer {your-token}` (get token from login endpoint)
4. Click "Authorize"
5. Test any endpoint

## 📦 NuGet Packages

- Microsoft.EntityFrameworkCore (10.0.2)
- Microsoft.EntityFrameworkCore.SqlServer (10.0.2)
- Microsoft.AspNetCore.Identity.EntityFrameworkCore (10.0.2)
- Microsoft.AspNetCore.Authentication.JwtBearer (10.0.2)
- System.IdentityModel.Tokens.Jwt (8.15.0)
- Swashbuckle.AspNetCore (10.1.0)

## 📄 License

This project is licensed under the MIT License.

## 👥 Support

For support, please contact the development team.

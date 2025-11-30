# Admin Authentication System

## Overview
This project now includes a complete admin authentication system with JWT-based security.

## Admin Credentials

**Default Admin Account:**
- **Email:** admin@gmail.com
- **Passkey:** admin123
- **Organization:** FarmQuest

## Features

### Backend
- **Admin Model** (`/backend/models/Admin.js`)
  - Name, email, password (hashed)
  - Organization affiliation
  - Role-based access (admin, super_admin)
  - Active/inactive status

- **Admin Authentication** (`/backend/controllers/adminController.js`)
  - Secure login with bcrypt password hashing
  - JWT token generation (24-hour expiration)
  - Admin profile retrieval
  - Admin creation endpoint (for setup)

- **Admin Middleware** (`/backend/middleware/adminAuth.js`)
  - Token verification
  - Role-based access control
  - Protected admin routes

- **Admin Routes** (`/backend/routes/admin.js`)
  - `POST /api/admin/login` - Admin login
  - `POST /api/admin/create` - Create new admin (for initial setup)
  - `GET /api/admin/profile` - Get admin profile (protected)

### Frontend
- **Real Authentication**
  - No more mock data or fallback authentication
  - JWT token stored in localStorage
  - Admin data stored separately from farmer auth
  - Automatic token validation on protected routes

- **Admin Login Screen** (`/frontend/components/auth/admin-passkey-login-screen.jsx`)
  - Email and passkey input
  - Real API integration
  - Error handling with toast notifications
  - Show/hide passkey toggle

- **Protected Admin Routes**
  - Admin layout validates token on mount
  - Automatic redirect to login if unauthenticated
  - Admin data displayed in navigation

## How to Use

### First Time Setup
1. Run the seed script to create the initial admin:
   ```bash
   cd backend
   node seedAdmin.js
   ```

2. Use the default credentials to login:
   - Email: admin@gmail.com
   - Passkey: admin123

### Creating Additional Admins
Use the API endpoint or create a seed script:
```bash
POST http://localhost:4000/api/admin/create
Content-Type: application/json

{
  "name": "New Admin",
  "email": "newadmin@example.com",
  "password": "securepassword",
  "organization": "FarmQuest",
  "role": "admin"
}
```

### Login Flow
1. Navigate to `/admin/login`
2. Enter email and passkey
3. On successful login:
   - JWT token stored in `localStorage` as `farmquest_admin_token`
   - Admin data stored as `farmquest_admin`
   - Redirected to `/admin/dashboard`

### Token Management
- **Storage:** localStorage (client-side)
- **Expiration:** 24 hours
- **Validation:** Checked on every protected route
- **Logout:** Clears token and admin data

## Security Features
- ✅ Password hashing with bcrypt (salt rounds: 10)
- ✅ JWT token with expiration
- ✅ Role-based access control
- ✅ Protected routes with middleware
- ✅ Admin-only endpoints
- ✅ Active/inactive admin status
- ✅ Separate authentication from farmer accounts

## API Endpoints

### Public Endpoints
- `POST /api/admin/login` - Admin login

### Protected Endpoints (require valid admin token)
- `GET /api/admin/profile` - Get current admin profile

### Setup Endpoint (should be protected in production)
- `POST /api/admin/create` - Create new admin account

## Token Format
The JWT token contains:
```json
{
  "adminId": "admin_id",
  "role": "admin",
  "userType": "admin",
  "exp": 1234567890
}
```

## Removed Features
- ❌ Mock authentication
- ❌ Fallback authentication
- ❌ Hardcoded credentials
- ❌ Client-side only validation

## Important Notes
1. **Production Security:** In production, remove or protect the `/api/admin/create` endpoint
2. **Password Policy:** Consider implementing stronger password requirements
3. **Token Refresh:** Consider implementing refresh token mechanism for better UX
4. **Rate Limiting:** Add rate limiting to prevent brute force attacks
5. **HTTPS:** Always use HTTPS in production for secure token transmission

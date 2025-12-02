# Admin Authentication Testing

## Test Admin Login Endpoint

You can test the admin login using curl or any API client:

### Using curl:
```bash
curl -X POST http://localhost:4000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@gmail.com",
    "passkey": "admin123"
  }'
```

### Expected Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "id": "...",
    "name": "Admin User",
    "email": "admin@gmail.com",
    "role": "admin",
    "organization": "FarmQuest"
  }
}
```

### Using the Frontend:
1. Navigate to: http://localhost:3000/admin/login
2. Enter credentials:
   - Email: admin@gmail.com
   - Passkey: admin123
3. Click "Login as Admin"
4. You should be redirected to the admin dashboard

## Protected Routes Test

### Get Admin Profile (requires token):
```bash
curl -X GET http://localhost:4000/api/admin/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Expected Response:
```json
{
  "admin": {
    "_id": "...",
    "name": "Admin User",
    "email": "admin@gmail.com",
    "organization": "FarmQuest",
    "role": "admin",
    "isActive": true,
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

## Error Cases

### Invalid Credentials:
```bash
curl -X POST http://localhost:4000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@gmail.com",
    "passkey": "wrongpassword"
  }'
```

Expected: 401 Unauthorized
```json
{
  "message": "Invalid credentials"
}
```

### Missing Token:
```bash
curl -X GET http://localhost:4000/api/admin/profile
```

Expected: 401 Unauthorized
```json
{
  "message": "No token provided"
}
```

### Expired Token:
After 24 hours, the token will expire and return:
```json
{
  "message": "Token expired"
}
```

# API Contract: Login

## Endpoint
`POST /api/auth/login`

## Request
**Content-Type**: `application/json`

```json
{
  "email": "admin@example.com",
  "password": "securepassword123"
}
```

## Response (Success: 200 OK)
**Content-Type**: `application/json`

```json
{
  "_id": "1712423123456",
  "name": "Admin User",
  "email": "admin@example.com",
  "role": "organizer",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## Response (Error: 401 Unauthorized)
**Content-Type**: `application/json`

```json
{
  "message": "Invalid email or password"
}
```

## Response (Error: 500 Server Error)
**Content-Type**: `application/json`

```json
{
  "message": "Database connection failed"
}
```

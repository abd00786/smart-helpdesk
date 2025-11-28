# CORS Configuration Setup

## Problem Fixed
Your frontend at `https://smart-helpdesk-orpin.vercel.app` couldn't access the backend API due to missing CORS headers.

## Solution
The backend now has **configurable CORS** using environment variables.

## How to Fix It

### On Your Backend Server (b4a.run)

1. **Add/Update Environment Variable:**
   ```
   CORS_ORIGIN=http://localhost:3000,http://localhost:5173,https://smart-helpdesk-orpin.vercel.app
   ```

2. **Add your backend URL if needed:**
   ```
   CORS_ORIGIN=http://localhost:3000,http://localhost:5173,https://smart-helpdesk-orpin.vercel.app,https://smarthelpdeskbackend-imasvl2e.b4a.run
   ```

### For Local Development
Your `.env` file should have:
```
CORS_ORIGIN=http://localhost:3000,http://localhost:5173
```

### For Production/Deployment
Set the environment variable in your hosting platform (b4a.run, Vercel, etc.):
```
CORS_ORIGIN=https://smart-helpdesk-orpin.vercel.app,https://your-backend-domain.com
```

## What Changed

### Backend Configuration (server.js)
- ✅ CORS now reads from `CORS_ORIGIN` environment variable
- ✅ Supports multiple origins (comma-separated)
- ✅ Credentials enabled for authentication
- ✅ Preflight requests handled correctly
- ✅ Added health check endpoint: `GET /api/health`

### Allowed Methods
```
GET, POST, PUT, PATCH, DELETE, OPTIONS
```

### Allowed Headers
```
Content-Type, Authorization
```

## Testing

After deploying with the updated `.env`, test with:
```bash
curl -X OPTIONS https://smarthelpdeskbackend-imasvl2e.b4a.run/api/auth/login \
  -H "Origin: https://smart-helpdesk-orpin.vercel.app" \
  -H "Access-Control-Request-Method: POST" \
  -v
```

You should see `Access-Control-Allow-Origin` header in response.

## Frontend .env Update
Your frontend `.env.example` already has:
```
VITE_API_URL=http://localhost:5000/api
```

For production, update to:
```
VITE_API_URL=https://smarthelpdeskbackend-imasvl2e.b4a.run/api
```

# Redis & MongoDB Configuration Guide

## ✅ Current Status

Your backend is now ready with:
- ✅ **Redis**: Installed and configured with Upstash support
- ✅ **MongoDB**: Connected and working
- ✅ **CORS**: Fixed and configured for Vercel deployment
- ✅ **Health Checks**: Endpoints available for diagnostics

## 🚀 Quick Start - For Local Development

Your backend is currently running with **local Redis** at `localhost:6379` and **local MongoDB**.

To test locally:
1. Backend is running at: `http://localhost:5000`
2. Health check: `http://localhost:5000/api/health`
3. Cache stats: `http://localhost:5000/api/cache-stats`

## ☁️ Configure for Production (Upstash Redis + MongoDB Atlas)

### Step 1: Set Up Upstash Redis

1. Go to [https://console.upstash.com](https://console.upstash.com)
2. Sign in or create an account
3. Create a new Redis database (free tier available)
4. Copy your **Redis URL** - it will look like:
   ```
   rediss://default:YOUR_PASSWORD@YOUR_HOST.upstash.io:YOUR_PORT
   ```

### Step 2: Set Up MongoDB Atlas

1. Go to [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster (free tier available)
3. Create a database user and password
4. Get your connection string - it will look like:
   ```
   mongodb+srv://username:password@cluster-name.mongodb.net/database-name?retryWrites=true&w=majority
   ```

### Step 3: Update Your Backend Environment (.env)

Replace these values in your `.env` file:

```dotenv
# MongoDB - Use your MongoDB Atlas connection string
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database-name?retryWrites=true&w=majority

# Redis - Use your Upstash URL
REDIS_URL=rediss://default:YOUR_PASSWORD@YOUR_HOST.upstash.io:YOUR_PORT

# CORS - Keep this for Vercel deployment
CORS_ORIGIN=http://localhost:3000,http://localhost:5173,https://smart-helpdesk-orpin.vercel.app

# JWT & Port
JWT_SECRET=eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiIsImtpZCI6ImVlMzA0YTFjNmE4YTU5ODQyM2RlYTc2YWEzM2ZkMWIxIn0.e30.rQ7nlITwBf0aWgrTDJI_VTy0i6W2tb4GNsT3BG8afxMUwqkzzaxhT9xsbMPAMR5Ynk4HWjvAAg_hwsPNeh4jDw
PORT=5000
NODE_ENV=production
```

### Step 4: Deploy to b4a.run

1. Push your changes to GitHub:
   ```bash
   git add .
   git commit -m "Configure Upstash Redis and MongoDB Atlas"
   git push
   ```

2. On your b4a.run deployment:
   - Set environment variables with the values from Step 1 & 2
   - Redeploy your backend
   - Verify with health check endpoint

### Step 5: Verify Production Configuration

Test your production backend:

```bash
# Health check
curl https://smarthelpdeskbackend-imasvl2e.b4a.run/api/health

# Cache stats
curl https://smarthelpdeskbackend-imasvl2e.b4a.run/api/cache-stats
```

Expected response:
```json
{
  "status": "healthy",
  "services": {
    "mongodb": "pending",
    "redis": "connected"
  }
}
```

## 🔧 Troubleshooting

### Redis Connection Issues

**If Redis shows "disconnected":**
1. Check your `REDIS_URL` format: `rediss://default:password@host:port`
2. Verify credentials from Upstash console
3. Ensure TLS is enabled for Upstash URLs

**If using local Redis:**
```bash
# Install Redis (on Windows with WSL2 or Docker)
# Or download from: https://github.com/microsoftarchive/redis/releases

# Start Redis
redis-server
```

### MongoDB Connection Issues

**If MongoDB shows "disconnected":**
1. Check your `MONGO_URI` format with correct username:password
2. Whitelist your IP in MongoDB Atlas security settings
3. Ensure database exists on MongoDB Atlas

### CORS Errors from Vercel

If you get "No 'Access-Control-Allow-Origin' header":
1. Verify `CORS_ORIGIN` env var is set on b4a.run
2. Restart/redeploy backend after setting variables
3. Check that `https://smart-helpdesk-orpin.vercel.app` is in the CORS_ORIGIN list

## 📊 Cache Configuration

Your app now has automatic caching for:
- ✅ **Ticket lists**: 5-minute TTL
- ✅ **Individual tickets**: 10-minute TTL
- ✅ **Analytics**: 15-minute TTL
- ✅ **User data**: 30-minute TTL

Cache automatically invalidates when:
- Tickets are created/updated/deleted
- Status changes occur
- Analytics data changes

## 🧪 Testing the Application

1. **Register & Login** (http://localhost:3000)
   - Create a new account
   - Verify duplicate email prevention works

2. **Create Tickets**
   - Create a ticket
   - Watch cache get populated (logs show "Tickets from cache" on second fetch)

3. **Check Cache Status**
   - Visit: `http://localhost:5000/api/cache-stats`
   - See active cached keys

## 📝 Environment Variables Reference

| Variable | Local | Production |
|----------|-------|-----------|
| MONGO_URI | localhost:27017 | MongoDB Atlas URL |
| REDIS_URL | (empty - uses localhost:6379) | Upstash URL |
| REDIS_HOST | localhost | (not used when REDIS_URL set) |
| REDIS_PORT | 6379 | (not used when REDIS_URL set) |
| REDIS_PASSWORD | (empty) | Upstash password |
| CORS_ORIGIN | localhost:3000,5173 | Vercel URL |
| PORT | 5000 | 5000 |
| NODE_ENV | development | production |

## 🔗 Useful Links

- **Upstash Console**: https://console.upstash.com
- **MongoDB Atlas**: https://www.mongodb.com/cloud/atlas
- **b4a.run Dashboard**: Check your backend deployment
- **Vercel Dashboard**: Check your frontend deployment
- **Redis Documentation**: https://redis.io/docs/

---

**Need help?** Check the logs:
- Local: Watch terminal where `npm run dev` runs
- Production: Check b4a.run logs
- Frontend: Check browser console (F12)

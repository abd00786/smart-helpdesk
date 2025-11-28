# 🔔 Server Keep-Alive Setup Guide

Your backend server will go to sleep after inactivity on b4a.run. This guide will keep it alive!

## Option 1: Local Ping Service (For Development)

Run this locally to keep your b4a.run backend alive:

```bash
cd backend
npm install  # If axios is not installed
BACKEND_URL=https://smarthelpdeskbackend-eurixpca.b4a.run npm run ping:prod
```

**Features:**
- ✅ Pings every 4 minutes (240 seconds)
- ✅ Checks health status
- ✅ Shows MongoDB & Redis status
- ✅ Logs results with timestamps
- ✅ Handles errors gracefully

---

## Option 2: Cron-Job.org (Recommended for Always-On)

Using **cron-job.org** to ping your server periodically keeps it alive 24/7.

### Step 1: Set Up Free Cron Job

1. Go to: https://cron-job.org/en/
2. Click **"Sign Up"** (free account)
3. Create account with email
4. Log in to dashboard

### Step 2: Create New Cron Job

1. Click **"Create Cronjob"**
2. Fill in these details:

   | Field | Value |
   |-------|-------|
   | **Title** | `Keep Smart Helpdesk Alive` |
   | **URL** | `https://smarthelpdeskbackend-eurixpca.b4a.run/api/health` |
   | **Execution schedule** | `Every 5 minutes` |
   | **Notifications** | Email on failure (optional) |

3. Click **"Create"**

### Step 3: Verify It's Working

- Cron job will automatically ping your health endpoint every 5 minutes
- This keeps your server alive and prevents it from going dormant
- You'll see execution logs in cron-job.org dashboard

---

## Option 3: Uptime Robot (Alternative)

If you prefer another service:

1. Go to: https://uptimerobot.com
2. Sign up (free tier available)
3. Add Monitor:
   - **Monitoring Type:** HTTP(s)
   - **URL:** `https://smarthelpdeskbackend-eurixpca.b4a.run/api/health`
   - **Check interval:** Every 5 minutes
4. Save

---

## Option 4: Running ping.js as Separate Service

If you deploy ping.js as a separate service on b4a.run:

```bash
# Deploy ping.js alongside server.js
npm run ping:prod
```

This would run continuously and ping your server every 4 minutes.

---

## 🎯 Recommended Setup

**For Production (Always-On):**
- Use **Cron-Job.org** or **Uptime Robot**
- Set interval to **5 minutes** or less
- Monitor `/api/health` endpoint

**Why this works:**
1. Cron job makes HTTP request every 5 minutes
2. HTTP request keeps server process alive
3. No sleep/dormancy occurs
4. Instant response when users visit

---

## ✅ Testing

After setting up, check if it's working:

```bash
# Option 1: Check health manually
curl https://smarthelpdeskbackend-eurixpca.b4a.run/api/health

# Option 2: View cron-job.org dashboard for execution logs

# Option 3: Try logging in from frontend - should be instant
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2025-11-29T10:30:00.000Z",
  "services": {
    "mongodb": "connected",
    "redis": "connected"
  }
}
```

---

## 📊 Monitoring

- **Cron-Job.org:** Shows execution history, failures, response times
- **Uptime Robot:** Shows uptime percentage, response times, outages
- **Local ping.js:** Real-time logs in terminal

---

## 🚀 Quick Commands Reference

```bash
# Run ping service locally for b4a.run
BACKEND_URL=https://smarthelpdeskbackend-eurixpca.b4a.run npm run ping:prod

# Run ping service locally for local backend
npm run ping

# Run main server
npm run dev

# Run production server
npm start
```

---

## 📝 Environment Variables

If you need custom intervals, update `ping.js`:

```javascript
const PING_INTERVAL = 4 * 60 * 1000; // Change this value
// 1 * 60 * 1000 = 1 minute
// 2 * 60 * 1000 = 2 minutes
// 5 * 60 * 1000 = 5 minutes
// 10 * 60 * 1000 = 10 minutes
```

---

## 🎉 Result

With cron-job setup:
- ✅ Server never sleeps
- ✅ Always responsive
- ✅ Users get instant login/register/ticket creation
- ✅ No more "Connection timeout" errors

Choose **Cron-Job.org** for the easiest setup! 🔔

import axios from "axios";

// Configuration
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";
const PING_INTERVAL = 4 * 60 * 1000; // Every 4 minutes (240 seconds)
const HEALTH_ENDPOINT = `${BACKEND_URL}/api/health`;

console.log(`🔔 Ping Service Started`);
console.log(`📍 Target: ${HEALTH_ENDPOINT}`);
console.log(`⏱️  Interval: Every ${PING_INTERVAL / 1000} seconds\n`);

// Function to ping the server
const pingServer = async () => {
  try {
    const response = await axios.get(HEALTH_ENDPOINT, {
      timeout: 10000, // 10 second timeout
    });

    const timestamp = new Date().toISOString();
    console.log(`✅ [${timestamp}] Server is alive`);
    console.log(`   Status: ${response.data.status}`);
    console.log(`   MongoDB: ${response.data.services.mongodb}`);
    console.log(`   Redis: ${response.data.services.redis}\n`);

    return true;
  } catch (error) {
    const timestamp = new Date().toISOString();
    console.error(`❌ [${timestamp}] Ping failed: ${error.message}`);
    console.error(`   Retrying in ${PING_INTERVAL / 1000} seconds...\n`);
    return false;
  }
};

// Start pinging immediately
pingServer();

// Set up recurring pings
setInterval(pingServer, PING_INTERVAL);

// Handle graceful shutdown
process.on("SIGINT", () => {
  console.log("\n\n⏸️  Ping service stopped");
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("\n\n⏸️  Ping service terminated");
  process.exit(0);
});

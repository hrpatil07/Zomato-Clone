/**
 * Server Entry Point
 * Connects to MongoDB, then starts the Express server.
 */

const app = require("./app");
const connectDB = require("./config/db");
const { PORT, NODE_ENV } = require("./config/env");

const startServer = async () => {
  // 1. Connect to MongoDB
  await connectDB();

  // 2. Start Express server
  app.listen(PORT, () => {
    console.log(`\n🚀 Zomato Lite API Server`);
    console.log(`   Environment : ${NODE_ENV}`);
    console.log(`   Port        : ${PORT}`);
    console.log(`   URL         : http://localhost:${PORT}\n`);
  });
};

startServer();

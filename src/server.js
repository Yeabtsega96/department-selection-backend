
import "dotenv/config";

import app from "./app.js";
import prisma from "./config/prisma.js";

const PORT = Number(process.env.PORT) || 5000;

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log("----------------------------------");
  console.log("Department Selection API");
  console.log(`Server running: http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  console.log("----------------------------------");
});

// Graceful shutdown
async function shutdown(signal) {
  console.log(`\n${signal} received. Shutting down...`);

  server.close(async () => {
    try {
      await prisma.$disconnect();
      console.log("Database disconnected.");
      process.exit(0);
    } catch (error) {
      console.error("Shutdown error:", error);
      process.exit(1);
    }
  });
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

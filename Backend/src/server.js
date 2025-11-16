import "dotenv/config";
import http from "http";
import app from "./app.js";
import logger from "./config/logger.js";
import { connect } from "./config/db.js";
import { startEmailReader } from "./utils/emailReader.js";


const PORT = process.env.PORT || 4000;

let server;

(async () => {
  try {
    // 1️⃣ Connect to MongoDB BEFORE starting server
    await connect(process.env.MONGO_URI);

    // 2️⃣ Start server only if DB connection succeeds
    server = http.createServer(app);

    server.listen(PORT, () => {
      logger.info(
        `Server listening on port ${PORT} (env=${process.env.NODE_ENV || "development"})`
      );
       startEmailReader();
    });

    /* ------------------------- Graceful Shutdown ------------------------- */

    const gracefulShutdown = (signal) => {
      logger.info(`Received ${signal} — shutting down gracefully`);

      server.close((err) => {
        if (err) {
          logger.error(`Error closing server: ${err}`);
          process.exit(1);
        }

        logger.info("Server closed");
        process.exit(0);
      });

      setTimeout(() => {
        logger.error("Forcing shutdown after timeout");
        process.exit(1);
      }, 10000).unref();
    };

    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));

    /* ----------------------- Global Error Handlers ----------------------- */

    process.on("unhandledRejection", (reason) => {
      logger.error("Unhandled Rejection: %o", reason);
    });

    process.on("uncaughtException", (err) => {
      logger.error("Uncaught Exception: %o", err);
      process.exit(1);
    });

  } catch (err) {
    logger.error(`Startup failed: ${err.message}`);
    process.exit(1);
  }
})();

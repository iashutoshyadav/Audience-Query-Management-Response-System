import logger from "../config/logger.js";

export default function errorHandler(err, req, res, next) {
  logger.error("Unhandled error: %o", {
    message: err.message,
    stack: err.stack,
  });

  const status = err.status || 500;

  const response = {
    error: err.message || "Internal Server Error",
  };

  // Show stack only in development
  if (process.env.NODE_ENV !== "production") {
    response.stack = err.stack;
  }

  return res.status(status).json(response);
}

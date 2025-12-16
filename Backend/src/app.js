import "dotenv/config";
import "express-async-errors";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import xss from "xss-clean";
import path from "path";
import { fileURLToPath } from "url";

import logger from "./config/logger.js";

import authRoutes from "./routes/auth.routes.js";
import queryRoutes from "./routes/query.routes.js";
import noteRoutes from "./routes/note.routes.js";
import aiRoutes from "./routes/ai.routes.js";
import whatsappRoutes from "./routes/whatsapp.routes.js";
import errorHandler from "./middleware/errorHandler.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const FRONTEND_DIST = path.join(__dirname, "../dist");


const app = express();
app.set("trust proxy", 1);
app.use(helmet());
app.use(xss());

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(
  morgan("dev", {
    stream: {
      write: (msg) => logger.info(msg.trim()),
    },
  })
);

const allowedOrigins = [
  "http://localhost:5173",
  "https://audience-query-management-response-theta.vercel.app",
   "https://www.audiencequery.online",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests without origin (Postman, curl, mobile apps)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Handle preflight requests
app.options("*", cors());


const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// API Routes
app.use("/", whatsappRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/queries", queryRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/ai", aiRoutes);

app.get("/_health", (req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// Serve static frontend files
app.use(express.static(FRONTEND_DIST));

// SPA fallback (CRITICAL FIX)
app.get("*", (req, res, next) => {
  // Allow API 404 handling
  if (req.originalUrl.startsWith("/api")) return next();

  res.sendFile(path.join(FRONTEND_DIST, "index.html"));
});

app.use("/api", (req, res) => {
  res.status(404).json({
    error: "API route not found",
  });
});

app.use(errorHandler);

export default app;

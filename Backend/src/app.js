import "dotenv/config";
import "express-async-errors";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import xss from "xss-clean";

import logger from "./config/logger.js";

import authRoutes from "./routes/auth.routes.js";
import queryRoutes from "./routes/query.routes.js";
import noteRoutes from "./routes/note.routes.js";
import aiRoutes from "./routes/ai.routes.js";
import whatsappRoutes from "./routes/whatsapp.routes.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();
app.set("trust proxy", 1);

/* ----------------------------- Middlewares ----------------------------- */

app.use(helmet());

app.use(
  cors({
    origin: [
     
      "https://audience-query-management-response-theta.vercel.app",
       "http://localhost:5173",
    ],
    credentials: true,
  })
);

app.use(xss());
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/", whatsappRoutes);
app.use(
  morgan("combined", {
    stream: {
      write: (msg) => logger.info(msg.trim()),
    },
  })
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

/* -------------------------------- Routes ------------------------------- */

app.use("/api/auth", authRoutes);
app.use("/api/queries", queryRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/ai", aiRoutes);

app.get("/_health", (req, res) =>
  res.json({
    status: "ok",
    uptime: process.uptime(),
  })
);

app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.use(errorHandler);

export default app;

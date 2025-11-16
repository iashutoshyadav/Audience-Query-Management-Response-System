import jwt from "jsonwebtoken";
import { User } from "../models/index.js";
import logger from "../config/logger.js";

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  throw new Error("JWT_SECRET is required in environment");
}

const auth = {};

/**
 * Authenticate user via Authorization: Bearer <token>
 * Supports payload containing either { sub } or { id }
 * Attaches req.user = { id, email, role }
 */
auth.authenticate = async (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const token = header.split(" ")[1];

    // Verify token
    const payload = jwt.verify(token, jwtSecret);

    // FIX: Support both token formats
    // Some systems generate token with { id }, others with { sub }
    const userId = payload.sub || payload.id;

    if (!userId) {
      logger.warn("Auth failed: Token missing sub/id");
      return res.status(401).json({ error: "Invalid token" });
    }

    // Fetch user
    const user = await User.findById(userId).select("-password_hash");

    if (!user || !user.is_active) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Attach user info to request
    req.user = {
      id: user._id,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (err) {
    logger.warn(`Auth failed: ${err.message}`);
    return res.status(401).json({ error: "Unauthorized" });
  }
};

/**
 * Role-based authorization
 * Example: auth.authorize(["admin"])
 */
auth.authorize = (roles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (roles.length > 0 && !roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Forbidden" });
    }

    next();
  };
};

export default auth;

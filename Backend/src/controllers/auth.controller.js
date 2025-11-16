import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Joi from "joi";
import { User } from "../models/index.js";
import logger from "../config/logger.js";

const jwtSecret = process.env.JWT_SECRET;
const jwtExpiresIn = process.env.JWT_EXPIRES_IN || "1d";

if (!jwtSecret) {
  throw new Error("JWT_SECRET required");
}

/* ------------------------------ Validators ------------------------------ */

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(120).required(),
  email: Joi.string().email().max(200).required(),
  password: Joi.string().min(8).max(128).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().max(200).required(),
  password: Joi.string().required(),
});

/* ------------------------------ Utilities ------------------------------ */

function signToken(user) {
  return jwt.sign(
    { sub: user._id.toString(), role: user.role },
    jwtSecret,
    { expiresIn: jwtExpiresIn }
  );
}

function respondWithUser(user, token) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token,
  };
}

/* --------------------------------- Auth -------------------------------- */

const auth = {};

/**
 * POST /api/auth/register
 */
auth.register = async (req, res) => {
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.message });

    const { name, email, password } = value;

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ error: "Email already in use" });
    }

    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = new User({
      name,
      email: email.toLowerCase(),
      password_hash: hashedPassword,
    });

    await user.save();

    const token = signToken(user);

    res.status(201).json({ data: respondWithUser(user, token) });
  } catch (err) {
    logger.error("Registration error: %s", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * POST /api/auth/login
 */
auth.login = async (req, res) => {
  try {
    console.log("🔥 LOGIN BODY RECEIVED:", req.body);

    const { error, value } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.message });

    const { email, password } = value;

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password_hash");
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const passwordMatches = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatches) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = signToken(user);

    res.json({ data: respondWithUser(user, token) });
  } catch (err) {
    logger.error("Login error: %s", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default auth;

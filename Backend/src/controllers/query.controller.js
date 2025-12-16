import Joi from "joi";
import Query from "../models/Query.js";

import detectPriority from "../utils/priority.js";
import { classifyText } from "../utils/classify.js";
import assignAgent from "../utils/assign.js";

/* ------------------------------ Validation ------------------------------ */

const createSchema = Joi.object({
  title: Joi.string().max(250).required(),
  body: Joi.string().required(),
});

const updateSchema = Joi.object({
  title: Joi.string().optional(),
  body: Joi.string().optional(),
  priority: Joi.string().valid("low", "medium", "high", "urgent").optional(),
  status: Joi.string()
    .valid("open", "in_progress", "resolved", "closed")
    .optional(),
  tags: Joi.array().items(Joi.string()).optional(),
});

/* ------------------------------ Controller ------------------------------ */

const queryCtrl = {};

/**
 * Create Query WITH AI Classification + Auto Priority + Auto Assignment
 */
queryCtrl.create = async (req, res) => {
  try {
    const { error, value } = createSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.message });

    const { title, body } = value;

    /* ------------------------------------------
     * 1️⃣ AI CLASSIFICATION
     * ------------------------------------------*/
    const ai = await classifyText(title, body); 
    // ai = {category, tags, sentiment, summary, confidence}

    /* ------------------------------------------
     * 2️⃣ PRIORITY DETECTION
     * ------------------------------------------*/
    const priority = detectPriority(body);

    /* ------------------------------------------
     * 3️⃣ AUTO ASSIGN AGENT
     * ------------------------------------------*/
    const agentId = await assignAgent(ai.category, priority);

    /* ------------------------------------------
     * 4️⃣ SAVE QUERY IN DATABASE
     * ------------------------------------------*/
    const query = await Query.create({
      title,
      body,
      user: req.user.id,
      tags: ai.tags || [],
      category: ai.category || "General",
      sentiment: ai.sentiment || "neutral",
      summary: ai.summary || "",
      priority,
      assigned_to: agentId,
      status: "open",
      source: "manual",
    });

    return res.status(201).json({
      success: true,
      message: "Query created with AI insights",
      data: query,
    });

  } catch (err) {
    console.error("CREATE QUERY ERROR:", err);
    return res.status(500).json({
      error: err.message || "Server error while creating query",
    });
  }
};

/**
 * List ALL Queries
 */
queryCtrl.list = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const [items, total] = await Promise.all([
      Query.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .populate("user", "name email")
        .populate("assigned_to", "name email")
        .lean(),
      Query.countDocuments(),
    ]);

    return res.json({
      data: items,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
      },
    });

  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch queries" });
  }
};

/**
 * Get Query by ID
 */
queryCtrl.get = async (req, res) => {
  try {
    const q = await Query.findById(req.params.id)
      .populate("user", "name email")
      .populate("assigned_to", "name email")
      .lean();

    if (!q) return res.status(404).json({ error: "Not found" });

    return res.json({ data: q });

  } catch (err) {
    return res.status(500).json({ error: "Error fetching query" });
  }
};

/**
 * Update Query
 */
queryCtrl.update = async (req, res) => {
  try {
    const { error, value } = updateSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.message });

    const q = await Query.findByIdAndUpdate(req.params.id, value, {
      new: true,
    });

    return res.json({ data: q });

  } catch (err) {
    return res.status(500).json({ error: "Failed to update query" });
  }
};

/**
 * Delete Query
 */
queryCtrl.remove = async (req, res) => {
  try {
    await Query.findByIdAndDelete(req.params.id);
    return res.status(204).end();
  } catch (err) {
    return res.status(500).json({ error: "Failed to delete query" });
  }
};

export default queryCtrl;

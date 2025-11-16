import Joi from "joi";
import Query from "../models/Query.js";

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
 * Create Query
 */
queryCtrl.create = async (req, res) => {
  try {
    const { error, value } = createSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.message });
    const query = await Query.create({
      ...value,
      user: req.user.id,
      priority: "medium",
      status: "open",
      tags: [],
    });

    res.status(201).json({ data: query });
  } catch (err) {
    console.error("CREATE QUERY ERROR:", err);
    res.status(500).json({ error: err.message || "Failed to create query" });
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
        .lean(),
      Query.countDocuments(),
    ]);

    res.json({
      data: items,
      meta: { total, page: Number(page), limit: Number(limit) },
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch queries" });
  }
};

/**
 * Get Query by ID
 */
queryCtrl.get = async (req, res) => {
  try {
    const q = await Query.findById(req.params.id)
      .populate("user", "name email")
      .lean();

    if (!q) return res.status(404).json({ error: "Not found" });

    res.json({ data: q });
  } catch (err) {
    res.status(500).json({ error: "Error fetching query" });
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

    res.json({ data: q });
  } catch (err) {
    res.status(500).json({ error: "Failed to update query" });
  }
};

/**
 * Delete Query
 */
queryCtrl.remove = async (req, res) => {
  try {
    await Query.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: "Failed to delete query" });
  }
};

export default queryCtrl;

import Joi from "joi";
import { Note, Query } from "../models/index.js";

/* ------------------------------ Validation ------------------------------ */

const createSchema = Joi.object({
  content: Joi.string().required(),
  queryId: Joi.string().optional().allow(null),
});

/* ------------------------------ Controller ------------------------------ */

const noteCtrl = {};

/**
 * POST /api/notes
 */
noteCtrl.create = async (req, res) => {
  try {
    const { error, value } = createSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.message });

    const { content, queryId } = value;
    if (queryId) {
      const q = await Query.findById(queryId);
      if (!q) return res.status(404).json({ error: "Query not found" });
    }
    const note = new Note({
      content,
      user: req.user.id,
      query: queryId || null,
    });

    await note.save();

    res.status(201).json({ data: note });
  } catch (err) {
    res.status(500).json({ error: "Failed to create note" });
  }
};

noteCtrl.list = async (req, res) => {
  try {
    const { page = 1, limit = 20, queryId } = req.query;

    const filter = {};

    if (queryId) filter.query = queryId;
    if (req.user.role === "user") {
      filter.user = req.user.id;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [items, total] = await Promise.all([
      Note.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .populate("user", "name email")
        .lean(),
      Note.countDocuments(filter),
    ]);

    res.json({
      data: items,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch notes" });
  }
};

export default noteCtrl;

import express from "express";
import Query from "../models/Query.js";
import queryCtrl from "../controllers/query.controller.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.use(auth.authenticate);
router.post("/", queryCtrl.create);
router.get("/", async (req, res) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Number(req.query.limit) || 12);
    const skip = (page - 1) * limit;
    const sort = req.query.sort || "-createdAt";
    const source = req.query.source;
    const tag = req.query.tag;
    const status = req.query.status;
    const priority = req.query.priority;
    const q = req.query.q;

    const filter = {};

    if (source) filter.source = source;
    if (tag) filter.tags = tag;
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (q) {
      filter.$or = [
        { title: new RegExp(q, "i") },
        { body: new RegExp(q, "i") },
        { sender: new RegExp(q, "i") },
      ];
    }

    const [total, items] = await Promise.all([
      Query.countDocuments(filter),
      Query.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
    ]);

    res.json({ page, limit, total, items });
  } catch (err) {
    console.error("GET /api/queries error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/:id", queryCtrl.get);
router.patch("/:id", queryCtrl.update);
router.delete("/:id", queryCtrl.remove);

export default router;

import generateReply from "../utils/replyGen.js";

const aiCtrl = {};

/**
 * POST /api/ai/generate
 * Generate an AI-powered reply using OpenAI (if configured)
 */
aiCtrl.generate = async (req, res) => {
  try {
    const { title, body, tags = [] } = req.body;

    if (!title || !body) {
      return res.status(400).json({ error: "title and body are required" });
    }

    const reply = await generateReply({ title, body, tags });

    res.json({ data: { reply } });
  } catch (err) {
    res.status(500).json({ error: "Failed to generate AI reply" });
  }
};

export default aiCtrl;

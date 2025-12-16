import User from "../models/User.js";

/**
 * assignAgent(category, priority)
 * - Strategy:
 *   1. Filter active agents
 *   2. Prefer agents with matching skills
 *   3. Sort by (online > lower load > higher experience)
 *   4. Choose best candidate and increment their assignedCount (atomic-ish)
 *
 * NOTE: This assumes User model contains optional fields:
 *   - skills: [String]
 *   - experience: Number
 *   - assignedCount: Number
 *   - is_active: Boolean
 *
 * If these fields are not present, the function will still work using defaults.
 */
export default async function assignAgent(category = "General", priority = "medium") {
  // fetch active agents
  const agents = await User.find({ role: "agent", is_active: true }).lean();

  if (!agents || agents.length === 0) return null;

  // normalize
  const cat = String(category || "General");

  // score each agent
  const scored = agents.map((a) => {
    const skills = Array.isArray(a.skills) ? a.skills.map((s) => String(s).toLowerCase()) : [];
    const skillMatch = skills.includes(cat.toLowerCase()) ? 1 : 0;
    const experience = typeof a.experience === "number" ? a.experience : 1;
    const assignedCount = typeof a.assignedCount === "number" ? a.assignedCount : 0;
    const online = a.is_online ? 1 : 0; // optional field

    // scoring: higher is better
    // prefer skill match heavily, then online, then lower load and higher experience
    const score = (skillMatch * 100) + (online * 20) + (experience * 2) - (assignedCount * 5);

    return { agent: a, score, assignedCount };
  });

  // sort by score descending
  scored.sort((x, y) => y.score - x.score);

  // For urgent/high priority, prefer top experienced & online; else just top score
  const chosen = scored[0].agent;

  if (!chosen) return null;

  // Try to increment assignedCount atomically (best-effort)
  try {
    await User.findByIdAndUpdate(chosen._id, { $inc: { assignedCount: 1 } }).exec();
  } catch (err) {
    console.warn("[assignAgent] failed to increment assignedCount:", err.message);
  }

  return chosen._id;
}

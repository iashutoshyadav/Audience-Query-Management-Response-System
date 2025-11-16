import { User } from "../models/index.js";

/**
 * Assign an available agent.
 * Current logic: Random active agent (demo).
 * Replace with load-based or round-robin logic later.
 */
export default async function assignAgent() {
  // Fetch active agents
  const agents = await User.find({
    role: "agent",
    is_active: true,
  })
    .select("_id")
    .lean();

  if (!agents.length) return null;

  // Simple random selection (placeholder)
  const randomIndex = Math.floor(Math.random() * agents.length);

  return agents[randomIndex]._id;
}

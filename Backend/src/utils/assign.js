import { User } from "../models/index.js";

export default async function assignAgent() {
  const agents = await User.find({
    role: "agent",
    is_active: true,
  })
    .select("_id")
    .lean();

  if (!agents.length) return null;
  const randomIndex = Math.floor(Math.random() * agents.length);

  return agents[randomIndex]._id;
}

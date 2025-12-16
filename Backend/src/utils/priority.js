/**
 * detectPriority(text)
 * Returns: "urgent" | "high" | "medium" | "low"
 *
 * Uses keyword patterns + length/urgency hints.
 */
export default function detectPriority(text = "") {
  const t = (text || "").toLowerCase();

  // urgent patterns
  if (/\b(urgent|asap|immediately|critical|emergency|now)\b/.test(t)) return "urgent";

  // high priority keywords
  if (/\b(refund|chargeback|payment failed|payment failed|lost money|account locked|data loss|can't access|not working|down|outage)\b/.test(t)) return "high";

  // medium keywords
  if (/\b(help|support|issue|problem|bug|error|question)\b/.test(t)) return "medium";

  // short but emotional messages may be high
  if (t.length < 60 && /!$/.test(t)) return "high";

  // fallback
  return "low";
}

export default function detectPriority(text = "") {
  const input = text.toLowerCase();

  if (/\burgent\b|\basap\b|\bcritical\b/.test(input)) return "urgent";
  if (/\bimmediately\b|\bhigh\b/.test(input)) return "high";
  if (/\bsoon\b|\bmedium\b/.test(input)) return "medium";

  return "low";
}

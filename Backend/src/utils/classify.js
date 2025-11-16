export default function classifyText(text = "") {
  const input = text.toLowerCase();
  const tags = new Set();

  const mapping = {
    billing: ["payment", "billing", "invoice", "refund"],
    auth: ["login", "password", "signup", "authenticate", "authentication"],
    bug: ["error", "exception", "crash", "bug", "fails"],
    feature: ["feature", "request", "enhancement"],
    performance: ["slow", "lag", "timeout", "performance"],
  };

  for (const [tag, keywords] of Object.entries(mapping)) {
    for (const keyword of keywords) {
      if (input.includes(keyword)) {
        tags.add(tag);
        break;
      }
    }
  }

  return [...tags];
}

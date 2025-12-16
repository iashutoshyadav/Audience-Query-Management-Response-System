import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Robust AI classifier
 * - Automatic retry (3x)
 * - Handles 429 rate limit
 * - Safe JSON extraction
 * - Local fallback classification
 */
export async function classifyText(title = "", body = "") {
  const safeTitle = String(title).trim();
  const safeBody = String(body).trim();

  const prompt = `
Analyze this customer query and return ONLY JSON.

{
  "category": "Billing | Technical | Complaint | Feedback | Feature Request | General",
  "tags": ["keyword1", "keyword2"],
  "sentiment": "positive | neutral | negative | very_negative",
  "summary": "short summary",
  "confidence": 0.0
}

Message Title: ${safeTitle}
Message Body: ${safeBody}
`;

  // ----------- Retry Loop (3 attempts) -----------
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const resp = await client.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: 0,
        messages: [{ role: "user", content: prompt }],
        max_tokens: 350,
      });

      const output = resp?.choices?.[0]?.message?.content || "";

      const json = extractJSON(output);
      if (json) return sanitizeAI(json);

      console.warn(`AI JSON extraction failed (attempt ${attempt})`);
    } catch (err) {
      const msg = err?.message || "";

      // ----------- 429 Handling -----------
      if (msg.includes("429") || msg.includes("quota")) {
        console.warn(`⚠️ OpenAI rate limit or quota reached on attempt ${attempt}`);

        // exponential backoff 300ms → 600ms → 1200ms
        await delay(300 * attempt);
        continue;
      }

      // Other error → break immediately
      console.warn("AI classify error:", msg);
      break;
    }
  }

  // If all attempts fail → fallback
  console.warn("⚠️ Using LOCAL fallback classifier");
  return localFallbackClassifier(safeTitle, safeBody);
}

/* --------------------------------------------------
   JSON Extraction: Safe + Fault Tolerant
-------------------------------------------------- */
function extractJSON(text) {
  if (!text) return null;

  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");

  if (start === -1 || end === -1) return null;

  const jsonStr = text.slice(start, end + 1);

  try {
    return JSON.parse(jsonStr);
  } catch {
    // Fix common issues: single quotes → double quotes
    try {
      const fixed = jsonStr.replace(/'/g, '"');
      return JSON.parse(fixed);
    } catch {
      return null;
    }
  }
}

/* --------------------------------------------------
   Normalize AI output (sanitize)
-------------------------------------------------- */
function sanitizeAI(ai) {
  const category = ai.category || "General";
  const sentiment = ai.sentiment || "neutral";
  const summary = ai.summary || "";
  const confidence = Number(ai.confidence) || 0.6;

  let tags = [];
  if (Array.isArray(ai.tags)) {
    tags = ai.tags.map((t) => String(t).toLowerCase());
  }

  return {
    category,
    tags,
    sentiment,
    summary,
    confidence,
  };
}

/* --------------------------------------------------
   Local Fallback Classifier (no AI needed)
-------------------------------------------------- */
function localFallbackClassifier(title, body) {
  const text = (title + " " + body).toLowerCase();

  let category = "General";
  let tags = [];

  if (/refund|payment|billing|invoice/.test(text)) {
    category = "Billing";
    tags.push("billing");
  }
  if (/not working|error|bug|issue|technical/.test(text)) {
    category = "Technical";
    tags.push("technical");
  }
  if (/complain|angry|bad|service/.test(text)) {
    category = "Complaint";
    tags.push("complaint");
  }
  if (/suggest|feature|request/.test(text)) {
    category = "Feature Request";
    tags.push("feature");
  }
  if (/help|question|support/.test(text)) {
    category = "Question";
    tags.push("question");
  }

  // sentiment guess
  let sentiment = "neutral";
  if (/bad|angry|worst|hate|terrible/.test(text)) sentiment = "negative";
  if (/love|good|great|thank you|awesome/.test(text)) sentiment = "positive";

  return {
    category,
    tags,
    sentiment,
    summary: title || body.substring(0, 150),
    confidence: 0.4, // fallback confidence
  };
}

/* Helper Delay */
function delay(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

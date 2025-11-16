import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function classifyEmail(subject, body) {
  try {
    const prompt = `
Classify this customer email.

Return ONLY this JSON:
{
"tags": [],
"priority": "",
"category": "",
"sentiment": "",
"summary": ""
}

Email Subject: ${subject}
Email Body: ${body}
`;

    const resp = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0,
    });

    const text = resp.choices[0].message.content.trim();
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");

    if (start === -1 || end === -1) return fallback(subject, body);

    return JSON.parse(text.slice(start, end + 1));
  } catch (err) {
    console.log("AI classify error:", err.message);
    return fallback(subject, body);
  }
}

function fallback(subject, body) {
  return {
    tags: [],
    priority: "medium",
    category: "Other",
    sentiment: "neutral",
    summary: subject || body.slice(0, 100),
  };
}

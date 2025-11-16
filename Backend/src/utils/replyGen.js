import openai from "../config/openai.js";

/**
 * Generate a short reply using OpenAI.
 * Fallback to a default response when OpenAI is not configured or errors occur.
 *
 * @param {Object} params
 * @param {string} params.title
 * @param {string} params.body
 * @param {string[]} params.tags
 * @returns {Promise<string>}
 */
export default async function generateReply({ title, body, tags = [] } = {}) {
    const fallback = `Thanks for your query titled "${title}". Our team will review and respond shortly.`;

    // If OpenAI config not available → fallback
    if (!openai) return fallback;

    try {
        const prompt = `
You are a helpful support assistant.
User query title: "${title}"
Query body: "${body}"
Tags: ${tags.join(", ")}
Write a concise, polite acknowledgement message (1–3 sentences).
    `.trim();

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini", // change if needed
            messages: [{ role: "user", content: prompt }],
            max_tokens: 120,
            temperature: 0.5,
        });

        const content =
            completion?.choices?.[0]?.message?.content?.trim();

        return content || fallback;
    } catch {
        return fallback;
    }
}

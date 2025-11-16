// src/utils/emailReader.js
import Imap from "imap";
import { simpleParser } from "mailparser";
import Query from "../models/Query.js";
import { classifyEmail } from "./autoClassifier.js";  // ⭐ ADD THIS

export function startEmailReader() {
  const imap = new Imap({
    user: process.env.IMAP_USER,
    password: process.env.IMAP_PASS,
    host: process.env.IMAP_HOST,
    port: 993,
    tls: true,
    tlsOptions: {
      rejectUnauthorized: false,
    },
  });

  function openInbox(cb) {
    imap.openBox("INBOX", false, cb);
  }

  /* ---------------------- PROCESS NEW EMAIL ---------------------- */
  async function processMessage(msg) {
    let buffer = "";

    msg.on("body", (stream) => {
      stream.on("data", (chunk) => {
        buffer += chunk.toString("utf8");
      });
    });

    msg.once("end", async () => {
      try {
        const parsed = await simpleParser(buffer);

        if (!parsed || !parsed.messageId) return;

        // ✅ Prevent duplicate entries
        const exists = await Query.findOne({ messageId: parsed.messageId });
        if (exists) {
          console.log("⏭ Duplicate email skipped:", parsed.subject);
          return;
        }

        // Extract data safely
        const sender = parsed.from?.text || "Unknown Sender";
        const title = parsed.subject || "No Subject";
        const body = parsed.text || parsed.html || "No Content";
        const receivedAt = parsed.date || new Date();

        // ⭐ Save initial email immediately
        const q = await Query.create({
          source: "email",
          sender,
          title,
          body,
          tags: [],
          priority: "medium",
          status: "open",
          replySent: false,
          messageId: parsed.messageId,
          channel: "email",
          receivedAt,
        });

        console.log("📩 Saved email:", title);

        // ⭐ AI classification in background
        (async () => {
          try {
            const ai = await classifyEmail(title, body);

            await Query.findByIdAndUpdate(q._id, {
              $set: {
                tags: ai.tags,
                priority: ai.priority,
                category: ai.category,
                sentiment: ai.sentiment,
                summary: ai.summary,
              },
            });

            console.log("🤖 AI classified:", ai);
          } catch (error) {
            console.error("❌ AI classify error:", error.message);
          }
        })();

      } catch (err) {
        console.error("❌ Parsing error:", err.message);
      }
    });
  }

  /* ---------------------- IMAP READY ---------------------- */
  imap.once("ready", () => {
    console.log("📨 Email IMAP connected");

    openInbox((err, box) => {
      if (err) throw err;

      console.log(`📥 INBOX ready. Total messages: ${box.messages.total}`);

      /* -------- Process UNSEEN emails first -------- */
      imap.search(["UNSEEN"], (err, results) => {
        if (err) {
          console.error("IMAP search error:", err);
          return;
        }

        if (!results || results.length === 0) {
          console.log("📭 No unread emails");
          return;
        }

        const f = imap.fetch(results, { bodies: "" });
        f.on("message", processMessage);

        f.once("end", () => {
          console.log("✔️ Initial unread emails processed");
        });
      });

      /* -------- REAL-TIME NEW MAIL LISTENER -------- */
      imap.on("mail", () => {
        console.log("🔔 New email arrived");

        imap.search(["UNSEEN"], (err, results) => {
          if (err || !results || results.length === 0) return;

          const f = imap.fetch(results, { bodies: "" });
          f.on("message", processMessage);
        });
      });
    });
  });

  /* ---------------------- Error Handling ---------------------- */
  imap.once("error", (err) => {
    console.error("❌ IMAP Error:", err.message);
  });

  imap.once("end", () => {
    console.log("📪 IMAP connection closed");
  });

  /* ---------------------- CONNECT ---------------------- */
  imap.connect();
}

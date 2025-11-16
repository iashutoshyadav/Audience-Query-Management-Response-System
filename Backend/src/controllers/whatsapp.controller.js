import Query from "../models/Query.js";

export const verifyWhatsapp = (req, res) => {
  const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token && mode === "subscribe" && token === VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }
  return res.sendStatus(403);
};

export const receiveWhatsapp = async (req, res) => {
  try {
    const data = req.body;

    if (data.entry?.[0].changes?.[0].value.messages) {
      const messageObj = data.entry[0].changes[0].value.messages[0];

      const from = messageObj.from; // Customer number
      const text = messageObj.text?.body || "";

      // SAVE WHATSAPP MESSAGE AS QUERY
      await Query.create({
        source: "whatsapp",
        sender: from,
        title: "WhatsApp Message",
        content: text,
        status: "open",
        priority: "medium",
      });

      console.log("📲 WhatsApp message saved:", text);
    }

    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

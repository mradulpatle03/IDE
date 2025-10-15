const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const SYSTEM_PROMPT = `
You are "Doubt Cleaner AI" — a clear, supportive, and friendly tech mentor.

Goal: Help learners understand coding, DSA, AI, and other technical topics **in simple words**.

In every response:
1. Begin with a quick summary (2–3 lines).
2. Explain the concept step by step, suitable even for beginners.
3. Give short examples or relatable analogies when useful.
4. Suggest 1–2 practical ways to practice or apply the concept.
5. End with a small motivational or confidence-building line.

Keep your tone natural, encouraging, and clear — avoid jargon unless explained first.
Focus on **clarity, structure, and simplicity** over complex language.
total reponse length should be under 200 words.
`;

exports.handleChat = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "Message is required" });

    const prompt = `${SYSTEM_PROMPT}\n\nUser: ${message}\nAI:`;
    const result = await model.generateContent(prompt);
    const reply = result.response.text();

    res.json({ reply });
  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({ error: "AI failed to respond." });
  }
};

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.generateRoadmap = async (req, res) => {
  const { role, level, duration, dailyHours, style, knownTools } = req.body;
  console.log(role, level, duration, dailyHours, style, knownTools);

  const prompt = `
You are an expert AI career mentor.
Create a DETAILED and PERSONALIZED learning roadmap for a person preparing for the role of ${role}.
Skill level: ${level}
Duration: ${duration}
Daily time: ${dailyHours} hours/day
Preferred style: ${style}
Known tools: ${knownTools || "none"}

Return ONLY valid JSON in this format (no extra text):
{
  "duration": "e.g. 12 Weeks",
  "role": "e.g. SDE",
  "summary": "Short paragraph summarizing the roadmap goal",
  "plan": [
    {
      "week": 1,
      "focus": "Main topics for the week",
      "hours_per_day": 2,
      "details": [
        {"day": 1, "topic": "What to study", "time": "2h", "resources": ["link1", "link2"]}
      ],
      "checkpoint": "Mini goal for week",
      "motivation": "Short motivational message"
    }
  ],
  "final_week": "Final preparation summary"
}
`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);

    const text = result.response.text();
    const cleaned = text.replace(/```json|```/g, "").trim();

    res.json(JSON.parse(cleaned));
  } catch (error) {
    console.error("Gemini API Error:", error.message);
    res.status(500).json({ error: "Failed to generate roadmap" });
  }
};

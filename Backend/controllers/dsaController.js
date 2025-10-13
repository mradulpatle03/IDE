const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEN_AI);

exports.getLeetCodeQuestions = async (req, res) => {
  try {
    const { topic = "array", difficulty = "easy", company = "Google", limit = 10 } = req.query;
    console.log(topic, difficulty, company, limit);
    const prompt = `
Generate top ${limit} DSA interview questions related to ${topic} at ${difficulty} level,
preferably asked in ${company} interviews. 
For each question, include:
1. Question title
2. LeetCode link (like https://leetcode.com/problems/<slug>/)
3. Difficulty level
4. One-line summary

Return in pure JSON format like this:
[
  {
    "title": "Two Sum",
    "link": "https://leetcode.com/problems/two-sum/",
    "difficulty": "Easy",
    "summary": "Find two numbers that add up to a target."
  }
]
`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContent(prompt);
    let text = result.response.text();

// Remove triple backticks and any language hints (like ```json)
text = text.replace(/```json|```/g, "").trim();

let data;
try {
  data = JSON.parse(text);
} catch (err) {
  // fallback if parsing still fails
  data = { raw: text };
}

res.json(data);

  } catch (error) {
    console.error("❌ Error fetching Gemini data:", error);
    res.status(500).json({ error: "Failed to fetch data from Gemini" });
  }
};

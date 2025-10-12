const { GoogleGenerativeAI } = require("@google/generative-ai");
const Session = require("../models/sessionModel");
const Question = require("../models/questionModel");

const ai = new GoogleGenerativeAI(process.env.GEN_AI);

const generateInterviewQuestion = async (req, res) => {
  try {
    const { role, experience, topicsToFocus, sessionId } = req.body;

    const prompt = `
You are an interview question generator.
Return ONLY a valid JSON array. Do not include explanations, text before or after, or Markdown code blocks.

Format:
[
  {"question": "What is React?", "answer": "React is a JS library for building UIs."}
]

Generate 5 questions for a ${role} with ${experience} years of experience.
Focus on topics: ${topicsToFocus}.
`;

    const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);

    let rawText = result.response.text().trim();

    // 🧹 Step 1: Remove Markdown formatting or non-JSON wrappers
    rawText = rawText
      .replace(/```json|```/gi, "")
      .replace(/^[^{\[]*|[^}\]]*$/g, "") // Remove extra text before/after JSON
      .trim();

    // 🧩 Step 2: Extract JSON array if surrounded by noise
    const match = rawText.match(/\[[\s\S]*\]/);
    if (match) rawText = match[0];

    // 🧠 Step 3: Try parsing JSON safely
    let data;
    try {
      data = JSON.parse(rawText);
    } catch (err) {
      console.warn("⚠️ Initial parse failed. Cleaning JSON...");
      const fixed = rawText
        .replace(/,\s*([\]}])/g, "$1") // trailing commas
        .replace(/[\u0000-\u001F]+/g, "") // invisible chars
        .replace(/[“”]/g, '"')
        .replace(/[‘’]/g, "'")
        .replace(/\\(?!["\\/bfnrtu])/g, ""); // invalid escapes

      try {
        data = JSON.parse(fixed);
      } catch (err2) {
        console.error("❌ Still invalid JSON:", fixed);
        return res.status(400).json({
          message: "Invalid JSON from Gemini",
          rawText: fixed,
        });
      }
    }

    // ✅ Step 4: Validate structure
    if (!Array.isArray(data) || !data.every(q => q.question && q.answer)) {
      return res.status(400).json({
        message: "Malformed question data",
        rawText: JSON.stringify(data, null, 2),
      });
    }

    // 🗂 Step 5: Save questions in DB
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    const createdQuestions = await Question.insertMany(
      data.map(q => ({
        session: sessionId,
        question: q.question.trim(),
        answer: q.answer.trim(),
      }))
    );

    session.questions.push(...createdQuestions.map(q => q._id));
    await session.save();

    return res.status(201).json({
      message: "Questions created successfully",
      questions: createdQuestions,
    });
  } catch (error) {
    console.error("Error in generateInterviewQuestion:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};



const togglePinQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(401).json({
        message: "Question not found",
      });
    }

    question.isPinned = !question.isPinned;
    await question.save({ validateBeforeSave: false });

    return res.status(201).json({
      message: "Question pinned successfully",
    });
  } catch (error) {
    console.error(`Error in togglePinQuestion: ${error}`);
  }
};

module.exports = {
  generateInterviewQuestion,
  togglePinQuestion,
};

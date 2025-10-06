const { GoogleGenerativeAI } = require("@google/generative-ai");
const Session = require("../models/sessionModel");
const Question = require("../models/questionModel");

const ai = new GoogleGenerativeAI(process.env.GEN_AI);

const generateInterviewQuestion = async (req, res) => {
  try {
    const { role, experience, topicsToFocus, sessionId } = req.body;

    const prompt = `
You are an interview question generator.
Return ONLY a valid JSON array. Do not include explanations, extra text, or formatting.

Example format:
[
  {"question": "What is React?", "answer": "React is a JS library for building UIs."}
]

Now generate 5 questions for a ${role} with ${experience} years experience.
Focus on topics: ${topicsToFocus}.
`;

    const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);

    let rawText = result.response.text();
    rawText = rawText.replace(/```json|```/gi, "").trim();
    const match = rawText.match(/\[([\s\S]*?)\]/);
    if (match) rawText = match[0];

    let data;
    try {
      data = JSON.parse(rawText);
    } catch (err) {
      console.error("Failed to parse JSON:", rawText);
      return res.status(400).json({ message: "Invalid JSON from model" });
    }

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    const createdQuestions = await Question.insertMany(
      data.map((q) => ({
        session: sessionId,
        question: q.question,
        answer: q.answer,
      }))
    );

    // If you want to link questions to session:
    if (session.questions) {
      session.questions.push(...createdQuestions.map((q) => q._id));
      await session.save();
    }

    return res.status(201).json({
      message: "Questions created successfully",
    });

  } catch (error) {
    console.error("Error in generateInterviewQuestion:", error);
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

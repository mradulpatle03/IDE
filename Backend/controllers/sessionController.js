const Question = require("../models/questionModel");
const Session = require("../models/sessionModel");

const createSession = async (req, res) => {
  try {
    const { role, experience, topicsToFocus } = req.body;
    const userId = req.id;

    if (!role || !experience || !topicsToFocus) {
      return res.status(401).json({
        message: "Please provide all the details",
      });
    }

    const session = await Session.create({
      user: userId,
      role,
      experience,
      topicsToFocus,
    });

    await session.save();

    return res.status(201).json({
      message: "Session created successfully",
    });
  } catch (error) {
    console.error(`This error is coming from createSession, error -> ${error}`);
  }
};

const getSession = async (req, res) => {
  try {
    const userId = req.id;
    const session = await Session.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate("questions");

    res.status(201).json({
      session,
    });
  } catch (error) {
    console.error(`This error is coming from getSession, error -> ${error}`);
  }
};

const getSessionById = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id)
      .sort({ createdAt: -1 })
      .populate({
        path: "questions",
        options: { sort: { isPinned: -1, createdAt: -1 } },
      });

    return res.status(201).json({
      session,
    });
  } catch (error) {
    console.error(`This error is coming from getSessionById, error -> ${error}`);
  }
};

const deleteSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(401).json({
        message: "Session not found",
      });
    }

    await Question.deleteMany({ session: session._id });
    await session.deleteOne();

    return res.status(201).json({
      message: "Session deleted successfully",
    });
  } catch (error) {
    console.error(`This error is coming from deleteSession, error -> ${error}`);
  }
};

module.exports = {
  createSession,
  getSession,
  getSessionById,
  deleteSession,
};

const express = require("express");
const router = express.Router();
const { getLeetCodeQuestions } = require("../controllers/dsaController");

router.post("/leetcode-questions", getLeetCodeQuestions);

module.exports = router;

const express = require("express");
const { handleChat } = require("../controllers/chatBotController");

const router = express.Router();

router.post("/gen", handleChat);

module.exports = router;

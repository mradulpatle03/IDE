// auth.routes.js
const express = require("express");
const AuthMiddleware = require("../middleware/Auth.middleware");
const userModel = require("../models/userModel");

const router = express.Router();

// Check if token cookie is valid
router.get("/checkToken", AuthMiddleware,async (req, res) => {
  try {
    const user = await userModel.findById(req.id);
    if (!user)
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    console.log(user)
    return res.status(200).json({ success: true, user });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
} );

module.exports = router;
const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const imagekit = require("../config/imagekit");

const secret = process.env.SECRET_KEY;

const upload = multer();
exports.upload = upload;

exports.signUp = async (req, res) => {
  try {
    const { email, pwd, fullName } = req.body;

    if (!email || !pwd || !fullName) {
      return res.status(400).json({ success: false, msg: "All fields are required" });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, msg: "Email already exists" });
    }

    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(pwd, salt);

    await userModel.create({ email, password: hash, fullName });

    return res.status(200).json({ success: true, msg: "User created successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, msg: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, pwd } = req.body;

    if (!email || !pwd) {
      return res.status(400).json({ message: "All fields are required", success: false });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }

    const isMatch = await bcrypt.compare(pwd, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password", success: false });
    }

    const token = jwt.sign({ userId: user._id }, secret, { expiresIn: "7d" });

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });

    return res.json({
      message: `${user.fullName} logged in successfully`,
      success: true,
      user,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await userModel.findById(req.id);
    if (!user) return res.status(404).json({ message: "User not found", success: false });

    return res.status(200).json({ success: true, user });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.logOut = async (req, res) => {
  try {
    return res
      .clearCookie("token", {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      })
      .json({
        message: "Logged out successfully",
        success: true,
      });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { fullName } = req.body;
    const profilePicture = req.file;

    const user = await userModel.findById(req.id);
    if (!user) return res.status(404).json({ message: "User not found", success: false });

    if (fullName) user.fullName = fullName;

    if (profilePicture) {
      const uploadResult = await imagekit.upload({
        file: profilePicture.buffer,
        fileName: profilePicture.originalname,
      });
      user.profilPhoto = uploadResult.url;
    }

    await user.save();

    return res.status(200).json({ success: true, message: "Profile updated successfully", user });
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
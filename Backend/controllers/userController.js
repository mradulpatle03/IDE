const userModel = require("../models/userModel");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const secret = "secret";

exports.signUp = async (req, res) => {
  try {

    let { email, pwd, fullName } = req.body;

    let emailCon = await userModel.findOne({ email: email });
    if (emailCon) {
      return res.status(400).json({
        success: false,
        msg: "Email already exist"
      })
    }

    bcrypt.genSalt(12, function (err, salt) {
      bcrypt.hash(pwd, salt, async function (err, hash) {

        let user = await userModel.create({
          email: email,
          password: hash,
          fullName: fullName
        });

        return res.status(200).json({
          success: true,
          msg: "User created successfully",
        });

      });
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      msg: error.message
    });
  }
};

exports.login = async (req, res) => {
  try {
    let { email, pwd } = req.body;

    let user = await userModel.findOne({ email: email });
    if (!user) {
      return res.status(404).json({
        success: false,
        msg: "User not found"
      });
    }

    bcrypt.compare(pwd, user.password, function (err, result) {
      if (result) {

        let token = jwt.sign({ userId: user._id }, secret)

        return res.status(200).json({
          success: true,
          msg: "User logged in successfully",
          token
        });
      }
      else {
        return res.status(401).json({
          success: false,
          msg: "Invalid password"
        });
      }
    })

  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: error.message
    })
  }
};


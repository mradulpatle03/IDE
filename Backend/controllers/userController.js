const userModel = require("../models/userModel");
const projectModel = require("../models/projectModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const imagekit = require("../config/imagekit");

const secret = "secret";

const upload = multer();
exports.upload = upload;

function getStartupCode(language) {
  if (language.toLowerCase() === "python") {
    return 'print("Hello World")';
  } else if (language.toLowerCase() === "java") {
    return 'public class Main { public static void main(String[] args) { System.out.println("Hello World"); } }';
  } else if (language.toLowerCase() === "javascript") {
    return 'console.log("Hello World");';
  } else if (language.toLowerCase() === "cpp") {
    return '#include <iostream>\n\nint main() {\n    std::cout << "Hello World" << std::endl;\n    return 0;\n}';
  } else if (language.toLowerCase() === "c") {
    return '#include <stdio.h>\n\nint main() {\n    printf("Hello World\\n");\n    return 0;\n}';
  } else if (language.toLowerCase() === "go") {
    return 'package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello World")\n}';
  } else if (language.toLowerCase() === "bash") {
    return 'echo "Hello World"';
  } else {
    return "Language not supported";
  }
}
exports.signUp = async (req, res) => {
  try {
    let { email, pwd, fullName } = req.body;

    if (!email || !pwd || !fullName) {
      return res.status(400).json({
        success: false,
        msg: "All fields are required",
      });
    }

    let emailCon = await userModel.findOne({ email: email });
    if (emailCon) {
      return res.status(400).json({
        success: false,
        msg: "Email already exist",
      });
    }

    bcrypt.genSalt(12, function (err, salt) {
      bcrypt.hash(pwd, salt, async function (err, hash) {
        let user = await userModel.create({
          email: email,
          password: hash,
          fullName: fullName,
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
      msg: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    let { email, pwd } = req.body;

    if (!email || !pwd) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }

    let user = await userModel.findOne({ email: email });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    bcrypt.compare(pwd, user.password, function (err, result) {
      if (result) {
        let token = jwt.sign({ userId: user._id }, secret);

        return res.cookie("token", token, { httpOnly: true }).json({
          message: `${user.fullName} logged in successfully`,
          success: true,
          user,
        });
      } else {
        return res.status(401).json({
          message: "Invalid password",
          success: false,
        });
      }
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

exports.getUser = async (req, res) => {
  try {
    const userId = req.id;
    const user = await userModel.findById(userId);
    return res.status(201).json({
      user,
    });
  } catch (error) {
    console.log(error);
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
    const userId = req.id;
    const { fullName } = req.body || {};

    const profilePicture = req.file;

    const user = await userModel.findByIdAndUpdate(userId, {
      fullName
    }, { new: true, runValidators: true });

    if(profilePicture){
        const result = await imagekit.upload({
            file: profilePicture.buffer,
            fileName: profilePicture.originalname,
        });
        user.profilPhoto = result.url
    }

    await user.save();


    return res.status(201).json({
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.createProj = async (req, res) => {
  try {
    let { name, projLanguage, token, version } = req.body;
    let decoded = jwt.verify(token, secret);
    let user = await userModel.findOne({ _id: decoded.userId });

    if (!user) {
      return res.status(404).json({
        success: false,
        msg: "User not found",
      });
    }

    let project = await projectModel.create({
      name: name,
      projLanguage: projLanguage,
      createdBy: user._id,
      code: getStartupCode(projLanguage),
      version: version,
    });

    return res.status(200).json({
      success: true,
      msg: "Project created successfully",
      projectId: project._id,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      msg: error.message,
    });
  }
};

exports.saveProject = async (req, res) => {
  try {
    let { token, projectId, code } = req.body;
    console.log("DATA: ", token, projectId, code);
    let decoded = jwt.verify(token, secret);
    let user = await userModel.findOne({ _id: decoded.userId });

    if (!user) {
      return res.status(404).json({
        success: false,
        msg: "User not found",
      });
    }

    let project = await projectModel.findOneAndUpdate(
      { _id: projectId },
      { code: code }
    );

    return res.status(200).json({
      success: true,
      msg: "Project saved successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      msg: error.message,
    });
  }
};

exports.getProjects = async (req, res) => {
  try {
    let { token } = req.body;
    let decoded = jwt.verify(token, secret);
    let user = await userModel.findOne({ _id: decoded.userId });

    if (!user) {
      return res.status(404).json({
        success: false,
        msg: "User not found",
      });
    }

    let projects = await projectModel.find({ createdBy: user._id });

    return res.status(200).json({
      success: true,
      msg: "Projects fetched successfully",
      projects: projects,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: error.message,
    });
  }
};

exports.getProject = async (req, res) => {
  try {
    let { token, projectId } = req.body;
    let decoded = jwt.verify(token, secret);
    let user = await userModel.findOne({ _id: decoded.userId });

    if (!user) {
      return res.status(404).json({
        success: false,
        msg: "User not found",
      });
    }

    let project = await projectModel.findOne({ _id: projectId });

    if (project) {
      return res.status(200).json({
        success: true,
        msg: "Project fetched successfully",
        project: project,
      });
    } else {
      return res.status(404).json({
        success: false,
        msg: "Project not found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: error.message,
    });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    let { token, projectId } = req.body;
    let decoded = jwt.verify(token, secret);
    let user = await userModel.findOne({ _id: decoded.userId });

    if (!user) {
      return res.status(404).json({
        success: false,
        msg: "User not found",
      });
    }

    let project = await projectModel.findOneAndDelete({ _id: projectId });

    return res.status(200).json({
      success: true,
      msg: "Project deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: error.message,
    });
  }
};

exports.editProject = async (req, res) => {
  try {
    let { token, projectId, name } = req.body;
    let decoded = jwt.verify(token, secret);
    let user = await userModel.findOne({ _id: decoded.userId });

    if (!user) {
      return res.status(404).json({
        success: false,
        msg: "User not found",
      });
    }

    let project = await projectModel.findOne({ _id: projectId });
    if (project) {
      project.name = name;
      await project.save();
      return res.status(200).json({
        success: true,
        msg: "Project edited successfully",
      });
    } else {
      return res.status(404).json({
        success: false,
        msg: "Project not found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: error.message,
    });
  }
};

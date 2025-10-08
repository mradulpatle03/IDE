const userModel = require("../models/userModel");
const projectModel = require("../models/projectModel");

function getStartupCode(language) {
  const lang = language.toLowerCase();
  switch (lang) {
    case "python":
      return 'print("Hello World")';
    case "java":
      return 'public class Main { public static void main(String[] args) { System.out.println("Hello World"); } }';
    case "javascript":
      return 'console.log("Hello World");';
    case "cpp":
      return '#include <iostream>\n\nint main() {\n    std::cout << "Hello World" << std::endl;\n    return 0;\n}';
    case "c":
      return '#include <stdio.h>\n\nint main() {\n    printf("Hello World\\n");\n    return 0;\n}';
    case "go":
      return 'package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello World")\n}';
    case "bash":
      return 'echo "Hello World"';
    default:
      return "Language not supported";
  }
}

exports.createProj = async (req, res) => {
  try {
    const { name, projLanguage, version } = req.body;
    const userId = req.id;

    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ success: false, msg: "User not found" });

    const project = await projectModel.create({
      name,
      projLanguage,
      createdBy: user._id,
      code: getStartupCode(projLanguage),
      version,
    });

    return res.status(200).json({
      success: true,
      msg: "Project created successfully",
      projectId: project._id,
    });
  } catch (error) {
    return res.status(500).json({ success: false, msg: error.message });
  }
};

exports.saveProject = async (req, res) => {
  try {
    const { projectId, code } = req.body;
    const userId = req.id;

    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ success: false, msg: "User not found" });

    await projectModel.findByIdAndUpdate(projectId, { code });

    return res.status(200).json({ success: true, msg: "Project saved successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, msg: error.message });
  }
};

exports.getProjects = async (req, res) => {
  try {
    const projects = await projectModel.find({ createdBy: req.id });
    return res.status(200).json({
      success: true,
      msg: "Projects fetched successfully",
      projects,
    });
  } catch (error) {
    return res.status(500).json({ success: false, msg: error.message });
  }
};

exports.getProject = async (req, res) => {
  try {
    const { projectId } = req.body;
    const project = await projectModel.findOne({ _id: projectId, createdBy: req.id });

    if (!project)
      return res.status(404).json({ success: false, msg: "Project not found" });

    return res.status(200).json({
      success: true,
      msg: "Project fetched successfully",
      project,
    });
  } catch (error) {
    return res.status(500).json({ success: false, msg: error.message });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const { projectId } = req.body;
    const project = await projectModel.findOneAndDelete({
      _id: projectId,
      createdBy: req.id,
    });

    if (!project)
      return res.status(404).json({ success: false, msg: "Project not found" });

    return res.status(200).json({ success: true, msg: "Project deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, msg: error.message });
  }
};

exports.editProject = async (req, res) => {
  try {
    const { projectId, name } = req.body;
    const project = await projectModel.findOne({
      _id: projectId,
      createdBy: req.id,
    });

    if (!project)
      return res.status(404).json({ success: false, msg: "Project not found" });

    project.name = name;
    await project.save();

    return res.status(200).json({ success: true, msg: "Project edited successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, msg: error.message });
  }
};
const express = require('express');
const { createProj, saveProject, getProjects, getProject, deleteProject, editProject } = require('../controllers/projectController');
const AuthMiddleware = require("../middleware/Auth.middleware");
const router = express.Router();


router.post("/createProj",AuthMiddleware, createProj); 
router.post("/saveProject",AuthMiddleware, saveProject); 
router.post("/getProjects",AuthMiddleware, getProjects); 
router.post("/getProject",AuthMiddleware, getProject); 
router.post("/deleteProject",AuthMiddleware, deleteProject); 
router.post("/editProject",AuthMiddleware, editProject);

module.exports = router;
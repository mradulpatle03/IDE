const express = require('express');
const AuthMiddleware  = require('../middleware/Auth.middleware.js');
const { generateInterviewQuestion, togglePinQuestion } = require('../controllers/questionController.js');

const questionRoute = express.Router();

questionRoute.route('/addQuestion').post(AuthMiddleware, generateInterviewQuestion);
questionRoute.route('/toggleQuestion/:id').post(AuthMiddleware, togglePinQuestion);

module.exports = questionRoute;

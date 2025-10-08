const express = require('express');
const AuthMiddleware = require('../middleware/Auth.middleware.js');
const { createSession, deleteSession, getSession, getSessionById } = require('../controllers/sessionController.js');

const sessionRouter = express.Router();

sessionRouter.route('/createSession').post(AuthMiddleware, createSession);
sessionRouter.route('/getMySession').get(AuthMiddleware, getSession);
sessionRouter.route('/getMySessionById/:id').get(AuthMiddleware, getSessionById);
sessionRouter.route('/deleteMySession/:id').delete(AuthMiddleware, deleteSession);

module.exports = sessionRouter;

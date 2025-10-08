const express = require('express');
const { signUp, login,getUser,logOut,updateProfile,upload } = require('../controllers/userController');
const AuthMiddleware = require("../middleware/Auth.middleware");

const router = express.Router();


router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post("/signUp", signUp);
router.post("/login", login); 
router.get("/getUser",AuthMiddleware, getUser);
router.get("/logout",AuthMiddleware, logOut);
router.post("/updateProfile",AuthMiddleware,upload.single("profilPhoto"), updateProfile);
 

module.exports = router;
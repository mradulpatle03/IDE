const express = require('express');
const { signUp, login } = require('../controllers/userController');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post("/signUp", signUp);
router.post("/login", login);


module.exports = router;
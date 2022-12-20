const express = require('express');

const { registerUser, loginUser } = require('../controllers/userController');

// create router
// /api/users
const router = express.Router();

// use controller on routes
router.route('/')
  .post(registerUser);

router.route('/login')
  .post(loginUser);

module.exports = router;

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.route('/signup').post(authController.createUser); // http://localhost:3000/users/signup

module.exports = router;

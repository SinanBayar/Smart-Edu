const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const { body } = require('express-validator'); // Validation kontrolu buradan yapıyoruz.
const User = require('../models/User');

router.route('/signup').post(
  [
    body('name').not().isEmpty().withMessage(' Please Enter Your Name'), // Register için name alanı boş olamaz.
    body('email')
      .isEmail()
      .withMessage(' Please Enter Valid Email') //Register için email alanında mail yazılmalı.
      .custom((userEmail) => {
        // Register'da zaten kayıtlı olan email tekrar kullanılamaz. (Custom validate)
        return User.findOne({ email: userEmail }).then((user) => {
          if (user) {
            return Promise.reject('Email is already exists!');
          }
        });
      }),
    body('password').not().isEmpty().withMessage(' Please Enter Password'), // Register için password alanı boş olamaz.
  ],
  authController.createUser
); // http://localhost:3000/users/signup
router.route('/login').post(authController.loginUser); // http://localhost:3000/users/login
router.route('/logout').get(authController.logoutUser); // http://localhost:3000/users/logout
router.route('/dashboard').get(authMiddleware, authController.getDashboardPage); // http://localhost:3000/users/dashboard
router.route('/:id').delete(authController.deleteUser);

module.exports = router;

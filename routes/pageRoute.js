const express = require('express');
const router = express.Router();
const pageController = require('../controllers/pageController');
const redirectMiddleware = require('../middlewares/redirectMiddleware');

router.route('/').get(pageController.getIndexPage);
router.route('/about').get(pageController.getAboutPage);
router.route('/register').get(redirectMiddleware, pageController.getRegisterPage);
router.route('/login').get(redirectMiddleware, pageController.getLoginPage);
router.route('/contact').get(pageController.getContactPage);
router.route('/contact').post(pageController.sendEmail);

// Bu şekilde de kullanılabilinir;
/* router.get('/', pageController.getIndexPage);
router.get('/about', pageController.getAboutPage); */

module.exports = router;

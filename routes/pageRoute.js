const express = require('express');
const router = express.Router();
const pageController = require('../controllers/pageController');

router.route('/').get(pageController.getIndexPage);
router.route('/about').get(pageController.getAboutPage);
router.route('/register').get(pageController.getRegisterPage);

// Bu şekilde de kullanılabilinir;
/* router.get('/', pageController.getIndexPage);
router.get('/about', pageController.getAboutPage); */

module.exports = router;

const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

router.route('/').post(categoryController.createCategory); // http://localhost:3000/categories

module.exports = router;

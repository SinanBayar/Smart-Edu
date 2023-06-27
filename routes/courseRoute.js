const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');

router.route('/').post(courseController.createCourse); // http://localhost:3000/courses
router.route('/').get(courseController.getAllCourses);

module.exports = router;

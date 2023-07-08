const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.route('/').post(roleMiddleware(["Teacher", "Admin"]), courseController.createCourse); // http://localhost:3000/courses
router.route('/').get(courseController.getAllCourses);
router.route('/:slug').get(courseController.getCourse);
router.route('/:slug').delete(courseController.deleteCourse);
router.route('/enroll').post(courseController.enrollCourse);
router.route('/release').post(courseController.releaseCourse);

module.exports = router;

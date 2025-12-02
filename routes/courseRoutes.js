const express = require('express');
const router = express.Router();
const {
  createCourse,
  getCourses,
  getCourseById,
  enrollUser,
  getCourseStudents
} = require('../controllers/courseController');

router.post('/', createCourse);
router.get('/', getCourses);
router.get('/:id', getCourseById);
router.post('/:courseId/enroll', enrollUser);
router.get('/:courseId/students', getCourseStudents);

module.exports = router;

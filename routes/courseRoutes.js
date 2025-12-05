const express = require('express');
const router = express.Router();
const {
  createCourse,
  getCourses,
  getCourseById,
  enrollUser,
  getCourseStudents
} = require('../controllers/courseController');
const { protect } = require('../middleware/authMiddleware');

// Toutes les routes de cours sont protégées
router.use(protect);

router.post('/', createCourse);
router.get('/', getCourses);
router.get('/:id', getCourseById);
router.post('/:courseId/enroll', protect,enrollUser);
router.get('/:courseId/students', getCourseStudents);

module.exports = router;

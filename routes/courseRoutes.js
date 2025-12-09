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

// Routes publiques (sans authentification requise)
router.get('/', getCourses);  // Liste des cours
router.get('/:id', getCourseById);  // Détails d'un cours

// Routes protégées (authentification requise)
router.use(protect);  // Toutes les routes suivantes nécessitent une authentification
router.post('/', createCourse);
router.post('/:courseId/enroll', enrollUser);
router.get('/:courseId/students', getCourseStudents);

module.exports = router;
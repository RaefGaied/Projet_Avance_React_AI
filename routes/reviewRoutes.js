const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  addReview,
  getCourseReviews,
  getUserReviews,
  deleteReview,
  updateReview
} = require('../controllers/reviewController');

// Routes pour les reviews d'un cours
router.post('/:courseId/reviews', protect, addReview);
router.get('/:courseId/reviews', getCourseReviews);

// Routes pour les fonctionnalités "Mes Reviews"
router.get('/user/:userId', protect, getUserReviews);    // GET /api/reviews/user/:userId
router.delete('/:reviewId', protect, deleteReview);      // DELETE /api/reviews/:reviewId  
router.put('/:reviewId', protect, updateReview);         // PUT /api/reviews/:reviewId

module.exports = router;
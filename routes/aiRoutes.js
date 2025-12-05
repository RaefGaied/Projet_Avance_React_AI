const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    analyzeReviews,
    generateCourseDescription,
    suggestSimilarCourses,
    generateBio,
    getPlatformInsights
} = require('../controllers/aiController');


router.post('/analyze-reviews/:courseId', protect, analyzeReviews);
router.post('/generate-description', protect, generateCourseDescription);
router.post('/generate-bio', protect, generateBio);
router.get('/platform-insights', protect, getPlatformInsights);
router.post('/similar-courses/:courseId', suggestSimilarCourses);

module.exports = router;

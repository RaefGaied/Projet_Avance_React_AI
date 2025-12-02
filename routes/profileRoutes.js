const express = require('express');
const router = express.Router();
const {
  createProfile,
  getProfileByUser,
  updateProfile
} = require('../controllers/profileController');

router.post('/:userId/profile', createProfile);
router.get('/:userId/profile', getProfileByUser);
router.put('/:userId/profile', updateProfile);

module.exports = router;

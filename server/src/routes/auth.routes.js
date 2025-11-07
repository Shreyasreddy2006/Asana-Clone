const express = require('express');
const router = express.Router();
const {
  getDefaultSession,
  getMe,
  updateProfile,
  completeOnboarding,
} = require('../controllers/auth.controller');

// All routes are public now
router.get('/session', getDefaultSession);
router.get('/me', getMe);
router.put('/profile', updateProfile);
router.post('/onboarding', completeOnboarding);

module.exports = router;

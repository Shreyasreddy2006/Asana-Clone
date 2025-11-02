const express = require('express');
const {
  register,
  login,
  getMe,
  updateProfile,
  completeOnboarding
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.post('/onboarding', protect, completeOnboarding);

module.exports = router;

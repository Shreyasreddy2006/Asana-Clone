const express = require('express');
const router = express.Router();
const {
  searchUsers,
  getUserById,
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  getActivityFeed,
} = require('../controllers/user.controller');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

router.get('/search', searchUsers);
router.get('/notifications', getNotifications);
router.put('/notifications/read-all', markAllNotificationsRead);
router.put('/notifications/:id/read', markNotificationRead);
router.get('/activity', getActivityFeed);
router.get('/:id', getUserById);

module.exports = router;

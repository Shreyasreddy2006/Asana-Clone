const express = require('express');
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  addComment,
  updateComment,
  deleteComment,
  addSubtask,
  updateSubtask,
  deleteSubtask,
  addFollower,
  removeFollower,
  addDependency,
  removeDependency,
  uploadAttachment,
  deleteAttachment
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');
const { uploadSingle, handleUploadError } = require('../middleware/upload');
const { uploadLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getTasks)
  .post(createTask);

router.route('/:id')
  .get(getTask)
  .put(updateTask)
  .delete(deleteTask);

// Comments
router.post('/:id/comments', addComment);
router.put('/:id/comments/:commentId', updateComment);
router.delete('/:id/comments/:commentId', deleteComment);

// Subtasks
router.post('/:id/subtasks', addSubtask);
router.put('/:id/subtasks/:subtaskId', updateSubtask);
router.delete('/:id/subtasks/:subtaskId', deleteSubtask);

// Followers
router.post('/:id/followers', addFollower);
router.delete('/:id/followers/:userId', removeFollower);

// Dependencies
router.post('/:id/dependencies', addDependency);
router.delete('/:id/dependencies/:dependencyId', removeDependency);

// Attachments
router.post('/:id/attachments', uploadLimiter, uploadSingle, handleUploadError, uploadAttachment);
router.delete('/:id/attachments/:attachmentId', deleteAttachment);

module.exports = router;

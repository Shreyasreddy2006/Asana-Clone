const express = require('express');
const router = express.Router();
const {
  getTasks,
  getMyTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  addSubtask,
  updateSubtask,
  deleteSubtask,
  addComment,
  getComments,
  updateComment,
  deleteComment,
  addReaction,
  removeReaction,
  addFollower,
  removeFollower,
  addDependency,
  removeDependency,
  searchTasks,
} = require('../controllers/task.controller');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

// Search tasks
router.get('/search', searchTasks);

// My tasks
router.get('/my-tasks', getMyTasks);

// Get all tasks (supports ?project=id&assignee=id query params)
router.route('/').get(getTasks).post(createTask);

// Tasks under project (backward compatibility)
router.route('/project/:projectId').get(getTasks).post(createTask);

// Individual task routes
router.route('/:id').get(getTask).put(updateTask).delete(deleteTask);

// Subtasks
router.post('/:id/subtasks', addSubtask);
router
  .route('/:id/subtasks/:subtaskId')
  .put(updateSubtask)
  .delete(deleteSubtask);

// Comments
router.route('/:id/comments').get(getComments).post(addComment);
router.route('/comments/:id').put(updateComment).delete(deleteComment);
router.post('/comments/:id/reactions', addReaction);
router.delete('/comments/:id/reactions/:reactionId', removeReaction);

// Followers
router.post('/:id/followers', addFollower);
router.delete('/:id/followers/:userId', removeFollower);

// Dependencies
router.post('/:id/dependencies', addDependency);
router.delete('/:id/dependencies/:dependencyId', removeDependency);

module.exports = router;

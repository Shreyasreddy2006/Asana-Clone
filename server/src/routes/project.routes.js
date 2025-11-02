const express = require('express');
const router = express.Router();
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
  createSection,
  updateSection,
  deleteSection,
  createCustomField,
} = require('../controllers/project.controller');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

// Get all projects (supports ?workspace=id query param)
router.route('/').get(getProjects).post(createProject);

// Projects under workspace (backward compatibility)
router
  .route('/workspace/:workspaceId')
  .get(getProjects)
  .post(createProject);

// Individual project routes
router.route('/:id').get(getProject).put(updateProject).delete(deleteProject);

// Project members
router.post('/:id/members', addMember);
router.delete('/:id/members/:userId', removeMember);

// Project sections
router.route('/:id/sections').post(createSection);
router
  .route('/:id/sections/:sectionId')
  .put(updateSection)
  .delete(deleteSection);

// Custom fields
router.post('/:id/custom-fields', createCustomField);

module.exports = router;

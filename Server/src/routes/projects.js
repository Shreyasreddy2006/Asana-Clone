const express = require('express');
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  addSection,
  updateSection,
  deleteSection,
  addMember,
  updateMember,
  removeMember
} = require('../controllers/projectController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getProjects)
  .post(createProject);

router.route('/:id')
  .get(getProject)
  .put(updateProject)
  .delete(deleteProject);

// Sections
router.post('/:id/sections', addSection);
router.put('/:id/sections/:sectionId', updateSection);
router.delete('/:id/sections/:sectionId', deleteSection);

// Members
router.post('/:id/members', addMember);
router.put('/:id/members/:memberId', updateMember);
router.delete('/:id/members/:memberId', removeMember);

module.exports = router;

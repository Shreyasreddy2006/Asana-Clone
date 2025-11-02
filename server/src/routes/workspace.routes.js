const express = require('express');
const router = express.Router();
const {
  getWorkspaces,
  getWorkspace,
  createWorkspace,
  updateWorkspace,
  deleteWorkspace,
  inviteMember,
  removeMember,
  updateMemberRole,
  createTeam,
  getTeams,
} = require('../controllers/workspace.controller');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

router.route('/').get(getWorkspaces).post(createWorkspace);

router
  .route('/:id')
  .get(getWorkspace)
  .put(updateWorkspace)
  .delete(deleteWorkspace);

router.post('/:id/members', inviteMember);
router.delete('/:id/members/:userId', removeMember);
router.put('/:id/members/:userId', updateMemberRole);

router.route('/:id/teams').get(getTeams).post(createTeam);

module.exports = router;

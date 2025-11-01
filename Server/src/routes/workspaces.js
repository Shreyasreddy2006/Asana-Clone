const express = require('express');
const {
  getWorkspaces,
  getWorkspace,
  createWorkspace,
  updateWorkspace,
  deleteWorkspace,
  addMember
} = require('../controllers/workspaceController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getWorkspaces)
  .post(createWorkspace);

router.route('/:id')
  .get(getWorkspace)
  .put(updateWorkspace)
  .delete(deleteWorkspace);

router.post('/:id/members', addMember);

module.exports = router;

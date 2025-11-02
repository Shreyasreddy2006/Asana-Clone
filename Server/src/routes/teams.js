const express = require('express');
const {
  getTeams,
  getTeam,
  createTeam,
  updateTeam,
  deleteTeam,
  addMember,
  updateMember,
  removeMember
} = require('../controllers/teamController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getTeams)
  .post(createTeam);

router.route('/:id')
  .get(getTeam)
  .put(updateTeam)
  .delete(deleteTeam);

// Members
router.post('/:id/members', addMember);
router.put('/:id/members/:memberId', updateMember);
router.delete('/:id/members/:memberId', removeMember);

module.exports = router;

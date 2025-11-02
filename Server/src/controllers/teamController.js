const Team = require('../models/Team');
const User = require('../models/User');
const Workspace = require('../models/Workspace');

// @desc    Get all teams in workspace
// @route   GET /api/teams?workspace=workspaceId
// @access  Private
exports.getTeams = async (req, res) => {
  try {
    const { workspace } = req.query;

    let query = {};

    // Filter by workspace if provided
    if (workspace) {
      query.workspace = workspace;

      // Check if user is member of this workspace
      const workspaceDoc = await Workspace.findById(workspace);
      if (!workspaceDoc) {
        return res.status(404).json({
          success: false,
          message: 'Workspace not found'
        });
      }

      const isMember = workspaceDoc.members.some(
        member => member.user.toString() === req.user.id
      );

      if (!isMember) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to view teams in this workspace'
        });
      }
    } else {
      // Get all workspaces where user is a member
      const workspaces = await Workspace.find({
        'members.user': req.user.id
      });

      const workspaceIds = workspaces.map(w => w._id);
      query.workspace = { $in: workspaceIds };
    }

    const teams = await Team.find(query)
      .populate('workspace', 'name')
      .populate('members.user', 'name email avatar')
      .populate('projects', 'name color icon')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      teams
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single team
// @route   GET /api/teams/:id
// @access  Private
exports.getTeam = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id)
      .populate('workspace', 'name description')
      .populate('members.user', 'name email avatar')
      .populate('projects', 'name description color icon status');

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }

    // Check if user is member of this team or workspace
    const isMember = team.members.some(
      member => member.user._id.toString() === req.user.id
    );

    const workspace = await Workspace.findById(team.workspace._id);
    const isWorkspaceMember = workspace.members.some(
      member => member.user.toString() === req.user.id
    );

    if (!isMember && !isWorkspaceMember) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this team'
      });
    }

    res.json({
      success: true,
      team
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new team
// @route   POST /api/teams
// @access  Private
exports.createTeam = async (req, res) => {
  try {
    const { name, description, workspace, color } = req.body;

    // Check if workspace exists and user is member
    const workspaceDoc = await Workspace.findById(workspace);
    if (!workspaceDoc) {
      return res.status(404).json({
        success: false,
        message: 'Workspace not found'
      });
    }

    const isMember = workspaceDoc.members.some(
      member => member.user.toString() === req.user.id
    );

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to create teams in this workspace'
      });
    }

    // Create team with creator as lead
    const team = await Team.create({
      name,
      description,
      workspace,
      color: color || '#4573D2',
      members: [{
        user: req.user.id,
        role: 'lead'
      }]
    });

    // Add team to workspace
    workspaceDoc.teams.push(team._id);
    await workspaceDoc.save();

    // Add team to user
    const user = await User.findById(req.user.id);
    user.teams.push(team._id);
    await user.save();

    const populatedTeam = await Team.findById(team._id)
      .populate('workspace', 'name')
      .populate('members.user', 'name email avatar');

    res.status(201).json({
      success: true,
      team: populatedTeam
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update team
// @route   PUT /api/teams/:id
// @access  Private
exports.updateTeam = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }

    // Check if user is team lead
    const isLead = team.members.some(
      member => member.user.toString() === req.user.id && member.role === 'lead'
    );

    if (!isLead) {
      return res.status(403).json({
        success: false,
        message: 'Only team leads can update the team'
      });
    }

    const { name, description, color } = req.body;

    if (name) team.name = name;
    if (description !== undefined) team.description = description;
    if (color) team.color = color;

    await team.save();

    const updatedTeam = await Team.findById(team._id)
      .populate('workspace', 'name')
      .populate('members.user', 'name email avatar')
      .populate('projects', 'name color icon');

    res.json({
      success: true,
      team: updatedTeam
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete team
// @route   DELETE /api/teams/:id
// @access  Private
exports.deleteTeam = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }

    // Check if user is team lead
    const isLead = team.members.some(
      member => member.user.toString() === req.user.id && member.role === 'lead'
    );

    if (!isLead) {
      return res.status(403).json({
        success: false,
        message: 'Only team leads can delete the team'
      });
    }

    // Remove team from workspace
    await Workspace.findByIdAndUpdate(team.workspace, {
      $pull: { teams: team._id }
    });

    // Remove team from all members
    for (const member of team.members) {
      await User.findByIdAndUpdate(member.user, {
        $pull: { teams: team._id }
      });
    }

    // Note: Projects remain but team reference is removed
    const Project = require('../models/Project');
    await Project.updateMany(
      { team: team._id },
      { $unset: { team: '' } }
    );

    await team.deleteOne();

    res.json({
      success: true,
      message: 'Team deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Add member to team
// @route   POST /api/teams/:id/members
// @access  Private
exports.addMember = async (req, res) => {
  try {
    const { userId, role } = req.body;

    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }

    // Check if requester is team lead
    const isLead = team.members.some(
      member => member.user.toString() === req.user.id && member.role === 'lead'
    );

    if (!isLead) {
      return res.status(403).json({
        success: false,
        message: 'Only team leads can add members'
      });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user is member of workspace
    const workspace = await Workspace.findById(team.workspace);
    const isWorkspaceMember = workspace.members.some(
      member => member.user.toString() === userId
    );

    if (!isWorkspaceMember) {
      return res.status(400).json({
        success: false,
        message: 'User must be a workspace member first'
      });
    }

    // Check if already a member
    const alreadyMember = team.members.some(
      member => member.user.toString() === userId
    );

    if (alreadyMember) {
      return res.status(400).json({
        success: false,
        message: 'User is already a team member'
      });
    }

    // Add member
    team.members.push({
      user: userId,
      role: role || 'member'
    });

    await team.save();

    // Add team to user
    user.teams.push(team._id);
    await user.save();

    const updatedTeam = await Team.findById(team._id)
      .populate('workspace', 'name')
      .populate('members.user', 'name email avatar')
      .populate('projects', 'name color icon');

    res.json({
      success: true,
      team: updatedTeam
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update member role
// @route   PUT /api/teams/:id/members/:memberId
// @access  Private
exports.updateMember = async (req, res) => {
  try {
    const { role } = req.body;

    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }

    // Check if requester is team lead
    const isLead = team.members.some(
      member => member.user.toString() === req.user.id && member.role === 'lead'
    );

    if (!isLead) {
      return res.status(403).json({
        success: false,
        message: 'Only team leads can update member roles'
      });
    }

    // Find member
    const member = team.members.find(
      m => m.user.toString() === req.params.memberId
    );

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found in team'
      });
    }

    // Prevent removing last lead
    if (member.role === 'lead' && role !== 'lead') {
      const leadCount = team.members.filter(m => m.role === 'lead').length;
      if (leadCount === 1) {
        return res.status(400).json({
          success: false,
          message: 'Cannot remove the last team lead. Promote another member first.'
        });
      }
    }

    member.role = role;
    await team.save();

    const updatedTeam = await Team.findById(team._id)
      .populate('workspace', 'name')
      .populate('members.user', 'name email avatar')
      .populate('projects', 'name color icon');

    res.json({
      success: true,
      team: updatedTeam
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Remove member from team
// @route   DELETE /api/teams/:id/members/:memberId
// @access  Private
exports.removeMember = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }

    // Check if requester is team lead or removing themselves
    const isLead = team.members.some(
      member => member.user.toString() === req.user.id && member.role === 'lead'
    );

    const isSelf = req.params.memberId === req.user.id;

    if (!isLead && !isSelf) {
      return res.status(403).json({
        success: false,
        message: 'Only team leads can remove members'
      });
    }

    // Find member
    const memberIndex = team.members.findIndex(
      m => m.user.toString() === req.params.memberId
    );

    if (memberIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Member not found in team'
      });
    }

    const memberToRemove = team.members[memberIndex];

    // Prevent removing last lead
    if (memberToRemove.role === 'lead') {
      const leadCount = team.members.filter(m => m.role === 'lead').length;
      if (leadCount === 1) {
        return res.status(400).json({
          success: false,
          message: 'Cannot remove the last team lead. Promote another member first.'
        });
      }
    }

    // Remove member from team
    team.members.splice(memberIndex, 1);
    await team.save();

    // Remove team from user
    await User.findByIdAndUpdate(req.params.memberId, {
      $pull: { teams: team._id }
    });

    const updatedTeam = await Team.findById(team._id)
      .populate('workspace', 'name')
      .populate('members.user', 'name email avatar')
      .populate('projects', 'name color icon');

    res.json({
      success: true,
      team: updatedTeam
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

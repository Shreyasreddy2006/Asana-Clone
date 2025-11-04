const Workspace = require('../models/Workspace');
const Team = require('../models/Team');
const User = require('../models/User');
const Project = require('../models/Project');
const {
  logActivity,
  notifyWorkspaceInvitation,
} = require('../utils/notifications');
const { emitToWorkspace } = require('../config/socket');

// @desc    Get all workspaces for current user
// @route   GET /api/workspaces
// @access  Private
const getWorkspaces = async (req, res) => {
  try {
    const workspaces = await Workspace.find({
      'members.user': req.user._id,
    })
      .populate('owner', 'name email avatar')
      .populate('members.user', 'name email avatar')
      .populate('teams', 'name description')
      .populate('projects', 'name description color icon status');

    res.json({
      success: true,
      workspaces, // Changed from data: workspaces
    });
  } catch (error) {
    console.error('Get workspaces error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Get single workspace
// @route   GET /api/workspaces/:id
// @access  Private
const getWorkspace = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id)
      .populate('owner', 'name email avatar')
      .populate('members.user', 'name email avatar')
      .populate('teams')
      .populate({
        path: 'projects',
        populate: {
          path: 'owner members.user',
          select: 'name email avatar',
        },
      });

    if (!workspace) {
      return res.status(404).json({
        success: false,
        message: 'Workspace not found',
      });
    }

    // Check if user is a member
    const isMember = workspace.members.some(
      (member) => member.user._id.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this workspace',
      });
    }

    res.json({
      success: true,
      workspace, // Changed from data: workspace
    });
  } catch (error) {
    console.error('Get workspace error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Create workspace
// @route   POST /api/workspaces
// @access  Private
const createWorkspace = async (req, res) => {
  try {
    const { name, description, settings } = req.body;

    const workspace = await Workspace.create({
      name,
      description,
      owner: req.user._id,
      members: [
        {
          user: req.user._id,
          role: 'owner',
        },
      ],
      settings: settings || {},
    });

    // Add workspace to user's workspaces
    await User.findByIdAndUpdate(req.user._id, {
      $push: { workspaces: workspace._id },
    });

    // Log activity
    await logActivity({
      user: req.user._id,
      workspace: workspace._id,
      action: 'workspace_created',
      description: `Created workspace "${workspace.name}"`,
    });

    const populatedWorkspace = await Workspace.findById(workspace._id)
      .populate('owner', 'name email avatar')
      .populate('members.user', 'name email avatar');

    res.status(201).json({
      success: true,
      workspace: populatedWorkspace, // Changed from data
    });
  } catch (error) {
    console.error('Create workspace error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Update workspace
// @route   PUT /api/workspaces/:id
// @access  Private
const updateWorkspace = async (req, res) => {
  try {
    const { name, description, settings } = req.body;

    const workspace = await Workspace.findById(req.params.id);

    if (!workspace) {
      return res.status(404).json({
        success: false,
        message: 'Workspace not found',
      });
    }

    // Check if user is owner or admin
    const member = workspace.members.find(
      (m) => m.user.toString() === req.user._id.toString()
    );

    if (!member || !['owner', 'admin'].includes(member.role)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this workspace',
      });
    }

    if (name) workspace.name = name;
    if (description !== undefined) workspace.description = description;
    if (settings) workspace.settings = { ...workspace.settings, ...settings };

    await workspace.save();

    // Log activity
    await logActivity({
      user: req.user._id,
      workspace: workspace._id,
      action: 'workspace_updated',
      description: `Updated workspace "${workspace.name}"`,
    });

    // Emit to workspace
    emitToWorkspace(workspace._id, 'workspace-updated', workspace);

    const populatedWorkspace = await Workspace.findById(workspace._id)
      .populate('owner', 'name email avatar')
      .populate('members.user', 'name email avatar');

    res.json({
      success: true,
      workspace: populatedWorkspace, // Changed from data
    });
  } catch (error) {
    console.error('Update workspace error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Delete workspace
// @route   DELETE /api/workspaces/:id
// @access  Private
const deleteWorkspace = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id);

    if (!workspace) {
      return res.status(404).json({
        success: false,
        message: 'Workspace not found',
      });
    }

    // Check if user is owner
    if (workspace.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this workspace',
      });
    }

    // Delete all projects in workspace
    await Project.deleteMany({ workspace: workspace._id });

    // Delete all teams in workspace
    await Team.deleteMany({ workspace: workspace._id });

    // Remove workspace from all users
    await User.updateMany(
      { workspaces: workspace._id },
      { $pull: { workspaces: workspace._id } }
    );

    await workspace.deleteOne();

    res.json({
      success: true,
      message: 'Workspace deleted successfully',
    });
  } catch (error) {
    console.error('Delete workspace error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Invite member to workspace
// @route   POST /api/workspaces/:id/members
// @access  Private
const inviteMember = async (req, res) => {
  try {
    const { email, role = 'member' } = req.body;

    const workspace = await Workspace.findById(req.params.id);

    if (!workspace) {
      return res.status(404).json({
        success: false,
        message: 'Workspace not found',
      });
    }

    // Check if user has permission
    const member = workspace.members.find(
      (m) => m.user.toString() === req.user._id.toString()
    );

    if (!member || !['owner', 'admin'].includes(member.role)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to invite members',
      });
    }

    // Find user by email
    const userToInvite = await User.findOne({ email });

    if (!userToInvite) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check if already a member
    const existingMember = workspace.members.find(
      (m) => m.user.toString() === userToInvite._id.toString()
    );

    if (existingMember) {
      return res.status(400).json({
        success: false,
        message: 'User is already a member',
      });
    }

    // Add member
    workspace.members.push({
      user: userToInvite._id,
      role,
    });
    await workspace.save();

    // Add workspace to user
    userToInvite.workspaces.push(workspace._id);
    await userToInvite.save();

    // Send notification
    await notifyWorkspaceInvitation(workspace, req.user._id, userToInvite._id);

    // Log activity
    await logActivity({
      user: req.user._id,
      workspace: workspace._id,
      action: 'member_invited',
      description: `Invited ${userToInvite.name} to workspace`,
      metadata: { invitedUserId: userToInvite._id, role },
    });

    // Emit to workspace
    emitToWorkspace(workspace._id, 'member-added', {
      workspace: workspace._id,
      user: userToInvite,
      role,
    });

    const populatedWorkspace = await Workspace.findById(workspace._id)
      .populate('owner', 'name email avatar')
      .populate('members.user', 'name email avatar');

    res.json({
      success: true,
      workspace: populatedWorkspace, // Changed from data
    });
  } catch (error) {
    console.error('Invite member error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Remove member from workspace
// @route   DELETE /api/workspaces/:id/members/:userId
// @access  Private
const removeMember = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id);

    if (!workspace) {
      return res.status(404).json({
        success: false,
        message: 'Workspace not found',
      });
    }

    // Check if user has permission
    const member = workspace.members.find(
      (m) => m.user.toString() === req.user._id.toString()
    );

    if (!member || !['owner', 'admin'].includes(member.role)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to remove members',
      });
    }

    // Cannot remove owner
    if (workspace.owner.toString() === req.params.userId) {
      return res.status(400).json({
        success: false,
        message: 'Cannot remove workspace owner',
      });
    }

    // Remove member
    workspace.members = workspace.members.filter(
      (m) => m.user.toString() !== req.params.userId
    );
    await workspace.save();

    // Remove workspace from user
    await User.findByIdAndUpdate(req.params.userId, {
      $pull: { workspaces: workspace._id },
    });

    // Log activity
    await logActivity({
      user: req.user._id,
      workspace: workspace._id,
      action: 'member_removed',
      description: `Removed member from workspace`,
      metadata: { removedUserId: req.params.userId },
    });

    // Emit to workspace
    emitToWorkspace(workspace._id, 'member-removed', {
      workspace: workspace._id,
      userId: req.params.userId,
    });

    res.json({
      success: true,
      workspace, // Changed from just message
    });
  } catch (error) {
    console.error('Remove member error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Update member role
// @route   PUT /api/workspaces/:id/members/:userId
// @access  Private
const updateMemberRole = async (req, res) => {
  try {
    const { role } = req.body;

    const workspace = await Workspace.findById(req.params.id);

    if (!workspace) {
      return res.status(404).json({
        success: false,
        message: 'Workspace not found',
      });
    }

    // Check if user is owner
    if (workspace.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only owner can change member roles',
      });
    }

    // Cannot change owner role
    if (workspace.owner.toString() === req.params.userId) {
      return res.status(400).json({
        success: false,
        message: 'Cannot change owner role',
      });
    }

    // Update role
    const memberIndex = workspace.members.findIndex(
      (m) => m.user.toString() === req.params.userId
    );

    if (memberIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Member not found',
      });
    }

    workspace.members[memberIndex].role = role;
    await workspace.save();

    // Emit to workspace
    emitToWorkspace(workspace._id, 'member-role-updated', {
      workspace: workspace._id,
      userId: req.params.userId,
      role,
    });

    const populatedWorkspace = await Workspace.findById(workspace._id)
      .populate('owner', 'name email avatar')
      .populate('members.user', 'name email avatar');

    res.json({
      success: true,
      workspace: populatedWorkspace, // Changed from data
    });
  } catch (error) {
    console.error('Update member role error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Create team in workspace
// @route   POST /api/workspaces/:id/teams
// @access  Private
const createTeam = async (req, res) => {
  try {
    const { name, description, members } = req.body;

    const workspace = await Workspace.findById(req.params.id);

    if (!workspace) {
      return res.status(404).json({
        success: false,
        message: 'Workspace not found',
      });
    }

    // Check if user has permission
    const member = workspace.members.find(
      (m) => m.user.toString() === req.user._id.toString()
    );

    if (!member || !['owner', 'admin'].includes(member.role)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to create teams',
      });
    }

    const team = await Team.create({
      name,
      description,
      workspace: workspace._id,
      members: members || [
        {
          user: req.user._id,
          role: 'lead',
        },
      ],
    });

    // Add team to workspace
    workspace.teams.push(team._id);
    await workspace.save();

    // Add team to users
    const memberIds = team.members.map((m) => m.user);
    await User.updateMany(
      { _id: { $in: memberIds } },
      { $push: { teams: team._id } }
    );

    const populatedTeam = await Team.findById(team._id)
      .populate('members.user', 'name email avatar')
      .populate('workspace', 'name');

    res.status(201).json({
      success: true,
      team: populatedTeam, // Changed to match pattern
    });
  } catch (error) {
    console.error('Create team error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Get teams in workspace
// @route   GET /api/workspaces/:id/teams
// @access  Private
const getTeams = async (req, res) => {
  try {
    const teams = await Team.find({ workspace: req.params.id })
      .populate('members.user', 'name email avatar')
      .populate('projects', 'name description color icon status');

    res.json({
      success: true,
      teams, // Changed from data
    });
  } catch (error) {
    console.error('Get teams error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Send bulk invitations to workspace
// @route   POST /api/workspaces/:id/invite
// @access  Private
const sendInvitations = async (req, res) => {
  try {
    const { emails } = req.body;

    const workspace = await Workspace.findById(req.params.id);

    if (!workspace) {
      return res.status(404).json({
        success: false,
        message: 'Workspace not found',
      });
    }

    // Check if user has permission
    const member = workspace.members.find(
      (m) => m.user.toString() === req.user._id.toString()
    );

    if (!member || !['owner', 'admin'].includes(member.role)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to send invitations',
      });
    }

    if (!Array.isArray(emails) || emails.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least one email',
      });
    }

    const invitationResults = [];
    const sentEmails = [];

    for (const email of emails) {
      if (!email || typeof email !== 'string') continue;

      const trimmedEmail = email.trim().toLowerCase();

      // Check if user already exists
      const existingUser = await User.findOne({ email: trimmedEmail });

      if (existingUser) {
        // Check if already a member
        const isMember = workspace.members.some(
          (m) => m.user.toString() === existingUser._id.toString()
        );

        if (isMember) {
          invitationResults.push({
            email: trimmedEmail,
            status: 'already_member',
            message: 'User is already a member',
          });
          continue;
        }

        // Add as member directly
        workspace.members.push({
          user: existingUser._id,
          role: 'member',
        });
        existingUser.workspaces.push(workspace._id);
        await existingUser.save();

        invitationResults.push({
          email: trimmedEmail,
          status: 'added',
          message: 'User added to workspace',
        });
        sentEmails.push(trimmedEmail);
      } else {
        // For new users, store pending invitation
        if (!workspace.pendingInvitations) {
          workspace.pendingInvitations = [];
        }

        const existingInvite = workspace.pendingInvitations.find(
          (inv) => inv.email === trimmedEmail
        );

        if (!existingInvite) {
          workspace.pendingInvitations.push({
            email: trimmedEmail,
            invitedBy: req.user._id,
            invitedAt: new Date(),
          });
        }

        invitationResults.push({
          email: trimmedEmail,
          status: 'invited',
          message: 'Invitation sent',
        });
        sentEmails.push(trimmedEmail);
      }
    }

    await workspace.save();

    // Log activity
    await logActivity({
      user: req.user._id,
      workspace: workspace._id,
      action: 'invitations_sent',
      description: `Sent invitations to ${sentEmails.length} email${sentEmails.length !== 1 ? 's' : ''}`,
      metadata: { emails: sentEmails, totalInvitations: emails.length },
    });

    // Emit to workspace
    emitToWorkspace(workspace._id, 'invitations-sent', {
      workspace: workspace._id,
      invitations: invitationResults,
    });

    const populatedWorkspace = await Workspace.findById(workspace._id)
      .populate('owner', 'name email avatar')
      .populate('members.user', 'name email avatar');

    res.json({
      success: true,
      message: `Sent invitations to ${sentEmails.length} teammate${sentEmails.length !== 1 ? 's' : ''}`,
      workspace: populatedWorkspace,
      invitations: invitationResults,
    });
  } catch (error) {
    console.error('Send invitations error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

module.exports = {
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
  sendInvitations,
};

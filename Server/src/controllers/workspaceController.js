const Workspace = require('../models/Workspace');
const User = require('../models/User');

// @desc    Get all workspaces for user
// @route   GET /api/workspaces
// @access  Private
exports.getWorkspaces = async (req, res) => {
  try {
    const workspaces = await Workspace.find({
      $or: [
        { owner: req.user.id },
        { 'members.user': req.user.id }
      ]
    }).populate('owner', 'name email avatar')
      .populate('members.user', 'name email avatar');

    res.json({
      success: true,
      count: workspaces.length,
      data: workspaces
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single workspace
// @route   GET /api/workspaces/:id
// @access  Private
exports.getWorkspace = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id)
      .populate('owner', 'name email avatar')
      .populate('members.user', 'name email avatar')
      .populate('projects')
      .populate('teams');

    if (!workspace) {
      return res.status(404).json({
        success: false,
        message: 'Workspace not found'
      });
    }

    res.json({
      success: true,
      data: workspace
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create workspace
// @route   POST /api/workspaces
// @access  Private
exports.createWorkspace = async (req, res) => {
  try {
    const { name, description, settings } = req.body;

    const workspace = await Workspace.create({
      name,
      description,
      owner: req.user.id,
      members: [{ user: req.user.id, role: 'owner' }],
      settings
    });

    // Add workspace to user
    await User.findByIdAndUpdate(req.user.id, {
      $push: { workspaces: workspace._id }
    });

    res.status(201).json({
      success: true,
      data: workspace
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update workspace
// @route   PUT /api/workspaces/:id
// @access  Private
exports.updateWorkspace = async (req, res) => {
  try {
    let workspace = await Workspace.findById(req.params.id);

    if (!workspace) {
      return res.status(404).json({
        success: false,
        message: 'Workspace not found'
      });
    }

    // Check ownership or admin role
    const member = workspace.members.find(m => m.user.toString() === req.user.id);
    if (workspace.owner.toString() !== req.user.id && (!member || member.role !== 'admin')) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this workspace'
      });
    }

    workspace = await Workspace.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      data: workspace
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete workspace
// @route   DELETE /api/workspaces/:id
// @access  Private
exports.deleteWorkspace = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id);

    if (!workspace) {
      return res.status(404).json({
        success: false,
        message: 'Workspace not found'
      });
    }

    // Check ownership
    if (workspace.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this workspace'
      });
    }

    await workspace.deleteOne();

    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Add member to workspace
// @route   POST /api/workspaces/:id/members
// @access  Private
exports.addMember = async (req, res) => {
  try {
    const { email, role } = req.body;
    const workspace = await Workspace.findById(req.params.id);

    if (!workspace) {
      return res.status(404).json({
        success: false,
        message: 'Workspace not found'
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if already a member
    const isMember = workspace.members.some(m => m.user.toString() === user._id.toString());
    if (isMember) {
      return res.status(400).json({
        success: false,
        message: 'User is already a member'
      });
    }

    workspace.members.push({ user: user._id, role: role || 'member' });
    await workspace.save();

    // Add workspace to user
    user.workspaces.push(workspace._id);
    await user.save();

    res.json({
      success: true,
      data: workspace
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update workspace member role
// @route   PUT /api/workspaces/:id/members/:memberId
// @access  Private
exports.updateMember = async (req, res) => {
  try {
    const { role } = req.body;
    const workspace = await Workspace.findById(req.params.id);

    if (!workspace) {
      return res.status(404).json({
        success: false,
        message: 'Workspace not found'
      });
    }

    // Check if user is owner or admin
    const currentMember = workspace.members.find(m => m.user.toString() === req.user.id);
    if (workspace.owner.toString() !== req.user.id && (!currentMember || currentMember.role !== 'admin')) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update workspace members'
      });
    }

    const member = workspace.members.find(m => m.user.toString() === req.params.memberId);
    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found in this workspace'
      });
    }

    // Cannot change owner role
    if (req.params.memberId === workspace.owner.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot change workspace owner role'
      });
    }

    member.role = role;
    await workspace.save();

    const updatedWorkspace = await Workspace.findById(workspace._id)
      .populate('members.user', 'name email avatar');

    res.json({
      success: true,
      data: updatedWorkspace
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Remove member from workspace
// @route   DELETE /api/workspaces/:id/members/:memberId
// @access  Private
exports.removeMember = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id);

    if (!workspace) {
      return res.status(404).json({
        success: false,
        message: 'Workspace not found'
      });
    }

    // Check if user is owner or admin
    const currentMember = workspace.members.find(m => m.user.toString() === req.user.id);
    if (workspace.owner.toString() !== req.user.id && (!currentMember || currentMember.role !== 'admin')) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to remove workspace members'
      });
    }

    // Cannot remove owner
    if (req.params.memberId === workspace.owner.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot remove workspace owner'
      });
    }

    workspace.members = workspace.members.filter(
      m => m.user.toString() !== req.params.memberId
    );
    await workspace.save();

    // Remove workspace from user
    await User.findByIdAndUpdate(req.params.memberId, {
      $pull: { workspaces: workspace._id }
    });

    const updatedWorkspace = await Workspace.findById(workspace._id)
      .populate('members.user', 'name email avatar');

    res.json({
      success: true,
      data: updatedWorkspace
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

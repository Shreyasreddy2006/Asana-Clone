const User = require('../models/User');
const Workspace = require('../models/Workspace');
const { logActivity } = require('../utils/notifications');

// Default user for the application (no authentication needed)
const DEFAULT_USER = {
  _id: '123456789',
  name: 'Default User',
  email: 'default@asanaclone.com',
  avatar: null,
  role: 'user',
  workspaces: [],
  teams: [],
  preferences: {},
  onboarded: false,
  createdAt: new Date(),
  updatedAt: new Date()
};

// @desc    Get default user (replaces register/login)
// @route   GET /api/auth/session
// @access  Public
const getDefaultSession = async (req, res) => {
  try {
    res.json({
      success: true,
      data: DEFAULT_USER
    });
  } catch (error) {
    console.error('Session error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Public
const getMe = async (req, res) => {
  try {
    res.json({
      success: true,
      data: DEFAULT_USER,
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const { name, avatar, preferences } = req.body;

    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (avatar !== undefined) user.avatar = avatar;
    if (preferences) {
      user.preferences = {
        ...user.preferences,
        ...preferences,
      };
    }

    await user.save();

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Complete onboarding
// @route   POST /api/auth/onboarding
// @access  Public
const completeOnboarding = async (req, res) => {
  try {
    const { workspaceName, workspaceDescription } = req.body;

    // Create default workspace
    const workspace = await Workspace.create({
      name: workspaceName || `${DEFAULT_USER.name}'s Workspace`,
      description: workspaceDescription || '',
      owner: DEFAULT_USER._id,
      members: [
        {
          user: DEFAULT_USER._id,
          role: 'owner',
        },
      ],
    });

    // Update default user
    DEFAULT_USER.workspaces.push(workspace._id);
    DEFAULT_USER.onboarded = true;

    // Log activity
    await logActivity({
      user: req.user._id,
      workspace: workspace._id,
      action: 'workspace_created',
      description: `Created workspace "${workspace.name}"`,
    });

    const populatedUser = await User.findById(req.user._id)
      .populate('workspaces', 'name description')
      .populate('teams', 'name description');

    res.json({
      success: true,
      data: {
        user: populatedUser,
        workspace,
      },
    });
  } catch (error) {
    console.error('Complete onboarding error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

module.exports = {
  getDefaultSession,
  getMe,
  updateProfile,
  completeOnboarding,
};

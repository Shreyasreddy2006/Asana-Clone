const User = require('../models/User');
const Workspace = require('../models/Workspace');
const { generateToken } = require('../middleware/auth');
const { logActivity } = require('../utils/notifications');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists',
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
    });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        workspaces: user.workspaces,
        teams: user.teams,
        preferences: user.preferences,
        onboarded: user.onboarded,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        token,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Update last active
    user.lastActive = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        workspaces: user.workspaces,
        teams: user.teams,
        preferences: user.preferences,
        onboarded: user.onboarded,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        token,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('workspaces', 'name description')
      .populate('teams', 'name description');

    res.json({
      success: true,
      data: user,
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
// @access  Private
const completeOnboarding = async (req, res) => {
  try {
    const { workspaceName, workspaceDescription } = req.body;

    // Create default workspace
    const workspace = await Workspace.create({
      name: workspaceName || `${req.user.name}'s Workspace`,
      description: workspaceDescription || '',
      owner: req.user._id,
      members: [
        {
          user: req.user._id,
          role: 'owner',
        },
      ],
    });

    // Update user
    req.user.workspaces.push(workspace._id);
    req.user.onboarded = true;
    await req.user.save();

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
  register,
  login,
  getMe,
  updateProfile,
  completeOnboarding,
};

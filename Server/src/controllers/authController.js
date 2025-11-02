const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password
    });

    if (user) {
      res.status(201).json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          onboarded: user.onboarded,
          token: generateToken(user._id)
        }
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email and password'
      });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        onboarded: user.onboarded,
        token: generateToken(user._id)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.avatar = req.body.avatar || user.avatar;

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        success: true,
        data: {
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          avatar: updatedUser.avatar,
          token: generateToken(updatedUser._id)
        }
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Complete onboarding
// @route   POST /api/auth/onboarding
// @access  Private
exports.completeOnboarding = async (req, res) => {
  try {
    const { role, workFunctions, asanaUses, selectedTools, projectName, tasks, sections, layout, inviteEmails } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update user with onboarding data
    user.onboarded = true;
    user.onboardingData = {
      role,
      workFunctions,
      asanaUses,
      selectedTools
    };

    await user.save();

    // Create default workspace
    const Workspace = require('../models/Workspace');
    const workspace = await Workspace.create({
      name: `${user.name}'s Workspace`,
      owner: user._id,
      members: [{
        user: user._id,
        role: 'owner'
      }]
    });

    // Update user's workspaces array
    user.workspaces.push(workspace._id);
    await user.save();

    // Create the project from onboarding
    const Project = require('../models/Project');
    const project = await Project.create({
      name: projectName || 'My First Project',
      workspace: workspace._id,
      owner: user._id,
      view: layout?.toLowerCase() || 'list',
      members: [{
        user: user._id,
        role: 'owner'
      }],
      sections: sections?.map((name, index) => ({
        name,
        order: index
      })) || [
        { name: 'To Do', order: 0 },
        { name: 'In Progress', order: 1 },
        { name: 'Done', order: 2 }
      ]
    });

    // Update workspace projects
    workspace.projects.push(project._id);
    await workspace.save();

    // Create tasks from onboarding
    const Task = require('../models/Task');
    if (tasks && tasks.length > 0) {
      const taskPromises = tasks
        .filter(task => task && task.trim())
        .map((taskTitle, index) => {
          const sectionIndex = index % sections.length;
          const section = project.sections[sectionIndex];

          return Task.create({
            title: taskTitle,
            project: project._id,
            section: section._id,
            assignedBy: user._id,
            order: index
          });
        });

      await Promise.all(taskPromises);
    }

    res.json({
      success: true,
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          onboarded: user.onboarded
        },
        workspace,
        project
      }
    });
  } catch (error) {
    console.error('Onboarding error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

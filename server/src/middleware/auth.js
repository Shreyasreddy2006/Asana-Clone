const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - verify JWT token
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Not authorized, user not found',
        });
      }

      next();
    } catch (error) {
      console.error('Auth middleware error:', error);
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token failed',
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token',
    });
  }
};

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

// Check if user is workspace owner or admin
const checkWorkspaceAccess = (requiredRole = 'member') => {
  return async (req, res, next) => {
    try {
      const Workspace = require('../models/Workspace');
      const workspace = await Workspace.findById(req.params.workspaceId);

      if (!workspace) {
        return res.status(404).json({
          success: false,
          message: 'Workspace not found',
        });
      }

      const member = workspace.members.find(
        (m) => m.user.toString() === req.user._id.toString()
      );

      if (!member) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to access this workspace',
        });
      }

      // Role hierarchy: owner > admin > member > guest
      const roleHierarchy = { owner: 4, admin: 3, member: 2, guest: 1 };

      if (roleHierarchy[member.role] < roleHierarchy[requiredRole]) {
        return res.status(403).json({
          success: false,
          message: 'Insufficient permissions',
        });
      }

      req.workspace = workspace;
      req.userRole = member.role;
      next();
    } catch (error) {
      console.error('Workspace access check error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error',
      });
    }
  };
};

// Check if user is project member
const checkProjectAccess = (requiredRole = 'viewer') => {
  return async (req, res, next) => {
    try {
      const Project = require('../models/Project');
      const projectId = req.params.projectId || req.params.id;
      const project = await Project.findById(projectId);

      if (!project) {
        return res.status(404).json({
          success: false,
          message: 'Project not found',
        });
      }

      const member = project.members.find(
        (m) => m.user.toString() === req.user._id.toString()
      );

      if (!member && project.owner.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to access this project',
        });
      }

      // Role hierarchy: owner > editor > viewer
      const roleHierarchy = { owner: 3, editor: 2, viewer: 1 };
      const userRole = project.owner.toString() === req.user._id.toString()
        ? 'owner'
        : member.role;

      if (roleHierarchy[userRole] < roleHierarchy[requiredRole]) {
        return res.status(403).json({
          success: false,
          message: 'Insufficient permissions',
        });
      }

      req.project = project;
      req.userProjectRole = userRole;
      next();
    } catch (error) {
      console.error('Project access check error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error',
      });
    }
  };
};

module.exports = {
  protect,
  generateToken,
  checkWorkspaceAccess,
  checkProjectAccess,
};

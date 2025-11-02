const { body, param, query, validationResult } = require('express-validator');

// Middleware to handle validation errors
exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};

// Auth validation rules
exports.registerValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number')
];

exports.loginValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Password is required')
];

// Workspace validation rules
exports.createWorkspaceValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Workspace name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Workspace name must be between 2 and 100 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),

  body('settings.color')
    .optional()
    .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).withMessage('Color must be a valid hex color'),

  body('settings.isPublic')
    .optional()
    .isBoolean().withMessage('isPublic must be a boolean')
];

exports.updateWorkspaceValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('Workspace name must be between 2 and 100 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),

  body('settings.color')
    .optional()
    .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).withMessage('Color must be a valid hex color'),

  body('settings.isPublic')
    .optional()
    .isBoolean().withMessage('isPublic must be a boolean')
];

exports.addMemberValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email'),

  body('role')
    .optional()
    .isIn(['owner', 'admin', 'member', 'guest']).withMessage('Invalid role')
];

// Project validation rules
exports.createProjectValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Project name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Project name must be between 2 and 100 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('Description cannot exceed 1000 characters'),

  body('workspace')
    .notEmpty().withMessage('Workspace is required')
    .isMongoId().withMessage('Invalid workspace ID'),

  body('team')
    .optional()
    .isMongoId().withMessage('Invalid team ID'),

  body('color')
    .optional()
    .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).withMessage('Color must be a valid hex color'),

  body('view')
    .optional()
    .isIn(['list', 'board', 'timeline', 'calendar']).withMessage('Invalid view type'),

  body('status')
    .optional()
    .isIn(['active', 'archived', 'completed']).withMessage('Invalid status'),

  body('isPrivate')
    .optional()
    .isBoolean().withMessage('isPrivate must be a boolean'),

  body('dueDate')
    .optional()
    .isISO8601().withMessage('Invalid date format')
];

exports.updateProjectValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('Project name must be between 2 and 100 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('Description cannot exceed 1000 characters'),

  body('color')
    .optional()
    .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).withMessage('Color must be a valid hex color'),

  body('view')
    .optional()
    .isIn(['list', 'board', 'timeline', 'calendar']).withMessage('Invalid view type'),

  body('status')
    .optional()
    .isIn(['active', 'archived', 'completed']).withMessage('Invalid status'),

  body('isPrivate')
    .optional()
    .isBoolean().withMessage('isPrivate must be a boolean'),

  body('dueDate')
    .optional()
    .isISO8601().withMessage('Invalid date format')
];

exports.addSectionValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Section name is required')
    .isLength({ min: 1, max: 100 }).withMessage('Section name must be between 1 and 100 characters'),

  body('order')
    .optional()
    .isInt({ min: 0 }).withMessage('Order must be a non-negative integer')
];

// Task validation rules
exports.createTaskValidation = [
  body('title')
    .trim()
    .notEmpty().withMessage('Task title is required')
    .isLength({ min: 1, max: 200 }).withMessage('Task title must be between 1 and 200 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 5000 }).withMessage('Description cannot exceed 5000 characters'),

  body('project')
    .notEmpty().withMessage('Project is required')
    .isMongoId().withMessage('Invalid project ID'),

  body('section')
    .optional()
    .isMongoId().withMessage('Invalid section ID'),

  body('assignee')
    .optional()
    .isMongoId().withMessage('Invalid assignee ID'),

  body('status')
    .optional()
    .isIn(['todo', 'in_progress', 'completed', 'blocked']).withMessage('Invalid status'),

  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'urgent']).withMessage('Invalid priority'),

  body('dueDate')
    .optional()
    .isISO8601().withMessage('Invalid due date format'),

  body('startDate')
    .optional()
    .isISO8601().withMessage('Invalid start date format'),

  body('tags')
    .optional()
    .isArray().withMessage('Tags must be an array'),

  body('tags.*')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 }).withMessage('Each tag must be between 1 and 50 characters')
];

exports.updateTaskValidation = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 }).withMessage('Task title must be between 1 and 200 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 5000 }).withMessage('Description cannot exceed 5000 characters'),

  body('section')
    .optional()
    .isMongoId().withMessage('Invalid section ID'),

  body('assignee')
    .optional()
    .isMongoId().withMessage('Invalid assignee ID'),

  body('status')
    .optional()
    .isIn(['todo', 'in_progress', 'completed', 'blocked']).withMessage('Invalid status'),

  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'urgent']).withMessage('Invalid priority'),

  body('dueDate')
    .optional()
    .isISO8601().withMessage('Invalid due date format'),

  body('startDate')
    .optional()
    .isISO8601().withMessage('Invalid start date format'),

  body('tags')
    .optional()
    .isArray().withMessage('Tags must be an array')
];

exports.addCommentValidation = [
  body('text')
    .trim()
    .notEmpty().withMessage('Comment text is required')
    .isLength({ min: 1, max: 2000 }).withMessage('Comment must be between 1 and 2000 characters')
];

exports.addSubtaskValidation = [
  body('title')
    .trim()
    .notEmpty().withMessage('Subtask title is required')
    .isLength({ min: 1, max: 200 }).withMessage('Subtask title must be between 1 and 200 characters'),

  body('assignee')
    .optional()
    .isMongoId().withMessage('Invalid assignee ID')
];

// Team validation rules
exports.createTeamValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Team name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Team name must be between 2 and 100 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),

  body('workspace')
    .notEmpty().withMessage('Workspace is required')
    .isMongoId().withMessage('Invalid workspace ID'),

  body('color')
    .optional()
    .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).withMessage('Color must be a valid hex color')
];

exports.updateTeamValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('Team name must be between 2 and 100 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),

  body('color')
    .optional()
    .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).withMessage('Color must be a valid hex color')
];

exports.addTeamMemberValidation = [
  body('userId')
    .notEmpty().withMessage('User ID is required')
    .isMongoId().withMessage('Invalid user ID'),

  body('role')
    .optional()
    .isIn(['lead', 'member']).withMessage('Invalid role')
];

exports.updateTeamMemberValidation = [
  body('role')
    .notEmpty().withMessage('Role is required')
    .isIn(['lead', 'member']).withMessage('Invalid role')
];

// ID param validation
exports.validateMongoId = [
  param('id')
    .isMongoId().withMessage('Invalid ID format')
];

exports.validateMemberId = [
  param('memberId')
    .isMongoId().withMessage('Invalid member ID format')
];

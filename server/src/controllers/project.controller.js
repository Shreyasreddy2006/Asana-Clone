const Project = require('../models/Project');
const Workspace = require('../models/Workspace');
const Task = require('../models/Task');
const Team = require('../models/Team');
const User = require('../models/User');
const {
  logActivity,
  notifyProjectInvitation,
} = require('../utils/notifications');
const { emitToProject, emitToWorkspace } = require('../config/socket');

// @desc    Get all projects in workspace
// @route   GET /api/workspaces/:workspaceId/projects
// @access  Private
const getProjects = async (req, res) => {
  try {
    const { status, team } = req.query;

    const query = {
      workspace: req.params.workspaceId || req.query.workspace || req.query.workspace,
      $or: [
        { owner: req.user._id },
        { 'members.user': req.user._id },
        { privacy: 'public' },
      ],
    };

    if (status) {
      query.status = status;
    }
    if (team) {
      query.team = team;
    }

    const projects = await Project.find(query)
      .populate('owner', 'name email avatar')
      .populate('members.user', 'name email avatar')
      .populate('team', 'name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      projects,
    });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
const getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name email avatar')
      .populate('members.user', 'name email avatar')
      .populate('team', 'name description')
      .populate('workspace', 'name');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // Check access
    const hasAccess =
      project.owner.toString() === req.user._id.toString() ||
      project.members.some((m) => m.user._id.toString() === req.user._id.toString()) ||
      project.privacy === 'public';

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this project',
      });
    }

    res.json({
      success: true,
      project,
    });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Create project
// @route   POST /api/workspaces/:workspaceId/projects
// @access  Private
const createProject = async (req, res) => {
  try {
    const {
      name,
      description,
      color,
      icon,
      view,
      team,
      privacy,
      startDate,
      dueDate,
      workspace: workspaceId,
    } = req.body;

    const workspace = await Workspace.findById(workspaceId || req.params.workspaceId || req.query.workspace || req.query.workspace);

    if (!workspace) {
      return res.status(404).json({
        success: false,
        message: 'Workspace not found',
      });
    }

    // Check if user is a member of workspace
    const isMember = workspace.members.some(
      (m) => m.user.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to create projects in this workspace',
      });
    }

    // Create default sections
    const defaultSections = [
      { name: 'To Do', order: 0 },
      { name: 'In Progress', order: 1 },
      { name: 'Done', order: 2 },
    ];

    const project = await Project.create({
      name,
      description,
      workspace: workspace._id,
      owner: req.user._id,
      team,
      color,
      icon,
      view,
      privacy,
      startDate,
      dueDate,
      sections: defaultSections,
      members: [
        {
          user: req.user._id,
          role: 'owner',
        },
      ],
    });

    // Add project to workspace
    workspace.projects.push(project._id);
    await workspace.save();

    // If team is specified, add project to team
    if (team) {
      await Team.findByIdAndUpdate(team, {
        $push: { projects: project._id },
      });
    }

    // Log activity
    await logActivity({
      user: req.user._id,
      workspace: workspace._id,
      project: project._id,
      action: 'project_created',
      description: `Created project "${project.name}"`,
    });

    // Emit to workspace
    emitToWorkspace(workspace._id, 'project-created', project);

    const populatedProject = await Project.findById(project._id)
      .populate('owner', 'name email avatar')
      .populate('members.user', 'name email avatar')
      .populate('team', 'name')
      .populate('workspace', 'name');

    res.status(201).json({
      success: true,
      data: populatedProject,
    });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // Check if user is owner or editor
    const member = project.members.find(
      (m) => m.user.toString() === req.user._id.toString()
    );

    const isOwner = project.owner.toString() === req.user._id.toString();
    const isEditor = member && member.role === 'editor';

    if (!isOwner && !isEditor) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this project',
      });
    }

    // Update fields
    const allowedFields = [
      'name',
      'description',
      'color',
      'icon',
      'view',
      'status',
      'startDate',
      'dueDate',
      'privacy',
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        project[field] = req.body[field];
      }
    });

    await project.save();

    // Log activity
    await logActivity({
      user: req.user._id,
      workspace: project.workspace,
      project: project._id,
      action: 'project_updated',
      description: `Updated project "${project.name}"`,
    });

    // Emit to project
    emitToProject(project._id, 'project-updated', project);

    const populatedProject = await Project.findById(project._id)
      .populate('owner', 'name email avatar')
      .populate('members.user', 'name email avatar')
      .populate('team', 'name');

    res.json({
      success: true,
      project: populatedProject,
    });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // Check if user is owner
    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only owner can delete project',
      });
    }

    // Delete all tasks in project
    await Task.deleteMany({ project: project._id });

    // Remove project from workspace
    await Workspace.findByIdAndUpdate(project.workspace, {
      $pull: { projects: project._id },
    });

    // Remove project from team if exists
    if (project.team) {
      await Team.findByIdAndUpdate(project.team, {
        $pull: { projects: project._id },
      });
    }

    await project.deleteOne();

    // Emit to workspace
    emitToWorkspace(project.workspace, 'project-deleted', {
      projectId: project._id,
    });

    res.json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Add member to project
// @route   POST /api/projects/:id/members
// @access  Private
const addMember = async (req, res) => {
  try {
    const { userId, role = 'editor' } = req.body;

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // Check if user is owner or editor
    const isOwner = project.owner.toString() === req.user._id.toString();
    if (!isOwner) {
      return res.status(403).json({
        success: false,
        message: 'Only owner can add members',
      });
    }

    // Check if user exists
    const userToAdd = await User.findById(userId);
    if (!userToAdd) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check if already a member
    const existingMember = project.members.find(
      (m) => m.user.toString() === userId
    );

    if (existingMember) {
      return res.status(400).json({
        success: false,
        message: 'User is already a member',
      });
    }

    // Add member
    project.members.push({
      user: userId,
      role,
    });
    await project.save();

    // Send notification
    await notifyProjectInvitation(project, req.user._id, userId);

    // Log activity
    await logActivity({
      user: req.user._id,
      workspace: project.workspace,
      project: project._id,
      action: 'project_member_added',
      description: `Added ${userToAdd.name} to project`,
      metadata: { addedUserId: userId, role },
    });

    // Emit to project
    emitToProject(project._id, 'member-added', {
      user: userToAdd,
      role,
    });

    const populatedProject = await Project.findById(project._id)
      .populate('owner', 'name email avatar')
      .populate('members.user', 'name email avatar');

    res.json({
      success: true,
      project: populatedProject,
    });
  } catch (error) {
    console.error('Add member error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Remove member from project
// @route   DELETE /api/projects/:id/members/:userId
// @access  Private
const removeMember = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // Check if user is owner
    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only owner can remove members',
      });
    }

    // Cannot remove owner
    if (project.owner.toString() === req.params.userId) {
      return res.status(400).json({
        success: false,
        message: 'Cannot remove project owner',
      });
    }

    // Remove member
    project.members = project.members.filter(
      (m) => m.user.toString() !== req.params.userId
    );
    await project.save();

    // Log activity
    await logActivity({
      user: req.user._id,
      workspace: project.workspace,
      project: project._id,
      action: 'project_member_removed',
      description: 'Removed member from project',
      metadata: { removedUserId: req.params.userId },
    });

    // Emit to project
    emitToProject(project._id, 'member-removed', {
      userId: req.params.userId,
    });

    res.json({
      success: true,
      message: 'Member removed successfully',
    });
  } catch (error) {
    console.error('Remove member error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Create section in project
// @route   POST /api/projects/:id/sections
// @access  Private
const createSection = async (req, res) => {
  try {
    const { name } = req.body;

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // Check access
    const member = project.members.find(
      (m) => m.user.toString() === req.user._id.toString()
    );

    const isOwner = project.owner.toString() === req.user._id.toString();
    const isEditor = member && member.role === 'editor';

    if (!isOwner && !isEditor) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to add sections',
      });
    }

    const order = project.sections.length;
    project.sections.push({ name, order });
    await project.save();

    // Log activity
    await logActivity({
      user: req.user._id,
      workspace: project.workspace,
      project: project._id,
      action: 'section_added',
      description: `Added section "${name}"`,
    });

    // Emit to project
    emitToProject(project._id, 'section-created', {
      section: project.sections[project.sections.length - 1],
    });

    res.status(201).json({
      success: true,
      data: project,
    });
  } catch (error) {
    console.error('Create section error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Update section
// @route   PUT /api/projects/:id/sections/:sectionId
// @access  Private
const updateSection = async (req, res) => {
  try {
    const { name, order, collapsed } = req.body;

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    const section = project.sections.id(req.params.sectionId);
    if (!section) {
      return res.status(404).json({
        success: false,
        message: 'Section not found',
      });
    }

    if (name) section.name = name;
    if (order !== undefined) section.order = order;
    if (collapsed !== undefined) section.collapsed = collapsed;

    await project.save();

    // Emit to project
    emitToProject(project._id, 'section-updated', { section });

    res.json({
      success: true,
      project,
    });
  } catch (error) {
    console.error('Update section error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Delete section
// @route   DELETE /api/projects/:id/sections/:sectionId
// @access  Private
const deleteSection = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // Move tasks in this section to null section
    await Task.updateMany(
      { project: project._id, section: req.params.sectionId },
      { section: null }
    );

    // Remove section
    project.sections.pull(req.params.sectionId);
    await project.save();

    // Log activity
    await logActivity({
      user: req.user._id,
      workspace: project.workspace,
      project: project._id,
      action: 'section_deleted',
      description: 'Deleted section',
    });

    // Emit to project
    emitToProject(project._id, 'section-deleted', {
      sectionId: req.params.sectionId,
    });

    res.json({
      success: true,
      message: 'Section deleted successfully',
    });
  } catch (error) {
    console.error('Delete section error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Create custom field
// @route   POST /api/projects/:id/custom-fields
// @access  Private
const createCustomField = async (req, res) => {
  try {
    const { name, type, options, required } = req.body;

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    project.customFields.push({
      name,
      type,
      options,
      required,
    });
    await project.save();

    res.status(201).json({
      success: true,
      data: project,
    });
  } catch (error) {
    console.error('Create custom field error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

module.exports = {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
  createSection,
  updateSection,
  deleteSection,
  createCustomField,
};

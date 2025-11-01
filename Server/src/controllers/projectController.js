const Project = require('../models/Project');
const Workspace = require('../models/Workspace');

// @desc    Get all projects
// @route   GET /api/projects
// @access  Private
exports.getProjects = async (req, res) => {
  try {
    const { workspace } = req.query;

    let query = {
      $or: [
        { owner: req.user.id },
        { 'members.user': req.user.id }
      ]
    };

    if (workspace) {
      query.workspace = workspace;
    }

    const projects = await Project.find(query)
      .populate('owner', 'name email avatar')
      .populate('members.user', 'name email avatar')
      .populate('workspace', 'name')
      .sort('-createdAt');

    res.json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
exports.getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name email avatar')
      .populate('members.user', 'name email avatar')
      .populate('workspace', 'name');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.json({
      success: true,
      data: project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create project
// @route   POST /api/projects
// @access  Private
exports.createProject = async (req, res) => {
  try {
    const { name, description, workspace, color, icon, view } = req.body;

    // Verify workspace exists
    const workspaceExists = await Workspace.findById(workspace);
    if (!workspaceExists) {
      return res.status(404).json({
        success: false,
        message: 'Workspace not found'
      });
    }

    const project = await Project.create({
      name,
      description,
      workspace,
      owner: req.user.id,
      members: [{ user: req.user.id, role: 'owner' }],
      color,
      icon,
      view,
      sections: [
        { name: 'To Do', order: 0 },
        { name: 'In Progress', order: 1 },
        { name: 'Done', order: 2 }
      ]
    });

    // Add project to workspace
    await Workspace.findByIdAndUpdate(workspace, {
      $push: { projects: project._id }
    });

    res.status(201).json({
      success: true,
      data: project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
exports.updateProject = async (req, res) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check permission
    const member = project.members.find(m => m.user.toString() === req.user.id);
    if (project.owner.toString() !== req.user.id && (!member || member.role === 'viewer')) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this project'
      });
    }

    project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      data: project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this project'
      });
    }

    await project.deleteOne();

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

// @desc    Add section to project
// @route   POST /api/projects/:id/sections
// @access  Private
exports.addSection = async (req, res) => {
  try {
    const { name } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    const order = project.sections.length;
    project.sections.push({ name, order });
    await project.save();

    res.json({
      success: true,
      data: project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

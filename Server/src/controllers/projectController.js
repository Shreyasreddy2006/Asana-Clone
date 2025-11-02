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

// @desc    Update section
// @route   PUT /api/projects/:id/sections/:sectionId
// @access  Private
exports.updateSection = async (req, res) => {
  try {
    const { name, order } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    const section = project.sections.id(req.params.sectionId);
    if (!section) {
      return res.status(404).json({
        success: false,
        message: 'Section not found'
      });
    }

    if (name) section.name = name;
    if (order !== undefined) section.order = order;

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

// @desc    Delete section
// @route   DELETE /api/projects/:id/sections/:sectionId
// @access  Private
exports.deleteSection = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    const section = project.sections.id(req.params.sectionId);
    if (!section) {
      return res.status(404).json({
        success: false,
        message: 'Section not found'
      });
    }

    section.deleteOne();
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

// @desc    Add member to project
// @route   POST /api/projects/:id/members
// @access  Private
exports.addMember = async (req, res) => {
  try {
    const { userId, role } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check if user is owner or admin
    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Only project owner can add members'
      });
    }

    // Check if user already a member
    const existingMember = project.members.find(m => m.user.toString() === userId);
    if (existingMember) {
      return res.status(400).json({
        success: false,
        message: 'User is already a member of this project'
      });
    }

    project.members.push({ user: userId, role: role || 'editor' });
    await project.save();

    const updatedProject = await Project.findById(project._id)
      .populate('members.user', 'name email avatar');

    res.json({
      success: true,
      data: updatedProject
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update project member role
// @route   PUT /api/projects/:id/members/:memberId
// @access  Private
exports.updateMember = async (req, res) => {
  try {
    const { role } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check if user is owner
    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Only project owner can update member roles'
      });
    }

    const member = project.members.find(m => m.user.toString() === req.params.memberId);
    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found in this project'
      });
    }

    member.role = role;
    await project.save();

    const updatedProject = await Project.findById(project._id)
      .populate('members.user', 'name email avatar');

    res.json({
      success: true,
      data: updatedProject
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Remove member from project
// @route   DELETE /api/projects/:id/members/:memberId
// @access  Private
exports.removeMember = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check if user is owner
    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Only project owner can remove members'
      });
    }

    // Cannot remove owner
    if (req.params.memberId === project.owner.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot remove project owner'
      });
    }

    project.members = project.members.filter(
      m => m.user.toString() !== req.params.memberId
    );
    await project.save();

    const updatedProject = await Project.findById(project._id)
      .populate('members.user', 'name email avatar');

    res.json({
      success: true,
      data: updatedProject
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

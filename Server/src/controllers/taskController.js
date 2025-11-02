const Task = require('../models/Task');
const Project = require('../models/Project');

// @desc    Get all tasks with advanced filtering and search
// @route   GET /api/tasks
// @access  Private
exports.getTasks = async (req, res) => {
  try {
    const {
      project,
      assignee,
      status,
      priority,
      section,
      search,
      tags,
      dueDateFrom,
      dueDateTo,
      createdDateFrom,
      createdDateTo,
      sortBy,
      order,
      page,
      limit
    } = req.query;

    let query = {};

    // Basic filters
    if (project) query.project = project;
    if (assignee) query.assignee = assignee;
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (section) query.section = section;

    // Text search (title and description)
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Tags filter (tasks with any of the specified tags)
    if (tags) {
      const tagArray = tags.split(',');
      query.tags = { $in: tagArray };
    }

    // Date range filters
    if (dueDateFrom || dueDateTo) {
      query.dueDate = {};
      if (dueDateFrom) query.dueDate.$gte = new Date(dueDateFrom);
      if (dueDateTo) query.dueDate.$lte = new Date(dueDateTo);
    }

    if (createdDateFrom || createdDateTo) {
      query.createdAt = {};
      if (createdDateFrom) query.createdAt.$gte = new Date(createdDateFrom);
      if (createdDateTo) query.createdAt.$lte = new Date(createdDateTo);
    }

    // Pagination
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const startIndex = (pageNum - 1) * limitNum;

    // Sorting
    let sortOptions = {};
    if (sortBy) {
      const sortOrder = order === 'desc' ? -1 : 1;
      sortOptions[sortBy] = sortOrder;
    } else {
      sortOptions = { order: 1 }; // Default sort by order field
    }

    // Execute query
    const tasks = await Task.find(query)
      .populate('assignee', 'name email avatar')
      .populate('assignedBy', 'name email avatar')
      .populate('project', 'name color')
      .populate('comments.user', 'name avatar')
      .populate('subtasks.assignee', 'name avatar')
      .populate('followers', 'name avatar')
      .sort(sortOptions)
      .skip(startIndex)
      .limit(limitNum);

    // Get total count for pagination
    const total = await Task.countDocuments(query);

    res.json({
      success: true,
      count: tasks.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: tasks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
exports.getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignee', 'name email avatar')
      .populate('assignedBy', 'name email avatar')
      .populate('project', 'name color workspace')
      .populate('comments.user', 'name avatar')
      .populate('subtasks.assignee', 'name avatar')
      .populate('followers', 'name email avatar')
      .populate('dependencies');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create task
// @route   POST /api/tasks
// @access  Private
exports.createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      project,
      section,
      assignee,
      status,
      priority,
      dueDate,
      startDate,
      tags
    } = req.body;

    // Verify project exists
    const projectExists = await Project.findById(project);
    if (!projectExists) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    const task = await Task.create({
      title,
      description,
      project,
      section,
      assignee,
      assignedBy: req.user.id,
      status,
      priority,
      dueDate,
      startDate,
      tags,
      followers: [req.user.id]
    });

    const populatedTask = await Task.findById(task._id)
      .populate('assignee', 'name email avatar')
      .populate('assignedBy', 'name email avatar')
      .populate('project', 'name color');

    res.status(201).json({
      success: true,
      data: populatedTask
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
exports.updateTask = async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Mark as completed if status changed to completed
    if (req.body.status === 'completed' && task.status !== 'completed') {
      req.body.completedAt = Date.now();
    }

    task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })
      .populate('assignee', 'name email avatar')
      .populate('assignedBy', 'name email avatar')
      .populate('project', 'name color');

    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    await task.deleteOne();

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

// @desc    Add comment to task
// @route   POST /api/tasks/:id/comments
// @access  Private
exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    task.comments.push({
      user: req.user.id,
      text
    });

    await task.save();

    const updatedTask = await Task.findById(task._id)
      .populate('comments.user', 'name avatar');

    res.json({
      success: true,
      data: updatedTask
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Add subtask
// @route   POST /api/tasks/:id/subtasks
// @access  Private
exports.addSubtask = async (req, res) => {
  try {
    const { title, assignee } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    task.subtasks.push({ title, assignee });
    await task.save();

    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update subtask
// @route   PUT /api/tasks/:id/subtasks/:subtaskId
// @access  Private
exports.updateSubtask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    const subtask = task.subtasks.id(req.params.subtaskId);
    if (!subtask) {
      return res.status(404).json({
        success: false,
        message: 'Subtask not found'
      });
    }

    Object.assign(subtask, req.body);
    await task.save();

    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete subtask
// @route   DELETE /api/tasks/:id/subtasks/:subtaskId
// @access  Private
exports.deleteSubtask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    const subtask = task.subtasks.id(req.params.subtaskId);
    if (!subtask) {
      return res.status(404).json({
        success: false,
        message: 'Subtask not found'
      });
    }

    subtask.deleteOne();
    await task.save();

    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update comment
// @route   PUT /api/tasks/:id/comments/:commentId
// @access  Private
exports.updateComment = async (req, res) => {
  try {
    const { text } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    const comment = task.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Check if user owns the comment
    if (comment.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this comment'
      });
    }

    comment.text = text;
    await task.save();

    const updatedTask = await Task.findById(task._id)
      .populate('comments.user', 'name avatar');

    res.json({
      success: true,
      data: updatedTask
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete comment
// @route   DELETE /api/tasks/:id/comments/:commentId
// @access  Private
exports.deleteComment = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    const comment = task.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Check if user owns the comment
    if (comment.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this comment'
      });
    }

    comment.deleteOne();
    await task.save();

    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Add follower to task
// @route   POST /api/tasks/:id/followers
// @access  Private
exports.addFollower = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Check if already following
    if (task.followers.includes(req.user.id)) {
      return res.status(400).json({
        success: false,
        message: 'Already following this task'
      });
    }

    task.followers.push(req.user.id);
    await task.save();

    const updatedTask = await Task.findById(task._id)
      .populate('followers', 'name email avatar');

    res.json({
      success: true,
      data: updatedTask
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Remove follower from task
// @route   DELETE /api/tasks/:id/followers/:userId
// @access  Private
exports.removeFollower = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    const userIdToRemove = req.params.userId || req.user.id;

    task.followers = task.followers.filter(
      follower => follower.toString() !== userIdToRemove
    );
    await task.save();

    const updatedTask = await Task.findById(task._id)
      .populate('followers', 'name email avatar');

    res.json({
      success: true,
      data: updatedTask
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Add dependency to task
// @route   POST /api/tasks/:id/dependencies
// @access  Private
exports.addDependency = async (req, res) => {
  try {
    const { dependencyId } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Verify dependency task exists
    const dependencyTask = await Task.findById(dependencyId);
    if (!dependencyTask) {
      return res.status(404).json({
        success: false,
        message: 'Dependency task not found'
      });
    }

    // Check for circular dependency
    if (dependencyId === req.params.id) {
      return res.status(400).json({
        success: false,
        message: 'Task cannot depend on itself'
      });
    }

    // Check if already a dependency
    if (task.dependencies.includes(dependencyId)) {
      return res.status(400).json({
        success: false,
        message: 'Dependency already exists'
      });
    }

    task.dependencies.push(dependencyId);
    await task.save();

    const updatedTask = await Task.findById(task._id)
      .populate('dependencies');

    res.json({
      success: true,
      data: updatedTask
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Remove dependency from task
// @route   DELETE /api/tasks/:id/dependencies/:dependencyId
// @access  Private
exports.removeDependency = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    task.dependencies = task.dependencies.filter(
      dep => dep.toString() !== req.params.dependencyId
    );
    await task.save();

    const updatedTask = await Task.findById(task._id)
      .populate('dependencies');

    res.json({
      success: true,
      data: updatedTask
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Upload attachment to task
// @route   POST /api/tasks/:id/attachments
// @access  Private
exports.uploadAttachment = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Create attachment object
    const attachment = {
      name: req.file.originalname,
      url: `/uploads/${req.file.filename}`,
      type: req.file.mimetype,
      uploadedBy: req.user.id
    };

    task.attachments.push(attachment);
    await task.save();

    const updatedTask = await Task.findById(task._id)
      .populate('attachments.uploadedBy', 'name email');

    res.json({
      success: true,
      data: updatedTask
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete attachment from task
// @route   DELETE /api/tasks/:id/attachments/:attachmentId
// @access  Private
exports.deleteAttachment = async (req, res) => {
  try {
    const fs = require('fs');
    const path = require('path');

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    const attachment = task.attachments.id(req.params.attachmentId);
    if (!attachment) {
      return res.status(404).json({
        success: false,
        message: 'Attachment not found'
      });
    }

    // Check if user owns the attachment or is task owner
    const isOwner = attachment.uploadedBy.toString() === req.user.id;
    const isTaskOwner = task.assignedBy && task.assignedBy.toString() === req.user.id;

    if (!isOwner && !isTaskOwner) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this attachment'
      });
    }

    // Delete file from filesystem
    const filePath = path.join(__dirname, '../../', attachment.url);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    attachment.deleteOne();
    await task.save();

    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

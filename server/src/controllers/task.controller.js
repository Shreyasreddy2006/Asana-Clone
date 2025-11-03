const Task = require('../models/Task');
const Comment = require('../models/Comment');
const Project = require('../models/Project');
const {
  logActivity,
  notifyTaskAssignment,
  notifyTaskCompletion,
  notifyCommentMention,
  notifyNewComment,
} = require('../utils/notifications');
const { executeAutomation, TRIGGERS } = require('../utils/automations');
const { emitToProject } = require('../config/socket');

// @desc    Get all tasks in project
// @route   GET /api/projects/:projectId/tasks
// @access  Private
const getTasks = async (req, res) => {
  try {
    const { status, assignee, priority, section, tags } = req.query;

    const query = { project: req.params.projectId || req.query.project || req.query.project };

    if (status) query.status = status;
    if (assignee) query.assignee = assignee;
    if (priority) query.priority = priority;
    if (section) query.section = section;
    if (tags) query.tags = { $in: tags.split(',') };

    const tasks = await Task.find(query)
      .populate('assignee', 'name email avatar')
      .populate('assignedBy', 'name email avatar')
      .populate('creator', 'name email avatar')
      .populate('followers', 'name email avatar')
      .populate('subtasks.completedBy', 'name email avatar')
      .sort({ order: 1, createdAt: -1 });

    res.json({
      success: true,
      tasks,
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Get my tasks (assigned to current user)
// @route   GET /api/tasks/my-tasks
// @access  Private
const getMyTasks = async (req, res) => {
  try {
    const { status, workspace } = req.query;

    const query = { assignee: req.user._id };
    if (status) query.status = status;

    const tasks = await Task.find(query)
      .populate('project', 'name color icon workspace')
      .populate('assignedBy', 'name email avatar')
      .populate('creator', 'name email avatar')
      .sort({ dueDate: 1, createdAt: -1 });

    // Filter by workspace if provided
    let filteredTasks = tasks;
    if (workspace) {
      filteredTasks = tasks.filter(
        (task) => task.project.workspace.toString() === workspace
      );
    }

    // Group tasks by date categories
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    const grouped = {
      recentlyAssigned: filteredTasks
        .filter((task) => {
          const assignedDate = new Date(task.createdAt);
          const daysSinceAssigned =
            (now - assignedDate) / (1000 * 60 * 60 * 24);
          return daysSinceAssigned <= 3;
        })
        .slice(0, 10),
      doToday: filteredTasks.filter((task) => {
        if (!task.dueDate) return false;
        const dueDate = new Date(task.dueDate);
        return dueDate < tomorrow && task.status !== 'completed';
      }),
      doNextWeek: filteredTasks.filter((task) => {
        if (!task.dueDate) return false;
        const dueDate = new Date(task.dueDate);
        return dueDate >= tomorrow && dueDate < nextWeek && task.status !== 'completed';
      }),
      doLater: filteredTasks.filter((task) => {
        if (!task.dueDate) return task.status !== 'completed';
        const dueDate = new Date(task.dueDate);
        return dueDate >= nextWeek && task.status !== 'completed';
      }),
      completed: filteredTasks.filter((task) => task.status === 'completed'),
    };

    res.json({
      success: true,
      data: grouped,
    });
  } catch (error) {
    console.error('Get my tasks error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
const getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('project', 'name color icon workspace')
      .populate('assignee', 'name email avatar')
      .populate('assignedBy', 'name email avatar')
      .populate('creator', 'name email avatar')
      .populate('followers', 'name email avatar')
      .populate('subtasks.completedBy', 'name email avatar')
      .populate('dependencies.blockedBy', 'title status')
      .populate('dependencies.blocking', 'title status');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    res.json({
      success: true,
      task,
    });
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Create task
// @route   POST /api/projects/:projectId/tasks
// @access  Private
const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      project: projectId,
      section,
      assignee,
      status,
      priority,
      tags,
      startDate,
      dueDate,
      subtasks,
      customFields,
    } = req.body;

    const project = await Project.findById(projectId || req.params.projectId || req.query.project);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    const task = await Task.create({
      title,
      description,
      project: project._id,
      section,
      assignee,
      assignedBy: assignee ? req.user._id : null,
      creator: req.user._id,
      status,
      priority,
      tags,
      startDate,
      dueDate,
      subtasks: subtasks || [],
      customFields,
      followers: [req.user._id],
    });

    // Update project task count
    project.taskCount += 1;
    await project.save();

    // Send notification if task is assigned
    if (assignee && assignee !== req.user._id.toString()) {
      await notifyTaskAssignment(task, req.user._id, assignee);
    }

    // Log activity
    await logActivity({
      user: req.user._id,
      workspace: project.workspace,
      project: project._id,
      task: task._id,
      action: 'task_created',
      description: `Created task "${task.title}"`,
    });

    // Execute automations
    await executeAutomation(TRIGGERS.TASK_CREATED, task);

    // Emit to project
    emitToProject(project._id, 'task-created', task);

    const populatedTask = await Task.findById(task._id)
      .populate('assignee', 'name email avatar')
      .populate('assignedBy', 'name email avatar')
      .populate('creator', 'name email avatar')
      .populate('followers', 'name email avatar');

    res.status(201).json({
      success: true,
      task: populatedTask,
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    const oldStatus = task.status;
    const oldSection = task.section;
    const oldAssignee = task.assignee;

    // Update fields
    const allowedFields = [
      'title',
      'description',
      'section',
      'assignee',
      'status',
      'priority',
      'tags',
      'startDate',
      'dueDate',
      'customFields',
      'order',
    ];

    const changes = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined && req.body[field] !== task[field]) {
        changes[field] = {
          old: task[field],
          new: req.body[field],
        };
        task[field] = req.body[field];
      }
    });

    // Handle assignee change
    if (req.body.assignee && req.body.assignee !== oldAssignee?.toString()) {
      task.assignedBy = req.user._id;
      // Add new assignee to followers
      if (!task.followers.includes(req.body.assignee)) {
        task.followers.push(req.body.assignee);
      }
      // Send notification
      await notifyTaskAssignment(task, req.user._id, req.body.assignee);
    }

    await task.save({ validateModifiedOnly: true });

    // Update project completion count if status changed
    if (oldStatus !== task.status) {
      const project = await Project.findById(task.project);
      if (oldStatus === 'completed' && task.status !== 'completed') {
        project.completedTaskCount -= 1;
      } else if (oldStatus !== 'completed' && task.status === 'completed') {
        project.completedTaskCount += 1;
        // Notify followers
        await notifyTaskCompletion(task, req.user._id, task.followers);
      }
      await project.save();

      // Execute automations
      if (task.status === 'completed') {
        await executeAutomation(TRIGGERS.TASK_COMPLETED, task);
      }
      await executeAutomation(TRIGGERS.STATUS_CHANGED, task);
    }

    // Execute automations for section change
    if (oldSection?.toString() !== task.section?.toString()) {
      await executeAutomation(TRIGGERS.TASK_MOVED, task, { oldSection });
    }

    // Log activity
    await logActivity({
      user: req.user._id,
      workspace: (await Project.findById(task.project)).workspace,
      project: task.project,
      task: task._id,
      action: 'task_updated',
      description: `Updated task "${task.title}"`,
      changes,
    });

    // Emit to project
    emitToProject(task.project, 'task-updated', task);

    const populatedTask = await Task.findById(task._id)
      .populate('assignee', 'name email avatar')
      .populate('assignedBy', 'name email avatar')
      .populate('creator', 'name email avatar')
      .populate('followers', 'name email avatar')
      .populate('subtasks.completedBy', 'name email avatar');

    res.json({
      success: true,
      task: populatedTask,
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    // Update project task count
    const project = await Project.findById(task.project);
    project.taskCount -= 1;
    if (task.status === 'completed') {
      project.completedTaskCount -= 1;
    }
    await project.save();

    // Delete all comments
    await Comment.deleteMany({ task: task._id });

    // Remove from dependencies
    await Task.updateMany(
      { 'dependencies.blockedBy': task._id },
      { $pull: { 'dependencies.blockedBy': task._id } }
    );
    await Task.updateMany(
      { 'dependencies.blocking': task._id },
      { $pull: { 'dependencies.blocking': task._id } }
    );

    await task.deleteOne();

    // Emit to project
    emitToProject(task.project, 'task-deleted', { taskId: task._id });

    res.json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Add subtask
// @route   POST /api/tasks/:id/subtasks
// @access  Private
const addSubtask = async (req, res) => {
  try {
    const { title } = req.body;

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    task.subtasks.push({
      title,
      order: task.subtasks.length,
    });
    await task.save({ validateModifiedOnly: true });

    // Log activity
    await logActivity({
      user: req.user._id,
      workspace: (await Project.findById(task.project)).workspace,
      project: task.project,
      task: task._id,
      action: 'subtask_added',
      description: `Added subtask "${title}"`,
    });

    // Emit to project
    emitToProject(task.project, 'subtask-added', {
      taskId: task._id,
      subtask: task.subtasks[task.subtasks.length - 1],
    });

    res.status(201).json({
      success: true,
      task,
    });
  } catch (error) {
    console.error('Add subtask error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Update subtask
// @route   PUT /api/tasks/:id/subtasks/:subtaskId
// @access  Private
const updateSubtask = async (req, res) => {
  try {
    const { title, completed } = req.body;

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    const subtask = task.subtasks.id(req.params.subtaskId);
    if (!subtask) {
      return res.status(404).json({
        success: false,
        message: 'Subtask not found',
      });
    }

    if (title) subtask.title = title;
    if (completed !== undefined) {
      subtask.completed = completed;
      if (completed) {
        subtask.completedAt = new Date();
        subtask.completedBy = req.user._id;
      } else {
        subtask.completedAt = null;
        subtask.completedBy = null;
      }
    }

    await task.save({ validateModifiedOnly: true });

    // Emit to project
    emitToProject(task.project, 'subtask-updated', {
      taskId: task._id,
      subtask,
    });

    res.json({
      success: true,
      task,
    });
  } catch (error) {
    console.error('Update subtask error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Delete subtask
// @route   DELETE /api/tasks/:id/subtasks/:subtaskId
// @access  Private
const deleteSubtask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    task.subtasks.pull(req.params.subtaskId);
    await task.save({ validateModifiedOnly: true });

    // Emit to project
    emitToProject(task.project, 'subtask-deleted', {
      taskId: task._id,
      subtaskId: req.params.subtaskId,
    });

    res.json({
      success: true,
      message: 'Subtask deleted successfully',
    });
  } catch (error) {
    console.error('Delete subtask error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Add comment to task
// @route   POST /api/tasks/:id/comments
// @access  Private
const addComment = async (req, res) => {
  try {
    const { content, mentions, parentComment } = req.body;

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    const comment = await Comment.create({
      content,
      task: task._id,
      author: req.user._id,
      parentComment,
      mentions: mentions || [],
    });

    // Update task comment count
    task.commentCount += 1;
    await task.save({ validateModifiedOnly: true });

    // Send notifications
    if (mentions && mentions.length > 0) {
      await notifyCommentMention(comment, task, mentions);
    }
    await notifyNewComment(comment, task, task.followers);

    // Log activity
    await logActivity({
      user: req.user._id,
      workspace: (await Project.findById(task.project)).workspace,
      project: task.project,
      task: task._id,
      action: 'comment_added',
      description: `Commented on task "${task.title}"`,
    });

    // Emit to project
    emitToProject(task.project, 'comment-added', {
      taskId: task._id,
      comment,
    });

    const populatedComment = await Comment.findById(comment._id)
      .populate('author', 'name email avatar')
      .populate('mentions', 'name email avatar');

    res.status(201).json({
      success: true,
      data: populatedComment,
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Get task comments
// @route   GET /api/tasks/:id/comments
// @access  Private
const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ task: req.params.id })
      .populate('author', 'name email avatar')
      .populate('mentions', 'name email avatar')
      .populate('parentComment')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: comments,
    });
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Update comment
// @route   PUT /api/comments/:id
// @access  Private
const updateComment = async (req, res) => {
  try {
    const { content } = req.body;

    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found',
      });
    }

    // Check if user is the author
    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this comment',
      });
    }

    comment.content = content;
    comment.edited = true;
    comment.editedAt = new Date();
    await comment.save();

    const populatedComment = await Comment.findById(comment._id)
      .populate('author', 'name email avatar')
      .populate('mentions', 'name email avatar');

    res.json({
      success: true,
      data: populatedComment,
    });
  } catch (error) {
    console.error('Update comment error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Delete comment
// @route   DELETE /api/comments/:id
// @access  Private
const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found',
      });
    }

    // Check if user is the author
    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this comment',
      });
    }

    const task = await Task.findById(comment.task);
    if (task) {
      task.commentCount -= 1;
      await task.save({ validateModifiedOnly: true });
    }

    await comment.deleteOne();

    res.json({
      success: true,
      message: 'Comment deleted successfully',
    });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Add reaction to comment
// @route   POST /api/comments/:id/reactions
// @access  Private
const addReaction = async (req, res) => {
  try {
    const { emoji } = req.body;

    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found',
      });
    }

    // Check if user already reacted with this emoji
    const existingReaction = comment.reactions.find(
      (r) => r.user.toString() === req.user._id.toString() && r.emoji === emoji
    );

    if (existingReaction) {
      return res.status(400).json({
        success: false,
        message: 'Already reacted with this emoji',
      });
    }

    comment.reactions.push({
      emoji,
      user: req.user._id,
    });
    await comment.save();

    const populatedComment = await Comment.findById(comment._id)
      .populate('author', 'name email avatar')
      .populate('reactions.user', 'name email avatar');

    res.json({
      success: true,
      data: populatedComment,
    });
  } catch (error) {
    console.error('Add reaction error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Remove reaction from comment
// @route   DELETE /api/comments/:id/reactions/:reactionId
// @access  Private
const removeReaction = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found',
      });
    }

    comment.reactions.pull(req.params.reactionId);
    await comment.save();

    res.json({
      success: true,
      message: 'Reaction removed successfully',
    });
  } catch (error) {
    console.error('Remove reaction error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Add follower to task
// @route   POST /api/tasks/:id/followers
// @access  Private
const addFollower = async (req, res) => {
  try {
    const { userId } = req.body;

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    if (!task.followers.includes(userId)) {
      task.followers.push(userId);
      await task.save({ validateModifiedOnly: true });
    }

    const populatedTask = await Task.findById(task._id).populate(
      'followers',
      'name email avatar'
    );

    res.json({
      success: true,
      task: populatedTask,
    });
  } catch (error) {
    console.error('Add follower error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Remove follower from task
// @route   DELETE /api/tasks/:id/followers/:userId
// @access  Private
const removeFollower = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    task.followers.pull(req.params.userId);
    await task.save({ validateModifiedOnly: true });

    res.json({
      success: true,
      message: 'Follower removed successfully',
    });
  } catch (error) {
    console.error('Remove follower error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Add dependency to task
// @route   POST /api/tasks/:id/dependencies
// @access  Private
const addDependency = async (req, res) => {
  try {
    const { taskId, type } = req.body; // type: 'blockedBy' or 'blocking'

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    const dependentTask = await Task.findById(taskId);
    if (!dependentTask) {
      return res.status(404).json({
        success: false,
        message: 'Dependent task not found',
      });
    }

    if (type === 'blockedBy') {
      if (!task.dependencies.blockedBy.includes(taskId)) {
        task.dependencies.blockedBy.push(taskId);
        dependentTask.dependencies.blocking.push(task._id);
      }
    } else if (type === 'blocking') {
      if (!task.dependencies.blocking.includes(taskId)) {
        task.dependencies.blocking.push(taskId);
        dependentTask.dependencies.blockedBy.push(task._id);
      }
    }

    await task.save({ validateModifiedOnly: true });
    await dependentTask.save({ validateModifiedOnly: true });

    const populatedTask = await Task.findById(task._id)
      .populate('dependencies.blockedBy', 'title status')
      .populate('dependencies.blocking', 'title status');

    res.json({
      success: true,
      task: populatedTask,
    });
  } catch (error) {
    console.error('Add dependency error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Remove dependency from task
// @route   DELETE /api/tasks/:id/dependencies/:dependencyId
// @access  Private
const removeDependency = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    const dependencyId = req.params.dependencyId;

    // Remove from both sides
    task.dependencies.blockedBy.pull(dependencyId);
    task.dependencies.blocking.pull(dependencyId);
    await task.save({ validateModifiedOnly: true });

    const dependentTask = await Task.findById(dependencyId);
    if (dependentTask) {
      dependentTask.dependencies.blockedBy.pull(task._id);
      dependentTask.dependencies.blocking.pull(task._id);
      await dependentTask.save({ validateModifiedOnly: true });
    }

    res.json({
      success: true,
      message: 'Dependency removed successfully',
    });
  } catch (error) {
    console.error('Remove dependency error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Search tasks
// @route   GET /api/tasks/search
// @access  Private
const searchTasks = async (req, res) => {
  try {
    const { q, workspace, project, assignee, status, priority } = req.query;

    let query = {};

    // Text search
    if (q) {
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { tags: { $regex: q, $options: 'i' } },
      ];
    }

    // Filters
    if (project) query.project = project;
    if (assignee) query.assignee = assignee;
    if (status) query.status = status;
    if (priority) query.priority = priority;

    let tasks = await Task.find(query)
      .populate('project', 'name color icon workspace')
      .populate('assignee', 'name email avatar')
      .populate('creator', 'name email avatar')
      .limit(50)
      .sort({ createdAt: -1 });

    // Filter by workspace
    if (workspace) {
      tasks = tasks.filter(
        (task) => task.project.workspace.toString() === workspace
      );
    }

    res.json({
      success: true,
      tasks,
    });
  } catch (error) {
    console.error('Search tasks error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

module.exports = {
  getTasks,
  getMyTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  addSubtask,
  updateSubtask,
  deleteSubtask,
  addComment,
  getComments,
  updateComment,
  deleteComment,
  addReaction,
  removeReaction,
  addFollower,
  removeFollower,
  addDependency,
  removeDependency,
  searchTasks,
};

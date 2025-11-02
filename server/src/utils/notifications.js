const Notification = require('../models/Notification');
const ActivityLog = require('../models/ActivityLog');
const { emitToUser, emitToWorkspace, emitToProject } = require('../config/socket');

// Create notification
const createNotification = async (data) => {
  try {
    const notification = await Notification.create(data);
    const populatedNotification = await Notification.findById(notification._id)
      .populate('sender', 'name email avatar')
      .populate('relatedTask', 'title')
      .populate('relatedProject', 'name')
      .populate('relatedWorkspace', 'name');

    // Emit to user via WebSocket
    emitToUser(data.recipient, 'notification', populatedNotification);

    return populatedNotification;
  } catch (error) {
    console.error('Error creating notification:', error);
    return null;
  }
};

// Create multiple notifications
const createBulkNotifications = async (notifications) => {
  try {
    const created = await Notification.insertMany(notifications);

    // Emit to each user
    created.forEach((notification) => {
      emitToUser(notification.recipient, 'notification', notification);
    });

    return created;
  } catch (error) {
    console.error('Error creating bulk notifications:', error);
    return [];
  }
};

// Log activity
const logActivity = async (data) => {
  try {
    const activity = await ActivityLog.create(data);

    // Emit to workspace/project if applicable
    if (data.workspace) {
      emitToWorkspace(data.workspace, 'activity', activity);
    }
    if (data.project) {
      emitToProject(data.project, 'activity', activity);
    }

    return activity;
  } catch (error) {
    console.error('Error logging activity:', error);
    return null;
  }
};

// Notify task assignment
const notifyTaskAssignment = async (task, assignedBy, assignee) => {
  if (assignedBy.toString() === assignee.toString()) {
    return; // Don't notify if user assigns to themselves
  }

  return createNotification({
    recipient: assignee,
    sender: assignedBy,
    type: 'task_assigned',
    title: 'New task assigned',
    message: 'You have been assigned a new task',
    link: `/tasks/${task._id}`,
    relatedTask: task._id,
    relatedProject: task.project,
  });
};

// Notify task completion
const notifyTaskCompletion = async (task, completedBy, subscribers) => {
  const notifications = subscribers
    .filter((userId) => userId.toString() !== completedBy.toString())
    .map((userId) => ({
      recipient: userId,
      sender: completedBy,
      type: 'task_completed',
      title: 'Task completed',
      message: `Task "${task.title}" has been completed`,
      link: `/tasks/${task._id}`,
      relatedTask: task._id,
      relatedProject: task.project,
    }));

  return createBulkNotifications(notifications);
};

// Notify comment mention
const notifyCommentMention = async (comment, task, mentions) => {
  const notifications = mentions.map((userId) => ({
    recipient: userId,
    sender: comment.author,
    type: 'comment_mention',
    title: 'You were mentioned',
    message: 'You were mentioned in a comment',
    link: `/tasks/${task._id}`,
    relatedTask: task._id,
    relatedComment: comment._id,
    relatedProject: task.project,
  }));

  return createBulkNotifications(notifications);
};

// Notify new comment
const notifyNewComment = async (comment, task, subscribers) => {
  const notifications = subscribers
    .filter((userId) => userId.toString() !== comment.author.toString())
    .map((userId) => ({
      recipient: userId,
      sender: comment.author,
      type: 'comment_added',
      title: 'New comment',
      message: `New comment on "${task.title}"`,
      link: `/tasks/${task._id}`,
      relatedTask: task._id,
      relatedComment: comment._id,
      relatedProject: task.project,
    }));

  return createBulkNotifications(notifications);
};

// Notify due date approaching
const notifyDueDateApproaching = async (task, daysUntilDue) => {
  if (!task.assignee) return;

  return createNotification({
    recipient: task.assignee,
    type: 'task_due_soon',
    title: 'Task due soon',
    message: `Task "${task.title}" is due in ${daysUntilDue} day${daysUntilDue > 1 ? 's' : ''}`,
    link: `/tasks/${task._id}`,
    relatedTask: task._id,
    relatedProject: task.project,
  });
};

// Notify overdue task
const notifyOverdueTask = async (task) => {
  if (!task.assignee) return;

  return createNotification({
    recipient: task.assignee,
    type: 'task_overdue',
    title: 'Task overdue',
    message: `Task "${task.title}" is overdue`,
    link: `/tasks/${task._id}`,
    relatedTask: task._id,
    relatedProject: task.project,
  });
};

// Notify project invitation
const notifyProjectInvitation = async (project, invitedBy, invitedUser) => {
  return createNotification({
    recipient: invitedUser,
    sender: invitedBy,
    type: 'project_invite',
    title: 'Project invitation',
    message: `You have been invited to join "${project.name}"`,
    link: `/projects/${project._id}`,
    relatedProject: project._id,
    relatedWorkspace: project.workspace,
  });
};

// Notify workspace invitation
const notifyWorkspaceInvitation = async (workspace, invitedBy, invitedUser) => {
  return createNotification({
    recipient: invitedUser,
    sender: invitedBy,
    type: 'workspace_invite',
    title: 'Workspace invitation',
    message: `You have been invited to join "${workspace.name}"`,
    link: `/workspaces/${workspace._id}`,
    relatedWorkspace: workspace._id,
  });
};

module.exports = {
  createNotification,
  createBulkNotifications,
  logActivity,
  notifyTaskAssignment,
  notifyTaskCompletion,
  notifyCommentMention,
  notifyNewComment,
  notifyDueDateApproaching,
  notifyOverdueTask,
  notifyProjectInvitation,
  notifyWorkspaceInvitation,
};

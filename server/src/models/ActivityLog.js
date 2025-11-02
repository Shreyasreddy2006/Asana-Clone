const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workspace',
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
    },
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
    },
    action: {
      type: String,
      enum: [
        // Task actions
        'task_created',
        'task_updated',
        'task_deleted',
        'task_completed',
        'task_assigned',
        'task_status_changed',
        'task_priority_changed',
        'task_moved',
        'task_due_date_changed',
        // Comment actions
        'comment_added',
        'comment_updated',
        'comment_deleted',
        // Project actions
        'project_created',
        'project_updated',
        'project_deleted',
        'project_member_added',
        'project_member_removed',
        'section_added',
        'section_updated',
        'section_deleted',
        // Workspace actions
        'workspace_created',
        'workspace_updated',
        'member_invited',
        'member_joined',
        'member_removed',
        // Subtask actions
        'subtask_added',
        'subtask_completed',
        'subtask_deleted',
        // File actions
        'file_uploaded',
        'file_deleted',
      ],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    changes: {
      type: mongoose.Schema.Types.Mixed,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

// Add indexes
activityLogSchema.index({ workspace: 1, createdAt: -1 });
activityLogSchema.index({ project: 1, createdAt: -1 });
activityLogSchema.index({ task: 1, createdAt: -1 });
activityLogSchema.index({ user: 1, createdAt: -1 });

// Auto-delete activity logs older than 90 days
activityLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7776000 });

module.exports = mongoose.model('ActivityLog', activityLogSchema);

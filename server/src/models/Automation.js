const mongoose = require('mongoose');

const automationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide an automation name'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workspace',
      required: true,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
    trigger: {
      type: {
        type: String,
        enum: [
          'task_created',
          'task_completed',
          'task_moved',
          'status_changed',
          'assignee_changed',
          'due_date_approaching',
          'tag_added',
        ],
        required: true,
      },
      conditions: {
        section: {
          type: mongoose.Schema.Types.ObjectId,
        },
        status: {
          type: String,
          enum: ['todo', 'in_progress', 'completed', 'blocked'],
        },
        priority: {
          type: String,
          enum: ['low', 'medium', 'high', 'urgent'],
        },
        tag: String,
        assignee: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      },
    },
    actions: [
      {
        type: {
          type: String,
          enum: [
            'assign_task',
            'move_to_section',
            'set_status',
            'set_priority',
            'add_tag',
            'send_notification',
            'add_comment',
            'set_due_date',
            'mark_complete',
          ],
          required: true,
        },
        value: mongoose.Schema.Types.Mixed,
      },
    ],
    executionCount: {
      type: Number,
      default: 0,
    },
    lastExecuted: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Add indexes
automationSchema.index({ project: 1, active: 1 });
automationSchema.index({ workspace: 1 });

module.exports = mongoose.model('Automation', automationSchema);

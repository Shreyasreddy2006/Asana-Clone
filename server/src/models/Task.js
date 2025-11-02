const mongoose = require('mongoose');

const subtaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  order: {
    type: Number,
    default: 0,
  },
  completedAt: {
    type: Date,
  },
  completedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

const attachmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
  },
  type: {
    type: String,
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a task title'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    section: {
      type: mongoose.Schema.Types.ObjectId,
    },
    assignee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['todo', 'in_progress', 'completed', 'blocked'],
      default: 'todo',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    startDate: {
      type: Date,
    },
    dueDate: {
      type: Date,
    },
    completedAt: {
      type: Date,
    },
    subtasks: [subtaskSchema],
    attachments: [attachmentSchema],
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    dependencies: {
      blockedBy: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Task',
        },
      ],
      blocking: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Task',
        },
      ],
    },
    customFields: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
    },
    order: {
      type: Number,
      default: 0,
    },
    commentCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Add indexes for better performance
taskSchema.index({ project: 1, section: 1, order: 1 });
taskSchema.index({ assignee: 1, status: 1 });
taskSchema.index({ dueDate: 1 });
taskSchema.index({ tags: 1 });

// Middleware to update completedAt when status changes to completed
taskSchema.pre('save', function (next) {
  if (this.isModified('status')) {
    if (this.status === 'completed' && !this.completedAt) {
      this.completedAt = new Date();
    } else if (this.status !== 'completed') {
      this.completedAt = null;
    }
  }
  next();
});

module.exports = mongoose.model('Task', taskSchema);

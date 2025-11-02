const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  order: {
    type: Number,
    default: 0,
  },
  collapsed: {
    type: Boolean,
    default: false,
  },
});

const customFieldSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    enum: ['text', 'number', 'date', 'dropdown', 'checkbox'],
    required: true,
  },
  options: [String], // For dropdown type
  required: {
    type: Boolean,
    default: false,
  },
});

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a project name'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workspace',
      required: true,
    },
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    members: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        role: {
          type: String,
          enum: ['owner', 'editor', 'viewer'],
          default: 'editor',
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    sections: [sectionSchema],
    customFields: [customFieldSchema],
    color: {
      type: String,
      default: '#4A90E2',
    },
    icon: {
      type: String,
      default: 'folder',
    },
    view: {
      type: String,
      enum: ['list', 'board', 'timeline', 'calendar'],
      default: 'list',
    },
    status: {
      type: String,
      enum: ['active', 'archived', 'completed'],
      default: 'active',
    },
    startDate: {
      type: Date,
    },
    dueDate: {
      type: Date,
    },
    privacy: {
      type: String,
      enum: ['public', 'private'],
      default: 'public',
    },
    taskCount: {
      type: Number,
      default: 0,
    },
    completedTaskCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Add indexes
projectSchema.index({ workspace: 1 });
projectSchema.index({ team: 1 });
projectSchema.index({ owner: 1 });
projectSchema.index({ 'members.user': 1 });

module.exports = mongoose.model('Project', projectSchema);

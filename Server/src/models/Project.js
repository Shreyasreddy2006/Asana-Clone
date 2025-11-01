const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a project name'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  workspace: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workspace',
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team'
  },
  members: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['owner', 'editor', 'viewer'],
      default: 'editor'
    }
  }],
  sections: [{
    name: {
      type: String,
      required: true
    },
    order: {
      type: Number,
      default: 0
    }
  }],
  color: {
    type: String,
    default: '#4573D2'
  },
  icon: {
    type: String,
    default: 'folder'
  },
  view: {
    type: String,
    enum: ['list', 'board', 'timeline', 'calendar'],
    default: 'list'
  },
  status: {
    type: String,
    enum: ['active', 'archived', 'completed'],
    default: 'active'
  },
  dueDate: {
    type: Date
  },
  isPrivate: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Project', projectSchema);

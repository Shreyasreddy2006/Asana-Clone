const Automation = require('../models/Automation');
const Task = require('../models/Task');
const { createNotification } = require('./notifications');

// Execute automation based on trigger
const executeAutomation = async (trigger, task, context = {}) => {
  try {
    // Find active automations for the project with matching trigger
    const automations = await Automation.find({
      project: task.project,
      active: true,
      'trigger.type': trigger,
    }).populate('creator');

    for (const automation of automations) {
      // Check if conditions match
      if (!checkConditions(automation.trigger.conditions, task, context)) {
        continue;
      }

      // Execute actions
      for (const action of automation.actions) {
        await executeAction(action, task, automation);
      }

      // Update execution count
      automation.executionCount += 1;
      automation.lastExecuted = new Date();
      await automation.save();
    }
  } catch (error) {
    console.error('Error executing automation:', error);
  }
};

// Check if conditions match
const checkConditions = (conditions, task, context) => {
  if (!conditions || Object.keys(conditions).length === 0) {
    return true; // No conditions means always execute
  }

  // Check section condition
  if (conditions.section && task.section?.toString() !== conditions.section.toString()) {
    return false;
  }

  // Check status condition
  if (conditions.status && task.status !== conditions.status) {
    return false;
  }

  // Check priority condition
  if (conditions.priority && task.priority !== conditions.priority) {
    return false;
  }

  // Check tag condition
  if (conditions.tag && !task.tags.includes(conditions.tag)) {
    return false;
  }

  // Check assignee condition
  if (conditions.assignee && task.assignee?.toString() !== conditions.assignee.toString()) {
    return false;
  }

  return true;
};

// Execute a single action
const executeAction = async (action, task, automation) => {
  try {
    switch (action.type) {
      case 'assign_task':
        task.assignee = action.value;
        task.assignedBy = automation.creator;
        await task.save();
        break;

      case 'move_to_section':
        task.section = action.value;
        await task.save();
        break;

      case 'set_status':
        task.status = action.value;
        await task.save();
        break;

      case 'set_priority':
        task.priority = action.value;
        await task.save();
        break;

      case 'add_tag':
        if (!task.tags.includes(action.value)) {
          task.tags.push(action.value);
          await task.save();
        }
        break;

      case 'mark_complete':
        task.status = 'completed';
        task.completedAt = new Date();
        await task.save();
        break;

      case 'send_notification':
        if (task.assignee) {
          await createNotification({
            recipient: task.assignee,
            type: 'task_updated',
            title: 'Automation triggered',
            message: action.value || `Automation "${automation.name}" was triggered`,
            link: `/tasks/${task._id}`,
            relatedTask: task._id,
            relatedProject: task.project,
          });
        }
        break;

      case 'add_comment':
        const Comment = require('../models/Comment');
        await Comment.create({
          content: action.value,
          task: task._id,
          author: automation.creator,
        });
        break;

      case 'set_due_date':
        // value should be number of days from now
        const daysToAdd = parseInt(action.value) || 0;
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + daysToAdd);
        task.dueDate = dueDate;
        await task.save();
        break;

      default:
        console.log(`Unknown action type: ${action.type}`);
    }
  } catch (error) {
    console.error(`Error executing action ${action.type}:`, error);
  }
};

// Trigger types
const TRIGGERS = {
  TASK_CREATED: 'task_created',
  TASK_COMPLETED: 'task_completed',
  TASK_MOVED: 'task_moved',
  STATUS_CHANGED: 'status_changed',
  ASSIGNEE_CHANGED: 'assignee_changed',
  DUE_DATE_APPROACHING: 'due_date_approaching',
  TAG_ADDED: 'tag_added',
};

module.exports = {
  executeAutomation,
  checkConditions,
  executeAction,
  TRIGGERS,
};

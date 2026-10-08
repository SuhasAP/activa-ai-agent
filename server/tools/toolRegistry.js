import { taskTool } from './taskTool.js';
import { calendarTool } from './calendarTool.js';
import { expenseTool } from './expenseTool.js';
import { reminderTool } from './reminderTool.js';
import { noteTool } from './noteTool.js';

export const PERMISSION_LEVELS = {
  READ_ONLY: 'READ_ONLY',
  LOW_RISK: 'LOW_RISK',
  APPROVAL_REQUIRED: 'APPROVAL_REQUIRED'
};

export const TOOL_REGISTRY = {
  // Task Tools
  getTasks: {
    fn: taskTool.getTasks,
    permission: PERMISSION_LEVELS.READ_ONLY,
    description: 'Fetch all user tasks, deadlines, and priorities.',
    parameters: {}
  },
  createTask: {
    fn: taskTool.createTask,
    permission: PERMISSION_LEVELS.LOW_RISK,
    description: 'Create a new task with title, description, dueDate, and priority (HIGH, MEDIUM, LOW).',
    parameters: { title: 'string', description: 'string', dueDate: 'string', priority: 'string' }
  },
  updateTask: {
    fn: taskTool.updateTask,
    permission: PERMISSION_LEVELS.LOW_RISK,
    description: 'Update existing task by taskId.',
    parameters: { taskId: 'string', updates: 'object' }
  },

  // Calendar Tools
  getSchedule: {
    fn: calendarTool.getSchedule,
    permission: PERMISSION_LEVELS.READ_ONLY,
    description: 'Fetch user schedule, classes, and study sessions.',
    parameters: {}
  },
  findFreeTime: {
    fn: calendarTool.findFreeTime,
    permission: PERMISSION_LEVELS.READ_ONLY,
    description: 'Find free time blocks on a specific date for a given duration in minutes.',
    parameters: { date: 'string', duration: 'number' }
  },
  createCalendarDraft: {
    fn: calendarTool.createCalendarDraft,
    permission: PERMISSION_LEVELS.APPROVAL_REQUIRED,
    description: 'Draft/create a calendar event (e.g. Study Session). Requires user approval.',
    parameters: { title: 'string', startTime: 'string', endTime: 'string' }
  },

  // Expense Tools
  getExpenses: {
    fn: expenseTool.getExpenses,
    permission: PERMISSION_LEVELS.READ_ONLY,
    description: 'Fetch all current, committed, and planned expenses.',
    parameters: {}
  },
  calculateBudget: {
    fn: expenseTool.calculateBudget,
    permission: PERMISSION_LEVELS.READ_ONLY,
    description: 'Perform deterministic budget calculation: available money, committed bills, planned expenses, emergency buffer, and remaining balance.',
    parameters: {}
  },
  createBudgetPlan: {
    fn: expenseTool.createBudgetPlan,
    permission: PERMISSION_LEVELS.LOW_RISK,
    description: 'Create a structured budget recommendation plan.',
    parameters: { categories: 'array' }
  },

  // Reminder Tools
  getReminders: {
    fn: reminderTool.getReminders,
    permission: PERMISSION_LEVELS.READ_ONLY,
    description: 'Fetch existing reminders.',
    parameters: {}
  },
  createReminder: {
    fn: reminderTool.createReminder,
    permission: PERMISSION_LEVELS.APPROVAL_REQUIRED,
    description: 'Create a new time-sensitive reminder. Requires user approval.',
    parameters: { title: 'string', dateTime: 'string' }
  },

  // Note Tools
  getNotes: {
    fn: noteTool.getNotes,
    permission: PERMISSION_LEVELS.READ_ONLY,
    description: 'Fetch saved study notes and strategies.',
    parameters: {}
  },
  createNote: {
    fn: noteTool.createNote,
    permission: PERMISSION_LEVELS.LOW_RISK,
    description: 'Create a new study note or summary.',
    parameters: { title: 'string', content: 'string' }
  }
};

/**
 * Execute tool safely with permission validation
 */
export async function executeTool(toolName, params = {}) {
  const tool = TOOL_REGISTRY[toolName];
  if (!tool) {
    return {
      success: false,
      toolName,
      error: `Tool '${toolName}' is not registered in ACTIVA Tool Registry.`
    };
  }

  try {
    const result = await tool.fn(params);
    return {
      success: true,
      toolName,
      permission: tool.permission,
      result
    };
  } catch (err) {
    return {
      success: false,
      toolName,
      error: err.message
    };
  }
}

/**
 * Check if tool requires human approval
 */
export function requiresApproval(toolName) {
  const tool = TOOL_REGISTRY[toolName];
  return tool ? tool.permission === PERMISSION_LEVELS.APPROVAL_REQUIRED : false;
}

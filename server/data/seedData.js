import { executionStore } from './executionStore.js';

// ACTIVA Seed Data and In-Memory Data Store

function getTomorrowDateStr() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
}

function getFutureDateStr(daysAhead) {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  return d.toISOString().split('T')[0];
}

export function calculateReminderStatus(reminder) {
  if (reminder.completedAt) return "COMPLETED";
  if (reminder.cancelledAt) return "CANCELLED";
  if (!reminder.dateTime) return "ACTIVE";

  try {
    const now = new Date();
    // Parse date if ISO format or YYYY-MM-DD HH:mm
    const dtStr = reminder.dateTime.replace(' ', 'T');
    const reminderDate = new Date(dtStr);

    if (isNaN(reminderDate.getTime())) {
      return reminder.status || "ACTIVE";
    }

    const diffMs = reminderDate.getTime() - now.getTime();
    if (diffMs < 0) return "OVERDUE";
    if (diffMs <= 3600000) return "DUE"; // Due within 1 hour
    return "ACTIVE";
  } catch (err) {
    return reminder.status || "ACTIVE";
  }
}

const initialData = {
  tasks: [
    {
      id: "task-1",
      title: "DBMS Assignment 3",
      description: "Complete SQL Query Optimization and Indexing problems",
      dueDate: getTomorrowDateStr(),
      dueDateLabel: "Tomorrow",
      priority: "HIGH",
      completed: false,
      createdAt: new Date().toISOString()
    },
    {
      id: "task-2",
      title: "Software Engineering Notes",
      description: "Review Agile, Scrum, and Architecture patterns",
      dueDate: getFutureDateStr(3),
      dueDateLabel: "In 3 days",
      priority: "MEDIUM",
      completed: false,
      createdAt: new Date().toISOString()
    },
    {
      id: "task-3",
      title: "DSA Practice",
      description: "Solve Graph BFS/DFS and Dynamic Programming problems",
      dueDate: getFutureDateStr(5),
      dueDateLabel: "In 5 days",
      priority: "MEDIUM",
      completed: false,
      createdAt: new Date().toISOString()
    }
  ],
  calendar: [
    {
      id: "cal-1",
      title: "DBMS Class",
      startTime: `${getTomorrowDateStr()}T10:00:00`,
      endTime: `${getTomorrowDateStr()}T11:30:00`,
      timeLabel: "Tomorrow 10:00 AM - 11:30 AM",
      type: "class"
    },
    {
      id: "cal-2",
      title: "Software Engineering Class",
      startTime: `${getTomorrowDateStr()}T13:00:00`,
      endTime: `${getTomorrowDateStr()}T14:30:00`,
      timeLabel: "Tomorrow 1:00 PM - 2:30 PM",
      type: "class"
    },
    {
      id: "cal-3",
      title: "Study Session",
      startTime: `${getTomorrowDateStr()}T18:00:00`,
      endTime: `${getTomorrowDateStr()}T20:00:00`,
      timeLabel: "Tomorrow 6:00 PM - 8:00 PM",
      type: "study"
    }
  ],
  expenses: [
    {
      id: "exp-1",
      title: "Electricity Bill",
      amount: 650,
      dueDate: getTomorrowDateStr(),
      dueDateLabel: "Tomorrow",
      type: "committed",
      category: "Utilities"
    },
    {
      id: "exp-2",
      title: "Groceries",
      amount: 700,
      dueDate: getFutureDateStr(4),
      dueDateLabel: "In 4 days",
      type: "planned",
      category: "Food"
    },
    {
      id: "exp-3",
      title: "Transport",
      amount: 300,
      dueDate: getFutureDateStr(7),
      dueDateLabel: "This week",
      type: "planned",
      category: "Travel"
    }
  ],
  budgetSummary: {
    totalAvailable: 2000,
    currency: "₹"
  },
  reminders: [
    {
      id: "rem-1",
      title: "DBMS Assignment",
      dateTime: `${getTomorrowDateStr()}T19:00:00`,
      dateTimeLabel: "Tomorrow at 7:00 PM",
      status: "ACTIVE",
      source: "ACTIVA AGENT",
      createdAt: new Date().toISOString(),
      completedAt: null,
      cancelledAt: null,
      sourceExecutionId: null,
      sourceActionId: null
    },
    {
      id: "rem-2",
      title: "Electricity Bill Payment",
      dateTime: `${getTomorrowDateStr()}T09:00:00`,
      dateTimeLabel: "Tomorrow at 9:00 AM",
      status: "ACTIVE",
      source: "ACTIVA AGENT",
      createdAt: new Date().toISOString(),
      completedAt: null,
      cancelledAt: null,
      sourceExecutionId: null,
      sourceActionId: null
    }
  ],
  notes: [
    {
      id: "note-1",
      title: "DBMS Exam Preparation Topics",
      content: "Key topics to revise: B+ Trees, Relational Algebra, ACID Properties, SQL Joins.",
      createdAt: new Date().toISOString()
    },
    {
      id: "note-2",
      title: "Monthly Budget Guardrails",
      content: "Prioritize fixed bills first. Reserve emergency buffer of ₹350 before any discretionary spending.",
      createdAt: new Date().toISOString()
    }
  ],
  budgetPlans: []
};

// Deep clone data store
let store = JSON.parse(JSON.stringify(initialData));

export const db = {
  getStore: () => store,
  resetStore: () => {
    store = JSON.parse(JSON.stringify(initialData));
    executionStore.resetExecutions();
    return store;
  },

  // Tasks
  getTasks: () => store.tasks,
  createTask: (title, description = "", dueDate = "", priority = "MEDIUM") => {
    const newTask = {
      id: `task-${Date.now()}`,
      title,
      description,
      dueDate: dueDate || getTomorrowDateStr(),
      dueDateLabel: dueDate ? dueDate : "Soon",
      priority: priority.toUpperCase(),
      completed: false,
      createdAt: new Date().toISOString()
    };
    store.tasks.push(newTask);
    return newTask;
  },
  updateTask: (taskId, updates) => {
    const taskIndex = store.tasks.findIndex(t => t.id === taskId || t.title.toLowerCase().includes(taskId.toLowerCase()));
    if (taskIndex !== -1) {
      store.tasks[taskIndex] = { ...store.tasks[taskIndex], ...updates };
      return store.tasks[taskIndex];
    }
    return null;
  },

  // Calendar
  getSchedule: () => store.calendar,
  findFreeTime: (date = getTomorrowDateStr(), durationMinutes = 60) => {
    return [
      { timeSlot: `${date} 08:00 - 09:30`, available: true, label: "Morning Block (1.5 hrs)" },
      { timeSlot: `${date} 15:00 - 17:30`, available: true, label: "Afternoon Block (2.5 hrs)" },
      { timeSlot: `${date} 20:30 - 22:00`, available: true, label: "Evening Block (1.5 hrs)" }
    ];
  },
  createCalendarDraft: (title, startTime, endTime) => {
    const newCal = {
      id: `cal-${Date.now()}`,
      title,
      startTime: startTime || `${getTomorrowDateStr()}T20:30:00`,
      endTime: endTime || `${getTomorrowDateStr()}T22:00:00`,
      timeLabel: `${startTime || "Tomorrow 8:30 PM"} - ${endTime || "10:00 PM"}`,
      type: "study"
    };
    store.calendar.push(newCal);
    return newCal;
  },

  // Expenses & Budget
  getExpenses: () => store.expenses,
  calculateBudget: () => {
    const totalAvailable = store.budgetSummary.totalAvailable;
    const committed = store.expenses
      .filter(e => e.type === "committed")
      .reduce((sum, e) => sum + e.amount, 0);
    const planned = store.expenses
      .filter(e => e.type === "planned")
      .reduce((sum, e) => sum + e.amount, 0);
    const remainingBeforeEmergency = totalAvailable - committed;
    const emergencyBuffer = 350;
    const safeDiscretionarySpending = remainingBeforeEmergency - planned - emergencyBuffer;

    return {
      currency: "₹",
      totalAvailable,
      committedExpenses: committed,
      plannedExpenses: planned,
      emergencyBuffer,
      remainingUncommitted: remainingBeforeEmergency,
      safeDiscretionarySpending: Math.max(0, safeDiscretionarySpending),
      isOverbudgetRisk: safeDiscretionarySpending < 0,
      breakdown: store.expenses
    };
  },
  createBudgetPlan: (categories = []) => {
    const plan = {
      id: `plan-${Date.now()}`,
      title: "Balanced Student Budget Plan",
      available: 2000,
      committedBill: 650,
      plannedGroceriesAndTransport: 1000,
      emergencyBufferProtected: 350,
      recommendation: "Pay ₹650 Electricity bill immediately. Keep ₹350 untouched as Emergency Buffer. Rest (₹1,000) dedicated to Groceries & Travel.",
      createdAt: new Date().toISOString()
    };
    store.budgetPlans.push(plan);
    return plan;
  },

  // Reminders with Lifecycle & Dynamic Status
  getReminders: () => {
    return store.reminders.map(rem => ({
      ...rem,
      status: calculateReminderStatus(rem)
    }));
  },

  createReminder: (params) => {
    const title = typeof params === 'string' ? params : params.title;
    const dateTime = typeof params === 'object' ? params.dateTime : arguments[1];
    const source = typeof params === 'object' ? (params.source || "MANUAL") : "MANUAL";
    const sourceExecutionId = typeof params === 'object' ? params.sourceExecutionId : null;
    const sourceActionId = typeof params === 'object' ? params.sourceActionId : null;

    if (!title || !title.trim()) {
      throw new Error("Reminder title is required.");
    }

    const normalizedTitle = title.trim().toLowerCase();
    const normalizedDateTime = (dateTime || '').trim().toLowerCase();

    // Check for existing non-cancelled and non-completed active/due/overdue reminder
    const existing = store.reminders.find(r => {
      const currentStatus = calculateReminderStatus(r);
      // Historical completed or cancelled reminders do NOT block new reminders
      if (currentStatus === 'COMPLETED' || currentStatus === 'CANCELLED') return false;

      const rTitle = r.title.trim().toLowerCase();
      // Title match
      const titleMatches = rTitle === normalizedTitle ||
                           (normalizedTitle.includes('dbms') && rTitle.includes('dbms')) ||
                           (normalizedTitle.includes('electricity') && rTitle.includes('electricity'));

      if (!titleMatches) return false;

      // Time match check: Same title at DIFFERENT time is NOT duplicate
      const rDT = (r.dateTime || '').trim().toLowerCase();
      if (normalizedDateTime && rDT) {
        // Compare full ISO date-time string up to hour:minute (YYYY-MM-DDTHH:mm)
        const dtA = normalizedDateTime.replace(' ', 'T').substring(0, 16);
        const dtB = rDT.replace(' ', 'T').substring(0, 16);
        return dtA === dtB;
      }

      return true;
    });

    if (existing) {
      return {
        created: false,
        duplicate: true,
        existingReminderId: existing.id,
        reminder: {
          ...existing,
          status: calculateReminderStatus(existing)
        },
        message: "An identical reminder already exists."
      };
    }

    const newRem = {
      id: `rem-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: title.trim(),
      dateTime: dateTime || `${getTomorrowDateStr()}T19:00:00`,
      dateTimeLabel: dateTime ? dateTime : "Tomorrow at 7:00 PM",
      status: "ACTIVE",
      source: source || "MANUAL",
      createdAt: new Date().toISOString(),
      completedAt: null,
      cancelledAt: null,
      sourceExecutionId,
      sourceActionId
    };

    store.reminders.push(newRem);
    return {
      created: true,
      duplicate: false,
      reminder: {
        ...newRem,
        status: calculateReminderStatus(newRem)
      }
    };
  },

  completeReminder: (id) => {
    const rem = store.reminders.find(r => r.id === id);
    if (!rem) return null;
    rem.completedAt = new Date().toISOString();
    rem.status = "COMPLETED";
    return {
      ...rem,
      status: "COMPLETED"
    };
  },

  cancelReminder: (id) => {
    const rem = store.reminders.find(r => r.id === id);
    if (!rem) return null;
    rem.cancelledAt = new Date().toISOString();
    rem.status = "CANCELLED";
    return {
      ...rem,
      status: "CANCELLED"
    };
  },

  // Notes
  getNotes: () => store.notes,
  createNote: (title, content) => {
    const newNote = {
      id: `note-${Date.now()}`,
      title,
      content,
      createdAt: new Date().toISOString()
    };
    store.notes.push(newNote);
    return newNote;
  }
};

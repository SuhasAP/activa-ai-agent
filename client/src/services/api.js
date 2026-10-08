// ACTIVA Client API Service

const BASE_URL = '/api';

export const api = {
  // Agent & Execution endpoints
  executeGoal: async (goal) => {
    const res = await fetch(`${BASE_URL}/agent/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ goal })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to execute goal');
    }
    return res.json();
  },

  getLatestExecution: async () => {
    const res = await fetch(`${BASE_URL}/executions/latest`);
    if (!res.ok) return null;
    return res.json();
  },

  getAllExecutions: async () => {
    const res = await fetch(`${BASE_URL}/executions`);
    return res.json();
  },

  getExecutionById: async (id) => {
    const res = await fetch(`${BASE_URL}/executions/${id}`);
    return res.json();
  },

  approveAction: async (pendingId) => {
    const res = await fetch(`${BASE_URL}/agent/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pendingId })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to approve action');
    }
    return res.json();
  },

  rejectAction: async (pendingId) => {
    const res = await fetch(`${BASE_URL}/agent/reject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pendingId })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to reject action');
    }
    return res.json();
  },

  resetStore: async () => {
    const res = await fetch(`${BASE_URL}/agent/reset`, { method: 'POST' });
    return res.json();
  },

  // Resource endpoints
  getTasks: async () => {
    const res = await fetch(`${BASE_URL}/tasks`);
    return res.json();
  },
  createTask: async (task) => {
    const res = await fetch(`${BASE_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task)
    });
    return res.json();
  },
  updateTask: async (id, updates) => {
    const res = await fetch(`${BASE_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    return res.json();
  },

  getCalendar: async () => {
    const res = await fetch(`${BASE_URL}/calendar`);
    return res.json();
  },

  getExpenses: async () => {
    const res = await fetch(`${BASE_URL}/expenses`);
    return res.json();
  },

  getReminders: async () => {
    const res = await fetch(`${BASE_URL}/reminders`);
    return res.json();
  },
  createReminder: async (reminder) => {
    const res = await fetch(`${BASE_URL}/reminders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reminder)
    });
    return res.json();
  },

  getNotes: async () => {
    const res = await fetch(`${BASE_URL}/notes`);
    return res.json();
  }
};

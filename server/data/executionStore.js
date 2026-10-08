import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const EXECUTIONS_FILE = path.join(__dirname, 'executions.json');

// In-memory cache synced to JSON file
let executionsCache = [];
// Completed actionIds set to enforce idempotency
const executedActionIds = new Set();

// Load initial data from disk
function loadFromDisk() {
  try {
    if (fs.existsSync(EXECUTIONS_FILE)) {
      const content = fs.readFileSync(EXECUTIONS_FILE, 'utf-8');
      executionsCache = JSON.parse(content || '[]');
      
      // Populate executed action IDs from past executions
      executedActionIds.clear();
      executionsCache.forEach(exec => {
        if (exec.executedActions) {
          exec.executedActions.forEach(id => executedActionIds.add(id));
        }
        if (exec.actionId && exec.status === 'COMPLETED') {
          executedActionIds.add(exec.actionId);
        }
      });
    } else {
      executionsCache = [];
      saveToDisk();
    }
  } catch (err) {
    console.warn('[executionStore] Warning reading executions.json, starting fresh:', err.message);
    executionsCache = [];
  }
}

function saveToDisk() {
  try {
    fs.writeFileSync(EXECUTIONS_FILE, JSON.stringify(executionsCache, null, 2), 'utf-8');
  } catch (err) {
    console.error('[executionStore] Error saving executions.json:', err.message);
  }
}

// Load initial disk content
loadFromDisk();

export const executionStore = {
  getAllExecutions: () => {
    return executionsCache;
  },

  getLatestExecution: () => {
    if (executionsCache.length === 0) return null;
    // Return the execution with the latest updatedAt timestamp
    return executionsCache[executionsCache.length - 1];
  },

  getExecutionById: (id) => {
    return executionsCache.find(e => e.id === id || e.pendingId === id);
  },

  saveExecution: (execution) => {
    const now = new Date().toISOString();
    const newExec = {
      id: execution.id || `exec-${Date.now()}`,
      pendingId: execution.pendingId || null,
      actionId: execution.actionId || null,
      userGoal: execution.userGoal || '',
      intent: execution.intent || '',
      reasoning: execution.reasoning || '',
      status: execution.status || 'PENDING', // PENDING, AWAITING_APPROVAL, COMPLETED, CANCELLED, FAILED
      createdAt: execution.createdAt || now,
      updatedAt: now,
      timeline: execution.timeline || [],
      planSteps: execution.planSteps || [],
      summary: execution.summary || '',
      requiresApproval: execution.requiresApproval || false,
      approvalCard: execution.approvalCard || null,
      resultVerification: execution.resultVerification || null,
      executedActions: execution.executedActions || []
    };

    const existingIndex = executionsCache.findIndex(e => e.id === newExec.id || (e.pendingId && e.pendingId === newExec.pendingId));
    if (existingIndex !== -1) {
      executionsCache[existingIndex] = { ...executionsCache[existingIndex], ...newExec, updatedAt: now };
    } else {
      executionsCache.push(newExec);
    }

    saveToDisk();
    return newExec;
  },

  updateExecution: (id, updates) => {
    const index = executionsCache.findIndex(e => e.id === id || e.pendingId === id);
    if (index !== -1) {
      executionsCache[index] = {
        ...executionsCache[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      saveToDisk();
      return executionsCache[index];
    }
    return null;
  },

  // Action Idempotency Helpers
  isActionExecuted: (actionId) => {
    if (!actionId) return false;
    return executedActionIds.has(actionId);
  },

  markActionExecuted: (actionId) => {
    if (actionId) {
      executedActionIds.add(actionId);
    }
  },

  // Reset store for Demo Reset button
  resetExecutions: () => {
    executionsCache = [];
    executedActionIds.clear();
    saveToDisk();
    return executionsCache;
  }
};

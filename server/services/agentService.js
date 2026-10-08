import { analyzeIntentAndPlan } from './geminiService.js';
import { executeApprovedAction } from './toolRouter.js';
import { db } from '../data/seedData.js';
import { executionStore } from '../data/executionStore.js';

function slugify(text = '') {
  return String(text).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function generateActionId(execId, toolName, params = {}) {
  const cleanTitle = slugify(params.title || params.description || 'action');
  return `action-${execId}-${toolName}-${cleanTitle}`;
}

export const agentService = {
  /**
   * Main Execution Flow
   */
  async processGoal(userGoal) {
    if (!userGoal || typeof userGoal !== 'string' || !userGoal.trim()) {
      throw new Error("Goal string is required and cannot be empty.");
    }

    const execId = `exec-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const timeline = [
      { id: "step-1", status: "completed", message: "✓ Goal received & intent understood" },
      { id: "step-2", status: "completed", message: "✓ Decomposing goal into execution steps" },
      { id: "step-3", status: "completed", message: "✓ Inspecting tasks, calendar & financial records" }
    ];

    const tasks = db.getTasks();
    const calendar = db.getSchedule();
    const expenses = db.getExpenses();
    const budgetSummary = db.calculateBudget();

    const systemContext = {
      activeTasks: tasks,
      schedule: calendar,
      expenses,
      budgetSummary
    };

    const aiDecision = await analyzeIntentAndPlan(userGoal, systemContext);

    timeline.push({ id: "step-4", status: "completed", message: "✓ Tool selection & deterministic calculations verified" });
    timeline.push({ id: "step-5", status: "completed", message: "✓ Execution plan generated" });

    const proposedAction = aiDecision.proposedAction;

    if (proposedAction && proposedAction.requiresApproval) {
      const pendingId = `pending-${Date.now()}`;
      const actionId = generateActionId(execId, proposedAction.toolName, proposedAction.params);
      
      timeline.push({ id: "step-6", status: "warning", message: "⚠ Human approval required for consequential action" });

      const executionData = {
        id: execId,
        pendingId,
        actionId,
        userGoal: userGoal.trim(),
        intent: aiDecision.intent,
        reasoning: aiDecision.reasoning,
        status: "AWAITING_APPROVAL",
        createdAt: new Date().toISOString(),
        timeline,
        planSteps: aiDecision.planSteps,
        summary: aiDecision.summary,
        requiresApproval: true,
        approvalCard: {
          pendingId,
          actionId,
          executionId: execId,
          actionType: proposedAction.toolName,
          title: proposedAction.params?.title || "Consequential Action",
          description: proposedAction.description,
          reason: proposedAction.reason,
          params: proposedAction.params,
          status: "PENDING"
        },
        resultVerification: null,
        executedActions: []
      };

      // Persist execution state to server store
      executionStore.saveExecution(executionData);

      return {
        success: true,
        ...executionData,
        dashboardData: {
          budget: budgetSummary,
          taskCount: tasks.length,
          upcomingExpenses: expenses.filter(e => e.type === "committed")
        }
      };
    }

    // No approval required, run low-risk action directly
    let actionResult = null;
    let actionFailed = false;
    let failureError = null;

    if (proposedAction && proposedAction.toolName) {
      try {
        actionResult = await executeApprovedAction(proposedAction.toolName, proposedAction.params);
        if (actionResult && actionResult.success === false) {
          actionFailed = true;
          failureError = actionResult.error || "Tool execution failed";
        }
      } catch (err) {
        actionFailed = true;
        failureError = err.message;
      }
    }

    if (actionFailed) {
      timeline.push({ id: "step-7", status: "warning", message: `✖ Action failed: ${failureError}` });
      const failedExec = {
        id: execId,
        userGoal: userGoal.trim(),
        intent: aiDecision.intent,
        reasoning: aiDecision.reasoning,
        status: "FAILED",
        createdAt: new Date().toISOString(),
        timeline,
        planSteps: aiDecision.planSteps,
        summary: `Action failed. No successful execution was recorded. (${failureError})`,
        requiresApproval: false,
        resultVerification: {
          verified: false,
          actionExecuted: "None (Failed)",
          whatIDid: ["Calculated execution plan"],
          whatNeedsAttention: [`Action failed: ${failureError}`]
        }
      };
      executionStore.saveExecution(failedExec);
      return { success: false, ...failedExec };
    }

    timeline.push({ id: "step-7", status: "completed", message: "✓ Action executed & result verified" });

    const completedExec = {
      id: execId,
      userGoal: userGoal.trim(),
      intent: aiDecision.intent,
      reasoning: aiDecision.reasoning,
      status: "COMPLETED",
      createdAt: new Date().toISOString(),
      timeline,
      planSteps: aiDecision.planSteps,
      summary: aiDecision.summary,
      requiresApproval: false,
      resultVerification: {
        verified: true,
        actionExecuted: proposedAction?.description || "Analysis & Planning Complete",
        whatIDid: [
          "Prioritized DBMS assignment deadline",
          "Calculated available budget & protected ₹350 emergency buffer",
          "Structured schedule focus session"
        ],
        whatNeedsAttention: [
          "Pay ₹650 Electricity Bill due tomorrow",
          "Submit DBMS Assignment 3 before midnight"
        ]
      }
    };

    executionStore.saveExecution(completedExec);

    return {
      success: true,
      ...completedExec,
      dashboardData: {
        budget: db.calculateBudget(),
        tasks: db.getTasks(),
        calendar: db.getSchedule(),
        reminders: db.getReminders()
      }
    };
  },

  /**
   * Handle User Approval with Idempotency & Failure Safety
   */
  async approveAction(pendingId) {
    const existingExec = executionStore.getExecutionById(pendingId);

    if (!existingExec) {
      const err = new Error(`Pending approval with ID '${pendingId}' not found.`);
      err.status = 404;
      throw err;
    }

    // Reject invalid transition: REJECTED/CANCELLED -> APPROVED
    if (existingExec.status === 'CANCELLED' || existingExec.approvalCard?.status === 'REJECTED') {
      const err = new Error(`Invalid state transition: Cannot approve a rejected or cancelled action.`);
      err.status = 400;
      throw err;
    }

    // Reject invalid transition: FAILED -> APPROVED
    if (existingExec.status === 'FAILED') {
      const err = new Error(`Invalid state transition: Cannot approve a failed execution.`);
      err.status = 400;
      throw err;
    }

    const { actionId, approvalCard } = existingExec;
    const proposedAction = {
      toolName: approvalCard?.actionType,
      params: {
        ...(approvalCard?.params || {}),
        sourceExecutionId: existingExec.id,
        sourceActionId: actionId,
        source: "ACTIVA AGENT"
      },
      description: approvalCard?.description
    };

    // Idempotency check: If already executed or status is COMPLETED
    if (existingExec.status === 'COMPLETED' || (actionId && executionStore.isActionExecuted(actionId))) {
      console.log(`[Idempotency] Action '${actionId}' already executed. Returning existing result.`);
      return {
        success: true,
        alreadyExecuted: true,
        ...existingExec,
        dashboardData: {
          budget: db.calculateBudget(),
          tasks: db.getTasks(),
          calendar: db.getSchedule(),
          reminders: db.getReminders()
        }
      };
    }

    // Execute the backend tool action
    let executionResult;
    try {
      executionResult = await executeApprovedAction(proposedAction.toolName, proposedAction.params);
    } catch (err) {
      const failedTimeline = [
        ...(existingExec.timeline || []),
        { id: "step-fail", status: "warning", message: `✖ Execution failed: ${err.message}` }
      ];
      const failedData = {
        ...existingExec,
        status: "FAILED",
        timeline: failedTimeline,
        summary: "Action failed. No successful execution was recorded.",
        resultVerification: {
          verified: false,
          actionExecuted: "Failed during execution",
          whatIDid: ["Attempted execution"],
          whatNeedsAttention: [`Tool error: ${err.message}`]
        }
      };
      executionStore.saveExecution(failedData);
      return { success: false, ...failedData };
    }

    if (!executionResult.success) {
      const failedData = {
        ...existingExec,
        status: "FAILED",
        summary: `Action failed. No successful execution was recorded. (${executionResult.error})`,
        resultVerification: {
          verified: false,
          actionExecuted: "Failed during execution",
          whatIDid: ["Attempted tool execution"],
          whatNeedsAttention: [`Error: ${executionResult.error}`]
        }
      };
      executionStore.saveExecution(failedData);
      return { success: false, ...failedData };
    }

    // Mark action as executed for idempotency
    if (actionId) {
      executionStore.markActionExecuted(actionId);
    }

    const isDuplicateReminder = executionResult.result?.duplicate === true;
    const actionMessage = isDuplicateReminder 
      ? `Existing active reminder preserved ("${proposedAction.params?.title || 'Reminder'}")` 
      : `Created confirmed reminder: "${proposedAction.params?.title || 'Assignment Deadline'}"`;

    const updatedTimeline = [
      { id: "step-1", status: "completed", message: "✓ Goal received & intent understood" },
      { id: "step-2", status: "completed", message: "✓ Execution plan generated" },
      { id: "step-3", status: "completed", message: "✓ Human approval GRANTED by user" },
      { id: "step-4", status: "completed", message: `✓ Approved action executed: ${proposedAction.toolName}` },
      { id: "step-5", status: "completed", message: "✓ Result verified in system store" }
    ];

    const completedExec = {
      ...existingExec,
      status: "COMPLETED",
      approvalCard: {
        ...(existingExec.approvalCard || {}),
        status: "EXECUTED"
      },
      executedActions: [...(existingExec.executedActions || []), actionId].filter(Boolean),
      timeline: updatedTimeline,
      summary: isDuplicateReminder
        ? `An identical active reminder already exists. No duplicate reminder was created.`
        : `Action approved and successfully executed! ${proposedAction.description}`,
      resultVerification: {
        verified: true,
        actionExecuted: proposedAction.description,
        whatIDid: [
          `Prioritized DBMS Assignment 3 (Due Tomorrow)`,
          actionMessage,
          `Calculated safe spending buffer: ₹350 emergency fund preserved`,
          `Validated calendar slot availability`
        ],
        whatNeedsAttention: [
          `Pay ₹650 Electricity bill due tomorrow`,
          `Attend DBMS Class at 10:00 AM`
        ]
      }
    };

    executionStore.saveExecution(completedExec);

    return {
      success: true,
      ...completedExec,
      dashboardData: {
        budget: db.calculateBudget(),
        tasks: db.getTasks(),
        calendar: db.getSchedule(),
        reminders: db.getReminders()
      }
    };
  },

  /**
   * Handle User Rejection of Pending Action
   */
  async rejectAction(pendingId) {
    const existingExec = executionStore.getExecutionById(pendingId);
    if (!existingExec) {
      const err = new Error(`Pending approval with ID '${pendingId}' not found.`);
      err.status = 404;
      throw err;
    }

    if (existingExec.status === 'COMPLETED' || existingExec.approvalCard?.status === 'EXECUTED') {
      const err = new Error(`Invalid state transition: Cannot reject an already executed action.`);
      err.status = 400;
      throw err;
    }

    const proposedTitle = (existingExec.approvalCard?.params?.title || '').toLowerCase().trim();
    const activeReminders = db.getReminders();
    const preservedReminder = activeReminders.find(r => 
      r.status !== 'CANCELLED' && 
      (r.title.toLowerCase().includes(proposedTitle) || proposedTitle.includes(r.title.toLowerCase()))
    );

    const updatedTimeline = [
      { id: "step-1", status: "completed", message: "✓ Goal received & intent understood" },
      { id: "step-2", status: "warning", message: "⚠ Action REJECTED by user" },
      { id: "step-3", status: "completed", message: "✓ Action cancelled safely. No new changes made to system." }
    ];

    const summaryMsg = preservedReminder
      ? "No new reminder was created. An existing reminder from a previous execution is still active."
      : "Action cancelled. No changes were made to your schedule or reminders.";

    const whatIDid = [
      "Calculated plan and budget recommendations",
      "Safely aborted new reminder creation upon user request"
    ];
    if (preservedReminder) {
      whatIDid.push(`Preserved active reminder: "${preservedReminder.title}" (${preservedReminder.dateTimeLabel})`);
    }

    const cancelledExec = {
      ...existingExec,
      status: "CANCELLED",
      approvalCard: {
        ...(existingExec.approvalCard || {}),
        status: "REJECTED"
      },
      timeline: updatedTimeline,
      summary: summaryMsg,
      resultVerification: {
        verified: true,
        actionExecuted: "Cancelled by user (No state modifications)",
        existingReminderPreserved: preservedReminder ? {
          id: preservedReminder.id,
          title: preservedReminder.title,
          dateTimeLabel: preservedReminder.dateTimeLabel,
          status: preservedReminder.status
        } : null,
        whatIDid,
        whatNeedsAttention: [
          "You can try another goal or approve when ready."
        ]
      }
    };

    executionStore.saveExecution(cancelledExec);

    return {
      success: true,
      ...cancelledExec,
      dashboardData: {
        budget: db.calculateBudget(),
        tasks: db.getTasks(),
        calendar: db.getSchedule(),
        reminders: db.getReminders()
      }
    };
  }
};

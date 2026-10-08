/**
 * Input Validation Middleware for ACTIVA Express Routes
 * Enforces string lengths, parameter types, and prevents payload abuse.
 */

export function validateGoalInput(req, res, next) {
  const { goal } = req.body;
  if (!goal || typeof goal !== 'string' || !goal.trim()) {
    return res.status(400).json({
      error: true,
      message: "Goal input is required and must be a non-empty string."
    });
  }

  if (goal.trim().length > 2000) {
    return res.status(400).json({
      error: true,
      message: "Goal input exceeds maximum allowed length of 2000 characters."
    });
  }

  req.body.goal = goal.trim();
  next();
}

export function validateApprovalInput(req, res, next) {
  const { pendingId } = req.body;
  if (!pendingId || typeof pendingId !== 'string' || !pendingId.trim()) {
    return res.status(400).json({
      error: true,
      message: "pendingId is required for approval/rejection actions."
    });
  }

  if (pendingId.trim().length > 100) {
    return res.status(400).json({
      error: true,
      message: "Invalid pendingId format."
    });
  }

  req.body.pendingId = pendingId.trim();
  next();
}

export function validateTaskInput(req, res, next) {
  const { title, description, priority } = req.body;
  if (!title || typeof title !== 'string' || !title.trim()) {
    return res.status(400).json({
      error: true,
      message: "Task title is required."
    });
  }

  if (title.trim().length > 200) {
    return res.status(400).json({
      error: true,
      message: "Task title exceeds maximum allowed length of 200 characters."
    });
  }

  if (description && (typeof description !== 'string' || description.length > 5000)) {
    return res.status(400).json({
      error: true,
      message: "Task description exceeds maximum allowed length of 5000 characters."
    });
  }

  if (priority && !['HIGH', 'MEDIUM', 'LOW'].includes(String(priority).toUpperCase())) {
    return res.status(400).json({
      error: true,
      message: "Task priority must be HIGH, MEDIUM, or LOW."
    });
  }

  next();
}

export function validateReminderInput(req, res, next) {
  const { title, dateTime } = req.body;
  if (!title || typeof title !== 'string' || !title.trim()) {
    return res.status(400).json({
      error: true,
      message: "Reminder title is required."
    });
  }

  if (title.trim().length > 200) {
    return res.status(400).json({
      error: true,
      message: "Reminder title exceeds maximum allowed length of 200 characters."
    });
  }

  if (dateTime && typeof dateTime !== 'string') {
    return res.status(400).json({
      error: true,
      message: "Invalid dateTime parameter."
    });
  }

  next();
}

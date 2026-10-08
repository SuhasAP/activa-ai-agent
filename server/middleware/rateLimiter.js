/**
 * Lightweight In-Memory Rate Limiter for ACTIVA Expensive Agent Endpoints
 * Limits requests per IP address to prevent prompt spamming / abuse.
 */

const ipRequestMap = new Map();
const WINDOW_MS = 60 * 1000; // 1 minute window
const MAX_REQUESTS_PER_WINDOW = 30; // Max 30 agent executions per minute

export function agentRateLimiter(req, res, next) {
  const ip = req.ip || req.connection.remoteAddress || '127.0.0.1';
  const now = Date.now();

  const record = ipRequestMap.get(ip) || { count: 0, resetTime: now + WINDOW_MS };

  if (now > record.resetTime) {
    record.count = 1;
    record.resetTime = now + WINDOW_MS;
  } else {
    record.count += 1;
  }

  ipRequestMap.set(ip, record);

  if (record.count > MAX_REQUESTS_PER_WINDOW) {
    return res.status(429).json({
      error: true,
      message: "Too many agent requests. Please wait a minute before sending another goal."
    });
  }

  next();
}

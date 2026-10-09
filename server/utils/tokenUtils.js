import crypto from 'crypto';
import { TOOL_REGISTRY } from '../tools/toolRegistry.js';

const TOKEN_TTL_MS = 24 * 60 * 60 * 1000; // 24-hour token expiration lifetime

function getServerSecret() {
  const secret = process.env.SERVER_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error("Security Configuration Error: SERVER_SECRET environment variable must be configured in production.");
    }
    return 'activa-dev-local-hmac-secret-key-32chars';
  }
  return secret;
}

export function createPendingToken(execId, basePendingId, actionId, proposedAction) {
  const secret = getServerSecret();
  // Privacy Optimization: Store only essential execution routing fields in the token
  const payload = {
    execId,
    pendingId: basePendingId,
    actionId,
    proposedAction: proposedAction ? {
      toolName: proposedAction.toolName,
      description: proposedAction.description,
      reason: proposedAction.reason,
      params: proposedAction.params || {}
    } : null,
    ts: Date.now()
  };

  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const hmac = crypto.createHmac('sha256', secret).update(payloadB64).digest('hex');
  return `${basePendingId}.${payloadB64}.${hmac}`;
}

export function parseAndVerifyPendingToken(token) {
  if (!token || typeof token !== 'string' || !token.startsWith('pending-')) {
    return null;
  }

  let basePendingId, payloadB64, signature;

  if (token.includes('.')) {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    [basePendingId, payloadB64, signature] = parts;
  } else if (token.includes('_')) {
    const firstUnderscore = token.indexOf('_');
    const lastUnderscore = token.lastIndexOf('_');
    if (firstUnderscore === -1 || lastUnderscore === -1 || firstUnderscore === lastUnderscore) {
      return null;
    }
    basePendingId = token.substring(0, firstUnderscore);
    payloadB64 = token.substring(firstUnderscore + 1, lastUnderscore);
    signature = token.substring(lastUnderscore + 1);
  } else {
    return null;
  }

  if (!basePendingId || !payloadB64 || !signature) {
    return null;
  }

  const secret = getServerSecret();
  const expectedHmac = crypto.createHmac('sha256', secret).update(payloadB64).digest('hex');

  if (signature.length !== expectedHmac.length) {
    return null;
  }

  try {
    const isMatch = crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedHmac));
    if (!isMatch) return null;

    const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf-8'));

    // Verify token expiration (24 hours)
    if (payload.ts && (Date.now() - payload.ts > TOKEN_TTL_MS)) {
      console.warn('[Security] Pending approval token has expired.');
      return null;
    }

    // Verify proposed tool against TOOL_REGISTRY allowlist
    if (payload.proposedAction && payload.proposedAction.toolName) {
      if (!TOOL_REGISTRY[payload.proposedAction.toolName]) {
        console.warn(`[Security] Untrusted tool '${payload.proposedAction.toolName}' rejected by TOOL_REGISTRY allowlist.`);
        return null;
      }
    }

    return payload;
  } catch (err) {
    return null;
  }
}

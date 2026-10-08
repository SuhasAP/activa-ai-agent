import { executeTool, TOOL_REGISTRY, PERMISSION_LEVELS } from '../tools/toolRegistry.js';

/**
 * Executes a list of read-only/low-risk tools to gather live system context
 */
export async function executeContextTools(toolNames = []) {
  const results = {};
  
  for (const name of toolNames) {
    const toolMeta = TOOL_REGISTRY[name];
    // Only execute READ_ONLY and LOW_RISK tools automatically during context gathering
    if (toolMeta && toolMeta.permission !== PERMISSION_LEVELS.APPROVAL_REQUIRED) {
      try {
        const res = await executeTool(name);
        if (res.success) {
          results[name] = res.result;
        }
      } catch (err) {
        console.error(`Error executing tool ${name}:`, err);
      }
    }
  }

  return results;
}

/**
 * Executes an approved action
 */
export async function executeApprovedAction(toolName, params) {
  const result = await executeTool(toolName, params);
  return result;
}

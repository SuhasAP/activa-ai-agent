export function errorHandler(err, req, res, next) {
  console.error('[ACTIVA Server Error]:', err?.message || err);

  const status = err.status || 500;
  let message = err.message || 'Internal Server Error';

  // Sanitize message to prevent leaking process paths or internal API keys
  if (message.includes('GEMINI_API_KEY') || message.includes('API_KEY')) {
    message = "AI Service Configuration Notice: Check server environment.";
  }

  // Remove machine directory paths if present in error message
  message = message.replace(/([A-Z]:\\[^:\n]+|\/[^:\n]+)/g, '[internal path]');

  res.status(status).json({
    error: true,
    message,
    status
  });
}

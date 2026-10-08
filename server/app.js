import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import agentRoutes from './routes/agentRoutes.js';
import executionRoutes from './routes/executionRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import calendarRoutes from './routes/calendarRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';
import reminderRoutes from './routes/reminderRoutes.js';
import noteRoutes from './routes/noteRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware & Security Headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

app.use(cors());
app.use(express.json({ limit: "100kb" }));

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'ACTIVA Agent Orchestrator',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/agent', agentRoutes);
app.use('/api/executions', executionRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/reminders', reminderRoutes);
app.use('/api/notes', noteRoutes);

// Static client production build serving
const clientDistPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientDistPath));

// SPA Fallback: serve index.html for unknown non-API routes
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(clientDistPath, 'index.html'), (err) => {
    if (err) {
      // In development if dist isn't built yet, output a helpful status message
      res.status(200).send(`
        <!DOCTYPE html>
        <html>
          <head><title>ACTIVA - Server Running</title></head>
          <body style="font-family: system-ui; padding: 40px; background: #0f172a; color: white;">
            <h2>ACTIVA Express Server Running</h2>
            <p>API is active. Build the frontend via <code>npm run build</code> to serve the single production app.</p>
          </body>
        </html>
      `);
    }
  });
});

// Central Error Handler
app.use(errorHandler);

export default app;

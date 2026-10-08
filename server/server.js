import dotenv from 'dotenv';
dotenv.config();
import app from './app.js';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`  ACTIVA - From Intent to Action`);
  console.log(`  Autonomous Agent Backend Server Running`);
  console.log(`  Port: http://localhost:${PORT}`);
  console.log(`  Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`==================================================`);
});

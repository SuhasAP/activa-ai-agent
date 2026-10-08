import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import DashboardPage from './pages/DashboardPage';
import TasksPage from './pages/TasksPage';
import CalendarPage from './pages/CalendarPage';
import ExpensesPage from './pages/ExpensesPage';
import RemindersPage from './pages/RemindersPage';

export default function App() {
  const handleResetData = () => {
    window.location.reload();
  };

  return (
    <Router>
      <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans">
        <Navbar onResetData={handleResetData} />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/expenses" element={<ExpensesPage />} />
            <Route path="/reminders" element={<RemindersPage />} />
          </Routes>
        </main>
        <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500 glass-panel">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-2 font-mono">
            <span>ACTIVA • AI-Powered Personal Autonomous Agent</span>
            <span>Google PromptWars Hackathon Submission</span>
          </div>
        </footer>
      </div>
    </Router>
  );
}

import React, { useState, useEffect } from 'react';
import { CheckSquare, Plus, Filter, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { api } from '../services/api';

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [filterPriority, setFilterPriority] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', dueDate: '', priority: 'MEDIUM' });

  const loadTasks = async () => {
    try {
      const data = await api.getTasks();
      setTasks(data || []);
    } catch (err) {
      console.error("Failed to load tasks", err);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleToggleComplete = async (task) => {
    try {
      await api.updateTask(task.id, { completed: !task.completed });
      loadTasks();
    } catch (err) {
      alert("Failed to update task status");
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;
    try {
      await api.createTask(newTask);
      setNewTask({ title: '', description: '', dueDate: '', priority: 'MEDIUM' });
      setIsModalOpen(false);
      loadTasks();
    } catch (err) {
      alert("Failed to create task");
    }
  };

  const filteredTasks = tasks.filter(t => filterPriority === 'ALL' || t.priority === filterPriority);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <CheckSquare className="w-6 h-6 text-cyan-400" />
            <h1 className="text-2xl font-extrabold text-white font-sans">Tasks & Academic Deadlines</h1>
          </div>
          <p className="text-sm text-slate-400">Manage assignment deadlines and priority work items.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-md shadow-indigo-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-6">
        <Filter className="w-4 h-4 text-slate-500" />
        <span className="text-xs font-semibold text-slate-400 mr-2">Filter Priority:</span>
        {['ALL', 'HIGH', 'MEDIUM', 'LOW'].map(p => (
          <button
            key={p}
            onClick={() => setFilterPriority(p)}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
              filterPriority === p
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Task List */}
      <div className="grid grid-cols-1 gap-3">
        {filteredTasks.map(task => {
          const isHigh = task.priority === 'HIGH';
          return (
            <div
              key={task.id}
              className={`glass-card rounded-xl p-5 border transition flex items-center justify-between ${
                task.completed ? 'opacity-60 border-slate-800' : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start gap-4">
                <button
                  onClick={() => handleToggleComplete(task)}
                  className={`mt-1 w-5 h-5 rounded-md flex items-center justify-center border transition ${
                    task.completed
                      ? 'bg-emerald-500 border-emerald-500 text-slate-950'
                      : 'border-slate-600 hover:border-cyan-400 bg-slate-900'
                  }`}
                >
                  {task.completed && <CheckCircle className="w-4 h-4 fill-emerald-400 text-slate-950" />}
                </button>

                <div>
                  <h3 className={`text-sm font-bold ${task.completed ? 'line-through text-slate-400' : 'text-white'}`}>
                    {task.title}
                  </h3>
                  {task.description && (
                    <p className="text-xs text-slate-400 mt-1">{task.description}</p>
                  )}
                  <div className="flex items-center gap-4 mt-2 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Due: {task.dueDateLabel || task.dueDate}</span>
                    </span>
                  </div>
                </div>
              </div>

              <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded uppercase tracking-wider ${
                isHigh ? 'bg-red-950/80 text-red-400 border border-red-800' : 'bg-indigo-950/80 text-indigo-300 border border-indigo-800'
              }`}>
                {task.priority}
              </span>
            </div>
          );
        })}
      </div>

      {/* Modal for creating task */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="glass-card rounded-2xl p-6 border border-slate-700 max-w-md w-full">
            <h3 className="text-lg font-bold text-white mb-4">Add New Task</h3>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={newTask.title}
                  onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                  placeholder="e.g. DBMS Assignment 4"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                <textarea
                  value={newTask.description}
                  onChange={e => setNewTask({ ...newTask, description: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                  placeholder="Task details..."
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Priority</label>
                  <select
                    value={newTask.priority}
                    onChange={e => setNewTask({ ...newTask, priority: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="HIGH">HIGH</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="LOW">LOW</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={newTask.dueDate}
                    onChange={e => setNewTask({ ...newTask, dueDate: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

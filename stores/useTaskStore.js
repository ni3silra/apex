'use client';
import { create } from 'zustand';
import { nanoid } from 'nanoid';
import { saveData, loadData } from '@/lib/storage';

const useTaskStore = create((set, get) => ({
  tasks: [],
  contacts: [],
  tags: [],
  isLoaded: false,

  // ─── Initialization ─────────────────────────────────────────
  loadFromStorage: async () => {
    const tasks = (await loadData('tasks')) || [];
    const contacts = (await loadData('contacts')) || [];
    const tags = (await loadData('tags')) || [];
    set({ tasks, contacts, tags, isLoaded: true });
  },

  persist: async () => {
    const { tasks, contacts, tags } = get();
    await saveData('tasks', tasks);
    await saveData('contacts', contacts);
    await saveData('tags', tags);
  },

  generateDummyData: () => {
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 86400000);
    const lastWeek = new Date(now.getTime() - 86400000 * 7);
    const yesterday = new Date(now.getTime() - 86400000);
    
    const impacts = ['Very High', 'High', 'Medium', 'Low'];
    const rImpact = () => impacts[Math.floor(Math.random() * impacts.length)];
    
    const dummyTasks = [
      { id: nanoid(), title: 'Prepare Q3 Board Deck', description: 'Include financial projections.', quadrant: 'q1', status: 'not_started', deadline: tomorrow.toISOString(), tags: ['presentation', 'finance'], focusTime: 25, priorityScore: 90, impact: 'Very High', createdAt: lastWeek.toISOString() },
      { id: nanoid(), title: 'Review Security Audit', description: 'Address critical vulnerabilities.', quadrant: 'q1', status: 'in_progress', deadline: yesterday.toISOString(), tags: ['security', 'engineering'], focusTime: 50, priorityScore: 95, impact: 'Very High', createdAt: lastWeek.toISOString() },
      { id: nanoid(), title: 'Finalize Hiring Plan', description: 'Need 3 more senior engineers.', quadrant: 'q2', status: 'not_started', deadline: new Date(now.getTime() + 86400000 * 3).toISOString(), tags: ['hr', 'planning'], focusTime: 0, priorityScore: 70, impact: 'High', createdAt: yesterday.toISOString() },
      { id: nanoid(), title: 'Update Onboarding Docs', description: '', quadrant: 'q2', status: 'not_started', deadline: null, tags: ['hr', 'docs'], focusTime: 0, priorityScore: 60, impact: 'Medium', createdAt: lastWeek.toISOString() },
      { id: nanoid(), title: 'Client Feedback Meeting', description: 'Discuss the latest release.', quadrant: 'q3', status: 'not_started', deadline: tomorrow.toISOString(), tags: ['client', 'feedback'], focusTime: 0, priorityScore: 40, impact: 'Medium', createdAt: now.toISOString() },
      { id: nanoid(), title: 'Approve Expense Reports', description: '', quadrant: 'q3', status: 'in_progress', deadline: null, tags: ['finance', 'admin'], focusTime: 10, priorityScore: 30, impact: 'Low', createdAt: yesterday.toISOString() },
      { id: nanoid(), title: 'Read Industry Newsletter', description: '', quadrant: 'q4', status: 'not_started', deadline: null, tags: ['learning'], focusTime: 0, priorityScore: 10, impact: 'Low', createdAt: lastWeek.toISOString() },
      { id: nanoid(), title: 'Organize Desktop Folders', description: '', quadrant: 'q4', status: 'not_started', deadline: null, tags: ['admin'], focusTime: 0, priorityScore: 5, impact: 'Low', createdAt: lastWeek.toISOString() },
      { id: nanoid(), title: 'Fix Auth Token Bug', description: 'Token expires too early.', quadrant: 'q1', status: 'done', deadline: yesterday.toISOString(), tags: ['engineering', 'bug'], focusTime: 45, priorityScore: 90, impact: 'Very High', createdAt: lastWeek.toISOString(), completedAt: yesterday.toISOString() },
      { id: nanoid(), title: 'Deploy v2.1.0', description: 'Release to production.', quadrant: 'q1', status: 'done', deadline: lastWeek.toISOString(), tags: ['engineering', 'release'], focusTime: 120, priorityScore: 95, impact: 'High', createdAt: new Date(lastWeek.getTime() - 86400000*2).toISOString(), completedAt: lastWeek.toISOString() },
    ];
    
    set({ tasks: dummyTasks });
    setTimeout(() => get().persist(), 0);
  },

  clearAllData: () => {
    set({ tasks: [], contacts: [], tags: [] });
    setTimeout(() => get().persist(), 0);
  },

  // ─── Task CRUD ──────────────────────────────────────────────
  addTask: (taskData) => {
    const task = {
      id: nanoid(),
      title: taskData.title || 'Untitled',
      description: taskData.description || '',
      quadrant: taskData.quadrant || 'q2',
      status: taskData.status || 'not_started',
      deadline: taskData.deadline || null,
      impact: taskData.impact || 'Medium',
      contacts: taskData.contacts || [],
      tags: taskData.tags || [],
      notes: taskData.notes || [],
      attachments: taskData.attachments || [],
      focusTime: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set(s => ({ tasks: [...s.tasks, task] }));
    setTimeout(() => get().persist(), 0);
    return task;
  },

  updateTask: (id, data) => {
    set(s => ({
      tasks: s.tasks.map(t =>
        t.id === id ? { ...t, ...data, updatedAt: new Date().toISOString() } : t
      ),
    }));
    setTimeout(() => get().persist(), 0);
  },

  deleteTask: (id) => {
    set(s => ({ tasks: s.tasks.filter(t => t.id !== id) }));
    setTimeout(() => get().persist(), 0);
  },

  moveToQuadrant: (id, quadrant) => {
    get().updateTask(id, { quadrant });
  },

  toggleDone: (id) => {
    const task = get().tasks.find(t => t.id === id);
    if (task) {
      get().updateTask(id, {
        status: task.status === 'done' ? 'not_started' : 'done',
        completedAt: task.status !== 'done' ? new Date().toISOString() : null,
      });
    }
  },

  // ─── Notes ──────────────────────────────────────────────────
  addNote: (taskId, content) => {
    const note = { id: nanoid(), content, createdAt: new Date().toISOString() };
    const task = get().tasks.find(t => t.id === taskId);
    if (task) {
      get().updateTask(taskId, { notes: [...(task.notes || []), note] });
    }
  },

  deleteNote: (taskId, noteId) => {
    const task = get().tasks.find(t => t.id === taskId);
    if (task) {
      get().updateTask(taskId, { notes: task.notes.filter(n => n.id !== noteId) });
    }
  },

  // ─── Attachments ────────────────────────────────────────────
  addAttachment: (taskId, attachment) => {
    const att = { id: nanoid(), ...attachment, createdAt: new Date().toISOString() };
    const task = get().tasks.find(t => t.id === taskId);
    if (task) {
      get().updateTask(taskId, { attachments: [...(task.attachments || []), att] });
    }
  },

  removeAttachment: (taskId, attachmentId) => {
    const task = get().tasks.find(t => t.id === taskId);
    if (task) {
      get().updateTask(taskId, { attachments: task.attachments.filter(a => a.id !== attachmentId) });
    }
  },

  // ─── Contacts (global) ─────────────────────────────────────
  addContact: (contact) => {
    const c = { id: nanoid(), ...contact };
    set(s => ({ contacts: [...s.contacts, c] }));
    setTimeout(() => get().persist(), 0);
    return c;
  },

  removeContact: (contactId) => {
    set(s => ({ contacts: s.contacts.filter(c => c.id !== contactId) }));
    setTimeout(() => get().persist(), 0);
  },

  // ─── Tags (global) ─────────────────────────────────────────
  addTag: (label) => {
    const existing = get().tags.find(t => t.label === label);
    if (existing) return existing;
    const tag = { id: nanoid(), label };
    set(s => ({ tags: [...s.tags, tag] }));
    setTimeout(() => get().persist(), 0);
    return tag;
  },

  // ─── Selectors ──────────────────────────────────────────────
  getTasksByQuadrant: (quadrant) => get().tasks.filter(t => t.quadrant === quadrant),
  getActiveTasks: () => get().tasks.filter(t => t.status !== 'done'),
  getCompletedTasks: () => get().tasks.filter(t => t.status === 'done'),
  getOverdueTasks: () => get().tasks.filter(t => t.deadline && new Date(t.deadline) < new Date() && t.status !== 'done'),
  getDueTodayTasks: () => {
    const today = new Date();
    return get().tasks.filter(t => {
      if (!t.deadline || t.status === 'done') return false;
      const d = new Date(t.deadline);
      return d.toDateString() === today.toDateString();
    });
  },

  // ─── Import/Export ──────────────────────────────────────────
  importData: (data) => {
    if (data.tasks) set({ tasks: data.tasks, contacts: data.contacts || [], tags: data.tags || [] });
    setTimeout(() => get().persist(), 0);
  },

  exportData: () => {
    const { tasks, contacts, tags } = get();
    return { tasks, contacts, tags, exportedAt: new Date().toISOString() };
  },
}));

export default useTaskStore;

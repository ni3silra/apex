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

  // ─── Task CRUD ──────────────────────────────────────────────
  addTask: (taskData) => {
    const task = {
      id: nanoid(),
      title: taskData.title || 'Untitled',
      description: taskData.description || '',
      quadrant: taskData.quadrant || 'q2',
      status: taskData.status || 'not_started',
      deadline: taskData.deadline || null,
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

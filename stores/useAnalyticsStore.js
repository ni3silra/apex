'use client';
import { create } from 'zustand';
import { saveData, loadData } from '@/lib/storage';

const useAnalyticsStore = create((set, get) => ({
  dailyStats: [], // [{ date, completed, added, focusMinutes }]
  streakDays: 0,
  isLoaded: false,

  loadFromStorage: async () => {
    const analytics = (await loadData('analytics')) || {};
    set({
      dailyStats: analytics.dailyStats || [],
      streakDays: analytics.streakDays || 0,
      isLoaded: true,
    });
  },

  persist: async () => {
    const { dailyStats, streakDays } = get();
    await saveData('analytics', { dailyStats, streakDays });
  },

  recordCompletion: () => {
    const today = new Date().toISOString().split('T')[0];
    set(s => {
      const stats = [...s.dailyStats];
      const idx = stats.findIndex(d => d.date === today);
      if (idx >= 0) {
        stats[idx] = { ...stats[idx], completed: (stats[idx].completed || 0) + 1 };
      } else {
        stats.push({ date: today, completed: 1, added: 0, focusMinutes: 0 });
      }
      return { dailyStats: stats.slice(-90) }; // Keep 90 days
    });
    setTimeout(() => get().persist(), 0);
  },

  recordTaskAdded: () => {
    const today = new Date().toISOString().split('T')[0];
    set(s => {
      const stats = [...s.dailyStats];
      const idx = stats.findIndex(d => d.date === today);
      if (idx >= 0) {
        stats[idx] = { ...stats[idx], added: (stats[idx].added || 0) + 1 };
      } else {
        stats.push({ date: today, completed: 0, added: 1, focusMinutes: 0 });
      }
      return { dailyStats: stats.slice(-90) };
    });
    setTimeout(() => get().persist(), 0);
  },

  addFocusMinutes: (minutes) => {
    const today = new Date().toISOString().split('T')[0];
    set(s => {
      const stats = [...s.dailyStats];
      const idx = stats.findIndex(d => d.date === today);
      if (idx >= 0) {
        stats[idx] = { ...stats[idx], focusMinutes: (stats[idx].focusMinutes || 0) + minutes };
      } else {
        stats.push({ date: today, completed: 0, added: 0, focusMinutes: minutes });
      }
      return { dailyStats: stats.slice(-90) };
    });
    setTimeout(() => get().persist(), 0);
  },

  getThisWeekStats: () => {
    const stats = get().dailyStats;
    const now = new Date();
    const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
    return stats.filter(s => new Date(s.date) >= weekAgo);
  },

  getTotalCompleted: () => {
    return get().dailyStats.reduce((sum, d) => sum + (d.completed || 0), 0);
  },

  getWeeklyVelocity: () => {
    const week = get().getThisWeekStats();
    return week.reduce((sum, d) => sum + (d.completed || 0), 0);
  },
}));

export default useAnalyticsStore;

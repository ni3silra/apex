'use client';
import { create } from 'zustand';
import { saveData, loadData } from '@/lib/storage';

const useSettingsStore = create((set, get) => ({
  activeView: 'briefing',
  theme: 'dark',
  showQuickAdd: false,
  showCommandPalette: false,
  showShortcuts: false,
  showStorageSetup: false,
  storageReady: false,
  selectedTaskId: null,
  searchQuery: '',
  filterQuadrant: null,
  filterStatus: null,
  isLoaded: false,

  loadFromStorage: async () => {
    const settings = (await loadData('settings')) || {};
    set({
      activeView: settings.activeView || 'briefing',
      theme: settings.theme || 'dark',
      isLoaded: true,
    });
  },

  persist: async () => {
    const { activeView, theme } = get();
    await saveData('settings', { activeView, theme });
  },

  setView: (view) => {
    set({ activeView: view });
    setTimeout(() => get().persist(), 0);
  },
  setTheme: (theme) => {
    set({ theme });
    setTimeout(() => get().persist(), 0);
  },
  toggleQuickAdd: () => set(s => ({ showQuickAdd: !s.showQuickAdd })),
  toggleCommandPalette: () => set(s => ({ showCommandPalette: !s.showCommandPalette })),
  toggleShortcuts: () => set(s => ({ showShortcuts: !s.showShortcuts })),
  setStorageSetup: (show) => set({ showStorageSetup: show }),
  setStorageReady: (ready) => set({ storageReady: ready }),
  selectTask: (id) => set({ selectedTaskId: id }),
  clearSelection: () => set({ selectedTaskId: null }),
  setSearch: (query) => set({ searchQuery: query }),
  setFilterQuadrant: (q) => set({ filterQuadrant: q }),
  setFilterStatus: (s) => set({ filterStatus: s }),
}));

export default useSettingsStore;

'use client';
import { create } from 'zustand';
import { saveData, loadData } from '@/lib/storage';

const useSettingsStore = create((set, get) => ({
  userName: '',
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
  filterTag: null,
  hiddenTags: [],
  isLoaded: false,

  loadFromStorage: async () => {
    const settings = (await loadData('settings')) || {};
    set({
      userName: settings.userName || '',
      activeView: settings.activeView || 'briefing',
      theme: settings.theme || 'dark',
      hiddenTags: settings.hiddenTags || [],
      isLoaded: true,
    });
  },

  persist: async () => {
    const { userName, activeView, theme, hiddenTags } = get();
    await saveData('settings', { userName, activeView, theme, hiddenTags });
  },

  setUserName: (name) => {
    set({ userName: name });
    setTimeout(() => get().persist(), 0);
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
  setFilterTag: (t) => set({ filterTag: t }),
  hideTag: (t) => {
    set(s => ({ hiddenTags: [...s.hiddenTags, t] }));
    setTimeout(() => get().persist(), 0);
  },
}));

export default useSettingsStore;

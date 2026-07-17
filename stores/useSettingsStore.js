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
  storageProvider: 'local', // 'local' | 'gdrive' | 'onedrive'
  cloudFolderId: null, // ID of the folder in GDrive/OneDrive
  cloudToken: null, // Access token for the current provider
  googleClientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
  onedriveClientId: process.env.NEXT_PUBLIC_ONEDRIVE_CLIENT_ID || '',

  loadFromStorage: async () => {
    const settings = (await loadData('settings')) || {};
    set({
      userName: settings.userName || '',
      activeView: settings.activeView || 'briefing',
      theme: settings.theme || 'dark',
      hiddenTags: settings.hiddenTags || [],
      storageProvider: settings.storageProvider || 'local',
      cloudFolderId: settings.cloudFolderId || null,
      cloudToken: settings.cloudToken || null,
      googleClientId: settings.googleClientId || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
      onedriveClientId: settings.onedriveClientId || process.env.NEXT_PUBLIC_ONEDRIVE_CLIENT_ID || '',
      isLoaded: true,
    });
  },

  persist: async () => {
    const { userName, activeView, theme, hiddenTags, storageProvider, cloudFolderId, cloudToken, googleClientId, onedriveClientId } = get();
    await saveData('settings', { userName, activeView, theme, hiddenTags, storageProvider, cloudFolderId, cloudToken, googleClientId, onedriveClientId });
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
  setStorageProvider: (provider) => {
    set({ storageProvider: provider });
    setTimeout(() => get().persist(), 0);
  },
  setCloudFolderId: (id) => {
    set({ cloudFolderId: id });
    setTimeout(() => get().persist(), 0);
  },
  setCloudToken: (token) => {
    set({ cloudToken: token });
    setTimeout(() => get().persist(), 0);
  },
  setGoogleClientId: (id) => {
    set({ googleClientId: id });
    setTimeout(() => get().persist(), 0);
  },
  setOnedriveClientId: (id) => {
    set({ onedriveClientId: id });
    setTimeout(() => get().persist(), 0);
  },
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

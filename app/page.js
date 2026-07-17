'use client';
import { useEffect, useState } from 'react';
import useTaskStore from '@/stores/useTaskStore';
import useSettingsStore from '@/stores/useSettingsStore';
import useAnalyticsStore from '@/stores/useAnalyticsStore';
import useFocusStore from '@/stores/useFocusStore';
import { hasStorageSetup, getDirectory } from '@/lib/storage';
import Sidebar from '@/components/layout/Sidebar';
import TopBar from '@/components/layout/TopBar';
import ShortcutsOverlay from '@/components/layout/ShortcutsOverlay';
import DailyBriefing from '@/components/views/DailyBriefing';
import EisenhowerMatrix from '@/components/views/EisenhowerMatrix';
import PriorityQueue from '@/components/views/PriorityQueue';
import FocusMode from '@/components/views/FocusMode';
import Analytics from '@/components/views/Analytics';
import Guide from '@/components/views/Guide';
import TaskModal from '@/components/tasks/TaskModal';
import QuickAdd from '@/components/tasks/QuickAdd';
import CommandPalette from '@/components/shared/CommandPalette';
import StorageSetup from '@/components/shared/StorageSetup';

export default function Home() {
  const activeView = useSettingsStore(s => s.activeView);
  const theme = useSettingsStore(s => s.theme);
  const showQuickAdd = useSettingsStore(s => s.showQuickAdd);
  const showCommandPalette = useSettingsStore(s => s.showCommandPalette);
  const showShortcuts = useSettingsStore(s => s.showShortcuts);
  const showStorageSetup = useSettingsStore(s => s.showStorageSetup);
  const selectedTaskId = useSettingsStore(s => s.selectedTaskId);
  const setStorageReady = useSettingsStore(s => s.setStorageReady);
  const setStorageSetup = useSettingsStore(s => s.setStorageSetup);
  const focusIsActive = useFocusStore(s => s.isActive);
  const [ready, setReady] = useState(false);

  // Apply theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme || 'dark');
  }, [theme]);

  // Initialize app
  useEffect(() => {
    async function init() {
      await useTaskStore.getState().loadFromStorage();
      await useSettingsStore.getState().loadFromStorage();
      await useAnalyticsStore.getState().loadFromStorage();

      // Check if storage is set up
      const hasSetup = await hasStorageSetup();
      if (hasSetup) {
        const dir = await getDirectory();
        setStorageReady(!!dir);
      }
      setReady(true);
    }
    init();
  }, [setStorageReady]);

  // Global keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(e) {
      const tag = e.target.tagName;
      const isInput = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';

      // Ctrl+N: Quick add
      if (e.ctrlKey && e.key === 'n') {
        e.preventDefault();
        useSettingsStore.getState().toggleQuickAdd();
        return;
      }
      // Ctrl+K: Command palette
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        useSettingsStore.getState().toggleCommandPalette();
        return;
      }
      // Ctrl+Shift+F: Focus mode
      if (e.ctrlKey && e.shiftKey && e.key === 'F') {
        e.preventDefault();
        useSettingsStore.getState().setView('focus');
        return;
      }
      // Escape: Close modals
      if (e.key === 'Escape') {
        if (showQuickAdd) useSettingsStore.getState().toggleQuickAdd();
        else if (showCommandPalette) useSettingsStore.getState().toggleCommandPalette();
        else if (showShortcuts) useSettingsStore.getState().toggleShortcuts();
        else if (selectedTaskId) useSettingsStore.getState().clearSelection();
        return;
      }

      if (isInput) return;

      // ?: Show shortcuts
      if (e.key === '?') {
        useSettingsStore.getState().toggleShortcuts();
        return;
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showQuickAdd, showCommandPalette, showShortcuts, selectedTaskId]);

  // Focus mode timer
  useEffect(() => {
    const interval = setInterval(() => {
      const { isActive, isPaused } = useFocusStore.getState();
      if (isActive && !isPaused) {
        useFocusStore.getState().tick();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!ready) {
    return (
      <div style={{
        height: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--dark-navy)',
        color: 'var(--text-primary)',
        fontFamily: 'var(--font-display)',
        fontSize: '2rem',
        fontWeight: 800,
        letterSpacing: '-1px',
      }}>
        <span style={{
          background: 'linear-gradient(135deg, #00A3E0, #A855F7)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          APEX
        </span>
      </div>
    );
  }

  const renderView = () => {
    switch (activeView) {
      case 'briefing': return <DailyBriefing />;
      case 'matrix': return <EisenhowerMatrix />;
      case 'ranking': return <PriorityQueue />;
      case 'focus': return <FocusMode />;
      case 'analytics': return <Analytics />;
      case 'guide': return <Guide />;
      default: return <DailyBriefing />;
    }
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <TopBar />
        <div className="view-container">
          {renderView()}
        </div>
      </div>

      {/* Modals & Overlays */}
      {selectedTaskId && <TaskModal taskId={selectedTaskId} />}
      {showQuickAdd && <QuickAdd />}
      {showCommandPalette && <CommandPalette />}
      {showShortcuts && <ShortcutsOverlay />}
      {showStorageSetup && <StorageSetup />}
      {focusIsActive && activeView !== 'focus' && <FocusMode />}

      {/* FAB */}
      <button
        className="btn-fab"
        onClick={() => useSettingsStore.getState().toggleQuickAdd()}
        title="Quick Add (Ctrl+N)"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
      </button>
    </div>
  );
}

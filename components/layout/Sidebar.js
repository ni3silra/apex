'use client';
import useSettingsStore from '@/stores/useSettingsStore';
import useTaskStore from '@/stores/useTaskStore';
import { VIEWS, QUADRANTS } from '@/lib/constants';
import { hasStorageSetup } from '@/lib/storage';
import { LayoutDashboard, Grid2x2, Trophy, Target, BarChart3, HardDrive, Settings, Download, List } from 'lucide-react';
import { useEffect, useState } from 'react';

const ICON_MAP = { LayoutDashboard, Grid2x2, Trophy, Target, BarChart3, List };
const ICON_COLORS = {
  briefing: 'var(--primary)',
  matrix: 'var(--success)',
  ranking: 'var(--warning)',
  focus: 'var(--danger)',
  analytics: 'var(--db-bright-blue)'
};

export default function Sidebar() {
  const activeView = useSettingsStore(s => s.activeView);
  const setView = useSettingsStore(s => s.setView);
  const storageReady = useSettingsStore(s => s.storageReady);
  const setStorageSetup = useSettingsStore(s => s.setStorageSetup);
  const tasks = useTaskStore(s => s.tasks);

  const activeTasks = tasks.filter(t => t.status !== 'done');
  const completedTasks = tasks.filter(t => t.status === 'done');
  const overdueTasks = tasks.filter(t => t.deadline && new Date(t.deadline) < new Date() && t.status !== 'done');

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-header">
        <div>
          <div className="sidebar-logo">APEX</div>
          <div style={{ fontSize: '0.68rem', color: 'var(--neutral-500)', marginTop: '-2px', letterSpacing: '0.5px' }}>
            TASK COMMAND CENTER
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <div className="sidebar-section-title">Views</div>
        {Object.values(VIEWS).map(view => {
          const Icon = ICON_MAP[view.icon];
          const color = ICON_COLORS[view.id] || 'var(--text-secondary)';
          return (
            <button
              key={view.id}
              className={`sidebar-nav-item ${activeView === view.id ? 'active' : ''}`}
              onClick={() => setView(view.id)}
            >
              {Icon && <Icon size={18} style={{ color }} />}
              {view.label}
              <span className="sidebar-nav-shortcut">{view.shortcut}</span>
            </button>
          );
        })}

        <div className="sidebar-section-title" style={{ marginTop: 'var(--space-4)' }}>Quadrants</div>
        {Object.values(QUADRANTS).map(q => (
          <button
            key={q.id}
            className="sidebar-nav-item"
            onClick={() => {
              setView('matrix');
            }}
          >
            <div style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: q.color,
              flexShrink: 0,
            }} />
            {q.label}
            <span className="sidebar-nav-shortcut">
              {tasks.filter(t => t.quadrant === q.id && t.status !== 'done').length}
            </span>
          </button>
        ))}
      </nav>

      {/* Stats */}
      <div className="sidebar-stats">
        <div className="sidebar-stat">
          <span className="sidebar-stat-label">Active</span>
          <span className="sidebar-stat-value" style={{ color: 'var(--db-bright-blue)' }}>{activeTasks.length}</span>
        </div>
        <div className="sidebar-stat">
          <span className="sidebar-stat-label">Done</span>
          <span className="sidebar-stat-value" style={{ color: 'var(--f1-green)' }}>{completedTasks.length}</span>
        </div>
        <div className="sidebar-stat">
          <span className="sidebar-stat-label">Overdue</span>
          <span className="sidebar-stat-value" style={{ color: overdueTasks.length > 0 ? 'var(--f1-red)' : 'var(--neutral-500)' }}>
            {overdueTasks.length}
          </span>
        </div>
      </div>

      {/* Storage indicator */}
      <div className="sidebar-storage">
        <button
          className="storage-indicator"
          onClick={() => setStorageSetup(true)}
        >
          <div className={`storage-dot ${storageReady ? 'connected' : 'disconnected'}`} />
          <HardDrive size={14} />
          <span>{storageReady ? 'Local Storage Active' : 'Set Up Storage'}</span>
        </button>
      </div>
    </aside>
  );
}

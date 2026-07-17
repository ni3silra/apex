'use client';
import useSettingsStore from '@/stores/useSettingsStore';
import useTaskStore from '@/stores/useTaskStore';
import { VIEWS, QUADRANTS } from '@/lib/constants';
import { hasStorageSetup } from '@/lib/storage';
import { LayoutDashboard, Grid2x2, Trophy, Target, BarChart3, HardDrive, Settings, Download, List, X, BookOpen, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

const ICON_MAP = { LayoutDashboard, Grid2x2, Trophy, Target, BarChart3, List, BookOpen };
const ICON_COLORS = {
  briefing: 'var(--primary)',
  matrix: 'var(--success)',
  ranking: 'var(--warning)',
  focus: 'var(--danger)',
  analytics: 'var(--db-bright-blue)',
  guide: 'var(--neutral-400)'
};

export default function Sidebar() {
  const userName = useSettingsStore(s => s.userName);
  const activeView = useSettingsStore(s => s.activeView);
  const setView = useSettingsStore(s => s.setView);
  const storageReady = useSettingsStore(s => s.storageReady);
  const setStorageSetup = useSettingsStore(s => s.setStorageSetup);
  const filterTag = useSettingsStore(s => s.filterTag);
  const setFilterTag = useSettingsStore(s => s.setFilterTag);
  const hiddenTags = useSettingsStore(s => s.hiddenTags);
  const hideTag = useSettingsStore(s => s.hideTag);
  const tasks = useTaskStore(s => s.tasks);

  const activeTasks = tasks.filter(t => t.status !== 'done');
  const completedTasks = tasks.filter(t => t.status === 'done');
  const overdueTasks = tasks.filter(t => t.deadline && new Date(t.deadline) < new Date() && t.status !== 'done');

  const uniqueTags = Array.from(new Set(tasks.flatMap(t => t.tags || [])))
    .filter(t => !hiddenTags.includes(t))
    .sort();

  return (
    <>
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-header">
        <div>
          <div className="sidebar-logo">APEX</div>
          <div style={{ fontSize: '0.68rem', color: 'var(--neutral-500)', marginTop: '-2px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
            {userName ? `${userName}'s COMMAND CENTER` : 'TASK COMMAND CENTER'}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <div className="sidebar-section-title">Views</div>
        {Object.values(VIEWS).map(view => {
          if (view.id === 'guide') return null;
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
            </button>
          );
        })}
      </nav>

      {/* Tags */}
      <div className="sidebar-section-title" style={{ marginTop: 'var(--space-4)' }}>Tags</div>
      <div style={{ padding: '0 var(--space-2)', display: 'flex', flexDirection: 'column', gap: '2px', overflowY: 'auto' }}>
        {uniqueTags.map(tag => (
          <div
            key={tag}
            className={`sidebar-nav-item ${filterTag === tag ? 'active' : ''}`}
            style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              padding: 'var(--space-1) var(--space-3)',
              fontSize: '0.82rem',
              minHeight: '30px'
            }}
          >
            <div 
              style={{ flex: 1, display: 'flex', alignItems: 'center', cursor: 'pointer' }}
              onClick={() => {
                setFilterTag(filterTag === tag ? null : tag);
                if (activeView !== 'matrix') {
                  setView('matrix');
                }
              }}
            >
              <div style={{ color: 'var(--text-secondary)', marginRight: 'var(--space-2)' }}>#</div>
              {tag}
            </div>
            <button 
              className="btn-icon" 
              style={{ padding: 2, opacity: 0.5 }}
              onClick={(e) => { e.stopPropagation(); hideTag(tag); }}
              title="Hide tag from sidebar"
            >
              <X size={12} />
            </button>
          </div>
        ))}
        {uniqueTags.length === 0 && <div style={{ padding: 'var(--space-2) var(--space-4)', fontSize: '0.8rem', color: 'var(--neutral-500)', fontStyle: 'italic' }}>No tags yet</div>}
      </div>

      <div style={{ marginTop: 'auto' }}>
      </div>

      {/* Settings Button */}
      <div className="sidebar-storage">
        <button
          className="storage-indicator"
          onClick={() => setStorageSetup(true)}
        >
          <Settings size={14} />
          <span>Settings</span>
        </button>
      </div>
    </aside>

    {/* Mobile Bottom Navigation */}
    <nav className="mobile-bottom-nav">
      <button 
        className={`mobile-nav-item ${activeView === 'briefing' ? 'active' : ''}`}
        onClick={() => setView('briefing')}
      >
        <LayoutDashboard size={20} />
        <span>Home</span>
      </button>
      <button 
        className={`mobile-nav-item ${activeView === 'matrix' ? 'active' : ''}`}
        onClick={() => setView('matrix')}
      >
        <Grid2x2 size={20} />
        <span>Tasks</span>
      </button>
      <button 
        className={`mobile-nav-item ${activeView === 'analytics' ? 'active' : ''}`}
        onClick={() => setView('analytics')}
      >
        <BarChart3 size={20} />
        <span>Stats</span>
      </button>
    </nav>
    </>
  );
}

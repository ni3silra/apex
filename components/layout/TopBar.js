'use client';
import useSettingsStore from '@/stores/useSettingsStore';
import useTaskStore from '@/stores/useTaskStore';
import { Search, Command, Plus, Keyboard, Sun, Moon } from 'lucide-react';

export default function TopBar() {
  const searchQuery = useSettingsStore(s => s.searchQuery);
  const setSearch = useSettingsStore(s => s.setSearch);
  const toggleQuickAdd = useSettingsStore(s => s.toggleQuickAdd);
  const toggleCommandPalette = useSettingsStore(s => s.toggleCommandPalette);
  const toggleShortcuts = useSettingsStore(s => s.toggleShortcuts);

  const filterStatus = useSettingsStore(s => s.filterStatus);
  const setFilterStatus = useSettingsStore(s => s.setFilterStatus);
  const theme = useSettingsStore(s => s.theme);
  const setTheme = useSettingsStore(s => s.setTheme);
  const tasks = useTaskStore(s => s.tasks);

  const activeTasks = tasks.filter(t => t.status !== 'done');
  const doneTasks = tasks.filter(t => t.status === 'done');
  const overdueTasks = activeTasks.filter(t => t.deadline && new Date(t.deadline) < new Date());

  const handleFilter = (status) => {
    setFilterStatus(filterStatus === status ? null : status);
  };

  return (
    <div className="topbar">
      {/* Search */}
      <div className="topbar-search">
        <Search size={16} style={{ color: 'var(--neutral-500)', flexShrink: 0 }} />
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearch(e.target.value)}
        />
        <span className="topbar-search-hint">Ctrl+K</span>
      </div>

      {/* Status Filters */}
      <div style={{ display: 'flex', gap: 'var(--space-2)', marginLeft: 'auto', marginRight: 'var(--space-4)' }}>
        <button 
          className={`btn ${filterStatus === 'active' ? 'btn-primary' : 'btn-ghost'}`} 
          style={{ padding: '4px 10px', fontSize: '0.8rem', borderRadius: 'var(--radius-full)' }}
          onClick={() => handleFilter('active')}
        >
          Active ({activeTasks.length})
        </button>
        <button 
          className={`btn ${filterStatus === 'done' ? 'btn-primary' : 'btn-ghost'}`} 
          style={{ padding: '4px 10px', fontSize: '0.8rem', borderRadius: 'var(--radius-full)', color: filterStatus !== 'done' ? 'var(--success)' : '#fff' }}
          onClick={() => handleFilter('done')}
        >
          Done ({doneTasks.length})
        </button>
        {overdueTasks.length > 0 && (
          <button 
            className={`btn ${filterStatus === 'overdue' ? 'btn-danger' : 'btn-ghost'}`} 
            style={{ padding: '4px 10px', fontSize: '0.8rem', borderRadius: 'var(--radius-full)', color: filterStatus !== 'overdue' ? 'var(--danger)' : '#fff' }}
            onClick={() => handleFilter('overdue')}
          >
            Overdue ({overdueTasks.length})
          </button>
        )}
      </div>

      {/* Actions */}
      <div className="topbar-actions">
        <button className="btn-icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} title="Toggle Theme">
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <button className="btn-icon" onClick={toggleShortcuts} title="Keyboard shortcuts (?)">
          <Keyboard size={18} />
        </button>
        <button className="btn-icon" onClick={toggleCommandPalette} title="Command Palette (Ctrl+K)">
          <Command size={18} />
        </button>
        <button className="btn btn-primary" onClick={toggleQuickAdd}>
          <Plus size={16} />
          <span>New Task</span>
        </button>
      </div>
    </div>
  );
}

import { useState } from 'react';
import useSettingsStore from '@/stores/useSettingsStore';
import useTaskStore from '@/stores/useTaskStore';
import { Search, Command, Plus, Keyboard, Sun, Moon, BookOpen, Menu, X, Activity } from 'lucide-react';

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
  const setView = useSettingsStore(s => s.setView);
  const tasks = useTaskStore(s => s.tasks);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const activeTasks = tasks.filter(t => t.status !== 'done');
  const doneTasks = tasks.filter(t => t.status === 'done');
  const overdueTasks = activeTasks.filter(t => t.deadline && new Date(t.deadline) < new Date());

  const handleFilter = (status) => {
    setFilterStatus(filterStatus === status ? null : status);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="topbar">
      {/* Mobile Header (Only visible on small screens) */}
      <div className="topbar-mobile-header">
        <div className="topbar-logo" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--text-primary)' }}>
          <Activity size={20} style={{ color: 'var(--db-bright-blue)' }} />
          <span>Apex</span>
        </div>
        <button className="btn-icon mobile-menu-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Main Topbar Content */}
      <div className={`topbar-content ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        {/* Search */}
        <div className="topbar-search">
          <Search size={16} style={{ color: 'var(--neutral-500)', flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span className="topbar-search-hint desktop-only">Ctrl+K</span>
        </div>

        {/* Status Filters */}
        <div className="topbar-filters" style={{ display: 'flex', gap: 'var(--space-2)', marginLeft: 'auto', marginRight: 'var(--space-4)' }}>
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
          <button className="btn-icon" onClick={() => { setView('guide'); setIsMobileMenuOpen(false); }} title="Open Guide">
            <BookOpen size={18} />
          </button>
          <button className="btn-icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} title="Toggle Theme">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button className="btn-icon desktop-only" onClick={toggleShortcuts} title="Keyboard shortcuts (?)">
            <Keyboard size={18} />
          </button>
          <button className="btn-icon desktop-only" onClick={toggleCommandPalette} title="Command Palette (Ctrl+K)">
            <Command size={18} />
          </button>
          <button className="btn btn-primary" onClick={() => { toggleQuickAdd(); setIsMobileMenuOpen(false); }}>
            <Plus size={16} />
            <span>New Task</span>
          </button>
        </div>
      </div>
    </div>
  );
}

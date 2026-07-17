'use client';
import useSettingsStore from '@/stores/useSettingsStore';
import { Search, Command, Plus, Keyboard } from 'lucide-react';

export default function TopBar() {
  const searchQuery = useSettingsStore(s => s.searchQuery);
  const setSearch = useSettingsStore(s => s.setSearch);
  const toggleQuickAdd = useSettingsStore(s => s.toggleQuickAdd);
  const toggleCommandPalette = useSettingsStore(s => s.toggleCommandPalette);
  const toggleShortcuts = useSettingsStore(s => s.toggleShortcuts);

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

      {/* Actions */}
      <div className="topbar-actions">
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

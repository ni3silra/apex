'use client';
import useSettingsStore from '@/stores/useSettingsStore';
import { KEYBOARD_SHORTCUTS } from '@/lib/constants';
import { X } from 'lucide-react';
import { groupBy } from '@/lib/utils';

export default function ShortcutsOverlay() {
  const toggleShortcuts = useSettingsStore(s => s.toggleShortcuts);
  const grouped = groupBy(KEYBOARD_SHORTCUTS, 'category');

  return (
    <div className="shortcuts-overlay animate-fade-in" onClick={toggleShortcuts}>
      <div className="shortcuts-panel animate-slide-up" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-5)' }}>
          <h2>Keyboard Shortcuts</h2>
          <button className="btn-icon" onClick={toggleShortcuts}><X size={18} /></button>
        </div>
        {Object.entries(grouped).map(([category, shortcuts]) => (
          <div key={category} className="shortcut-category">
            <div className="shortcut-category-title">{category}</div>
            {shortcuts.map((s, i) => (
              <div key={i} className="shortcut-row">
                <span className="shortcut-action">{s.action}</span>
                <div className="shortcut-keys">
                  {s.keys.map((key, j) => (
                    <span key={j} className="shortcut-key">{key}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

'use client';
import { Command } from 'cmdk';
import useTaskStore from '@/stores/useTaskStore';
import useSettingsStore from '@/stores/useSettingsStore';
import { VIEWS, QUADRANTS } from '@/lib/constants';
import { motion } from 'framer-motion';
import {
  Search, LayoutDashboard, Grid2x2, Trophy, Target, BarChart3,
  Plus, CheckCircle, Trash2, ArrowRight,
} from 'lucide-react';

const VIEW_ICONS = { LayoutDashboard, Grid2x2, Trophy, Target, BarChart3 };

export default function CommandPalette() {
  const tasks = useTaskStore(s => s.tasks);
  const toggleCommandPalette = useSettingsStore(s => s.toggleCommandPalette);
  const setView = useSettingsStore(s => s.setView);
  const selectTask = useSettingsStore(s => s.selectTask);
  const toggleQuickAdd = useSettingsStore(s => s.toggleQuickAdd);

  const handleSelect = (callback) => {
    callback();
    toggleCommandPalette();
  };

  return (
    <div className="cmdk-overlay animate-fade-in" onClick={toggleCommandPalette}>
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        <Command label="Command Palette">
          <Command.Input placeholder="Search tasks, navigate, or run actions..." />
          <Command.List>
            <Command.Empty>No results found.</Command.Empty>

            {/* Actions */}
            <Command.Group heading="Actions">
              <Command.Item onSelect={() => handleSelect(() => { toggleCommandPalette(); toggleQuickAdd(); })}>
                <Plus size={16} style={{ color: 'var(--success)' }} />
                New Task
              </Command.Item>
            </Command.Group>

            {/* Navigation */}
            <Command.Group heading="Navigate">
              {Object.values(VIEWS).map(view => {
                const Icon = VIEW_ICONS[view.icon];
                return (
                  <Command.Item key={view.id} onSelect={() => handleSelect(() => setView(view.id))}>
                    {Icon && <Icon size={16} style={{ color: 'var(--db-bright-blue)' }} />}
                    {view.label}
                    <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--neutral-600)' }}>
                      {view.shortcut}
                    </span>
                  </Command.Item>
                );
              })}
            </Command.Group>

            {/* Tasks */}
            <Command.Group heading="Tasks">
              {tasks.filter(t => t.status !== 'done').slice(0, 15).map(task => (
                <Command.Item key={task.id} onSelect={() => handleSelect(() => selectTask(task.id))}>
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: QUADRANTS[task.quadrant]?.color,
                    flexShrink: 0,
                  }} />
                  <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {task.title}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--neutral-500)' }}>
                    {QUADRANTS[task.quadrant]?.label}
                  </span>
                </Command.Item>
              ))}
            </Command.Group>
          </Command.List>
        </Command>
      </motion.div>
    </div>
  );
}

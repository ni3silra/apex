'use client';
import { useMemo } from 'react';
import useTaskStore from '@/stores/useTaskStore';
import useSettingsStore from '@/stores/useSettingsStore';
import { rankTasks, getPriorityColor } from '@/lib/priorities';
import { getDeadlineStatus } from '@/lib/utils';
import { QUADRANTS } from '@/lib/constants';
import { motion, AnimatePresence } from 'framer-motion';
import { List, Clock, MessageSquare, Paperclip, Users, ChevronRight } from 'lucide-react';

export default function PriorityQueue() {
  const tasks = useTaskStore(s => s.tasks);
  const selectTask = useSettingsStore(s => s.selectTask);
  const searchQuery = useSettingsStore(s => s.searchQuery);

  const ranked = useMemo(() => {
    let r = rankTasks(tasks);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      r = r.filter(t =>
        t.title.toLowerCase().includes(q) ||
        t.tags?.some(tag => tag.toLowerCase().includes(q))
      );
    }
    return r;
  }, [tasks, searchQuery]);

  return (
    <div className="priority-queue">
      <motion.div
        className="queue-header"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: 'var(--space-6)', padding: 'var(--space-4) 0', borderBottom: '1px solid var(--border-subtle)' }}
      >
        <h2 style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', margin: 0, fontSize: '1.4rem' }}>
          <List size={24} style={{ color: 'var(--primary)' }} />
          Priority Queue
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: 'var(--space-2)' }}>
          {ranked.length} active tasks prioritized by algorithm
        </p>
      </motion.div>

      <div className="queue-list" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        <AnimatePresence>
          {ranked.map((task, index) => {
            const quadrant = QUADRANTS[task.quadrant];
            const deadline = getDeadlineStatus(task.deadline);
            const priorityColor = getPriorityColor(task.priorityScore);

            return (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, delay: Math.min(index * 0.05, 0.5) }}
                className="queue-row"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'var(--surface)',
                  padding: 'var(--space-4)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  gap: 'var(--space-4)',
                  borderLeft: `4px solid ${priorityColor}`
                }}
                onClick={() => selectTask(task.id)}
                whileHover={{ scale: 1.01, background: 'var(--surface-hover)' }}
              >
                {/* Index / Score Indicator */}
                <div style={{ width: '40px', textAlign: 'center', color: 'var(--text-muted)', fontWeight: 500, fontSize: '1.2rem' }}>
                  {index + 1}
                </div>

                {/* Task Info */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ fontWeight: 600, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                    {task.title}
                  </div>
                  <div style={{ display: 'flex', gap: 'var(--space-4)', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                    <span style={{ color: quadrant.color }}>
                      {quadrant.label}
                    </span>
                    {task.deadline && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: deadline.color }}>
                        <Clock size={14} />
                        {deadline.label}
                      </span>
                    )}
                    {(task.notes?.length > 0 || task.attachments?.length > 0 || task.contacts?.length > 0) && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                        {task.notes?.length > 0 && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MessageSquare size={14} /> {task.notes.length}</span>}
                        {task.attachments?.length > 0 && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Paperclip size={14} /> {task.attachments.length}</span>}
                        {task.contacts?.length > 0 && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Users size={14} /> {task.contacts.length}</span>}
                      </span>
                    )}
                  </div>
                </div>

                {/* Priority Score Bubble */}
                <div style={{
                  background: 'var(--surface-elevated)',
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: priorityColor,
                  border: `1px solid ${priorityColor}40`
                }}>
                  {task.priorityScore}
                </div>

                <ChevronRight size={20} style={{ color: 'var(--text-muted)' }} />
              </motion.div>
            );
          })}
        </AnimatePresence>

        {ranked.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              textAlign: 'center',
              padding: 'var(--space-12)',
              color: 'var(--neutral-500)',
            }}
          >
            <List size={48} style={{ marginBottom: 'var(--space-4)', opacity: 0.3 }} />
            <p>No active tasks in the queue. Add some with Ctrl+N!</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

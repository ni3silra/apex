'use client';
import { useMemo } from 'react';
import useTaskStore from '@/stores/useTaskStore';
import useSettingsStore from '@/stores/useSettingsStore';
import { rankTasks, getSectorColor, getPositionStyle } from '@/lib/priorities';
import { getDeadlineStatus, formatGap } from '@/lib/utils';
import { QUADRANTS } from '@/lib/constants';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Clock, MessageSquare, Paperclip, Users } from 'lucide-react';

export default function F1Dashboard() {
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
    <div className="f1-dashboard">
      <motion.div
        className="f1-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2>
          <Trophy size={24} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8, color: 'var(--f1-yellow)' }} />
          Priority Standings
        </h2>
        <p>{ranked.length} active tasks ranked by priority score</p>
      </motion.div>

      <div className="f1-tower">
        <AnimatePresence>
          {ranked.map((task, index) => {
            const position = index + 1;
            const posStyle = getPositionStyle(position);
            const sectorColor = getSectorColor(task.priorityScore);
            const quadrant = QUADRANTS[task.quadrant];
            const deadline = getDeadlineStatus(task.deadline);
            const maxScore = ranked[0]?.priorityScore || 1;
            const barWidth = Math.max(10, (task.priorityScore / maxScore) * 100);

            return (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3, delay: index * 0.03 }}
                className={`f1-rank-row ${position <= 3 ? 'podium' : ''}`}
                style={{ borderLeftColor: position <= 3 ? posStyle.color : undefined }}
                onClick={() => selectTask(task.id)}
              >
                {/* Position */}
                <div className={`f1-position ${position <= 3 ? `p${position}` : 'other'}`}>
                  {posStyle.label}
                </div>

                {/* Task Info */}
                <div className="f1-task-info">
                  <div className="f1-task-title">{task.title}</div>
                  <div className="f1-task-meta">
                    <span style={{ color: quadrant.color }}>
                      {quadrant.label}
                    </span>
                    {task.deadline && (
                      <span style={{ color: deadline.color }}>
                        <Clock size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 2 }} />
                        {deadline.label}
                      </span>
                    )}
                    {task.notes?.length > 0 && (
                      <span><MessageSquare size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 2 }} />{task.notes.length}</span>
                    )}
                    {task.attachments?.length > 0 && (
                      <span><Paperclip size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 2 }} />{task.attachments.length}</span>
                    )}
                    {task.contacts?.length > 0 && (
                      <span><Users size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 2 }} />{task.contacts.length}</span>
                    )}
                  </div>
                </div>

                {/* Sector Bar */}
                <div className="f1-sector-bar">
                  <div
                    className="f1-sector-fill"
                    style={{ width: `${barWidth}%`, background: sectorColor }}
                  />
                </div>

                {/* Gap */}
                <div className="f1-gap" style={{ color: deadline.color }}>
                  {task.deadline ? formatGap(task.deadline) : '--'}
                </div>

                {/* Score */}
                <div className="f1-score">{task.priorityScore}pts</div>
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
            <Trophy size={48} style={{ marginBottom: 'var(--space-4)', opacity: 0.3 }} />
            <p>No active tasks to rank. Add some with Ctrl+N!</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

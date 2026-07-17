'use client';
import { useMemo } from 'react';
import useTaskStore from '@/stores/useTaskStore';
import useSettingsStore from '@/stores/useSettingsStore';
import useAnalyticsStore from '@/stores/useAnalyticsStore';
import { rankTasks } from '@/lib/priorities';
import { getDeadlineStatus, getGreeting, formatGap } from '@/lib/utils';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { AlertTriangle, Clock, CheckCircle2, Zap, ArrowRight, Target, TrendingUp, Flame } from 'lucide-react';
import TaskCard from '@/components/tasks/TaskCard';

export default function DailyBriefing() {
  const tasks = useTaskStore(s => s.tasks);
  const setView = useSettingsStore(s => s.setView);
  const selectTask = useSettingsStore(s => s.selectTask);
  const analytics = useAnalyticsStore(s => s.dailyStats);
  const userName = useSettingsStore(s => s.userName);

  const activeTasks = tasks.filter(t => t.status !== 'done');
  const overdueTasks = tasks.filter(t => {
    if (!t.deadline || t.status === 'done') return false;
    return new Date(t.deadline) < new Date();
  });
  const dueTodayTasks = tasks.filter(t => {
    if (!t.deadline || t.status === 'done') return false;
    return new Date(t.deadline).toDateString() === new Date().toDateString();
  });

  const ranked = useMemo(() => rankTasks(tasks), [tasks]);
  const p1Task = ranked[0];
  const nextUp = ranked.slice(1, 4);

  const weekStats = useMemo(() => {
    const now = new Date();
    const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
    return analytics.filter(s => new Date(s.date) >= weekAgo);
  }, [analytics]);
  const weeklyCompleted = weekStats.reduce((sum, d) => sum + (d.completed || 0), 0);
  const weeklyTotal = weeklyCompleted + activeTasks.length;
  const velocity = weeklyTotal > 0 ? Math.round((weeklyCompleted / Math.max(weeklyTotal, 1)) * 100) : 0;

  return (
    <div className="briefing">
      {/* Greeting */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="briefing-greeting">
          {getGreeting()}, <span>{userName || 'Team'}</span>
        </h1>
        <p className="briefing-date">{format(new Date(), 'EEEE, MMMM d, yyyy')}</p>
      </motion.div>

      {/* Stats Row */}
      <motion.div
        className="briefing-stats"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="briefing-stat-card" onClick={() => setView('matrix')} style={{ cursor: 'pointer' }}>
          <div className="briefing-stat-value" style={{ color: 'var(--danger)' }}>{overdueTasks.length}</div>
          <div className="briefing-stat-label">
            <AlertTriangle size={13} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
            Overdue
          </div>
        </div>
        <div className="briefing-stat-card" onClick={() => setView('matrix')} style={{ cursor: 'pointer' }}>
          <div className="briefing-stat-value" style={{ color: 'var(--warning)' }}>{dueTodayTasks.length}</div>
          <div className="briefing-stat-label">
            <Clock size={13} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
            Due Today
          </div>
        </div>
        <div className="briefing-stat-card">
          <div className="briefing-stat-value" style={{ color: 'var(--db-bright-blue)' }}>{activeTasks.length}</div>
          <div className="briefing-stat-label">
            <Flame size={13} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
            Active Tasks
          </div>
        </div>
      </motion.div>

      {/* P1 Task */}
      {p1Task && (
        <motion.div
          className="briefing-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="briefing-section-title">
            <Zap size={16} style={{ color: 'var(--danger)' }} />
            TOP PRIORITY
          </div>
          <div className="briefing-p1-card" onClick={() => selectTask(p1Task.id)} style={{ cursor: 'pointer' }}>
            <div className="briefing-p1-title">{p1Task.title}</div>
            <div className="briefing-p1-meta">
              {p1Task.deadline && (
                <span style={{ color: getDeadlineStatus(p1Task.deadline).color }}>
                  <Clock size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                  {getDeadlineStatus(p1Task.deadline).label}
                </span>
              )}
              {p1Task.contacts?.length > 0 && (
                <span>
                  {p1Task.contacts.map(c => c.name).join(', ')}
                </span>
              )}
              {p1Task.tags?.length > 0 && (
                <span>
                  {p1Task.tags.map(t => `#${t}`).join(' ')}
                </span>
              )}
            </div>
            <div className="briefing-p1-actions">
              <button className="btn btn-primary" onClick={(e) => {
                e.stopPropagation();
                useFocusStore && useSettingsStore.getState().setView('focus');
              }}>
                <Target size={14} /> Start Focus Session
              </button>
              <button className="btn btn-ghost" onClick={(e) => {
                e.stopPropagation();
                useTaskStore.getState().toggleDone(p1Task.id);
              }}>
                <CheckCircle2 size={14} /> Mark Done
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {!p1Task && (
        <motion.div
          className="briefing-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div
            className="briefing-p1-card"
            style={{ borderColor: 'var(--success)', textAlign: 'center', padding: 'var(--space-8)' }}
          >
            <CheckCircle2 size={48} style={{ color: 'var(--success)', marginBottom: 'var(--space-4)' }} />
            <div className="briefing-p1-title" style={{ color: 'var(--success)' }}>All Clear!</div>
            <p style={{ color: 'var(--text-secondary)' }}>No active tasks. Add one with Ctrl+N.</p>
          </div>
        </motion.div>
      )}

      {/* Next Up */}
      {nextUp.length > 0 && (
        <motion.div
          className="briefing-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="briefing-section-title">
            <ArrowRight size={16} />
            UPCOMING
          </div>
          <div className="briefing-next-up">
            {nextUp.map(task => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </motion.div>
      )}

      {/* Weekly Velocity */}
      <motion.div
        className="briefing-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="briefing-section-title">
          <TrendingUp size={16} />
          WEEKLY PROGRESS
        </div>
        <div className="briefing-velocity">
          <div className="velocity-stats-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontSize: '1.1rem', fontWeight: 600 }}>
              {weeklyCompleted} tasks completed
            </span>
            <span style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.5rem',
              fontWeight: 800,
              color: velocity > 70 ? 'var(--success)' : velocity > 40 ? 'var(--warning)' : 'var(--danger)',
            }}>
              {velocity}%
            </span>
          </div>
          <div className="briefing-velocity-bar">
            <div className="briefing-velocity-fill" style={{ width: `${velocity}%` }} />
          </div>
          <div className="briefing-velocity-text">
            <span>Velocity this week</span>
            <span>{weeklyCompleted}/{weeklyTotal} tasks</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

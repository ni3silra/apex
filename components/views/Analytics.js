'use client';
import { useMemo } from 'react';
import useTaskStore from '@/stores/useTaskStore';
import useAnalyticsStore from '@/stores/useAnalyticsStore';
import { QUADRANTS } from '@/lib/constants';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, CheckCircle2, Target, Clock, Flame } from 'lucide-react';

function MiniBarChart({ data, color, maxValue }) {
  const max = maxValue || Math.max(...data, 1);
  return (
    <div className="analytics-bar-chart">
      {data.map((value, i) => (
        <div
          key={i}
          className="analytics-bar"
          style={{
            height: `${Math.max(2, (value / max) * 100)}%`,
            background: color,
            opacity: i === data.length - 1 ? 1 : 0.4 + (i / data.length) * 0.6,
          }}
        />
      ))}
    </div>
  );
}

export default function Analytics() {
  const tasks = useTaskStore(s => s.tasks);
  const dailyStats = useAnalyticsStore(s => s.dailyStats);

  const totalCompleted = tasks.filter(t => t.status === 'done').length;
  const totalActive = tasks.filter(t => t.status !== 'done').length;
  const totalTasks = tasks.length;

  const overdueTasks = tasks.filter(t =>
    t.deadline && new Date(t.deadline) < new Date() && t.status !== 'done'
  ).length;

  const totalFocusMinutes = dailyStats.reduce((sum, d) => sum + (d.focusMinutes || 0), 0);

  // Quadrant distribution
  const quadrantDist = useMemo(() => {
    const dist = { q1: 0, q2: 0, q3: 0, q4: 0 };
    tasks.filter(t => t.status !== 'done').forEach(t => { dist[t.quadrant] = (dist[t.quadrant] || 0) + 1; });
    return dist;
  }, [tasks]);

  // Last 7 days completions
  const last7Days = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const stat = dailyStats.find(s => s.date === dateStr);
      days.push(stat?.completed || 0);
    }
    return days;
  }, [dailyStats]);

  // Last 7 days focus
  const last7DaysFocus = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const stat = dailyStats.find(s => s.date === dateStr);
      days.push(stat?.focusMinutes || 0);
    }
    return days;
  }, [dailyStats]);

  const completionRate = totalTasks > 0 ? Math.round((totalCompleted / totalTasks) * 100) : 0;

  return (
    <div className="analytics">
      <motion.div
        className="analytics-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2>
          <BarChart3 size={24} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8, color: 'var(--primary)' }} />
          Performance Analytics
        </h2>
      </motion.div>

      <div className="analytics-grid">
        {/* Completion Rate */}
        <motion.div
          className="analytics-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="analytics-card-title">
            <CheckCircle2 size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
            Completion Rate
          </div>
          <div className="analytics-big-number" style={{ color: completionRate > 70 ? 'var(--success)' : completionRate > 40 ? 'var(--warning)' : 'var(--danger)' }}>
            {completionRate}%
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: 'var(--space-2)' }}>
            {totalCompleted} of {totalTasks} tasks done
          </div>
        </motion.div>

        {/* Weekly Velocity */}
        <motion.div
          className="analytics-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="analytics-card-title">
            <TrendingUp size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
            7-Day Completions
          </div>
          <div className="analytics-big-number" style={{ color: 'var(--db-bright-blue)' }}>
            {last7Days.reduce((a, b) => a + b, 0)}
          </div>
          <MiniBarChart data={last7Days} color="var(--db-bright-blue)" />
        </motion.div>

        {/* Focus Time */}
        <motion.div
          className="analytics-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="analytics-card-title">
            <Target size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
            Focus Time (7 days)
          </div>
          <div className="analytics-big-number" style={{ color: 'var(--primary)' }}>
            {Math.round(last7DaysFocus.reduce((a, b) => a + b, 0))}m
          </div>
          <MiniBarChart data={last7DaysFocus} color="var(--primary)" />
        </motion.div>

        {/* Overdue */}
        <motion.div
          className="analytics-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <div className="analytics-card-title">
            <Clock size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
            Overdue Tasks
          </div>
          <div className="analytics-big-number" style={{ color: overdueTasks > 0 ? 'var(--danger)' : 'var(--success)' }}>
            {overdueTasks}
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: 'var(--space-2)' }}>
            {overdueTasks === 0 ? 'All clear! 🏁' : 'Needs attention'}
          </div>
        </motion.div>

        {/* Quadrant Distribution */}
        <motion.div
          className="analytics-card"
          style={{ gridColumn: 'span 2' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="analytics-card-title">
            <Flame size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
            Quadrant Distribution (Active Tasks)
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-4)', marginTop: 'var(--space-4)' }}>
            {Object.values(QUADRANTS).map(q => (
              <div key={q.id} style={{ textAlign: 'center' }}>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '2.2rem',
                  fontWeight: 800,
                  color: q.color,
                }}>
                  {quadrantDist[q.id]}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: 'var(--space-1)' }}>
                  {q.label}
                </div>
                <div style={{
                  height: 4,
                  background: 'var(--dark-navy)',
                  borderRadius: 'var(--radius-full)',
                  marginTop: 'var(--space-2)',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    height: '100%',
                    width: `${totalActive > 0 ? (quadrantDist[q.id] / totalActive) * 100 : 0}%`,
                    background: q.color,
                    borderRadius: 'var(--radius-full)',
                  }} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

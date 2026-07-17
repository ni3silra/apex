'use client';
import { useState, useMemo } from 'react';
import useTaskStore from '@/stores/useTaskStore';
import useSettingsStore from '@/stores/useSettingsStore';
import useAnalyticsStore from '@/stores/useAnalyticsStore';
import { QUADRANTS, IMPACT_LEVELS } from '@/lib/constants';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, TrendingUp, CheckCircle2, Target, Clock, Flame, CalendarRange, Activity, ChevronDown, ChevronRight } from 'lucide-react';
import TaskCard from '@/components/tasks/TaskCard';

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

function MultiColorMiniBarChart({ data, colors, maxValue, labels }) {
  const max = maxValue || Math.max(...data, 1);
  return (
    <div className="analytics-bar-chart" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '55px', gap: '4px', marginTop: 'var(--space-4)' }}>
      {data.map((value, i) => (
        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, justifyContent: 'flex-end' }}>
          <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', marginBottom: '2px', fontWeight: 'bold' }}>
            {value > 0 ? value : ''}
          </span>
          <div
            title={`${labels ? labels[i] + ': ' : ''}${value} tasks`}
            style={{
              width: '100%',
              height: `${Math.max(2, (value / max) * 40)}px`,
              background: colors[i],
              borderRadius: '2px 2px 0 0',
              opacity: 1,
              transition: 'height 0.3s ease'
            }}
          />
        </div>
      ))}
    </div>
  );
}

export default function Analytics() {
  const tasks = useTaskStore(s => s.tasks);
  const dailyStats = useAnalyticsStore(s => s.dailyStats);
  const [period, setPeriod] = useState('all');

  const now = new Date();
  
  const inPeriod = (dateStr) => {
    if (period === 'all' || !dateStr) return true;
    const date = new Date(dateStr);
    const diffDays = (now - date) / (1000 * 60 * 60 * 24);
    if (period === 'today') return diffDays < 1;
    if (period === 'week') return diffDays <= 7;
    if (period === 'month') return diffDays <= 30;
    return true;
  };

  const periodTasks = tasks.filter(t => inPeriod(t.createdAt) || inPeriod(t.completedAt));

  const totalCompleted = periodTasks.filter(t => t.status === 'done' && inPeriod(t.completedAt)).length;
  const totalActive = periodTasks.filter(t => t.status !== 'done').length;
  const totalTasks = periodTasks.length;

  const overdueTasks = periodTasks.filter(t =>
    t.deadline && new Date(t.deadline) < new Date() && t.status !== 'done'
  ).length;

  const totalFocusMinutes = periodTasks.reduce((sum, t) => sum + (t.focusTime || 0), 0);

  // Quadrant distribution
  const quadrantDist = useMemo(() => {
    const dist = { q1: 0, q2: 0, q3: 0, q4: 0 };
    periodTasks.filter(t => t.status !== 'done').forEach(t => { dist[t.quadrant] = (dist[t.quadrant] || 0) + 1; });
    return dist;
  }, [periodTasks]);

  const selectTask = useSettingsStore(s => s.selectTask);
  const [expandedImpact, setExpandedImpact] = useState(null);

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

  // Impact Stats
  const impactStats = useMemo(() => {
    const stats = {};
    IMPACT_LEVELS.forEach(lvl => { stats[lvl] = { total: 0, done: 0, doneTasks: [] }; });

    periodTasks.forEach(t => {
      const impact = t.impact || 'Medium';
      if (!stats[impact]) stats[impact] = { total: 0, done: 0, doneTasks: [] };
      
      stats[impact].total++;
      if (t.status === 'done') {
        stats[impact].done++;
        stats[impact].doneTasks.push(t);
      }
    });

    Object.values(stats).forEach(group => {
      group.doneTasks.sort((a, b) => {
        const timeA = new Date(a.completedAt || a.updatedAt).getTime();
        const timeB = new Date(b.completedAt || b.updatedAt).getTime();
        return timeB - timeA;
      });
    });

    return stats;
  }, [periodTasks]);

  const toggleExpand = (impact) => {
    setExpandedImpact(expandedImpact === impact ? null : impact);
  };

  return (
    <div className="analytics-dashboard">
      <motion.div
        className="analytics-header"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="analytics-header-inner" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-6)' }}>
          <div>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', margin: 0, fontSize: '1.4rem' }}>
              <BarChart3 size={24} style={{ color: 'var(--db-bright-blue)' }} />
              Analytics & Insights
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: 'var(--space-2)' }}>
              Track your productivity and execution velocity.
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            {['today', 'week', 'month', 'all'].map(p => (
              <button 
                key={p} 
                className={`btn ${period === p ? 'btn-primary' : 'btn-ghost'}`}
                style={{ padding: 'var(--space-1) var(--space-3)', borderRadius: 'var(--radius-md)' }}
                onClick={() => setPeriod(p)}
              >
                {p === 'all' ? 'All Time' : p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
        </div>
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



        {/* Active & Overdue */}
        <motion.div
          className="analytics-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="analytics-card-title">
            <Flame size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
            Active & Overdue
          </div>
          <div className="analytics-big-number" style={{ color: 'var(--text-primary)' }}>
            {totalActive}
          </div>
          <MultiColorMiniBarChart 
            data={[...Object.values(QUADRANTS).map(q => quadrantDist[q.id]), overdueTasks]} 
            colors={[...Object.values(QUADRANTS).map(q => q.color), 'var(--danger)']} 
            labels={[...Object.values(QUADRANTS).map(q => q.label), 'Overdue']}
          />
        </motion.div>
        {/* Impact Analysis Section */}
        <motion.div
          className="analytics-card impact-analysis-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '12px' }}
        >
        <div className="analytics-card-title" style={{ marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Activity size={18} style={{ color: 'var(--primary)' }} />
          Impact Analysis
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {Object.entries(impactStats).sort((a, b) => b[1].total - a[1].total).map(([impact, data], index) => {
            const isExpanded = expandedImpact === impact;
            const completionRate = data.total > 0 ? Math.round((data.done / data.total) * 100) : 0;
            
            return (
              <motion.div 
                key={impact}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="analytics-impact-row"
                style={{
                  background: 'var(--surface-elevated)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden'
                }}
              >
                <div 
                  className="impact-row-header"
                  style={{ 
                    padding: 'var(--space-4)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    background: isExpanded ? 'var(--surface-hover)' : 'transparent',
                    transition: 'background 0.2s'
                  }}
                  onClick={() => toggleExpand(impact)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    {isExpanded ? <ChevronDown size={18} style={{ color: 'var(--text-secondary)' }}/> : <ChevronRight size={18} style={{ color: 'var(--text-secondary)' }}/>}
                    <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>{impact} Impact</h3>
                    <div style={{ background: 'var(--surface)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      {data.total} tasks
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--success)' }}>
                        {data.done} <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 'normal' }}>Done</span>
                      </div>
                    </div>
                    
                    <div style={{ width: 100 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px', color: 'var(--text-secondary)' }}>
                        <span>Progress</span>
                        <span>{completionRate}%</span>
                      </div>
                      <div style={{ height: 6, background: 'var(--surface)', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${completionRate}%`, background: 'var(--success)', transition: 'width 0.5s ease' }} />
                      </div>
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      style={{ borderTop: '1px solid var(--border-subtle)', background: 'var(--surface)', padding: 'var(--space-4)' }}
                    >
                      <h4 style={{ margin: '0 0 var(--space-4) 0', fontSize: '0.9rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <CheckCircle2 size={14} style={{ color: 'var(--success)' }}/>
                        Completed Tasks ({data.doneTasks.length})
                      </h4>
                      
                      {data.doneTasks.length === 0 ? (
                        <p style={{ color: 'var(--neutral-500)', fontSize: '0.9rem', fontStyle: 'italic' }}>No completed tasks in this category yet.</p>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                          {data.doneTasks.map(task => (
                            <div 
                              key={task.id} 
                              style={{ cursor: 'pointer' }}
                              onClick={() => selectTask(task.id)}
                            >
                              <TaskCard task={task} />
                            </div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
        </motion.div>
      </div>
    </div>
  );
}

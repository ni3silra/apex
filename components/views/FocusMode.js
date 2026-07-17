'use client';
import { useEffect } from 'react';
import useFocusStore from '@/stores/useFocusStore';
import useTaskStore from '@/stores/useTaskStore';
import useSettingsStore from '@/stores/useSettingsStore';
import { rankTasks } from '@/lib/priorities';
import { motion } from 'framer-motion';
import { X, Play, Pause, SkipForward, Square, Target, Coffee, Zap } from 'lucide-react';

export default function FocusMode() {
  const {
    isActive, taskId, mode, timeRemaining, isPaused,
    sessionsCompleted, totalFocusTime,
    startFocus, stopFocus, togglePause,
  } = useFocusStore();

  const tasks = useTaskStore(s => s.tasks);
  const setView = useSettingsStore(s => s.setView);

  const focusTask = taskId ? tasks.find(t => t.id === taskId) : null;
  const ranked = rankTasks(tasks);
  const topTask = ranked[0];

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const modeLabels = {
    work: 'FOCUS SESSION',
    shortBreak: 'SHORT BREAK',
    longBreak: 'LONG BREAK',
  };
  const modeIcons = {
    work: <Zap size={20} />,
    shortBreak: <Coffee size={20} />,
    longBreak: <Coffee size={20} />,
  };

  const handleStartFocus = (task) => {
    startFocus(task.id);
  };

  const handleStop = () => {
    if (totalFocusTime > 0 && focusTask) {
      useTaskStore.getState().updateTask(focusTask.id, {
        focusTime: (focusTask.focusTime || 0) + Math.round(totalFocusTime / 60),
      });
    }
    stopFocus();
  };

  if (!isActive) {
    return (
      <div className="briefing" style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center', paddingTop: 'var(--space-12)' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Target size={64} style={{ color: 'var(--db-bright-blue)', marginBottom: 'var(--space-6)' }} />
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, marginBottom: 'var(--space-3)' }}>
            Focus Mode
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-8)' }}>
            Select a task to start a deep work session with Pomodoro timer.
          </p>

          {topTask && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: 'var(--space-3)' }}>
                SUGGESTED: HIGHEST PRIORITY
              </p>
              <button
                className="briefing-p1-card"
                style={{ cursor: 'pointer', textAlign: 'left', width: '100%' }}
                onClick={() => handleStartFocus(topTask)}
              >
                <div className="briefing-p1-title">{topTask.title}</div>
                <div style={{ marginTop: 'var(--space-3)' }}>
                  <span className="btn btn-primary">
                    <Play size={14} /> Start Focus
                  </span>
                </div>
              </button>
            </motion.div>
          )}

          {ranked.length > 1 && (
            <div style={{ marginTop: 'var(--space-6)', textAlign: 'left' }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: 'var(--space-3)' }}>
                OR PICK ANOTHER TASK
              </p>
              {ranked.slice(1, 6).map(task => (
                <button
                  key={task.id}
                  className="f1-rank-row"
                  style={{ marginBottom: 'var(--space-2)', width: '100%', textAlign: 'left' }}
                  onClick={() => handleStartFocus(task)}
                >
                  <div className="f1-task-info">
                    <div className="f1-task-title">{task.title}</div>
                  </div>
                  <Play size={16} style={{ color: 'var(--db-bright-blue)' }} />
                </button>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      className="focus-mode"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <button className="focus-close btn-icon" onClick={handleStop}>
        <X size={24} />
      </button>

      {/* Mode Label */}
      <motion.div
        className="focus-mode-label"
        key={mode}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          color: mode === 'work' ? 'var(--f1-red)' : 'var(--f1-green)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-2)',
        }}
      >
        {modeIcons[mode]}
        {modeLabels[mode]}
      </motion.div>

      {/* Timer */}
      <motion.div
        className={`focus-timer ${mode}`}
        key={formattedTime}
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      >
        {formattedTime}
      </motion.div>

      {/* Task Title */}
      {focusTask && (
        <div className="focus-task-title">{focusTask.title}</div>
      )}

      {/* Controls */}
      <div className="focus-controls">
        <button className="focus-btn btn-ghost" onClick={handleStop} title="Stop">
          <Square size={24} />
        </button>
        <button
          className="focus-btn focus-btn-play"
          onClick={togglePause}
          title={isPaused ? 'Resume' : 'Pause'}
        >
          {isPaused ? <Play size={28} /> : <Pause size={28} />}
        </button>
        <button className="focus-btn btn-ghost" onClick={() => {
          // Skip to next phase manually
          useFocusStore.setState(s => ({ timeRemaining: 0 }));
        }} title="Skip">
          <SkipForward size={24} />
        </button>
      </div>

      {/* Session Dots */}
      <div className="focus-sessions">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className={`focus-session-dot ${i < sessionsCompleted ? 'completed' : ''}`}
          />
        ))}
      </div>

      {/* Total Focus Time */}
      <div style={{
        marginTop: 'var(--space-6)',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.85rem',
        color: 'var(--neutral-500)',
      }}>
        Total focus: {Math.floor(totalFocusTime / 60)}m {totalFocusTime % 60}s
      </div>
    </motion.div>
  );
}

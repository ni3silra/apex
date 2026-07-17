'use client';
import { create } from 'zustand';
import { POMODORO_DEFAULTS } from '@/lib/constants';

const useFocusStore = create((set, get) => ({
  isActive: false,
  taskId: null,
  mode: 'work', // 'work' | 'shortBreak' | 'longBreak'
  timeRemaining: POMODORO_DEFAULTS.workMinutes * 60, // seconds
  totalFocusTime: 0,
  sessionsCompleted: 0,
  isPaused: true,
  settings: { ...POMODORO_DEFAULTS },

  startFocus: (taskId) => {
    set({
      isActive: true,
      taskId,
      mode: 'work',
      timeRemaining: get().settings.workMinutes * 60,
      isPaused: false,
    });
  },

  stopFocus: () => {
    set({
      isActive: false,
      taskId: null,
      mode: 'work',
      timeRemaining: get().settings.workMinutes * 60,
      isPaused: true,
    });
  },

  togglePause: () => set(s => ({ isPaused: !s.isPaused })),

  tick: () => {
    const { timeRemaining, mode, isPaused, sessionsCompleted, settings } = get();
    if (isPaused || timeRemaining <= 0) return;

    set(s => ({
      timeRemaining: s.timeRemaining - 1,
      totalFocusTime: mode === 'work' ? s.totalFocusTime + 1 : s.totalFocusTime,
    }));

    if (timeRemaining - 1 <= 0) {
      // Session complete
      if (mode === 'work') {
        const newSessions = sessionsCompleted + 1;
        const isLongBreak = newSessions % settings.sessionsBeforeLongBreak === 0;
        set({
          sessionsCompleted: newSessions,
          mode: isLongBreak ? 'longBreak' : 'shortBreak',
          timeRemaining: isLongBreak
            ? settings.longBreakMinutes * 60
            : settings.shortBreakMinutes * 60,
        });
      } else {
        set({
          mode: 'work',
          timeRemaining: settings.workMinutes * 60,
        });
      }
    }
  },

  formatTime: () => {
    const { timeRemaining } = get();
    const mins = Math.floor(timeRemaining / 60);
    const secs = timeRemaining % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  },
}));

export default useFocusStore;

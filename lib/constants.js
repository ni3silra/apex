// Deutsche Bank × F1 Racing color palette
export const COLORS = {
  dbBlue: '#0018A8',
  dbBrightBlue: '#00A3E0',
  darkNavy: '#0A0E27',
  surface: '#111638',
  surfaceElevated: '#1A1F4A',
  surfaceHover: '#222860',
  f1Purple: '#A855F7',
  f1Green: '#22C55E',
  f1Yellow: '#FACC15',
  f1Red: '#EF4444',
  neutral50: '#F8FAFC',
  neutral100: '#F1F5F9',
  neutral200: '#E2E8F0',
  neutral300: '#CBD5E1',
  neutral400: '#94A3B8',
  neutral500: '#64748B',
  neutral600: '#475569',
  neutral700: '#334155',
  white: '#FFFFFF',
  black: '#000000',
};

export const QUADRANTS = {
  q1: {
    id: 'q1',
    label: 'Do First',
    subtitle: 'Urgent & Important',
    color: COLORS.f1Red,
    bgColor: 'rgba(239, 68, 68, 0.08)',
    borderColor: 'rgba(239, 68, 68, 0.25)',
    icon: 'Zap',
  },
  q2: {
    id: 'q2',
    label: 'Schedule',
    subtitle: 'Important, Not Urgent',
    color: COLORS.dbBlue,
    bgColor: 'rgba(0, 24, 168, 0.08)',
    borderColor: 'rgba(0, 24, 168, 0.25)',
    icon: 'Calendar',
  },
  q3: {
    id: 'q3',
    label: 'Delegate',
    subtitle: 'Urgent, Not Important',
    color: COLORS.f1Yellow,
    bgColor: 'rgba(250, 204, 21, 0.08)',
    borderColor: 'rgba(250, 204, 21, 0.25)',
    icon: 'Users',
  },
  q4: {
    id: 'q4',
    label: 'Eliminate',
    subtitle: 'Neither Urgent nor Important',
    color: COLORS.neutral500,
    bgColor: 'rgba(100, 116, 139, 0.08)',
    borderColor: 'rgba(100, 116, 139, 0.25)',
    icon: 'Trash2',
  },
};

export const TASK_STATUSES = [
  { id: 'not_started', label: 'Not Started', color: COLORS.neutral400, icon: 'Circle' },
  { id: 'in_progress', label: 'In Progress', color: COLORS.dbBrightBlue, icon: 'Play' },
  { id: 'review', label: 'In Review', color: COLORS.f1Yellow, icon: 'Eye' },
  { id: 'done', label: 'Done', color: COLORS.f1Green, icon: 'CheckCircle' },
];

export const VIEWS = {
  briefing: { id: 'briefing', label: 'Daily Briefing', icon: 'LayoutDashboard', shortcut: 'B' },
  matrix: { id: 'matrix', label: 'Matrix', icon: 'Grid2x2', shortcut: 'M' },
  ranking: { id: 'ranking', label: 'F1 Ranking', icon: 'Trophy', shortcut: 'R' },
  focus: { id: 'focus', label: 'Focus Mode', icon: 'Target', shortcut: 'F' },
  analytics: { id: 'analytics', label: 'Analytics', icon: 'BarChart3', shortcut: 'A' },
};

export const KEYBOARD_SHORTCUTS = [
  { keys: ['Ctrl', 'N'], action: 'Quick add task', category: 'Tasks' },
  { keys: ['Ctrl', 'K'], action: 'Command palette', category: 'Navigation' },
  { keys: ['Ctrl', 'Shift', 'F'], action: 'Focus mode', category: 'Views' },
  { keys: ['Ctrl', '1'], action: 'Go to Q1 - Do First', category: 'Navigation' },
  { keys: ['Ctrl', '2'], action: 'Go to Q2 - Schedule', category: 'Navigation' },
  { keys: ['Ctrl', '3'], action: 'Go to Q3 - Delegate', category: 'Navigation' },
  { keys: ['Ctrl', '4'], action: 'Go to Q4 - Eliminate', category: 'Navigation' },
  { keys: ['D'], action: 'Toggle done', category: 'Tasks' },
  { keys: ['Enter'], action: 'Open task', category: 'Tasks' },
  { keys: ['Escape'], action: 'Close/cancel', category: 'General' },
  { keys: ['?'], action: 'Show shortcuts', category: 'General' },
];

export const ATTACHMENT_TYPES = [
  { id: 'link', label: 'Link', icon: 'Link' },
  { id: 'document', label: 'Document', icon: 'FileText' },
  { id: 'image', label: 'Image', icon: 'Image' },
  { id: 'video', label: 'Video', icon: 'Video' },
  { id: 'code', label: 'Code', icon: 'Code' },
];

export const POMODORO_DEFAULTS = {
  workMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  sessionsBeforeLongBreak: 4,
};

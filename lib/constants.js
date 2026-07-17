// Enterprise color palette
export const COLORS = {
  dbBlue: '#0018A8',
  dbBrightBlue: '#00A3E0',
  darkNavy: '#0D1117', // GitHub-like dark background
  surface: '#161B22',  // Linear-like dark surface
  surfaceElevated: '#21262D',
  surfaceHover: '#30363D',
  primary: '#58A6FF',
  success: '#3FB950',
  warning: '#D29922',
  danger: '#F85149',
  neutral50: '#F8FAFC',
  neutral100: '#F1F5F9',
  neutral200: '#E2E8F0',
  neutral300: '#CBD5E1',
  neutral400: '#8B949E',
  neutral500: '#6E7681',
  neutral600: '#484F58',
  neutral700: '#21262D',
  white: '#FFFFFF',
  black: '#000000',
};

export const QUADRANTS = {
  q1: {
    id: 'q1',
    label: 'Do First',
    subtitle: 'Urgent & Important',
    color: COLORS.danger,
    bgColor: 'rgba(248, 81, 73, 0.08)',
    borderColor: 'rgba(248, 81, 73, 0.25)',
    icon: 'Zap',
  },
  q2: {
    id: 'q2',
    label: 'Schedule',
    subtitle: 'Important, Not Urgent',
    color: COLORS.primary,
    bgColor: 'rgba(88, 166, 255, 0.08)',
    borderColor: 'rgba(88, 166, 255, 0.25)',
    icon: 'Calendar',
  },
  q3: {
    id: 'q3',
    label: 'Delegate',
    subtitle: 'Urgent, Not Important',
    color: COLORS.warning,
    bgColor: 'rgba(210, 153, 34, 0.08)',
    borderColor: 'rgba(210, 153, 34, 0.25)',
    icon: 'Users',
  },
  q4: {
    id: 'q4',
    label: 'Eliminate',
    subtitle: 'Neither Urgent nor Important',
    color: COLORS.neutral500,
    bgColor: 'rgba(110, 118, 129, 0.08)',
    borderColor: 'rgba(110, 118, 129, 0.25)',
    icon: 'Trash2',
  },
};

export const TASK_STATUSES = [
  { id: 'not_started', label: 'Not Started', color: COLORS.neutral400, icon: 'Circle' },
  { id: 'in_progress', label: 'In Progress', color: COLORS.primary, icon: 'Play' },
  { id: 'review', label: 'In Review', color: COLORS.warning, icon: 'Eye' },
  { id: 'done', label: 'Done', color: COLORS.success, icon: 'CheckCircle' },
];

export const IMPACT_LEVELS = ['Very High', 'High', 'Medium', 'Low'];

export const VIEWS = {
  briefing: { id: 'briefing', label: 'Dashboard', icon: 'LayoutDashboard', shortcut: 'D' },
  matrix: { id: 'matrix', label: 'Matrix', icon: 'Grid2x2', shortcut: 'M' },
  ranking: { id: 'ranking', label: 'Priority Queue', icon: 'List', shortcut: 'P' },
  focus: { id: 'focus', label: 'Focus Mode', icon: 'Target', shortcut: 'F' },
  analytics: { id: 'analytics', label: 'Analytics', icon: 'BarChart3', shortcut: 'A' },
  guide: { id: 'guide', label: 'Guide', icon: 'BookOpen', shortcut: 'G' },
};

export const KEYBOARD_SHORTCUTS = [
  { keys: ['⌘/Ctrl', 'N'], action: 'Quick add task', category: 'Tasks' },
  { keys: ['⌘/Ctrl', 'K'], action: 'Command palette', category: 'Navigation' },
  { keys: ['⌘/Ctrl', 'Shift', 'F'], action: 'Focus mode', category: 'Views' },
  { keys: ['⌘/Ctrl', '1'], action: 'Go to Q1 - Do First', category: 'Navigation' },
  { keys: ['⌘/Ctrl', '2'], action: 'Go to Q2 - Schedule', category: 'Navigation' },
  { keys: ['⌘/Ctrl', '3'], action: 'Go to Q3 - Delegate', category: 'Navigation' },
  { keys: ['⌘/Ctrl', '4'], action: 'Go to Q4 - Eliminate', category: 'Navigation' },
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

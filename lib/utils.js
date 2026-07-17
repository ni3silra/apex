import { formatDistanceToNow, differenceInHours, differenceInDays, differenceInMinutes, format, isPast, isToday, isTomorrow, isThisWeek } from 'date-fns';

export function getDeadlineStatus(deadline) {
  if (!deadline) return { label: 'No deadline', color: 'var(--neutral-400)', urgency: 0 };
  const date = new Date(deadline);
  const now = new Date();

  if (isPast(date)) {
    const hoursOverdue = differenceInHours(now, date);
    return {
      label: `Overdue ${formatDistanceToNow(date, { addSuffix: false })}`,
      color: 'var(--f1-red)',
      urgency: 100 + hoursOverdue,
      isOverdue: true,
    };
  }

  const hoursLeft = differenceInHours(date, now);
  const daysLeft = differenceInDays(date, now);

  if (hoursLeft <= 4) return { label: `${hoursLeft}h left`, color: 'var(--f1-red)', urgency: 90 };
  if (isToday(date)) return { label: 'Due today', color: 'var(--f1-yellow)', urgency: 80 };
  if (isTomorrow(date)) return { label: 'Due tomorrow', color: 'var(--f1-yellow)', urgency: 60 };
  if (isThisWeek(date)) return { label: `${daysLeft}d left`, color: 'var(--db-bright-blue)', urgency: 40 };
  return { label: `${daysLeft}d left`, color: 'var(--neutral-400)', urgency: Math.max(0, 30 - daysLeft) };
}

export function formatDeadline(deadline) {
  if (!deadline) return '';
  return format(new Date(deadline), 'MMM d, yyyy h:mm a');
}

export function formatGap(deadline) {
  if (!deadline) return '--';
  const date = new Date(deadline);
  const now = new Date();
  const totalMinutes = Math.abs(differenceInMinutes(date, now));
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const mins = totalMinutes % 60;
  const prefix = isPast(date) ? '+' : '-';

  if (days > 0) return `${prefix}${days}d ${hours}h`;
  if (hours > 0) return `${prefix}${hours}h ${mins}m`;
  return `${prefix}${mins}m`;
}

export function getInitials(name) {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

export function generateColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash % 360);
  return `hsl(${hue}, 60%, 50%)`;
}

export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function groupBy(arr, key) {
  return arr.reduce((acc, item) => {
    const group = typeof key === 'function' ? key(item) : item[key];
    (acc[group] = acc[group] || []).push(item);
    return acc;
  }, {});
}

export function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

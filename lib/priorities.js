import { differenceInHours, isPast } from 'date-fns';

const QUADRANT_WEIGHTS = { q1: 100, q2: 60, q3: 40, q4: 10 };
const STATUS_WEIGHTS = { not_started: 1.0, in_progress: 1.2, review: 0.6, done: 0 };

export function calculatePriorityScore(task) {
  if (task.status === 'done') return 0;

  let score = QUADRANT_WEIGHTS[task.quadrant] || 0;
  score *= STATUS_WEIGHTS[task.status] || 1;

  // Deadline proximity boost
  if (task.deadline) {
    const date = new Date(task.deadline);
    const hoursLeft = differenceInHours(date, new Date());

    if (isPast(date)) {
      score += 50 + Math.min(50, Math.abs(hoursLeft)); // Overdue penalty
    } else if (hoursLeft <= 4) {
      score += 40;
    } else if (hoursLeft <= 24) {
      score += 30;
    } else if (hoursLeft <= 72) {
      score += 20;
    } else if (hoursLeft <= 168) {
      score += 10;
    }
  }

  // Contacts boost (delegated tasks with people = higher visibility)
  if (task.contacts && task.contacts.length > 0) {
    score += 5;
  }

  return Math.round(score);
}

export function getSectorColor(score) {
  if (score >= 120) return 'var(--f1-purple)'; // Critical path
  if (score >= 80) return 'var(--f1-red)';     // Danger zone
  if (score >= 50) return 'var(--f1-yellow)';  // Needs attention
  if (score >= 20) return 'var(--f1-green)';   // On track
  return 'var(--neutral-500)';                  // Low priority
}

export function getPositionStyle(position) {
  if (position === 1) return { color: '#FFD700', label: 'P1', bg: 'linear-gradient(135deg, #FFD700 0%, #F5A623 100%)' };
  if (position === 2) return { color: '#C0C0C0', label: 'P2', bg: 'linear-gradient(135deg, #C0C0C0 0%, #8E8E8E 100%)' };
  if (position === 3) return { color: '#CD7F32', label: 'P3', bg: 'linear-gradient(135deg, #CD7F32 0%, #A0522D 100%)' };
  return { color: 'var(--neutral-400)', label: `P${position}`, bg: 'var(--surface)' };
}

export function rankTasks(tasks) {
  return tasks
    .filter(t => t.status !== 'done')
    .map(t => ({ ...t, priorityScore: calculatePriorityScore(t) }))
    .sort((a, b) => b.priorityScore - a.priorityScore);
}

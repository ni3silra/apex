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

export function getPriorityColor(score) {
  if (score >= 120) return 'var(--danger)';     // Critical path
  if (score >= 80) return 'var(--warning)';     // High priority
  if (score >= 50) return 'var(--primary)';     // Medium priority
  if (score >= 20) return 'var(--success)';     // On track
  return 'var(--neutral-500)';                  // Low priority
}

export function rankTasks(tasks) {
  return tasks
    .filter(t => t.status !== 'done')
    .map(t => ({ ...t, priorityScore: calculatePriorityScore(t) }))
    .sort((a, b) => b.priorityScore - a.priorityScore);
}

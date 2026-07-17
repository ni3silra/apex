import { addDays, addHours, nextMonday, nextFriday, setHours, setMinutes } from 'date-fns';

const URGENCY_KEYWORDS = ['!urgent', '!critical', '!asap', '!important', '!now'];
const IMPORTANCE_KEYWORDS = ['!important', '!strategic', '!key'];

export function parseTaskInput(input) {
  let text = input.trim();
  const result = {
    title: '',
    contacts: [],
    tags: [],
    quadrant: 'q2', // default: Important, not urgent
    deadline: null,
  };

  // Extract contacts (@name)
  const contactMatches = text.match(/@(\w+)/g);
  if (contactMatches) {
    result.contacts = contactMatches.map(m => ({
      name: m.slice(1).charAt(0).toUpperCase() + m.slice(2),
      id: m.slice(1).toLowerCase(),
    }));
    text = text.replace(/@\w+/g, '').trim();
  }

  // Extract tags (#tag)
  const tagMatches = text.match(/#(\w+)/g);
  if (tagMatches) {
    result.tags = tagMatches.map(m => m.slice(1).toLowerCase());
    text = text.replace(/#\w+/g, '').trim();
  }

  // Extract urgency flags
  const isUrgent = URGENCY_KEYWORDS.some(k => text.toLowerCase().includes(k));
  const isImportant = IMPORTANCE_KEYWORDS.some(k => text.toLowerCase().includes(k)) || !text.toLowerCase().includes('!low');
  URGENCY_KEYWORDS.concat(IMPORTANCE_KEYWORDS, ['!low']).forEach(k => {
    text = text.replace(new RegExp(k.replace('!', '\\!'), 'gi'), '').trim();
  });

  // Determine quadrant
  if (isUrgent && isImportant) result.quadrant = 'q1';
  else if (isImportant && !isUrgent) result.quadrant = 'q2';
  else if (isUrgent && !isImportant) result.quadrant = 'q3';
  else result.quadrant = 'q4';

  // Extract deadline (due <date>)
  const deadlinePatterns = [
    { pattern: /\bdue\s+today\b/i, fn: () => setHours(setMinutes(new Date(), 0), 18) },
    { pattern: /\bdue\s+tomorrow\b/i, fn: () => setHours(setMinutes(addDays(new Date(), 1), 0), 18) },
    { pattern: /\bdue\s+monday\b/i, fn: () => setHours(setMinutes(nextMonday(new Date()), 0), 9) },
    { pattern: /\bdue\s+friday\b/i, fn: () => setHours(setMinutes(nextFriday(new Date()), 0), 18) },
    { pattern: /\bdue\s+in\s+(\d+)\s*h(?:ours?)?\b/i, fn: (m) => addHours(new Date(), parseInt(m[1])) },
    { pattern: /\bdue\s+in\s+(\d+)\s*d(?:ays?)?\b/i, fn: (m) => setHours(addDays(new Date(), parseInt(m[1])), 18) },
    { pattern: /\bdue\s+(\d{4}-\d{2}-\d{2})\b/i, fn: (m) => new Date(m[1] + 'T18:00:00') },
  ];

  for (const { pattern, fn } of deadlinePatterns) {
    const match = text.match(pattern);
    if (match) {
      result.deadline = fn(match).toISOString();
      text = text.replace(pattern, '').trim();
      break;
    }
  }

  result.title = text.replace(/\s+/g, ' ').trim();
  return result;
}

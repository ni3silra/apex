'use client';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import useTaskStore from '@/stores/useTaskStore';
import useSettingsStore from '@/stores/useSettingsStore';
import { QUADRANTS } from '@/lib/constants';
import { getDeadlineStatus, getInitials, generateColor } from '@/lib/utils';
import { Clock, MessageSquare, Paperclip, GripVertical, Play } from 'lucide-react';
import * as Checkbox from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';
import useFocusStore from '@/stores/useFocusStore';

export default function TaskCard({ task, isDragOverlay = false }) {
  const selectTask = useSettingsStore(s => s.selectTask);
  const toggleDone = useTaskStore(s => s.toggleDone);
  const deadline = getDeadlineStatus(task.deadline);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, disabled: isDragOverlay });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`task-card ${isDragging ? 'dragging' : ''} ${task.status === 'done' ? 'done' : ''}`}
      onClick={() => selectTask(task.id)}
    >
      <div className="task-card-top">
        {/* Drag Handle */}
        <div {...attributes} {...listeners} style={{ cursor: 'grab', color: 'var(--neutral-600)', marginTop: 2 }}>
          <GripVertical size={14} />
        </div>

        {/* Checkbox */}
        <Checkbox.Root
          className="task-card-checkbox"
          checked={task.status === 'done'}
          onCheckedChange={(e) => {
            toggleDone(task.id);
          }}
          onClick={(e) => e.stopPropagation()}
          style={{
            width: 18,
            height: 18,
            borderRadius: 4,
            border: `2px solid ${task.status === 'done' ? 'var(--success)' : 'var(--neutral-500)'}`,
            background: task.status === 'done' ? 'var(--success)' : 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 150ms ease',
          }}
        >
          <Checkbox.Indicator>
            <Check size={12} style={{ color: 'white' }} />
          </Checkbox.Indicator>
        </Checkbox.Root>

        {/* Title */}
        <span className="task-card-title" style={{ flex: 1 }}>{task.title}</span>

        {/* Focus Action */}
        {task.status !== 'done' && (
          <button
            className="btn-icon"
            style={{ width: 20, height: 20, color: 'var(--text-muted)' }}
            onClick={(e) => {
              e.stopPropagation();
              useFocusStore.getState().startFocus(task.id);
              useSettingsStore.getState().setView('focus');
            }}
            title="Start Focus Mode"
          >
            <Play size={14} />
          </button>
        )}
      </div>

      {/* Meta row */}
      <div className="task-card-meta">
        {/* Deadline */}
        {task.deadline && (
          <span className="task-card-deadline" style={{ color: deadline.color }}>
            <Clock size={10} />
            {deadline.label}
          </span>
        )}

        {/* Tags */}
        {task.tags?.slice(0, 2).map((tag, i) => (
          <span key={i} className="task-card-tag">#{tag}</span>
        ))}

        {/* Indicators */}
        <div className="task-card-indicators">
          {task.notes?.length > 0 && (
            <span className="task-card-indicator">
              <MessageSquare size={10} /> {task.notes.length}
            </span>
          )}
          {task.attachments?.length > 0 && (
            <span className="task-card-indicator">
              <Paperclip size={10} /> {task.attachments.length}
            </span>
          )}
        </div>

        {/* Contact Avatars */}
        {task.contacts?.length > 0 && (
          <div className="task-card-avatars">
            {task.contacts.slice(0, 3).map((contact, i) => (
              <div
                key={i}
                className="task-card-avatar"
                style={{ background: generateColor(contact.name || contact.id) }}
                title={contact.name}
              >
                {getInitials(contact.name)}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

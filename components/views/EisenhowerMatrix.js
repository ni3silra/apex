'use client';
import { useState, useMemo } from 'react';
import { DndContext, DragOverlay, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import useTaskStore from '@/stores/useTaskStore';
import useSettingsStore from '@/stores/useSettingsStore';
import { QUADRANTS } from '@/lib/constants';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Calendar, Users, Trash2, Plus } from 'lucide-react';
import TaskCard from '@/components/tasks/TaskCard';

const ICON_MAP = { Zap, Calendar, Users, Trash2 };

function Quadrant({ quadrant, tasks }) {
  const { setNodeRef, isOver } = useDroppable({ id: quadrant.id });
  const toggleQuickAdd = useSettingsStore(s => s.toggleQuickAdd);
  const doneTasks = tasks.filter(t => t.status === 'done');
  const activeTasks = tasks.filter(t => t.status !== 'done');
  const completion = tasks.length > 0 ? Math.round((doneTasks.length / tasks.length) * 100) : 0;
  const Icon = ICON_MAP[quadrant.icon];

  return (
    <div
      ref={setNodeRef}
      className={`quadrant ${isOver ? 'drag-over' : ''}`}
      style={{ borderColor: isOver ? quadrant.color : undefined }}
    >
      <div className="quadrant-header">
        <div className="quadrant-title-group">
          <div className="quadrant-icon" style={{ background: quadrant.bgColor }}>
            {Icon && <Icon size={15} style={{ color: quadrant.color }} />}
          </div>
          <span className="quadrant-label" style={{ color: quadrant.color }}>{quadrant.label}</span>
          <span className="quadrant-subtitle">{quadrant.subtitle}</span>
        </div>
        <span className="quadrant-count">{activeTasks.length}</span>
      </div>
      <div className="quadrant-progress">
        <div
          className="quadrant-progress-bar"
          style={{ width: `${completion}%`, background: quadrant.color }}
        />
      </div>
      <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
        <div className="quadrant-body">
          <AnimatePresence mode="popLayout">
            {activeTasks.map(task => (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <TaskCard task={task} />
              </motion.div>
            ))}
          </AnimatePresence>
          {activeTasks.length === 0 && (
            <div className="quadrant-empty">
              <button
                className="btn btn-ghost"
                onClick={toggleQuickAdd}
                style={{ fontSize: '0.85rem' }}
              >
                <Plus size={14} /> Add a task
              </button>
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
}

export default function EisenhowerMatrix() {
  const tasks = useTaskStore(s => s.tasks);
  const moveToQuadrant = useTaskStore(s => s.moveToQuadrant);
  const searchQuery = useSettingsStore(s => s.searchQuery);
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const filteredTasks = useMemo(() => {
    if (!searchQuery) return tasks;
    const q = searchQuery.toLowerCase();
    return tasks.filter(t =>
      t.title.toLowerCase().includes(q) ||
      t.tags?.some(tag => tag.toLowerCase().includes(q)) ||
      t.contacts?.some(c => c.name.toLowerCase().includes(q))
    );
  }, [tasks, searchQuery]);

  function handleDragStart(event) {
    setActiveId(event.active.id);
  }

  function handleDragEnd(event) {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;

    const quadrantId = over.id;
    if (['q1', 'q2', 'q3', 'q4'].includes(quadrantId)) {
      moveToQuadrant(active.id, quadrantId);
    }
  }

  const activeTask = activeId ? tasks.find(t => t.id === activeId) : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="matrix-grid">
        {Object.values(QUADRANTS).map(q => (
          <Quadrant
            key={q.id}
            quadrant={q}
            tasks={filteredTasks.filter(t => t.quadrant === q.id)}
          />
        ))}
      </div>

      <DragOverlay>
        {activeTask && (
          <div style={{ transform: 'rotate(3deg)', opacity: 0.9 }}>
            <TaskCard task={activeTask} />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}

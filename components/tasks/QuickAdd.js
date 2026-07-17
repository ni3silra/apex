'use client';
import { useState, useRef, useEffect } from 'react';
import useTaskStore from '@/stores/useTaskStore';
import useSettingsStore from '@/stores/useSettingsStore';
import useAnalyticsStore from '@/stores/useAnalyticsStore';
import { parseTaskInput } from '@/lib/parser';
import { motion } from 'framer-motion';
import { Zap, Plus, AtSign, Hash, Clock, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

export default function QuickAdd() {
  const [input, setInput] = useState('');
  const inputRef = useRef(null);
  const addTask = useTaskStore(s => s.addTask);
  const toggleQuickAdd = useSettingsStore(s => s.toggleQuickAdd);
  const recordTaskAdded = useAnalyticsStore(s => s.recordTaskAdded);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const parsed = parseTaskInput(input);
    if (!parsed.title) return;

    addTask(parsed);
    recordTaskAdded();
    toast.success(`Task added to ${parsed.quadrant.toUpperCase()}`);
    setInput('');
    toggleQuickAdd();
  };

  return (
    <div className="quick-add-overlay animate-fade-in" onClick={toggleQuickAdd}>
      <motion.div
        className="quick-add"
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit}>
          <div className="quick-add-input-wrapper">
            <Zap size={20} style={{ color: 'var(--primary)', flexShrink: 0 }} />
            <input
              ref={inputRef}
              className="quick-add-input"
              type="text"
              placeholder='e.g. "Fix auth bug @john #backend !urgent due friday"'
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" className="btn btn-primary" disabled={!input.trim()}>
              <Plus size={16} /> Add
            </button>
          </div>
        </form>
        <div className="quick-add-hints">
          <span className="quick-add-hint"><AtSign size={11} /> <code>@name</code> contact</span>
          <span className="quick-add-hint"><Hash size={11} /> <code>#tag</code> label</span>
          <span className="quick-add-hint"><AlertTriangle size={11} /> <code>!urgent</code> priority</span>
          <span className="quick-add-hint"><Clock size={11} /> <code>due friday</code> deadline</span>
        </div>
      </motion.div>
    </div>
  );
}

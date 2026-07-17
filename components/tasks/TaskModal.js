'use client';
import { useState, useRef, useEffect, useMemo } from 'react';
import useTaskStore from '@/stores/useTaskStore';
import useSettingsStore from '@/stores/useSettingsStore';
import useAnalyticsStore from '@/stores/useAnalyticsStore';
import { QUADRANTS, TASK_STATUSES } from '@/lib/constants';
import { getDeadlineStatus, formatDeadline, getInitials, generateColor } from '@/lib/utils';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import * as Dialog from '@radix-ui/react-dialog';
import * as Tabs from '@radix-ui/react-tabs';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';
import {
  X, Calendar, Tag, Users, Paperclip, MessageSquare, Clock,
  Plus, Trash2, ExternalLink, Link, FileText, Image, Video, Code,
  Check, Target,
} from 'lucide-react';

const ATTACH_ICON_MAP = { link: Link, document: FileText, image: Image, video: Video, code: Code };

export default function TaskModal({ taskId }) {
  const task = useTaskStore(s => s.tasks.find(t => t.id === taskId));
  const updateTask = useTaskStore(s => s.updateTask);
  const deleteTask = useTaskStore(s => s.deleteTask);
  const addNote = useTaskStore(s => s.addNote);
  const deleteNote = useTaskStore(s => s.deleteNote);
  const addAttachment = useTaskStore(s => s.addAttachment);
  const removeAttachment = useTaskStore(s => s.removeAttachment);
  const clearSelection = useSettingsStore(s => s.clearSelection);
  const recordCompletion = useAnalyticsStore(s => s.recordCompletion);

  const [noteInput, setNoteInput] = useState('');
  const [attachUrl, setAttachUrl] = useState('');
  const [attachTitle, setAttachTitle] = useState('');
  const [attachType, setAttachType] = useState('link');
  const [contactInput, setContactInput] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const noteInputRef = useRef(null);

  if (!task) return null;

  const deadline = getDeadlineStatus(task.deadline);

  const handleAddNote = () => {
    if (!noteInput.trim()) return;
    addNote(taskId, noteInput.trim());
    setNoteInput('');
    toast.success('Note added');
  };

  const handleAddAttachment = () => {
    if (!attachUrl.trim()) return;
    addAttachment(taskId, {
      type: attachType,
      url: attachUrl.trim(),
      title: attachTitle.trim() || attachUrl.trim(),
    });
    setAttachUrl('');
    setAttachTitle('');
    toast.success('Attachment added');
  };

  const handleAddContact = () => {
    if (!contactInput.trim()) return;
    const newContact = { name: contactInput.trim(), id: contactInput.trim().toLowerCase().replace(/\s+/g, '_') };
    updateTask(taskId, { contacts: [...(task.contacts || []), newContact] });
    setContactInput('');
    toast.success('Contact added');
  };

  const handleRemoveContact = (idx) => {
    updateTask(taskId, { contacts: task.contacts.filter((_, i) => i !== idx) });
  };

  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    const tag = tagInput.trim().toLowerCase().replace(/\s+/g, '-');
    if (!task.tags?.includes(tag)) {
      updateTask(taskId, { tags: [...(task.tags || []), tag] });
    }
    setTagInput('');
  };

  const handleRemoveTag = (tag) => {
    updateTask(taskId, { tags: task.tags.filter(t => t !== tag) });
  };

  const handleDelete = () => {
    deleteTask(taskId);
    clearSelection();
    toast.success('Task deleted');
  };

  const handleStatusChange = (status) => {
    updateTask(taskId, {
      status,
      completedAt: status === 'done' ? new Date().toISOString() : null,
    });
    if (status === 'done') recordCompletion();
  };

  return (
    <Dialog.Root open={true} onOpenChange={(open) => !open && clearSelection()}>
      <Dialog.Portal>
        <Dialog.Overlay asChild>
          <motion.div
            className="task-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        </Dialog.Overlay>
        <Dialog.Content asChild>
          <motion.div
            className="task-modal"
            initial={{ opacity: 0, x: '-50%', y: '-45%', scale: 0.96 }}
            animate={{ opacity: 1, x: '-50%', y: '-50%', scale: 1 }}
            exit={{ opacity: 0, x: '-50%', y: '-45%', scale: 0.96 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            style={{ position: 'fixed', top: '50%', left: '50%', zIndex: 61 }}
          >
            {/* Header */}
            <div className="task-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <div style={{
                  width: 10, height: 10, borderRadius: '50%',
                  background: QUADRANTS[task.quadrant]?.color,
                }} />
                <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  {QUADRANTS[task.quadrant]?.label}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                <button className="btn btn-danger" onClick={handleDelete} title="Delete task">
                  <Trash2 size={15} />
                </button>
                <Dialog.Close asChild>
                  <button className="btn-icon"><X size={18} /></button>
                </Dialog.Close>
              </div>
            </div>

            {/* Body */}
            <div className="task-modal-body">
              {/* Title */}
              <input
                className="task-modal-title-input"
                type="text"
                value={task.title}
                onChange={(e) => updateTask(taskId, { title: e.target.value })}
                placeholder="Task title..."
              />

              {/* Status */}
              <div className="task-modal-field">
                <div className="task-modal-field-label"><Target size={13} /> Status</div>
                <div className="status-selector">
                  {TASK_STATUSES.map(s => (
                    <button
                      key={s.id}
                      className={`status-option ${task.status === s.id ? 'selected' : ''}`}
                      style={{
                        borderColor: task.status === s.id ? s.color : undefined,
                        color: task.status === s.id ? s.color : undefined,
                      }}
                      onClick={() => handleStatusChange(s.id)}
                    >
                      <Check size={11} style={{ opacity: task.status === s.id ? 1 : 0 }} />
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quadrant */}
              <div className="task-modal-field">
                <div className="task-modal-field-label"><Tag size={13} /> Quadrant</div>
                <div className="quadrant-selector">
                  {Object.values(QUADRANTS).map(q => (
                    <button
                      key={q.id}
                      className={`quadrant-option ${task.quadrant === q.id ? 'selected' : ''}`}
                      style={{
                        borderColor: task.quadrant === q.id ? q.color : undefined,
                        color: task.quadrant === q.id ? q.color : undefined,
                      }}
                      onClick={() => updateTask(taskId, { quadrant: q.id })}
                    >
                      {q.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Deadline */}
              <div className="task-modal-field">
                <div className="task-modal-field-label"><Calendar size={13} /> Deadline</div>
                <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
                  <input
                    className="task-modal-input"
                    type="datetime-local"
                    value={task.deadline ? format(new Date(task.deadline), "yyyy-MM-dd'T'HH:mm") : ''}
                    onChange={(e) => updateTask(taskId, { deadline: e.target.value ? new Date(e.target.value).toISOString() : null })}
                    style={{ flex: 1 }}
                  />
                  {task.deadline && (
                    <span style={{ fontSize: '0.82rem', color: deadline.color, whiteSpace: 'nowrap' }}>
                      {deadline.label}
                    </span>
                  )}
                </div>
              </div>

              {/* Tabs for Notes, Attachments, Contacts */}
              <Tabs.Root defaultValue="notes" style={{ marginTop: 'var(--space-4)' }}>
                <Tabs.List style={{
                  display: 'flex',
                  gap: 'var(--space-1)',
                  borderBottom: '1px solid var(--border-subtle)',
                  marginBottom: 'var(--space-4)',
                }}>
                  <Tabs.Trigger value="notes" style={{
                    padding: 'var(--space-2) var(--space-4)',
                    fontSize: '0.85rem',
                    fontWeight: 500,
                    borderBottom: '2px solid transparent',
                    color: 'var(--text-secondary)',
                    background: 'none',
                    cursor: 'pointer',
                  }} className="btn">
                    <MessageSquare size={13} /> Notes {task.notes?.length > 0 && `(${task.notes.length})`}
                  </Tabs.Trigger>
                  <Tabs.Trigger value="attachments" style={{
                    padding: 'var(--space-2) var(--space-4)',
                    fontSize: '0.85rem',
                    fontWeight: 500,
                    borderBottom: '2px solid transparent',
                    color: 'var(--text-secondary)',
                    background: 'none',
                    cursor: 'pointer',
                  }} className="btn">
                    <Paperclip size={13} /> Attachments {task.attachments?.length > 0 && `(${task.attachments.length})`}
                  </Tabs.Trigger>
                  <Tabs.Trigger value="contacts" style={{
                    padding: 'var(--space-2) var(--space-4)',
                    fontSize: '0.85rem',
                    fontWeight: 500,
                    borderBottom: '2px solid transparent',
                    color: 'var(--text-secondary)',
                    background: 'none',
                    cursor: 'pointer',
                  }} className="btn">
                    <Users size={13} /> Contacts {task.contacts?.length > 0 && `(${task.contacts.length})`}
                  </Tabs.Trigger>
                </Tabs.List>

                {/* Notes Tab */}
                <Tabs.Content value="notes">
                  <div style={{ marginBottom: 'var(--space-3)' }}>
                    <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                      <textarea
                        ref={noteInputRef}
                        className="task-modal-textarea"
                        placeholder="Add a note... (supports markdown)"
                        value={noteInput}
                        onChange={(e) => setNoteInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && e.ctrlKey) handleAddNote();
                        }}
                        style={{ minHeight: 60 }}
                      />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-2)' }}>
                      <button className="btn btn-primary" onClick={handleAddNote} disabled={!noteInput.trim()}>
                        <Plus size={14} /> Add Note
                      </button>
                    </div>
                  </div>

                  {/* Note List */}
                  <div>
                    {(task.notes || []).slice().reverse().map(note => (
                      <div key={note.id} className="note-item">
                        <div className="note-timestamp">
                          {format(new Date(note.createdAt), 'MMM d, yyyy h:mm a')}
                        </div>
                        <div className="note-content">
                          <ReactMarkdown>{note.content}</ReactMarkdown>
                        </div>
                        <button
                          className="note-delete btn-icon"
                          onClick={() => deleteNote(taskId, note.id)}
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </Tabs.Content>

                {/* Attachments Tab */}
                <Tabs.Content value="attachments">
                  <div style={{ marginBottom: 'var(--space-3)' }}>
                    <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                      <select
                        className="task-modal-input"
                        value={attachType}
                        onChange={(e) => setAttachType(e.target.value)}
                        style={{ width: 120, flexShrink: 0 }}
                      >
                        <option value="link">Link</option>
                        <option value="document">Document</option>
                        <option value="image">Image</option>
                        <option value="video">Video</option>
                        <option value="code">Code</option>
                      </select>
                      <input
                        className="task-modal-input"
                        placeholder="Title (optional)"
                        value={attachTitle}
                        onChange={(e) => setAttachTitle(e.target.value)}
                        style={{ flex: 1 }}
                      />
                    </div>
                    <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                      <input
                        className="task-modal-input"
                        placeholder="URL or path..."
                        value={attachUrl}
                        onChange={(e) => setAttachUrl(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleAddAttachment();
                        }}
                        style={{ flex: 1 }}
                      />
                      <button className="btn btn-primary" onClick={handleAddAttachment} disabled={!attachUrl.trim()}>
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Attachment List */}
                  <div>
                    {(task.attachments || []).map(att => {
                      const Icon = ATTACH_ICON_MAP[att.type] || Link;
                      return (
                        <div key={att.id} className="attachment-item">
                          <div className="attachment-icon" style={{ background: 'var(--surface-elevated)' }}>
                            <Icon size={16} style={{ color: 'var(--db-bright-blue)' }} />
                          </div>
                          <div className="attachment-info">
                            <div className="attachment-name">{att.title}</div>
                            <div className="attachment-url">{att.url}</div>
                          </div>
                          <a href={att.url} target="_blank" rel="noopener noreferrer" className="btn-icon"
                            onClick={(e) => e.stopPropagation()}>
                            <ExternalLink size={14} />
                          </a>
                          <button className="btn-icon btn-danger" onClick={() => removeAttachment(taskId, att.id)}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </Tabs.Content>

                {/* Contacts Tab */}
                <Tabs.Content value="contacts">
                  <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
                    <input
                      className="task-modal-input"
                      placeholder="Contact name..."
                      value={contactInput}
                      onChange={(e) => setContactInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAddContact();
                      }}
                      style={{ flex: 1 }}
                    />
                    <button className="btn btn-primary" onClick={handleAddContact} disabled={!contactInput.trim()}>
                      <Plus size={14} /> Add
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                    {(task.contacts || []).map((contact, idx) => (
                      <div key={idx} className="contact-chip">
                        <div
                          className="contact-chip-avatar"
                          style={{ background: generateColor(contact.name || contact.id) }}
                        >
                          {getInitials(contact.name)}
                        </div>
                        <span>{contact.name}</span>
                        <button
                          className="btn-icon"
                          style={{ width: 18, height: 18 }}
                          onClick={() => handleRemoveContact(idx)}
                        >
                          <X size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                </Tabs.Content>
              </Tabs.Root>

              {/* Tags */}
              <div className="task-modal-field" style={{ marginTop: 'var(--space-4)' }}>
                <div className="task-modal-field-label"><Tag size={13} /> Tags</div>
                <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', marginBottom: 'var(--space-2)' }}>
                  {(task.tags || []).map((tag) => (
                    <span key={tag} className="task-card-tag" style={{ cursor: 'pointer' }} onClick={() => handleRemoveTag(tag)}>
                      #{tag} <X size={10} style={{ display: 'inline', marginLeft: 2 }} />
                    </span>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                  <input
                    className="task-modal-input"
                    placeholder="Add tag..."
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddTag();
                    }}
                    style={{ flex: 1 }}
                  />
                  <button className="btn btn-ghost" onClick={handleAddTag} disabled={!tagInput.trim()}>
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              {/* Description */}
              <div className="task-modal-field">
                <div className="task-modal-field-label">
                  <FileText size={13} /> Description
                  <button
                    className="btn btn-ghost"
                    style={{ fontSize: '0.72rem', marginLeft: 'auto', padding: '0 var(--space-2)' }}
                    onClick={() => setShowPreview(!showPreview)}
                  >
                    {showPreview ? 'Edit' : 'Preview'}
                  </button>
                </div>
                {showPreview ? (
                  <div className="note-item" style={{ minHeight: 80 }}>
                    <ReactMarkdown>{task.description || '*No description*'}</ReactMarkdown>
                  </div>
                ) : (
                  <textarea
                    className="task-modal-textarea"
                    placeholder="Add a description (supports markdown)..."
                    value={task.description || ''}
                    onChange={(e) => updateTask(taskId, { description: e.target.value })}
                  />
                )}
              </div>

              {/* Metadata */}
              <div style={{ fontSize: '0.72rem', color: 'var(--neutral-600)', marginTop: 'var(--space-4)', fontFamily: 'var(--font-mono)' }}>
                Created {format(new Date(task.createdAt), 'MMM d, yyyy h:mm a')}
                {task.updatedAt && ` · Updated ${format(new Date(task.updatedAt), 'MMM d h:mm a')}`}
                {task.focusTime > 0 && ` · ${task.focusTime}m focused`}
              </div>
            </div>
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

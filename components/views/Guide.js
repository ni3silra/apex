import { BookOpen, Zap, Calendar, Users, Trash2, Keyboard, Search, Target, LayoutDashboard, Grid2x2, List, BarChart3 } from 'lucide-react';

export default function Guide() {
  return (
    <div className="view-container animate-fade-in" style={{ padding: 'var(--space-8)' }}>
      <div className="view-header" style={{ marginBottom: 'var(--space-6)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <div style={{ background: 'var(--neutral-700)', padding: 'var(--space-2)', borderRadius: 'var(--radius-md)' }}>
            <BookOpen size={24} style={{ color: 'var(--text-primary)' }} />
          </div>
          <div>
            <h1 className="view-title">Sukoon Guide</h1>
            <p className="view-subtitle">Cultivate mindful productivity</p>
          </div>
        </div>
      </div>

      <div style={{ 
        background: 'var(--surface-elevated)', 
        borderRadius: 'var(--radius-lg)', 
        padding: 'var(--space-8)',
        border: '1px solid var(--border-subtle)',
        maxWidth: '800px',
        margin: '0 auto',
        lineHeight: 1.6,
        color: 'var(--text-primary)'
      }}>
        
        <h2 style={{ color: 'var(--text-primary)', marginBottom: 'var(--space-4)', fontSize: '1.5rem' }}>Welcome to Sukoon</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-6)' }}>
          Sukoon is a mindful task management space built around the Eisenhower Matrix methodology. It helps you clear your mind and prioritize tasks based on their Urgency and Importance, ensuring you spend your time peacefully on what truly matters.
        </p>

        <h3 style={{ color: 'var(--text-primary)', margin: 'var(--space-6) 0 var(--space-4) 0', fontSize: '1.2rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 'var(--space-2)' }}>1. The Core Philosophy</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>The matrix divides tasks into four distinct quadrants:</p>
        <ul style={{ color: 'var(--text-secondary)', marginLeft: 'var(--space-5)', marginBottom: 'var(--space-6)' }}>
          <li style={{ marginBottom: 'var(--space-2)' }}><strong style={{ color: 'var(--danger)' }}>Q1: Do First (Urgent & Important)</strong> - Immediate needs and deadlines. Handle these first to restore peace.</li>
          <li style={{ marginBottom: 'var(--space-2)' }}><strong style={{ color: 'var(--primary)' }}>Q2: Schedule (Important, Not Urgent)</strong> - Long-term strategy, development, and planning. These require dedicated focus time.</li>
          <li style={{ marginBottom: 'var(--space-2)' }}><strong style={{ color: 'var(--warning)' }}>Q3: Delegate (Urgent, Not Important)</strong> - Interruptions and meetings. Find someone else to do these if possible.</li>
          <li style={{ marginBottom: 'var(--space-2)' }}><strong style={{ color: 'var(--neutral-500)' }}>Q4: Eliminate (Not Urgent & Not Important)</strong> - Distractions and time-wasters. Delete them.</li>
        </ul>

        <h3 style={{ color: 'var(--text-primary)', margin: 'var(--space-6) 0 var(--space-4) 0', fontSize: '1.2rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 'var(--space-2)' }}>2. Views and Navigation</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>Navigate through the system using the sidebar or keyboard shortcuts.</p>
        <ul style={{ color: 'var(--text-secondary)', marginLeft: 'var(--space-5)', marginBottom: 'var(--space-6)' }}>
          <li style={{ marginBottom: 'var(--space-2)' }}><strong>Dashboard (<code style={{background:'var(--surface)', padding:'2px 4px', borderRadius:'4px'}}>D</code>)</strong>: A high-level overview of your workload, daily intention, and upcoming deadlines.</li>
          <li style={{ marginBottom: 'var(--space-2)' }}><strong>Matrix (<code style={{background:'var(--surface)', padding:'2px 4px', borderRadius:'4px'}}>M</code>)</strong>: The core Eisenhower Matrix view. Drag and drop tasks between quadrants to reprioritize them visually.</li>
          <li style={{ marginBottom: 'var(--space-2)' }}><strong>Priority Queue (<code style={{background:'var(--surface)', padding:'2px 4px', borderRadius:'4px'}}>P</code>)</strong>: A flat, linear list of your active tasks sorted by urgency and importance. Perfect for heads-down execution.</li>
          <li style={{ marginBottom: 'var(--space-2)' }}><strong>Focus Mode (<code style={{background:'var(--surface)', padding:'2px 4px', borderRadius:'4px'}}>F</code>)</strong>: A dedicated timer to execute tasks with deep, uninterrupted focus. Focus time is tracked automatically.</li>
          <li style={{ marginBottom: 'var(--space-2)' }}><strong>Analytics (<code style={{background:'var(--surface)', padding:'2px 4px', borderRadius:'4px'}}>A</code>)</strong>: Deep insights into your productivity, completion velocity, and impact analysis over time.</li>
        </ul>

        <h3 style={{ color: 'var(--text-primary)', margin: 'var(--space-6) 0 var(--space-4) 0', fontSize: '1.2rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 'var(--space-2)' }}>3. Task Management Features</h3>
        <ul style={{ color: 'var(--text-secondary)', marginLeft: 'var(--space-5)', marginBottom: 'var(--space-6)' }}>
          <li style={{ marginBottom: 'var(--space-2)' }}><strong>Tags</strong>: Add hashtags to your tasks (e.g., <code>#marketing</code>, <code>#v2-release</code>). Filter the entire application by clicking tags in the sidebar.</li>
          <li style={{ marginBottom: 'var(--space-2)' }}><strong>Impact Tracking</strong>: Assign qualitative impact (Very High, High, Medium, Low) to understand the <em>value</em> of your completed work, not just the volume.</li>
          <li style={{ marginBottom: 'var(--space-2)' }}><strong>Focus Tracking</strong>: Time spent in Focus Mode is automatically logged against the specific task.</li>
        </ul>

        <h3 style={{ color: 'var(--text-primary)', margin: 'var(--space-6) 0 var(--space-4) 0', fontSize: '1.2rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 'var(--space-2)' }}>4. Keyboard Shortcuts</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>Power users can navigate entirely via the keyboard:</p>
        <ul style={{ color: 'var(--text-secondary)', marginLeft: 'var(--space-5)', marginBottom: 'var(--space-6)' }}>
          <li style={{ marginBottom: 'var(--space-2)' }}><strong>⌘/Ctrl+N</strong>: Quick Add a new task from anywhere.</li>
          <li style={{ marginBottom: 'var(--space-2)' }}><strong>⌘/Ctrl+K</strong>: Open the global Command Palette to search tasks and jump to views.</li>
          <li style={{ marginBottom: 'var(--space-2)' }}><strong>⌘/Ctrl+Shift+F</strong>: Enter deep focus mode.</li>
          <li style={{ marginBottom: 'var(--space-2)' }}><strong>⌘/Ctrl+1/2/3/4</strong>: Jump to specific quadrants.</li>
        </ul>

        <h3 style={{ color: 'var(--text-primary)', margin: 'var(--space-6) 0 var(--space-4) 0', fontSize: '1.2rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 'var(--space-2)' }}>5. Storage</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>
          All your data is stored securely. If you connected a local folder, your data remains safe on your own device. Cloud syncing allows you to bring your mindful space across all your devices.
        </p>

      </div>
    </div>
  );
}

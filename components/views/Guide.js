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
        <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>The matrix divides tasks into four distinct quadrants, helping you filter out noise and focus on deep, meaningful work:</p>
        <ul style={{ color: 'var(--text-secondary)', marginLeft: 'var(--space-5)', marginBottom: 'var(--space-6)' }}>
          <li style={{ marginBottom: 'var(--space-2)' }}><strong style={{ color: 'var(--danger)' }}>Q1: Do First (Urgent & Important)</strong> - Immediate needs and deadlines. Handle these first to restore peace to your day and prevent stress from accumulating.</li>
          <li style={{ marginBottom: 'var(--space-2)' }}><strong style={{ color: 'var(--primary)' }}>Q2: Schedule (Important, Not Urgent)</strong> - Long-term strategy, personal growth, and planning. These require dedicated focus time and are the key to true, mindful productivity.</li>
          <li style={{ marginBottom: 'var(--space-2)' }}><strong style={{ color: 'var(--warning)' }}>Q3: Delegate (Urgent, Not Important)</strong> - Interruptions and meetings. Mindfully protect your time by finding someone else to do these if possible, allowing you to stay in flow.</li>
          <li style={{ marginBottom: 'var(--space-2)' }}><strong style={{ color: 'var(--neutral-500)' }}>Q4: Eliminate (Not Urgent & Not Important)</strong> - Distractions and time-wasters. Delete them without guilt to maintain mental clarity and avoid burnout.</li>
        </ul>

        <h3 style={{ color: 'var(--text-primary)', margin: 'var(--space-6) 0 var(--space-4) 0', fontSize: '1.2rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 'var(--space-2)' }}>2. Mindful Navigation</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>Move through the system seamlessly to maintain your flow state.</p>
        <ul style={{ color: 'var(--text-secondary)', marginLeft: 'var(--space-5)', marginBottom: 'var(--space-6)' }}>
          <li style={{ marginBottom: 'var(--space-2)' }}><strong>Dashboard (<code style={{background:'var(--surface)', padding:'2px 4px', borderRadius:'4px'}}>D</code>)</strong>: A high-level, calm overview of your workload, daily intention, and upcoming deadlines. Start your morning here to set the right tone.</li>
          <li style={{ marginBottom: 'var(--space-2)' }}><strong>Matrix (<code style={{background:'var(--surface)', padding:'2px 4px', borderRadius:'4px'}}>M</code>)</strong>: The core Eisenhower Matrix view. Visually organize your chaos by dragging tasks into their proper quadrants of priority.</li>
          <li style={{ marginBottom: 'var(--space-2)' }}><strong>Priority Queue (<code style={{background:'var(--surface)', padding:'2px 4px', borderRadius:'4px'}}>P</code>)</strong>: A quiet, linear list of your active tasks sorted by urgency and importance. Perfect for when you need to put your head down and execute one thing at a time.</li>
          <li style={{ marginBottom: 'var(--space-2)' }}><strong>Focus Mode (<code style={{background:'var(--surface)', padding:'2px 4px', borderRadius:'4px'}}>F</code>)</strong>: A serene, dedicated timer to execute tasks with deep, uninterrupted focus. Let the timer hold your attention while you work mindfully.</li>
          <li style={{ marginBottom: 'var(--space-2)' }}><strong>Analytics (<code style={{background:'var(--surface)', padding:'2px 4px', borderRadius:'4px'}}>A</code>)</strong>: Reflect on your productivity, completion velocity, and impact. Use this data to celebrate your wins and avoid overworking.</li>
        </ul>

        <h3 style={{ color: 'var(--text-primary)', margin: 'var(--space-6) 0 var(--space-4) 0', fontSize: '1.2rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 'var(--space-2)' }}>3. Intentional Task Management</h3>
        <ul style={{ color: 'var(--text-secondary)', marginLeft: 'var(--space-5)', marginBottom: 'var(--space-6)' }}>
          <li style={{ marginBottom: 'var(--space-2)' }}><strong>Tags</strong>: Add hashtags to your tasks (e.g., <code>#marketing</code>, <code>#v2-release</code>). Filter the noise out of your application by clicking tags in the sidebar to only see what matters right now.</li>
          <li style={{ marginBottom: 'var(--space-2)' }}><strong>Impact Tracking</strong>: Assign qualitative impact (Very High, High, Medium, Low) to understand the <em>value</em> of your completed work. True productivity is about impact, not just crossing items off a list.</li>
          <li style={{ marginBottom: 'var(--space-2)' }}><strong>Focus Tracking</strong>: Time spent in Focus Mode is automatically logged, allowing you to reflect on how much deep work you achieve daily.</li>
        </ul>

        <h3 style={{ color: 'var(--text-primary)', margin: 'var(--space-6) 0 var(--space-4) 0', fontSize: '1.2rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 'var(--space-2)' }}>4. Frictionless Shortcuts</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>Keep your hands on the keyboard to minimize distractions and maintain your focus:</p>
        <ul style={{ color: 'var(--text-secondary)', marginLeft: 'var(--space-5)', marginBottom: 'var(--space-6)' }}>
          <li style={{ marginBottom: 'var(--space-2)' }}><strong>⌘/Ctrl+N</strong>: Quick Add a new task before you forget it, then immediately return to what you were doing.</li>
          <li style={{ marginBottom: 'var(--space-2)' }}><strong>⌘/Ctrl+K</strong>: Open the Command Palette to swiftly search and navigate without reaching for the mouse.</li>
          <li style={{ marginBottom: 'var(--space-2)' }}><strong>⌘/Ctrl+Shift+F</strong>: Instantly enter deep focus mode and block out the world.</li>
          <li style={{ marginBottom: 'var(--space-2)' }}><strong>⌘/Ctrl+1/2/3/4</strong>: Jump directly to specific quadrants of your mind.</li>
        </ul>

        <h3 style={{ color: 'var(--text-primary)', margin: 'var(--space-6) 0 var(--space-4) 0', fontSize: '1.2rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 'var(--space-2)' }}>5. Secure & Private Storage</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>
          Your thoughts and tasks are deeply personal. All your data is stored securely. If you connect a local folder, your data remains completely private on your own device. Cloud syncing allows you to bring your mindful space across all your devices, safely and seamlessly.
        </p>

      </div>
    </div>
  );
}

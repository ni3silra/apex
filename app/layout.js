import './globals.css';
import { Toaster } from 'sonner';

export const metadata = {
  title: 'Sukoon — Mindful Productivity & Focus',
  description: 'A mindful task management center. Prioritize with peace and clarity.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: 'var(--surface-elevated)',
              border: '1px solid var(--border-medium)',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-sans)',
              boxShadow: 'var(--shadow-lg)'
            },
          }}
        />
      </body>
    </html>
  );
}

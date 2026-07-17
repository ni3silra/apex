import './globals.css';
import { Toaster } from 'sonner';

export const metadata = {
  title: 'APEX — Eisenhower Task Command Center',
  description: 'F1-precision task management with the Eisenhower Matrix. Prioritize like a champion.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster
          position="bottom-right"
          theme="dark"
          toastOptions={{
            style: {
              background: '#1A1F4A',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#F1F5F9',
              fontFamily: 'Inter, sans-serif',
            },
          }}
        />
      </body>
    </html>
  );
}

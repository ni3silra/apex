'use client';
import { useRef } from 'react';
import useTaskStore from '@/stores/useTaskStore';
import { toast } from 'sonner';
import { Download, Upload, FileJson } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ExportImport() {
  const exportData = useTaskStore(s => s.exportData);
  const importData = useTaskStore(s => s.importData);
  const fileInputRef = useRef(null);

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `apex-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Data exported');
  };

  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        importData(data);
        toast.success(`Imported ${data.tasks?.length || 0} tasks`);
      } catch {
        toast.error('Invalid file format');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="export-panel">
      <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>
        Data Management
      </h3>

      <div className="export-option" onClick={handleExport}>
        <Download size={20} style={{ color: 'var(--db-bright-blue)' }} />
        <div>
          <div style={{ fontWeight: 600 }}>Export Data</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Download all tasks as JSON</div>
        </div>
      </div>

      <div className="export-option" onClick={() => fileInputRef.current?.click()}>
        <Upload size={20} style={{ color: 'var(--f1-green)' }} />
        <div>
          <div style={{ fontWeight: 600 }}>Import Data</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Load tasks from a JSON backup</div>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleImport}
        style={{ display: 'none' }}
      />
    </div>
  );
}

'use client';
import { useState } from 'react';
import useSettingsStore from '@/stores/useSettingsStore';
import useTaskStore from '@/stores/useTaskStore';
import { pickDirectory, getDirectory, isFileSystemSupported } from '@/lib/storage';
import { motion } from 'framer-motion';
import { HardDrive, FolderOpen, X, Shield, CheckCircle } from 'lucide-react';

export default function StorageSetup() {
  const setStorageSetup = useSettingsStore(s => s.setStorageSetup);
  const setStorageReady = useSettingsStore(s => s.setStorageReady);
  const storageReady = useSettingsStore(s => s.storageReady);
  const [picking, setPicking] = useState(false);
  const [error, setError] = useState(null);

  const handlePickFolder = async () => {
    setPicking(true);
    setError(null);
    try {
      const handle = await pickDirectory();
      if (handle) {
        setStorageReady(true);
        // Re-persist current data to new folder
        await useTaskStore.getState().persist();
        setStorageSetup(false);
      }
    } catch (err) {
      setError('Failed to set up storage folder. Please try again.');
    }
    setPicking(false);
  };

  const handleSkip = () => {
    setStorageSetup(false);
  };

  const fsSupported = isFileSystemSupported();

  return (
    <div className="storage-setup-overlay animate-fade-in" onClick={handleSkip}>
      <motion.div
        className="storage-setup"
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="btn-icon" onClick={handleSkip} style={{ position: 'absolute', top: 16, right: 16 }}>
          <X size={18} />
        </button>

        <div className="storage-setup-icon">
          <HardDrive size={32} />
        </div>

        <h2>Local System Storage</h2>

        {storageReady ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
              <CheckCircle size={20} style={{ color: 'var(--success)' }} />
              <span style={{ color: 'var(--success)', fontWeight: 600 }}>Storage folder connected</span>
            </div>
            <p>Your tasks are saved as JSON files on your local disk. Even clearing browser data won&apos;t lose your work.</p>
            <div className="storage-setup-buttons">
              <button className="btn btn-primary" onClick={handlePickFolder} style={{ width: '100%', justifyContent: 'center', padding: 'var(--space-3)' }}>
                <FolderOpen size={16} /> Change Folder
              </button>
              <button className="btn btn-ghost" onClick={handleSkip} style={{ width: '100%', justifyContent: 'center' }}>
                Close
              </button>
            </div>
          </>
        ) : fsSupported ? (
          <>
            <p>
              Pick a folder on your computer to save APEX data. Your tasks will be stored as
              readable <code>.json</code> files that survive browser resets and are Git-trackable.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              <Shield size={14} style={{ color: 'var(--success)' }} />
              Files stay on your computer. Nothing is uploaded.
            </div>
            {error && (
              <div style={{ color: 'var(--danger)', fontSize: '0.85rem', marginBottom: 'var(--space-3)' }}>{error}</div>
            )}
            <div className="storage-setup-buttons">
              <button
                className="btn btn-primary"
                onClick={handlePickFolder}
                disabled={picking}
                style={{ width: '100%', justifyContent: 'center', padding: 'var(--space-3)' }}
              >
                <FolderOpen size={16} /> {picking ? 'Selecting...' : 'Choose Data Folder'}
              </button>
              <button className="btn btn-ghost" onClick={handleSkip} style={{ width: '100%', justifyContent: 'center' }}>
                Skip — use browser storage for now
              </button>
            </div>
          </>
        ) : (
          <>
            <p>
              Your browser doesn&apos;t support the File System Access API. Data is saved to
              IndexedDB which survives normal cache clears. For full filesystem storage, use
              Chrome or Edge.
            </p>
            <div className="storage-setup-buttons">
              <button className="btn btn-ghost" onClick={handleSkip} style={{ width: '100%', justifyContent: 'center' }}>
                Got it
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}

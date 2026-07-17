'use client';
import { useState } from 'react';
import useSettingsStore from '@/stores/useSettingsStore';
import useTaskStore from '@/stores/useTaskStore';
import { pickDirectory, getDirectory, isFileSystemSupported, clearStorageHandle } from '@/lib/storage';
import StorageProviderGrid from './StorageProviderGrid';
import { motion } from 'framer-motion';
import { HardDrive, FolderOpen, X, Shield, CheckCircle, Trash2, Settings, User, AlertTriangle } from 'lucide-react';

export default function StorageSetup() {
  const setStorageSetup = useSettingsStore(s => s.setStorageSetup);
  const setStorageReady = useSettingsStore(s => s.setStorageReady);
  const storageReady = useSettingsStore(s => s.storageReady);
  const storageProvider = useSettingsStore(s => s.storageProvider);
  const setStorageProvider = useSettingsStore(s => s.setStorageProvider);
  const userName = useSettingsStore(s => s.userName);
  const setUserName = useSettingsStore(s => s.setUserName);
  const [picking, setPicking] = useState(false);
  const [error, setError] = useState(null);

  const [activeTab, setActiveTab] = useState('profile');

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
        style={{ 
          maxWidth: '700px', 
          width: '90%', 
          height: '450px',
          maxHeight: '80vh', 
          overflow: 'hidden', 
          display: 'flex', 
          flexDirection: 'column',
          padding: 0 
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-4)', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <Settings size={20} />
            <h2 style={{ margin: 0, fontSize: '1.2rem' }}>Settings</h2>
          </div>
          <button className="btn-icon" onClick={handleSkip}>
            <X size={18} />
          </button>
        </div>

        {/* Body Layout */}
        <div className="settings-layout" style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          
          {/* Sidebar */}
          <div className="settings-sidebar" style={{ 
            width: '200px', 
            borderRight: '1px solid var(--border-subtle)', 
            padding: 'var(--space-4)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-2)',
            background: 'var(--surface)',
            flexShrink: 0
          }}>
            <button 
              className={`btn ${activeTab === 'profile' ? 'btn-primary' : 'btn-ghost'}`} 
              onClick={() => setActiveTab('profile')}
              style={{ justifyContent: 'flex-start', padding: '8px 12px' }}
            >
              <User size={16} /> Profile
            </button>
            <button 
              className={`btn ${activeTab === 'storage' ? 'btn-primary' : 'btn-ghost'}`} 
              onClick={() => setActiveTab('storage')}
              style={{ justifyContent: 'flex-start', padding: '8px 12px' }}
            >
              <HardDrive size={16} /> Storage
            </button>
            <button 
              className={`btn ${activeTab === 'reset' ? 'btn-danger' : 'btn-ghost'}`} 
              onClick={() => setActiveTab('reset')}
              style={{ justifyContent: 'flex-start', padding: '8px 12px', color: activeTab !== 'reset' ? 'var(--danger)' : undefined }}
            >
              <AlertTriangle size={16} /> Reset
            </button>
          </div>

          {/* Content Area */}
          <div style={{ flex: 1, padding: 'var(--space-6)', overflowY: 'auto' }}>
            {activeTab === 'profile' && (
              <div className="animate-fade-in">
                <h3 style={{ fontSize: '1.1rem', marginBottom: 'var(--space-4)' }}>Profile</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 'var(--space-4)', borderBottom: '1px solid var(--border-subtle)' }}>
                  <div style={{ flex: 1, paddingRight: 'var(--space-4)' }}>
                    <h4 style={{ fontSize: '0.95rem', margin: '0 0 var(--space-2) 0' }}>Your Name</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
                      This name will be displayed on your dashboard and daily briefing.
                    </p>
                  </div>
                  <div>
                    <input 
                      type="text" 
                      value={userName} 
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="e.g. Nitin"
                      style={{
                        padding: '8px 12px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-subtle)',
                        background: 'var(--surface-sunken)',
                        color: 'var(--text-primary)',
                        fontSize: '0.9rem',
                        width: '180px'
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'storage' && (
              <div className="animate-fade-in">
                <StorageProviderGrid handlePickFolder={handlePickFolder} picking={picking} />
              </div>
            )}

            {activeTab === 'reset' && (
              <div className="animate-fade-in">
                <h3 style={{ fontSize: '1.1rem', color: 'var(--danger)', marginBottom: 'var(--space-4)' }}>Danger Zone</h3>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 'var(--space-4)', borderBottom: '1px solid var(--border-subtle)' }}>
                  <div style={{ flex: 1, paddingRight: 'var(--space-4)' }}>
                    <h4 style={{ fontSize: '0.95rem', margin: '0 0 var(--space-2) 0' }}>Reset Storage Location</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
                      Disconnect the current local folder. Your data will remain in the browser's storage until you connect a new folder.
                    </p>
                  </div>
                  <div>
                    <button 
                      className="btn btn-ghost"
                      onClick={async () => {
                        if (window.confirm('Are you sure you want to disconnect the local storage folder?')) {
                          await clearStorageHandle();
                          setStorageReady(false);
                          setStorageSetup(false);
                        }
                      }}
                      style={{ border: '1px solid var(--border-subtle)', padding: '6px 12px', fontSize: '0.85rem', whiteSpace: 'nowrap' }}
                    >
                      Disconnect Folder
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 'var(--space-4)' }}>
                  <div style={{ flex: 1, paddingRight: 'var(--space-4)' }}>
                    <h4 style={{ fontSize: '0.95rem', color: 'var(--danger)', margin: '0 0 var(--space-2) 0' }}>Reset Entire Command Center</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
                      This will permanently delete all tasks, tags, and contacts. This action cannot be undone.
                    </p>
                  </div>
                  <div>
                    <button 
                      onClick={() => {
                        if (window.confirm('Are you sure you want to reset the entire Command Center? This will delete all tasks and tags permanently.')) {
                          useTaskStore.getState().clearAllData();
                          setStorageSetup(false);
                        }
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        padding: '6px 12px',
                        background: 'var(--danger)',
                        border: 'none',
                        borderRadius: 'var(--radius-md)',
                        color: 'white',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      <Trash2 size={14} />
                      Hard Reset
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Global Save Button */}
        <div style={{ padding: 'var(--space-4)', borderTop: '1px solid var(--border-subtle)', background: 'var(--surface-sunken)' }}>
          <button 
            className="btn btn-primary" 
            onClick={handleSkip} 
            style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
          >
            <CheckCircle size={16} style={{ marginRight: 8 }} /> Save Settings
          </button>
        </div>

      </motion.div>
    </div>
  );
}

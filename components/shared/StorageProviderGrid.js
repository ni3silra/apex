'use client';

import { useState } from 'react';
import useSettingsStore from '@/stores/useSettingsStore';
import { HardDrive, CheckCircle } from 'lucide-react';
import { FaGoogleDrive } from 'react-icons/fa';
import { TbBrandOnedrive } from 'react-icons/tb';
import { isFileSystemSupported } from '@/lib/storage';
import { toast } from 'sonner';

export default function StorageProviderGrid({ handlePickFolder, picking }) {
  const { storageProvider } = useSettingsStore();

  const handleCloudClick = (providerName) => {
    toast.info(`${providerName} integration is coming soon!`, {
      description: 'Cloud sync will be available in a future update.',
    });
  };

  const GridButton = ({ active, icon, label, onClick, disabled }) => (
    <button 
      className="provider-grid-btn"
      onClick={onClick}
      disabled={disabled || picking}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        padding: '24px',
        borderRadius: 'var(--radius-lg)',
        border: `2px solid ${active ? 'var(--primary)' : 'var(--border-subtle)'}`,
        background: active ? 'rgba(var(--primary-rgb), 0.1)' : 'var(--surface-sunken)',
        cursor: (disabled || picking) ? 'not-allowed' : 'pointer',
        opacity: (disabled || picking) ? 0.6 : 1,
        transition: 'all 0.2s',
        position: 'relative'
      }}
    >
      {active && (
        <div style={{ position: 'absolute', top: 8, right: 8, color: 'var(--primary)' }}>
          <CheckCircle size={18} fill="currentColor" color="var(--surface)" />
        </div>
      )}
      {icon}
      <span style={{ fontWeight: 600, fontSize: '0.9rem', color: active ? 'var(--primary)' : 'var(--text-primary)' }}>{label}</span>
    </button>
  );

  return (
    <div>
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: 'var(--space-2)' }}>Storage Locations</h3>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Choose where your Command Center saves data. Connecting a cloud drive allows you to sync tasks across devices effortlessly. Your files are saved as simple, readable JSON documents.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-4)' }}>
        {/* Google Drive */}
        <GridButton 
          active={storageProvider === 'gdrive'} 
          icon={<FaGoogleDrive size={32} color="#1FA463" />} 
          label="Google Drive" 
          onClick={() => handleCloudClick('Google Drive')} 
        />

        {/* OneDrive */}
        <GridButton 
          active={storageProvider === 'onedrive'} 
          icon={<TbBrandOnedrive size={32} color="#0078D4" />} 
          label="OneDrive" 
          onClick={() => handleCloudClick('OneDrive')} 
        />

        {/* Local File System */}
        <GridButton 
          active={storageProvider === 'local'} 
          icon={<HardDrive size={32} color="var(--text-primary)" />} 
          label="Local Folder" 
          onClick={handlePickFolder}
          disabled={!isFileSystemSupported()}
        />
      </div>

      {(!isFileSystemSupported() && storageProvider !== 'local') && (
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 'var(--space-4)', textAlign: 'center' }}>
          Your browser does not support Local Folder picking. Use a cloud drive instead.
        </p>
      )}
    </div>
  );
}

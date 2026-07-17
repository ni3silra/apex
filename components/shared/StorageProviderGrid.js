'use client';

import { useState, useEffect } from 'react';
import useSettingsStore from '@/stores/useSettingsStore';
import useTaskStore from '@/stores/useTaskStore';
import { createGDriveFolder } from '@/lib/providers/gdrive';
import { createOneDriveFolder } from '@/lib/providers/onedrive';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import { PublicClientApplication } from '@azure/msal-browser';
import { FolderOpen, Cloud, CheckCircle, HardDrive } from 'lucide-react';
import { isFileSystemSupported } from '@/lib/storage';

let msalInstance = null;

function GoogleLoginAction({ onSuccess, onError, children }) {
  const login = useGoogleLogin({
    onSuccess,
    onError,
    scope: 'https://www.googleapis.com/auth/drive.file'
  });

  return children(login);
}

export default function StorageProviderGrid({ handlePickFolder, picking }) {
  const [loading, setLoading] = useState(false);
  
  const { 
    storageProvider, 
    cloudToken, 
    googleClientId,
    onedriveClientId,
    setStorageProvider, 
    setCloudToken, 
    setCloudFolderId,
    setGoogleClientId,
    setOnedriveClientId
  } = useSettingsStore();

  useEffect(() => {
    if (onedriveClientId && !msalInstance) {
      msalInstance = new PublicClientApplication({
        auth: {
          clientId: onedriveClientId,
          authority: 'https://login.microsoftonline.com/common',
          redirectUri: typeof window !== 'undefined' ? window.location.origin : '',
        }
      });
      msalInstance.initialize().catch(console.error);
    }
  }, [onedriveClientId]);

  const handleGoogleSuccess = async (tokenResponse) => {
    setLoading(true);
    try {
      const token = tokenResponse.access_token;
      const folderId = await createGDriveFolder(token, 'APEX Command Center');
      
      setCloudToken(token);
      setCloudFolderId(folderId);
      setStorageProvider('gdrive');
      await useTaskStore.getState().persist();
    } catch (err) {
      console.error(err);
      alert('Failed to setup Google Drive folder.');
    } finally {
      setLoading(false);
    }
  };

  const handleOneDriveClick = async () => {
    let clientId = onedriveClientId;
    if (!clientId) {
      clientId = window.prompt("To connect OneDrive, please enter your Microsoft Client ID:", "");
      if (!clientId) return;
      setOnedriveClientId(clientId);
      // Initialize MSAL immediately
      msalInstance = new PublicClientApplication({
        auth: {
          clientId: clientId,
          authority: 'https://login.microsoftonline.com/common',
          redirectUri: typeof window !== 'undefined' ? window.location.origin : '',
        }
      });
      await msalInstance.initialize();
    }

    setLoading(true);
    try {
      const response = await msalInstance.loginPopup({
        scopes: ['Files.ReadWrite', 'User.Read']
      });
      const token = response.accessToken;
      const folderId = await createOneDriveFolder(token, 'APEX-Tasks');
      
      setCloudToken(token);
      setCloudFolderId(folderId);
      setStorageProvider('onedrive');
      
      await useTaskStore.getState().persist();
    } catch (err) {
      console.error(err);
      alert('Failed to setup OneDrive.');
    } finally {
      setLoading(false);
    }
  };

  const GridButton = ({ active, icon, label, onClick, disabled }) => (
    <button 
      className="provider-grid-btn"
      onClick={onClick}
      disabled={disabled || loading}
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
        cursor: (disabled || loading) ? 'not-allowed' : 'pointer',
        opacity: (disabled || loading) ? 0.6 : 1,
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

  const googleActionWrapper = (children) => {
    if (!googleClientId) {
      return children(() => {
        const id = window.prompt("To connect Google Drive, please enter your Google Client ID:", "");
        if (id) {
          setGoogleClientId(id);
          alert("Client ID saved! Click the Google Drive icon again to log in.");
        }
      });
    }

    return (
      <GoogleOAuthProvider clientId={googleClientId}>
        <GoogleLoginAction onSuccess={handleGoogleSuccess} onError={(err) => { console.error(err); alert('Google Login Failed'); }}>
          {(login) => children(login)}
        </GoogleLoginAction>
      </GoogleOAuthProvider>
    );
  };

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
        {googleActionWrapper((loginOrPrompt) => (
          <GridButton 
            active={storageProvider === 'gdrive'} 
            icon={
              <svg width="32" height="32" viewBox="0 0 87.3 78" xmlns="http://www.w3.org/2000/svg">
                <path d="m58.3 64.6 14.5-25.1-29.2-50.6h-29l29.2 50.6z" fill="#FFC107"/>
                <path d="m87.3 50.5-14.5-25.1h-58.4l14.6 25.1z" fill="#4285F4"/>
                <path d="m29.1 50.5-14.5-25.1-14.6 25.1 29.1 50.6h29.2z" fill="#34A853"/>
              </svg>
            } 
            label="Google Drive" 
            onClick={loginOrPrompt} 
          />
        ))}

        {/* OneDrive */}
        <GridButton 
          active={storageProvider === 'onedrive'} 
          icon={<Cloud size={32} color="#0078D4" />} 
          label="OneDrive" 
          onClick={handleOneDriveClick} 
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

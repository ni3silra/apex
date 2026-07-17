import { get, set, del } from 'idb-keyval';
import { saveToGDrive, loadFromGDrive } from './providers/gdrive';
import { saveToOneDrive, loadFromOneDrive } from './providers/onedrive';

const DIR_HANDLE_KEY = 'apex-dir-handle';
const STORAGE_VERSION = 1;

// ─── File System Access API helpers ─────────────────────────────

async function getStoredDirHandle() {
  try {
    return await get(DIR_HANDLE_KEY);
  } catch {
    return null;
  }
}

async function verifyPermission(handle) {
  try {
    const opts = { mode: 'readwrite' };
    if ((await handle.queryPermission(opts)) === 'granted') return true;
    if ((await handle.requestPermission(opts)) === 'granted') return true;
    return false;
  } catch {
    return false;
  }
}

async function writeFile(dirHandle, fileName, data) {
  const fileHandle = await dirHandle.getFileHandle(fileName, { create: true });
  const writable = await fileHandle.createWritable();
  await writable.write(JSON.stringify(data, null, 2));
  await writable.close();
}

async function readFile(dirHandle, fileName) {
  try {
    const fileHandle = await dirHandle.getFileHandle(fileName);
    const file = await fileHandle.getFile();
    const text = await file.text();
    return JSON.parse(text);
  } catch {
    return null;
  }
}

// ─── Public API ──────────────────────────────────────────────────

export function isFileSystemSupported() {
  return typeof window !== 'undefined' && 'showDirectoryPicker' in window;
}

export async function pickDirectory() {
  try {
    const dirHandle = await window.showDirectoryPicker({
      id: 'apex-data',
      mode: 'readwrite',
      startIn: 'documents',
    });
    await set(DIR_HANDLE_KEY, dirHandle);
    return dirHandle;
  } catch (err) {
    if (err.name === 'AbortError') return null;
    throw err;
  }
}

export async function getDirectory() {
  const handle = await getStoredDirHandle();
  if (!handle) return null;
  const hasPermission = await verifyPermission(handle);
  return hasPermission ? handle : null;
}

async function getSettings() {
  try {
    return await get('apex-settings');
  } catch {
    return null;
  }
}

export async function saveData(key, data) {
  // Always save to IndexedDB as fallback and quick load
  await set(`apex-${key}`, data);

  const settings = key === 'settings' ? data : await getSettings();
  const provider = settings?.storageProvider || 'local';
  const token = settings?.cloudToken;
  const folderId = settings?.cloudFolderId;

  const payload = { version: STORAGE_VERSION, data, updatedAt: new Date().toISOString() };

  if (provider === 'local') {
    const dirHandle = await getDirectory();
    if (dirHandle) {
      await writeFile(dirHandle, `${key}.json`, payload);
    }
  } else if (provider === 'gdrive' && token) {
    try {
      await saveToGDrive(token, folderId, `${key}.json`, payload);
    } catch (e) { console.error('GDrive save failed', e); }
  } else if (provider === 'onedrive' && token) {
    try {
      await saveToOneDrive(token, folderId, `${key}.json`, payload);
    } catch (e) { console.error('OneDrive save failed', e); }
  }
}

export async function loadData(key) {
  const settings = await getSettings();
  const provider = settings?.storageProvider || 'local';
  const token = settings?.cloudToken;
  const folderId = settings?.cloudFolderId;

  let cloudData = null;

  if (provider === 'local') {
    const dirHandle = await getDirectory();
    if (dirHandle) {
      cloudData = await readFile(dirHandle, `${key}.json`);
    }
  } else if (provider === 'gdrive' && token) {
    try {
      cloudData = await loadFromGDrive(token, folderId, `${key}.json`);
    } catch (e) { console.error('GDrive load failed', e); }
  } else if (provider === 'onedrive' && token) {
    try {
      cloudData = await loadFromOneDrive(token, folderId, `${key}.json`);
    } catch (e) { console.error('OneDrive load failed', e); }
  }

  if (cloudData && cloudData.data) {
    // Sync to IndexedDB
    await set(`apex-${key}`, cloudData.data);
    return cloudData.data;
  }

  // Fallback to IndexedDB
  try {
    return await get(`apex-${key}`);
  } catch {
    return null;
  }
}

export async function hasStorageSetup() {
  const handle = await getStoredDirHandle();
  return !!handle;
}

export async function clearStorageHandle() {
  await del(DIR_HANDLE_KEY);
}

export async function exportAllData(stores) {
  return {
    version: STORAGE_VERSION,
    exportedAt: new Date().toISOString(),
    ...stores,
  };
}

export async function createBackup(dirHandle, allData) {
  const date = new Date().toISOString().split('T')[0];
  try {
    const backupDir = await dirHandle.getDirectoryHandle('backups', { create: true });
    await writeFile(backupDir, `apex-backup-${date}.json`, allData);
    return true;
  } catch {
    return false;
  }
}

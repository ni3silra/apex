export async function saveToGDrive(token, folderId, fileName, data) {
  // 1. Find if file already exists in this folder
  const existingFileId = await getFileId(token, folderId, fileName);

  const fileMetadata = {
    name: fileName,
    mimeType: 'application/json',
    ...(existingFileId ? {} : { parents: [folderId] })
  };

  const fileBody = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const form = new FormData();
  form.append('metadata', new Blob([JSON.stringify(fileMetadata)], { type: 'application/json' }));
  form.append('file', fileBody);

  const url = existingFileId 
    ? `https://www.googleapis.com/upload/drive/v3/files/${existingFileId}?uploadType=multipart`
    : `https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart`;

  const response = await fetch(url, {
    method: existingFileId ? 'PATCH' : 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: form
  });

  if (!response.ok) {
    throw new Error('Failed to save to Google Drive');
  }

  return await response.json();
}

export async function loadFromGDrive(token, folderId, fileName) {
  const fileId = await getFileId(token, folderId, fileName);
  if (!fileId) return null;

  const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    if (response.status === 404) return null;
    throw new Error('Failed to load from Google Drive');
  }

  return await response.json();
}

async function getFileId(token, folderId, fileName) {
  const query = encodeURIComponent(`name='${fileName}' and '${folderId}' in parents and trashed=false`);
  const response = await fetch(`https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name)`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error('Failed to query Google Drive files');
  }

  const data = await response.json();
  if (data.files && data.files.length > 0) {
    return data.files[0].id;
  }
  return null;
}

export async function createGDriveFolder(token, folderName) {
  const response = await fetch('https://www.googleapis.com/drive/v3/files', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder'
    })
  });

  if (!response.ok) {
    throw new Error('Failed to create Google Drive folder');
  }

  const data = await response.json();
  return data.id;
}

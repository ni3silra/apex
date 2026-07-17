export async function saveToOneDrive(token, folderId, fileName, data) {
  // Use Graph API to upload file to the specified folder
  // PUT /me/drive/items/{parent-id}:/{filename}:/content
  
  // If no folderId is provided, fallback to root
  const url = folderId 
    ? `https://graph.microsoft.com/v1.0/me/drive/items/${folderId}:/${fileName}:/content`
    : `https://graph.microsoft.com/v1.0/me/drive/root:/${fileName}:/content`;

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data, null, 2)
  });

  if (!response.ok) {
    throw new Error('Failed to save to OneDrive');
  }

  return await response.json();
}

export async function loadFromOneDrive(token, folderId, fileName) {
  // GET /me/drive/items/{parent-id}:/{filename}:/content
  const url = folderId 
    ? `https://graph.microsoft.com/v1.0/me/drive/items/${folderId}:/${fileName}:/content`
    : `https://graph.microsoft.com/v1.0/me/drive/root:/${fileName}:/content`;

  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    if (response.status === 404) return null;
    throw new Error('Failed to load from OneDrive');
  }

  return await response.json();
}

export async function createOneDriveFolder(token, folderName) {
  // POST /me/drive/root/children
  const response = await fetch('https://graph.microsoft.com/v1.0/me/drive/root/children', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: folderName,
      folder: { },
      '@microsoft.graph.conflictBehavior': 'rename'
    })
  });

  if (!response.ok) {
    throw new Error('Failed to create OneDrive folder');
  }

  const data = await response.json();
  return data.id;
}

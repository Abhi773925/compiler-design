/**
 * File Service
 * Handles interactions with the files API
 */

// Get API base URL based on environment
const getApiBaseUrl = () => {
  return process.env.NODE_ENV === 'development' 
    ? 'http://localhost:5000' 
    : 'https://compiler-design.onrender.com';
};

/**
 * Get all saved files for the authenticated user
 * @returns {Promise} Promise resolving to array of files
 */
export const getUserFiles = async () => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('Not authenticated');
  }
  
  const response = await fetch(`${getApiBaseUrl()}/api/files`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch files');
  }
  
  return data.files;
};

/**
 * Get a specific file by ID
 * @param {string} fileId - The file ID
 * @returns {Promise} Promise resolving to file data
 */
export const getFileById = async (fileId) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('Not authenticated');
  }
  
  const response = await fetch(`${getApiBaseUrl()}/api/files/${fileId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch file');
  }
  
  return data.file;
};

/**
 * Save or update a file
 * @param {object} fileData - The file data
 * @param {string} fileData.name - File name
 * @param {string} fileData.content - File content
 * @param {string} fileData.source - Source of the file ('editor', 'github', etc.)
 * @param {object} fileData.metadata - Additional metadata
 * @param {string} [fileData.fileId] - File ID if updating an existing file
 * @returns {Promise} Promise resolving to saved file data
 */
export const saveFile = async (fileData) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('Not authenticated');
  }
  
  const response = await fetch(`${getApiBaseUrl()}/api/files`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(fileData)
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Failed to save file');
  }
  
  return data;
};

/**
 * Delete a file
 * @param {string} fileId - The file ID to delete
 * @returns {Promise} Promise resolving to deletion status
 */
export const deleteFile = async (fileId) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('Not authenticated');
  }
  
  const response = await fetch(`${getApiBaseUrl()}/api/files/${fileId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Failed to delete file');
  }
  
  return data;
};
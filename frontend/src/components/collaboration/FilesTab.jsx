import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { getUserFiles, getFileById } from '../../services/fileService';

const FilesTab = ({ 
  activeFileId, 
  files, 
  setActiveFileId, 
  onLoadFile, 
  onOpenGitHubModal, 
  roomId,
  handleUploadFile
}) => {
  const fileInputRef = useRef(null);
  const { user } = useAuth();
  const [savedFiles, setSavedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [view, setView] = useState('session'); // 'session', 'saved', 'github'

  // Fetch saved files from the backend
  useEffect(() => {
    if (user && view === 'saved') {
      loadSavedFiles();
    }
  }, [user, view]);

  const loadSavedFiles = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const files = await getUserFiles();
      setSavedFiles(files || []);
    } catch (err) {
      console.error('Error loading saved files:', err);
      setError('Failed to load saved files. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Load a file from the saved files
  const handleLoadSavedFile = async (fileId) => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const file = await getFileById(fileId);
      
      if (file && file.content) {
        // Create file in workspace
        const newFileId = `saved-${Date.now()}`;
        
        // Call the parent component's onLoadFile function
        onLoadFile({
          fileId: newFileId,
          name: file.name,
          content: file.content,
          source: 'database',
          metadata: {
            originalId: file._id,
            ...file.metadata
          }
        });
      }
    } catch (err) {
      console.error('Error loading file:', err);
      setError('Failed to load file. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Get active file name
  const getActiveFileName = () => {
    if (!activeFileId || !files[activeFileId]) return 'untitled';
    return files[activeFileId].name;
  };

  // Get file count 
  const getFileCount = () => {
    return Object.keys(files).length;
  };

  // Render loading state
  const renderLoading = () => (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mb-2"></div>
      <p className="text-gray-500 dark:text-gray-400 text-sm">Loading files...</p>
    </div>
  );

  // Render session files
  const renderSessionFiles = () => (
    <div className="mt-2 space-y-3">
      {/* File Upload Section */}
      <div className="p-3 bg-gray-50 dark:bg-gray-900/40 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Upload New File</h3>
        <div className="flex items-center gap-2">
          <div className="flex-grow relative">
            <input 
              ref={fileInputRef} 
              type="file" 
              onChange={handleUploadFile} 
              className="opacity-0 absolute inset-0 w-full h-full cursor-pointer z-10" 
            />
            <button className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:border-orange-500 dark:hover:border-orange-400 rounded text-sm transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
              Choose a file...
            </button>
          </div>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Upload code files to share with others in this session
        </p>
      </div>
      
      {Object.keys(files).length > 0 ? (
        Object.entries(files).map(([fileId, file]) => (
          <div
            key={fileId}
            onClick={() => setActiveFileId(fileId)}
            className={`px-3 py-2 flex items-center justify-between rounded-md cursor-pointer group ${
              activeFileId === fileId
                ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300'
                : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200'
            }`}
          >
            <div className="flex items-center overflow-hidden">
              {/* File icon based on source */}
              {file.fromGitHub ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              ) : file.fromCache ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              )}
              
              {/* File name with truncation */}
              <span className="truncate mr-1">
                {file.name || 'untitled'}
              </span>
            </div>
            
            {/* Active indicator */}
            {activeFileId === fileId && (
              <span className="w-2 h-2 rounded-full bg-orange-500"></span>
            )}
          </div>
        ))
      ) : (
        <div className="text-center py-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto mb-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-gray-500 dark:text-gray-400 mb-2">No files in this session</p>
          <button
            onClick={onOpenGitHubModal}
            className="text-sm text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-300 transition-colors"
          >
            Load from GitHub
          </button>
        </div>
      )}
    </div>
  );

  // Render saved files
  const renderSavedFiles = () => (
    <div className="mt-2 space-y-1">
      {error && (
        <div className="mb-4 p-2 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm rounded-md">
          {error}
        </div>
      )}
      
      {loading ? (
        renderLoading()
      ) : savedFiles.length > 0 ? (
        savedFiles.map(file => (
          <div
            key={file._id}
            onClick={() => handleLoadSavedFile(file._id)}
            className="px-3 py-2 flex items-center justify-between rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 group"
          >
            <div className="flex items-center overflow-hidden">
              {file.source === 'github' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              )}
              <div className="overflow-hidden">
                <span className="block truncate">{file.name}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {new Date(file.lastAccessed || file.updatedAt).toLocaleDateString()} • {file.metadata?.repoName || 'Personal file'}
                </span>
              </div>
            </div>
            
            {/* Load icon */}
            <span className="opacity-0 group-hover:opacity-100 transition-opacity">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </span>
          </div>
        ))
      ) : (
        <div className="text-center py-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto mb-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
          </svg>
          <p className="text-gray-500 dark:text-gray-400 mb-1">You don't have any saved files</p>
          <p className="text-sm text-gray-400 dark:text-gray-500">Files from GitHub are automatically saved</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="p-2">
      {/* Tab navigation */}
      <div className="flex rounded-md border border-gray-200 dark:border-gray-700 overflow-hidden mb-2">
        <button
          onClick={() => setView('session')}
          className={`flex-1 py-2 text-sm ${
            view === 'session'
              ? 'bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
          }`}
        >
          Session ({getFileCount()})
        </button>
        <button
          onClick={() => {
            setView('saved');
            if (user) loadSavedFiles();
          }}
          className={`flex-1 py-2 text-sm ${
            view === 'saved'
              ? 'bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
          }`}
          disabled={!user}
        >
          Saved Files
        </button>
      </div>
      
      {/* Add file button */}
      <div className="flex justify-between items-center my-2">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {view === 'session' ? 'Current Files' : 'Your Saved Files'}
        </h3>
        
        <div className="flex space-x-1">
          {view === 'session' && (
            <button
              onClick={onOpenGitHubModal}
              className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors"
              title="Load from GitHub"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </button>
          )}
          
          {view === 'saved' && (
            <button
              onClick={loadSavedFiles}
              className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors"
              title="Refresh"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          )}
        </div>
      </div>
      
      {/* Files list based on active view */}
      {view === 'session' ? renderSessionFiles() : renderSavedFiles()}
      
      {/* Info message for unauthenticated users */}
      {!user && view === 'saved' && (
        <div className="mt-4 p-3 bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-800 rounded-md text-sm">
          <p className="text-orange-700 dark:text-orange-300">
            <span className="font-medium">Sign in</span> to save and manage your files across sessions.
          </p>
        </div>
      )}
    </div>
  );
};

export default FilesTab;
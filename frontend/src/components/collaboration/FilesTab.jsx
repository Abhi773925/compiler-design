import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { getUserFiles, getFileById } from '../../services/fileService';

const FilesTab = forwardRef(({ 
  activeFileId, 
  files, 
  setActiveFileId, 
  onLoadFile, 
  onOpenGitHubModal, 
  roomId,
  handleUploadFile
}, ref) => {
  const fileInputRef = useRef(null);
  const { user } = useAuth();
  const lastFileChangeRef = useRef(Date.now());
  
  // Debounced file selection handler
  const onFileSelect = (fileId) => {
    // Prevent rapid changes by enforcing a minimum delay between changes
    const now = Date.now();
    const timeSinceLastChange = now - lastFileChangeRef.current;
    
    if (timeSinceLastChange < 500) { // 500ms minimum delay
      return;
    }

    // Only change if it's a different file and the file exists
    if (fileId !== activeFileId && files[fileId]) {
      lastFileChangeRef.current = now;
      setActiveFileId(fileId);
    }
  };
  const [savedFiles, setSavedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [view, setView] = useState('session'); // 'session', 'saved', 'github'
  const [showCreateFileModal, setShowCreateFileModal] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [newFileContent, setNewFileContent] = useState('');

  // Fetch saved files from the backend
  useEffect(() => {
    if (user) {
      console.log('Loading saved files for user:', user.name || user.id);
      loadSavedFiles();
    }
  }, [user]);
  
  // Also reload files when the view changes to 'saved'
  useEffect(() => {
    if (view === 'saved' && user) {
      console.log('Loading saved files when switching to saved view');
      loadSavedFiles();
    }
  }, [view]);
  
  // Also load saved files when first mounting if user is already logged in
  useEffect(() => {
    if (user) {
      console.log('Initial load of saved files');
      loadSavedFiles();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadSavedFiles = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const files = await getUserFiles();
      console.log('Loaded saved files:', files);
      setSavedFiles(files || []);
    } catch (err) {
      console.error('Error loading saved files:', err);
      // More specific error message based on the error
      if (err.message === 'Not authenticated') {
        setError('Please log in to view your saved files.');
      } else {
        setError('Failed to load saved files. Please try again.');
      }
      setSavedFiles([]); // Reset saved files on error
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
      console.log('Retrieved file from database:', file);
      
      if (file && file.content) {
        // Create file in workspace
        const newFileId = `saved-${file._id}-${Date.now()}`;
        
        // Call the parent component's onLoadFile function with complete file data
        const fileData = {
          fileId: newFileId,
          name: file.name,
          content: file.content,
          source: 'database',
          _id: file._id,
          metadata: {
            originalId: file._id,
            ...(file.metadata || {})
          }
        };
        
        // Add any GitHub-related info if this was a GitHub file
        if (file.source === 'github' && file.metadata) {
          fileData.fromGitHub = true;
          fileData.path = file.metadata.path;
          fileData.repo = file.metadata.repo;
          fileData.sha = file.metadata.sha;
        }
        
        console.log('Loading file with data:', fileData);
        onLoadFile(fileData);
      } else {
        setError(`File "${file?.name || 'unknown'}" couldn't be loaded or has no content.`);
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
        Object.entries(files).map(([fileId, file]) => {
          // Get file extension and determine icon
          const ext = file.name ? file.name.split('.').pop().toLowerCase() : '';
          const getFileIcon = () => {
            switch (ext) {
              case 'js':
                return (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4 mr-2 text-yellow-400">
                    <path fill="currentColor" d="M3 3h18v18H3V3m4.73 15.04c.4.85 1.19 1.55 2.54 1.55 1.5 0 2.53-.8 2.53-2.55v-5.78h-1.7V17c0 .86-.35 1.08-.9 1.08-.58 0-.82-.4-1.09-.87l-1.38.83m5.98-.18c.5.98 1.51 1.73 3.09 1.73 1.6 0 2.8-.83 2.8-2.36 0-1.41-.81-2.04-2.25-2.66l-.42-.18c-.73-.31-1.04-.52-1.04-1.02 0-.41.31-.73.81-.73.48 0 .8.21 1.09.73l1.31-.87c-.55-.96-1.33-1.33-2.4-1.33-1.51 0-2.48.96-2.48 2.23 0 1.38.81 2.03 2.03 2.55l.42.18c.78.34 1.24.55 1.24 1.13 0 .48-.45.83-1.15.83-.83 0-1.31-.43-1.67-1.03l-1.38.80z"/>
                  </svg>
                );
              case 'jsx':
                return (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4 mr-2 text-blue-400">
                    <path fill="currentColor" d="M12 10.11c1.03 0 1.87.84 1.87 1.89 0 1-.84 1.85-1.87 1.85s-1.87-.85-1.87-1.85c0-1.05.84-1.89 1.87-1.89M7.37 20c.63.38 2.01-.2 3.6-1.7-.52-.59-1.03-1.23-1.51-1.9-.82-.08-1.63-.2-2.4-.36-.51 2.14-.32 3.61.31 3.96m.71-5.74l-.29-.51c-.11.29-.22.58-.29.86.27.06.57.11.88.16l-.3-.51m6.54-.76l.81-1.5-.81-1.5c-.3-.53-.62-1-.91-1.47C13.17 9 12.6 9 12 9c-.6 0-1.17 0-1.71.03-.29.47-.61.94-.91 1.47L8.57 12l.81 1.5c.3.53.62 1 .91 1.47.54.03 1.11.03 1.71.03.6 0 1.17 0 1.71-.03.29-.47.61-.94.91-1.47M12 6.78c-.19.22-.39.45-.59.72h1.18c-.2-.27-.4-.5-.59-.72m0 10.44c.19-.22.39-.45.59-.72h-1.18c.2.27.4.5.59.72M16.62 4c-.62-.38-2 .2-3.59 1.7.52.59 1.03 1.23 1.51 1.9.82.08 1.63.2 2.4.36.51-2.14.32-3.61-.32-3.96m-.7 5.74l.29.51c.11-.29.22-.58.29-.86-.27-.06-.57-.11-.88-.16l.3.51m1.45-7.05c1.47.84 1.63 3.05 1.01 5.63 2.54.75 4.37 1.99 4.37 3.68s-1.83 2.93-4.37 3.68c.62 2.58.46 4.79-1.01 5.63-1.46.84-3.45-.12-5.37-1.95-1.92 1.83-3.91 2.79-5.38 1.95-1.46-.84-1.62-3.05-1-5.63-2.54-.75-4.37-1.99-4.37-3.68s1.83-2.93 4.37-3.68c-.62-2.58-.46-4.79 1-5.63 1.47-.84 3.46.12 5.38 1.95 1.92-1.83 3.91-2.79 5.37-1.95M17.08 12c.34.75.64 1.5.89 2.26 2.1-.63 3.28-1.53 3.28-2.26s-1.18-1.63-3.28-2.26c-.25.76-.55 1.51-.89 2.26M6.92 12c-.34-.75-.64-1.5-.89-2.26-2.1.63-3.28 1.53-3.28 2.26s1.18 1.63 3.28 2.26c.25-.76.55-1.51.89-2.26m9 2.26l-.3.51c.31-.05.61-.1.88-.16-.07-.28-.18-.57-.29-.86l-.29.51m-2.89 4.04c1.59 1.5 2.97 2.08 3.59 1.7.64-.35.83-1.82.32-3.96-.77.16-1.58.28-2.4.36-.48.67-.99 1.31-1.51 1.9M8.02 2.5c.93-.16 2.03.29 3.2 1.2 1.17-.91 2.27-1.36 3.2-1.2.93.16 1.61.85 1.61.85s-.79.48-1.73 1.28c-.79.65-1.67 1.45-2.53 2.28l-1.5-.84-.9.68c-.26.17-.51.35-.77.53-.1.07-.21.15-.31.23-.11.09-.22.17-.33.26h4.2l.31.93.38 1.08.33.94c-.02.02-.03.04-.05.07l-.73 1.34-.83 1.48c.16 0 .32.01.48.01L9.69 16h4.62l.14 1.02c-.17 0-.33.01-.48.01l-.84-1.48c-.24-.43-.47-.86-.69-1.28L11.95 15h-4.2c.11.09.22.17.33.26.1.08.21.16.31.23.26.18.51.36.77.53l.9.68 1.5-.84c.86.83 1.74 1.63 2.53 2.28.94.8 1.73 1.28 1.73 1.28s-.68.69-1.61.85c-.93.16-2.03-.29-3.2-1.2-1.17.91-2.27 1.36-3.2 1.2-.93-.16-1.61-.85-1.61-.85s.79-.48 1.73-1.28c.79-.65 1.67-1.45 2.53-2.28l1.5.84.9-.68c.26-.17.51-.35.77-.53.1-.07.21-.15.31-.23.11-.09.22-.17.33-.26h-4.2l-.31-.93-.38-1.08L8.27 12c.02-.02.03-.04.05-.07l.73-1.34.84-1.48c-.17 0-.32-.01-.48-.01L12.31 8H7.69l-.14-1.02c.16 0 .32-.01.48-.01l.84 1.48c.24.43.47.86.69 1.28l.39.74h4.2c-.11-.09-.22-.17-.33-.26-.1-.08-.21-.16-.31-.23-.26-.18-.51-.36-.77-.53l-.9-.68-1.5.84c-.86-.83-1.74-1.63-2.53-2.28-.94-.8-1.73-1.28-1.73-1.28s.68-.69 1.61-.85z"/>
                  </svg>
                );
              case 'ts':
                return (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4 mr-2 text-blue-500">
                    <path fill="currentColor" d="M3 3h18v18H3V3m4.73 15.04c.4.85 1.19 1.55 2.54 1.55 1.5 0 2.53-.8 2.53-2.55v-5.78h-1.7V17c0 .86-.35 1.08-.9 1.08-.58 0-.82-.4-1.09-.87l-1.38.83m7.98-.18c.72.72 1.67 1.14 2.8 1.14 2.35 0 3.74-1.56 3.74-4v-.1c0-2.36-1.49-4-3.74-4-1.15 0-2.1.44-2.8 1.14V8.99h-1.71v11.62h1.71v-.75zm2.55-.15c-1.44 0-2.3-1.06-2.3-2.81v-.1c0-1.75.86-2.81 2.3-2.81s2.32 1.06 2.32 2.81v.1c0 1.75-.88 2.81-2.32 2.81z"/>
                  </svg>
                );
              case 'py':
                return (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4 mr-2 text-blue-500">
                    <path fill="currentColor" d="M19.14 7.5A2.86 2.86 0 0 1 22 10.36v3.78A2.86 2.86 0 0 1 19.14 17H12c0 .39.32.71.71.71H17v1.79c0 .66-.54 1.2-1.2 1.2H8.2c-.66 0-1.2-.54-1.2-1.2v-3.78A2.86 2.86 0 0 1 9.86 13H17c0-.39-.32-.71-.71-.71H12V9.5A2.86 2.86 0 0 1 14.86 7h3.78c.26 0 .5.21.5.5m-8.28 7.43c-.28 0-.5.22-.5.5v1.79c0 .28.22.5.5.5h1.79c.28 0 .5-.22.5-.5v-1.79c0-.28-.22-.5-.5-.5h-1.79zm7-5.86c-.28 0-.5.22-.5.5v1.79c0 .28.22.5.5.5h1.79c.28 0 .5-.22.5-.5V9.57c0-.28-.22-.5-.5-.5h-1.79z"/>
                  </svg>
                );
              case 'cpp':
              case 'c':
                return (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4 mr-2 text-blue-600">
                    <path fill="currentColor" d="M10.5 15.97L10.91 18.41C10.65 18.55 10.23 18.68 9.67 18.8C9.1 18.93 8.43 19 7.66 19C5.45 18.96 3.79 18.3 2.68 17.04C1.56 15.77 1 14.16 1 12.21C1.05 9.9 1.72 8.13 3 6.89C4.32 5.64 5.96 5 7.94 5C8.69 5 9.34 5.07 9.88 5.19C10.42 5.31 10.82 5.44 11.08 5.59L10.5 8.08L9.44 7.74C9.04 7.64 8.58 7.59 8.05 7.59C7.34 7.59 6.79 7.69 6.39 7.89C6 8.08 5.67 8.36 5.42 8.72C5.17 9.08 4.99 9.5 4.89 9.97C4.79 10.44 4.74 10.95 4.74 11.5C4.74 12.8 5.1 13.77 5.81 14.41C6.52 15.05 7.52 15.37 8.82 15.37L9.44 15.33C9.9 15.25 10.31 15.13 10.67 14.96L10.5 15.97M9 11H11V9H13V11H15V13H13V15H11V13H9V11M15.5 15.97L15.91 18.41C15.65 18.55 15.23 18.68 14.67 18.8C14.1 18.93 13.43 19 12.66 19C10.45 18.96 8.79 18.3 7.68 17.04C6.56 15.77 6 14.16 6 12.21C6.05 9.9 6.72 8.13 8 6.89C9.32 5.64 10.96 5 12.94 5C13.69 5 14.34 5.07 14.88 5.19C15.42 5.31 15.82 5.44 16.08 5.59L15.5 8.08L14.44 7.74C14.04 7.64 13.58 7.59 13.05 7.59C12.34 7.59 11.79 7.69 11.39 7.89C11 8.08 10.67 8.36 10.42 8.72C10.17 9.08 9.99 9.5 9.89 9.97C9.79 10.44 9.74 10.95 9.74 11.5C9.74 12.8 10.1 13.77 10.81 14.41C11.52 15.05 12.52 15.37 13.82 15.37L14.44 15.33C14.9 15.25 15.31 15.13 15.67 14.96L15.5 15.97M14 11H16V9H18V11H20V13H18V15H16V13H14V11Z" />
                  </svg>
                );
              default:
                return (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                );
            }
          };

          return (
            <div
              key={fileId}
              onClick={() => onFileSelect(fileId)}
              className={`group flex items-center px-3 py-1 cursor-pointer select-none ${
                activeFileId === fileId
                  ? 'bg-[#094771] text-white'
                  : 'hover:bg-[#2a2d2e] text-gray-300'
              }`}
            >
              <div className="flex items-center overflow-hidden">
                {/* File icon */}
                {getFileIcon()}
                
                {/* File name with optional status dot */}
                <div className="flex items-center">
                  <span className="truncate">
                    {file.name || 'untitled'}
                  </span>
                  {file.unsaved && (
                    <span className="ml-1 text-white text-opacity-60">●</span>
                  )}
                </div>
              </div>
            </div>
          );
        })
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
    <div className="mt-2 space-y-3">
      {error && (
        <div className="mb-4 p-2 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm rounded-md">
          {error}
        </div>
      )}
      
      {/* File Upload Section - similar to Session Files */}
      <div className="p-3 bg-gray-50 dark:bg-gray-900/40 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Create New File</h3>
        <button
          onClick={handleCreateNewFile}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:border-orange-500 dark:hover:border-orange-400 rounded text-sm transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Create a new file...
        </button>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Create custom code files and save them to your account
        </p>
      </div>
      
      {/* GitHub Section */}
      <div className="p-3 bg-gray-50 dark:bg-gray-900/40 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Load From GitHub</h3>
        <button
          onClick={onOpenGitHubModal}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:border-orange-500 dark:hover:border-orange-400 rounded text-sm transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          Open GitHub files...
        </button>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Import files from your GitHub repositories
        </p>
      </div>
      
      {/* Saved Files List */}
      <div className="mt-4">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Your Saved Files</h3>
        
        {loading ? (
          renderLoading()
        ) : savedFiles.length > 0 ? (
          <div className="space-y-2">
            {savedFiles.map(file => (
              <div
                key={file._id}
                onClick={() => handleLoadSavedFile(file._id)}
                className={`px-3 py-2 flex items-center justify-between rounded-md cursor-pointer group hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200`}
              >
                <div className="flex items-center overflow-hidden">
                  {/* File icon based on source */}
                  {file.source === 'github' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  ) : file.source === 'local-upload' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                  ) : file.source === 'custom' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
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
                
                {/* Source badge - small indicator */}
                <div className="flex items-center gap-2">
                  {file.source === 'github' && (
                    <span className="text-xs px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-md whitespace-nowrap">
                      GitHub
                    </span>
                  )}
                  {file.source === 'local-upload' && (
                    <span className="text-xs px-1.5 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-md whitespace-nowrap">
                      Upload
                    </span>
                  )}
                  {file.source === 'custom' && (
                    <span className="text-xs px-1.5 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-md whitespace-nowrap">
                      Custom
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto mb-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-500 dark:text-gray-400 mb-2">No saved files found</p>
            <button
              onClick={loadSavedFiles}
              className="text-sm text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-300 transition-colors"
            >
              Refresh
            </button>
          </div>
        )}
      </div>
    </div>
  );

  // Handle creating a new file
  const handleCreateNewFile = () => {
    setNewFileName('');
    // keep initial content minimal and short; user can edit later
    setNewFileContent('// Write your code here...');
    setShowCreateFileModal(true);
  };
  
  // Handle saving the new custom file
  const handleSaveNewFile = async () => {
    if (!newFileName.trim()) {
      setError('Please enter a file name');
      return;
    }

    try {
      setLoading(true);

      // Use exact filename provided; if no extension, default to .js
      let fileName = newFileName.trim();
      if (!fileName.includes('.')) {
        fileName = `${fileName}.js`;
      }

      const fileId = `custom-${Date.now()}`;

      // If we're in the session view, add to the current session only (no login required)
      if (view === 'session') {
        onLoadFile({
          fileId,
          name: fileName,
          content: newFileContent,
          source: 'custom'
        });

        // Close modal and clear any error
        setShowCreateFileModal(false);
        setError(null);
        setLoading(false);
        return;
      }

      // Otherwise (saved view) we save to DB and require user
      if (!user) {
        setError('Please log in to save files to your account');
        setLoading(false);
        return;
      }

      // Load into editor and request DB save in a single call
      onLoadFile({
        fileId,
        name: fileName,
        content: newFileContent,
        source: 'custom',
        saveToDb: true
      });

      // Refresh saved files shortly after
      setTimeout(() => loadSavedFiles(), 600);

      // Close modal and clear errors
      setShowCreateFileModal(false);
      setError(null);
    } catch (err) {
      console.error('Error creating new file:', err);
      setError('Failed to create file');
    } finally {
      setLoading(false);
    }
  };

  // Get saved files count
  const getSavedFilesCount = () => {
    return savedFiles.length;
  };

  // Expose methods to parent component using ref
  useImperativeHandle(ref, () => ({
    refreshFiles: () => {
      console.log('FilesTab: refreshFiles called');
      if (user) {
        loadSavedFiles();
      }
    },
    setSavedFiles: (files) => {
      setSavedFiles(files);
    },
    getCurrentView: () => view,
    setCurrentView: (newView) => {
      setView(newView);
      if (newView === 'saved' && user) {
        loadSavedFiles();
      }
    },
    // Add a method to force showing the saved files tab
    showSavedFiles: () => {
      setView('saved');
      if (user) {
        loadSavedFiles();
      }
    },
    // Method to get the count of saved files
    getSavedFilesCount
  }));

  // Create File Modal
  const renderCreateFileModal = () => {
    if (!showCreateFileModal) return null;
    
    return (
      <>
        {/* Modal Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          onClick={() => setShowCreateFileModal(false)}
        />
        
        {/* Modal Content */}
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-md w-full p-6 border border-gray-200 dark:border-gray-700"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header with minimal CRCT-themed icon */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-600 dark:text-orange-400" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4 4h12v2H6v12H4V4zM20 8h-2v12H8v2h10a2 2 0 0 0 2-2V8z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Create File</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Enter a filename (include extension if you want — e.g. a.js). The file will be saved to your account and shown with the exact name you provide.
                </p>
              </div>
              <button 
                onClick={() => setShowCreateFileModal(false)} 
                className="p-1 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Error message if any */}
            {error && (
              <div className="mb-5 p-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm rounded-lg border border-red-200 dark:border-red-900/50 flex items-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 dark:text-red-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>{error}</span>
              </div>
            )}
            
            {/* File Name Input */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                File Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  placeholder="Enter file name (e.g. myCode.js)"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-shadow"
                  autoFocus
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 ml-1">
                Add file extension (e.g. .js, .py) or one will be added automatically
              </p>
            </div>
            
            {/* Minimal: no large content input here. Editor will open for editing after creation. */}
            <div className="mb-3 text-sm text-gray-500 dark:text-gray-400">
              {view === 'session' ? (
                <>This will be added to the current session (no sign-in required). You can edit it in the editor.</>
              ) : (
                <>This will be saved to your account and shown under <strong>Saved Files</strong>. You must be signed in.</>
              )}
            </div>
            
            {/* Action Buttons */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowCreateFileModal(false)}
                className="px-5 py-2.5 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNewFile}
                disabled={loading || !newFileName.trim()}
                className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg disabled:opacity-50 disabled:hover:bg-orange-600 flex items-center font-medium transition-colors gap-2 shadow-sm"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create File
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      </>
    );
  };

  return (
    <div className="p-2">
      {/* Create File Modal */}
      {renderCreateFileModal()}
      
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Current Files ({getFileCount()})
        </h3>
      </div>
      
      {/* Add file button */}
      <div className="flex justify-between items-center my-2">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {view === 'session' ? 'Current Files' : 'Your Saved Files'}
        </h3>
        
        <div className="flex space-x-2">
          {/* Create New File button - show in both views with better visibility */}
          <button
            onClick={() => handleCreateNewFile()}
            className={`flex items-center ${view === 'saved' ? 'p-1.5 bg-orange-100 dark:bg-orange-900/30 hover:bg-orange-200 dark:hover:bg-orange-800/40' : 'p-1'} rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors`}
            title="Create New File"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className={`${view === 'saved' ? 'h-4 w-4 text-orange-600 dark:text-orange-400' : 'h-5 w-5'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {view === 'saved' && <span className="ml-1 text-xs font-medium text-orange-600 dark:text-orange-400">New</span>}
          </button>
        
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
});

export default FilesTab;
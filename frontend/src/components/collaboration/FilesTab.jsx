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
    setNewFileContent('// Write your code here...');
    setShowCreateFileModal(true);
  };
  
  // Handle saving the new custom file
  const handleSaveNewFile = async () => {
    if (!user) {
      setError('Please log in to save files');
      return;
    }
    
    if (!newFileName.trim()) {
      setError('Please enter a file name');
      return;
    }
    
    try {
      setLoading(true);
      
      // Add file extension if not present
      let fileName = newFileName.trim();
      if (!fileName.includes('.')) {
        fileName += '.js';  // Default to .js extension
      }
      
      // Create file data object
      const fileData = {
        name: fileName,
        content: newFileContent,
        source: 'custom',  // Mark as custom file
        createdAt: new Date().toISOString()
      };
      
      // First create in current session
      const newFileId = `custom-${Date.now()}`;
      
      // Add to current session files
      const newFile = {
        name: fileName,
        content: newFileContent,
        source: 'custom'
      };
      
      // Load into the editor
      onLoadFile({
        fileId: newFileId,
        ...newFile
      });
      
      // Save to database if user is logged in
      if (user) {
        try {
          console.log('Saving custom file to database:', fileData);
          // Use the onLoadFile function which will handle saving to DB
          onLoadFile({
            fileId: newFileId,
            name: fileName,
            content: newFileContent,
            source: 'custom',
            saveToDb: true  // Flag to indicate this should be saved
          });
          
          // Refresh saved files list
          setTimeout(() => {
            loadSavedFiles();
          }, 500);
        } catch (err) {
          console.error('Error saving custom file:', err);
          setError('Failed to save file to your account');
        }
      }
      
      // Close modal
      setShowCreateFileModal(false);
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
            {/* Modal Header with Icon */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Create Custom File</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Create and save your own code files
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
            
            {/* File Content Input */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Initial Content
              </label>
              <div className="relative">
                <textarea
                  value={newFileContent}
                  onChange={(e) => setNewFileContent(e.target.value)}
                  rows={10}
                  className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-sm leading-relaxed transition-shadow"
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 ml-1">
                You can edit the code in the editor after creating the file
              </p>
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
                className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg disabled:opacity-50 disabled:hover:bg-purple-600 flex items-center font-medium transition-colors gap-2 shadow-sm"
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
          } flex items-center justify-center`}
          disabled={!user}
        >
          <span>Saved Files</span>
          {savedFiles.length > 0 && (
            <span className="ml-1 px-1.5 py-0.5 text-xs bg-orange-200 dark:bg-orange-700 text-orange-800 dark:text-orange-200 rounded-full">
              {savedFiles.length}
            </span>
          )}
        </button>
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
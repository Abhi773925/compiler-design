import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { isGithubAuthenticated, getGithubUser, getRepositories, commitFile, createRepository } from '../../services/githubService';

const GitHubSaveModal = ({ onClose, code, language, fileName = null }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [view, setView] = useState('repos'); // repos, newRepo, path, saving
  
  // Form states
  const [filePath, setFilePath] = useState('');
  const [commitMessage, setCommitMessage] = useState('');
  const [newRepoName, setNewRepoName] = useState('');
  const [newRepoDescription, setNewRepoDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  
  // Default file extension based on language
  const getDefaultExtension = () => {
    const extensions = {
      javascript: 'js',
      python: 'py',
      java: 'java',
      cpp: 'cpp',
      c: 'c',
      csharp: 'cs',
      typescript: 'ts',
      go: 'go',
      rust: 'rs',
      php: 'php',
      ruby: 'rb',
      kotlin: 'kt',
      swift: 'swift',
      r: 'r',
      sql: 'sql',
    };
    return extensions[language] || 'txt';
  };

  // Check GitHub authentication status on component mount
  useEffect(() => {
    const checkAuth = () => {
      const authenticated = isGithubAuthenticated();
      setIsAuthenticated(authenticated);
      
      if (authenticated) {
        loadRepositories();
      }
    };
    
    checkAuth();
  }, []);
  
  // Set default file name based on language when component mounts
  useEffect(() => {
    if (fileName) {
      setFilePath(fileName);
    } else {
      setFilePath(`main.${getDefaultExtension()}`);
    }
  }, [fileName, language]);

  // Load repositories
  const loadRepositories = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const repos = await getRepositories();
      setRepositories(repos);
    } catch (err) {
      console.error('Error loading repositories:', err);
      setError('Failed to load repositories. Please try again.');
      
      // If authentication error, reset auth state
      if (err.message?.includes('authenticated')) {
        setIsAuthenticated(false);
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle repository selection
  const handleSelectRepo = (repo) => {
    setSelectedRepo(repo);
    setView('path');
  };

  // Handle creating a new repository
  const handleCreateRepo = async (e) => {
    e.preventDefault();
    
    if (!newRepoName.trim()) {
      setError('Repository name is required');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      setView('saving');
      
      // Create new repository
      const newRepo = await createRepository(
        newRepoName.trim(),
        newRepoDescription.trim(),
        isPrivate
      );
      
      // Save the file to the new repository
      await commitFile(
        newRepo.owner.login,
        newRepo.name,
        filePath,
        code,
        commitMessage || `Add ${filePath}`
      );
      
      setSuccess(`Successfully created repository and saved ${filePath}`);
      setView('success');
    } catch (err) {
      console.error('Error creating repository:', err);
      setError(err.message || 'Failed to create repository. Please try again.');
      setView('newRepo');
    } finally {
      setLoading(false);
    }
  };

  // Handle saving to existing repository
  const handleSaveFile = async (e) => {
    e.preventDefault();
    
    if (!selectedRepo) {
      setError('Please select a repository');
      return;
    }
    
    if (!filePath.trim()) {
      setError('File path is required');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      setView('saving');
      
      await commitFile(
        selectedRepo.owner.login,
        selectedRepo.name,
        filePath,
        code,
        commitMessage || `Add/Update ${filePath}`
      );
      
      setSuccess(`Successfully saved to ${selectedRepo.full_name}/${filePath}`);
      setView('success');
    } catch (err) {
      console.error('Error saving file:', err);
      setError(err.message || 'Failed to save file. Please try again.');
      setView('path');
    } finally {
      setLoading(false);
    }
  };

  // Render repository list
  const renderRepositoryList = () => (
    <div>
      <h3 className="text-lg font-semibold mb-2">Select a Repository</h3>
      
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setView('newRepo')}
          className="text-sm bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded-md flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          New Repository
        </button>
      </div>
      
      {repositories.length === 0 ? (
        <p className="text-gray-400 text-center py-4">No repositories found</p>
      ) : (
        <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
          {repositories.map(repo => (
            <motion.div
              key={repo.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.01 }}
              className="p-3 bg-gray-800 rounded-md cursor-pointer hover:bg-gray-700"
              onClick={() => handleSelectRepo(repo)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">{repo.name}</h4>
                  <p className="text-xs text-gray-400 truncate max-w-xs">{repo.description || 'No description'}</p>
                </div>
                <div className="flex items-center text-xs">
                  <span className={`inline-block w-2 h-2 rounded-full ${repo.private ? 'bg-red-500' : 'bg-green-500'}`}></span>
                  <span className="ml-1 text-gray-400">{repo.private ? 'Private' : 'Public'}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );

  // Render new repository form
  const renderNewRepoForm = () => (
    <form onSubmit={handleCreateRepo}>
      <h3 className="text-lg font-semibold mb-4">Create New Repository</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Repository Name *</label>
          <input
            type="text"
            value={newRepoName}
            onChange={(e) => setNewRepoName(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="my-awesome-project"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Description (Optional)</label>
          <input
            type="text"
            value={newRepoDescription}
            onChange={(e) => setNewRepoDescription(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="A short description of your repository"
          />
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isPrivate"
            checked={isPrivate}
            onChange={(e) => setIsPrivate(e.target.checked)}
            className="h-4 w-4 text-blue-600 rounded border-gray-700 bg-gray-800 focus:ring-blue-500"
          />
          <label htmlFor="isPrivate" className="ml-2 text-sm text-gray-300">Private repository</label>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">File Path *</label>
          <input
            type="text"
            value={filePath}
            onChange={(e) => setFilePath(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder={`main.${getDefaultExtension()}`}
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Commit Message</label>
          <input
            type="text"
            value={commitMessage}
            onChange={(e) => setCommitMessage(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder={`Add ${filePath}`}
          />
        </div>
      </div>
      
      <div className="flex justify-between mt-6">
        <button
          type="button"
          onClick={() => setView('repos')}
          className="text-gray-400 hover:text-white py-2 px-4"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Repository & Save'}
        </button>
      </div>
    </form>
  );

  // Render file path form
  const renderPathForm = () => (
    <form onSubmit={handleSaveFile}>
      <h3 className="text-lg font-semibold mb-2">Save to {selectedRepo?.name}</h3>
      <p className="text-sm text-gray-400 mb-4">
        Repository: {selectedRepo?.full_name}
      </p>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">File Path *</label>
          <input
            type="text"
            value={filePath}
            onChange={(e) => setFilePath(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder={`main.${getDefaultExtension()}`}
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Use slashes for directories, e.g. "src/main.js"
          </p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Commit Message</label>
          <input
            type="text"
            value={commitMessage}
            onChange={(e) => setCommitMessage(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder={`Add/Update ${filePath}`}
          />
        </div>
      </div>
      
      <div className="flex justify-between mt-6">
        <button
          type="button"
          onClick={() => {
            setSelectedRepo(null);
            setView('repos');
          }}
          className="text-gray-400 hover:text-white py-2 px-4"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save to GitHub'}
        </button>
      </div>
    </form>
  );

  // Render loading state
  const renderLoading = () => (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
      <p className="text-gray-300">
        {view === 'saving' ? 'Saving to GitHub...' : 'Loading...'}
      </p>
    </div>
  );

  // Render success state
  const renderSuccess = () => (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="bg-green-900/30 rounded-full p-3 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <p className="text-lg font-medium text-green-500 mb-1">Success!</p>
      <p className="text-center text-gray-300 mb-6">{success}</p>
      
      <button
        onClick={onClose}
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md"
      >
        Done
      </button>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-gray-900 rounded-xl p-6 max-w-md w-full border border-gray-700 shadow-lg"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
            </svg>
            <h2 className="text-xl font-bold">Save to GitHub</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-900/30 border border-red-800 rounded-md text-red-300">
            {error}
          </div>
        )}

        {!isAuthenticated ? (
          <div className="text-center py-6">
            <p className="mb-6 text-gray-400">You need to connect with GitHub first</p>
            <a
              href="/github-callback?redirect=back"
              className="bg-gray-800 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md border border-gray-700 flex items-center mx-auto inline-flex"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="white" className="mr-2">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              Login with GitHub
            </a>
          </div>
        ) : (
          loading ? renderLoading() :
          view === 'repos' ? renderRepositoryList() :
          view === 'newRepo' ? renderNewRepoForm() :
          view === 'path' ? renderPathForm() :
          view === 'success' ? renderSuccess() :
          null
        )}
      </motion.div>
    </div>
  );
};

export default GitHubSaveModal;
import React, { useState, useEffect } from 'react';
import { authenticateWithGithub, isGithubAuthenticated, getRepositories, getGithubUser, logoutFromGithub, getRepositoryContents, getFileContent } from '../../services/githubService';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

const GitHubIntegration = ({ onSelectFile, onClose }) => {
  const { theme } = useTheme();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [githubUser, setGithubUser] = useState(null);
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPath, setCurrentPath] = useState('');
  const [pathStack, setPathStack] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [contents, setContents] = useState([]);
  const [view, setView] = useState('repos'); // 'repos', 'files', 'loading'

  // Check authentication status on component mount
  useEffect(() => {
    const checkAuthStatus = () => {
      const authenticated = isGithubAuthenticated();
      setIsAuthenticated(authenticated);
      
      if (authenticated) {
        const user = getGithubUser();
        setGithubUser(user);
        loadRepositories();
      }
    };
    
    checkAuthStatus();
  }, []);

  // Load user repositories
  const loadRepositories = async () => {
    try {
      setLoading(true);
      setError(null);
      setView('loading');
      
      const repos = await getRepositories();
      setRepositories(repos);
      setView('repos');
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

  // Handle GitHub login
  const handleLogin = () => {
    // Store current path to return after authentication
    localStorage.setItem('github_return_path', window.location.pathname);
    authenticateWithGithub();
  };

  // Handle GitHub logout
  const handleLogout = () => {
    logoutFromGithub();
    setIsAuthenticated(false);
    setGithubUser(null);
    setRepositories([]);
    setSelectedRepo(null);
    setContents([]);
    setView('repos');
    setPathStack([]);
    setCurrentPath('');
  };

  // Handle repository selection
  const handleSelectRepo = async (repo) => {
    try {
      setLoading(true);
      setError(null);
      setView('loading');
      setSelectedRepo(repo);
      setPathStack([]);
      setCurrentPath('');
      
      const contents = await getRepositoryContents(repo.owner.login, repo.name, '');
      setContents(Array.isArray(contents) ? contents : [contents]);
      setView('files');
    } catch (err) {
      console.error('Error loading repository contents:', err);
      setError('Failed to load repository contents. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle folder navigation
  const handleNavigateFolder = async (item) => {
    if (item.type !== 'dir') return;
    
    try {
      setLoading(true);
      setError(null);
      
      const contents = await getRepositoryContents(
        selectedRepo.owner.login,
        selectedRepo.name,
        item.path
      );
      
      setPathStack([...pathStack, { path: currentPath, contents: contents }]);
      setCurrentPath(item.path);
      setContents(Array.isArray(contents) ? contents : [contents]);
    } catch (err) {
      console.error('Error loading folder contents:', err);
      setError('Failed to load folder contents. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Navigate back in folder hierarchy
  const handleNavigateBack = async () => {
    if (pathStack.length === 0) {
      // Back to repos list
      setSelectedRepo(null);
      setContents([]);
      setView('repos');
      return;
    }
    
    const prevState = pathStack[pathStack.length - 1];
    setCurrentPath(prevState.path);
    setContents(prevState.contents);
    setPathStack(pathStack.slice(0, -1));
  };

  // Load file content and pass to parent component
  const handleSelectFile = async (item) => {
    if (item.type !== 'file') return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Check file size first
      if (item.size > 1000000) { // 1MB limit
        setError(`File is too large (${(item.size/1024/1024).toFixed(2)}MB). Maximum size is 1MB.`);
        setLoading(false);
        return;
      }
      
      // Check file extension and only load text files
      const fileExtension = item.name.split('.').pop().toLowerCase();
      const binaryExtensions = ['exe', 'dll', 'so', 'dylib', 'bin', 'dat', 'jpg', 'jpeg', 'png', 'gif', 'bmp', 'ico', 'zip', 'tar', 'gz', 'pdf'];
      
      if (binaryExtensions.includes(fileExtension)) {
        setError(`Binary files like ${fileExtension} are not supported. Please select a text file.`);
        setLoading(false);
        return;
      }

      console.log(`Loading file: ${item.path} from ${selectedRepo.name}`);
      
      try {
        const fileData = await getFileContent(
          selectedRepo.owner.login,
          selectedRepo.name,
          item.path
        );
        
        if (!fileData || !fileData.content) {
          throw new Error('No content received from GitHub API');
        }
        
        console.log(`File loaded successfully: ${item.name}, content length: ${fileData.content.length} chars`);
        
        // Pass file content and metadata to parent component
        onSelectFile({
          name: item.name,
          content: fileData.content,
          path: item.path,
          repo: {
            name: selectedRepo.name,
            owner: selectedRepo.owner.login,
            url: selectedRepo.html_url,
          },
          sha: fileData.sha,
          size: fileData.size,
        });
        
        // Close modal after selection
        onClose();
      } catch (fileError) {
        console.error('Error loading file content:', fileError);
        setError(`Failed to load file content: ${fileError.message || 'Unknown error'}`);
        
        // Add specific handling for different error types
        if (fileError.message?.includes('too large')) {
          setError('This file is too large to load in the editor. Please select a smaller file.');
        } else if (fileError.message?.includes('decode')) {
          setError('Unable to decode file content. This might be a binary file.');
        }
      }
    } catch (err) {
      console.error('Error loading file:', err);
      setError(`Failed to load file: ${err.message || 'Unknown error'}`);
      
      // If authentication error, prompt to login again
      if (err.message?.includes('authenticated')) {
        setIsAuthenticated(false);
        setError('Your GitHub session has expired. Please log in again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const renderRepositoryList = () => (
    <div className="mt-4 space-y-2 max-h-96 overflow-y-auto">
      {repositories.map(repo => (
        <motion.div
          key={repo.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.01 }}
          className="p-4 bg-white/50 dark:bg-black/50 backdrop-blur-sm rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-800 transition-all duration-300"
          onClick={() => handleSelectRepo(repo)}
        >
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-orange-600 dark:text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            <div>
              <h3 className="text-lg font-medium">{repo.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 truncate max-w-sm">{repo.description || 'No description'}</p>
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span className={`inline-block w-2 h-2 rounded-full mr-1 ${repo.private ? 'bg-red-500' : 'bg-green-500'}`}></span>
                <span>{repo.private ? 'Private' : 'Public'}</span>
                <span className="mx-2">•</span>
                <span>Updated {new Date(repo.updated_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  const renderFileList = () => (
    <div className="mt-4">
      <div className="flex items-center mb-4">
        <button 
          className="flex items-center text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 transition-colors"
          onClick={handleNavigateBack}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <span className="mx-2 text-gray-500">/</span>
        <span className="text-gray-600 dark:text-gray-300 truncate">
          {selectedRepo?.name}{currentPath ? `/${currentPath}` : ''}
        </span>
      </div>
      
      <div className="space-y-1 max-h-96 overflow-y-auto">
        {contents.map((item, index) => (
          <motion.div
            key={item.path || index}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
            className={`p-3 rounded-md flex items-center cursor-pointer ${
              item.type === 'file' 
                ? 'hover:bg-gray-200 dark:hover:bg-gray-700' 
                : 'hover:bg-gray-100 dark:hover:bg-gray-800'
            } transition-colors`}
            onClick={() => item.type === 'dir' ? handleNavigateFolder(item) : handleSelectFile(item)}
          >
            {item.type === 'dir' ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-orange-600 dark:text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            )}
            <span>{item.name}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderLoading = () => (
    <div className="flex flex-col items-center justify-center py-10">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 dark:border-orange-400 mb-4"></div>
      <p className="text-gray-600 dark:text-gray-400">Loading...</p>
    </div>
  );

  return (
    <div className="bg-white/50 dark:bg-black/50 text-gray-900 dark:text-white p-6 rounded-xl border border-gray-200 dark:border-gray-800 w-full max-w-2xl shadow-lg backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="currentColor" 
            className="mr-2 text-orange-600 dark:text-orange-400"
          >
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          <h2 className="text-xl font-bold">GitHub Integration</h2>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-orange-600 dark:hover:text-orange-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-800 rounded-md text-red-600 dark:text-red-300">
          {error}
        </div>
      )}

      {!isAuthenticated ? (
        <div className="text-center py-6">
          <p className="mb-6 text-gray-500 dark:text-gray-400">Connect with GitHub to access your repositories</p>
          <button
            onClick={handleLogin}
            className="bg-orange-600 hover:bg-orange-700 text-white dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white font-medium py-2 px-4 rounded-md border border-orange-600 dark:border-gray-700 flex items-center mx-auto transition-all duration-200"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="currentColor" 
              className="mr-2"
            >
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            Login with GitHub
          </button>
        </div>
      ) : (
        <div>
          {/* User info */}
          {githubUser && (
            <div className="flex items-center justify-between mb-6 bg-white/50 dark:bg-black/50 backdrop-blur-sm p-3 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-orange-500 dark:hover:border-orange-400 transition-all duration-300">
              <div className="flex items-center">
                <img 
                  src={githubUser.avatar_url} 
                  alt={githubUser.login}
                  className="w-8 h-8 rounded-full mr-3 border border-gray-200 dark:border-gray-600" 
                />
                <div>
                  <p className="font-medium">{githubUser.name || githubUser.login}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">@{githubUser.login}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 text-sm transition-colors"
              >
                Logout
              </button>
            </div>
          )}

          {view === 'loading' && renderLoading()}
          {view === 'repos' && renderRepositoryList()}
          {view === 'files' && renderFileList()}
        </div>
      )}
    </div>
  );
};

export default GitHubIntegration;
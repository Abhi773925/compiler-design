import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { handleGithubCallback } from '../../services/githubService';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const GitHubCallback = () => {
  const [status, setStatus] = useState('Processing');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { theme } = useTheme();

  useEffect(() => {
    const processCallback = async () => {
      try {
        // Parse URL parameters
        const queryParams = new URLSearchParams(location.search);
        const code = queryParams.get('code');
        const state = queryParams.get('state');
        
        if (!code) {
          setError('No authorization code received from GitHub');
          setStatus('Failed');
          return;
        }
        
        setStatus('Authenticating with GitHub...');
        
        // Process OAuth callback
        const result = await handleGithubCallback(code, state);
        
        setStatus('Successfully authenticated with GitHub!');
        
        // Redirect back to compiler after short delay
        setTimeout(() => {
          // Get the returnTo parameter or default to compiler page
          const returnTo = localStorage.getItem('github_return_path') || '/compiler';
          localStorage.removeItem('github_return_path'); // Clean up
          navigate(returnTo);
        }, 1500);
      } catch (error) {
        console.error('GitHub callback error:', error);
        setError(error.message || 'Failed to authenticate with GitHub');
        setStatus('Failed');
      }
    };
    
    processCallback();
  }, [location, navigate]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-orange-50/50 via-transparent to-transparent dark:from-orange-950/20 dark:via-transparent dark:to-transparent text-gray-900 dark:text-white p-4">
      <div className="w-full max-w-md bg-white/50 dark:bg-black/50 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 hover:border-orange-500 dark:hover:border-orange-400 transition-all duration-300">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2">GitHub Integration</h1>
          <div className="flex justify-center mb-4">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24"
              className={`w-12 h-12 ${status === 'Failed' ? 'text-red-600 dark:text-red-500' : 'text-green-600 dark:text-green-500'} ${status !== 'Failed' && status !== 'Successfully authenticated with GitHub!' ? 'animate-spin' : ''}`}
              fill="currentColor"
            >
              {status === 'Failed' ? (
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
              ) : status === 'Successfully authenticated with GitHub!' ? (
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              ) : (
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
              )}
            </svg>
          </div>
          <p className="text-lg">{status}</p>
          {error && <p className="text-red-600 dark:text-red-500 mt-4">{error}</p>}
        </div>
        
        {status === 'Failed' && (
          <div className="mt-6">
            <button
              onClick={() => navigate('/compiler')}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Return to Compiler
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GitHubCallback;
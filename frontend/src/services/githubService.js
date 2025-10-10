/**
 * GitHub integration service
 * Handles interactions with GitHub API
 */

// GitHub API endpoints
const GITHUB_API_BASE = 'https://api.github.com';

/**
 * Authenticate with GitHub using OAuth
 * @returns {Promise} Promise resolving to GitHub auth data
 */
export const authenticateWithGithub = () => {
  // GitHub OAuth client ID - hardcoded for production
  const clientId = 'Iv1_IA_Iv0SHGByhx8OA8Ov23lik';
  
  // Redirect URI - must match exactly what's configured in GitHub OAuth app settings
  const redirectUri = `${window.location.origin}/github-callback`;
  
  // Scopes needed for repository operations
  const scope = 'repo';
  
  // State parameter for CSRF protection
  const state = generateRandomState();
  
  // Store state in localStorage for verification when callback returns
  localStorage.setItem('github_auth_state', state);
  
  // Build the authorization URL
  const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&state=${state}`;
  
  // Open GitHub authorization page
  window.location.href = authUrl;
};

/**
 * Handle GitHub OAuth callback
 * @param {string} code - The authorization code from GitHub
 * @param {string} state - The state parameter for verification
 * @returns {Promise} Promise resolving to the access token
 */
export const handleGithubCallback = async (code, state) => {
  console.log('Processing GitHub callback...');
  
  const savedState = localStorage.getItem('github_auth_state');
  
  // Verify state to prevent CSRF attacks
  if (!savedState || state !== savedState) {
    console.error('State verification failed', { 
      receivedState: state, 
      savedState: savedState 
    });
    throw new Error('Invalid state parameter. Authentication attempt may have been compromised.');
  }
  
  // Clear the stored state
  localStorage.removeItem('github_auth_state');
  
  // Determine API URL based on environment
  const apiBaseUrl = process.env.NODE_ENV === 'development' 
    ? 'http://localhost:5000'
    : 'https://compiler-design.onrender.com';
    
  console.log(`Using API base URL: ${apiBaseUrl}`);
  
  try {
    // Exchange code for access token through backend (credentials now hardcoded on server)
    console.log('Exchanging code for token...');
    const response = await fetch(`${apiBaseUrl}/api/github/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error('GitHub token exchange failed:', data);
      throw new Error(data.message || data.error || 'Failed to authenticate with GitHub');
    }
    
    console.log('Token exchange successful');
    
    // Store token in localStorage
    localStorage.setItem('github_access_token', data.access_token);
    
    // Also store user info if returned
    if (data.user) {
      localStorage.setItem('github_user', JSON.stringify(data.user));
      console.log(`Authenticated as GitHub user: ${data.user.login}`);
    }
    
    return data;
  } catch (error) {
    console.error('GitHub callback error:', error);
    throw error;
  }
};

/**
 * Get authenticated user's GitHub repositories
 * @returns {Promise} Promise resolving to array of repositories
 */
export const getRepositories = async () => {
  const token = localStorage.getItem('github_access_token');
  
  if (!token) {
    throw new Error('Not authenticated with GitHub');
  }
  
  const response = await fetch(`${GITHUB_API_BASE}/user/repos?sort=updated`, {
    headers: {
      'Authorization': `token ${token}`,
      'Accept': 'application/vnd.github.v3+json'
    }
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch repositories');
  }
  
  return data;
};

/**
 * Get repository contents at a specific path
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @param {string} path - Path within repository
 * @returns {Promise} Promise resolving to file/directory content
 */
export const getRepositoryContents = async (owner, repo, path = '') => {
  const token = localStorage.getItem('github_access_token');
  
  if (!token) {
    throw new Error('Not authenticated with GitHub');
  }
  
  const response = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${path}`, {
    headers: {
      'Authorization': `token ${token}`,
      'Accept': 'application/vnd.github.v3+json'
    }
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch repository contents');
  }
  
  return data;
};

/**
 * Get a specific file's content from GitHub
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @param {string} path - Path to file
 * @returns {Promise} Promise resolving to file content
 */
export const getFileContent = async (owner, repo, path) => {
  const token = localStorage.getItem('github_access_token');
  
  if (!token) {
    throw new Error('Not authenticated with GitHub');
  }
  
  try {
    console.log(`Fetching file content for ${owner}/${repo}/${path}`);
    
    const response = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${path}`, {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error('GitHub API error:', data);
      throw new Error(data.message || 'Failed to fetch file content');
    }
    
    // GitHub API returns content as base64 encoded
    if (data.encoding === 'base64' && data.content) {
      try {
        // Remove whitespace and line breaks from base64 string
        const cleanContent = data.content.replace(/\s/g, '');
        
        // Robust base64 decoding
        let decodedContent;
        try {
          decodedContent = atob(cleanContent);
        } catch (basicDecodeError) {
          // Try fallback decoding method
          console.warn('Basic atob failed, trying alternative decode method');
          decodedContent = Buffer.from(cleanContent, 'base64').toString('utf-8');
        }
        
        if (!decodedContent) {
          throw new Error('Failed to decode content');
        }
        
        return {
          content: decodedContent,
          sha: data.sha,
          name: data.name,
          path: data.path,
          size: data.size,
        };
      } catch (decodeError) {
        console.error('Error decoding base64 content:', decodeError);
        throw new Error(`Failed to decode file content: ${decodeError.message}`);
      }
    }
    
    // Handle binary or large files that GitHub doesn't provide direct content for
    if (data.encoding === null || !data.content) {
      throw new Error(`File is too large or is binary (${data.size} bytes). Try downloading it directly.`);
    }
    
    return data;
  } catch (error) {
    console.error(`Error fetching file ${path} from ${owner}/${repo}:`, error);
    throw error;
  }
};

/**
 * Create or update a file in a GitHub repository
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @param {string} path - Path to file
 * @param {string} content - File content
 * @param {string} message - Commit message
 * @param {string} sha - Current file SHA (needed for update)
 * @returns {Promise} Promise resolving to the commit result
 */
export const commitFile = async (owner, repo, path, content, message, sha = null) => {
  const token = localStorage.getItem('github_access_token');
  
  if (!token) {
    throw new Error('Not authenticated with GitHub');
  }
  
  const payload = {
    message,
    content: btoa(content), // Base64 encode the content
    ...(sha && { sha }) // Include SHA only if updating an existing file
  };
  
  const response = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${path}`, {
    method: 'PUT',
    headers: {
      'Authorization': `token ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/vnd.github.v3+json'
    },
    body: JSON.stringify(payload)
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Failed to commit file');
  }
  
  return data;
};

/**
 * Create a new repository
 * @param {string} name - Repository name
 * @param {string} description - Repository description
 * @param {boolean} isPrivate - Whether the repository should be private
 * @returns {Promise} Promise resolving to the new repository data
 */
export const createRepository = async (name, description = '', isPrivate = false) => {
  const token = localStorage.getItem('github_access_token');
  
  if (!token) {
    throw new Error('Not authenticated with GitHub');
  }
  
  const response = await fetch(`${GITHUB_API_BASE}/user/repos`, {
    method: 'POST',
    headers: {
      'Authorization': `token ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/vnd.github.v3+json'
    },
    body: JSON.stringify({
      name,
      description,
      private: isPrivate,
      auto_init: true // Initialize with README.md
    })
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Failed to create repository');
  }
  
  return data;
};

/**
 * Check if user is authenticated with GitHub
 * @returns {boolean} Whether user is authenticated
 */
export const isGithubAuthenticated = () => {
  return !!localStorage.getItem('github_access_token');
};

/**
 * Get authenticated GitHub user info
 * @returns {object|null} GitHub user info or null if not authenticated
 */
export const getGithubUser = () => {
  const userJson = localStorage.getItem('github_user');
  return userJson ? JSON.parse(userJson) : null;
};

/**
 * Log out from GitHub
 */
export const logoutFromGithub = () => {
  localStorage.removeItem('github_access_token');
  localStorage.removeItem('github_user');
};

/**
 * Generate random state parameter for OAuth flow
 * @returns {string} Random state string
 */
function generateRandomState() {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}
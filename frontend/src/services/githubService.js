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
  const clientId = 'Ov23likZXqyctlogOjrD';
  
  // Redirect URI - must match exactly what's configured in GitHub OAuth app settings
  const redirectUri = 'https://prep-mates.vercel.app/auth/github/callback';
  
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
  const savedState = localStorage.getItem('github_auth_state');
  
  // Verify state to prevent CSRF attacks
  if (!savedState || state !== savedState) {
    throw new Error('Invalid state parameter. Authentication attempt may have been compromised.');
  }
  
  // Clear the stored state
  localStorage.removeItem('github_auth_state');
  
  // Exchange code for access token through backend with hardcoded credentials
  const response = await fetch('https://compiler-design.onrender.com/api/github/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      code,
      clientId: 'Ov23likZXqyctlogOjrD',
      clientSecret: 'b856bc22601b3161a873aab4224fa1147735f717'
    }),
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Failed to authenticate with GitHub');
  }
  
  // Store token in localStorage
  localStorage.setItem('github_access_token', data.access_token);
  
  // Also store user info if returned
  if (data.user) {
    localStorage.setItem('github_user', JSON.stringify(data.user));
  }
  
  return data;
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
  
  const response = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${path}`, {
    headers: {
      'Authorization': `token ${token}`,
      'Accept': 'application/vnd.github.v3+json'
    }
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch file content');
  }
  
  // GitHub API returns content as base64 encoded
  if (data.encoding === 'base64' && data.content) {
    return {
      content: atob(data.content.replace(/\\n/g, '')),
      sha: data.sha,
      name: data.name,
      path: data.path,
      size: data.size,
    };
  }
  
  return data;
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
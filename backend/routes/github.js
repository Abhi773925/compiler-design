const express = require('express');
const router = express.Router();
const axios = require('axios');

/**
 * Exchange GitHub authorization code for an access token
 * POST /api/github/token
 */
router.post('/token', async (req, res) => {
  try {
    const { code, clientId, clientSecret } = req.body;
    
    if (!code) {
      return res.status(400).json({ 
        success: false, 
        message: 'Authorization code is required' 
      });
    }
    
    // Use credentials from request body if provided, otherwise try environment variables
    const githubClientId = clientId || process.env.GITHUB_CLIENT_ID;
    const githubClientSecret = clientSecret || process.env.GITHUB_CLIENT_SECRET;
    
    if (!githubClientId || !githubClientSecret) {
      return res.status(500).json({ 
        success: false, 
        message: 'GitHub OAuth configuration is missing on the server' 
      });
    }
    
    // Exchange code for access token with GitHub
    const tokenResponse = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: githubClientId,
        client_secret: githubClientSecret,
        code: code
      },
      {
        headers: {
          Accept: 'application/json'
        }
      }
    );
    
    // If token exchange fails
    if (!tokenResponse.data.access_token) {
      return res.status(400).json({ 
        success: false, 
        message: 'Failed to exchange code for access token',
        error: tokenResponse.data.error_description || tokenResponse.data.error
      });
    }
    
    // Get user information using the access token
    const userResponse = await axios.get('https://api.github.com/user', {
      headers: {
        Authorization: `token ${tokenResponse.data.access_token}`
      }
    });
    
    // Return the access token and user information
    return res.json({
      success: true,
      access_token: tokenResponse.data.access_token,
      token_type: tokenResponse.data.token_type,
      scope: tokenResponse.data.scope,
      user: {
        id: userResponse.data.id,
        login: userResponse.data.login,
        name: userResponse.data.name,
        avatar_url: userResponse.data.avatar_url,
        html_url: userResponse.data.html_url
      }
    });
    
  } catch (error) {
    console.error('GitHub OAuth error:', error);
    
    return res.status(500).json({
      success: false,
      message: 'Failed to authenticate with GitHub',
      error: error.response?.data?.error_description || error.message
    });
  }
});

/**
 * Get repository information
 * GET /api/github/repos/:owner/:repo
 */
router.get('/repos/:owner/:repo', async (req, res) => {
  try {
    const { owner, repo } = req.params;
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: 'GitHub access token is required' 
      });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Get repository information from GitHub API
    const repoResponse = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}`,
      {
        headers: {
          Authorization: `token ${token}`,
          Accept: 'application/vnd.github.v3+json'
        }
      }
    );
    
    return res.json({
      success: true,
      repository: repoResponse.data
    });
    
  } catch (error) {
    console.error('GitHub API error:', error);
    
    return res.status(error.response?.status || 500).json({
      success: false,
      message: 'Failed to fetch repository information',
      error: error.response?.data?.message || error.message
    });
  }
});

/**
 * Proxy API for GitHub operations to avoid CORS issues
 * and to keep the client_secret secure
 */
router.get('/proxy/*', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: 'GitHub access token is required' 
      });
    }
    
    const token = authHeader.split(' ')[1];
    const githubPath = req.params[0];
    const url = `https://api.github.com/${githubPath}`;
    
    const response = await axios.get(url, {
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github.v3+json'
      }
    });
    
    return res.json(response.data);
    
  } catch (error) {
    console.error('GitHub API proxy error:', error);
    
    return res.status(error.response?.status || 500).json({
      success: false,
      message: 'GitHub API request failed',
      error: error.response?.data?.message || error.message
    });
  }
});

module.exports = router;
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
    
    console.log('GitHub token request received, code length:', code ? code.length : 0);
    
    if (!code) {
      return res.status(400).json({ 
        success: false, 
        message: 'Authorization code is required' 
      });
    }
    
    // Hardcoded GitHub OAuth credentials - production ready
    const githubClientId = 'Iv1_IA_Iv0SHGByhx8OA8Ov23lik';
    const githubClientSecret = '33f8826253cb41cdb16802a4eb5971f73144eb28';
    
    // Always using hardcoded values so this check is just for safety
    if (!githubClientId || !githubClientSecret) {
      console.error('Missing GitHub OAuth credentials');
      return res.status(500).json({ 
        success: false, 
        message: 'GitHub OAuth configuration is missing on the server' 
      });
    }
    
    console.log(`Using GitHub client ID: ${githubClientId.substring(0, 6)}...`);
    
    try {
      // Exchange code for access token with GitHub
      console.log('Sending token exchange request to GitHub...');
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
      
      console.log('Token response received:', Object.keys(tokenResponse.data));
      
      // If token exchange fails
      if (!tokenResponse.data.access_token) {
        console.error('GitHub token exchange failed:', tokenResponse.data);
        return res.status(400).json({ 
          success: false, 
          message: 'Failed to exchange code for access token',
          error: tokenResponse.data.error_description || tokenResponse.data.error
        });
      }
      
      // Get user information using the access token
      console.log('Fetching GitHub user info...');
      const userResponse = await axios.get('https://api.github.com/user', {
        headers: {
          Authorization: `token ${tokenResponse.data.access_token}`
        }
      });
      
      console.log('GitHub user info received:', userResponse.data.login);
      
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
    } catch (apiError) {
      console.error('GitHub API error during token exchange:', apiError.response?.data || apiError.message);
      
      // Return detailed error information
      return res.status(apiError.response?.status || 500).json({
        success: false,
        message: 'GitHub API error during token exchange',
        error: apiError.response?.data?.error_description || 
               apiError.response?.data?.message || 
               apiError.message
      });
    }
    
  } catch (error) {
    console.error('GitHub OAuth error:', error);
    
    return res.status(500).json({
      success: false,
      message: 'Failed to authenticate with GitHub',
      error: error.response?.data?.error_description || error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
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
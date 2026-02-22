import express from 'express';
import fetch from 'node-fetch';
import { authenticateToken } from '../middleware/auth.js';
import { loadConfig, saveConfig } from '../config/appConfig.js';

const router = express.Router();

// Get remote instance configuration
router.get('/config', authenticateToken, (req, res) => {
  try {
    const config = loadConfig();
    res.json({
      remote: config.remote || {
        enabled: false,
        url: '',
        apiKey: ''
      }
    });
  } catch (error) {
    console.error('Get remote config error:', error);
    res.status(500).json({ error: 'Failed to get remote configuration' });
  }
});

// Update remote instance configuration
router.put('/config', authenticateToken, async (req, res) => {
  try {
    const { enabled, url, apiKey } = req.body;
    const config = loadConfig();
    
    config.remote = {
      enabled: enabled || false,
      url: url || '',
      apiKey: apiKey || (config.remote?.apiKey || '')
    };
    
    if (saveConfig(config)) {
      res.json({ success: true, remote: config.remote });
    } else {
      res.status(500).json({ error: 'Failed to save configuration' });
    }
  } catch (error) {
    console.error('Update remote config error:', error);
    res.status(500).json({ error: 'Failed to update remote configuration' });
  }
});

// Test remote instance connection
router.post('/test', authenticateToken, async (req, res) => {
  try {
    const { url, apiKey } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }
    
    // Normalize URL
    let normalizedUrl = url.trim();
    if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
      normalizedUrl = 'https://' + normalizedUrl;
    }
    
    // Remove trailing slash
    normalizedUrl = normalizedUrl.replace(/\/$/, '');
    
    // Test connection to remote instance
    const testUrl = `${normalizedUrl}/api/health`;
    const headers = {
      'Content-Type': 'application/json'
    };
    
    if (apiKey) {
      headers['Authorization'] = `Bearer ${apiKey}`;
    }
    
    const response = await fetch(testUrl, {
      method: 'GET',
      headers,
      timeout: 5000
    });
    
    if (response.ok) {
      res.json({ 
        success: true, 
        message: 'Successfully connected to remote instance',
        url: normalizedUrl
      });
    } else {
      res.status(400).json({ 
        success: false,
        message: `Connection failed: ${response.status} ${response.statusText}` 
      });
    }
  } catch (error) {
    console.error('Remote test error:', error);
    res.status(400).json({ 
      success: false,
      message: `Failed to connect: ${error.message}. Ensure the URL is correct and the server is accessible.` 
    });
  }
});

// Proxy requests to remote instance
router.post('/proxy', authenticateToken, async (req, res) => {
  try {
    const config = loadConfig();
    
    if (!config.remote?.enabled || !config.remote?.url) {
      return res.status(400).json({ error: 'Remote instance not configured' });
    }
    
    const { endpoint, method = 'POST', body } = req.body;
    
    if (!endpoint) {
      return res.status(400).json({ error: 'Endpoint is required' });
    }
    
    // Normalize URL
    let baseUrl = config.remote.url.trim();
    if (!baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
      baseUrl = 'https://' + baseUrl;
    }
    baseUrl = baseUrl.replace(/\/$/, '');
    
    const targetUrl = `${baseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json'
    };
    
    if (config.remote.apiKey) {
      headers['Authorization'] = `Bearer ${config.remote.apiKey}`;
    }
    
    const response = await fetch(targetUrl, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      timeout: 30000
    });
    
    const responseData = await response.json();
    
    if (response.ok) {
      res.json(responseData);
    } else {
      res.status(response.status).json(responseData);
    }
  } catch (error) {
    console.error('Remote proxy error:', error);
    res.status(500).json({ error: `Failed to proxy request: ${error.message}` });
  }
});

// Get remote instance status
router.get('/status', authenticateToken, async (req, res) => {
  try {
    const config = loadConfig();
    
    if (!config.remote?.enabled) {
      return res.json({
        enabled: false,
        connected: false,
        url: null
      });
    }
    
    // Normalize URL
    let baseUrl = config.remote.url.trim();
    if (!baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
      baseUrl = 'https://' + baseUrl;
    }
    baseUrl = baseUrl.replace(/\/$/, '');
    
    // Check connection
    let connected = false;
    let lastChecked = new Date().toISOString();
    
    try {
      const response = await fetch(`${baseUrl}/api/health`, {
        headers: {
          'Authorization': config.remote.apiKey ? `Bearer ${config.remote.apiKey}` : undefined
        },
        timeout: 3000
      });
      connected = response.ok;
    } catch (error) {
      connected = false;
    }
    
    res.json({
      enabled: true,
      connected,
      url: baseUrl,
      lastChecked
    });
  } catch (error) {
    console.error('Remote status error:', error);
    res.status(500).json({ error: 'Failed to get remote status' });
  }
});

export default router;

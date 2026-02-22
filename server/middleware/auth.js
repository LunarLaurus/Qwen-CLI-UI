import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { userDb } from '../database/db.js';

// Get JWT secret from environment or use default (for development)
const JWT_SECRET = process.env.JWT_SECRET || 'qwen-cli-ui-dev-secret-change-in-production';

// Token expiration (7 days)
const TOKEN_EXPIRATION = '7d';

// Optional API key middleware
const validateApiKey = (req, res, next) => {
  // Skip API key validation if not configured
  if (!process.env.API_KEY) {
    return next();
  }

  const apiKey = req.headers['x-api-key'];
  if (apiKey !== process.env.API_KEY) {
    return res.status(401).json({ error: 'Invalid API key' });
  }
  next();
};

// JWT authentication middleware
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // Verify user still exists and is active
    const user = userDb.getUserById(decoded.userId);
    if (!user) {
      return res.status(401).json({ error: 'Invalid token. User not found.' });
    }

    // Check if multi-user mode is enabled and validate session
    const multiUserEnabled = userDb.getSetting('multi_user_enabled') === 'true';
    if (multiUserEnabled) {
      // Hash token to look up session
      const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
      const session = userDb.getSessionByToken(tokenHash);
      
      if (!session) {
        return res.status(401).json({ error: 'Invalid or expired session.' });
      }
      
      // Update session activity
      userDb.updateSessionActivity(session.id);
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(403).json({ error: 'Invalid token' });
  }
};

// Generate JWT token with optional expiration
const generateToken = (user, options = {}) => {
  const payload = {
    userId: user.id,
    username: user.username,
    role: user.role
  };
  
  const tokenOptions = {};
  if (options.expiresIn) {
    tokenOptions.expiresIn = options.expiresIn;
  } else if (!options.noExpiration) {
    tokenOptions.expiresIn = TOKEN_EXPIRATION;
  }
  
  return jwt.sign(payload, JWT_SECRET, tokenOptions);
};

// WebSocket authentication function
const authenticateWebSocket = (token) => {
  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Verify user exists
    const user = userDb.getUserById(decoded.userId);
    if (!user) {
      return null;
    }
    
    // Check multi-user mode
    const multiUserEnabled = userDb.getSetting('multi_user_enabled') === 'true';
    if (multiUserEnabled) {
      const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
      const session = userDb.getSessionByToken(tokenHash);
      if (!session) {
        return null;
      }
    }
    
    return decoded;
  } catch (error) {
    console.error('WebSocket token verification error:', error);
    return null;
  }
};

// Logout user (invalidate session in multi-user mode)
const logoutUser = (userId, token) => {
  try {
    const multiUserEnabled = userDb.getSetting('multi_user_enabled') === 'true';
    if (multiUserEnabled && token) {
      const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
      userDb.deleteSessionByToken(tokenHash);
    }
    return true;
  } catch (error) {
    console.error('Logout error:', error);
    return false;
  }
};

// Get user from token without middleware (for utilities)
const getUserFromToken = (token) => {
  try {
    if (!token) return null;
    
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = userDb.getUserById(decoded.userId);
    
    if (!user) return null;
    
    // Check multi-user mode
    const multiUserEnabled = userDb.getSetting('multi_user_enabled') === 'true';
    if (multiUserEnabled) {
      const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
      const session = userDb.getSessionByToken(tokenHash);
      if (!session) return null;
    }
    
    return user;
  } catch (error) {
    return null;
  }
};

export {
  validateApiKey,
  authenticateToken,
  generateToken,
  authenticateWebSocket,
  logoutUser,
  getUserFromToken,
  JWT_SECRET,
  TOKEN_EXPIRATION
};
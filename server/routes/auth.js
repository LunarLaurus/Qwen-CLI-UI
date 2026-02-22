import express from 'express';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { userDb } from '../database/db.js';
import { generateToken, authenticateToken, logoutUser } from '../middleware/auth.js';

const router = express.Router();

// Check auth status and setup requirements
router.get('/status', async (req, res) => {
  try {
    const hasUsers = await userDb.hasUsers();
    const multiUserEnabled = userDb.getSetting('multi_user_enabled') === 'true';
    const registrationAllowed = userDb.isRegistrationAllowed();
    
    res.json({
      needsSetup: !hasUsers,
      isAuthenticated: false,
      multiUserEnabled,
      registrationAllowed,
      userCount: userDb.getUserCount()
    });
  } catch (error) {
    console.error('Auth status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// User registration (setup) - only allowed if no users exist or multi-user is enabled
router.post('/register', async (req, res) => {
  try {
    const { username, password, email, displayName } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    if (username.length < 3 || password.length < 6) {
      return res.status(400).json({ error: 'Username must be at least 3 characters, password at least 6 characters' });
    }

    const hasUsers = userDb.hasUsers();
    const multiUserEnabled = userDb.getSetting('multi_user_enabled') === 'true';
    
    if (hasUsers && !multiUserEnabled) {
      return res.status(403).json({ error: 'Registration is disabled. This is a single-user system.' });
    }
    
    if (!userDb.isRegistrationAllowed()) {
      return res.status(403).json({ error: 'Registration is currently disabled or user limit reached.' });
    }

    const existingUser = userDb.getUserByUsername(username);
    if (existingUser) {
      return res.status(409).json({ error: 'Username already exists' });
    }

    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const role = hasUsers ? 'user' : 'admin';

    const user = userDb.createUser(username, passwordHash, {
      email: email || null,
      displayName: displayName || username,
      role,
      preferences: {
        theme: 'system',
        model: 'qwen3-coder-plus'
      }
    });

    const token = generateToken(user);

    if (multiUserEnabled) {
      const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
      userDb.createUserSession(user.id, tokenHash, {
        ipAddress: req.ip,
        userAgent: req.headers['user-agent']
      });
    }

    userDb.updateLastLogin(user.id);

    res.json({
      success: true,
      user: { 
        id: user.id, 
        username: user.username,
        displayName: user.display_name,
        email: user.email,
        role: user.role
      },
      token,
      multiUserEnabled
    });

  } catch (error) {
    console.error('Registration error:', error);
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      res.status(409).json({ error: 'Username already exists' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// User login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const user = userDb.getUserByUsername(username);
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const token = generateToken(user);

    const multiUserEnabled = userDb.getSetting('multi_user_enabled') === 'true';
    if (multiUserEnabled) {
      const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
      userDb.createUserSession(user.id, tokenHash, {
        ipAddress: req.ip,
        userAgent: req.headers['user-agent']
      });
    }

    userDb.updateLastLogin(user.id);

    res.json({
      success: true,
      user: { 
        id: user.id, 
        username: user.username,
        displayName: user.display_name,
        email: user.email,
        role: user.role
      },
      token,
      multiUserEnabled
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get current user (protected route)
router.get('/user', authenticateToken, (req, res) => {
  res.json({
    user: {
      id: req.user.id,
      username: req.user.username,
      displayName: req.user.display_name,
      email: req.user.email,
      role: req.user.role,
      preferences: JSON.parse(req.user.preferences || '{}'),
      avatarUrl: req.user.avatar_url
    }
  });
});

// Update user profile (protected route)
router.put('/user', authenticateToken, async (req, res) => {
  try {
    const { displayName, email, preferences } = req.body;
    
    const updates = {};
    if (displayName !== undefined) updates.display_name = displayName;
    if (email !== undefined) updates.email = email;
    if (preferences !== undefined) updates.preferences = preferences;
    
    const success = userDb.updateUser(req.user.id, updates);
    
    if (success) {
      res.json({ success: true, message: 'Profile updated successfully' });
    } else {
      res.status(400).json({ error: 'No updates provided' });
    }
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Logout (protected route)
router.post('/logout', authenticateToken, (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    logoutUser(req.user.id, token);
    
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all users (admin only)
router.get('/users', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  
  try {
    const users = userDb.getAllUsers();
    res.json({ users });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update application settings (admin only)
router.put('/settings', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  
  try {
    const { multiUserEnabled, allowRegistration, maxUsers } = req.body;
    
    if (multiUserEnabled !== undefined) {
      userDb.setSetting('multi_user_enabled', multiUserEnabled.toString());
    }
    if (allowRegistration !== undefined) {
      userDb.setSetting('allow_registration', allowRegistration.toString());
    }
    if (maxUsers !== undefined) {
      userDb.setSetting('max_users', maxUsers.toString());
    }
    
    res.json({ success: true, message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Settings update error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

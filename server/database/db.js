import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { DATABASE_PATH, ensureAppDirectories } from '../config/appConfig.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Use centralized database path from appConfig
const DB_PATH = DATABASE_PATH;
const INIT_SQL_PATH = path.join(__dirname, 'init.sql');

// Ensure app directories exist before creating database
ensureAppDirectories();

// Create database connection
const db = new Database(DB_PATH);
// console.log('Connected to SQLite database at:', DB_PATH);

// Initialize database with schema
const initializeDatabase = async () => {
  try {
    const initSQL = fs.readFileSync(INIT_SQL_PATH, 'utf8');
    db.exec(initSQL);
    // console.log('Database initialized successfully');
  } catch (error) {
    // console.error('Error initializing database:', error.message);
    throw error;
  }
};

// User database operations
const userDb = {
  // Check if any users exist
  hasUsers: () => {
    try {
      const row = db.prepare('SELECT COUNT(*) as count FROM qwencliui_users').get();
      return row.count > 0;
    } catch (err) {
      throw err;
    }
  },

  // Get user count
  getUserCount: () => {
    try {
      const row = db.prepare('SELECT COUNT(*) as count FROM qwencliui_users WHERE is_active = 1').get();
      return row.count;
    } catch (err) {
      throw err;
    }
  },

  // Get max users setting
  getMaxUsers: () => {
    try {
      const row = db.prepare("SELECT value FROM qwencliui_settings WHERE key = 'max_users'").get();
      return row ? parseInt(row.value) : 10;
    } catch (err) {
      return 10;
    }
  },

  // Check if registration is allowed
  isRegistrationAllowed: () => {
    try {
      const userCount = userDb.getUserCount();
      const maxUsers = userDb.getMaxUsers();
      const registrationEnabled = userDb.getSetting('allow_registration') === 'true';
      return registrationEnabled && userCount < maxUsers;
    } catch (err) {
      return false;
    }
  },

  // Create a new user
  createUser: (username, passwordHash, options = {}) => {
    try {
      const stmt = db.prepare(`
        INSERT INTO qwencliui_users (username, password_hash, email, display_name, role, preferences) 
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      const result = stmt.run(
        username, 
        passwordHash, 
        options.email || null,
        options.displayName || username,
        options.role || 'user',
        JSON.stringify(options.preferences || {})
      );
      return { 
        id: result.lastInsertRowid, 
        username,
        email: options.email,
        display_name: options.displayName || username,
        role: options.role || 'user'
      };
    } catch (err) {
      throw err;
    }
  },

  // Get user by username
  getUserByUsername: (username) => {
    try {
      const row = db.prepare('SELECT * FROM qwencliui_users WHERE username = ? AND is_active = 1').get(username);
      return row;
    } catch (err) {
      throw err;
    }
  },

  // Get user by ID
  getUserById: (userId) => {
    try {
      const row = db.prepare('SELECT id, username, email, display_name, role, created_at, last_login, preferences, avatar_url FROM qwencliui_users WHERE id = ? AND is_active = 1').get(userId);
      return row;
    } catch (err) {
      throw err;
    }
  },

  // Get all active users
  getAllUsers: () => {
    try {
      const rows = db.prepare('SELECT id, username, email, display_name, role, created_at, last_login FROM qwencliui_users WHERE is_active = 1').all();
      return rows;
    } catch (err) {
      throw err;
    }
  },

  // Update user
  updateUser: (userId, updates) => {
    try {
      const fields = [];
      const values = [];
      
      if (updates.email !== undefined) {
        fields.push('email = ?');
        values.push(updates.email);
      }
      if (updates.display_name !== undefined) {
        fields.push('display_name = ?');
        values.push(updates.display_name);
      }
      if (updates.preferences !== undefined) {
        fields.push('preferences = ?');
        values.push(JSON.stringify(updates.preferences));
      }
      if (updates.avatar_url !== undefined) {
        fields.push('avatar_url = ?');
        values.push(updates.avatar_url);
      }
      
      if (fields.length === 0) return false;
      
      fields.push('updated_at = CURRENT_TIMESTAMP');
      values.push(userId);
      
      const stmt = db.prepare(`UPDATE qwencliui_users SET ${fields.join(', ')} WHERE id = ?`);
      const result = stmt.run(...values);
      return result.changes > 0;
    } catch (err) {
      throw err;
    }
  },

  // Update last login time
  updateLastLogin: (userId) => {
    try {
      db.prepare('UPDATE qwencliui_users SET last_login = CURRENT_TIMESTAMP WHERE id = ?').run(userId);
    } catch (err) {
      throw err;
    }
  },

  // Delete user (soft delete)
  deleteUser: (userId) => {
    try {
      db.prepare('UPDATE qwencliui_users SET is_active = 0 WHERE id = ?').run(userId);
      return true;
    } catch (err) {
      throw err;
    }
  },

  // Create user session
  createUserSession: (userId, tokenHash, options = {}) => {
    try {
      const stmt = db.prepare(`
        INSERT INTO qwencliui_user_sessions (user_id, token_hash, expires_at, ip_address, user_agent) 
        VALUES (?, ?, ?, ?, ?)
      `);
      const result = stmt.run(
        userId,
        tokenHash,
        options.expiresAt || null,
        options.ipAddress || null,
        options.userAgent || null
      );
      return { id: result.lastInsertRowid, userId };
    } catch (err) {
      throw err;
    }
  },

  // Get user session by token hash
  getSessionByToken: (tokenHash) => {
    try {
      const row = db.prepare(`
        SELECT s.*, u.id as user_id, u.username, u.display_name, u.role, u.preferences 
        FROM qwencliui_user_sessions s
        JOIN qwencliui_users u ON s.user_id = u.id
        WHERE s.token_hash = ? AND s.is_active = 1 AND (s.expires_at IS NULL OR s.expires_at > CURRENT_TIMESTAMP)
      `).get(tokenHash);
      return row;
    } catch (err) {
      throw err;
    }
  },

  // Update session activity
  updateSessionActivity: (sessionId) => {
    try {
      db.prepare('UPDATE qwencliui_user_sessions SET last_activity = CURRENT_TIMESTAMP WHERE id = ?').run(sessionId);
    } catch (err) {
      throw err;
    }
  },

  // Delete session
  deleteSession: (sessionId) => {
    try {
      db.prepare('UPDATE qwencliui_user_sessions SET is_active = 0 WHERE id = ?').run(sessionId);
      return true;
    } catch (err) {
      throw err;
    }
  },

  // Delete session by token hash
  deleteSessionByToken: (tokenHash) => {
    try {
      db.prepare('UPDATE qwencliui_user_sessions SET is_active = 0 WHERE token_hash = ?').run(tokenHash);
      return true;
    } catch (err) {
      throw err;
    }
  },

  // Delete all sessions for user
  deleteUserSessions: (userId) => {
    try {
      db.prepare('UPDATE qwencliui_user_sessions SET is_active = 0 WHERE user_id = ?').run(userId);
      return true;
    } catch (err) {
      throw err;
    }
  },

  // Get setting
  getSetting: (key) => {
    try {
      const row = db.prepare('SELECT value FROM qwencliui_settings WHERE key = ?').get(key);
      return row ? row.value : null;
    } catch (err) {
      return null;
    }
  },

  // Set setting
  setSetting: (key, value) => {
    try {
      db.prepare(`
        INSERT INTO qwencliui_settings (key, value, updated_at) 
        VALUES (?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP
      `).run(key, value);
      return true;
    } catch (err) {
      throw err;
    }
  },

  // Get user project
  getUserProject: (userId, projectPath) => {
    try {
      const row = db.prepare('SELECT * FROM qwencliui_user_projects WHERE user_id = ? AND project_path = ?').get(userId, projectPath);
      return row;
    } catch (err) {
      throw err;
    }
  },

  // Add user project
  addUserProject: (userId, projectPath, displayName = null) => {
    try {
      const stmt = db.prepare(`
        INSERT INTO qwencliui_user_projects (user_id, project_path, display_name) 
        VALUES (?, ?, ?)
        ON CONFLICT(user_id, project_path) DO UPDATE SET 
          display_name = excluded.display_name,
          updated_at = CURRENT_TIMESTAMP
      `);
      const result = stmt.run(userId, projectPath, displayName);
      return { id: result.lastInsertRowid || result.changes, userId, projectPath };
    } catch (err) {
      throw err;
    }
  },

  // Get user projects
  getUserProjects: (userId) => {
    try {
      const rows = db.prepare('SELECT * FROM qwencliui_user_projects WHERE user_id = ? ORDER BY is_favorite DESC, updated_at DESC').all(userId);
      return rows;
    } catch (err) {
      throw err;
    }
  },

  // Delete user project
  deleteUserProject: (userId, projectPath) => {
    try {
      db.prepare('DELETE FROM qwencliui_user_projects WHERE user_id = ? AND project_path = ?').run(userId, projectPath);
      return true;
    } catch (err) {
      throw err;
    }
  }
};

export {
  db,
  initializeDatabase,
  userDb
};

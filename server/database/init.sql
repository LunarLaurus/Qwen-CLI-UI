-- Initialize authentication database
PRAGMA foreign_keys = ON;

-- Users table (multi-user system) - prefixed with qwencliui_ to avoid conflicts
CREATE TABLE IF NOT EXISTS qwencliui_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    email TEXT,
    display_name TEXT,
    role TEXT DEFAULT 'user',  -- 'admin', 'user'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME,
    is_active BOOLEAN DEFAULT 1,
    preferences TEXT DEFAULT '{}',  -- JSON string for user preferences
    avatar_url TEXT
);

-- User sessions table for tracking active sessions
CREATE TABLE IF NOT EXISTS qwencliui_user_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    token_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME,
    last_activity DATETIME DEFAULT CURRENT_TIMESTAMP,
    ip_address TEXT,
    user_agent TEXT,
    is_active BOOLEAN DEFAULT 1,
    FOREIGN KEY (user_id) REFERENCES qwencliui_users(id) ON DELETE CASCADE
);

-- User projects table for storing project preferences
CREATE TABLE IF NOT EXISTS qwencliui_user_projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    project_path TEXT NOT NULL,
    display_name TEXT,
    is_favorite BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES qwencliui_users(id) ON DELETE CASCADE,
    UNIQUE(user_id, project_path)
);

-- Application settings table
CREATE TABLE IF NOT EXISTS qwencliui_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_qwencliui_users_username ON qwencliui_users(username);
CREATE INDEX IF NOT EXISTS idx_qwencliui_users_active ON qwencliui_users(is_active);
CREATE INDEX IF NOT EXISTS idx_qwencliui_users_role ON qwencliui_users(role);
CREATE INDEX IF NOT EXISTS idx_qwencliui_user_sessions_user ON qwencliui_user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_qwencliui_user_sessions_token ON qwencliui_user_sessions(token_hash);
CREATE INDEX IF NOT EXISTS idx_qwencliui_user_sessions_active ON qwencliui_user_sessions(is_active);
CREATE INDEX IF NOT EXISTS idx_qwencliui_user_projects_user ON qwencliui_user_projects(user_id);

-- Insert default settings
INSERT OR IGNORE INTO qwencliui_settings (key, value) VALUES 
    ('multi_user_enabled', 'false'),
    ('allow_registration', 'true'),
    ('max_users', '10'),
    ('default_theme', 'system'),
    ('default_model', 'qwen3-coder-plus');

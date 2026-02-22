import os from 'os';
import path from 'path';
import fs from 'fs';

/**
 * Application Configuration
 * Manages user data directory, app settings, and cross-platform paths
 */

// Get the appropriate user data directory based on platform
function getUserDataDir() {
  const platform = process.platform;
  const appName = 'qwen-cli-ui';

  switch (platform) {
    case 'win32':
      // Windows: %APPDATA%\qwen-cli-ui
      return path.join(process.env.APPDATA || path.join(os.homedir(), 'AppData', 'Roaming'), appName);
    case 'darwin':
      // macOS: ~/Library/Application Support/qwen-cli-ui
      return path.join(os.homedir(), 'Library', 'Application Support', appName);
    case 'linux':
      // Linux: ~/.local/share/qwen-cli-ui (following XDG spec)
      return process.env.XDG_DATA_HOME
        ? path.join(process.env.XDG_DATA_HOME, appName)
        : path.join(os.homedir(), '.local', 'share', appName);
    default:
      // Fallback to home directory
      return path.join(os.homedir(), `.${appName}`);
  }
}

// Get the user's documents directory for projects
function getDocumentsDir() {
  const platform = process.platform;
  
  switch (platform) {
    case 'win32':
      return process.env.USERPROFILE 
        ? path.join(process.env.USERPROFILE, 'Documents')
        : os.homedir();
    case 'darwin':
      return path.join(os.homedir(), 'Documents');
    case 'linux':
      return path.join(os.homedir(), 'Documents');
    default:
      return os.homedir();
  }
}

// Application paths
const USER_DATA_DIR = getUserDataDir();
const DOCUMENTS_DIR = getDocumentsDir();

// Subdirectories
const DATABASE_PATH = path.join(USER_DATA_DIR, 'database.sqlite');
const SESSIONS_DIR = path.join(USER_DATA_DIR, 'sessions');
const CONFIG_PATH = path.join(USER_DATA_DIR, 'config.json');
const LOGS_DIR = path.join(USER_DATA_DIR, 'logs');
const UPLOADS_DIR = path.join(USER_DATA_DIR, 'uploads');

// Ensure directories exist
function ensureAppDirectories() {
  const dirs = [USER_DATA_DIR, SESSIONS_DIR, LOGS_DIR, UPLOADS_DIR];
  
  for (const dir of dirs) {
    try {
      fs.mkdirSync(dir, { recursive: true });
    } catch (error) {
      console.error(`Failed to create directory ${dir}:`, error);
    }
  }
}

// Default application configuration
const DEFAULT_CONFIG = {
  // Server settings
  server: {
    port: 5008,
    host: '0.0.0.0'
  },
  
  // Frontend settings
  frontend: {
    port: 5009
  },
  
  // AI Model settings
  models: {
    default: 'qwen3-coder-plus',
    available: [
      { value: 'qwen3-coder-plus', label: 'Qwen 3 Coder Plus', description: 'Advanced Qwen coding model', provider: 'qwen' },
      { value: 'qwen3-coder-flash', label: 'Qwen 3 Coder Flash', description: 'Fast Qwen coding model', provider: 'qwen' },
      { value: 'qwen-2.5-coder-32b', label: 'Qwen 2.5 Coder 32B', description: 'Previous generation coding model', provider: 'qwen' },
      { value: 'qwen-plus', label: 'Qwen Plus', description: 'Balanced Qwen model', provider: 'qwen' },
      { value: 'qwen-max', label: 'Qwen Max', description: 'Most capable Qwen model', provider: 'qwen' },
      { value: 'qwen-turbo', label: 'Qwen Turbo', description: 'Fastest Qwen model', provider: 'qwen' }
    ]
  },
  
  // Theme settings
  themes: {
    default: 'system',
    available: [
      { value: 'system', label: 'System Default', description: 'Follow system preference' },
      { value: 'light', label: 'Light', description: 'Light theme' },
      { value: 'dark', label: 'Dark', description: 'Dark theme' },
      { value: 'midnight', label: 'Midnight', description: 'Deep blue dark theme' },
      { value: 'ocean', label: 'Ocean', description: 'Blue-green ocean theme' },
      { value: 'forest', label: 'Forest', description: 'Green forest theme' },
      { value: 'sunset', label: 'Sunset', description: 'Warm orange theme' },
      { value: 'monokai', label: 'Monokai', description: 'Classic monokai colors' },
      { value: 'dracula', label: 'Dracula', description: 'Popular dracula theme' },
      { value: 'nord', label: 'Nord', description: 'Arctic blue theme' }
    ]
  },
  
  // Remote instance settings
  remote: {
    enabled: false,
    url: '',
    apiKey: ''
  },
  
  // Multi-user settings
  multiUser: {
    enabled: false,
    allowRegistration: true,
    maxUsers: 10
  },
  
  // Project settings
  projects: {
    defaultRoot: DOCUMENTS_DIR,
    allowedRoots: [DOCUMENTS_DIR, os.homedir()]
  }
};

// Load application configuration
function loadConfig() {
  try {
    if (fs.existsSync(CONFIG_PATH)) {
      const configData = fs.readFileSync(CONFIG_PATH, 'utf8');
      const userConfig = JSON.parse(configData);
      return mergeConfig(DEFAULT_CONFIG, userConfig);
    }
  } catch (error) {
    console.error('Error loading config:', error);
  }
  
  return { ...DEFAULT_CONFIG };
}

// Save application configuration
function saveConfig(config) {
  try {
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error saving config:', error);
    return false;
  }
}

// Deep merge configurations
function mergeConfig(defaultConfig, userConfig) {
  const result = { ...defaultConfig };
  
  for (const key in userConfig) {
    if (userConfig.hasOwnProperty(key)) {
      if (typeof userConfig[key] === 'object' && userConfig[key] !== null && !Array.isArray(userConfig[key])) {
        result[key] = mergeConfig(defaultConfig[key] || {}, userConfig[key]);
      } else {
        result[key] = userConfig[key];
      }
    }
  }
  
  return result;
}

// Get a specific configuration value by path (e.g., 'models.default')
function getConfigValue(path, defaultValue = null) {
  const config = loadConfig();
  const keys = path.split('.');
  let value = config;
  
  for (const key of keys) {
    if (value && value.hasOwnProperty(key)) {
      value = value[key];
    } else {
      return defaultValue;
    }
  }
  
  return value;
}

// Set a specific configuration value by path
function setConfigValue(path, value) {
  const config = loadConfig();
  const keys = path.split('.');
  let current = config;
  
  for (let i = 0; i < keys.length - 1; i++) {
    if (!current[keys[i]]) {
      current[keys[i]] = {};
    }
    current = current[keys[i]];
  }
  
  current[keys[keys.length - 1]] = value;
  return saveConfig(config);
}

export {
  USER_DATA_DIR,
  DOCUMENTS_DIR,
  DATABASE_PATH,
  SESSIONS_DIR,
  CONFIG_PATH,
  LOGS_DIR,
  UPLOADS_DIR,
  ensureAppDirectories,
  loadConfig,
  saveConfig,
  getConfigValue,
  setConfigValue,
  DEFAULT_CONFIG
};

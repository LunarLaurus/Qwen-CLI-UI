# Qwen CLI UI - Project Context

## Project Overview

**Qwen CLI UI** is a modern, full-stack web application providing a graphical chat interface for Qwen Code CLI. It enables users to interact with the Qwen AI coding assistant through a responsive web UI with features like file management, session history, code editing, and an integrated terminal.

### Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | React 18, Vite, Tailwind CSS, React Router, CodeMirror, Xterm.js |
| **Backend** | Node.js, Express, WebSocket (ws), node-pty |
| **Database** | SQLite (better-sqlite3) |
| **Authentication** | JWT (jsonwebtoken), bcrypt |
| **Build Tools** | Vite, PostCSS, Babel |

### Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   React UI      │────▶│  Express Server  │────▶│  Qwen CLI       │
│   (Port 5009)   │◀────│  (Port 5008)     │◀────│  (Agent)        │
└─────────────────┘     └──────────────────┘     └─────────────────┘
        │                       │                        │
        │                       ▼                        │
        │              ┌──────────────────┐              │
        └─────────────▶│  SQLite Database │              │
                       │  (Auth/Sessions) │              │
                       └──────────────────┘              │
```

## Project Structure

```
Qwen-CLI-UI/
├── src/                          # React Frontend
│   ├── components/               # UI Components
│   │   ├── ChatInterface.jsx     # Main chat component
│   │   ├── CodeEditor.jsx        # Monaco-based code editor
│   │   ├── FileTree.jsx          # File browser component
│   │   ├── Sidebar.jsx           # Project/session sidebar
│   │   ├── Shell.jsx             # Terminal emulator
│   │   ├── GitPanel.jsx          # Git operations panel
│   │   ├── LoginForm.jsx         # Authentication form
│   │   └── ui/                   # Reusable UI components
│   ├── contexts/                 # React Context providers
│   │   ├── AuthContext.jsx       # Authentication state
│   │   └── ThemeContext.jsx      # Dark/light theme
│   ├── hooks/                    # Custom React hooks
│   ├── utils/                    # Utility functions
│   ├── lib/                      # Library wrappers
│   ├── App.jsx                   # Main app with routing
│   ├── main.jsx                  # Entry point
│   └── index.css                 # Global styles
├── server/                       # Express Backend
│   ├── index.js                  # Main server (WebSocket + REST)
│   ├── agent-cli.js              # Qwen CLI integration
│   ├── qwen-cli.js               # Qwen command builder
│   ├── sessionManager.js         # Session persistence
│   ├── projects.js               # Project management
│   ├── routes/                   # API route handlers
│   │   ├── auth.js               # Authentication endpoints
│   │   ├── git.js                # Git API endpoints
│   │   └── mcp.js                # MCP protocol endpoints
│   ├── middleware/               # Express middleware
│   │   └── auth.js               # JWT authentication
│   └── database/                 # Database layer
│       ├── db.js                 # SQLite connection
│       └── init.sql              # Database schema
├── public/                       # Static assets
│   ├── manifest.json             # PWA manifest
│   ├── sw.js                     # Service worker
│   └── screenshots/              # Documentation images
├── index.html                    # HTML entry point
├── package.json                  # Dependencies & scripts
├── vite.config.js                # Vite configuration
├── tailwind.config.js            # Tailwind configuration
├── .env.example                  # Environment template
└── .nvmrc                        # Node version (v20.19.3)
```

## Building and Running

### Prerequisites

- **Node.js**: v20.19.3 (see `.nvmrc`)
- **npm**: Latest compatible version
- **Qwen CLI**: Installed and accessible in PATH

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Start both frontend (5009) and backend (5008)
npm run dev

# Or run separately
npm run server    # Backend only
npm run client    # Frontend only (Vite dev server)
```

### Production

```bash
# Build frontend for production
npm run build

# Start production server
npm start
```

### Environment Configuration

Create a `.env` file based on `.env.example`:

```env
# Server ports
PORT=5008
VITE_PORT=5009

# Qwen CLI configuration
AGENT_BIN=qwen
AGENT_MODEL_FLAG=--model
AGENT_SKIP_PERMISSIONS_FLAG=--yolo

# Authentication (REQUIRED - change in production)
JWT_SECRET=your-secret-key-here

# Optional: Custom agent command template
# AGENT_CMD_TEMPLATE=qwen chat {skip_permissions_flag} --model {model} --input-file {prompt_file}

# Optional: OpenAI API key for audio transcription
# OPENAI_API_KEY=sk-...

NODE_ENV=development
```

## Key Features

### 1. Chat Interface
- Real-time WebSocket communication with Qwen CLI
- Markdown rendering with syntax highlighting
- Image attachment support (drag & drop)
- Session auto-save and resume

### 2. File Management
- Project file browser with tree view
- CodeMirror-based editor with syntax highlighting
- Support for multiple languages (JS, Python, CSS, HTML, JSON, Markdown)
- File save with automatic backup

### 3. Session Management
- SQLite-backed session persistence
- Session history with search
- Multiple concurrent sessions per project
- Session protection during active conversations

### 4. Integrated Terminal
- PTY-based shell emulation using node-pty
- Full terminal escape sequence support
- URL detection and browser integration
- Project-aware working directory

### 5. Authentication
- JWT-based authentication
- SQLite user storage
- Protected REST and WebSocket endpoints
- API key support for additional security

### 6. Git Integration
- Git operations via `/api/git` endpoints
- Repository status and history
- Branch management

## API Endpoints

### REST API

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register new user |
| `POST` | `/api/auth/login` | User login |
| `GET` | `/api/config` | Get server configuration |
| `GET` | `/api/projects` | List all projects |
| `GET` | `/api/projects/:name/sessions` | Get project sessions |
| `GET` | `/api/projects/:name/file?filePath=...` | Read file content |
| `PUT` | `/api/projects/:name/file` | Save file content |
| `DELETE` | `/api/projects/:name/sessions/:id` | Delete session |
| `POST` | `/api/projects/create` | Create new project |
| `POST` | `/api/transcribe` | Audio transcription |

### WebSocket Endpoints

| Path | Purpose |
|------|---------|
| `/ws` | Chat communication (qwen-command, qwen-output) |
| `/shell` | Interactive terminal (PTY session) |

### WebSocket Events

```javascript
// Client → Server
{ type: 'qwen-command', command: '...', options: {...} }
{ type: 'abort-session', sessionId: '...' }
{ type: 'init', projectPath: '...', sessionId: '...' }  // Shell
{ type: 'input', data: '...' }  // Shell input
{ type: 'resize', cols: 80, rows: 24 }  // Shell resize

// Server → Client
{ type: 'qwen-output', data: '...' }
{ type: 'qwen-complete', exitCode: 0 }
{ type: 'session-created', sessionId: '...' }
{ type: 'projects_updated', projects: [...] }
{ type: 'url_open', url: 'https://...' }  // Detected URLs
```

## Development Conventions

### Code Style
- **Frontend**: React functional components with hooks
- **State Management**: React Context for global state (Auth, Theme)
- **Styling**: Tailwind CSS with utility-first approach
- **Imports**: ES modules (`import/export`)

### Component Patterns

```jsx
// Standard component structure
function ComponentName({ prop1, prop2 }) {
  // Hooks at top
  const [state, setState] = useState(initialValue);
  
  // Event handlers
  const handleClick = () => {...};
  
  // Render
  return <div className="...">{/* JSX */}</div>;
}
```

### Testing Practices
- Run tests with `npm test` (if configured)
- Linting: `npm run lint`
- Format: `npm run format`

### Git Workflow
1. Create feature branch: `git checkout -b feature/feature-name`
2. Commit with clear messages: `git commit -m 'Add feature'`
3. Push and create PR

## Session Protection System

A key architectural feature preventing data loss during active conversations:

**Problem**: Automatic project updates from WebSocket would refresh the sidebar and clear chat messages during active conversations.

**Solution**: Track "active sessions" and pause project updates during conversations.

```javascript
// When user sends message → session marked as "active"
markSessionAsActive(sessionId);

// Project updates skip modifications to active sessions
if (activeSessions.has(selectedSession.id)) {
  // Skip updates that would modify existing selected session
  return;
}

// When conversation completes → session marked as "inactive"
markSessionAsInactive(sessionId);
```

## Database Schema

```sql
-- Users table (authentication)
CREATE TABLE qwencliui_users (
  id INTEGER PRIMARY KEY,
  username TEXT UNIQUE,
  password_hash TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP,
  is_active INTEGER DEFAULT 1
);

-- Sessions table (conversation history)
CREATE TABLE qwencliui_sessions (
  id TEXT PRIMARY KEY,
  project_path TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Messages table (conversation messages)
CREATE TABLE qwencliui_messages (
  id INTEGER PRIMARY KEY,
  session_id TEXT,
  role TEXT,  -- 'user' or 'assistant'
  content TEXT,
  created_at TIMESTAMP,
  FOREIGN KEY (session_id) REFERENCES sessions(id)
);
```

## Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| WebSocket connection failed | Check PORT/VITE_PORT in .env match |
| Qwen CLI not responding | Verify `which qwen` returns path |
| Sessions not saving | Check `~/.qwen/sessions/` permissions |
| Authentication errors | Clear localStorage, re-login |
| PTY errors on Windows | Ensure WSL or compatible terminal |

### Debug Tips

1. **Enable verbose logging**: Uncomment `console.log` statements in `server/index.js`
2. **Check WebSocket**: Open browser DevTools → Network → WS tab
3. **Database inspection**: Use `sqlite3 qwencliui_auth.db` to query sessions
4. **Qwen CLI test**: Run `qwen --help` directly to verify installation

## Security Considerations

1. **JWT Secret**: Always change `JWT_SECRET` in production
2. **HTTPS**: Use reverse proxy (nginx/caddy) for SSL termination
3. **CORS**: Configure allowed origins in production
4. **File Access**: All file paths are validated for security
5. **PTY Isolation**: Shell runs with restricted permissions

## Performance Optimizations

- **Debounced project updates**: 300ms delay to batch file changes
- **Object reference preservation**: React state updates avoid unnecessary re-renders
- **Chokidar watcher**: Optimized file watching with ignore patterns
- **Output buffering**: 100ms buffer for Qwen output to reduce WebSocket messages

## Related Files

- `README.md` - User-facing documentation
- `README_jp.md` - Japanese documentation
- `.env.example` - Environment variable template
- `LICENSE` - MIT License
- `public/convert-icons.md` - Icon conversion utilities
- `public/generate-icons.js` - PWA icon generator

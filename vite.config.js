import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    server: {
      port: parseInt(env.VITE_PORT) || 5009,
      proxy: {
        '/api': `http://localhost:${env.PORT || 5008}`,
        '/ws': {
          target: `ws://localhost:${env.PORT || 5008}`,
          ws: true
        }
      }
    },
    build: {
      outDir: 'dist',
      rollupOptions: {
        output: {
          manualChunks: {
            // Vendor chunk for external dependencies
            vendor: ['react', 'react-dom', 'react-router-dom'],
            // CodeMirror and related editor dependencies
            editor: [
              '@uiw/react-codemirror',
              '@codemirror/lang-css',
              '@codemirror/lang-html',
              '@codemirror/lang-javascript',
              '@codemirror/lang-json',
              '@codemirror/lang-markdown',
              '@codemirror/lang-python',
              '@codemirror/theme-one-dark'
            ],
            // Terminal dependencies
            terminal: ['@xterm/xterm', '@xterm/addon-fit', '@xterm/addon-clipboard', '@xterm/addon-webgl'],
            // UI component libraries
            ui: ['lucide-react', 'class-variance-authority', 'clsx', 'tailwind-merge'],
            // Markdown rendering
            markdown: ['react-markdown'],
            // File upload and drag-drop
            upload: ['react-dropzone']
          }
        }
      },
      chunkSizeWarningLimit: 1000
    }
  }
})

import React, { useState, useEffect, useCallback } from 'react';
import { Folder, FolderOpen, File, ChevronRight, ChevronDown, Home, HardDrive, ArrowLeft, Plus, Check, X } from 'lucide-react';
import { api } from '../utils/api';

/**
 * FileBrowser Component
 * Allows users to browse and select project folders from their file system
 */
function FileBrowser({ onSelect, onClose, initialPath = null }) {
  const [currentPath, setCurrentPath] = useState(initialPath);
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pathHistory, setPathHistory] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [customPath, setCustomPath] = useState('');
  const [showCustomPathInput, setShowCustomPathInput] = useState(false);

  // Fetch folders at current path
  const fetchFolders = useCallback(async (path) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get(`/api/file-browser/folders?path=${encodeURIComponent(path)}`);
      if (response.ok) {
        const data = await response.json();
        setFolders(data.folders || []);
        setCurrentPath(data.currentPath || path);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to load folders');
      }
    } catch (err) {
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  }, []);

  // Navigate to parent directory
  const navigateUp = () => {
    if (!currentPath) return;
    
    const parentPath = getPathParent(currentPath);
    if (parentPath && parentPath !== currentPath) {
      setPathHistory(prev => [...prev, currentPath]);
      fetchFolders(parentPath);
    }
  };

  // Navigate to subdirectory
  const navigateDown = (folderPath) => {
    setPathHistory(prev => [...prev, currentPath]);
    fetchFolders(folderPath);
  };

  // Go to home directory
  const navigateHome = () => {
    fetchFolders(getHomePath());
  };

  // Go to root drives
  const navigateToRoot = () => {
    fetchFolders('');
  };

  // Handle custom path submission
  const handleCustomPathSubmit = () => {
    if (customPath.trim()) {
      setPathHistory(prev => [...prev, currentPath]);
      fetchFolders(customPath.trim());
      setShowCustomPathInput(false);
      setCustomPath('');
    }
  };

  // Handle folder selection
  const handleSelect = () => {
    if (selectedFolder && onSelect) {
      onSelect(selectedFolder);
    }
  };

  // Get parent path
  const getPathParent = (path) => {
    if (!path || path === '/') return null;
    
    const parts = path.split(/[\\/]/).filter(Boolean);
    if (parts.length <= 1) {
      // At root, return null or drive list
      return null;
    }
    
    parts.pop();
    return parts.join('/') || '/';
  };

  // Get home path
  const getHomePath = () => {
    return process.env.HOME || process.env.USERPROFILE || '/';
  };

  // Initial load
  useEffect(() => {
    const startPath = initialPath || getHomePath();
    fetchFolders(startPath);
  }, [initialPath, fetchFolders]);

  // Render path breadcrumb
  const renderBreadcrumb = () => {
    const parts = currentPath ? currentPath.split(/[\\/]/).filter(Boolean) : [];
    
    return (
      <div className="flex items-center gap-2 text-sm overflow-hidden">
        <button
          onClick={navigateToRoot}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          title="Root"
        >
          <HardDrive className="w-4 h-4" />
        </button>
        
        <button
          onClick={navigateHome}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          title="Home"
        >
          <Home className="w-4 h-4" />
        </button>
        
        {parts.length > 0 && (
          <>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <div className="flex items-center gap-1 overflow-hidden">
              {parts.map((part, index) => (
                <React.Fragment key={index}>
                  {index > 0 && <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />}
                  <button
                    onClick={() => {
                      const newPath = parts.slice(0, index + 1).join('/');
                      fetchFolders(newPath.startsWith('/') ? newPath : '/' + newPath);
                    }}
                    className="hover:text-blue-600 dark:hover:text-blue-400 truncate max-w-[150px]"
                  >
                    {part}
                  </button>
                </React.Fragment>
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold">Select Project Folder</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCustomPathInput(!showCustomPathInput)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              title="Enter path manually"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Custom path input */}
        {showCustomPathInput && (
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex gap-2">
            <input
              type="text"
              value={customPath}
              onChange={(e) => setCustomPath(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCustomPathSubmit()}
              placeholder="Enter folder path..."
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
              autoFocus
            />
            <button
              onClick={handleCustomPathSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Go
            </button>
          </div>
        )}

        {/* Navigation bar */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between gap-4">
          {renderBreadcrumb()}
          <button
            onClick={navigateUp}
            disabled={!currentPath || getPathParent(currentPath) === null}
            className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Up</span>
          </button>
        </div>

        {/* Folder list */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading folders...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : folders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No folders found</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {folders.map((folder, index) => (
                <button
                  key={index}
                  onClick={() => {
                    if (folder.type === 'folder') {
                      navigateDown(folder.path);
                    }
                    setSelectedFolder(folder.path);
                  }}
                  onDoubleClick={() => {
                    if (folder.type === 'folder') {
                      navigateDown(folder.path);
                    } else {
                      setSelectedFolder(folder.path);
                      handleSelect();
                    }
                  }}
                  className={`
                    flex items-center gap-3 p-3 rounded-lg border text-left
                    transition-all hover:shadow-md
                    ${selectedFolder === folder.path 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }
                  `}
                >
                  {folder.type === 'folder' ? (
                    <FolderOpen className="w-5 h-5 text-blue-500" />
                  ) : (
                    <File className="w-5 h-5 text-gray-500" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{folder.name}</div>
                    {folder.description && (
                      <div className="text-xs text-gray-500 truncate">{folder.description}</div>
                    )}
                  </div>
                  {selectedFolder === folder.path && (
                    <Check className="w-4 h-4 text-blue-500" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer with selected path and action buttons */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          {selectedFolder && (
            <div className="mb-4 p-3 bg-gray-100 dark:bg-gray-700 rounded">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Selected:</div>
              <div className="font-mono text-sm break-all">{selectedFolder}</div>
            </div>
          )}
          
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleSelect}
              disabled={!selectedFolder}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Select Folder
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FileBrowser;

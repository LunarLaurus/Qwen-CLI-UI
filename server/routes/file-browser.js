import express from 'express';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get home directory
const getHomePath = () => {
  return os.homedir();
};

// Get parent directory
const getParentPath = (currentPath) => {
  if (!currentPath || currentPath === '/' || currentPath === '') return null;
  
  const parent = path.dirname(currentPath);
  return parent === currentPath ? null : parent;
};

// Check if path is allowed (security check)
const isPathAllowed = (targetPath) => {
  const homeDir = getHomePath();
  const resolvedPath = path.resolve(targetPath);
  
  // Allow paths within home directory or documents
  const documentsDir = path.join(homeDir, 'Documents');
  
  return resolvedPath.startsWith(homeDir) || 
         resolvedPath.startsWith(documentsDir) ||
         resolvedPath.startsWith('/');
};

// Get folders at specified path
router.get('/folders', authenticateToken, async (req, res) => {
  try {
    let requestPath = req.query.path;
    
    // Default to home directory if no path specified
    if (!requestPath || requestPath === '') {
      requestPath = getHomePath();
    }
    
    // Security check
    if (!isPathAllowed(requestPath)) {
      return res.status(403).json({ error: 'Access denied to this path' });
    }
    
    const resolvedPath = path.resolve(requestPath);
    
    // Check if path exists
    if (!fs.existsSync(resolvedPath)) {
      return res.status(404).json({ error: 'Path does not exist' });
    }
    
    // Read directory contents
    const entries = fs.readdirSync(resolvedPath, { withFileTypes: true });
    
    // Filter and map folders
    const folders = entries
      .filter(entry => entry.isDirectory() && !entry.name.startsWith('.'))
      .map(entry => ({
        name: entry.name,
        path: path.join(resolvedPath, entry.name),
        type: 'folder'
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
    
    // Add parent directory option if not at root
    const parentPath = getParentPath(resolvedPath);
    if (parentPath) {
      folders.unshift({
        name: '..',
        path: parentPath,
        type: 'parent'
      });
    }
    
    res.json({
      currentPath: resolvedPath,
      folders
    });
  } catch (error) {
    console.error('File browser error:', error);
    res.status(500).json({ error: 'Failed to read directory' });
  }
});

// Get common project locations
router.get('/common-locations', authenticateToken, (req, res) => {
  try {
    const homeDir = getHomePath();
    const locations = [
      {
        name: 'Home',
        path: homeDir,
        description: 'Your home directory',
        icon: 'home'
      },
      {
        name: 'Documents',
        path: path.join(homeDir, 'Documents'),
        description: 'Documents folder',
        icon: 'folder'
      },
      {
        name: 'Desktop',
        path: path.join(homeDir, 'Desktop'),
        description: 'Desktop folder',
        icon: 'desktop'
      },
      {
        name: 'Projects',
        path: path.join(homeDir, 'Projects'),
        description: 'Projects folder (if exists)',
        icon: 'folder-code'
      },
      {
        name: 'GitHub',
        path: path.join(homeDir, 'github'),
        description: 'GitHub folder (if exists)',
        icon: 'github'
      }
    ].filter(loc => fs.existsSync(loc.path));
    
    res.json({ locations });
  } catch (error) {
    console.error('Common locations error:', error);
    res.status(500).json({ error: 'Failed to get common locations' });
  }
});

export default router;

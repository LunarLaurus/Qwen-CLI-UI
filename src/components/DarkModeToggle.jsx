import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Moon, Sun, Monitor } from 'lucide-react';

function DarkModeToggle() {
  const { isDarkMode, currentTheme, setTheme } = useTheme();

  // Cycle through themes: system -> light -> dark -> system
  const handleToggle = () => {
    if (currentTheme === 'system') {
      setTheme('light');
    } else if (currentTheme === 'light') {
      setTheme('dark');
    } else {
      setTheme('system');
    }
  };

  // Get current icon based on theme
  const getCurrentIcon = () => {
    if (currentTheme === 'system') {
      return <Monitor className="w-3.5 h-3.5 text-blue-500" />;
    }
    if (isDarkMode) {
      return <Moon className="w-3.5 h-3.5 text-gray-300" />;
    }
    return <Sun className="w-3.5 h-3.5 text-yellow-500" />;
  };

  // Get tooltip text
  const getTooltip = () => {
    if (currentTheme === 'system') return 'System theme';
    if (isDarkMode) return 'Dark theme';
    return 'Light theme';
  };

  return (
    <button
      onClick={handleToggle}
      className="relative inline-flex h-8 w-14 items-center rounded-full bg-gray-200 dark:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
      role="switch"
      aria-checked={isDarkMode}
      aria-label={`Toggle theme (current: ${getTooltip()})`}
      title={getTooltip()}
    >
      <span className="sr-only">Toggle theme</span>
      <span
        className={`${
          isDarkMode ? 'translate-x-7' : 'translate-x-1'
        } inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform duration-200 flex items-center justify-center`}
      >
        {getCurrentIcon()}
      </span>
    </button>
  );
}

export default DarkModeToggle;
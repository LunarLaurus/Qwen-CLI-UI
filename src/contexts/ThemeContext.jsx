import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Theme color definitions (HSL values)
const THEMES = {
  system: {
    name: 'System Default',
    followsSystem: true
  },
  light: {
    name: 'Light',
    followsSystem: false,
    isDark: false,
    colors: {
      background: '0 0% 100%',
      foreground: '222.2 84% 4.9%',
      card: '0 0% 100%',
      cardForeground: '222.2 84% 4.9%',
      popover: '0 0% 100%',
      popoverForeground: '222.2 84% 4.9%',
      primary: '25 95% 53%',
      primaryForeground: '210 40% 98%',
      secondary: '210 40% 96.1%',
      secondaryForeground: '222.2 47.4% 11.2%',
      muted: '210 40% 96.1%',
      mutedForeground: '215.4 16.3% 46.9%',
      accent: '210 40% 96.1%',
      accentForeground: '222.2 47.4% 11.2%',
      destructive: '0 84.2% 60.2%',
      destructiveForeground: '210 40% 98%',
      border: '214.3 31.8% 91.4%',
      input: '214.3 31.8% 91.4%',
      ring: '25 95% 53%',
      themeColor: '#ffffff'
    }
  },
  dark: {
    name: 'Dark',
    followsSystem: false,
    isDark: true,
    colors: {
      background: '222.2 84% 4.9%',
      foreground: '210 40% 98%',
      card: '217.2 91.2% 8%',
      cardForeground: '210 40% 98%',
      popover: '217.2 91.2% 8%',
      popoverForeground: '210 40% 98%',
      primary: '25 95% 53%',
      primaryForeground: '222.2 47.4% 11.2%',
      secondary: '217.2 32.6% 17.5%',
      secondaryForeground: '210 40% 98%',
      muted: '217.2 32.6% 17.5%',
      mutedForeground: '215 20.2% 65.1%',
      accent: '217.2 32.6% 17.5%',
      accentForeground: '210 40% 98%',
      destructive: '0 62.8% 30.6%',
      destructiveForeground: '210 40% 98%',
      border: '217.2 32.6% 17.5%',
      input: '217.2 32.6% 17.5%',
      ring: '25 95% 53%',
      themeColor: '#0c1117'
    }
  },
  midnight: {
    name: 'Midnight',
    followsSystem: false,
    isDark: true,
    colors: {
      background: '222.2 84% 3.9%',
      foreground: '210 40% 98%',
      card: '217.2 91.2% 5.9%',
      cardForeground: '210 40% 98%',
      popover: '217.2 91.2% 5.9%',
      popoverForeground: '210 40% 98%',
      primary: '210 100% 60%',
      primaryForeground: '210 40% 98%',
      secondary: '217.2 32.6% 15.5%',
      secondaryForeground: '210 40% 98%',
      muted: '217.2 32.6% 15.5%',
      mutedForeground: '215 20.2% 65.1%',
      accent: '217.2 32.6% 15.5%',
      accentForeground: '210 40% 98%',
      destructive: '0 62.8% 30.6%',
      destructiveForeground: '210 40% 98%',
      border: '217.2 32.6% 15.5%',
      input: '217.2 32.6% 15.5%',
      ring: '210 100% 60%',
      themeColor: '#0a0f1a'
    }
  },
  ocean: {
    name: 'Ocean',
    followsSystem: false,
    isDark: true,
    colors: {
      background: '200 80% 5%',
      foreground: '200 40% 95%',
      card: '200 80% 7%',
      cardForeground: '200 40% 95%',
      popover: '200 80% 7%',
      popoverForeground: '200 40% 95%',
      primary: '180 80% 50%',
      primaryForeground: '180 40% 10%',
      secondary: '200 60% 15%',
      secondaryForeground: '200 40% 95%',
      muted: '200 60% 15%',
      mutedForeground: '200 30% 65%',
      accent: '200 60% 15%',
      accentForeground: '200 40% 95%',
      destructive: '0 62.8% 30.6%',
      destructiveForeground: '200 40% 95%',
      border: '200 60% 15%',
      input: '200 60% 15%',
      ring: '180 80% 50%',
      themeColor: '#0a1620'
    }
  },
  forest: {
    name: 'Forest',
    followsSystem: false,
    isDark: true,
    colors: {
      background: '140 50% 6%',
      foreground: '140 30% 95%',
      card: '140 50% 8%',
      cardForeground: '140 30% 95%',
      popover: '140 50% 8%',
      popoverForeground: '140 30% 95%',
      primary: '140 70% 45%',
      primaryForeground: '140 30% 10%',
      secondary: '140 40% 15%',
      secondaryForeground: '140 30% 95%',
      muted: '140 40% 15%',
      mutedForeground: '140 30% 65%',
      accent: '140 40% 15%',
      accentForeground: '140 30% 95%',
      destructive: '0 62.8% 30.6%',
      destructiveForeground: '140 30% 95%',
      border: '140 40% 15%',
      input: '140 40% 15%',
      ring: '140 70% 45%',
      themeColor: '#0f1a12'
    }
  },
  sunset: {
    name: 'Sunset',
    followsSystem: false,
    isDark: true,
    colors: {
      background: '30 50% 8%',
      foreground: '30 40% 95%',
      card: '30 50% 10%',
      cardForeground: '30 40% 95%',
      popover: '30 50% 10%',
      popoverForeground: '30 40% 95%',
      primary: '30 90% 60%',
      primaryForeground: '30 40% 10%',
      secondary: '30 40% 18%',
      secondaryForeground: '30 40% 95%',
      muted: '30 40% 18%',
      mutedForeground: '30 30% 65%',
      accent: '30 40% 18%',
      accentForeground: '30 40% 95%',
      destructive: '0 62.8% 30.6%',
      destructiveForeground: '30 40% 95%',
      border: '30 40% 18%',
      input: '30 40% 18%',
      ring: '30 90% 60%',
      themeColor: '#1a120f'
    }
  },
  monokai: {
    name: 'Monokai',
    followsSystem: false,
    isDark: true,
    colors: {
      background: '45 10% 15%',
      foreground: '45 10% 90%',
      card: '45 10% 18%',
      cardForeground: '45 10% 90%',
      popover: '45 10% 18%',
      popoverForeground: '45 10% 90%',
      primary: '45 100% 60%',
      primaryForeground: '45 40% 10%',
      secondary: '45 20% 25%',
      secondaryForeground: '45 10% 90%',
      muted: '45 20% 25%',
      mutedForeground: '45 10% 70%',
      accent: '45 20% 25%',
      accentForeground: '45 10% 90%',
      destructive: '0 62.8% 30.6%',
      destructiveForeground: '45 10% 90%',
      border: '45 20% 25%',
      input: '45 20% 25%',
      ring: '45 100% 60%',
      themeColor: '#272822'
    }
  },
  dracula: {
    name: 'Dracula',
    followsSystem: false,
    isDark: true,
    colors: {
      background: '260 20% 15%',
      foreground: '260 20% 90%',
      card: '260 20% 18%',
      cardForeground: '260 20% 90%',
      popover: '260 20% 18%',
      popoverForeground: '260 20% 90%',
      primary: '320 80% 60%',
      primaryForeground: '320 40% 10%',
      secondary: '260 30% 25%',
      secondaryForeground: '260 20% 90%',
      muted: '260 30% 25%',
      mutedForeground: '260 20% 70%',
      accent: '260 30% 25%',
      accentForeground: '260 20% 90%',
      destructive: '0 62.8% 30.6%',
      destructiveForeground: '260 20% 90%',
      border: '260 30% 25%',
      input: '260 30% 25%',
      ring: '320 80% 60%',
      themeColor: '#282a36'
    }
  },
  nord: {
    name: 'Nord',
    followsSystem: false,
    isDark: true,
    colors: {
      background: '210 30% 18%',
      foreground: '210 30% 90%',
      card: '210 30% 20%',
      cardForeground: '210 30% 90%',
      popover: '210 30% 20%',
      popoverForeground: '210 30% 90%',
      primary: '190 50% 60%',
      primaryForeground: '190 40% 10%',
      secondary: '210 25% 28%',
      secondaryForeground: '210 30% 90%',
      muted: '210 25% 28%',
      mutedForeground: '210 20% 70%',
      accent: '210 25% 28%',
      accentForeground: '210 30% 90%',
      destructive: '0 62.8% 30.6%',
      destructiveForeground: '210 30% 90%',
      border: '210 25% 28%',
      input: '210 25% 28%',
      ring: '190 50% 60%',
      themeColor: '#2e3440'
    }
  }
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'system';
  });

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSystemDark, setIsSystemDark] = useState(false);

  // Apply theme colors to CSS variables
  const applyTheme = (themeName) => {
    const theme = THEMES[themeName];
    if (!theme) return;

    // Handle system theme
    if (theme.followsSystem) {
      const systemIsDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
      setIsSystemDark(systemIsDark);
      setIsDarkMode(systemIsDark);
      const systemTheme = systemIsDark ? THEMES.dark : THEMES.light;
      applyColors(systemTheme.colors);
      localStorage.setItem('theme', 'system');
      return;
    }

    // Handle explicit themes
    setIsDarkMode(theme.isDark);
    applyColors(theme.colors);
    localStorage.setItem('theme', themeName);
  };

  // Helper to apply color variables to document
  const applyColors = (colors) => {
    const root = document.documentElement;
    Object.entries(colors).forEach(([key, value]) => {
      if (key === 'themeColor') {
        const themeColorMeta = document.querySelector('meta[name="theme-color"]');
        if (themeColorMeta) {
          themeColorMeta.setAttribute('content', value);
        }
      } else {
        const cssVar = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
        root.style.setProperty(cssVar, value);
      }
    });

    // Update iOS status bar
    const statusBarMeta = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
    if (statusBarMeta) {
      statusBarMeta.setAttribute('content', colors.isDark ? 'black-translucent' : 'default');
    }
  };

  // Update document class and localStorage when theme changes
  useEffect(() => {
    applyTheme(currentTheme);
  }, [currentTheme]);

  // Listen for system theme changes
  useEffect(() => {
    if (!window.matchMedia) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      setIsSystemDark(e.matches);
      // Only update if using system theme
      if (currentTheme === 'system') {
        applyTheme('system');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [currentTheme]);

  const toggleDarkMode = () => {
    const newTheme = isDarkMode ? 'light' : 'dark';
    setCurrentTheme(newTheme);
  };

  const setTheme = (themeName) => {
    setCurrentTheme(themeName);
  };

  const value = {
    isDarkMode,
    isSystemDark,
    currentTheme,
    toggleDarkMode,
    setTheme,
    themes: THEMES
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
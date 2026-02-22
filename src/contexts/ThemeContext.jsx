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
  },
  // Light Mode Themes - Extended Color Palettes (3-5 colors each)
  // Base colors tinted toward primary theme color
  alpine: {
    name: 'Alpine',
    followsSystem: false,
    isDark: false,
    colors: {
      background: '200 100% 99%',
      foreground: '200 100% 10%',
      card: '200 100% 99%',
      cardForeground: '200 100% 10%',
      popover: '200 100% 99%',
      popoverForeground: '200 100% 10%',
      primary: '200 100% 45%',
      primaryForeground: '200 100% 99%',
      secondary: '190 90% 50%',
      secondaryForeground: '200 100% 99%',
      muted: '200 30% 96%',
      mutedForeground: '200 20% 45%',
      accent: '180 80% 55%',
      accentForeground: '200 100% 99%',
      destructive: '0 84% 60%',
      destructiveForeground: '0 0% 100%',
      border: '200 30% 90%',
      input: '200 30% 90%',
      ring: '190 100% 45%',
      themeColor: '#f5f9fb'
    }
  },
  sage: {
    name: 'Sage',
    followsSystem: false,
    isDark: false,
    colors: {
      background: '140 40% 98%',
      foreground: '140 70% 10%',
      card: '140 40% 98%',
      cardForeground: '140 70% 10%',
      popover: '140 40% 98%',
      popoverForeground: '140 70% 10%',
      primary: '140 70% 45%',
      primaryForeground: '140 40% 98%',
      secondary: '150 60% 40%',
      secondaryForeground: '140 40% 98%',
      muted: '140 30% 96%',
      mutedForeground: '140 20% 45%',
      accent: '70 80% 45%',
      accentForeground: '140 40% 98%',
      destructive: '0 84% 60%',
      destructiveForeground: '0 0% 100%',
      border: '140 30% 90%',
      input: '140 30% 90%',
      ring: '70 80% 45%',
      themeColor: '#f7fbf6'
    }
  },
  lavender: {
    name: 'Lavender',
    followsSystem: false,
    isDark: false,
    colors: {
      background: '270 40% 98%',
      foreground: '270 90% 15%',
      card: '270 40% 98%',
      cardForeground: '270 90% 15%',
      popover: '270 40% 98%',
      popoverForeground: '270 90% 15%',
      primary: '270 90% 55%',
      primaryForeground: '270 40% 98%',
      secondary: '280 80% 60%',
      secondaryForeground: '270 40% 98%',
      muted: '270 30% 96%',
      mutedForeground: '270 20% 50%',
      accent: '300 70% 65%',
      accentForeground: '270 40% 98%',
      destructive: '0 84% 60%',
      destructiveForeground: '0 0% 100%',
      border: '270 30% 90%',
      input: '270 30% 90%',
      ring: '280 90% 65%',
      themeColor: '#f8f5fc'
    }
  },
  sand: {
    name: 'Sand',
    followsSystem: false,
    isDark: false,
    colors: {
      background: '35 50% 98%',
      foreground: '35 90% 15%',
      card: '35 50% 98%',
      cardForeground: '35 90% 15%',
      popover: '35 50% 98%',
      popoverForeground: '35 90% 15%',
      primary: '35 90% 45%',
      primaryForeground: '35 50% 98%',
      secondary: '37 85% 50%',
      secondaryForeground: '35 50% 98%',
      muted: '35 30% 96%',
      mutedForeground: '35 20% 45%',
      accent: '45 70% 55%',
      accentForeground: '35 50% 98%',
      destructive: '0 84% 60%',
      destructiveForeground: '0 0% 100%',
      border: '35 30% 90%',
      input: '35 30% 90%',
      ring: '37 90% 55%',
      themeColor: '#fbf8f3'
    }
  },
  // LGBT+ Pride Themes - Dark & Light Variants with Extended Palettes (3-5 colors)
  // Trans Pride - Dark (3 flag colors + white/black for extended palette)
  'trans-pride': {
    name: 'Trans Pride (Dark)',
    followsSystem: false,
    isDark: true,
    colors: {
      background: '220 50% 10%',
      foreground: '0 0% 95%',
      card: '220 50% 12%',
      cardForeground: '0 0% 95%',
      popover: '220 50% 12%',
      popoverForeground: '0 0% 95%',
      primary: '195 75% 68%',
      primaryForeground: '195 40% 15%',
      secondary: '350 65% 73%',
      secondaryForeground: '350 40% 15%',
      muted: '220 30% 20%',
      mutedForeground: '220 20% 70%',
      accent: '0 0% 85%',
      accentForeground: '0 0% 15%',
      destructive: '0 62% 30%',
      destructiveForeground: '0 0% 95%',
      border: '220 30% 20%',
      input: '220 30% 20%',
      ring: '195 75% 68%',
      themeColor: '#1a2330'
    }
  },
  // Trans Pride - Light
  'trans-pride-light': {
    name: 'Trans Pride (Light)',
    followsSystem: false,
    isDark: false,
    colors: {
      background: '0 0% 98%',
      foreground: '220 30% 15%',
      card: '0 0% 100%',
      cardForeground: '220 30% 15%',
      popover: '0 0% 100%',
      popoverForeground: '220 30% 15%',
      primary: '195 75% 55%',
      primaryForeground: '0 0% 100%',
      secondary: '350 65% 60%',
      secondaryForeground: '0 0% 100%',
      muted: '220 30% 96%',
      mutedForeground: '220 20% 45%',
      accent: '0 0% 90%',
      accentForeground: '0 0% 15%',
      destructive: '0 62% 50%',
      destructiveForeground: '0 0% 100%',
      border: '220 30% 90%',
      input: '220 30% 90%',
      ring: '195 75% 55%',
      themeColor: '#f0f5f8'
    }
  },
  // Lesbian Pride - Light (tinted toward orange/primary)
  'lesbian-pride-light': {
    name: 'Lesbian Pride (Light)',
    followsSystem: false,
    isDark: false,
    colors: {
      background: '15 30% 98%',
      foreground: '15 40% 15%',
      card: '15 30% 98%',
      cardForeground: '15 40% 15%',
      popover: '15 30% 98%',
      popoverForeground: '15 40% 15%',
      primary: '15 100% 45%',
      primaryForeground: '15 30% 98%',
      secondary: '30 100% 60%',
      secondaryForeground: '15 30% 98%',
      muted: '30 30% 96%',
      mutedForeground: '30 20% 45%',
      accent: '330 70% 50%',
      accentForeground: '15 30% 98%',
      destructive: '0 100% 42%',
      destructiveForeground: '0 40% 95%',
      border: '30 30% 90%',
      input: '30 30% 90%',
      ring: '15 100% 45%',
      themeColor: '#fbf5f3'
    }
  },
  // Bi Pride - Dark (3 flag colors)
  'bi-pride': {
    name: 'Bi Pride (Dark)',
    followsSystem: false,
    isDark: true,
    colors: {
      background: '220 50% 10%',
      foreground: '220 30% 95%',
      card: '220 50% 12%',
      cardForeground: '220 30% 95%',
      popover: '220 50% 12%',
      popoverForeground: '220 30% 95%',
      primary: '330 100% 43%',
      primaryForeground: '330 40% 95%',
      secondary: '280 50% 46%',
      secondaryForeground: '280 40% 95%',
      muted: '220 30% 20%',
      mutedForeground: '220 20% 70%',
      accent: '220 100% 55%',
      accentForeground: '220 40% 95%',
      destructive: '0 62% 30%',
      destructiveForeground: '220 30% 95%',
      border: '220 30% 20%',
      input: '220 30% 20%',
      ring: '330 100% 43%',
      themeColor: '#1a0f25'
    }
  },
  // Bi Pride - Light (tinted toward pink/primary)
  'bi-pride-light': {
    name: 'Bi Pride (Light)',
    followsSystem: false,
    isDark: false,
    colors: {
      background: '330 30% 98%',
      foreground: '330 30% 15%',
      card: '330 30% 98%',
      cardForeground: '330 30% 15%',
      popover: '330 30% 98%',
      popoverForeground: '330 30% 15%',
      primary: '330 100% 50%',
      primaryForeground: '330 30% 98%',
      secondary: '280 50% 55%',
      secondaryForeground: '330 30% 98%',
      muted: '220 30% 96%',
      mutedForeground: '220 20% 45%',
      accent: '220 100% 65%',
      accentForeground: '330 30% 98%',
      destructive: '0 62% 50%',
      destructiveForeground: '0 0% 100%',
      border: '220 30% 90%',
      input: '220 30% 90%',
      ring: '330 100% 50%',
      themeColor: '#fbf3f7'
    }
  },
  // Pan Pride - Dark (3 flag colors)
  'pan-pride': {
    name: 'Pan Pride (Dark)',
    followsSystem: false,
    isDark: true,
    colors: {
      background: '220 50% 10%',
      foreground: '220 30% 95%',
      card: '220 50% 12%',
      cardForeground: '220 30% 95%',
      popover: '220 50% 12%',
      popoverForeground: '220 30% 95%',
      primary: '330 100% 56%',
      primaryForeground: '330 40% 15%',
      secondary: '45 100% 56%',
      secondaryForeground: '45 40% 15%',
      muted: '220 30% 20%',
      mutedForeground: '220 20% 70%',
      accent: '200 100% 56%',
      accentForeground: '200 40% 95%',
      destructive: '0 62% 30%',
      destructiveForeground: '220 30% 95%',
      border: '220 30% 20%',
      input: '220 30% 20%',
      ring: '330 100% 56%',
      themeColor: '#1a1525'
    }
  },
  // Pan Pride - Light (tinted toward pink/primary)
  'pan-pride-light': {
    name: 'Pan Pride (Light)',
    followsSystem: false,
    isDark: false,
    colors: {
      background: '330 25% 98%',
      foreground: '330 30% 15%',
      card: '330 25% 98%',
      cardForeground: '330 30% 15%',
      popover: '330 25% 98%',
      popoverForeground: '330 30% 15%',
      primary: '330 100% 50%',
      primaryForeground: '330 25% 98%',
      secondary: '45 100% 45%',
      secondaryForeground: '330 25% 98%',
      muted: '220 30% 96%',
      mutedForeground: '220 20% 45%',
      accent: '200 100% 45%',
      accentForeground: '330 25% 98%',
      destructive: '0 62% 50%',
      destructiveForeground: '0 0% 100%',
      border: '220 30% 90%',
      input: '220 30% 90%',
      ring: '330 100% 50%',
      themeColor: '#fbf3f6'
    }
  },
  // Non-Binary Pride - Light (tinted toward yellow/primary)
  'nonbinary-pride-light': {
    name: 'Non-Binary Pride (Light)',
    followsSystem: false,
    isDark: false,
    colors: {
      background: '55 30% 98%',
      foreground: '55 30% 15%',
      card: '55 30% 98%',
      cardForeground: '55 30% 15%',
      popover: '55 30% 98%',
      popoverForeground: '55 30% 15%',
      primary: '55 100% 50%',
      primaryForeground: '55 30% 98%',
      secondary: '0 0% 90%',
      secondaryForeground: '0 0% 15%',
      muted: '220 30% 96%',
      mutedForeground: '220 20% 45%',
      accent: '270 60% 50%',
      accentForeground: '55 30% 98%',
      destructive: '0 0% 30%',
      destructiveForeground: '0 0% 100%',
      border: '220 30% 90%',
      input: '220 30% 90%',
      ring: '55 100% 50%',
      themeColor: '#fbfaf3'
    }
  },
  // Rainbow Pride - Dark (6 stripe colors - use 5 for palette)
  'rainbow-pride': {
    name: 'Rainbow Pride (Dark)',
    followsSystem: false,
    isDark: true,
    colors: {
      background: '220 50% 10%',
      foreground: '220 30% 95%',
      card: '220 50% 12%',
      cardForeground: '220 30% 95%',
      popover: '220 50% 12%',
      popoverForeground: '220 30% 95%',
      primary: '0 100% 50%',
      primaryForeground: '0 40% 95%',
      secondary: '30 100% 50%',
      secondaryForeground: '30 40% 15%',
      muted: '220 30% 20%',
      mutedForeground: '220 20% 70%',
      accent: '50 100% 50%',
      accentForeground: '50 40% 15%',
      destructive: '140 100% 35%',
      destructiveForeground: '140 40% 95%',
      border: '220 30% 20%',
      input: '220 30% 20%',
      ring: '0 100% 50%',
      themeColor: '#1a1015'
    }
  },
  // Rainbow Pride - Light (tinted toward red/primary)
  'rainbow-pride-light': {
    name: 'Rainbow Pride (Light)',
    followsSystem: false,
    isDark: false,
    colors: {
      background: '0 20% 98%',
      foreground: '0 20% 15%',
      card: '0 20% 98%',
      cardForeground: '0 20% 15%',
      popover: '0 20% 98%',
      popoverForeground: '0 20% 15%',
      primary: '0 100% 50%',
      primaryForeground: '0 20% 98%',
      secondary: '30 100% 45%',
      secondaryForeground: '0 20% 98%',
      muted: '220 30% 96%',
      mutedForeground: '220 20% 45%',
      accent: '50 100% 45%',
      accentForeground: '0 20% 98%',
      destructive: '140 100% 35%',
      destructiveForeground: '140 40% 95%',
      border: '220 30% 90%',
      input: '220 30% 90%',
      ring: '0 100% 50%',
      themeColor: '#fbf3f3'
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
      applyColors(systemTheme.colors, systemIsDark);
      localStorage.setItem('theme', 'system');
      return;
    }

    // Handle explicit themes
    setIsDarkMode(theme.isDark);
    applyColors(theme.colors, theme.isDark);
    localStorage.setItem('theme', themeName);
  };

  // Helper to apply color variables to document
  const applyColors = (colors, isDark) => {
    const root = document.documentElement;
    
    // Update dark mode class for Tailwind CSS
    if (isDark) {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
    }
    
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
      statusBarMeta.setAttribute('content', isDark ? 'black-translucent' : 'default');
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
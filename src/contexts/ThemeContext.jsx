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
// Organized: Light themes first, then Dark themes
const THEMES = {
  // ===== LIGHT THEMES =====
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
      primaryForeground: '0 0% 100%',
      secondary: '210 40% 96.1%',
      secondaryForeground: '222.2 47.4% 11.2%',
      muted: '210 40% 96.1%',
      mutedForeground: '215.4 16.3% 40%',
      accent: '210 40% 96.1%',
      accentForeground: '222.2 47.4% 11.2%',
      destructive: '0 84.2% 60.2%',
      destructiveForeground: '0 0% 100%',
      border: '214.3 31.8% 91.4%',
      input: '214.3 31.8% 91.4%',
      ring: '25 95% 53%',
      themeColor: '#ffffff'
    }
  },
  // Light themed variants
  alpine: {
    name: 'Alpine',
    followsSystem: false,
    isDark: false,
    colors: {
      background: '200 100% 98%',
      foreground: '200 100% 15%',
      card: '200 100% 99%',
      cardForeground: '200 100% 15%',
      popover: '200 100% 99%',
      popoverForeground: '200 100% 15%',
      primary: '200 100% 35%',
      primaryForeground: '0 0% 100%',
      secondary: '190 90% 40%',
      secondaryForeground: '0 0% 100%',
      muted: '200 30% 94%',
      mutedForeground: '200 40% 35%',
      accent: '180 80% 40%',
      accentForeground: '0 0% 100%',
      destructive: '0 84% 50%',
      destructiveForeground: '0 0% 100%',
      border: '200 40% 85%',
      input: '200 40% 85%',
      ring: '200 100% 35%',
      themeColor: '#e8f4f8'
    }
  },
  sage: {
    name: 'Sage',
    followsSystem: false,
    isDark: false,
    colors: {
      background: '140 50% 97%',
      foreground: '140 80% 12%',
      card: '140 50% 98%',
      cardForeground: '140 80% 12%',
      popover: '140 50% 98%',
      popoverForeground: '140 80% 12%',
      primary: '140 70% 35%',
      primaryForeground: '0 0% 100%',
      secondary: '150 60% 35%',
      secondaryForeground: '0 0% 100%',
      muted: '140 30% 92%',
      mutedForeground: '140 40% 30%',
      accent: '70 70% 35%',
      accentForeground: '0 0% 100%',
      destructive: '0 84% 50%',
      destructiveForeground: '0 0% 100%',
      border: '140 40% 85%',
      input: '140 40% 85%',
      ring: '140 70% 35%',
      themeColor: '#eef5ed'
    }
  },
  lavender: {
    name: 'Lavender',
    followsSystem: false,
    isDark: false,
    colors: {
      background: '270 50% 97%',
      foreground: '270 80% 18%',
      card: '270 50% 98%',
      cardForeground: '270 80% 18%',
      popover: '270 50% 98%',
      popoverForeground: '270 80% 18%',
      primary: '270 70% 45%',
      primaryForeground: '0 0% 100%',
      secondary: '280 70% 50%',
      secondaryForeground: '0 0% 100%',
      muted: '270 30% 94%',
      mutedForeground: '270 40% 40%',
      accent: '300 70% 50%',
      accentForeground: '0 0% 100%',
      destructive: '0 84% 50%',
      destructiveForeground: '0 0% 100%',
      border: '270 40% 88%',
      input: '270 40% 88%',
      ring: '270 70% 45%',
      themeColor: '#f5eef8'
    }
  },
  sand: {
    name: 'Sand',
    followsSystem: false,
    isDark: false,
    colors: {
      background: '35 50% 97%',
      foreground: '35 80% 15%',
      card: '35 50% 98%',
      cardForeground: '35 80% 15%',
      popover: '35 50% 98%',
      popoverForeground: '35 80% 15%',
      primary: '35 90% 40%',
      primaryForeground: '0 0% 100%',
      secondary: '37 85% 45%',
      secondaryForeground: '0 0% 100%',
      muted: '35 30% 92%',
      mutedForeground: '35 40% 35%',
      accent: '45 70% 40%',
      accentForeground: '0 0% 100%',
      destructive: '0 84% 50%',
      destructiveForeground: '0 0% 100%',
      border: '35 40% 85%',
      input: '35 40% 85%',
      ring: '35 90% 40%',
      themeColor: '#f9f4ef'
    }
  },
  // Pride Light variants
  'trans-pride-light': {
    name: 'Trans Pride (Light)',
    followsSystem: false,
    isDark: false,
    colors: {
      background: '195 50% 97%',
      foreground: '195 60% 15%',
      card: '195 50% 98%',
      cardForeground: '195 60% 15%',
      popover: '195 50% 98%',
      popoverForeground: '195 60% 15%',
      primary: '195 75% 45%',
      primaryForeground: '0 0% 100%',
      secondary: '350 65% 55%',
      secondaryForeground: '0 0% 100%',
      muted: '195 30% 94%',
      mutedForeground: '195 40% 35%',
      accent: '0 0% 80%',
      accentForeground: '0 0% 15%',
      destructive: '0 62% 45%',
      destructiveForeground: '0 0% 100%',
      border: '195 40% 88%',
      input: '195 40% 88%',
      ring: '195 75% 45%',
      themeColor: '#e8f3f7'
    }
  },
  'lesbian-pride-light': {
    name: 'Lesbian Pride (Light)',
    followsSystem: false,
    isDark: false,
    colors: {
      background: '15 40% 97%',
      foreground: '15 50% 15%',
      card: '15 40% 98%',
      cardForeground: '15 50% 15%',
      popover: '15 40% 98%',
      popoverForeground: '15 50% 15%',
      primary: '15 100% 40%',
      primaryForeground: '0 0% 100%',
      secondary: '30 90% 55%',
      secondaryForeground: '0 0% 100%',
      muted: '30 30% 94%',
      mutedForeground: '30 40% 35%',
      accent: '330 70% 45%',
      accentForeground: '0 0% 100%',
      destructive: '0 100% 40%',
      destructiveForeground: '0 0% 100%',
      border: '30 40% 88%',
      input: '30 40% 88%',
      ring: '15 100% 40%',
      themeColor: '#f7ebe8'
    }
  },
  'bi-pride-light': {
    name: 'Bi Pride (Light)',
    followsSystem: false,
    isDark: false,
    colors: {
      background: '330 40% 97%',
      foreground: '330 50% 15%',
      card: '330 40% 98%',
      cardForeground: '330 50% 15%',
      popover: '330 40% 98%',
      popoverForeground: '330 50% 15%',
      primary: '330 100% 45%',
      primaryForeground: '0 0% 100%',
      secondary: '280 60% 50%',
      secondaryForeground: '0 0% 100%',
      muted: '330 30% 94%',
      mutedForeground: '330 40% 35%',
      accent: '220 100% 55%',
      accentForeground: '0 0% 100%',
      destructive: '0 62% 45%',
      destructiveForeground: '0 0% 100%',
      border: '330 40% 88%',
      input: '330 40% 88%',
      ring: '330 100% 45%',
      themeColor: '#f7e8f0'
    }
  },
  'pan-pride-light': {
    name: 'Pan Pride (Light)',
    followsSystem: false,
    isDark: false,
    colors: {
      background: '330 35% 97%',
      foreground: '330 45% 15%',
      card: '330 35% 98%',
      cardForeground: '330 45% 15%',
      popover: '330 35% 98%',
      popoverForeground: '330 45% 15%',
      primary: '330 100% 45%',
      primaryForeground: '0 0% 100%',
      secondary: '45 100% 45%',
      secondaryForeground: '0 0% 100%',
      muted: '330 30% 94%',
      mutedForeground: '330 40% 35%',
      accent: '200 100% 45%',
      accentForeground: '0 0% 100%',
      destructive: '0 62% 45%',
      destructiveForeground: '0 0% 100%',
      border: '330 40% 88%',
      input: '330 40% 88%',
      ring: '330 100% 45%',
      themeColor: '#f7e8ed'
    }
  },
  'nonbinary-pride-light': {
    name: 'Non-Binary Pride (Light)',
    followsSystem: false,
    isDark: false,
    colors: {
      background: '55 35% 96%',
      foreground: '55 40% 18%',
      card: '55 35% 97%',
      cardForeground: '55 40% 18%',
      popover: '55 35% 97%',
      popoverForeground: '55 40% 18%',
      primary: '55 100% 45%',
      primaryForeground: '0 0% 100%',
      secondary: '0 0% 85%',
      secondaryForeground: '0 0% 15%',
      muted: '55 30% 92%',
      mutedForeground: '55 40% 35%',
      accent: '270 60% 50%',
      accentForeground: '0 0% 100%',
      destructive: '0 0% 30%',
      destructiveForeground: '0 0% 100%',
      border: '55 40% 85%',
      input: '55 40% 85%',
      ring: '55 100% 45%',
      themeColor: '#f9f8e8'
    }
  },
  'rainbow-pride-light': {
    name: 'Rainbow Pride (Light)',
    followsSystem: false,
    isDark: false,
    colors: {
      background: '0 30% 97%',
      foreground: '0 35% 15%',
      card: '0 30% 98%',
      cardForeground: '0 35% 15%',
      popover: '0 30% 98%',
      popoverForeground: '0 35% 15%',
      primary: '0 100% 45%',
      primaryForeground: '0 0% 100%',
      secondary: '30 100% 45%',
      secondaryForeground: '0 0% 100%',
      muted: '0 20% 94%',
      mutedForeground: '0 30% 35%',
      accent: '50 100% 40%',
      accentForeground: '0 0% 100%',
      destructive: '140 80% 30%',
      destructiveForeground: '0 0% 100%',
      border: '0 30% 88%',
      input: '0 30% 88%',
      ring: '0 100% 45%',
      themeColor: '#f9e8e8'
    }
  },
  // ===== DARK THEMES =====
  dark: {
    name: 'Dark',
    followsSystem: false,
    isDark: true,
    colors: {
      background: '222.2 84% 8%',
      foreground: '210 40% 95%',
      card: '217.2 91.2% 10%',
      cardForeground: '210 40% 95%',
      popover: '217.2 91.2% 10%',
      popoverForeground: '210 40% 95%',
      primary: '25 95% 53%',
      primaryForeground: '0 0% 100%',
      secondary: '217.2 32.6% 17.5%',
      secondaryForeground: '210 40% 98%',
      muted: '217.2 32.6% 17.5%',
      mutedForeground: '215 20.2% 70%',
      accent: '217.2 32.6% 17.5%',
      accentForeground: '210 40% 98%',
      destructive: '0 72% 50%',
      destructiveForeground: '0 0% 100%',
      border: '217.2 32.6% 20%',
      input: '217.2 32.6% 20%',
      ring: '25 95% 53%',
      themeColor: '#141b24'
    }
  },
  midnight: {
    name: 'Midnight',
    followsSystem: false,
    isDark: true,
    colors: {
      background: '222.2 84% 8%',
      foreground: '210 40% 95%',
      card: '217.2 91.2% 10%',
      cardForeground: '210 40% 95%',
      popover: '217.2 91.2% 10%',
      popoverForeground: '210 40% 95%',
      primary: '210 100% 60%',
      primaryForeground: '0 0% 100%',
      secondary: '217.2 32.6% 17.5%',
      secondaryForeground: '210 40% 98%',
      muted: '217.2 32.6% 17.5%',
      mutedForeground: '215 20.2% 70%',
      accent: '217.2 32.6% 17.5%',
      accentForeground: '210 40% 98%',
      destructive: '0 72% 50%',
      destructiveForeground: '0 0% 100%',
      border: '217.2 32.6% 18%',
      input: '217.2 32.6% 18%',
      ring: '210 100% 60%',
      themeColor: '#101824'
    }
  },
  ocean: {
    name: 'Ocean',
    followsSystem: false,
    isDark: true,
    colors: {
      background: '200 70% 10%',
      foreground: '200 40% 92%',
      card: '200 70% 12%',
      cardForeground: '200 40% 92%',
      popover: '200 70% 12%',
      popoverForeground: '200 40% 92%',
      primary: '180 80% 45%',
      primaryForeground: '0 0% 100%',
      secondary: '200 60% 18%',
      secondaryForeground: '200 40% 92%',
      muted: '200 50% 18%',
      mutedForeground: '200 30% 70%',
      accent: '200 60% 18%',
      accentForeground: '200 40% 92%',
      destructive: '0 72% 50%',
      destructiveForeground: '0 0% 100%',
      border: '200 50% 20%',
      input: '200 50% 20%',
      ring: '180 80% 45%',
      themeColor: '#122530'
    }
  },
  forest: {
    name: 'Forest',
    followsSystem: false,
    isDark: true,
    colors: {
      background: '140 45% 10%',
      foreground: '140 30% 92%',
      card: '140 45% 12%',
      cardForeground: '140 30% 92%',
      popover: '140 45% 12%',
      popoverForeground: '140 30% 92%',
      primary: '140 70% 45%',
      primaryForeground: '0 0% 100%',
      secondary: '140 40% 18%',
      secondaryForeground: '140 30% 92%',
      muted: '140 35% 18%',
      mutedForeground: '140 30% 70%',
      accent: '140 40% 18%',
      accentForeground: '140 30% 92%',
      destructive: '0 72% 50%',
      destructiveForeground: '0 0% 100%',
      border: '140 35% 20%',
      input: '140 35% 20%',
      ring: '140 70% 45%',
      themeColor: '#152518'
    }
  },
  sunset: {
    name: 'Sunset',
    followsSystem: false,
    isDark: true,
    colors: {
      background: '30 45% 12%',
      foreground: '30 40% 92%',
      card: '30 45% 14%',
      cardForeground: '30 40% 92%',
      popover: '30 45% 14%',
      popoverForeground: '30 40% 92%',
      primary: '30 90% 55%',
      primaryForeground: '0 0% 100%',
      secondary: '30 40% 20%',
      secondaryForeground: '30 40% 92%',
      muted: '30 35% 20%',
      mutedForeground: '30 30% 70%',
      accent: '30 40% 20%',
      accentForeground: '30 40% 92%',
      destructive: '0 72% 50%',
      destructiveForeground: '0 0% 100%',
      border: '30 35% 22%',
      input: '30 35% 22%',
      ring: '30 90% 55%',
      themeColor: '#2a1f18'
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
      primaryForeground: '0 0% 100%',
      secondary: '45 20% 25%',
      secondaryForeground: '45 10% 90%',
      muted: '45 20% 25%',
      mutedForeground: '45 10% 70%',
      accent: '45 20% 25%',
      accentForeground: '45 10% 90%',
      destructive: '0 72% 50%',
      destructiveForeground: '0 0% 100%',
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
      primaryForeground: '0 0% 100%',
      secondary: '260 30% 25%',
      secondaryForeground: '260 20% 90%',
      muted: '260 30% 25%',
      mutedForeground: '260 20% 70%',
      accent: '260 30% 25%',
      accentForeground: '260 20% 90%',
      destructive: '0 72% 50%',
      destructiveForeground: '0 0% 100%',
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
      primaryForeground: '0 0% 100%',
      secondary: '210 25% 28%',
      secondaryForeground: '210 30% 90%',
      muted: '210 25% 28%',
      mutedForeground: '210 20% 70%',
      accent: '210 25% 28%',
      accentForeground: '210 30% 90%',
      destructive: '0 72% 50%',
      destructiveForeground: '0 0% 100%',
      border: '210 25% 28%',
      input: '210 25% 28%',
      ring: '190 50% 60%',
      themeColor: '#2e3440'
    }
  },
  // Pride Dark variants (with lighter backgrounds for readability)
  'trans-pride': {
    name: 'Trans Pride',
    followsSystem: false,
    isDark: true,
    colors: {
      background: '195 40% 15%',
      foreground: '195 50% 90%',
      card: '195 40% 17%',
      cardForeground: '195 50% 90%',
      popover: '195 40% 17%',
      popoverForeground: '195 50% 90%',
      primary: '195 75% 60%',
      primaryForeground: '0 0% 100%',
      secondary: '350 65% 65%',
      secondaryForeground: '350 40% 15%',
      muted: '195 30% 22%',
      mutedForeground: '195 40% 70%',
      accent: '0 0% 80%',
      accentForeground: '0 0% 15%',
      destructive: '0 72% 50%',
      destructiveForeground: '0 0% 100%',
      border: '195 30% 25%',
      input: '195 30% 25%',
      ring: '195 75% 60%',
      themeColor: '#1f3a47'
    }
  },
  'lesbian-pride': {
    name: 'Lesbian Pride',
    followsSystem: false,
    isDark: true,
    colors: {
      background: '15 35% 15%',
      foreground: '15 40% 90%',
      card: '15 35% 17%',
      cardForeground: '15 40% 90%',
      popover: '15 35% 17%',
      popoverForeground: '15 40% 90%',
      primary: '15 100% 50%',
      primaryForeground: '0 0% 100%',
      secondary: '30 90% 60%',
      secondaryForeground: '30 40% 15%',
      muted: '15 30% 22%',
      mutedForeground: '15 40% 70%',
      accent: '330 70% 55%',
      accentForeground: '330 40% 15%',
      destructive: '0 72% 50%',
      destructiveForeground: '0 0% 100%',
      border: '15 30% 25%',
      input: '15 30% 25%',
      ring: '15 100% 50%',
      themeColor: '#3d2328'
    }
  },
  'bi-pride': {
    name: 'Bi Pride',
    followsSystem: false,
    isDark: true,
    colors: {
      background: '280 40% 15%',
      foreground: '280 30% 90%',
      card: '280 40% 17%',
      cardForeground: '280 30% 90%',
      popover: '280 40% 17%',
      popoverForeground: '280 30% 90%',
      primary: '330 100% 55%',
      primaryForeground: '0 0% 100%',
      secondary: '280 60% 55%',
      secondaryForeground: '0 0% 100%',
      muted: '280 30% 22%',
      mutedForeground: '280 20% 75%',
      accent: '220 100% 60%',
      accentForeground: '0 0% 100%',
      destructive: '0 72% 50%',
      destructiveForeground: '0 0% 100%',
      border: '280 30% 25%',
      input: '280 30% 25%',
      ring: '330 100% 55%',
      themeColor: '#2f1f3d'
    }
  },
  'pan-pride': {
    name: 'Pan Pride',
    followsSystem: false,
    isDark: true,
    colors: {
      background: '330 35% 15%',
      foreground: '330 30% 90%',
      card: '330 35% 17%',
      cardForeground: '330 30% 90%',
      popover: '330 35% 17%',
      popoverForeground: '330 30% 90%',
      primary: '330 100% 55%',
      primaryForeground: '0 0% 100%',
      secondary: '45 100% 50%',
      secondaryForeground: '0 0% 100%',
      muted: '330 30% 22%',
      mutedForeground: '330 20% 75%',
      accent: '200 100% 55%',
      accentForeground: '0 0% 100%',
      destructive: '0 72% 50%',
      destructiveForeground: '0 0% 100%',
      border: '330 30% 25%',
      input: '330 30% 25%',
      ring: '330 100% 55%',
      themeColor: '#3d1f2f'
    }
  },
  'nonbinary-pride': {
    name: 'Non-Binary Pride',
    followsSystem: false,
    isDark: true,
    colors: {
      background: '55 30% 15%',
      foreground: '55 35% 90%',
      card: '55 30% 17%',
      cardForeground: '55 35% 90%',
      popover: '55 30% 17%',
      popoverForeground: '55 35% 90%',
      primary: '55 100% 50%',
      primaryForeground: '55 40% 15%',
      secondary: '0 0% 85%',
      secondaryForeground: '0 0% 15%',
      muted: '55 25% 22%',
      mutedForeground: '55 35% 70%',
      accent: '270 60% 60%',
      accentForeground: '270 40% 15%',
      destructive: '0 72% 50%',
      destructiveForeground: '0 0% 100%',
      border: '55 30% 25%',
      input: '55 30% 25%',
      ring: '55 100% 50%',
      themeColor: '#2f2f1f'
    }
  },
  'rainbow-pride': {
    name: 'Rainbow Pride',
    followsSystem: false,
    isDark: true,
    colors: {
      background: '220 40% 14%',
      foreground: '220 30% 90%',
      card: '220 40% 16%',
      cardForeground: '220 30% 90%',
      popover: '220 40% 16%',
      popoverForeground: '220 30% 90%',
      primary: '0 100% 55%',
      primaryForeground: '0 40% 95%',
      secondary: '45 100% 50%',
      secondaryForeground: '45 40% 15%',
      muted: '220 30% 22%',
      mutedForeground: '220 20% 70%',
      accent: '140 80% 40%',
      accentForeground: '140 40% 95%',
      destructive: '0 72% 50%',
      destructiveForeground: '0 0% 100%',
      border: '220 30% 25%',
      input: '220 30% 25%',
      ring: '0 100% 55%',
      themeColor: '#2f3a4f'
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
        // Update favicon with theme color
        updateFavicon(value);
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

  // Update favicon with theme color
  const updateFavicon = (themeColor) => {
    const link = document.querySelector("link[rel~='icon']");
    if (link) {
      // Create SVG favicon with theme color
      const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>
        <defs>
          <linearGradient id='grad' x1='0%' y1='0%' x2='100%' y2='100%'>
            <stop offset='0%' style='stop-color:${themeColor};stop-opacity:1' />
            <stop offset='100%' style='stop-color:${themeColor};stop-opacity:0.8' />
          </linearGradient>
        </defs>
        <rect width='100' height='100' rx='20' fill='url(#grad)'/>
        <text x='50' y='70' font-family='Arial, sans-serif' font-size='60' font-weight='bold' fill='white' text-anchor='middle'>Q</text>
      </svg>`;
      link.href = `data:image/svg+xml,${encodeURIComponent(svg)}`;
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

  const setTheme = (themeName) => {
    setCurrentTheme(themeName);
  };

  const value = {
    isDarkMode,
    isSystemDark,
    currentTheme,
    setTheme,
    themes: THEMES
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
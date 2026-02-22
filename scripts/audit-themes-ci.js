import { getContrastRatioAny } from './contrast.js';

// THEMES will be replaced by generate-audit.py with actual theme data



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
      foreground: '0 0% 12%',
      card: '0 0% 100%',
      cardForeground: '0 0% 10%',
      popover: '0 0% 100%',
      popoverForeground: '0 0% 10%',
      primary: '15 89% 30%',
      primaryForeground: '0 0% 100%',
      secondary: '210 40% 30%',
      secondaryForeground: '0 0% 100%',
      muted: '210 40% 96.1%',
      mutedForeground: '0 0% 35%',
      accent: '210 40% 30%',
      accentForeground: '0 0% 100%',
      destructive: '0 84.2% 35%',
      destructiveForeground: '0 0% 100%',
      border: '214.3 31.8% 91.4%',
      input: '214.3 31.8% 91.4%',
      ring: '15 89% 30%',
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
      foreground: '0 0% 12%',
      card: '200 100% 99%',
      cardForeground: '0 0% 10%',
      popover: '200 100% 99%',
      popoverForeground: '0 0% 10%',
      primary: '200 100% 25%',
      primaryForeground: '0 0% 100%',
      secondary: '190 90% 28%',
      secondaryForeground: '0 0% 100%',
      muted: '200 30% 94%',
      mutedForeground: '0 0% 35%',
      accent: '180 80% 28%',
      accentForeground: '0 0% 100%',
      destructive: '0 84% 35%',
      destructiveForeground: '0 0% 100%',
      border: '200 40% 85%',
      input: '200 40% 85%',
      ring: '200 100% 25%',
      themeColor: '#e8f4f8'
    }
  },
  sage: {
    name: 'Sage',
    followsSystem: false,
    isDark: false,
    colors: {
      background: '140 50% 97%',
      foreground: '0 0% 12%',
      card: '140 50% 98%',
      cardForeground: '0 0% 10%',
      popover: '140 50% 98%',
      popoverForeground: '0 0% 10%',
      primary: '140 70% 25%',
      primaryForeground: '0 0% 100%',
      secondary: '150 60% 25%',
      secondaryForeground: '0 0% 100%',
      muted: '140 30% 92%',
      mutedForeground: '0 0% 35%',
      accent: '70 70% 25%',
      accentForeground: '0 0% 100%',
      destructive: '0 84% 35%',
      destructiveForeground: '0 0% 100%',
      border: '140 40% 85%',
      input: '140 40% 85%',
      ring: '140 70% 25%',
      themeColor: '#eef5ed'
    }
  },
  lavender: {
    name: 'Lavender',
    followsSystem: false,
    isDark: false,
    colors: {
      background: '270 50% 97%',
      foreground: '0 0% 12%',
      card: '270 50% 98%',
      cardForeground: '0 0% 10%',
      popover: '270 50% 98%',
      popoverForeground: '0 0% 10%',
      primary: '270 70% 35%',
      primaryForeground: '0 0% 100%',
      secondary: '280 70% 35%',
      secondaryForeground: '0 0% 100%',
      muted: '270 30% 94%',
      mutedForeground: '0 0% 35%',
      accent: '300 70% 35%',
      accentForeground: '0 0% 100%',
      destructive: '0 84% 35%',
      destructiveForeground: '0 0% 100%',
      border: '270 40% 88%',
      input: '270 40% 88%',
      ring: '270 70% 35%',
      themeColor: '#f5eef8'
    }
  },
  sand: {
    name: 'Sand',
    followsSystem: false,
    isDark: false,
    colors: {
      background: '35 50% 97%',
      foreground: '0 0% 12%',
      card: '35 50% 98%',
      cardForeground: '0 0% 10%',
      popover: '35 50% 98%',
      popoverForeground: '0 0% 10%',
      primary: '35 90% 32%',
      primaryForeground: '0 0% 100%',
      secondary: '37 85% 30%',
      secondaryForeground: '0 0% 100%',
      muted: '35 30% 92%',
      mutedForeground: '0 0% 35%',
      accent: '45 70% 25%',
      accentForeground: '0 0% 100%',
      destructive: '0 84% 35%',
      destructiveForeground: '0 0% 100%',
      border: '35 40% 85%',
      input: '35 40% 85%',
      ring: '35 90% 32%',
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
      foreground: '0 0% 12%',
      card: '195 50% 98%',
      cardForeground: '0 0% 10%',
      popover: '195 50% 98%',
      popoverForeground: '0 0% 10%',
      primary: '195 75% 35%',
      primaryForeground: '0 0% 100%',
      secondary: '350 65% 35%',
      secondaryForeground: '0 0% 100%',
      muted: '195 30% 94%',
      mutedForeground: '0 0% 35%',
      accent: '0 0% 25%',
      accentForeground: '0 0% 100%',
      destructive: '0 72% 35%',
      destructiveForeground: '0 0% 100%',
      border: '195 40% 88%',
      input: '195 40% 88%',
      ring: '195 75% 35%',
      themeColor: '#e8f3f7'
    }
  },
  'lesbian-pride-light': {
    name: 'Lesbian Pride (Light)',
    followsSystem: false,
    isDark: false,
    colors: {
      background: '15 40% 97%',
      foreground: '0 0% 12%',
      card: '15 40% 98%',
      cardForeground: '0 0% 10%',
      popover: '15 40% 98%',
      popoverForeground: '0 0% 10%',
      primary: '15 100% 35%',
      primaryForeground: '0 0% 100%',
      secondary: '30 90% 30%',
      secondaryForeground: '0 0% 100%',
      muted: '30 30% 94%',
      mutedForeground: '0 0% 35%',
      accent: '330 70% 35%',
      accentForeground: '0 0% 100%',
      destructive: '0 100% 35%',
      destructiveForeground: '0 0% 100%',
      border: '30 40% 88%',
      input: '30 40% 88%',
      ring: '15 100% 35%',
      themeColor: '#f7ebe8'
    }
  },
  'bi-pride-light': {
    name: 'Bi Pride (Light)',
    followsSystem: false,
    isDark: false,
    colors: {
      background: '330 40% 97%',
      foreground: '0 0% 12%',
      card: '330 40% 98%',
      cardForeground: '0 0% 10%',
      popover: '330 40% 98%',
      popoverForeground: '0 0% 10%',
      primary: '330 100% 35%',
      primaryForeground: '0 0% 100%',
      secondary: '280 60% 35%',
      secondaryForeground: '0 0% 100%',
      muted: '330 30% 94%',
      mutedForeground: '0 0% 35%',
      accent: '220 100% 35%',
      accentForeground: '0 0% 100%',
      destructive: '0 72% 35%',
      destructiveForeground: '0 0% 100%',
      border: '330 40% 88%',
      input: '330 40% 88%',
      ring: '330 100% 35%',
      themeColor: '#f7e8f0'
    }
  },
  'pan-pride-light': {
    name: 'Pan Pride (Light)',
    followsSystem: false,
    isDark: false,
    colors: {
      background: '330 35% 97%',
      foreground: '0 0% 12%',
      card: '330 35% 98%',
      cardForeground: '0 0% 10%',
      popover: '330 35% 98%',
      popoverForeground: '0 0% 10%',
      primary: '330 100% 35%',
      primaryForeground: '0 0% 100%',
      secondary: '45 100% 25%',
      secondaryForeground: '0 0% 100%',
      muted: '330 30% 94%',
      mutedForeground: '0 0% 35%',
      accent: '200 100% 35%',
      accentForeground: '0 0% 100%',
      destructive: '0 72% 35%',
      destructiveForeground: '0 0% 100%',
      border: '330 40% 88%',
      input: '330 40% 88%',
      ring: '330 100% 35%',
      themeColor: '#f7e8ed'
    }
  },
  'nonbinary-pride-light': {
    name: 'Non-Binary Pride (Light)',
    followsSystem: false,
    isDark: false,
    colors: {
      background: '55 35% 96%',
      foreground: '0 0% 12%',
      card: '55 35% 97%',
      cardForeground: '0 0% 10%',
      popover: '55 35% 97%',
      popoverForeground: '0 0% 10%',
      primary: '55 100% 25%',
      primaryForeground: '0 0% 100%',
      secondary: '0 0% 25%',
      secondaryForeground: '0 0% 100%',
      muted: '55 30% 92%',
      mutedForeground: '0 0% 35%',
      accent: '270 60% 40%',
      accentForeground: '0 0% 100%',
      destructive: '0 0% 25%',
      destructiveForeground: '0 0% 100%',
      border: '55 40% 85%',
      input: '55 40% 85%',
      ring: '55 100% 25%',
      themeColor: '#f9f8e8'
    }
  },
  'rainbow-pride-light': {
    name: 'Rainbow Pride (Light)',
    followsSystem: false,
    isDark: false,
    colors: {
      background: '0 30% 97%',
      foreground: '0 0% 12%',
      card: '0 30% 98%',
      cardForeground: '0 0% 10%',
      popover: '0 30% 98%',
      popoverForeground: '0 0% 10%',
      primary: '0 100% 35%',
      primaryForeground: '0 0% 100%',
      secondary: '30 100% 30%',
      secondaryForeground: '0 0% 100%',
      muted: '0 20% 94%',
      mutedForeground: '0 0% 35%',
      accent: '50 100% 25%',
      accentForeground: '0 0% 100%',
      destructive: '140 80% 28%',
      destructiveForeground: '0 0% 100%',
      border: '0 30% 88%',
      input: '0 30% 88%',
      ring: '0 100% 35%',
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
      foreground: '0 0% 100%',
      card: '217.2 91.2% 10%',
      cardForeground: '0 0% 100%',
      popover: '217.2 91.2% 10%',
      popoverForeground: '0 0% 100%',
      primary: '15 89% 40%',
      primaryForeground: '0 0% 100%',
      secondary: '217.2 32.6% 17.5%',
      secondaryForeground: '0 0% 100%',
      muted: '217.2 32.6% 17.5%',
      mutedForeground: '0 0% 80%',
      accent: '217.2 32.6% 17.5%',
      accentForeground: '0 0% 100%',
      destructive: '0 72% 50%',
      destructiveForeground: '0 0% 100%',
      border: '217.2 32.6% 20%',
      input: '217.2 32.6% 20%',
      ring: '15 89% 40%',
      themeColor: '#141b24'
    }
  },
  midnight: {
    name: 'Midnight',
    followsSystem: false,
    isDark: true,
    colors: {
      background: '222.2 84% 8%',
      foreground: '0 0% 100%',
      card: '217.2 91.2% 10%',
      cardForeground: '0 0% 100%',
      popover: '217.2 91.2% 10%',
      popoverForeground: '0 0% 100%',
      primary: '210 100% 40%',
      primaryForeground: '0 0% 100%',
      secondary: '217.2 32.6% 17.5%',
      secondaryForeground: '0 0% 100%',
      muted: '217.2 32.6% 17.5%',
      mutedForeground: '0 0% 80%',
      accent: '217.2 32.6% 17.5%',
      accentForeground: '0 0% 100%',
      destructive: '0 72% 50%',
      destructiveForeground: '0 0% 100%',
      border: '217.2 32.6% 18%',
      input: '217.2 32.6% 18%',
      ring: '210 100% 40%',
      themeColor: '#101824'
    }
  },
  ocean: {
    name: 'Ocean',
    followsSystem: false,
    isDark: true,
    colors: {
      background: '200 70% 10%',
      foreground: '0 0% 100%',
      card: '200 70% 12%',
      cardForeground: '0 0% 100%',
      popover: '200 70% 12%',
      popoverForeground: '0 0% 100%',
      primary: '180 80% 28%',
      primaryForeground: '0 0% 100%',
      secondary: '200 60% 18%',
      secondaryForeground: '0 0% 100%',
      muted: '200 50% 18%',
      mutedForeground: '0 0% 80%',
      accent: '200 60% 18%',
      accentForeground: '0 0% 100%',
      destructive: '0 72% 50%',
      destructiveForeground: '0 0% 100%',
      border: '200 50% 20%',
      input: '200 50% 20%',
      ring: '180 80% 28%',
      themeColor: '#122530'
    }
  },
  forest: {
    name: 'Forest',
    followsSystem: false,
    isDark: true,
    colors: {
      background: '140 45% 10%',
      foreground: '0 0% 100%',
      card: '140 45% 12%',
      cardForeground: '0 0% 100%',
      popover: '140 45% 12%',
      popoverForeground: '0 0% 100%',
      primary: '140 70% 30%',
      primaryForeground: '0 0% 100%',
      secondary: '140 40% 18%',
      secondaryForeground: '0 0% 100%',
      muted: '140 35% 18%',
      mutedForeground: '0 0% 80%',
      accent: '140 40% 18%',
      accentForeground: '0 0% 100%',
      destructive: '0 72% 50%',
      destructiveForeground: '0 0% 100%',
      border: '140 35% 20%',
      input: '140 35% 20%',
      ring: '140 70% 30%',
      themeColor: '#152518'
    }
  },
  sunset: {
    name: 'Sunset',
    followsSystem: false,
    isDark: true,
    colors: {
      background: '30 45% 12%',
      foreground: '0 0% 100%',
      card: '30 45% 14%',
      cardForeground: '0 0% 100%',
      popover: '30 45% 14%',
      popoverForeground: '0 0% 100%',
      primary: '30 90% 35%',
      primaryForeground: '0 0% 100%',
      secondary: '30 40% 20%',
      secondaryForeground: '0 0% 100%',
      muted: '30 35% 20%',
      mutedForeground: '0 0% 80%',
      accent: '30 40% 20%',
      accentForeground: '0 0% 100%',
      destructive: '0 72% 50%',
      destructiveForeground: '0 0% 100%',
      border: '30 35% 22%',
      input: '30 35% 22%',
      ring: '30 90% 35%',
      themeColor: '#2a1f18'
    }
  },
  monokai: {
    name: 'Monokai',
    followsSystem: false,
    isDark: true,
    colors: {
      background: '45 10% 15%',
      foreground: '0 0% 100%',
      card: '45 10% 18%',
      cardForeground: '0 0% 100%',
      popover: '45 10% 18%',
      popoverForeground: '0 0% 100%',
      primary: '45 100% 28%',
      primaryForeground: '0 0% 100%',
      secondary: '45 20% 25%',
      secondaryForeground: '0 0% 100%',
      muted: '45 20% 25%',
      mutedForeground: '0 0% 80%',
      accent: '45 20% 25%',
      accentForeground: '0 0% 100%',
      destructive: '0 72% 50%',
      destructiveForeground: '0 0% 100%',
      border: '45 20% 25%',
      input: '45 20% 25%',
      ring: '45 100% 28%',
      themeColor: '#272822'
    }
  },
  dracula: {
    name: 'Dracula',
    followsSystem: false,
    isDark: true,
    colors: {
      background: '260 20% 15%',
      foreground: '0 0% 100%',
      card: '260 20% 18%',
      cardForeground: '0 0% 100%',
      popover: '260 20% 18%',
      popoverForeground: '0 0% 100%',
      primary: '320 80% 45%',
      primaryForeground: '0 0% 100%',
      secondary: '260 30% 25%',
      secondaryForeground: '0 0% 100%',
      muted: '260 30% 25%',
      mutedForeground: '0 0% 80%',
      accent: '260 30% 25%',
      accentForeground: '0 0% 100%',
      destructive: '0 72% 50%',
      destructiveForeground: '0 0% 100%',
      border: '260 30% 25%',
      input: '260 30% 25%',
      ring: '320 80% 45%',
      themeColor: '#282a36'
    }
  },
  nord: {
    name: 'Nord',
    followsSystem: false,
    isDark: true,
    colors: {
      background: '210 30% 18%',
      foreground: '0 0% 100%',
      card: '210 30% 20%',
      cardForeground: '0 0% 100%',
      popover: '210 30% 20%',
      popoverForeground: '0 0% 100%',
      primary: '190 50% 35%',
      primaryForeground: '0 0% 100%',
      secondary: '210 25% 28%',
      secondaryForeground: '0 0% 100%',
      muted: '210 25% 28%',
      mutedForeground: '0 0% 80%',
      accent: '210 25% 28%',
      accentForeground: '0 0% 100%',
      destructive: '0 72% 50%',
      destructiveForeground: '0 0% 100%',
      border: '210 25% 28%',
      input: '210 25% 28%',
      ring: '190 50% 35%',
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
      foreground: '0 0% 100%',
      card: '195 40% 17%',
      cardForeground: '0 0% 100%',
      popover: '195 40% 17%',
      popoverForeground: '0 0% 100%',
      primary: '195 75% 35%',
      primaryForeground: '0 0% 100%',
      secondary: '350 65% 40%',
      secondaryForeground: '0 0% 100%',
      muted: '195 30% 22%',
      mutedForeground: '0 0% 80%',
      accent: '0 0% 45%',
      accentForeground: '0 0% 100%',
      destructive: '0 72% 50%',
      destructiveForeground: '0 0% 100%',
      border: '195 30% 25%',
      input: '195 30% 25%',
      ring: '195 75% 35%',
      themeColor: '#1f3a47'
    }
  },
  'lesbian-pride': {
    name: 'Lesbian Pride',
    followsSystem: false,
    isDark: true,
    colors: {
      background: '15 35% 15%',
      foreground: '0 0% 100%',
      card: '15 35% 17%',
      cardForeground: '0 0% 100%',
      popover: '15 35% 17%',
      popoverForeground: '0 0% 100%',
      primary: '15 100% 35%',
      primaryForeground: '0 0% 100%',
      secondary: '30 90% 35%',
      secondaryForeground: '0 0% 100%',
      muted: '15 30% 22%',
      mutedForeground: '0 0% 80%',
      accent: '330 70% 40%',
      accentForeground: '0 0% 100%',
      destructive: '0 72% 50%',
      destructiveForeground: '0 0% 100%',
      border: '15 30% 25%',
      input: '15 30% 25%',
      ring: '15 100% 35%',
      themeColor: '#3d2328'
    }
  },
  'bi-pride': {
    name: 'Bi Pride',
    followsSystem: false,
    isDark: true,
    colors: {
      background: '280 40% 15%',
      foreground: '0 0% 100%',
      card: '280 40% 17%',
      cardForeground: '0 0% 100%',
      popover: '280 40% 17%',
      popoverForeground: '0 0% 100%',
      primary: '330 100% 40%',
      primaryForeground: '0 0% 100%',
      secondary: '280 60% 40%',
      secondaryForeground: '0 0% 100%',
      muted: '280 30% 22%',
      mutedForeground: '0 0% 80%',
      accent: '220 100% 40%',
      accentForeground: '0 0% 100%',
      destructive: '0 72% 50%',
      destructiveForeground: '0 0% 100%',
      border: '280 30% 25%',
      input: '280 30% 25%',
      ring: '330 100% 40%',
      themeColor: '#2f1f3d'
    }
  },
  'pan-pride': {
    name: 'Pan Pride',
    followsSystem: false,
    isDark: true,
    colors: {
      background: '330 35% 15%',
      foreground: '0 0% 100%',
      card: '330 35% 17%',
      cardForeground: '0 0% 100%',
      popover: '330 35% 17%',
      popoverForeground: '0 0% 100%',
      primary: '330 100% 40%',
      primaryForeground: '0 0% 100%',
      secondary: '45 100% 28%',
      secondaryForeground: '0 0% 100%',
      muted: '330 30% 22%',
      mutedForeground: '0 0% 80%',
      accent: '200 100% 35%',
      accentForeground: '0 0% 100%',
      destructive: '0 72% 50%',
      destructiveForeground: '0 0% 100%',
      border: '330 30% 25%',
      input: '330 30% 25%',
      ring: '330 100% 40%',
      themeColor: '#3d1f2f'
    }
  },
  'nonbinary-pride': {
    name: 'Non-Binary Pride',
    followsSystem: false,
    isDark: true,
    colors: {
      background: '55 30% 15%',
      foreground: '0 0% 100%',
      card: '55 30% 17%',
      cardForeground: '0 0% 100%',
      popover: '55 30% 17%',
      popoverForeground: '0 0% 100%',
      primary: '55 100% 25%',
      primaryForeground: '0 0% 100%',
      secondary: '0 0% 45%',
      secondaryForeground: '0 0% 100%',
      muted: '55 25% 22%',
      mutedForeground: '0 0% 80%',
      accent: '270 60% 45%',
      accentForeground: '0 0% 100%',
      destructive: '0 72% 50%',
      destructiveForeground: '0 0% 100%',
      border: '55 30% 25%',
      input: '55 30% 25%',
      ring: '55 100% 25%',
      themeColor: '#2f2f1f'
    }
  },
  'rainbow-pride': {
    name: 'Rainbow Pride',
    followsSystem: false,
    isDark: true,
    colors: {
      background: '220 40% 14%',
      foreground: '0 0% 100%',
      card: '220 40% 16%',
      cardForeground: '0 0% 100%',
      popover: '220 40% 16%',
      popoverForeground: '0 0% 100%',
      primary: '0 100% 40%',
      primaryForeground: '0 0% 100%',
      secondary: '45 100% 28%',
      secondaryForeground: '0 0% 100%',
      muted: '220 30% 22%',
      mutedForeground: '0 0% 80%',
      accent: '140 80% 28%',
      accentForeground: '0 0% 100%',
      destructive: '0 72% 50%',
      destructiveForeground: '0 0% 100%',
      border: '220 30% 25%',
      input: '220 30% 25%',
      ring: '0 100% 40%',
      themeColor: '#2f3a4f'
    }
  }
};

// Color pairs to test - ALL require 4.5:1
const COLOR_PAIRS = [
  { fg: 'foreground', bg: 'background', label: 'Body text', required: 4.5 },
  { fg: 'cardForeground', bg: 'card', label: 'Card text', required: 4.5 },
  { fg: 'popoverForeground', bg: 'popover', label: 'Popover text', required: 4.5 },
  { fg: 'primaryForeground', bg: 'primary', label: 'Primary button text', required: 4.5 },
  { fg: 'secondaryForeground', bg: 'secondary', label: 'Secondary button text', required: 4.5 },
  { fg: 'accentForeground', bg: 'accent', label: 'Accent text', required: 4.5 },
  { fg: 'mutedForeground', bg: 'muted', label: 'Muted text', required: 4.5 },
  { fg: 'destructiveForeground', bg: 'destructive', label: 'Destructive text', required: 4.5 }
];

/**
 * Audit a single theme
 */
function auditTheme(theme) {
  const { colors, name } = theme;
  const results = {
    name,
    isDark: colors.isDark,
    pairs: {},
    summary: { total: 0, passed: 0, failed: 0, critical: [] }
  };

  COLOR_PAIRS.forEach(({ fg, bg, label, required }) => {
    if (!colors[fg] || !colors[bg]) return;

    const ratio = getContrastRatioAny(colors[fg], colors[bg]);
    const passes = ratio >= required;
    
    results.pairs[label] = { ratio, passes, required };
    results.summary.total++;

    if (passes) {
      results.summary.passed++;
    } else {
      results.summary.failed++;
      results.summary.critical.push({
        pair: label, foreground: fg, background: bg, ratio, required
      });
    }
  });

  results.summary.passRate = Math.round((results.summary.passed / results.summary.total) * 100);
  return results;
}

/**
 * Run CI audit
 */
function runAudit() {
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║     WCAG 2.x AA Contrast Audit (REAL THEMES)          ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');

  let totalThemes = 0, compliantThemes = 0, nonCompliantThemes = 0;
  let totalPairs = 0, passedPairs = 0, failedPairs = 0;
  const criticalIssues = [];

  Object.entries(THEMES).forEach(([key, theme]) => {
    if (theme.followsSystem) return;

    const audit = auditTheme(theme);
    totalThemes++;
    totalPairs += audit.summary.total;
    passedPairs += audit.summary.passed;
    failedPairs += audit.summary.failed;

    if (audit.summary.failed === 0) {
      compliantThemes++;
    } else {
      nonCompliantThemes++;
      audit.summary.critical.forEach(issue => {
        criticalIssues.push({ theme: key, ...issue });
      });
    }

    const status = audit.summary.failed === 0 ? '[OK]' : '[FAIL]';
    const statusColor = audit.summary.failed === 0 ? '\x1b[32m' : '\x1b[31m';
    
    console.log(`${statusColor}${status}${reset} ${key} (${theme.name})`);
    console.log(`   Pass Rate: ${audit.summary.passRate}% (${audit.summary.passed}/${audit.summary.total})`);
    
    if (audit.summary.failed > 0) {
      audit.summary.critical.forEach(issue => {
        console.log(`   [FAIL] ${issue.pair}`);
        console.log(`      Ratio: ${issue.ratio.toFixed(2)}:1 < Required: ${issue.required}:1`);
      });
    }
    console.log();
  });

  const overallPassRate = Math.round((passedPairs / totalPairs) * 100);
  const hasFailures = failedPairs > 0;

  console.log('📊 Overall Summary');
  console.log('─'.repeat(60));
  console.log(`Total Themes Audited: ${totalThemes}`);
  console.log(`Compliant Themes:     ${compliantThemes} ✓`);
  console.log(`Non-Compliant Themes: ${nonCompliantThemes} ✗`);
  console.log(`Overall Pass Rate:    ${overallPassRate}%`);
  console.log(`Color Pairs Tested:   ${totalPairs}`);
  console.log(`Passed:               ${passedPairs}`);
  console.log(`Failed:               ${failedPairs}\n`);

  if (criticalIssues.length > 0) {
    console.log('⚠️  Critical Issues Summary');
    console.log('─'.repeat(60));
    criticalIssues.forEach((issue, i) => {
      console.log(`${i + 1}. ${issue.theme} - ${issue.pair}`);
      console.log(`   ${issue.ratio.toFixed(2)}:1 < ${issue.required}:1`);
    });
    console.log();
  }

  console.log('═'.repeat(60));
  
  if (hasFailures) {
    console.log('╔════════════════════════════════════════════════════════╗');
    console.log('║  ❌ WCAG AA AUDIT FAILED                               ║');
    console.log('║                                                        ║');
    console.log('║  Please fix the contrast issues listed above.        ║');
    console.log('║  Reference: docs/WCAG_CONTRAST_SPEC.md               ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');
    process.exit(1);
  } else {
    console.log('╔════════════════════════════════════════════════════════╗');
    console.log('║  ✓ WCAG AA AUDIT PASSED                                ║');
    console.log('║                                                        ║');
    console.log('║  All themes meet WCAG 2.x AA contrast requirements.  ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');
    process.exit(0);
  }
}

const reset = '\x1b[0m';
runAudit();

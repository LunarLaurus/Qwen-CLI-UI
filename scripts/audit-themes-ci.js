#!/usr/bin/env node

/**
 * WCAG Contrast CI Audit Script - REAL THEMES
 *
 * Validates ALL actual theme colors from ThemeContext.jsx against WCAG 2.x AA requirements.
 * Exits with code 1 if any theme fails contrast requirements.
 *
 * Usage:
 *   node scripts/audit-themes-ci.js
 *
 * Returns:
 *   0 - All themes pass WCAG AA
 *   1 - One or more themes fail
 */

import { getContrastRatioAny } from '../src/utils/contrast.js';

// Import actual themes from ThemeContext (embedded copy for CI compatibility)
const THEMES = {
  system: { name: 'System Default', followsSystem: true },
  
  // ===== LIGHT THEMES =====
  light: {
    name: 'Light',
    isDark: false,
    colors: {
      background: '0 0% 100%',
      foreground: '222.2 84% 4.9%',
      card: '0 0% 100%',
      cardForeground: '222.2 84% 4.9%',
      primary: '15 89% 40%',
      primaryForeground: '0 0% 100%',
      secondary: '210 40% 96.1%',
      secondaryForeground: '222.2 47.4% 11.2%',
      muted: '210 40% 96.1%',
      mutedForeground: '215.4 16.3% 40%',
      accent: '210 40% 96.1%',
      accentForeground: '222.2 47.4% 11.2%',
      destructive: '0 84% 60%',
      destructiveForeground: '0 0% 100%'
    }
  },
  alpine: {
    name: 'Alpine',
    isDark: false,
    colors: {
      background: '200 100% 98%',
      foreground: '200 100% 15%',
      primary: '200 100% 35%',
      primaryForeground: '0 0% 100%',
      secondary: '190 90% 40%',
      secondaryForeground: '0 0% 100%',
      muted: '200 30% 94%',
      mutedForeground: '200 40% 35%',
      accent: '180 80% 40%',
      accentForeground: '0 0% 100%',
      destructive: '0 84% 50%',
      destructiveForeground: '0 0% 100%'
    }
  },
  sage: {
    name: 'Sage',
    isDark: false,
    colors: {
      background: '140 50% 97%',
      foreground: '140 80% 12%',
      primary: '140 70% 35%',
      primaryForeground: '0 0% 100%',
      secondary: '150 60% 35%',
      secondaryForeground: '0 0% 100%',
      muted: '140 30% 92%',
      mutedForeground: '140 40% 30%',
      accent: '70 70% 35%',
      accentForeground: '0 0% 100%',
      destructive: '0 84% 50%',
      destructiveForeground: '0 0% 100%'
    }
  },
  lavender: {
    name: 'Lavender',
    isDark: false,
    colors: {
      background: '270 50% 97%',
      foreground: '270 80% 18%',
      primary: '270 70% 45%',
      primaryForeground: '0 0% 100%',
      secondary: '280 70% 50%',
      secondaryForeground: '0 0% 100%',
      muted: '270 30% 94%',
      mutedForeground: '270 40% 40%',
      accent: '300 70% 50%',
      accentForeground: '0 0% 100%',
      destructive: '0 84% 50%',
      destructiveForeground: '0 0% 100%'
    }
  },
  sand: {
    name: 'Sand',
    isDark: false,
    colors: {
      background: '35 50% 97%',
      foreground: '35 80% 15%',
      primary: '35 90% 40%',
      primaryForeground: '0 0% 100%',
      secondary: '37 85% 45%',
      secondaryForeground: '0 0% 100%',
      muted: '35 30% 92%',
      mutedForeground: '35 40% 35%',
      accent: '45 70% 40%',
      accentForeground: '0 0% 100%',
      destructive: '0 84% 50%',
      destructiveForeground: '0 0% 100%'
    }
  },
  'trans-pride-light': {
    name: 'Trans Pride (Light)',
    isDark: false,
    colors: {
      background: '195 50% 97%',
      foreground: '195 60% 15%',
      primary: '195 75% 45%',
      primaryForeground: '0 0% 100%',
      secondary: '350 65% 55%',
      secondaryForeground: '0 0% 100%',
      muted: '195 30% 94%',
      mutedForeground: '195 40% 35%',
      accent: '0 0% 80%',
      accentForeground: '0 0% 15%',
      destructive: '0 72% 50%',
      destructiveForeground: '0 0% 100%'
    }
  },
  'lesbian-pride-light': {
    name: 'Lesbian Pride (Light)',
    isDark: false,
    colors: {
      background: '15 40% 97%',
      foreground: '15 50% 15%',
      primary: '15 100% 40%',
      primaryForeground: '0 0% 100%',
      secondary: '30 90% 55%',
      secondaryForeground: '0 0% 100%',
      muted: '30 30% 94%',
      mutedForeground: '30 40% 35%',
      accent: '330 70% 45%',
      accentForeground: '0 0% 100%',
      destructive: '0 72% 50%',
      destructiveForeground: '0 0% 100%'
    }
  },
  'bi-pride-light': {
    name: 'Bi Pride (Light)',
    isDark: false,
    colors: {
      background: '330 40% 97%',
      foreground: '330 50% 15%',
      primary: '330 100% 45%',
      primaryForeground: '0 0% 100%',
      secondary: '280 60% 50%',
      secondaryForeground: '0 0% 100%',
      muted: '330 30% 94%',
      mutedForeground: '330 40% 35%',
      accent: '220 100% 55%',
      accentForeground: '0 0% 100%',
      destructive: '0 72% 50%',
      destructiveForeground: '0 0% 100%'
    }
  },
  'pan-pride-light': {
    name: 'Pan Pride (Light)',
    isDark: false,
    colors: {
      background: '330 35% 97%',
      foreground: '330 45% 15%',
      primary: '330 100% 45%',
      primaryForeground: '0 0% 100%',
      secondary: '45 100% 45%',
      secondaryForeground: '0 0% 100%',
      muted: '330 30% 94%',
      mutedForeground: '330 40% 35%',
      accent: '200 100% 45%',
      accentForeground: '0 0% 100%',
      destructive: '0 72% 50%',
      destructiveForeground: '0 0% 100%'
    }
  },
  'nonbinary-pride-light': {
    name: 'Non-Binary Pride (Light)',
    isDark: false,
    colors: {
      background: '55 35% 96%',
      foreground: '55 40% 18%',
      primary: '55 100% 45%',
      primaryForeground: '0 0% 100%',
      secondary: '0 0% 85%',
      secondaryForeground: '0 0% 15%',
      muted: '55 30% 92%',
      mutedForeground: '55 40% 35%',
      accent: '270 60% 50%',
      accentForeground: '0 0% 100%',
      destructive: '0 72% 50%',
      destructiveForeground: '0 0% 100%'
    }
  },
  'rainbow-pride-light': {
    name: 'Rainbow Pride (Light)',
    isDark: false,
    colors: {
      background: '0 30% 97%',
      foreground: '0 35% 15%',
      primary: '0 100% 45%',
      primaryForeground: '0 0% 100%',
      secondary: '30 100% 45%',
      secondaryForeground: '0 0% 100%',
      muted: '0 20% 94%',
      mutedForeground: '0 30% 35%',
      accent: '50 100% 40%',
      accentForeground: '0 0% 100%',
      destructive: '0 72% 50%',
      destructiveForeground: '0 0% 100%'
    }
  },
  
  // ===== DARK THEMES =====
  dark: {
    name: 'Dark',
    isDark: true,
    colors: {
      background: '222.2 84% 8%',
      foreground: '210 40% 95%',
      primary: '15 89% 40%',
      primaryForeground: '0 0% 100%',
      secondary: '217.2 32.6% 17.5%',
      secondaryForeground: '210 40% 98%',
      muted: '217.2 32.6% 17.5%',
      mutedForeground: '215 20.2% 70%',
      accent: '217.2 32.6% 17.5%',
      accentForeground: '210 40% 98%',
      destructive: '0 72% 50%',
      destructiveForeground: '0 0% 100%'
    }
  },
  midnight: {
    name: 'Midnight',
    isDark: true,
    colors: {
      background: '222.2 84% 8%',
      foreground: '210 40% 95%',
      primary: '210 100% 60%',
      primaryForeground: '0 0% 100%',
      secondary: '217.2 32.6% 17.5%',
      secondaryForeground: '210 40% 98%',
      muted: '217.2 32.6% 17.5%',
      mutedForeground: '215 20.2% 70%',
      accent: '217.2 32.6% 17.5%',
      accentForeground: '210 40% 98%',
      destructive: '0 72% 50%',
      destructiveForeground: '0 0% 100%'
    }
  },
  ocean: {
    name: 'Ocean',
    isDark: true,
    colors: {
      background: '200 70% 10%',
      foreground: '200 40% 92%',
      primary: '180 80% 45%',
      primaryForeground: '0 0% 100%',
      secondary: '200 60% 18%',
      secondaryForeground: '200 40% 92%',
      muted: '200 50% 18%',
      mutedForeground: '200 30% 70%',
      accent: '200 60% 18%',
      accentForeground: '200 40% 92%',
      destructive: '0 72% 50%',
      destructiveForeground: '0 0% 100%'
    }
  },
  forest: {
    name: 'Forest',
    isDark: true,
    colors: {
      background: '140 45% 10%',
      foreground: '140 30% 92%',
      primary: '140 70% 45%',
      primaryForeground: '0 0% 100%',
      secondary: '140 40% 18%',
      secondaryForeground: '140 30% 92%',
      muted: '140 35% 18%',
      mutedForeground: '140 30% 70%',
      accent: '140 40% 18%',
      accentForeground: '140 30% 92%',
      destructive: '0 72% 50%',
      destructiveForeground: '0 0% 100%'
    }
  },
  sunset: {
    name: 'Sunset',
    isDark: true,
    colors: {
      background: '30 45% 12%',
      foreground: '30 40% 92%',
      primary: '30 90% 55%',
      primaryForeground: '0 0% 100%',
      secondary: '30 40% 20%',
      secondaryForeground: '30 40% 92%',
      muted: '30 35% 20%',
      mutedForeground: '30 30% 70%',
      accent: '30 40% 20%',
      accentForeground: '30 40% 92%',
      destructive: '0 72% 50%',
      destructiveForeground: '0 0% 100%'
    }
  },
  monokai: {
    name: 'Monokai',
    isDark: true,
    colors: {
      background: '45 10% 15%',
      foreground: '45 10% 90%',
      primary: '45 100% 60%',
      primaryForeground: '0 0% 100%',
      secondary: '45 20% 25%',
      secondaryForeground: '45 10% 90%',
      muted: '45 20% 25%',
      mutedForeground: '45 10% 70%',
      accent: '45 20% 25%',
      accentForeground: '45 10% 90%',
      destructive: '0 72% 50%',
      destructiveForeground: '0 0% 100%'
    }
  },
  dracula: {
    name: 'Dracula',
    isDark: true,
    colors: {
      background: '260 20% 15%',
      foreground: '260 20% 90%',
      primary: '320 80% 60%',
      primaryForeground: '0 0% 100%',
      secondary: '260 30% 25%',
      secondaryForeground: '260 20% 90%',
      muted: '260 30% 25%',
      mutedForeground: '260 20% 70%',
      accent: '260 30% 25%',
      accentForeground: '260 20% 90%',
      destructive: '0 72% 50%',
      destructiveForeground: '0 0% 100%'
    }
  },
  nord: {
    name: 'Nord',
    isDark: true,
    colors: {
      background: '210 30% 18%',
      foreground: '210 30% 90%',
      primary: '190 50% 60%',
      primaryForeground: '0 0% 100%',
      secondary: '210 25% 28%',
      secondaryForeground: '210 30% 90%',
      muted: '210 25% 28%',
      mutedForeground: '210 20% 70%',
      accent: '210 25% 28%',
      accentForeground: '210 30% 90%',
      destructive: '0 72% 50%',
      destructiveForeground: '0 0% 100%'
    }
  },
  'trans-pride': {
    name: 'Trans Pride',
    isDark: true,
    colors: {
      background: '195 40% 15%',
      foreground: '195 50% 90%',
      primary: '195 75% 60%',
      primaryForeground: '0 0% 100%',
      secondary: '350 65% 65%',
      secondaryForeground: '350 40% 15%',
      muted: '195 30% 22%',
      mutedForeground: '195 40% 70%',
      accent: '0 0% 80%',
      accentForeground: '0 0% 15%',
      destructive: '0 72% 50%',
      destructiveForeground: '0 0% 100%'
    }
  },
  'lesbian-pride': {
    name: 'Lesbian Pride',
    isDark: true,
    colors: {
      background: '15 35% 15%',
      foreground: '15 40% 90%',
      primary: '15 100% 50%',
      primaryForeground: '0 0% 100%',
      secondary: '30 90% 60%',
      secondaryForeground: '30 40% 15%',
      muted: '15 30% 22%',
      mutedForeground: '15 40% 70%',
      accent: '330 70% 55%',
      accentForeground: '330 40% 15%',
      destructive: '0 72% 50%',
      destructiveForeground: '0 0% 100%'
    }
  },
  'bi-pride': {
    name: 'Bi Pride',
    isDark: true,
    colors: {
      background: '280 40% 15%',
      foreground: '280 30% 90%',
      primary: '330 100% 55%',
      primaryForeground: '0 0% 100%',
      secondary: '280 60% 55%',
      secondaryForeground: '0 0% 100%',
      muted: '280 30% 22%',
      mutedForeground: '280 20% 75%',
      accent: '220 100% 60%',
      accentForeground: '0 0% 100%',
      destructive: '0 72% 50%',
      destructiveForeground: '0 0% 100%'
    }
  },
  'pan-pride': {
    name: 'Pan Pride',
    isDark: true,
    colors: {
      background: '330 35% 15%',
      foreground: '330 30% 90%',
      primary: '330 100% 55%',
      primaryForeground: '0 0% 100%',
      secondary: '45 100% 50%',
      secondaryForeground: '0 0% 100%',
      muted: '330 30% 22%',
      mutedForeground: '330 20% 75%',
      accent: '200 100% 55%',
      accentForeground: '0 0% 100%',
      destructive: '0 72% 50%',
      destructiveForeground: '0 0% 100%'
    }
  },
  'nonbinary-pride': {
    name: 'Non-Binary Pride',
    isDark: true,
    colors: {
      background: '55 30% 15%',
      foreground: '55 35% 90%',
      primary: '55 100% 50%',
      primaryForeground: '55 40% 15%',
      secondary: '0 0% 85%',
      secondaryForeground: '0 0% 15%',
      muted: '55 25% 22%',
      mutedForeground: '55 35% 70%',
      accent: '270 60% 60%',
      accentForeground: '270 40% 15%',
      destructive: '0 72% 50%',
      destructiveForeground: '0 0% 100%'
    }
  },
  'rainbow-pride': {
    name: 'Rainbow Pride',
    isDark: true,
    colors: {
      background: '220 40% 14%',
      foreground: '220 30% 90%',
      primary: '0 100% 55%',
      primaryForeground: '0 40% 95%',
      secondary: '45 100% 50%',
      secondaryForeground: '45 40% 15%',
      muted: '220 30% 22%',
      mutedForeground: '220 20% 70%',
      accent: '140 80% 40%',
      accentForeground: '140 40% 95%',
      destructive: '0 72% 50%',
      destructiveForeground: '0 0% 100%'
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
 * Audit a single theme with custom requirements per pair
 */
function auditThemeWithRequirements(theme) {
  const { colors, name } = theme;
  const results = {
    name,
    isDark: colors.isDark,
    pairs: {},
    summary: {
      total: 0,
      passed: 0,
      failed: 0,
      critical: []
    }
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
        pair: label,
        foreground: fg,
        background: bg,
        ratio,
        required
      });
    }
  });

  results.summary.passRate = Math.round(
    (results.summary.passed / results.summary.total) * 100
  );

  return results;
}

/**
 * Run CI audit
 */
function runAudit() {
  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║     WCAG 2.x AA Contrast Audit (REAL THEMES)          ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');

  let totalThemes = 0;
  let compliantThemes = 0;
  let nonCompliantThemes = 0;
  let totalPairs = 0;
  let passedPairs = 0;
  let failedPairs = 0;
  const criticalIssues = [];

  // Audit each theme from ThemeContext
  Object.entries(THEMES).forEach(([key, theme]) => {
    if (theme.followsSystem) return;

    const audit = auditThemeWithRequirements(theme);
    totalThemes++;
    totalPairs += audit.summary.total;
    passedPairs += audit.summary.passed;
    failedPairs += audit.summary.failed;

    if (audit.summary.failed === 0) {
      compliantThemes++;
    } else {
      nonCompliantThemes++;
      audit.summary.critical.forEach(issue => {
        criticalIssues.push({
          theme: key,
          ...issue
        });
      });
    }

    // Print per-theme results
    const status = audit.summary.failed === 0 ? '✓' : '✗';
    const statusColor = audit.summary.failed === 0 ? '\x1b[32m' : '\x1b[31m';
    const reset = '\x1b[0m';
    
    console.log(`${statusColor}${status}${reset} ${key} (${theme.name})`);
    console.log(`   Pass Rate: ${audit.summary.passRate}% (${audit.summary.passed}/${audit.summary.total})`);
    
    if (audit.summary.failed > 0) {
      audit.summary.critical.forEach(issue => {
        console.log(`   \x1b[31m✗\x1b[0m ${issue.pair}`);
        console.log(`      Ratio: ${issue.ratio.toFixed(2)}:1 < Required: ${issue.required}:1`);
        console.log(`      Fix: Adjust ${issue.foreground} or ${issue.background}`);
      });
    }
    console.log();
  });

  const overallPassRate = Math.round((passedPairs / totalPairs) * 100);
  const hasFailures = failedPairs > 0;

  // Print summary
  console.log('📊 Overall Summary');
  console.log('─'.repeat(60));
  console.log(`Total Themes Audited: ${totalThemes}`);
  console.log(`Compliant Themes:     ${compliantThemes} ✓`);
  console.log(`Non-Compliant Themes: ${nonCompliantThemes} ✗`);
  console.log(`Overall Pass Rate:    ${overallPassRate}%`);
  console.log(`Color Pairs Tested:   ${totalPairs}`);
  console.log(`Passed:               ${passedPairs}`);
  console.log(`Failed:               ${failedPairs}\n`);

  // Print critical issues summary
  if (criticalIssues.length > 0) {
    console.log('⚠️  Critical Issues Summary');
    console.log('─'.repeat(60));
    
    criticalIssues.forEach((issue, i) => {
      console.log(`${i + 1}. ${issue.theme} - ${issue.pair}`);
      console.log(`   ${issue.ratio.toFixed(2)}:1 < ${issue.required}:1`);
    });
    console.log();
  }

  // Final verdict
  console.log('═'.repeat(60));
  
  if (hasFailures) {
    console.log('\x1b[31m╔════════════════════════════════════════════════════════╗\x1b[0m');
    console.log('\x1b[31m║  ❌ WCAG AA AUDIT FAILED                               ║\x1b[0m');
    console.log('\x1b[31m║                                                        ║\x1b[0m');
    console.log('\x1b[31m║  Please fix the contrast issues listed above.        ║\x1b[0m');
    console.log('\x1b[31m║  Reference: docs/WCAG_CONTRAST_SPEC.md               ║\x1b[0m');
    console.log('\x1b[31m╚════════════════════════════════════════════════════════╝\x1b[0m\n');
    process.exit(1);
  } else {
    console.log('\x1b[32m╔════════════════════════════════════════════════════════╗\x1b[0m');
    console.log('\x1b[32m║  ✓ WCAG AA AUDIT PASSED                                ║\x1b[0m');
    console.log('\x1b[32m║                                                        ║\x1b[0m');
    console.log('\x1b[32m║  All themes meet WCAG 2.x AA contrast requirements.  ║\x1b[0m');
    console.log('\x1b[32m╚════════════════════════════════════════════════════════╝\x1b[0m\n');
    process.exit(0);
  }
}

// Run audit
runAudit();

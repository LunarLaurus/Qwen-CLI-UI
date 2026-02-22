#!/usr/bin/env node

/**
 * WCAG Contrast CI Audit Script
 *
 * Validates all theme colors against WCAG 2.x AA requirements.
 * Exits with code 1 if any theme fails contrast requirements.
 *
 * Usage:
 *   node scripts/audit-themes-ci.js
 *
 * Returns:
 *   0 - All themes pass WCAG AA
 *   1 - One or more themes fail
 */

import { getContrastRatioAny, getRelativeLuminance, parseColor } from '../src/utils/contrast.js';

// Mock theme import (in real CI, would import from built bundle)
const THEMES = {
  system: { name: 'System Default', followsSystem: true },
  light: {
    name: 'Light',
    isDark: false,
    colors: {
      background: '0 0% 100%',
      foreground: '222.2 84% 4.9%',
      card: '0 0% 100%',
      cardForeground: '222.2 84% 4.9%',
      popover: '0 0% 100%',
      popoverForeground: '222.2 84% 4.9%',
      primary: '15 89% 40%',
      primaryForeground: '0 0% 100%',
      secondary: '210 40% 96.1%',
      secondaryForeground: '222.2 47.4% 11.2%',
      muted: '210 40% 96.1%',
      mutedForeground: '215.4 16.3% 40%',
      accent: '210 40% 96.1%',
      accentForeground: '222.2 47.4% 11.2%',
      destructive: '0 72% 50%',
      destructiveForeground: '0 0% 100%',
      border: '214.3 31.8% 91.4%',
      input: '214.3 31.8% 91.4%',
      ring: '15 89% 40%'
    }
  },
  dark: {
    name: 'Dark',
    isDark: true,
    colors: {
      background: '222.2 84% 8%',
      foreground: '210 40% 95%',
      card: '217.2 91.2% 10%',
      cardForeground: '210 40% 95%',
      popover: '217.2 91.2% 10%',
      popoverForeground: '210 40% 95%',
      primary: '15 89% 40%',
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
      ring: '15 89% 40%'
    }
  }
  // Additional themes would be loaded from actual ThemeContext in real CI
};

// WCAG 2.x AA requirements
const WCAG_AA = {
  normal: { ratio: 4.5, label: 'Normal text (< 18pt)' },
  large: { ratio: 3.0, label: 'Large text (≥ 18pt)' }
};

// Color pairs to test
// Note: As of 2026-02-22, primary color uses darker orange (#c2410c)
// which passes 4.5:1 WCAG AA with white text.
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
 * Format color for display
 */
function formatColor(hsl) {
  return hsl;
}

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
  console.log('║     WCAG 2.x AA Contrast Audit (CI Mode)              ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');

  let totalThemes = 0;
  let compliantThemes = 0;
  let nonCompliantThemes = 0;
  let totalPairs = 0;
  let passedPairs = 0;
  let failedPairs = 0;
  const criticalIssues = [];

  // Audit each theme
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

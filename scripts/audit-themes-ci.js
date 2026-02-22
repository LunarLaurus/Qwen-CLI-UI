#!/usr/bin/env node

/**
 * WCAG Contrast CI Audit Script
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

import { getContrastRatioAny } from './contrast.js';

// Import themes - try test folder first, then source
let THEMES;
try {
  const testModule = await import('./test/ThemeContext.jsx');
  THEMES = testModule.THEMES;
  console.log('Using test folder themes (scripts/test/ThemeContext.jsx)\n');
} catch (e) {
  const sourceModule = await import('../src/contexts/ThemeContext.jsx');
  THEMES = sourceModule.THEMES;
  console.log('Using source themes (src/contexts/ThemeContext.jsx)\n');
}

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

    const status = audit.summary.failed === 0 ? '✓' : '✗';
    const statusColor = audit.summary.failed === 0 ? '\x1b[32m' : '\x1b[31m';
    
    console.log(`${statusColor}${status}${reset} ${key} (${theme.name})`);
    console.log(`   Pass Rate: ${audit.summary.passRate}% (${audit.summary.passed}/${audit.summary.total})`);
    
    if (audit.summary.failed > 0) {
      audit.summary.critical.forEach(issue => {
        console.log(`   ✗ ${issue.pair}`);
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

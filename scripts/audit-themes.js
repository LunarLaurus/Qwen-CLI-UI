/**
 * Theme Contrast Audit Script
 * 
 * Run this to audit all themes for WCAG contrast compliance
 * 
 * Usage: node scripts/audit-themes.js
 */

import { auditAllThemes } from '../src/utils/contrast.js';

// Import themes (simulated - in real use, import from ThemeContext)
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
      primary: '25 95% 53%',
      primaryForeground: '210 40% 98%',
      secondary: '210 40% 96.1%',
      secondaryForeground: '222.2 47.4% 11.2%',
      muted: '210 40% 96.1%',
      mutedForeground: '215.4 16.3% 46.9%',
      accent: '210 40% 96.1%',
      accentForeground: '222.2 47.4% 11.2%',
      destructive: '0 84.2% 60.2%',
      destructiveForeground: '210 40% 98%'
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
      primary: '25 95% 53%',
      primaryForeground: '222.2 47.4% 11.2%',
      secondary: '217.2 32.6% 17.5%',
      secondaryForeground: '210 40% 98%',
      muted: '217.2 32.6% 17.5%',
      mutedForeground: '215 20.2% 70%',
      accent: '217.2 32.6% 17.5%',
      accentForeground: '210 40% 98%',
      destructive: '0 62.8% 40%',
      destructiveForeground: '210 40% 98%'
    }
  }
};

console.log('\n🔍 WCAG Theme Contrast Audit\n');
console.log('=' .repeat(60));

const results = auditAllThemes(THEMES);

// Print summary
console.log(`\n📊 Overall Summary`);
console.log('-'.repeat(60));
console.log(`Total Themes Audited: ${results.summary.totalThemes}`);
console.log(`Compliant Themes: ${results.summary.compliantThemes} ✓`);
console.log(`Non-Compliant Themes: ${results.summary.nonCompliantThemes} ✗`);
console.log(`Overall Pass Rate: ${results.summary.overallPassRate}%`);
console.log(`Color Pairs Tested: ${results.summary.totalPairs}`);
console.log(`Passed: ${results.summary.passedPairs} | Failed: ${results.summary.failedPairs}`);

if (results.summary.criticalIssues.length > 0) {
  console.log(`\n⚠️  Critical Issues (${results.summary.criticalIssues.length})`);
  console.log('-'.repeat(60));
  
  results.summary.criticalIssues.forEach((issue, i) => {
    console.log(`\n${i + 1}. ${issue.theme} - ${issue.pair}`);
    console.log(`   Ratio: ${issue.ratio.toFixed(2)}:1 (required: ${issue.required}:1)`);
    console.log(`   Fix: Adjust ${issue.foreground} or ${issue.background}`);
  });
}

// Print per-theme results
console.log(`\n📋 Per-Theme Results`);
console.log('-'.repeat(60));

Object.entries(results.themes).forEach(([key, theme]) => {
  const status = theme.summary.failed === 0 ? '✓' : '✗';
  console.log(`\n${status} ${key} (${theme.name})`);
  console.log(`   Pass Rate: ${theme.summary.passRate}% (${theme.summary.passed}/${theme.summary.total})`);
  
  if (theme.summary.failed > 0) {
    theme.summary.critical.forEach(issue => {
      console.log(`   ⚠ ${issue.pair}: ${issue.ratio.toFixed(2)}:1 < ${issue.required}:1`);
    });
  }
});

console.log('\n' + '='.repeat(60));
console.log('Audit complete.\n');

// Exit with error code if there are failures
if (results.summary.failedPairs > 0) {
  process.exit(1);
}

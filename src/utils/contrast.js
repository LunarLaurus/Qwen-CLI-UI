/**
 * WCAG Contrast Utility
 *
 * Implements Web Content Accessibility Guidelines (WCAG) 2.x contrast calculations
 * for ensuring text readability across all theme colors.
 *
 * Conformance Target: WCAG 2.x AA
 * - Normal text (< 18pt regular, < 14pt bold): 4.5:1 minimum
 * - Large text (≥ 18pt regular, ≥ 14pt bold): 3.0:1 minimum
 * - UI component boundaries / focus indicators: 3.0:1
 *
 * Reference: https://www.w3.org/WAI/GL/wiki/Relative_luminance
 * Specification: docs/WCAG_CONTRAST_SPEC.md
 */

/**
 * Parse hex color to RGB object
 * @param {string} hex - Hex color (#RGB, #RRGGBB)
 * @returns {{r: number, g: number, b: number}} RGB values 0-255
 */
export function hexToRgb(hex) {
  const shorthand = hex.length === 4;
  const r = parseInt(hex.slice(1, 2 + (shorthand ? 1 : 0)), 16);
  const g = parseInt(hex.slice(2 + (shorthand ? 0 : 1), 4 + (shorthand ? 0 : 1)), 16);
  const b = parseInt(hex.slice(3 + (shorthand ? 0 : 2), 6 + (shorthand ? 0 : 2)), 16);
  
  return {
    r: shorthand ? r * 17 : r,
    g: shorthand ? g * 17 : g,
    b: shorthand ? b * 17 : b
  };
}

/**
 * Convert HSL string (e.g., "200 80% 45%") to RGB object
 * @param {string} hsl - HSL color string
 * @returns {{r: number, g: number, b: number}} RGB values 0-255
 */
export function hslToRgb(hsl) {
  const [h, s, l] = hsl.split(/\s+/).map((val, i) => {
    const num = parseFloat(val);
    return i === 0 ? num : num / 100; // Hue in degrees, S/L as 0-1
  });

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let r, g, b;

  if (h < 60) {
    [r, g, b] = [c, x, 0];
  } else if (h < 120) {
    [r, g, b] = [x, c, 0];
  } else if (h < 180) {
    [r, g, b] = [0, c, x];
  } else if (h < 240) {
    [r, g, b] = [0, x, c];
  } else if (h < 300) {
    [r, g, b] = [x, 0, c];
  } else {
    [r, g, b] = [c, 0, x];
  }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255)
  };
}

/**
 * Parse any color format to RGB object
 * @param {string} color - Color in any format (#RGB, #RRGGBB, "h h s% l%")
 * @returns {{r: number, g: number, b: number}} RGB values 0-255
 */
export function parseColor(color) {
  if (!color) return { r: 0, g: 0, b: 0 };
  
  const trimmed = color.trim();
  
  // Hex format
  if (trimmed.startsWith('#')) {
    return hexToRgb(trimmed);
  }
  
  // HSL format (space-separated: "200 80% 45%")
  if (trimmed.includes('%') || /^\d+\s+\d+\s+\d+/.test(trimmed)) {
    return hslToRgb(trimmed);
  }
  
  // Default to black
  return { r: 0, g: 0, b: 0 };
}

/**
 * Calculate relative luminance per WCAG 2.x Section 1.4.1
 * https://www.w3.org/WAI/GL/wiki/Relative_luminance
 *
 * Uses full precision floating-point arithmetic as required by spec.
 * No rounding until final output.
 *
 * @param {{r: number, g: number, b: number}} rgb - RGB color object (0-255)
 * @returns {number} Relative luminance (0-1)
 */
export function getRelativeLuminance(rgb) {
  const { r, g, b } = rgb;

  // Step 1: Normalize to [0, 1]
  // Step 2: Linearize each channel per WCAG formula
  const linearize = (channel) => {
    const sRGB = channel / 255;
    // WCAG 2.x threshold: 0.04045 (NOT 0.03928)
    return sRGB <= 0.04045
      ? sRGB / 12.92
      : Math.pow((sRGB + 0.055) / 1.055, 2.4);
  };

  const R = linearize(r);
  const G = linearize(g);
  const B = linearize(b);

  // Step 3: Compute relative luminance
  // Coefficients from WCAG 2.x
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

/**
 * Calculate WCAG contrast ratio per WCAG 2.x Section 1.4.1
 *
 * Formula: (L_light + 0.05) / (L_dark + 0.05)
 * Uses full precision - no rounding before comparison.
 *
 * @param {number} lum1 - Luminance of first color (0-1)
 * @param {number} lum2 - Luminance of second color (0-1)
 * @returns {number} Contrast ratio (1-21)
 */
export function getContrastRatio(lum1, lum2) {
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  // Full precision division - no rounding
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Calculate contrast ratio between two colors in any format
 *
 * @param {string} color1 - First color (hex, HSL)
 * @param {string} color2 - Second color (hex, HSL)
 * @returns {number} Contrast ratio (1-21)
 */
export function getContrastRatioAny(color1, color2) {
  const rgb1 = parseColor(color1);
  const rgb2 = parseColor(color2);
  const lum1 = getRelativeLuminance(rgb1);
  const lum2 = getRelativeLuminance(rgb2);
  return getContrastRatio(lum1, lum2);
}

/**
 * Calculate contrast ratio between two HSL colors
 *
 * @param {string} hsl1 - First HSL color
 * @param {string} hsl2 - Second HSL color
 * @returns {number} Contrast ratio (1-21)
 */
export function getContrastRatioHSL(hsl1, hsl2) {
  return getContrastRatioAny(hsl1, hsl2);
}

/**
 * Calculate contrast ratio between two hex colors
 *
 * @param {string} hex1 - First hex color
 * @param {string} hex2 - Second hex color
 * @returns {number} Contrast ratio (1-21)
 */
export function getContrastRatioHex(hex1, hex2) {
  return getContrastRatioAny(hex1, hex2);
}

/**
 * Determine optimal text color (black or white) for a given background
 * Uses WCAG contrast ratio to make deterministic choice
 * 
 * @param {string} backgroundHSL - Background color in HSL
 * @param {string} lightText - Light text color (default: white)
 * @param {string} darkText - Dark text color (default: black)
 * @returns {{textColor: string, contrastRatio: number, passes: boolean}}
 */
export function getOptimalTextColor(
  backgroundHSL,
  lightText = '0 0% 100%',
  darkText = '0 0% 0%'
) {
  const bgLum = getRelativeLuminance(hslToRgb(backgroundHSL));
  const lightLum = getRelativeLuminance(hslToRgb(lightText));
  const darkLum = getRelativeLuminance(hslToRgb(darkText));

  const contrastWithLight = getContrastRatio(bgLum, lightLum);
  const contrastWithDark = getContrastRatio(bgLum, darkLum);

  const useLight = contrastWithLight > contrastWithDark;
  const bestContrast = Math.max(contrastWithLight, contrastWithDark);

  return {
    textColor: useLight ? lightText : darkText,
    contrastRatio: bestContrast,
    passes: bestContrast >= 4.5, // WCAG AA normal text
    passesAAA: bestContrast >= 7, // WCAG AAA normal text
    isLightText: useLight
  };
}

/**
 * Validate that a foreground/background pair meets WCAG requirements
 * 
 * @param {string} foregroundHSL - Foreground (text) color
 * @param {string} backgroundHSL - Background color
 * @param {'AA' | 'AAA'} level - WCAG level
 * @param {'normal' | 'large'} textSize - Text size category
 * @returns {{passes: boolean, ratio: number, required: number, message: string}}
 */
export function validateContrast(
  foregroundHSL,
  backgroundHSL,
  level = 'AA',
  textSize = 'normal'
) {
  const ratio = getContrastRatioHSL(foregroundHSL, backgroundHSL);
  
  const requirements = {
    AA: { normal: 4.5, large: 3 },
    AAA: { normal: 7, large: 4.5 }
  };

  const required = requirements[level][textSize];
  const passes = ratio >= required;

  const messages = {
    pass: `✓ Passes WCAG ${level} ${textSize} text (${ratio.toFixed(2)}:1 ≥ ${required}:1)`,
    fail: `✗ Fails WCAG ${level} ${textSize} text (${ratio.toFixed(2)}:1 < ${required}:1)`
  };

  return {
    passes,
    ratio,
    required,
    message: passes ? messages.pass : messages.fail
  };
}

/**
 * Audit a theme's color palette for WCAG compliance
 * 
 * @param {Object} theme - Theme object from ThemeContext
 * @returns {Object} Audit results with pass/fail for each color pair
 */
export function auditTheme(theme) {
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

  // Define color pairs to test
  const pairs = [
    { fg: 'foreground', bg: 'background', label: 'Body text' },
    { fg: 'cardForeground', bg: 'card', label: 'Card text' },
    { fg: 'popoverForeground', bg: 'popover', label: 'Popover text' },
    { fg: 'primaryForeground', bg: 'primary', label: 'Primary button text' },
    { fg: 'secondaryForeground', bg: 'secondary', label: 'Secondary button text' },
    { fg: 'accentForeground', bg: 'accent', label: 'Accent text' },
    { fg: 'mutedForeground', bg: 'muted', label: 'Muted text' },
    { fg: 'destructiveForeground', bg: 'destructive', label: 'Destructive text' }
  ];

  pairs.forEach(({ fg, bg, label }) => {
    if (!colors[fg] || !colors[bg]) return;

    const validation = validateContrast(colors[fg], colors[bg], 'AA', 'normal');
    results.pairs[label] = validation;
    results.summary.total++;

    if (validation.passes) {
      results.summary.passed++;
    } else {
      results.summary.failed++;
      results.summary.critical.push({
        pair: label,
        foreground: fg,
        background: bg,
        ratio: validation.ratio,
        required: validation.required
      });
    }
  });

  results.summary.passRate = Math.round(
    (results.summary.passed / results.summary.total) * 100
  );

  return results;
}

/**
 * Audit all themes and return summary
 * 
 * @param {Object} themes - All themes from ThemeContext
 * @returns {Object} Complete audit results
 */
export function auditAllThemes(themes) {
  const results = {
    themes: {},
    summary: {
      totalThemes: 0,
      compliantThemes: 0,
      nonCompliantThemes: 0,
      totalPairs: 0,
      passedPairs: 0,
      failedPairs: 0,
      criticalIssues: []
    }
  };

  Object.entries(themes).forEach(([key, theme]) => {
    if (theme.followsSystem) return; // Skip system theme

    const audit = auditTheme(theme);
    results.themes[key] = audit;
    results.summary.totalThemes++;

    if (audit.summary.failed === 0) {
      results.summary.compliantThemes++;
    } else {
      results.summary.nonCompliantThemes++;
      audit.summary.critical.forEach(issue => {
        results.summary.criticalIssues.push({
          theme: key,
          ...issue
        });
      });
    }

    results.summary.totalPairs += audit.summary.total;
    results.summary.passedPairs += audit.summary.passed;
    results.summary.failedPairs += audit.summary.failed;
  });

  results.summary.overallPassRate = Math.round(
    (results.summary.passedPairs / results.summary.totalPairs) * 100
  );

  return results;
}

// Threshold for black vs white text (derived from contrast equation)
export const LUMINANCE_THRESHOLD = 0.179;

/**
 * Quick heuristic: should text be light or dark for this background?
 * 
 * @param {string} backgroundHSL - Background color
 * @returns {boolean} true if light text should be used
 */
export function shouldUseLightText(backgroundHSL) {
  const lum = getRelativeLuminance(hslToRgb(backgroundHSL));
  return lum <= LUMINANCE_THRESHOLD;
}

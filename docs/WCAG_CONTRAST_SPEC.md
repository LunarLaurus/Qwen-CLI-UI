# Text Contrast Enforcement Specification

**Version:** 1.0  
**Scope:** All visible text in UI (including buttons, badges, chips, alerts, links, disabled text unless explicitly decorative)  
**Conformance Target:** WCAG 2.x AA

---

## 1. Normative Standard

### Minimum Contrast Ratios

| Text Type | Size | Minimum Ratio |
|-----------|------|---------------|
| Normal text | < 18pt regular AND < 14pt bold | **4.5:1** |
| Large text | ≥ 18pt regular OR ≥ 14pt bold | **3.0:1** |
| UI component boundaries / focus indicators | Non-text contrast | **3.0:1** |

**Requirement:** The agent MUST compute actual contrast ratios. Intuition, hue class, or brightness heuristics are prohibited as decision mechanisms.

---

## 2. Definitions

All colors MUST be evaluated in sRGB.

### 2.1 Relative Luminance Calculation

Given 8-bit sRGB channels R8, G8, B8 in [0,255]:

**Step 1: Normalize**
```
R = R8 / 255
G = G8 / 255
B = B8 / 255
```

**Step 2: Linearize each channel**

```
If C ≤ 0.04045:
    C_linear = C / 12.92
Else:
    C_linear = ((C + 0.055) / 1.055) ^ 2.4
```

Apply to R, G, B.

**Step 3: Compute relative luminance**

```
L = 0.2126 * R_linear + 0.7152 * G_linear + 0.0722 * B_linear
```

L is in [0,1].

---

### 2.2 Contrast Ratio

Given luminances L1 and L2:

```
L_light = max(L1, L2)
L_dark = min(L1, L2)

ContrastRatio = (L_light + 0.05) / (L_dark + 0.05)
```

**No rounding before comparison.** Use full precision floating-point.

---

## 3. Text Color Selection Policy (Black/White Only)

When restricted to:
- **Black** = #000000 (L = 0.0)
- **White** = #FFFFFF (L = 1.0)

Given background luminance L_bg:

```
Contrast_black = (L_bg + 0.05) / 0.05
Contrast_white = (1.05) / (L_bg + 0.05)
```

### Algorithm

1. Compute `Contrast_black`
2. Compute `Contrast_white`
3. Select the color with:
   - **Highest contrast ratio**
   - **AND meeting required threshold** (4.5 or 3.0)

**Decision table:**

| Black Ratio | White Ratio | Selection |
|-------------|-------------|-----------|
| ≥ 4.5 | < 4.5 | Black |
| < 4.5 | ≥ 4.5 | White |
| ≥ 4.5 | ≥ 4.5 | Higher ratio |
| < 4.5 | < 4.5 | Remediation required (Section 4) |

**Note:** The luminance crossover point (~0.179) MUST NOT be used as a shortcut unless both full contrast ratios are computed.

---

## 4. Remediation Policy (When Both Black and White Fail)

This occurs for mid-tone backgrounds (e.g., some pinks, purples, mid-greens).

The agent MUST apply one of the following, **in order**:

### 4.1 Adjust Text Color (Preferred)

Allow text color to move away from pure black/white while preserving semantic role.

**Procedure:**

1. If background is light-mid (L_bg > 0.5), darken text toward black
2. If background is dark-mid (L_bg ≤ 0.5), lighten text toward white
3. Iteratively adjust in linear color space until required ratio is met

**Stop when:**
- Contrast ≥ required threshold
- OR maximum brand deviation limit is reached (if defined)

### 4.2 Adjust Background

If text color is locked (e.g., brand rule):

Adjust background luminance minimally to achieve required ratio.

**Constraints:**
- Preserve hue as much as possible
- Modify only lightness component (if using HSL/OKLCH pipeline)
- Recompute contrast after each adjustment

### 4.3 Apply Text Backplate (Last Resort)

Add:
- Solid background behind text
- OR semi-opaque overlay
- OR outline + shadow combination

The resulting effective background behind glyph pixels MUST satisfy required ratio.

---

## 5. Special Cases

### 5.1 Gradients

For gradients:
- Sample minimum-contrast point within text bounding box
- Use worst-case contrast
- If dynamic layout, sample at sufficient resolution (minimum 5x5 grid)

### 5.2 Images / Video

If text overlays image:
- Sample average luminance under glyph bounding box
- Also sample local min/max luminance
- Use worst-case region

If dynamic or animated:
- **Require backplate or scrim layer**

### 5.3 Opacity

If text or background uses alpha:
- Compute composited color first
- Then compute luminance

### 5.4 Disabled Text

If text is readable and conveys meaning:
- **It MUST meet 4.5:1** (WCAG does not exempt disabled content if it is still informative)

### 5.5 Anti-aliasing

Do NOT reduce contrast requirement due to font smoothing. Always use full color values.

---

## 6. Enforcement Rules for Agent

### The agent MUST:

- Audit every text node with computed styles
- Resolve final rendered background color (including stacking context)
- Compute luminance and contrast numerically
- Log:
  - Foreground color
  - Background color
  - Contrast ratio
  - Required threshold
  - Pass/Fail
- Apply deterministic remediation

### The agent MUST NOT:

- Infer readability from perceived brightness
- Assume pink is "light" or navy is "dark"
- Use fixed luminance thresholds without computing contrast
- Accept ratios within 0.01 of threshold due to rounding

---

## 7. Deterministic Decision Summary

Given background B and text T:

```
1. Compute L_B (background luminance)
2. Compute L_T (text luminance)
3. Compute contrast ratio
4. Compare against required ratio (4.5:1 or 3.0:1)
5. If fail:
   a. Attempt alternate color (black/white)
   b. If still fail → adjust text luminance
   c. If constrained → adjust background
   d. If constrained → add backplate
```

**No subjective steps. No heuristic overrides.**

---

## 8. Example Edge Case: White on Pink

If pink background has L_bg ≈ 0.35:

```
Contrast_white = 1.05 / (0.35 + 0.05) ≈ 2.5 → FAIL
Contrast_black = (0.35 + 0.05) / 0.05 = 8.0 → PASS
```

**Correct result:** black text

If a mid-tone pink yields both < 4.5, the system must shift either text or background luminance until ≥ 4.5.

---

## 9. Implementation Reference

### JavaScript Implementation

```javascript
/**
 * Calculate relative luminance per WCAG 2.1
 * @param {number} r - Red channel (0-255)
 * @param {number} g - Green channel (0-255)
 * @param {number} b - Blue channel (0-255)
 * @returns {number} Relative luminance (0-1)
 */
function getLuminance(r, g, b) {
  const linearize = (c) => {
    const sRGB = c / 255;
    return sRGB <= 0.04045
      ? sRGB / 12.92
      : Math.pow((sRGB + 0.055) / 1.055, 2.4);
  };

  const R = linearize(r);
  const G = linearize(g);
  const B = linearize(b);

  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

/**
 * Calculate WCAG contrast ratio
 * @param {number} lum1 - Luminance of first color (0-1)
 * @param {number} lum2 - Luminance of second color (0-1)
 * @returns {number} Contrast ratio (1-21)
 */
function getContrastRatio(lum1, lum2) {
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if text meets WCAG AA requirements
 * @param {string} fgColor - Foreground color (hex or rgb)
 * @param {string} bgColor - Background color (hex or rgb)
 * @param {boolean} isLargeText - True if text is ≥18pt or ≥14pt bold
 * @returns {{passes: boolean, ratio: number, required: number}}
 */
function checkContrast(fgColor, bgColor, isLargeText = false) {
  const fgRGB = parseColor(fgColor); // {r, g, b}
  const bgRGB = parseColor(bgColor);
  
  const fgLum = getLuminance(fgRGB.r, fgRGB.g, fgRGB.b);
  const bgLum = getLuminance(bgRGB.r, bgRGB.g, bgRGB.b);
  
  const ratio = getContrastRatio(fgLum, bgLum);
  const required = isLargeText ? 3.0 : 4.5;
  
  return {
    passes: ratio >= required,
    ratio,
    required
  };
}

/**
 * Select best text color (black or white) for background
 * @param {string} bgColor - Background color
 * @param {boolean} isLargeText
 * @returns {{color: string, ratio: number, passes: boolean}}
 */
function selectTextColor(bgColor, isLargeText = false) {
  const bgRGB = parseColor(bgColor);
  const bgLum = getLuminance(bgRGB.r, bgRGB.g, bgRGB.b);
  
  const blackLum = 0.0;
  const whiteLum = 1.0;
  
  const contrastBlack = getContrastRatio(bgLum, blackLum);
  const contrastWhite = getContrastRatio(bgLum, whiteLum);
  
  const required = isLargeText ? 3.0 : 4.5;
  
  const blackPasses = contrastBlack >= required;
  const whitePasses = contrastWhite >= required;
  
  if (blackPasses && !whitePasses) {
    return { color: '#000000', ratio: contrastBlack, passes: true };
  }
  if (!blackPasses && whitePasses) {
    return { color: '#FFFFFF', ratio: contrastWhite, passes: true };
  }
  if (blackPasses && whitePasses) {
    const best = Math.max(contrastBlack, contrastWhite);
    return {
      color: best === contrastBlack ? '#000000' : '#FFFFFF',
      ratio: best,
      passes: true
    };
  }
  
  // Neither passes - return best available with fails flag
  const best = Math.max(contrastBlack, contrastWhite);
  return {
    color: best === contrastBlack ? '#000000' : '#FFFFFF',
    ratio: best,
    passes: false,
    remediationRequired: true
  };
}
```

---

## 10. Current Project Status

### Implemented (as of 2026-02-22)

✅ **Contrast utility functions** (`src/utils/contrast.js`):
- `hslToRgb()` - HSL to RGB conversion
- `getRelativeLuminance()` - WCAG luminance calculation
- `getContrastRatio()` - Contrast ratio computation
- `getOptimalTextColor()` - Black/white text selection
- `validateContrast()` - WCAG validation
- `auditTheme()` - Theme audit function
- `auditAllThemes()` - Batch audit

✅ **Theme system** uses CSS variables:
- `--foreground` / `text-foreground`
- `--muted-foreground` / `text-muted-foreground`
- `--primary-foreground` / `text-primary-foreground`
- `--destructive-foreground` / `text-destructive-foreground`

✅ **All 16 themes** audited for WCAG AA compliance

✅ **Components updated**:
- ChatInterface.jsx (65 fixes)
- Shell.jsx (10 fixes + terminal theming)
- ToolsSettings.jsx (13 fixes)
- QuickSettingsPanel.jsx (42 fixes)
- ThemePreviewCard.jsx (15 fixes)

### Pending Implementation

⏳ **Automated CI check** - Add contrast audit to build pipeline

⏳ **Runtime validation** - Add contrast warnings in development mode

⏳ **Gradient handling** - Extend audit to support gradient backgrounds

---

## References

- [WCAG 2.1 Level AA](https://www.w3.org/WAI/WCAG21/quickref/?versions=2.1&showtechniques=143#contrast-minimum)
- [WCAG 2.2 Level AA](https://www.w3.org/WAI/WCAG22/quickref/?versions=2.2&showtechniques=143#contrast-minimum)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [W3C Relative Luminance Definition](https://www.w3.org/WAI/GL/wiki/Relative_luminance)

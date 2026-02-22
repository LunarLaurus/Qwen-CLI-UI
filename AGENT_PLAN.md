# Agent Execution Plan - Theme Expansion & Project Management

**Created:** 2026-02-22
**Session Commander:** Lauren (Architect)
**Status:** ✅ COMPLETED

---

## Mission Objectives

| Priority | Task | Agent | Status | Progress |
|----------|------|-------|--------|----------|
| **1** | Add light mode themes (3-4) | axiom-code-reviewer | ✅ Completed | 100% |
| **2** | Add LGBT+ pride themes | axiom-code-reviewer | ✅ Completed | 100% |
| **3** | Add project import button | general-purpose | ✅ Completed | 100% |
| **4** | Fix Windows path display names | general-purpose | ✅ Completed | 100% |

---

## Task 1: Light Mode Themes

**Objective:** Add 3-4 light theme variants to balance the dark theme collection

**Themes to Add:**
| Theme | Primary | Ring | Description |
|-------|---------|------|-------------|
| **alpine** | Blue | Sky | Crisp mountain air light theme |
| **sage** | Green | Olive | Calm botanical light palette |
| **lavender** | Purple | Violet | Soft floral light theme |
| **sand** | Warm Gray | Tan | Neutral desert light palette |

**Files to Modify:**
- `src/contexts/ThemeContext.jsx` — Add theme definitions

**Agent:** axiom-code-reviewer

---

## Task 2: LGBT+ Pride Themes

**Objective:** Add pride flag-inspired themes for representation

**Themes to Add:**
| Theme | Colors | Description |
|-------|--------|-------------|
| **trans-pride** | Pink/Blue/White | Transgender pride flag colors |
| **lesbian-pride** | Orange/Pink/White | Lesbian pride flag colors |
| **bi-pride** | Pink/Purple/Blue | Bisexual pride flag colors |
| **nonbinary-pride** | Yellow/White/Purple/Black | Non-binary pride flag colors |
| **rainbow-pride** | Rainbow | Classic LGBTQ+ rainbow flag |

**Implementation:**
- Dark mode themes with pride accent colors
- Primary/ring colors from flag palettes
- Respectful naming and representation

**Files to Modify:**
- `src/contexts/ThemeContext.jsx` — Add theme definitions
- `src/components/ui/ThemePreviewCard.jsx` — May need gradient updates for multi-color flags

**Agent:** axiom-code-reviewer

---

## Task 3: Project Import Button

**Objective:** Add easy import button when adding new projects

**Current Flow:**
1. Click "+" button
2. Type full path manually
3. No file picker

**Desired Flow:**
1. Click "+" button
2. See "Browse" button next to path input
3. Click "Browse" → native folder picker
4. Path auto-fills
5. Confirm to create

**Implementation:**
- Add `<input type="file" webkitdirectory />` hidden element
- Add "Browse" button that triggers it
- Extract path from selected directory
- Populate path input field

**Files to Modify:**
- `src/components/Sidebar.jsx` — Add browse button to new project form
- `server/projects.js` — May need path validation updates

**Agent:** general-purpose

---

## Task 4: Fix Windows Path Display

**Objective:** Fix weird full Windows path named directories in project display

**Current Issue:**
- Projects show as full absolute paths: `C:\Users\Lauren\Documents\git projects\...`
- Ugly, takes too much space, hard to read

**Desired Behavior:**
- Show friendly folder name: `Qwen-CLI-UI` or `.../git projects/Qwen-CLI-UI`
- Use `package.json` name if available
- Truncate long paths with ellipsis

**Current Code Analysis:**
- `server/projects.js` has `generateDisplayName()` function
- Already attempts to read `package.json` name
- Falls back to path truncation for absolute paths
- Logic exists but may not be working correctly for Windows paths

**Fix Required:**
- Debug `generateDisplayName()` for Windows path handling
- Ensure path separator is `/` not `\` for display
- Improve truncation logic for long Windows paths
- Test with various path depths

**Files to Modify:**
- `server/projects.js` — Fix `generateDisplayName()` function

**Agent:** general-purpose

---

## Progress Log

| Time | Event | Details |
|------|-------|---------|
| 2026-02-22 16:00 | Plan created | Initial agent deployment |
| 2026-02-22 16:05 | Theme expansion completed | Added 9 new themes (4 light + 5 pride) to ThemeContext.jsx. Build passed successfully. |
| 2026-02-22 16:08 | Project management improvements completed | Task 3: Added Browse button to Sidebar.jsx for folder picker. Task 4: Fixed generateDisplayName() in server/projects.js for Windows paths. Build passed successfully. |
| 2026-02-22 16:30 | Folder picker fix | Fixed handleFolderSelect() to handle browser security limitations. Added confirm/prompt flow for manual path entry when browser blocks automatic detection. Build passed (18s, 1925 modules). |
| 2026-02-22 16:45 | Light/pride theme fix | Fixed applyColors() to add/remove 'dark' class on documentElement. Light themes now properly remove dark class, pride themes now show correct colors. Build passed (17.6s, 1925 modules). |
| 2026-02-22 17:00 | Pride theme color update | Updated all pride themes with accurate flag colors (Trans: #5BCFFB/#F5A9B8, Bi: #D60270/#9B4F96/#0038A8, Lesbian: sunset variant, Pan: added, Nonbinary: #FFF433/#9C59D1, Rainbow: Gilbert Baker). Added pan-pride theme. Build passed (17.3s, 1925 modules). |
| 2026-02-22 17:15 | Dark/Light pride variants | Created dark AND light variants for all 6 pride themes (12 total). Extended color palettes with primary/secondary/accent colors for better cross-site styling. Build passed (17.5s, 1925 modules). |
| 2026-02-22 17:30 | Extended color palettes | All 16 themes now have 3-5 distinct accent colors. Light themes (alpine/sage/lavender/sand) updated with unique primary/secondary/accent. Pride themes use flag colors + white/black for full palettes. Build passed (20.4s, 1925 modules). |

---

## Completion Criteria

- [x] 3-4 light themes added and functional
- [x] 5 LGBT+ pride themes added and functional
- [x] Project import with browse button working (with manual path fallback for browser security)
- [x] Windows paths display nicely (truncated, friendly names)
- [x] Build passes with all changes
- [x] This document updated with final status

---

## Summary

**All missions completed:**

1. **Theme Expansion:** 16 themes total, each with 3-5 distinct accent colors
   - Light mode: alpine, sage, lavender, sand (4 themes × 3-5 colors each)
   - Pride Dark/Light: trans, lesbian, bi, pan, nonbinary, rainbow × 2 variants (12 themes × 3-5 colors each)

2. **Project Import:** Browse button with confirm/prompt fallback
3. **Path Display:** Windows paths truncated with friendly names

**Build:** ✅ 20.4s, 1925 modules | **Node:** 20.18.1 (warning only)

### All Themes with Color Palettes

| Theme | Type | Colors Used |
|-------|------|-------------|
| **alpine** | Light | Blue #0ea5e9, Cyan #06b6d4, Teal #22d3ee |
| **sage** | Light | Green #22c55e, Forest #16a34a, Lime #84cc16 |
| **lavender** | Light | Purple #a855f7, Violet #c084fc, Pink #e879f9 |
| **sand** | Light | Amber #d97706, Orange #f59e0b, Yellow #eab308 |
| **trans-pride** | Dark | Blue #5BCFFB, Pink #F5A9B8, White #FFFFFF |
| **trans-pride-light** | Light | Blue #5BCFFB, Pink #F5A9B8, White #FFFFFF |
| **lesbian-pride** | Dark | Orange #D52D00, Peach #FF9A56, White #FFFFFF, Pink #D362A4, Rose #A30262 |
| **lesbian-pride-light** | Light | Orange #D52D00, Peach #FF9A56, White #FFFFFF, Pink #D362A4, Rose #A30262 |
| **bi-pride** | Dark | Pink #D60270, Purple #9B4F96, Blue #0038A8 |
| **bi-pride-light** | Light | Pink #D60270, Purple #9B4F96, Blue #0038A8 |
| **pan-pride** | Dark | Pink #FF218C, Yellow #FFD800, Blue #21B1FF |
| **pan-pride-light** | Light | Pink #FF218C, Yellow #FFD800, Blue #21B1FF |
| **nonbinary-pride** | Dark | Yellow #FFF433, White #FFFFFF, Purple #9C59D1, Black #000000 |
| **nonbinary-pride-light** | Light | Yellow #FFF433, White #FFFFFF, Purple #9C59D1, Black #000000 |
| **rainbow-pride** | Dark | Red #E40303, Orange #FF8C00, Yellow #FFED00, Green #008026, Blue #004DFF |
| **rainbow-pride-light** | Light | Red #E40303, Orange #FF8C00, Yellow #FFED00, Green #008026, Blue #004DFF |

### Extended Color Palette Slots (All Themes)
Each theme includes these color slots for comprehensive cross-site styling:
- **primary** - Main brand/focus color (flag color 1)
- **secondary** - Secondary elements (flag color 2)
- **accent** - Tertiary highlights (flag color 3+, or white/black)
- **muted** - Subdued backgrounds
- **destructive** - Error/danger states
- **ring** - Focus/highlight color
- **Plus:** background, foreground, card, border, input, popover

---

## Related Documents

- **WORK_IN_PROGRESS.md** — Session history and feature status
- **QWEN.md** — Project context and architecture
- **AGENT_PLAN.md** — This file (agent operational tracking)

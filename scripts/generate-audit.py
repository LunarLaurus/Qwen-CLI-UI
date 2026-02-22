#!/usr/bin/env python3
"""
Generate audit-themes-ci.js from actual ThemeContext.jsx
Extracts lines 15-700 (THEMES object) and embeds in audit script.

Usage:
  python scripts/generate-audit.py && npm run audit:wcag
"""

# Read ThemeContext with UTF-8
with open('src/contexts/ThemeContext.jsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Extract lines 15-700 (THEMES object: "export const THEMES = {" to "};")
themes_lines = lines[14:700]  # 0-indexed, so line 15 is index 14
themes_lines[0] = themes_lines[0].replace('export const THEMES = ', 'const THEMES = ')
themes_data = ''.join(themes_lines)

# Read the static part of audit script (after // Color pairs comment)
with open('scripts/audit-themes-ci.js', 'r', encoding='utf-8') as f:
    audit_content = f.read()

# Find the // Color pairs comment
marker = '// Color pairs to test'
marker_idx = audit_content.find(marker)

if marker_idx == -1:
    print('ERROR: Could not find Color pairs marker')
    exit(1)

# Build new audit script: THEMES data + static part after marker
# First find where the old THEMES definition ends
old_themes_end = audit_content.find(marker)
if old_themes_end == -1:
    print('ERROR: Could not find end of THEMES')
    exit(1)

# Find the beginning of the file up to where THEMES starts
beginning_marker = 'import { getContrastRatioAny }'
beginning_idx = audit_content.find(beginning_marker)

if beginning_idx == -1:
    print('ERROR: Could not find beginning marker')
    exit(1)

# Get the imports part
imports_part = audit_content[beginning_idx:audit_content.find('const THEMES')]

# Build new audit script
new_audit = imports_part + '\n' + themes_data + '\n' + audit_content[old_themes_end:]

# Write updated audit script with UTF-8
with open('scripts/audit-themes-ci.js', 'w', encoding='utf-8') as f:
    f.write(new_audit)

print('[OK] Generated audit-themes-ci.js from ThemeContext.jsx')
print('    Run: npm run audit:wcag')

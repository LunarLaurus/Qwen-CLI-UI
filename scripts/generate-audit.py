#!/usr/bin/env python3
"""
Generate audit-themes-ci.js from actual ThemeContext.jsx
This ensures the audit script always uses the real theme data.

Usage:
  python scripts/generate-audit.py && npm run audit:wcag
"""

import re

# Read ThemeContext with UTF-8
with open('src/contexts/ThemeContext.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract THEMES object
match = re.search(r'export const THEMES = (\{.+?\});\n', content, re.DOTALL)
if not match:
    print('ERROR: Could not find THEMES export')
    exit(1)

themes_data = match.group(1)

# Read audit script template with UTF-8
with open('scripts/audit-themes-ci.js', 'r', encoding='utf-8') as f:
    audit_template = f.read()

# Replace THEMES_PLACEHOLDER with actual data
# Try placeholder first, then try to replace the existing THEMES object
if 'const THEMES_PLACEHOLDER = {};' in audit_template:
    new_audit = audit_template.replace(
        'const THEMES_PLACEHOLDER = {};',
        f'const THEMES = {themes_data};'
    )
else:
    # Replace existing THEMES object (from 'const THEMES = {' to the matching closing brace)
    # Find the start of THEMES definition
    themes_start = audit_template.find('const THEMES = {')
    if themes_start == -1:
        print('ERROR: Could not find THEMES in audit script')
        exit(1)
    
    # Find the end by counting braces
    brace_count = 0
    themes_end = themes_start
    started = False
    for i, char in enumerate(audit_template[themes_start:]):
        if char == '{':
            brace_count += 1
            started = True
        elif char == '}':
            brace_count -= 1
        if started and brace_count == 0:
            themes_end = themes_start + i + 1
            break
    
    if themes_end == themes_start:
        print('ERROR: Could not find end of THEMES object')
        exit(1)
    
    # Replace the THEMES object
    new_audit = audit_template[:themes_start] + f'const THEMES = {themes_data};' + audit_template[themes_end:]

# Write updated audit script with UTF-8
with open('scripts/audit-themes-ci.js', 'w', encoding='utf-8') as f:
    f.write(new_audit)

print('[OK] Generated audit-themes-ci.js from ThemeContext.jsx')
print('    Run: npm run audit:wcag')

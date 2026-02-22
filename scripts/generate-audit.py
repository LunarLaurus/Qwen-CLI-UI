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
new_audit = audit_template.replace(
    'const THEMES_PLACEHOLDER = {};',
    f'const THEMES = {themes_data};'
)

# Write updated audit script with UTF-8
with open('scripts/audit-themes-ci.js', 'w', encoding='utf-8') as f:
    f.write(new_audit)

print('[OK] Generated audit-themes-ci.js from ThemeContext.jsx')
print('    Run: npm run audit:wcag')

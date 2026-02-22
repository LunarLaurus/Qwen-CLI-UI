#!/usr/bin/env python3
"""
Generate audit-themes-ci.js from actual ThemeContext.jsx
This ensures the audit script always uses the real theme data.
"""

import re

# Read ThemeContext
with open('src/contexts/ThemeContext.jsx', 'r') as f:
    content = f.read()

# Extract THEMES object
match = re.search(r'export const THEMES = (\{.+?\});\n', content, re.DOTALL)
if not match:
    print('ERROR: Could not find THEMES export')
    exit(1)

themes_data = match.group(1)

# Read audit script template
with open('scripts/audit-themes-ci.js', 'r') as f:
    audit_template = f.read()

# Replace embedded THEMES with actual data
# Find the const THEMES = {...}; block and replace it
new_audit = re.sub(
    r'const THEMES = \{[^}]+\};\n\n// Color pairs',
    f'const THEMES = {themes_data};\n\n// Color pairs',
    audit_template,
    flags=re.DOTALL
)

# Write updated audit script
with open('scripts/audit-themes-ci.js', 'w') as f:
    f.write(new_audit)

print('Generated audit-themes-ci.js from ThemeContext.jsx')

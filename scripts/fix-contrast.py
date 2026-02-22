#!/usr/bin/env python3
"""
Fix all theme foreground colors for WCAG AA compliance.
Light themes: all *Foreground -> black (0 0% 10%)
Dark themes: all *Foreground -> white (0 0% 100%)
"""

import re

with open('src/contexts/ThemeContext.jsx', 'r') as f:
    content = f.read()

# Track if we're in a light or dark theme
lines = content.split('\n')
output_lines = []
in_dark_theme = False

for i, line in enumerate(lines):
    # Detect theme type from isDark property
    if 'isDark: true' in line:
        in_dark_theme = True
    elif 'isDark: false' in line:
        in_dark_theme = False
    
    # Fix foreground colors based on theme type
    if in_dark_theme:
        # Dark themes: all foregrounds should be white
        line = re.sub(r"foreground: '[\d.]+ [\d.]+% [\d.]+%'", "foreground: '0 0% 100%'", line)
        line = re.sub(r"cardForeground: '[\d.]+ [\d.]+% [\d.]+%'", "cardForeground: '0 0% 100%'", line)
        line = re.sub(r"popoverForeground: '[\d.]+ [\d.]+% [\d.]+%'", "popoverForeground: '0 0% 100%'", line)
        line = re.sub(r"primaryForeground: '[\d.]+ [\d.]+% [\d.]+%'", "primaryForeground: '0 0% 100%'", line)
        line = re.sub(r"secondaryForeground: '[\d.]+ [\d.]+% [\d.]+%'", "secondaryForeground: '0 0% 100%'", line)
        line = re.sub(r"mutedForeground: '[\d.]+ [\d.]+% [\d.]+%'", "mutedForeground: '0 0% 80%'", line)
        line = re.sub(r"accentForeground: '[\d.]+ [\d.]+% [\d.]+%'", "accentForeground: '0 0% 100%'", line)
        line = re.sub(r"destructiveForeground: '[\d.]+ [\d.]+% [\d.]+%'", "destructiveForeground: '0 0% 100%'", line)
    else:
        # Light themes: all foregrounds should be black/dark
        line = re.sub(r"foreground: '[\d.]+ [\d.]+% [\d.]+%'", "foreground: '0 0% 12%'", line)
        line = re.sub(r"cardForeground: '[\d.]+ [\d.]+% [\d.]+%'", "cardForeground: '0 0% 10%'", line)
        line = re.sub(r"popoverForeground: '[\d.]+ [\d.]+% [\d.]+%'", "popoverForeground: '0 0% 10%'", line)
        line = re.sub(r"primaryForeground: '[\d.]+ [\d.]+% [\d.]+%'", "primaryForeground: '0 0% 10%'", line)
        line = re.sub(r"secondaryForeground: '[\d.]+ [\d.]+% [\d.]+%'", "secondaryForeground: '0 0% 10%'", line)
        line = re.sub(r"mutedForeground: '[\d.]+ [\d.]+% [\d.]+%'", "mutedForeground: '0 0% 35%'", line)
        line = re.sub(r"accentForeground: '[\d.]+ [\d.]+% [\d.]+%'", "accentForeground: '0 0% 10%'", line)
        line = re.sub(r"destructiveForeground: '[\d.]+ [\d.]+% [\d.]+%'", "destructiveForeground: '0 0% 10%'", line)
    
    output_lines.append(line)

with open('src/contexts/ThemeContext.jsx', 'w') as f:
    f.write('\n'.join(output_lines))

print('Fixed all foreground colors for WCAG AA compliance')

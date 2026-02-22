#!/usr/bin/env python3
"""
WCAG Contrast Audit - Simple Sync Version

Syncs ThemeContext.jsx to scripts/test/ for audit, runs audit,
and can copy back the fixed version.

Usage:
  python scripts/audit-sync.py           # Sync and run audit
  python scripts/audit-sync.py --apply   # Apply fixes back to ThemeContext.jsx
"""

import sys
import os
import shutil
import subprocess

SCRIPTS_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.dirname(SCRIPTS_DIR)
TEST_DIR = os.path.join(SCRIPTS_DIR, 'test')
THEME_SOURCE = os.path.join(ROOT_DIR, 'src', 'contexts', 'ThemeContext.jsx')
THEME_TEST = os.path.join(TEST_DIR, 'ThemeContext.jsx')

def sync_to_test():
    """Copy ThemeContext.jsx to test folder"""
    os.makedirs(TEST_DIR, exist_ok=True)
    shutil.copy2(THEME_SOURCE, THEME_TEST)
    print('[OK] Synced ThemeContext.jsx -> scripts/test/ThemeContext.jsx')

def run_audit():
    """Run the audit against test file"""
    # Update audit script to use test file
    audit_script = os.path.join(SCRIPTS_DIR, 'audit-themes-ci.js')
    
    with open(audit_script, 'r', encoding='utf-8') as f:
        content = f.read()

    # Change import to use test file
    if 'from \'./test/ThemeContext.jsx\'' not in content:
        content = content.replace(
            'from \'../src/contexts/ThemeContext.jsx\'',
            'from \'./test/ThemeContext.jsx\''
        )
        with open(audit_script, 'w', encoding='utf-8') as f:
            f.write(content)
        print('[OK] Updated audit script to use test file')

    # Run audit
    print('\n' + '-'*60)
    print('Running WCAG audit...')
    print('-'*60 + '\n')

    result = subprocess.run(
        ['node', 'scripts/audit-themes-ci.js'],
        cwd=ROOT_DIR,
        capture_output=False
    )

    return result.returncode

def apply_fixes():
    """Copy fixed test file back to source"""
    if os.path.exists(THEME_TEST):
        shutil.copy2(THEME_TEST, THEME_SOURCE)
        print('[OK] Applied fixes: scripts/test/ThemeContext.jsx -> src/contexts/ThemeContext.jsx')
    else:
        print('[ERR] No test file found. Run audit first.')

def main():
    if len(sys.argv) > 1 and sys.argv[1] == '--apply':
        apply_fixes()
    else:
        sync_to_test()
        exit_code = run_audit()
        print('\n' + '-'*60)
        if exit_code == 0:
            print('[OK] All themes pass WCAG AA!')
        else:
            print('[FAIL] Some themes fail WCAG AA')
            print('  Fix themes in: scripts/test/ThemeContext.jsx')
            print('  Then run: python scripts/audit-sync.py --apply')
        sys.exit(exit_code)

if __name__ == '__main__':
    main()

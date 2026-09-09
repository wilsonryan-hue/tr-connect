#!/usr/bin/env bash
# MD HARD LOCK: fail if public door would publish SPA / ops dumps.
set -euo pipefail
echo "Door lock check…"
if [ -f live-state.json ]; then echo "FAIL: live-state.json"; exit 1; fi
if [ -f staff-auth.json ]; then echo "FAIL: staff-auth.json"; exit 1; fi
if ls assets/*.js >/dev/null 2>&1; then echo "FAIL: assets/*.js"; ls -la assets; exit 1; fi
if grep -E 'assets/index-|password-book|CREATE YOUR PASSWORD' index.html site.html 404.html >/dev/null 2>&1; then
  echo "FAIL: HTML references SPA/password-book"; exit 1
fi
if ! grep -q 'This public door is closed' index.html; then
  echo "FAIL: index.html not closed-door"; exit 1
fi
echo "Door lock OK"

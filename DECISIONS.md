# Decisions (locked)

- Finished-for-now = office + site + true money. Client portal waits.
- Product address = GitHub Pages door. Never a grok-sandbox URL.
- Money rule = Ryan / Ryan2 / Kacey lines are Ryan-only.
- Hours chain = worker → site → Kacey → Ryan.
- PO chain = Alex/Jim → Kacey → Ryan. Ryan can approve any PO.
- Drills use PRACTICE — Drill job only. Not Iford, Hexham, Fitzmor, Bury.
- Published snapshot stores data on the device. Shared book is the next engineering job after the door stays up.
- Do not start a new Connect repo.
- TCH Works and IntuiTune wait until Connect is usable day to day.

## 2026-09-09 — MD HARD LOCK (door)
- Public Pages under www.tchworks.co.uk/tr-connect/ stays closed-door HTML only.
- NEVER publish assets/index-*.js, live-state.json, or staff-auth.json until server /api/staff-auth is live AND MD GO.
- Reopen 2bcba83 (Treun Roc Connect / ryan@treunroc.com) was unauthorized; re-closed 6705617.
- Door-guard script: scripts/door-lock-check.sh (pages.yml CI step blocked until a credential with `workflow` scope updates the Actions workflow).
- Custom domain connect.treunroccontracts.com: CNAME Host=connect Value=wilsonryan-hue.github.io when Namecheap allows — domain attach only.
- CI workflow edit blocked: gh OAuth token lacks `workflow` scope. Guard script at scripts/door-lock-check.sh until a token/user with workflow scope updates .github/workflows/pages.yml.

## 2026-09-09 — Ryan override: staff login live
- Ryan ordered staff login working immediately (closed-door HTML removed).
- Restored desk SPA from 2bcba83 (no live-state.json).
- Server /api/staff-auth still not live; device/local login path as in that build.

## 2026-09-09 — Door brand + URL
- Boot landing: TR logo + tech MI visuals.
- Primary staff URL: https://wilsonryan-hue.github.io/tr-connect/ (not tchworks).
- connect.treunroccontracts.com stays pending until dig DNS_OK; no CNAME file on Pages until then.

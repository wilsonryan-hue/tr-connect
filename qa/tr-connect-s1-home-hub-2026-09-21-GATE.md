# GATE — TR Connect S1 Home hub — 2026-09-21 (BST)

Obeys `/workspace/ops/TR-CONNECT-META-PROMPT-10-2026-09-21.md`  
Slice: **S1** · Scoreboard: **§0.3 Home hub** · Target: **~4 → ~6 (NOT 10)**

## Scoreboard (honest)

| | |
|--|--|
| **Was** | ~4/10 — nav IA shipped (`d7927d3`); home canvas still Needs-you / seed runway with **Go-to chips** afterthought |
| **Now** | **~6/10** — signed-in `/` hierarchy is ops hub: Section map cards first-class, Needs you condensed, On site preserved, £0 runway demoted/filtered |
| **Still not 10** | Boot landing still glow-hero (S2); pulses still seed/demo (S3); section QA incomplete (S4); auth still interim tunnel (S5); TR Bot not deep desk intel (S6); craft still surgical minified forks (S7–S8). No Ryan/staff DAU confirm. **Do not claim 10.** |

## What changed on `/`

Hierarchy after sign-in:

1. **Greeting row** — short eyebrow + `Good …, {name}` + New job (unchanged intent)
2. **Section map** — first-class grid of large cards for primary `Ab` destinations (Jobs, Mail, Quotes, Quick BD, Approvals, Finance, Invoices, Live Monitor, Workers, Site app) with group labels Desk/Money/Ops — **replaces** weak “Go to” chip row
3. **Needs you** — condensed (`tr-needs-panel`; notices ≤3, actions ≤4; “Top items only”)
4. **On site now** — preserved featured LIVE card
5. **Pulse metrics** — kept
6. **Live & next** — was “The book”; **JS filters out** £0 Quoted/Tendered runway cards (CSS `tr-runway-zero` still hides as belt-and-braces); quiet cards further demoted

## Files (surgical only)

- `assets/index-f4-door.js` — home `tS` only (Section map / Needs you / runway filter)
- `assets/style-BdKMu5_G.css` — `TR-CONNECT-S1-HOME-HUB-2026-09-21` block
- `index.html` + `site.html` — cache bust `?v=s1-home-hub-20260921`

**Kept:** sidebar from `d7927d3` (`Ab`/`jb`/`tr-nav-aside`), TR Bot, persist `tr-connect-v11`, login, money gates, exports. No TanStack new routes. No Vite rebuild from stub.

## Honesty — prove

| Claim | Status |
|-------|--------|
| Bundle markers (Section map, no Go-to chips, runway.filter, TR Bot, Ab) | **PASS** — `static-checks.json` all true |
| Static layout screenshot of intended hierarchy | **PASS** — `fixture-section-map.png` + `fixture-section-map.html` |
| **Authenticated** hard-refresh on `connect.treunroccontracts.com` | **NOT DONE** — executor has **no staff door credentials**; live URL opens `#boot` sign-in (`app` children false). **Fixture is not authenticated prove.** Do not treat fixture as live desk proof. |
| Ryan hard-refresh after Pages deploy | **Pending human** — after push, signed-in laptop ~1100px should show Section map cards as main canvas under greeting |

## Non-goals (respected)

- Boot landing rewrite (S2)
- Render durable auth (S5)
- Claiming 10
- Aesthetic-only vanity
- TanStack new file routes
- Vite rebuild from `tr-connect-src` stub

## Definition of done

- [x] Home hierarchy (a)–(e)
- [x] Surgical files only; sidebar + TR Bot kept
- [x] No desk blank / no stub Vite
- [x] GATE with was→now, why not 10, honesty section
- [x] Commit + push main
- [ ] Authenticated live screenshot — blocked without staff password (stated honestly)

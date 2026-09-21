# GATE — TR Connect nav shell IA — 2026-09-21

## Bar
Ryan: landing feels like a poster; no persistent sidebar to reach sections we already built. End results, not journey.

## What shipped (surgical, no Vite rebuild / no TanStack route surgery)
Files:
- `assets/index-f4-door.js` — `Ab` / `jb` / `Mb` / `Nb` / home `tS` Go-to chips
- `assets/style-BdKMu5_G.css` — `.tr-nav-aside` chrome addon
- `index.html` — cache bust `?v=nav-ia-20260921`

### 1. Sidebar visible from md+
- `aside`: `hidden` … `md:block` (was `lg:block`), `w-56`, `bg-surface`, class `tr-nav-aside`
- Hamburger: `md:hidden` (was `lg:hidden`)
- Mobile drawer: `md:hidden` (was `lg:hidden`)

### 2. Primary `Ab` (order)
Home → Jobs → Mail → Quotes → Quick BD (`/tenders`) → Approvals → Finance (`/statements`) → Invoices → Live Monitor (`/monitor`) → Workers → Site app

Groups rendered in `Nb`: **Desk / Money / Ops**

### 3. More `jb` (deduped)
Calendar, Suppliers, Materials, Company files, Report, Team (Ryan), Share links (Ryan), Get the app  
**Removed** from More: Live Monitor, Invoices, Workers, Tenders (dup of Quick BD)

### 4. More default open for office
`useState(() => i !== 'WORKER' || jb.some(...))` — office users see More expanded without a click.

### 5. Home hub
Compact **Go to** chip row on `/` linking all primary `Ab` destinations (excludes Home). Desk / Needs you / On site unchanged.

### 6. Kept
Cmd+K `Ob`, TR Bot, login, Ryan money gates, exports. No new routes.

## Prove
Static: `static-checks.json` — all 15 checks **pass**.

CSS/media fixture (`qa-nav-fixture.html` local / `fixture-aside.html`):
| width | aside | hamburger | aside width |
|------:|-------|-----------|-------------|
| 700px | `none` | `grid` | 224px |
| 900px | `block` | `none` | 224px (w-56) |
| 1100px | `block` | `none` | 224px |

Screenshot: `fixture-1100-ish.png` (sidebar groups Desk/Money/Ops + gold rail on Home + Go-to chips).

Live authenticated hard-refresh on Pages still requires staff door sign-in; class truth + md breakpoint proven above. After push, Ryan at ~1100px signed-in should see the persistent left nav with core sections (no More-first for Jobs/Mail/Finance/Monitor/Invoices/Workers).

## Definition of done
- [x] md+ persistent sidebar
- [x] core sections in primary nav
- [x] More expanded by default for office; no Tenders dup
- [x] Home Go-to launchers
- [x] Commit + push main

# GATE — Ryan-only Management P&L + money-screen jd gates · 2026-09-17

## Result: PASS

| Check | Result |
|-------|--------|
| Fd is jd-only | **PASS** — `function Fd(e){return jd(e)}` (Nd removed from Fd) |
| Pd unchanged | **PASS** — `function Pd(e){return jd(e)||Nd(e)}` still for other director features |
| Report uses jd | **PASS** — `w1`: `if(!jd(e))return(0,I.jsx)(T1,{})` |
| Invoices raise/Xero/Sage Ryan-only | **PASS** — `dC`: `r=jd(t)` (office keeps register-only via `!r`) |
| Office Finance summary | **PASS** — `e0`: `if(!Fd(e))return … n0` (Demo no longer Fd) |
| Workers on Report | **PASS** — existing `kd(e)===WORKER` → `/site` unchanged |
| xlsx board pack | **PASS** — 5 sheets Cover / P&L / Invoice register / Cash summary / Assumptions |
| Export paths | **PASS** — `ops/tr-forecast/`, `tr-connect/exports/`, `tr-connect/public/exports/` |
| Finance Ryan buttons | **PASS** — Management P&L .xlsx + Export live pack (CSV) + page link |
| `#/management-pnl` | **PASS** — `mgmtR0=Qr(/management-pnl)` jd-gated |
| Live CSV | **PASS** — `exportRyanMgmtPack()` → `TR-Connect-Management-PnL-LIVE-YYYY-MM-DD.csv` via `vS` |
| Export URL curl 200 | **PASS** — HTTP 200, 20932 bytes, 5 sheets |
| Browser role prove | **DEFERRED** — door login session may wait; code evidence below |

## Code evidence (grep)

```
function jd(e){return kd(e)===`RYAN`}
function Nd(e){return kd(e)===`DEMO`}
function Pd(e){return jd(e)||Nd(e)}
function Fd(e){return jd(e)}
```

Report gate: `if(!jd(e))return(0,I.jsx)(T1,{})`  
Invoices: `function dC(){… r=jd(t)`  
Finance office path: `if(!Fd(e))return(0,I.jsx)(Mb,{children:(0,I.jsx)(n0,{})})`  
→ Demo hits `n0` summary (no longer full bank lines). Office → `n0`. Ryan → full Finance + export buttons.

## Role prove (documented)

| Role | Expected |
|------|----------|
| Ryan (`ryan@treunroc.com` / `.co.uk`) | Fd true → full Finance bank lines + Mgmt P&L buttons; Report; Invoice raise/Xero/Sage |
| Office | Fd false → `n0` Finance summary; Report blocked (T1); Invoices register-only |
| Demo | Fd false (Nd no longer in Fd) → same as office on Finance (`n0`); Report was Pd so Demo still had Report via old Pd — **Report now jd-only, Demo blocked** |
| Worker | Report → `/site` (unchanged) |

Browser session prove may wait on door login — note for follow-up.

## Prove URL
https://connect.treunroccontracts.com/exports/TR-Connect-Management-PnL.xlsx

## Commits
`48b48ff` — Ryan-only Management P&L pack + money-screen jd gates

## Gated (what changed)
- Money screens tightened to Ryan (`jd`): Finance full book (`Fd`), Report (`w1`), Invoice raise/exports (`dC`)
- Management P&L board xlsx + live CSV exporter on Ryan Finance view
- Optional `#/management-pnl` jd gate

## Forbidden not done
No Vite SPA rebuild from stub src. No Stripe. No invented full accounting engine.

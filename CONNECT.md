# Treun Roc Connect — product brief

Locked 9 Sep 2026. This workspace and this repo are Connect only.

## Goal

UK SME contractor desk for Treun Roc Contracts Ltd. One book from tender to completion: quotes, jobs, live margin (allocated cost + pro-rata overhead), Construction Act applications, statements, site phone (hours, receipts, progress), workers/tickets, tenders, company files.

Reference jobs that prove it: Iford fire reinstatement, Weird Fish Hexham, Joe Browns Cirencester.

## What was built

- Office desk + site phone, black/gold TR brand
- Role isolation: Ryan/Kacey money lines; staff do not see the bank
- Live margin work including automated pro-rata overhead (built in Grok Build; not all of it published)
- Mail scan onto jobs
- PWA icons
- Partner brief for Marlon (IT/sales, licence discussion — not investment)
- Forensic first-paint rule: if it is wrong in the first eight seconds after the password, it is a fail

## What went wrong

1. Grok sandboxes were treated as production. They die (HTTP 500).
2. On 2 Sep the public door was locked: “Staff sign-in is not available here.” That is why the portal refused login.
3. `wilsonryan-hue.github.io` uses custom domain `tchworks.co.uk`, so Connect project pages appear at `www.tchworks.co.uk/tr-connect/`. That is GitHub hosting, not a product merge. TCH shop is the domain root. Connect is this folder.

## Door rule

Product address = this Pages folder. Never a grok-sandbox URL. Never the TCH shop home.

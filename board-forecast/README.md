# Board forecast export

## Template
MD drops the Excel template under `/workspace/ops/tr-forecast/`.

Canonical file: `TR-Connect-Board-Forecast.xlsx`  
Stub copy: `TR-BOARD-FORECAST-STUB-2026-09-17.xlsx`

Branding title: **Treun Roc Connect**

## What export fills
Rows from jobs with status **QUOTED**, **TENDERED**, **UPCOMING**, or **LIVE**, plus BD fields stored in job `notes` from Quick BD:

| Column | Source |
|--------|--------|
| Client | job.client |
| Project | job.name |
| Location | job.location |
| Contact | notes `Contact:` line |
| Annual Turnover | job.valuePence / 100 (or notes) |
| Margin | notes `Est. Margin £:` |
| Duration weeks | notes `Duration weeks:` |
| Monthly impact | annual ÷ duration weeks |
| Status | job.status |

## Formula (ONLY)
```
monthly_impact_gbp = annual_turnover_gbp / duration_weeks
```

Plain English: **Monthly impact £ = Est. Annual Turnover ÷ Est. Duration (weeks)**

Optional note (not a second calc): “this is £ per week of programme labelled Monthly Impact per Ryan”

**Forbidden:** ×4.345 or any alternate calc.

## Script
See `/workspace/ops/tr-bd/export-board-forecast.mjs` for column map + sample JSON → CSV/xlsx path.

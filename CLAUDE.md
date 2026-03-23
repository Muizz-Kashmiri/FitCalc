# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Dev server at localhost:3000
npm run build        # Production build
npm run lint         # ESLint
npx tsc --noEmit     # Type check without building
vercel deploy --prod # Deploy directly via CLI (no git push needed)
```

## Architecture

Next.js 16 App Router, TypeScript, Tailwind CSS. Single-page client-side calculator. No backend, no database, no API routes.

### Data flow

1. `StatsForm` collects user input and calls `onCalculate(stats: UserStats)`
2. `app/page.tsx` calls `calculate(stats)` from `lib/utils.ts`
3. `calculate()` runs the full pipeline and returns `CalculationResult`
4. `ResultsCard` renders all result sections using sub-components

### Calculation pipeline (`lib/calculations/`)

| File | Purpose |
|---|---|
| `bmr.ts` | Mifflin-St Jeor BMR |
| `tdee.ts` | BMR x activity multiplier |
| `bodyFat.ts` | LBM/fat mass split, ACE BF% categories |
| `macros.ts` | Protein from LBM x experience multiplier, fat floor, carbs fill remainder |
| `cut.ts` | Deficit to weekly/monthly fat loss, safe calorie floor |
| `idealWeight.ts` | Devine formula, Robinson formula, BMI healthy range, LBM-based goal weights |

### Key design decisions

- **Protein is based on lean body mass (LBM), not total weight.** This is intentional and more accurate. Do not change this to total bodyweight.
- All unit conversions (kg/lbs, cm/ft+in) happen in `lib/utils.ts`. All internal calculations use metric only.
- Safe calorie floor: 1,500 kcal (men) / 1,200 kcal (women), enforced in `cut.ts`.
- No em dashes anywhere in the UI. Use plain hyphens, commas, or rephrase.
- All number inputs use `value={n || ""}` with `placeholder="0"` so the field clears when the user deletes the value rather than showing a stuck zero.

### Components

| Component | Role |
|---|---|
| `StatsForm` | Form with per-field unit toggles (height and weight are independent) |
| `BodyFatSelector` | ACE category chart with sex-specific SVG figures + always-visible manual entry |
| `InfoTip` | Reusable ⓘ tooltip (click to open, click outside to close) |
| `ResultsCard` | Assembles all result sections |
| `MacroChart` | Recharts donut chart for macro breakdown |
| `CutProjection` | Cut stats, time-to-goal calculator |
| `IdealWeight` | BMI range bar, Devine/Robinson IBW, LBM-based goal weights |

## Deployment

Deployed via `vercel deploy --prod` (direct CLI upload, no git required).
Live at: `fitness.muizzbutt.com`
DNS: A record in Cloudflare pointing `fitness` to `76.76.21.21` (DNS only, not proxied).

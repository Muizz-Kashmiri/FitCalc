# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server at localhost:3000
npm run build     # Production build
npm run lint      # ESLint
npx tsc --noEmit  # Type check without building
```

## Architecture

Next.js 14 App Router, TypeScript, Tailwind CSS. Single-page client-side calculator — no backend, no database, no API routes.

### Data flow

1. `StatsForm` collects user input → calls `onCalculate(stats: UserStats)`
2. `app/page.tsx` calls `calculate(stats)` from `lib/utils.ts`
3. `calculate()` orchestrates the calculation pipeline and returns `CalculationResult`
4. `ResultsCard` + `CutProjection` + `MacroChart` render the result

### Calculation pipeline (`lib/calculations/`)

| File | Purpose |
|---|---|
| `bmr.ts` | Mifflin-St Jeor BMR (kcal/day at rest) |
| `tdee.ts` | BMR × activity multiplier → maintenance calories |
| `bodyFat.ts` | LBM/fat mass from body fat %; visual selector ranges |
| `macros.ts` | Protein from **LBM** (not total weight) × experience multiplier; fat floor; carbs fill remainder |
| `cut.ts` | Deficit → target calories (capped at safe minimum); weekly/monthly fat loss projections |

### Key design decisions

- **Protein is based on lean body mass**, not total weight — intentional and more accurate.
- All unit conversions (kg↔lbs, cm↔ft/in) happen in `lib/utils.ts`; internally all calculations use metric.
- Safe calorie floor: 1,500 kcal (men) / 1,200 kcal (women), enforced in `cut.ts`.

### Body fat selector (`components/BodyFatSelector.tsx`)

Two modes: visual grid (SVG silhouettes scaled by BF%) or manual number entry. Silhouettes are pure SVG — no images needed.

## Deployment

Deploy to Vercel. For subdomain (`fitness.yourdomain.com`): add a CNAME record pointing to `cname.vercel-dns.com`, then add the custom domain in the Vercel project settings.

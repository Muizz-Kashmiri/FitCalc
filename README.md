# FitCalc: Nutrition & Body Composition Calculator

A science-backed fitness calculator deployed at [fitness.muizzbutt.com](https://fitness.muizzbutt.com). Computes maintenance calories, lean body mass, precise macro targets, healthy goal weight ranges, and fat loss projections. All calculations are client-side with no backend.

---

## What It Calculates

### BMR (Basal Metabolic Rate)

Calories your body burns at complete rest. Uses the **Mifflin-St Jeor equation**, the most validated formula for general populations:

- **Men:** `BMR = 10 x weight(kg) + 6.25 x height(cm) - 5 x age + 5`
- **Women:** `BMR = 10 x weight(kg) + 6.25 x height(cm) - 5 x age - 161`

### TDEE (Maintenance Calories)

`TDEE = BMR x activity multiplier`

| Activity Level | Multiplier |
|---|---|
| Sedentary (desk job, no exercise) | 1.2 |
| Lightly active (1-3 days/week) | 1.375 |
| Moderately active (3-5 days/week) | 1.55 |
| Very active (6-7 days/week) | 1.725 |
| Extra active (physical job + daily training) | 1.9 |

### Body Composition

Users select from a visual ACE Fitness body fat category chart (sex-specific SVG figures at each level) or enter their body fat % manually.

- **Lean Body Mass (LBM)** = total weight x (1 - BF%)
- **Fat Mass** = total weight - LBM

### Protein Target (LBM-based)

Protein is calculated from **lean body mass**, not total weight. This avoids overestimating protein needs for people carrying more fat mass.

| Experience | Maintenance | Cut |
|---|---|---|
| Beginner (under 1 yr) | 1.6 g/kg LBM | 1.8 g/kg LBM |
| Intermediate (1-3 yrs) | 1.8 g/kg LBM | 2.0 g/kg LBM |
| Advanced (3+ yrs) | 2.0 g/kg LBM | 2.2 g/kg LBM |

### Fat and Carbs

- **Fat floor:** max(0.8 g/kg bodyweight, 20% of total calories) to maintain hormonal health
- **Carbs:** fill remaining calories after protein and fat are set

### Cut Calculator

Given a calorie deficit (250-750 kcal/day):

- `Weekly fat loss = (deficit x 7) / 7,700 kcal per kg fat`
- Safe minimums enforced: 1,500 kcal/day (men), 1,200 kcal/day (women)
- "Time to goal weight" calculator included
- Protein bumped up on a cut to preserve muscle

### Healthy Goal Weight

Three independent reference points shown together:

- **BMI healthy range** (WHO standard, 18.5-24.9): min/max weight for height with a visual bar showing where the user sits
- **Devine formula (1974):** most widely used IBW formula in clinical medicine
- **Robinson formula (1983):** highest clinical accuracy (under 1% error vs. population data)
- **LBM-based goal weights:** shows exactly what the user would weigh at Athletic / Fitness / Average body fat %, calculated from their actual lean mass

---

## UX Features

- Per-field unit switching: height (cm / ft+in) and weight (kg / lbs) each have their own inline toggle, completely independent
- ⓘ info tooltips on every technical term (BMR, TDEE, LBM, deficit, macros, etc.) with plain-language explanations, click to open
- No em dashes anywhere in the UI

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Charts | Recharts |
| Icons | Lucide React |
| Deploy | Vercel (fitness.muizzbutt.com) |

No backend. No database. No auth. All calculations run in the browser.

---

## Local Development

```bash
npm install
npm run dev          # http://localhost:3000
npx tsc --noEmit     # type check
npm run lint
npm run build        # production build
```

---

## Deploy

```bash
vercel deploy --prod
```

The project deploys via Vercel CLI (direct file upload, no Git push required). The custom subdomain `fitness.muizzbutt.com` is connected via an A record in Cloudflare pointing to `76.76.21.21`.

---

## Project Structure

```
fitness/
├── app/
│   ├── page.tsx                  # Main page, form/results state
│   ├── layout.tsx                # HTML shell, SEO metadata
│   └── globals.css
├── components/
│   ├── StatsForm.tsx             # Input form with per-field unit toggles
│   ├── BodyFatSelector.tsx       # ACE category chart with SVG figures + manual entry
│   ├── ResultsCard.tsx           # Results layout, all sections
│   ├── MacroChart.tsx            # Recharts donut chart
│   ├── CutProjection.tsx         # Cut stats, time-to-goal calculator
│   ├── IdealWeight.tsx           # Healthy goal weight (BMI, Devine, Robinson, LBM-based)
│   └── InfoTip.tsx               # Reusable ⓘ tooltip component
├── lib/
│   ├── types.ts                  # Shared TypeScript interfaces
│   ├── utils.ts                  # calculate() pipeline, unit conversions, cn()
│   └── calculations/
│       ├── bmr.ts                # Mifflin-St Jeor
│       ├── tdee.ts               # Activity multipliers
│       ├── bodyFat.ts            # LBM, BF% categories, ACE ranges
│       ├── macros.ts             # Protein/fat/carb allocation
│       ├── cut.ts                # Deficit to fat loss projection
│       └── idealWeight.ts        # Devine, Robinson, BMI range, LBM goal weights
└── vercel.json
```

---

## Scientific References

- **Mifflin-St Jeor (1990):** most accurate BMR equation for general populations
- **Devine formula (1974):** B.J. Devine, Drug Intelligence and Clinical Pharmacy
- **Robinson formula (1983):** J.D. Robinson et al., American Journal of Hospital Pharmacy
- **ACE body fat categories:** American Council on Exercise
- **BMI healthy range (18.5-24.9):** World Health Organisation (WHO)
- **Protein targets:** based on ranges from sports nutrition research (1.6-2.2 g/kg LBM)
- **Fat loss rate:** 1 kg body fat = approximately 7,700 kcal

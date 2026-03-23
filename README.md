# FitCalc — Nutrition & Body Composition Calculator

A clean, science-backed web calculator that computes your maintenance calories, lean body mass, and precise macro targets — using **lean body mass** for protein rather than total weight, which is more accurate for body composition goals.

---

## What It Calculates

### BMR (Basal Metabolic Rate)
Calories your body burns at complete rest. Calculated using the **Mifflin-St Jeor equation**, the most validated formula for general populations:

- **Men:** `BMR = 10 × weight(kg) + 6.25 × height(cm) − 5 × age + 5`
- **Women:** `BMR = 10 × weight(kg) + 6.25 × height(cm) − 5 × age − 161`

### TDEE (Total Daily Energy Expenditure / Maintenance Calories)
`TDEE = BMR × activity multiplier`

| Activity Level | Multiplier |
|---|---|
| Sedentary (desk job, no exercise) | 1.2 |
| Lightly active (1–3 days/week) | 1.375 |
| Moderately active (3–5 days/week) | 1.55 |
| Very active (6–7 days/week) | 1.725 |
| Extra active (physical job + daily training) | 1.9 |

### Body Composition
Users either select from a **visual body fat % chart** (with SVG silhouettes) or enter their body fat manually (from DEXA, calipers, smart scale).

- **Lean Body Mass (LBM)** = total weight × (1 − BF%)
- **Fat Mass** = total weight − LBM

### Protein Target (LBM-based)
Protein is calculated from **lean body mass**, not total weight. This avoids overfeeding protein relative to actual muscle mass.

| Experience | Maintenance | Cut |
|---|---|---|
| Beginner (< 1 yr) | 1.6 g/kg LBM | 1.8 g/kg LBM |
| Intermediate (1–3 yrs) | 1.8 g/kg LBM | 2.0 g/kg LBM |
| Advanced (3+ yrs) | 2.0 g/kg LBM | 2.2 g/kg LBM |

### Fat & Carbs
- **Fat floor:** max(0.8 g/kg bodyweight, 20% of total calories) — maintains hormonal health
- **Carbs:** fill remaining calories after protein and fat are allocated

### Cut Calculator
Given a calorie deficit (250–750 kcal/day):

- `Weekly fat loss = (deficit × 7) / 7,700 kcal per kg fat`
- Safe minimums enforced: **1,500 kcal/day** (men), **1,200 kcal/day** (women)
- "Time to goal weight" calculator included

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Charts | Recharts |
| Icons | Lucide React |
| Deploy | Vercel |

No backend. No database. All calculations are client-side.

---

## Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
# → http://localhost:3000

# Type check
npx tsc --noEmit

# Lint
npm run lint

# Production build
npm run build
```

---

## Project Structure

```
fitness/
├── app/
│   ├── page.tsx              # Main page — form ↔ results state
│   ├── layout.tsx            # HTML shell, SEO metadata, fonts
│   └── globals.css           # Tailwind base styles
├── components/
│   ├── StatsForm.tsx         # Input form (metric/imperial, all fields)
│   ├── BodyFatSelector.tsx   # Visual BF% chart or manual entry
│   ├── ResultsCard.tsx       # Main results layout
│   ├── MacroChart.tsx        # Recharts donut chart
│   └── CutProjection.tsx     # Cut stats + time-to-goal
├── lib/
│   ├── types.ts              # Shared TypeScript interfaces
│   ├── utils.ts              # calculate(), unit conversions, cn()
│   └── calculations/
│       ├── bmr.ts            # Mifflin-St Jeor
│       ├── tdee.ts           # Activity multipliers
│       ├── bodyFat.ts        # LBM, BF% categories, visual ranges
│       ├── macros.ts         # Protein/fat/carb allocation
│       └── cut.ts            # Deficit → fat loss projection
└── vercel.json               # Vercel deploy config
```

---

## Deploying to a Subdomain

### Step 1 — Deploy to Vercel

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project** → import the repo
3. Framework preset: **Next.js** (auto-detected)
4. Click **Deploy**

### Step 2 — Add your subdomain

1. In Vercel: **Project Settings → Domains → Add Domain**
2. Enter your subdomain, e.g. `fit.yourdomain.com`

### Step 3 — DNS configuration

In your domain registrar's DNS settings, add a **CNAME record**:

| Type | Name | Value |
|---|---|---|
| CNAME | `fit` | `cname.vercel-dns.com` |

DNS propagation takes 1–24 hours. Vercel auto-provisions an SSL certificate.

---

## Key Design Decisions

**Why LBM-based protein?**
Using total bodyweight overestimates protein needs for people carrying more fat mass. Since only lean tissue (muscle, organs) requires protein for repair and growth, basing targets on LBM gives a more accurate and personalized recommendation.

**Why Mifflin-St Jeor?**
It's the most widely validated equation for sedentary to moderately active adults. The Harris-Benedict equation is older and tends to over-estimate in modern populations.

**Why no backend?**
The calculator is entirely stateless — results can be bookmarked or shared just by re-entering stats. No user data is stored or transmitted.

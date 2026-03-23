import { Sex } from "../types";

// Devine formula (1974) — most widely used in clinical medicine
// Originally developed for drug dosing; height must be > 60 inches (152cm)
export function devineIBW(heightCm: number, sex: Sex): number {
  const heightInches = heightCm / 2.54;
  const inchesOver5ft = Math.max(0, heightInches - 60);
  const base = sex === "male" ? 50 : 45.5;
  return Math.round((base + 2.3 * inchesOver5ft) * 10) / 10;
}

// Robinson formula (1983) — highest clinical accuracy (0.4–0.7% error)
// Derived from Metropolitan Life Insurance data
export function robinsonIBW(heightCm: number, sex: Sex): number {
  const heightInches = heightCm / 2.54;
  const inchesOver5ft = Math.max(0, heightInches - 60);
  if (sex === "male") {
    return Math.round((51.65 + 1.85 * inchesOver5ft) * 10) / 10;
  }
  return Math.round((48.67 + 1.65 * inchesOver5ft) * 10) / 10;
}

// BMI-based healthy weight range (WHO standard: BMI 18.5–24.9)
export function bmiWeightRange(heightCm: number): { min: number; max: number } {
  const heightM = heightCm / 100;
  return {
    min: Math.round(18.5 * heightM * heightM * 10) / 10,
    max: Math.round(24.9 * heightM * heightM * 10) / 10,
  };
}

// LBM-based goal weight: given actual lean mass, what would user weigh at target BF%?
// Formula: goal weight = LBM / (1 - targetBF / 100)
export function goalWeightAtBF(leanMassKg: number, targetBFPct: number): number {
  return Math.round((leanMassKg / (1 - targetBFPct / 100)) * 10) / 10;
}

// Healthy BF% targets by sex (ACE Fitness standard)
export const HEALTHY_BF_TARGETS: Record<Sex, { label: string; pct: number }[]> = {
  male: [
    { label: "Athletic", pct: 10 },
    { label: "Fitness", pct: 15 },
    { label: "Average", pct: 20 },
  ],
  female: [
    { label: "Athletic", pct: 18 },
    { label: "Fitness", pct: 22 },
    { label: "Average", pct: 28 },
  ],
};

export interface IdealWeightResult {
  devineKg: number;
  robinsonKg: number;
  bmiRange: { min: number; max: number };
  lbmGoals: { label: string; pct: number; weightKg: number }[];
  currentBFPct: number;
  currentWeightKg: number;
}

export function calculateIdealWeight(
  heightCm: number,
  weightKg: number,
  leanMassKg: number,
  bodyFatPct: number,
  sex: Sex
): IdealWeightResult {
  return {
    devineKg: devineIBW(heightCm, sex),
    robinsonKg: robinsonIBW(heightCm, sex),
    bmiRange: bmiWeightRange(heightCm),
    lbmGoals: HEALTHY_BF_TARGETS[sex].map(({ label, pct }) => ({
      label,
      pct,
      weightKg: goalWeightAtBF(leanMassKg, pct),
    })),
    currentBFPct: bodyFatPct,
    currentWeightKg: weightKg,
  };
}

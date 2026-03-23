import { Sex, BodyComposition } from "../types";

export function calculateBodyComposition(
  weightKg: number,
  bodyFatPct: number,
  sex: Sex
): BodyComposition {
  const fatMassKg = weightKg * (bodyFatPct / 100);
  const leanMassKg = weightKg - fatMassKg;

  return {
    bodyFatPct,
    leanMassKg: Math.round(leanMassKg * 10) / 10,
    fatMassKg: Math.round(fatMassKg * 10) / 10,
    category: getBFCategory(sex, bodyFatPct),
  };
}

export function getBFCategory(sex: Sex, pct: number): string {
  if (sex === "male") {
    if (pct < 6) return "Essential Fat";
    if (pct < 14) return "Athletic";
    if (pct < 18) return "Fitness";
    if (pct < 25) return "Average";
    return "Obese";
  } else {
    if (pct < 14) return "Essential Fat";
    if (pct < 21) return "Athletic";
    if (pct < 25) return "Fitness";
    if (pct < 32) return "Average";
    return "Obese";
  }
}

// Reference ranges for the visual selector grid
export const MALE_BF_RANGES = [
  { label: "~8%", value: 8, description: "Very lean, visible abs" },
  { label: "10–12%", value: 11, description: "Lean, ab definition" },
  { label: "15%", value: 15, description: "Fit, some ab visibility" },
  { label: "20%", value: 20, description: "Average, soft midsection" },
  { label: "25%", value: 25, description: "Noticeable fat, no definition" },
  { label: "30%+", value: 31, description: "High body fat" },
];

export const FEMALE_BF_RANGES = [
  { label: "~18%", value: 18, description: "Very lean, athletic look" },
  { label: "20–22%", value: 21, description: "Fit, toned appearance" },
  { label: "25%", value: 25, description: "Healthy, athletic build" },
  { label: "30%", value: 30, description: "Average, softer look" },
  { label: "35%", value: 35, description: "Noticeable fat" },
  { label: "40%+", value: 41, description: "High body fat" },
];

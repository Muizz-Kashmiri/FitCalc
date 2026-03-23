import { TrainingExperience, MacroResult } from "../types";

// Protein multipliers per kg of LEAN BODY MASS
const PROTEIN_MULTIPLIER: Record<TrainingExperience, number> = {
  beginner: 1.6,      // 1.5–1.6 g/kg LBM
  intermediate: 1.8,  // 1.7–1.9 g/kg LBM
  advanced: 2.0,      // 2.0–2.2 g/kg LBM
};

// On a cut, bump protein to preserve muscle
const CUT_PROTEIN_MULTIPLIER: Record<TrainingExperience, number> = {
  beginner: 1.8,
  intermediate: 2.0,
  advanced: 2.2,
};

const KCAL_PER_G_PROTEIN = 4;
const KCAL_PER_G_CARB = 4;
const KCAL_PER_G_FAT = 9;

// Minimum fat: 0.8 g/kg total bodyweight for hormonal health
export function calculateMacros(
  totalCalories: number,
  leanMassKg: number,
  weightKg: number,
  experience: TrainingExperience,
  isCut = false
): MacroResult {
  const multiplier = isCut
    ? CUT_PROTEIN_MULTIPLIER[experience]
    : PROTEIN_MULTIPLIER[experience];

  const proteinG = Math.round(leanMassKg * multiplier);
  const proteinKcal = proteinG * KCAL_PER_G_PROTEIN;

  // Fat floor: 0.8 g/kg bodyweight, minimum 20% of calories
  const fatFloorG = Math.max(
    Math.round(weightKg * 0.8),
    Math.round((totalCalories * 0.2) / KCAL_PER_G_FAT)
  );
  const fatKcal = fatFloorG * KCAL_PER_G_FAT;

  const remainingKcal = totalCalories - proteinKcal - fatKcal;
  const carbG = Math.max(0, Math.round(remainingKcal / KCAL_PER_G_CARB));
  const carbKcal = carbG * KCAL_PER_G_CARB;

  // Recalculate fat with remaining after protein and carbs are set
  const actualFatKcal = totalCalories - proteinKcal - carbKcal;
  const actualFatG = Math.max(fatFloorG, Math.round(actualFatKcal / KCAL_PER_G_FAT));

  return {
    calories: totalCalories,
    proteinG,
    fatG: actualFatG,
    carbG,
    proteinKcal,
    fatKcal: actualFatG * KCAL_PER_G_FAT,
    carbKcal,
  };
}

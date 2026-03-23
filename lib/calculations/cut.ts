import { TrainingExperience, CutProjection, Sex } from "../types";
import { calculateMacros } from "./macros";

const KCAL_PER_KG_FAT = 7700;
const MIN_CALORIES_MALE = 1500;
const MIN_CALORIES_FEMALE = 1200;

export function calculateCut(
  tdee: number,
  deficitKcal: number,
  leanMassKg: number,
  weightKg: number,
  experience: TrainingExperience,
  sex: Sex
): CutProjection {
  const minCalories = sex === "male" ? MIN_CALORIES_MALE : MIN_CALORIES_FEMALE;
  const rawTarget = tdee - deficitKcal;
  const targetCalories = Math.max(rawTarget, minCalories);
  const actualDeficit = tdee - targetCalories;

  const weeklyLossKg = Math.round((actualDeficit * 7) / KCAL_PER_KG_FAT * 100) / 100;
  const monthlyLossKg = Math.round(weeklyLossKg * 4.33 * 100) / 100;

  const macros = calculateMacros(targetCalories, leanMassKg, weightKg, experience, true);

  return {
    targetCalories,
    deficitKcal: actualDeficit,
    weeklyLossKg,
    monthlyLossKg,
    macros,
  };
}

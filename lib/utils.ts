import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { UserStats, CalculationResult } from "./types";
import { calculateBMR } from "./calculations/bmr";
import { calculateTDEE } from "./calculations/tdee";
import { calculateBodyComposition } from "./calculations/bodyFat";
import { calculateMacros } from "./calculations/macros";
import { calculateCut } from "./calculations/cut";
import { calculateIdealWeight } from "./calculations/idealWeight";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculate(stats: UserStats): CalculationResult {
  const bmr = calculateBMR(stats.weightKg, stats.heightCm, stats.age, stats.sex);
  const tdee = calculateTDEE(bmr, stats.activityLevel);
  const bodyComposition = calculateBodyComposition(
    stats.weightKg,
    stats.bodyFatPct,
    stats.sex
  );
  const maintenanceMacros = calculateMacros(
    tdee,
    bodyComposition.leanMassKg,
    stats.weightKg,
    stats.experience,
    false
  );
  const cutProjection =
    stats.goal === "cut"
      ? calculateCut(
          tdee,
          stats.deficitKcal,
          bodyComposition.leanMassKg,
          stats.weightKg,
          stats.experience,
          stats.sex
        )
      : null;

  const idealWeight = calculateIdealWeight(
    stats.heightCm,
    stats.weightKg,
    bodyComposition.leanMassKg,
    stats.bodyFatPct,
    stats.sex
  );

  return { bmr, tdee, bodyComposition, maintenanceMacros, cutProjection, idealWeight };
}

export function kgToLbs(kg: number) {
  return Math.round(kg * 2.205 * 10) / 10;
}

export function lbsToKg(lbs: number) {
  return Math.round((lbs / 2.205) * 10) / 10;
}

export function cmToFtIn(cm: number): { ft: number; inches: number } {
  const totalInches = cm / 2.54;
  const ft = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return { ft, inches };
}

export function ftInToCm(ft: number, inches: number): number {
  return Math.round((ft * 12 + inches) * 2.54);
}

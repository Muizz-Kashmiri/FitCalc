import { Sex } from "../types";

/**
 * Mifflin-St Jeor equation, the most validated formula for general populations.
 * Returns BMR in kcal/day.
 */
export function calculateBMR(
  weightKg: number,
  heightCm: number,
  age: number,
  sex: Sex
): number {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return sex === "male" ? base + 5 : base - 161;
}

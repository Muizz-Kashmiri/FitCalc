import { ActivityLevel } from "../types";

const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,        // desk job, no exercise
  lightly_active: 1.375, // light exercise 1–3 days/week
  moderately_active: 1.55, // moderate exercise 3–5 days/week
  very_active: 1.725,    // hard exercise 6–7 days/week
  extra_active: 1.9,     // physical job + hard daily exercise
};

export const ACTIVITY_LABELS: Record<ActivityLevel, string> = {
  sedentary: "Sedentary (desk job, little/no exercise)",
  lightly_active: "Lightly Active (light exercise 1–3 days/week)",
  moderately_active: "Moderately Active (exercise 3–5 days/week)",
  very_active: "Very Active (hard exercise 6–7 days/week)",
  extra_active: "Extra Active (physical job + daily training)",
};

export function calculateTDEE(bmr: number, activityLevel: ActivityLevel): number {
  return Math.round(bmr * ACTIVITY_MULTIPLIERS[activityLevel]);
}

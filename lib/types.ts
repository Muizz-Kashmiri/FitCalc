export type Sex = "male" | "female";
export type ActivityLevel =
  | "sedentary"
  | "lightly_active"
  | "moderately_active"
  | "very_active"
  | "extra_active";
export type TrainingExperience = "beginner" | "intermediate" | "advanced";
export type Goal = "maintain" | "cut";
export type BFInputMethod = "visual" | "manual";

export interface UserStats {
  sex: Sex;
  age: number;
  heightCm: number;
  weightKg: number;
  activityLevel: ActivityLevel;
  experience: TrainingExperience;
  bodyFatPct: number;
  goal: Goal;
  deficitKcal: number; // only used when goal = "cut"
}

export interface BodyComposition {
  bodyFatPct: number;
  leanMassKg: number;
  fatMassKg: number;
  category: string;
}

export interface MacroResult {
  calories: number;
  proteinG: number;
  fatG: number;
  carbG: number;
  proteinKcal: number;
  fatKcal: number;
  carbKcal: number;
}

export interface CutProjection {
  targetCalories: number;
  deficitKcal: number;
  weeklyLossKg: number;
  monthlyLossKg: number;
  macros: MacroResult;
}

export interface CalculationResult {
  bmr: number;
  tdee: number;
  bodyComposition: BodyComposition;
  maintenanceMacros: MacroResult;
  cutProjection: CutProjection | null;
  idealWeight: import("./calculations/idealWeight").IdealWeightResult;
}

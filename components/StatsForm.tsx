"use client";

import { useState } from "react";
import { UserStats, Sex, Unit, ActivityLevel, TrainingExperience, Goal } from "@/lib/types";
import { ACTIVITY_LABELS } from "@/lib/calculations/tdee";
import BodyFatSelector from "./BodyFatSelector";
import { cn, kgToLbs, lbsToKg, cmToFtIn, ftInToCm } from "@/lib/utils";
import { Calculator } from "lucide-react";

interface Props {
  onCalculate: (stats: UserStats) => void;
}

const DEFAULT_STATS: UserStats = {
  sex: "male",
  age: 25,
  heightCm: 175,
  weightKg: 80,
  activityLevel: "moderately_active",
  experience: "intermediate",
  bodyFatPct: 20,
  goal: "cut",
  deficitKcal: 500,
};

export default function StatsForm({ onCalculate }: Props) {
  const [stats, setStats] = useState<UserStats>(DEFAULT_STATS);
  const [unit, setUnit] = useState<Unit>("metric");
  const [heightFt, setHeightFt] = useState(5);
  const [heightIn, setHeightIn] = useState(9);
  const [weightLbs, setWeightLbs] = useState(176);
  const [errors, setErrors] = useState<Partial<Record<keyof UserStats, string>>>({});

  const set = <K extends keyof UserStats>(key: K, value: UserStats[K]) => {
    setStats((prev) => ({ ...prev, [key]: value }));
  };

  const handleUnitToggle = (newUnit: Unit) => {
    setUnit(newUnit);
    if (newUnit === "imperial") {
      const { ft, inches } = cmToFtIn(stats.heightCm);
      setHeightFt(ft);
      setHeightIn(inches);
      setWeightLbs(kgToLbs(stats.weightKg));
    } else {
      set("heightCm", ftInToCm(heightFt, heightIn));
      set("weightKg", lbsToKg(weightLbs));
    }
  };

  const validate = (): boolean => {
    const errs: typeof errors = {};
    if (stats.age < 10 || stats.age > 100) errs.age = "Enter an age between 10–100";
    if (stats.heightCm < 100 || stats.heightCm > 250) errs.heightCm = "Height seems off";
    if (stats.weightKg < 30 || stats.weightKg > 300) errs.weightKg = "Weight seems off";
    if (stats.bodyFatPct < 4 || stats.bodyFatPct > 60) errs.bodyFatPct = "Body fat must be 4–60%";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    let finalStats = { ...stats };
    if (unit === "imperial") {
      finalStats = {
        ...finalStats,
        heightCm: ftInToCm(heightFt, heightIn),
        weightKg: lbsToKg(weightLbs),
      };
    }
    onCalculate(finalStats);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Unit toggle */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Your Stats</h2>
        <div className="flex rounded-lg overflow-hidden border border-zinc-700">
          {(["metric", "imperial"] as Unit[]).map((u) => (
            <button
              key={u}
              type="button"
              onClick={() => handleUnitToggle(u)}
              className={cn(
                "px-3 py-1.5 text-xs font-medium capitalize transition-colors",
                unit === u
                  ? "bg-emerald-500 text-white"
                  : "bg-zinc-800 text-zinc-400 hover:text-white"
              )}
            >
              {u === "metric" ? "Metric (kg/cm)" : "Imperial (lbs/ft)"}
            </button>
          ))}
        </div>
      </div>

      {/* Sex */}
      <Field label="Sex">
        <div className="flex gap-3">
          {(["male", "female"] as Sex[]).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => set("sex", s)}
              className={cn(
                "flex-1 py-2.5 rounded-xl border text-sm font-medium capitalize transition-all",
                stats.sex === s
                  ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                  : "border-zinc-700 bg-zinc-800/50 text-zinc-400 hover:border-zinc-500"
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </Field>

      {/* Age */}
      <Field label="Age" error={errors.age}>
        <NumberInput
          value={stats.age}
          onChange={(v) => set("age", v)}
          min={10}
          max={100}
          unit="years"
        />
      </Field>

      {/* Height */}
      <Field label="Height" error={errors.heightCm}>
        {unit === "metric" ? (
          <NumberInput
            value={stats.heightCm}
            onChange={(v) => set("heightCm", v)}
            min={100}
            max={250}
            unit="cm"
          />
        ) : (
          <div className="flex items-center gap-2">
            <NumberInput value={heightFt} onChange={setHeightFt} min={3} max={8} unit="ft" />
            <NumberInput value={heightIn} onChange={setHeightIn} min={0} max={11} unit="in" />
          </div>
        )}
      </Field>

      {/* Weight */}
      <Field label="Weight" error={errors.weightKg}>
        {unit === "metric" ? (
          <NumberInput
            value={stats.weightKg}
            onChange={(v) => set("weightKg", v)}
            min={30}
            max={300}
            step={0.5}
            unit="kg"
          />
        ) : (
          <NumberInput
            value={weightLbs}
            onChange={setWeightLbs}
            min={66}
            max={661}
            step={1}
            unit="lbs"
          />
        )}
      </Field>

      {/* Activity Level */}
      <Field label="Activity Level">
        <select
          value={stats.activityLevel}
          onChange={(e) => set("activityLevel", e.target.value as ActivityLevel)}
          className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500"
        >
          {(Object.entries(ACTIVITY_LABELS) as [ActivityLevel, string][]).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </Field>

      {/* Training Experience */}
      <Field label="Training Experience">
        <div className="flex gap-3">
          {(["beginner", "intermediate", "advanced"] as TrainingExperience[]).map((exp) => (
            <button
              key={exp}
              type="button"
              onClick={() => set("experience", exp)}
              className={cn(
                "flex-1 py-2.5 rounded-xl border text-sm font-medium capitalize transition-all",
                stats.experience === exp
                  ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                  : "border-zinc-700 bg-zinc-800/50 text-zinc-400 hover:border-zinc-500"
              )}
            >
              {exp}
            </button>
          ))}
        </div>
        <ExperienceHint experience={stats.experience} />
      </Field>

      {/* Body Fat */}
      <Field label="Body Fat %" error={errors.bodyFatPct}>
        <BodyFatSelector
          sex={stats.sex}
          value={stats.bodyFatPct}
          onChange={(pct) => set("bodyFatPct", pct)}
        />
      </Field>

      {/* Goal */}
      <Field label="Goal">
        <div className="flex gap-3">
          {(["maintain", "cut"] as Goal[]).map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => set("goal", g)}
              className={cn(
                "flex-1 py-2.5 rounded-xl border text-sm font-medium capitalize transition-all",
                stats.goal === g
                  ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                  : "border-zinc-700 bg-zinc-800/50 text-zinc-400 hover:border-zinc-500"
              )}
            >
              {g === "maintain" ? "Maintain Weight" : "Cut (Lose Fat)"}
            </button>
          ))}
        </div>
      </Field>

      {/* Deficit slider — only shown when cutting */}
      {stats.goal === "cut" && (
        <Field label={`Calorie Deficit: ${stats.deficitKcal} kcal/day`}>
          <input
            type="range"
            min={250}
            max={750}
            step={50}
            value={stats.deficitKcal}
            onChange={(e) => set("deficitKcal", parseInt(e.target.value))}
            className="w-full accent-emerald-500"
          />
          <div className="flex justify-between text-xs text-zinc-500 mt-1">
            <span>250 (gentle)</span>
            <span>500 (moderate)</span>
            <span>750 (aggressive)</span>
          </div>
          <p className="text-xs text-zinc-400 mt-2">
            ~{((stats.deficitKcal * 7) / 7700).toFixed(2)} kg fat loss per week
          </p>
        </Field>
      )}

      {/* Submit */}
      <button
        type="submit"
        className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold py-3.5 rounded-2xl transition-colors text-base"
      >
        <Calculator className="w-5 h-5" />
        Calculate My Numbers
      </button>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-zinc-300">{label}</label>
      {children}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

function NumberInput({
  value,
  onChange,
  min,
  max,
  step = 1,
  unit,
}: {
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
  unit: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        min={min}
        max={max}
        step={step}
        className="w-28 bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500"
      />
      <span className="text-sm text-zinc-400">{unit}</span>
    </div>
  );
}

function ExperienceHint({ experience }: { experience: TrainingExperience }) {
  const hints: Record<TrainingExperience, string> = {
    beginner: "< 1 year consistent training",
    intermediate: "1–3 years consistent training",
    advanced: "3+ years consistent training",
  };
  return <p className="text-xs text-zinc-500 mt-1">{hints[experience]}</p>;
}

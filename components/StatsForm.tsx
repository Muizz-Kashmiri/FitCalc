"use client";

import { useState } from "react";
import { UserStats, Sex, ActivityLevel, TrainingExperience, Goal } from "@/lib/types";
import { ACTIVITY_LABELS } from "@/lib/calculations/tdee";
import BodyFatSelector from "./BodyFatSelector";
import { cn, kgToLbs, lbsToKg, cmToFtIn, ftInToCm } from "@/lib/utils";
import { Calculator } from "lucide-react";
import InfoTip from "./InfoTip";

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
  const [heightUnit, setHeightUnit] = useState<"cm" | "ft">("cm");
  const [weightUnit, setWeightUnit] = useState<"kg" | "lbs">("kg");
  const [heightFt, setHeightFt] = useState(5);
  const [heightIn, setHeightIn] = useState(9);
  const [weightLbs, setWeightLbs] = useState(176);
  const [errors, setErrors] = useState<Partial<Record<keyof UserStats, string>>>({});

  const set = <K extends keyof UserStats>(key: K, value: UserStats[K]) =>
    setStats((prev) => ({ ...prev, [key]: value }));

  const handleHeightUnitSwitch = (u: "cm" | "ft") => {
    if (u === "ft" && heightUnit === "cm") {
      const { ft, inches } = cmToFtIn(stats.heightCm);
      setHeightFt(ft);
      setHeightIn(inches);
    }
    if (u === "cm" && heightUnit === "ft") {
      set("heightCm", ftInToCm(heightFt, heightIn));
    }
    setHeightUnit(u);
  };

  const handleWeightUnitSwitch = (u: "kg" | "lbs") => {
    if (u === "lbs" && weightUnit === "kg") setWeightLbs(kgToLbs(stats.weightKg));
    if (u === "kg" && weightUnit === "lbs") set("weightKg", lbsToKg(weightLbs));
    setWeightUnit(u);
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
    // Sync imperial display values back to metric before validating
    const finalStats = {
      ...stats,
      heightCm: heightUnit === "ft" ? ftInToCm(heightFt, heightIn) : stats.heightCm,
      weightKg: weightUnit === "lbs" ? lbsToKg(weightLbs) : stats.weightKg,
    };
    setStats(finalStats);
    const errs: typeof errors = {};
    if (finalStats.age < 10 || finalStats.age > 100) errs.age = "Enter an age between 10–100";
    if (finalStats.heightCm < 100 || finalStats.heightCm > 250) errs.heightCm = "Height seems off";
    if (finalStats.weightKg < 30 || finalStats.weightKg > 300) errs.weightKg = "Weight seems off";
    if (finalStats.bodyFatPct < 4 || finalStats.bodyFatPct > 60) errs.bodyFatPct = "Body fat must be 4–60%";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    onCalculate(finalStats);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-7">
      <h2 className="text-lg font-semibold text-white">Your Stats</h2>

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
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={stats.age || ""}
            placeholder="0"
            onChange={(e) => set("age", parseFloat(e.target.value) || 0)}
            min={10}
            max={100}
            className="w-24 bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500"
          />
          <span className="text-sm text-zinc-400">years</span>
        </div>
      </Field>

      {/* Height */}
      <Field label="Height" error={errors.heightCm}>
        <div className="flex items-center gap-3 flex-wrap">
          {heightUnit === "cm" ? (
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={stats.heightCm || ""}
                placeholder="0"
                onChange={(e) => set("heightCm", parseFloat(e.target.value) || 0)}
                min={100}
                max={250}
                className="w-24 bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500"
              />
              <span className="text-sm text-zinc-400">cm</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={heightFt || ""}
                placeholder="0"
                onChange={(e) => setHeightFt(parseFloat(e.target.value) || 0)}
                min={3}
                max={8}
                className="w-16 bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500"
              />
              <span className="text-sm text-zinc-400">ft</span>
              <input
                type="number"
                value={heightIn || ""}
                placeholder="0"
                onChange={(e) => setHeightIn(parseFloat(e.target.value) || 0)}
                min={0}
                max={11}
                className="w-16 bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500"
              />
              <span className="text-sm text-zinc-400">in</span>
            </div>
          )}
          <UnitToggle
            options={["cm", "ft"]}
            value={heightUnit}
            onChange={(v) => handleHeightUnitSwitch(v as "cm" | "ft")}
          />
        </div>
      </Field>

      {/* Weight */}
      <Field label="Weight" error={errors.weightKg}>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={(weightUnit === "kg" ? stats.weightKg : weightLbs) || ""}
              placeholder="0"
              onChange={(e) => {
                const v = parseFloat(e.target.value) || 0;
                if (weightUnit === "kg") set("weightKg", v);
                else setWeightLbs(v);
              }}
              min={weightUnit === "kg" ? 30 : 66}
              max={weightUnit === "kg" ? 300 : 661}
              step={weightUnit === "kg" ? 0.5 : 1}
              className="w-24 bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500"
            />
            <span className="text-sm text-zinc-400">{weightUnit}</span>
          </div>
          <UnitToggle
            options={["kg", "lbs"]}
            value={weightUnit}
            onChange={(v) => handleWeightUnitSwitch(v as "kg" | "lbs")}
          />
        </div>
      </Field>

      {/* Activity Level */}
      <Field label="Activity Level" tip="How active you are on a typical day outside of the gym. Be honest here; overestimating is the most common reason people stall on a diet.">
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
      <Field label="Training Experience" tip="How long you have been training consistently. More experienced lifters need slightly more protein to maintain muscle because their bodies are more efficient at using it.">
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
        <p className="text-xs text-zinc-500 mt-1">
          {stats.experience === "beginner" && "< 1 year consistent training"}
          {stats.experience === "intermediate" && "1–3 years consistent training"}
          {stats.experience === "advanced" && "3+ years consistent training"}
        </p>
      </Field>

      {/* Body Fat */}
      <Field label="Body Fat %" error={errors.bodyFatPct} tip="The percentage of your body weight that is fat. We use this to find your lean mass, which gives a more accurate protein target than using your total weight.">
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
                "flex-1 py-2.5 rounded-xl border text-sm font-medium transition-all",
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

      {/* Deficit slider */}
      {stats.goal === "cut" && (
        <Field label={`Calorie Deficit: ${stats.deficitKcal} kcal/day`} tip="How many fewer calories you eat compared to what you burn each day. A 500 kcal deficit is a good starting point. Going too aggressive leads to muscle loss and burnout.">
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
  tip,
  children,
}: {
  label: string;
  error?: string;
  tip?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5">
        <label className="text-sm font-medium text-zinc-300">{label}</label>
        {tip && <InfoTip text={tip} />}
      </div>
      {children}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

function UnitToggle({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex rounded-lg overflow-hidden border border-zinc-700">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={cn(
            "px-3 py-1.5 text-xs font-medium transition-colors",
            value === opt
              ? "bg-emerald-500 text-white"
              : "bg-zinc-800 text-zinc-400 hover:text-white"
          )}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

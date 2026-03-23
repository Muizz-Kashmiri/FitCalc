"use client";

import { IdealWeightResult } from "@/lib/calculations/idealWeight";
import InfoTip from "./InfoTip";
import { cn } from "@/lib/utils";
import { Scale } from "lucide-react";

interface Props {
  data: IdealWeightResult;
}

export default function IdealWeight({ data }: Props) {
  const { devineKg, robinsonKg, bmiRange, lbmGoals, currentBFPct, currentWeightKg } = data;

  const isInBMIRange =
    currentWeightKg >= bmiRange.min && currentWeightKg <= bmiRange.max;
  const isAboveBMI = currentWeightKg > bmiRange.max;

  return (
    <div className="space-y-5">

      {/* Current status */}
      <div className={cn(
        "flex items-center justify-between rounded-xl px-4 py-3 border",
        isInBMIRange
          ? "bg-emerald-500/10 border-emerald-500/30"
          : isAboveBMI
          ? "bg-orange-500/10 border-orange-500/30"
          : "bg-blue-500/10 border-blue-500/30"
      )}>
        <div className="flex items-center gap-2">
          <Scale className={cn("w-4 h-4", isInBMIRange ? "text-emerald-400" : isAboveBMI ? "text-orange-400" : "text-blue-400")} />
          <span className="text-sm text-zinc-300">Your current weight: <span className="font-semibold text-white">{currentWeightKg} kg</span></span>
        </div>
        <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full", isInBMIRange ? "bg-emerald-500/20 text-emerald-300" : isAboveBMI ? "bg-orange-500/20 text-orange-300" : "bg-blue-500/20 text-blue-300")}>
          {isInBMIRange ? "In healthy range" : isAboveBMI ? "Above healthy range" : "Below healthy range"}
        </span>
      </div>

      {/* BMI healthy range */}
      <div>
        <div className="flex items-center gap-1.5 mb-3">
          <h4 className="text-sm font-medium text-zinc-300">Healthy Weight Range</h4>
          <InfoTip text="Based on a healthy BMI of 18.5 to 24.9, as defined by the World Health Organisation (WHO). BMI is a general guideline and does not account for muscle mass." />
        </div>
        <div className="bg-zinc-800/60 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-zinc-500">BMI 18.5 (minimum)</span>
            <span className="text-xs text-zinc-500">BMI 24.9 (maximum)</span>
          </div>
          {/* Range bar */}
          <div className="relative h-3 bg-zinc-700 rounded-full mb-3">
            <div className="absolute inset-y-0 left-[20%] right-[20%] bg-emerald-500/40 rounded-full" />
            {/* Current weight marker */}
            <CurrentWeightMarker
              current={currentWeightKg}
              min={bmiRange.min}
              max={bmiRange.max}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-emerald-400">{bmiRange.min} kg</span>
            <span className="text-xs text-zinc-500">to</span>
            <span className="text-lg font-bold text-emerald-400">{bmiRange.max} kg</span>
          </div>
        </div>
      </div>

      {/* Clinical reference formulas */}
      <div>
        <div className="flex items-center gap-1.5 mb-3">
          <h4 className="text-sm font-medium text-zinc-300">Clinical Reference (IBW)</h4>
          <InfoTip text="Ideal Body Weight (IBW) formulas are used in clinical medicine for drug dosing and health assessments. They give a single target number rather than a range. Two of the most trusted formulas are shown here." />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <FormulaCard
            name="Devine Formula"
            year="1974"
            weightKg={devineKg}
            note="Most used in clinical medicine"
            tip="Developed by B.J. Devine in 1974. The most widely used IBW formula worldwide, originally created for calculating drug doses in patients."
          />
          <FormulaCard
            name="Robinson Formula"
            year="1983"
            weightKg={robinsonKg}
            note="Highest clinical accuracy"
            tip="Published in the American Journal of Hospital Pharmacy in 1983. Considered the most accurate IBW formula with less than 1% error vs. real population data."
          />
        </div>
      </div>

      {/* LBM-based goal weights */}
      <div>
        <div className="flex items-center gap-1.5 mb-3">
          <h4 className="text-sm font-medium text-zinc-300">Goal Weight by Body Fat %</h4>
          <InfoTip text="These numbers are calculated from your actual lean body mass. They show what you would weigh if you kept all your current muscle and reduced your fat to each target level. More personalised than any formula." />
        </div>
        <div className="space-y-2">
          {lbmGoals.map(({ label, pct, weightKg }) => {
            const isCurrent = Math.abs(pct - currentBFPct) < 2;
            const isGoal = pct < currentBFPct;
            return (
              <div
                key={label}
                className={cn(
                  "flex items-center justify-between rounded-xl px-4 py-3 border",
                  isCurrent
                    ? "border-zinc-600 bg-zinc-800"
                    : isGoal
                    ? "border-zinc-700 bg-zinc-800/40"
                    : "border-zinc-800 bg-zinc-800/20"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-2 h-2 rounded-full flex-shrink-0",
                    label === "Athletic" ? "bg-emerald-400" :
                    label === "Fitness" ? "bg-green-400" : "bg-yellow-400"
                  )} />
                  <div>
                    <span className="text-sm font-medium text-white">{label}</span>
                    <span className="text-xs text-zinc-500 ml-2">{pct}% body fat</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-base font-bold text-white">{weightKg} kg</span>
                  {isGoal && (
                    <div className="text-xs text-emerald-400 mt-0.5">
                      -{Math.round((currentWeightKg - weightKg) * 10) / 10} kg to lose
                    </div>
                  )}
                  {isCurrent && (
                    <div className="text-xs text-zinc-400 mt-0.5">near current</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-zinc-500 mt-2">
          Calculated from your lean mass of {data.lbmGoals[0] ? Math.round(data.currentWeightKg * (1 - data.currentBFPct / 100) * 10) / 10 : "?"} kg. Assumes no muscle loss.
        </p>
      </div>

    </div>
  );
}

function FormulaCard({
  name,
  year,
  weightKg,
  note,
  tip,
}: {
  name: string;
  year: string;
  weightKg: number;
  note: string;
  tip: string;
}) {
  return (
    <div className="bg-zinc-800/60 rounded-xl p-4">
      <div className="flex items-start justify-between mb-1">
        <span className="text-xs text-zinc-400 font-medium">{name}</span>
        <InfoTip text={tip} />
      </div>
      <div className="text-xs text-zinc-600 mb-2">{year}</div>
      <div className="text-2xl font-bold text-white">{weightKg} <span className="text-sm font-normal text-zinc-400">kg</span></div>
      <div className="text-xs text-zinc-500 mt-1">{note}</div>
    </div>
  );
}

function CurrentWeightMarker({
  current,
  min,
  max,
}: {
  current: number;
  min: number;
  max: number;
}) {
  // Position the marker on the bar. The bar shows min-20% to max+20% of the range
  const rangePadding = (max - min) * 0.25;
  const barMin = min - rangePadding;
  const barMax = max + rangePadding;
  const pct = Math.max(2, Math.min(98, ((current - barMin) / (barMax - barMin)) * 100));

  return (
    <div
      className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 bg-white rounded-full border-2 border-zinc-900 shadow z-10"
      style={{ left: `${pct}%` }}
      title={`Your weight: ${current} kg`}
    />
  );
}

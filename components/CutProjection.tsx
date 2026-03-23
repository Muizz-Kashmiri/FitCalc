"use client";

import { useState } from "react";
import { CutProjection as CutProjectionType } from "@/lib/types";
import MacroChart from "./MacroChart";
import { TrendingDown, AlertTriangle } from "lucide-react";

interface Props {
  projection: CutProjectionType;
  tdee: number;
}

export default function CutProjection({ projection, tdee }: Props) {
  const [goalWeightKg, setGoalWeightKg] = useState("");
  const actualDeficit = tdee - projection.targetCalories;
  const isCapped = actualDeficit < projection.deficitKcal;

  const weeksToGoal = goalWeightKg
    ? Math.ceil(parseFloat(goalWeightKg) / projection.weeklyLossKg)
    : null;

  return (
    <div className="space-y-5">
      {/* Header stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatBox label="Target Calories" value={`${projection.targetCalories}`} unit="kcal/day" color="text-emerald-400" />
        <StatBox label="Daily Deficit" value={`−${Math.round(projection.deficitKcal)}`} unit="kcal" color="text-orange-400" />
        <StatBox label="Weekly Loss" value={`~${projection.weeklyLossKg}`} unit="kg/week" color="text-blue-400" />
        <StatBox label="Monthly Loss" value={`~${projection.monthlyLossKg}`} unit="kg/month" color="text-purple-400" />
      </div>

      {/* Safety warning if deficit was capped */}
      {isCapped && (
        <div className="flex items-start gap-3 bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
          <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-300">
            Your requested deficit would take calories below the safe minimum. Calories have been capped at {projection.targetCalories} kcal/day.
          </p>
        </div>
      )}

      {/* Time to goal */}
      <div className="bg-zinc-800/60 rounded-xl p-4 space-y-3">
        <div className="flex items-center gap-2">
          <TrendingDown className="w-4 h-4 text-emerald-400" />
          <span className="text-sm font-medium text-white">Time to Goal Weight</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-zinc-400">I want to lose</span>
          <input
            type="number"
            min={0.5}
            max={50}
            step={0.5}
            value={goalWeightKg}
            onChange={(e) => setGoalWeightKg(e.target.value)}
            placeholder="kg"
            className="w-20 bg-zinc-700 border border-zinc-600 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-emerald-500"
          />
          <span className="text-sm text-zinc-400">kg total</span>
        </div>
        {weeksToGoal && !isNaN(weeksToGoal) && (
          <p className="text-sm text-emerald-300 font-medium">
            Estimated time: ~{weeksToGoal} weeks ({Math.round(weeksToGoal / 4.33)} months)
          </p>
        )}
      </div>

      {/* Cut macros */}
      <div>
        <h4 className="text-sm font-medium text-zinc-300 mb-3">Your Cut Macros</h4>
        <MacroChart macros={projection.macros} />
      </div>

      {/* Guidance */}
      <div className="bg-zinc-800/40 rounded-xl p-4 space-y-2 text-sm text-zinc-400">
        <p className="text-zinc-300 font-medium">Guidelines for your cut:</p>
        <ul className="space-y-1 list-disc list-inside">
          <li>Hit your protein target every day — this preserves muscle while losing fat</li>
          <li>Reassess every 4 weeks; adjust calories if loss stalls for 2+ weeks</li>
          <li>A 500 kcal/day deficit = ~0.45 kg fat loss/week (sustainable long-term)</li>
          <li>A 750 kcal/day deficit is aggressive; expect some fatigue — keep training intensity up</li>
        </ul>
      </div>
    </div>
  );
}

function StatBox({
  label,
  value,
  unit,
  color,
}: {
  label: string;
  value: string;
  unit: string;
  color: string;
}) {
  return (
    <div className="bg-zinc-800/60 rounded-xl p-3 text-center">
      <div className={`text-xl font-bold ${color}`}>{value}</div>
      <div className="text-xs text-zinc-400 mt-0.5">{unit}</div>
      <div className="text-xs text-zinc-500 mt-1">{label}</div>
    </div>
  );
}

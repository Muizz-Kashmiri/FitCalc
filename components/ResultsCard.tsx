"use client";

import { CalculationResult, UserStats } from "@/lib/types";
import MacroChart from "./MacroChart";
import CutProjectionPanel from "./CutProjection";
import { ACTIVITY_LABELS } from "@/lib/calculations/tdee";
import { Flame, Dumbbell, Droplets, Info } from "lucide-react";

interface Props {
  result: CalculationResult;
  stats: UserStats;
}

export default function ResultsCard({ result, stats }: Props) {
  const { bmr, tdee, bodyComposition, maintenanceMacros, cutProjection } = result;

  return (
    <div className="space-y-6">
      {/* Body composition row */}
      <Section title="Body Composition" icon={<Droplets className="w-4 h-4" />}>
        <div className="grid grid-cols-3 gap-3">
          <CompStat label="Body Fat" value={`${bodyComposition.bodyFatPct}%`} sub={bodyComposition.category} />
          <CompStat label="Lean Mass" value={`${bodyComposition.leanMassKg} kg`} sub="muscle, bone, water" />
          <CompStat label="Fat Mass" value={`${bodyComposition.fatMassKg} kg`} sub="adipose tissue" />
        </div>
      </Section>

      {/* Calorie targets */}
      <Section title="Calorie Targets" icon={<Flame className="w-4 h-4" />}>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-zinc-800/60 rounded-xl p-4 text-center">
            <div className="text-xs text-zinc-500 uppercase tracking-wider mb-1">BMR</div>
            <div className="text-3xl font-bold text-white">{bmr}</div>
            <div className="text-xs text-zinc-400 mt-1">kcal/day at rest</div>
          </div>
          <div className="bg-zinc-800/60 rounded-xl p-4 text-center border border-emerald-500/30">
            <div className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Maintenance (TDEE)</div>
            <div className="text-3xl font-bold text-emerald-400">{tdee}</div>
            <div className="text-xs text-zinc-400 mt-1">kcal/day</div>
          </div>
        </div>
        <div className="flex items-start gap-2 mt-2">
          <Info className="w-3.5 h-3.5 text-zinc-500 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-zinc-500">
            Activity: {ACTIVITY_LABELS[stats.activityLevel]}
          </p>
        </div>
      </Section>

      {/* Maintenance macros */}
      <Section title="Maintenance Macros" icon={<Dumbbell className="w-4 h-4" />}>
        <div className="flex items-start gap-2 mb-4">
          <Info className="w-3.5 h-3.5 text-zinc-500 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-zinc-500">
            Protein calculated from{" "}
            <span className="text-zinc-300 font-medium">{bodyComposition.leanMassKg} kg lean mass</span>
            {" "}— eating above or at maintenance while hitting this target preserves and builds muscle.
          </p>
        </div>
        <MacroChart macros={maintenanceMacros} />
      </Section>

      {/* Cut projection */}
      {cutProjection && (
        <Section
          title="Cut Plan"
          icon={<Flame className="w-4 h-4 text-orange-400" />}
          badge="Fat Loss"
        >
          <CutProjectionPanel projection={cutProjection} tdee={tdee} />
        </Section>
      )}
    </div>
  );
}

function Section({
  title,
  icon,
  badge,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  badge?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-emerald-400">{icon}</span>
        <h3 className="font-semibold text-white">{title}</h3>
        {badge && (
          <span className="ml-auto text-xs bg-orange-500/20 text-orange-300 border border-orange-500/30 rounded-full px-2 py-0.5">
            {badge}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

function CompStat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="bg-zinc-800/60 rounded-xl p-3 text-center">
      <div className="text-lg font-bold text-white">{value}</div>
      <div className="text-xs text-zinc-500 mt-0.5">{label}</div>
      <div className="text-xs text-zinc-600 mt-0.5">{sub}</div>
    </div>
  );
}

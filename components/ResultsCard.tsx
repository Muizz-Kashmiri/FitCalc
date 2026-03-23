"use client";

import { CalculationResult, UserStats } from "@/lib/types";
import MacroChart from "./MacroChart";
import CutProjectionPanel from "./CutProjection";
import IdealWeightPanel from "./IdealWeight";
import InfoTip from "./InfoTip";
import { ACTIVITY_LABELS } from "@/lib/calculations/tdee";
import { Flame, Dumbbell, Droplets, Info, Target } from "lucide-react";

interface Props {
  result: CalculationResult;
  stats: UserStats;
}

export default function ResultsCard({ result, stats }: Props) {
  const { bmr, tdee, bodyComposition, maintenanceMacros, cutProjection } = result;

  return (
    <div className="space-y-6">
      {/* Body composition row */}
      <Section
        title="Body Composition"
        icon={<Droplets className="w-4 h-4" />}
        tip="Your body is made up of fat mass and lean mass. Lean mass includes muscle, bone, and water. Knowing this split helps set more accurate nutrition targets."
      >
        <div className="grid grid-cols-3 gap-3">
          <CompStat
            label="Body Fat"
            value={`${bodyComposition.bodyFatPct}%`}
            sub={bodyComposition.category}
            tip="The percentage of your total weight that is fat tissue."
          />
          <CompStat
            label="Lean Mass"
            value={`${bodyComposition.leanMassKg} kg`}
            sub="muscle, bone, water"
            tip="Everything that is not fat: muscle, bone, organs, and water. Your protein target is based on this number, not your total weight."
          />
          <CompStat
            label="Fat Mass"
            value={`${bodyComposition.fatMassKg} kg`}
            sub="adipose tissue"
            tip="The actual weight of fat tissue in your body."
          />
        </div>
      </Section>

      {/* Calorie targets */}
      <Section
        title="Calorie Targets"
        icon={<Flame className="w-4 h-4" />}
        tip="These are the two most important calorie numbers for your diet. BMR is your baseline; Maintenance is what you actually need each day."
      >
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-zinc-800/60 rounded-xl p-4 text-center">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <div className="text-xs text-zinc-500 uppercase tracking-wider">BMR</div>
              <InfoTip text="Basal Metabolic Rate: the number of calories your body burns just to stay alive at rest, doing nothing. Think of it as the fuel your organs need to keep running." />
            </div>
            <div className="text-3xl font-bold text-white">{bmr}</div>
            <div className="text-xs text-zinc-400 mt-1">kcal/day at rest</div>
          </div>
          <div className="bg-zinc-800/60 rounded-xl p-4 text-center border border-emerald-500/30">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <div className="text-xs text-zinc-500 uppercase tracking-wider">Maintenance</div>
              <InfoTip text="Also called TDEE (Total Daily Energy Expenditure). This is how many calories you burn in a full day including your activity. Eating at this number keeps your weight stable." />
            </div>
            <div className="text-3xl font-bold text-emerald-400">{tdee}</div>
            <div className="text-xs text-zinc-400 mt-1">kcal/day</div>
          </div>
        </div>
        <div className="flex items-start gap-2 mt-2">
          <Info className="w-3.5 h-3.5 text-zinc-500 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-zinc-500">
            Activity level: {ACTIVITY_LABELS[stats.activityLevel]}
          </p>
        </div>
      </Section>

      {/* Maintenance macros */}
      <Section
        title="Your Daily Macros"
        icon={<Dumbbell className="w-4 h-4" />}
        tip="Macros (macronutrients) are the three nutrients your body uses for energy: protein, carbohydrates, and fat. Hitting the right amounts is more important than just hitting a calorie number."
      >
        <div className="flex items-start gap-2 mb-4">
          <Info className="w-3.5 h-3.5 text-zinc-500 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-zinc-500">
            Protein is calculated from{" "}
            <span className="text-zinc-300 font-medium">{bodyComposition.leanMassKg} kg lean mass.</span>
            {" "}Eating at maintenance and hitting this protein target preserves and builds muscle.
          </p>
        </div>
        <MacroChart macros={maintenanceMacros} />
      </Section>

      {/* Healthy goal weight */}
      <Section
        title="Healthy Goal Weight"
        icon={<Target className="w-4 h-4" />}
        tip="Based on clinical formulas and your own lean body mass, these are the weight ranges considered healthy for your height, sex, and body composition."
      >
        <IdealWeightPanel data={result.idealWeight} />
      </Section>

      {/* Cut projection */}
      {cutProjection && (
        <Section
          title="Cut Plan"
          icon={<Flame className="w-4 h-4 text-orange-400" />}
          badge="Fat Loss"
          tip="A cut means eating below your maintenance calories so your body uses stored fat for energy. The goal is to lose fat while keeping as much muscle as possible."
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
  tip,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  badge?: string;
  tip?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-emerald-400">{icon}</span>
        <h3 className="font-semibold text-white">{title}</h3>
        {tip && <InfoTip text={tip} />}
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

function CompStat({ label, value, sub, tip }: { label: string; value: string; sub: string; tip?: string }) {
  return (
    <div className="bg-zinc-800/60 rounded-xl p-3 text-center">
      <div className="text-lg font-bold text-white">{value}</div>
      <div className="flex items-center justify-center gap-1 mt-0.5">
        <div className="text-xs text-zinc-500">{label}</div>
        {tip && <InfoTip text={tip} />}
      </div>
      <div className="text-xs text-zinc-600 mt-0.5">{sub}</div>
    </div>
  );
}

"use client";

import { useState } from "react";
import StatsForm from "@/components/StatsForm";
import ResultsCard from "@/components/ResultsCard";
import { UserStats, CalculationResult } from "@/lib/types";
import { calculate } from "@/lib/utils";
import { ChevronLeft, Dumbbell } from "lucide-react";

export default function Home() {
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [lastStats, setLastStats] = useState<UserStats | null>(null);

  const handleCalculate = (stats: UserStats) => {
    setLastStats(stats);
    setResult(calculate(stats));
    setTimeout(() => {
      document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleReset = () => {
    setResult(null);
    setLastStats(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="bg-emerald-500/20 p-2 rounded-xl">
            <Dumbbell className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white leading-none">FitCalc</h1>
            <p className="text-xs text-zinc-500 mt-0.5">Nutrition & Body Composition Calculator</p>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {!result ? (
          <>
            {/* Hero */}
            <div className="text-center mb-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
                Know Your Numbers
              </h2>
              <p className="text-zinc-400 max-w-xl mx-auto text-sm sm:text-base">
                Calculate your maintenance calories, lean body mass, and precise macro targets
                based on your body composition — not just your total weight.
              </p>
            </div>

            {/* Form */}
            <div className="max-w-xl mx-auto bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <StatsForm onCalculate={handleCalculate} />
            </div>
          </>
        ) : (
          <div id="results" className="space-y-6">
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Recalculate
            </button>

            <div className="grid lg:grid-cols-[340px,1fr] gap-6 items-start">
              {/* Sidebar */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-3">
                <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">
                  Your Inputs
                </h3>
                {lastStats && <InputSummary stats={lastStats} />}
                <button
                  onClick={handleReset}
                  className="w-full mt-2 text-sm text-emerald-400 hover:text-emerald-300 border border-emerald-500/30 hover:border-emerald-500/60 rounded-xl py-2 transition-colors"
                >
                  Edit Stats
                </button>
              </div>

              {/* Results */}
              <ResultsCard result={result} stats={lastStats!} />
            </div>
          </div>
        )}
      </div>

      <footer className="border-t border-zinc-800 mt-20 py-6 text-center text-xs text-zinc-600">
        Calculations use the Mifflin-St Jeor equation and LBM-based protein targets.
        This tool is for informational purposes — consult a professional for medical advice.
      </footer>
    </main>
  );
}

function InputSummary({ stats }: { stats: UserStats }) {
  const rows = [
    { label: "Sex", value: stats.sex.charAt(0).toUpperCase() + stats.sex.slice(1) },
    { label: "Age", value: `${stats.age} yrs` },
    { label: "Height", value: `${stats.heightCm} cm` },
    { label: "Weight", value: `${stats.weightKg} kg` },
    { label: "Body Fat", value: `${stats.bodyFatPct}%` },
    { label: "Experience", value: stats.experience.charAt(0).toUpperCase() + stats.experience.slice(1) },
    { label: "Goal", value: stats.goal === "cut" ? `Cut (−${stats.deficitKcal} kcal)` : "Maintain" },
  ];

  return (
    <div className="space-y-2">
      {rows.map(({ label, value }) => (
        <div key={label} className="flex justify-between text-sm">
          <span className="text-zinc-500">{label}</span>
          <span className="text-zinc-300 font-medium">{value}</span>
        </div>
      ))}
    </div>
  );
}

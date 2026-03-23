"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { MacroResult } from "@/lib/types";

interface Props {
  macros: MacroResult;
}

const COLORS = {
  protein: "#34d399",  // emerald
  carbs: "#60a5fa",    // blue
  fat: "#f97316",      // orange
};

export default function MacroChart({ macros }: Props) {
  const data = [
    { name: "Protein", value: macros.proteinKcal, grams: macros.proteinG, color: COLORS.protein },
    { name: "Carbs", value: macros.carbKcal, grams: macros.carbG, color: COLORS.carbs },
    { name: "Fat", value: macros.fatKcal, grams: macros.fatG, color: COLORS.fat },
  ];

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      {/* Donut chart */}
      <div className="w-40 h-40 flex-shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={46}
              outerRadius={70}
              paddingAngle={3}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [`${Math.round(Number(value))} kcal`]}
              contentStyle={{ background: "#18181b", border: "1px solid #3f3f46", borderRadius: 8, color: "#fff" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex flex-col gap-3 w-full">
        {data.map((entry) => (
          <div key={entry.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ background: entry.color }} />
              <span className="text-sm text-zinc-300">{entry.name}</span>
            </div>
            <div className="text-right">
              <span className="text-sm font-semibold text-white">{entry.grams}g</span>
              <span className="text-xs text-zinc-500 ml-2">{Math.round(entry.value)} kcal</span>
            </div>
          </div>
        ))}

        {/* Totals row */}
        <div className="flex items-center justify-between border-t border-zinc-700 pt-2 mt-1">
          <span className="text-sm text-zinc-400">Total</span>
          <span className="text-sm font-bold text-white">{macros.calories} kcal</span>
        </div>
      </div>
    </div>
  );
}

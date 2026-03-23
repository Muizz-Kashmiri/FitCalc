"use client";

import { Sex } from "@/lib/types";
import { getBFCategory } from "@/lib/calculations/bodyFat";
import { cn } from "@/lib/utils";

interface Props {
  sex: Sex;
  value: number;
  onChange: (pct: number) => void;
}

// ACE Fitness body fat categories with midpoints
const MALE_CATEGORIES = [
  { category: "Essential Fat", range: "2-5%", midpoint: 4, color: "text-blue-400", bar: "bg-blue-500", description: "Minimum for organ function. Not sustainable." },
  { category: "Athletic", range: "6-13%", midpoint: 10, color: "text-emerald-400", bar: "bg-emerald-500", description: "Visible abs and vascularity. Competitive athletes." },
  { category: "Fitness", range: "14-17%", midpoint: 15, color: "text-green-400", bar: "bg-green-500", description: "Lean look with some ab visibility." },
  { category: "Average", range: "18-24%", midpoint: 21, color: "text-yellow-400", bar: "bg-yellow-500", description: "Healthy. Soft midsection, no definition." },
  { category: "Obese", range: "25%+", midpoint: 30, color: "text-orange-400", bar: "bg-orange-500", description: "Excess fat. Associated with health risks." },
];

const FEMALE_CATEGORIES = [
  { category: "Essential Fat", range: "10-13%", midpoint: 12, color: "text-blue-400", bar: "bg-blue-500", description: "Minimum for organ and hormonal function." },
  { category: "Athletic", range: "14-20%", midpoint: 17, color: "text-emerald-400", bar: "bg-emerald-500", description: "Toned, athletic physique." },
  { category: "Fitness", range: "21-24%", midpoint: 22, color: "text-green-400", bar: "bg-green-500", description: "Healthy and fit. Toned without extreme leanness." },
  { category: "Average", range: "25-31%", midpoint: 28, color: "text-yellow-400", bar: "bg-yellow-500", description: "Healthy. Softer appearance, pronounced curves." },
  { category: "Obese", range: "32%+", midpoint: 38, color: "text-orange-400", bar: "bg-orange-500", description: "Excess fat. Associated with health risks." },
];

export default function BodyFatSelector({ sex, value, onChange }: Props) {
  const categories = sex === "male" ? MALE_CATEGORIES : FEMALE_CATEGORIES;
  const category = getBFCategory(sex, value);
  const activeCategory = categories.find((c) => c.midpoint === value)?.category ?? null;

  const handleManualChange = (raw: string) => {
    if (raw === "") return;
    const num = parseFloat(raw);
    if (!isNaN(num) && num >= 4 && num <= 60) onChange(num);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-zinc-400">
        Select the category that best describes your physique, or enter your exact percentage below.
        Categories follow{" "}
        <span className="text-zinc-300">ACE Fitness standards</span>.
      </p>

      {/* Visual category grid */}
      <div className="space-y-2">
        {categories.map((cat) => {
          const isSelected = activeCategory === cat.category;
          return (
            <button
              key={cat.category}
              type="button"
              onClick={() => onChange(cat.midpoint)}
              className={cn(
                "w-full text-left rounded-xl border-2 transition-all overflow-hidden",
                isSelected
                  ? "border-emerald-500 bg-emerald-500/10"
                  : "border-zinc-700 bg-zinc-800/40 hover:border-zinc-500"
              )}
            >
              <div className="flex items-stretch gap-0">
                {/* SVG figure column */}
                <div className="flex-shrink-0 w-16 flex items-center justify-center bg-zinc-800/60 py-2">
                  <BodyFigure sex={sex} bfPct={cat.midpoint} />
                </div>

                {/* Text content */}
                <div className="flex-1 p-3">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div className={cn("w-2 h-2 rounded-full flex-shrink-0", cat.bar)} />
                      <span className="text-sm font-semibold text-white">{cat.category}</span>
                    </div>
                    <span className={cn("text-sm font-bold tabular-nums", cat.color)}>
                      {cat.range}
                    </span>
                  </div>
                  {/* Proportional bar */}
                  <BFBar sex={sex} category={cat.category} isSelected={isSelected} barColor={cat.bar} />
                  <p className="text-xs text-zinc-400 mt-1.5">{cat.description}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Always-visible manual entry */}
      <div className="flex items-center gap-3 bg-zinc-800/40 rounded-xl px-4 py-3 border border-zinc-700">
        <span className="text-sm text-zinc-400 flex-shrink-0">Or enter exact %:</span>
        <input
          type="number"
          min={4}
          max={60}
          step={0.5}
          value={value || ""}
          placeholder="e.g. 18"
          onChange={(e) => handleManualChange(e.target.value)}
          className="w-24 bg-zinc-700 border border-zinc-600 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-emerald-500"
        />
        <span className="text-zinc-400 text-sm">%</span>
        <span className="text-xs text-zinc-500 ml-1">(from DEXA, calipers, or smart scale)</span>
      </div>

      {/* Selection pill */}
      <div className="flex items-center gap-3 bg-zinc-800/60 rounded-lg px-4 py-3">
        <div className="h-2 w-2 rounded-full bg-emerald-400 flex-shrink-0" />
        <span className="text-sm text-zinc-300">
          Selected:{" "}
          <span className="text-white font-semibold">{value}% body fat</span>
          {" · "}
          <span className="text-emerald-400">{category}</span>
        </span>
      </div>

      <p className="text-xs text-zinc-500">
        Source: American Council on Exercise (ACE) body fat classification.
      </p>
    </div>
  );
}

// Detailed SVG body figure — sex-specific, scales with body fat level
function BodyFigure({ sex, bfPct }: { sex: Sex; bfPct: number }) {
  const isFemale = sex === "female";

  // Normalise fatness 0 (very lean) to 1 (obese)
  const minBF = isFemale ? 12 : 5;
  const maxBF = isFemale ? 40 : 32;
  const fatness = Math.max(0, Math.min(1, (bfPct - minBF) / (maxBF - minBF)));

  // Key measurements that change with fatness
  const shoulder = 18 + fatness * 6;           // 18-24
  const waist = isFemale
    ? 12 + fatness * 14                        // female: 12-26 (hourglass preserved)
    : 13 + fatness * 16;                       // male: 13-29
  const belly = waist + fatness * 8;           // belly bulge at midpoint
  const hip = isFemale
    ? waist + 14 - fatness * 4                 // female: wider hips
    : waist + 4 + fatness * 4;                 // male: slight hip growth
  const thigh = 7 + fatness * 5;              // leg width
  const neck = 3.5 + fatness * 1.5;
  const armW = 4 + fatness * 3;

  // Show muscle definition lines only for lean figures
  const showAbs = !isFemale && fatness < 0.25;
  const showVascularity = !isFemale && fatness < 0.15;
  const showTone = isFemale && fatness < 0.3;

  const cx = 24; // horizontal centre

  return (
    <svg width="44" height="90" viewBox="0 0 48 92" fill="none">
      {/* Head */}
      <ellipse cx={cx} cy={8} rx={6} ry={7} fill="#71717a" />

      {/* Neck */}
      <rect x={cx - neck} y={14} width={neck * 2} height={6} rx={2} fill="#71717a" />

      {/* Torso: shoulders -> waist -> hips using a smooth path */}
      <path
        d={`
          M ${cx - shoulder} 20
          C ${cx - shoulder} 26, ${cx - belly} 32, ${cx - waist} 36
          C ${cx - waist} 40, ${cx - hip} 44, ${cx - hip} 48
          L ${cx + hip} 48
          C ${cx + hip} 44, ${cx + waist} 40, ${cx + waist} 36
          C ${cx + belly} 32, ${cx + shoulder} 26, ${cx + shoulder} 20
          Z
        `}
        fill="#71717a"
      />

      {/* Female breast curve suggestion */}
      {isFemale && fatness < 0.7 && (
        <>
          <ellipse cx={cx - shoulder * 0.35} cy={27} rx={shoulder * 0.22} ry={shoulder * 0.18} fill="#6b7280" opacity="0.6" />
          <ellipse cx={cx + shoulder * 0.35} cy={27} rx={shoulder * 0.22} ry={shoulder * 0.18} fill="#6b7280" opacity="0.6" />
        </>
      )}

      {/* Abs lines (lean male) */}
      {showAbs && (
        <>
          <line x1={cx - 3} y1={26} x2={cx - 3} y2={35} stroke="#9ca3af" strokeWidth="0.7" opacity="0.5" />
          <line x1={cx + 3} y1={26} x2={cx + 3} y2={35} stroke="#9ca3af" strokeWidth="0.7" opacity="0.5" />
          <line x1={cx - 5} y1={29} x2={cx + 5} y2={29} stroke="#9ca3af" strokeWidth="0.6" opacity="0.4" />
          <line x1={cx - 5} y1={33} x2={cx + 5} y2={33} stroke="#9ca3af" strokeWidth="0.6" opacity="0.4" />
        </>
      )}

      {/* Vascularity (very lean male) */}
      {showVascularity && (
        <path d={`M ${cx - shoulder + 2} 22 Q ${cx - shoulder + 1} 28 ${cx - shoulder + 3} 34`} stroke="#818cf8" strokeWidth="0.8" opacity="0.5" fill="none" />
      )}

      {/* Female toning lines */}
      {showTone && (
        <line x1={cx - 2} y1={30} x2={cx + 2} y2={30} stroke="#9ca3af" strokeWidth="0.6" opacity="0.3" />
      )}

      {/* Arms */}
      <path
        d={`M ${cx - shoulder} 20 Q ${cx - shoulder - armW - 2} 28 ${cx - shoulder - armW} 38 L ${cx - shoulder - armW + armW * 0.5} 38 Q ${cx - shoulder - 1} 28 ${cx - shoulder + 2} 21 Z`}
        fill="#71717a"
      />
      <path
        d={`M ${cx + shoulder} 20 Q ${cx + shoulder + armW + 2} 28 ${cx + shoulder + armW} 38 L ${cx + shoulder + armW - armW * 0.5} 38 Q ${cx + shoulder + 1} 28 ${cx + shoulder - 2} 21 Z`}
        fill="#71717a"
      />

      {/* Legs */}
      <path
        d={`M ${cx - hip} 48 Q ${cx - hip - fatness * 2} 58 ${cx - thigh - 1} 70 L ${cx - thigh + 2} 70 Q ${cx - 2} 60 ${cx - 2} 48 Z`}
        fill="#71717a"
      />
      <path
        d={`M ${cx + hip} 48 Q ${cx + hip + fatness * 2} 58 ${cx + thigh + 1} 70 L ${cx + thigh - 2} 70 Q ${cx + 2} 60 ${cx + 2} 48 Z`}
        fill="#71717a"
      />

      {/* Lower legs */}
      <rect x={cx - thigh - 1} y={70} width={thigh + 1} height={18} rx={3} fill="#6b7280" />
      <rect x={cx + 2} y={70} width={thigh + 1} height={18} rx={3} fill="#6b7280" />
    </svg>
  );
}

// Proportional horizontal bar showing where each category sits on the full spectrum
function BFBar({ sex, category, isSelected, barColor }: { sex: Sex; category: string; isSelected: boolean; barColor: string }) {
  const maleBounds: Record<string, [number, number]> = {
    "Essential Fat": [0, 10], Athletic: [10, 36], Fitness: [36, 52], Average: [52, 78], Obese: [78, 100],
  };
  const femaleBounds: Record<string, [number, number]> = {
    "Essential Fat": [0, 8], Athletic: [8, 32], Fitness: [32, 48], Average: [48, 72], Obese: [72, 100],
  };
  const bounds = sex === "male" ? maleBounds : femaleBounds;
  const [left, right] = bounds[category] ?? [0, 20];
  return (
    <div className="relative h-1 bg-zinc-700 rounded-full overflow-hidden mt-2">
      <div
        className={cn("absolute h-full rounded-full transition-opacity", barColor, isSelected ? "opacity-100" : "opacity-35")}
        style={{ left: `${left}%`, width: `${right - left}%` }}
      />
    </div>
  );
}

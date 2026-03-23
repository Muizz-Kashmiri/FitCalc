"use client";

import { useState } from "react";
import { Sex, BFInputMethod } from "@/lib/types";
import { MALE_BF_RANGES, FEMALE_BF_RANGES, getBFCategory } from "@/lib/calculations/bodyFat";
import { cn } from "@/lib/utils";

interface Props {
  sex: Sex;
  value: number;
  onChange: (pct: number) => void;
}

export default function BodyFatSelector({ sex, value, onChange }: Props) {
  const [method, setMethod] = useState<BFInputMethod>("visual");
  const [manualValue, setManualValue] = useState(value.toString());

  const ranges = sex === "male" ? MALE_BF_RANGES : FEMALE_BF_RANGES;

  const handleManualChange = (raw: string) => {
    setManualValue(raw);
    const num = parseFloat(raw);
    if (!isNaN(num) && num >= 4 && num <= 60) {
      onChange(num);
    }
  };

  const category = getBFCategory(sex, value);

  return (
    <div className="space-y-4">
      {/* Toggle */}
      <div className="flex rounded-lg overflow-hidden border border-zinc-700 w-fit">
        <button
          type="button"
          onClick={() => setMethod("visual")}
          className={cn(
            "px-4 py-2 text-sm font-medium transition-colors",
            method === "visual"
              ? "bg-emerald-500 text-white"
              : "bg-zinc-800 text-zinc-400 hover:text-white"
          )}
        >
          Visual Chart
        </button>
        <button
          type="button"
          onClick={() => setMethod("manual")}
          className={cn(
            "px-4 py-2 text-sm font-medium transition-colors",
            method === "manual"
              ? "bg-emerald-500 text-white"
              : "bg-zinc-800 text-zinc-400 hover:text-white"
          )}
        >
          Enter Manually
        </button>
      </div>

      {method === "visual" ? (
        <div className="space-y-3">
          <p className="text-sm text-zinc-400">
            Select the image that best matches your current physique:
          </p>
          <div className="grid grid-cols-3 gap-3">
            {ranges.map((range) => (
              <button
                key={range.value}
                type="button"
                onClick={() => onChange(range.value)}
                className={cn(
                  "rounded-xl border-2 p-3 text-left transition-all",
                  value === range.value
                    ? "border-emerald-500 bg-emerald-500/10"
                    : "border-zinc-700 bg-zinc-800/50 hover:border-zinc-500"
                )}
              >
                {/* SVG silhouette illustration */}
                <div className="mb-2 flex justify-center">
                  <BodySilhouette sex={sex} bfPct={range.value} />
                </div>
                <div className="text-center">
                  <div className="text-sm font-semibold text-white">{range.label}</div>
                  <div className="text-xs text-zinc-400 mt-0.5">{range.description}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-sm text-zinc-400">
            Enter your body fat % (from DEXA, calipers, or smart scale):
          </p>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min={4}
              max={60}
              step={0.5}
              value={manualValue}
              onChange={(e) => handleManualChange(e.target.value)}
              className="w-28 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
              placeholder="e.g. 18"
            />
            <span className="text-zinc-400 text-sm">%</span>
          </div>
        </div>
      )}

      {/* Selected result */}
      <div className="flex items-center gap-3 bg-zinc-800/60 rounded-lg px-4 py-3">
        <div className="h-2 w-2 rounded-full bg-emerald-400" />
        <span className="text-sm text-zinc-300">
          Selected: <span className="text-white font-semibold">{value}% body fat</span>
          {" · "}
          <span className="text-emerald-400">{category}</span>
        </span>
      </div>
    </div>
  );
}

// SVG silhouette that visually represents body fat level
function BodySilhouette({ sex, bfPct }: { sex: Sex; bfPct: number }) {
  // Leanness drives the "width" of the silhouette waist/belly
  const leanness = Math.max(0, Math.min(1, 1 - (bfPct - 5) / 45));
  const waistWidth = 24 + (1 - leanness) * 18; // 24–42
  const bellyBulge = (1 - leanness) * 8;

  const isFemale = sex === "female";
  const hipWidth = isFemale ? waistWidth + 10 : waistWidth + 4;

  return (
    <svg width="48" height="80" viewBox="0 0 48 80" fill="none">
      {/* Head */}
      <ellipse cx="24" cy="9" rx="7" ry="8" fill="#6b7280" />
      {/* Neck */}
      <rect x="21" y="16" width="6" height="5" rx="2" fill="#6b7280" />
      {/* Torso */}
      <path
        d={`
          M ${24 - waistWidth / 2} 21
          Q ${24 - waistWidth / 2 - bellyBulge} 35 ${24 - hipWidth / 2} 48
          L ${24 + hipWidth / 2} 48
          Q ${24 + waistWidth / 2 + bellyBulge} 35 ${24 + waistWidth / 2} 21
          Z
        `}
        fill="#6b7280"
      />
      {/* Hips */}
      {isFemale && (
        <ellipse cx="24" cy="48" rx={hipWidth / 2 + 2} ry="5" fill="#6b7280" />
      )}
      {/* Legs */}
      <rect x={24 - hipWidth / 2 + 2} y="48" width={hipWidth / 2 - 3} height="24" rx="4" fill="#6b7280" />
      <rect x="24" y="48" width={hipWidth / 2 - 3} height="24" rx="4" fill="#6b7280" />
      {/* Arms */}
      <rect x={24 - waistWidth / 2 - 7} y="21" width="7" height="20" rx="3.5" fill="#6b7280" />
      <rect x={24 + waistWidth / 2} y="21" width="7" height="20" rx="3.5" fill="#6b7280" />
    </svg>
  );
}

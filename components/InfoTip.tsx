"use client";

import { useState, useRef, useEffect } from "react";

interface Props {
  text: string;
}

export default function InfoTip({ text }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <span ref={ref} className="relative inline-flex items-center">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="text-zinc-500 hover:text-emerald-400 transition-colors text-base leading-none select-none"
        aria-label="More information"
      >
        ⓘ
      </button>

      {open && (
        <span className="absolute left-6 top-1/2 -translate-y-1/2 z-50 w-60 bg-zinc-800 border border-zinc-700 rounded-xl p-3 shadow-xl">
          <span className="text-xs text-zinc-300 leading-relaxed">{text}</span>
        </span>
      )}
    </span>
  );
}

"use client";

import { useRef } from "react";

interface FocalPointPickerProps {
  imageUrl: string;
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

function parsePoint(value: string): { x: number; y: number } {
  const match = value.match(/(\d+(?:\.\d+)?)%\s+(\d+(?:\.\d+)?)%/);
  if (!match) return { x: 50, y: 0 };
  return { x: Number(match[1]), y: Number(match[2]) };
}

export function FocalPointPicker({
  imageUrl,
  value,
  onChange,
  label = "Titik Fokus Foto Sampul",
}: FocalPointPickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const point = parsePoint(value);

  function handlePick(event: React.MouseEvent<HTMLDivElement>) {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = Math.min(100, Math.max(0, ((event.clientX - rect.left) / rect.width) * 100));
    const y = Math.min(100, Math.max(0, ((event.clientY - rect.top) / rect.height) * 100));
    onChange(`${x.toFixed(0)}% ${y.toFixed(0)}%`);
  }

  return (
    <div>
      <p className="text-[12px] font-bold text-muted-foreground">{label}</p>
      <div
        ref={containerRef}
        onClick={handlePick}
        role="button"
        tabIndex={0}
        aria-label="Klik untuk atur titik fokus foto sampul"
        className="relative mt-1 h-40 w-full cursor-crosshair overflow-hidden rounded-input border-2 border-ink bg-surface"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt="Pratinjau titik fokus foto sampul"
          className="pointer-events-none h-full w-full object-cover"
          style={{ objectPosition: value }}
        />
        <div
          className="pointer-events-none absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-cta shadow-[0_0_0_1.5px_rgba(20,20,20,1)]"
          style={{ left: `${point.x}%`, top: `${point.y}%` }}
        />
      </div>
      <p className="mt-1.5 text-[12px] font-normal text-muted-foreground">
        Klik bagian foto yang paling penting (mis. judul atau produknya) biar
        nggak kepotong pas ditampilkan sebagai kartu kecil.
      </p>
    </div>
  );
}

"use client"

import type { Preset } from "@/content/playground"
import { cn } from "@/lib/utils"

type Props = { presets: Preset[]; activeId: string | null; onSelect: (p: Preset) => void }

export function Presets({ presets, activeId, onSelect }: Props) {
  return (
    <div role="group" aria-label="Scenarios" className="flex flex-wrap gap-2">
      {presets.map((p) => (
        <button
          key={p.id}
          type="button"
          aria-pressed={activeId === p.id}
          onClick={() => onSelect(p)}
          className={cn(
            "rounded-full border px-3 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:text-sm",
            activeId === p.id ? "border-primary bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:text-foreground",
          )}
        >
          {p.label}
        </button>
      ))}
    </div>
  )
}

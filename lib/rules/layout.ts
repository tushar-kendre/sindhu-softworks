import type { Layout } from "@/content/playground"
import type { Edge } from "./types"

export type LayoutKind = "desktop" | "mobile"

export const NODE_SIZE: Record<LayoutKind, { w: number; h: number }> = {
  desktop: { w: 212, h: 64 },
  mobile: { w: 170, h: 64 },
}

export function graphBounds(layout: Layout, kind: LayoutKind) {
  const { w, h } = NODE_SIZE[kind]
  let maxX = 0
  let maxY = 0
  for (const p of Object.values(layout)) {
    maxX = Math.max(maxX, p.x + w)
    maxY = Math.max(maxY, p.y + h)
  }
  return { width: maxX, height: maxY }
}

/** Cubic bezier between node edges; right→left on desktop, bottom→top on mobile. */
export function edgePath(layout: Layout, kind: LayoutKind, edge: Edge): string | null {
  const a = layout[edge.source]
  const b = layout[edge.target]
  if (!a || !b) return null
  const { w, h } = NODE_SIZE[kind]
  if (kind === "desktop") {
    const x1 = a.x + w
    const y1 = a.y + h / 2
    const x2 = b.x
    const y2 = b.y + h / 2
    const c = Math.max(40, (x2 - x1) / 2)
    return `M${x1} ${y1} C${x1 + c} ${y1} ${x2 - c} ${y2} ${x2} ${y2}`
  }
  const x1 = a.x + w / 2
  const y1 = a.y + h
  const x2 = b.x + w / 2
  const y2 = b.y
  const c = Math.max(24, (y2 - y1) / 2)
  return `M${x1} ${y1} C${x1} ${y1 + c} ${x2} ${y2 - c} ${x2} ${y2}`
}

"use client"

import { useCallback, useEffect, useState } from "react"

/**
 * Scroll-spy: returns the id of the section whose centre is closest to a marker
 * 38% down the viewport. Extracted from personal-website/components/story/section-rail.tsx.
 */
export function useActiveSection(ids: readonly string[], marker = 0.38): string {
  const [activeId, setActiveId] = useState<string>("")

  const update = useCallback(() => {
    if (!ids.length) return
    const viewportMarker = window.scrollY + window.innerHeight * marker
    let closest = ""
    let min = Number.POSITIVE_INFINITY
    for (const id of ids) {
      const el = document.getElementById(id)
      if (!el) continue
      const centre = el.offsetTop + el.offsetHeight * 0.5
      const d = Math.abs(centre - viewportMarker)
      if (d < min) {
        min = d
        closest = id
      }
    }
    // Above the first section → nothing active.
    if (window.scrollY < 120) closest = ""
    setActiveId((prev) => (prev === closest ? prev : closest))
  }, [ids, marker])

  useEffect(() => {
    let frame = window.requestAnimationFrame(() => {
      frame = 0
      update()
    })
    const onScroll = () => {
      if (frame) return
      frame = window.requestAnimationFrame(() => {
        frame = 0
        update()
      })
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      if (frame) window.cancelAnimationFrame(frame)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [update])

  return activeId
}

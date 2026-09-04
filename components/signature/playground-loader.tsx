"use client"

import dynamic from "next/dynamic"
import { useEffect, useRef, useState } from "react"

const RulesPlayground = dynamic(() => import("./rules-playground").then((m) => m.RulesPlayground), {
  ssr: false,
  loading: () => null,
})

/**
 * Keeps the server-rendered static graph on screen until the interactive one is
 * both near the viewport and downloaded, so the React Flow chunk never competes
 * with first paint and the swap causes no layout shift.
 */
export function PlaygroundLoader({ fallback }: { fallback: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const [near, setNear] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    // Belt and braces: load when near the viewport, or after the page has been idle
    // for a moment (covers browsers where the observer never fires, e.g. hidden tabs).
    const idle = window.setTimeout(() => setNear(true), 2500)
    if (typeof IntersectionObserver === "undefined") return () => window.clearTimeout(idle)
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setNear(true)
          io.disconnect()
        }
      },
      { rootMargin: "200px 0px" },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      window.clearTimeout(idle)
    }
  }, [])

  return (
    <div ref={ref} className="relative">
      {!ready ? <div className="h-[470px] w-full p-2">{fallback}</div> : null}
      {near ? (
        <div className={ready ? undefined : "absolute inset-0 opacity-0"} aria-hidden={!ready}>
          <RulesPlayground onReady={() => setReady(true)} />
        </div>
      ) : null}
    </div>
  )
}

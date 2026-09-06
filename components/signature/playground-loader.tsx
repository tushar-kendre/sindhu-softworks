"use client"

import dynamic from "next/dynamic"
import { useEffect, useRef, useState } from "react"

const RulesPlayground = dynamic(() => import("./rules-playground").then((m) => m.RulesPlayground), { ssr: false, loading: () => null })

/** Keeps the static graph on screen until the interactive one is near the viewport and downloaded. Zero layout shift. */
export function PlaygroundLoader({ fallback }: { fallback: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const [near, setNear] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const hasRic = typeof window.requestIdleCallback === "function"
    const idle = hasRic ? window.requestIdleCallback(() => setNear(true), { timeout: 8000 }) : window.setTimeout(() => setNear(true), 8000)
    const cancelIdle = () => (hasRic ? window.cancelIdleCallback(idle) : window.clearTimeout(idle))
    if (typeof IntersectionObserver === "undefined") return cancelIdle
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
      cancelIdle()
    }
  }, [])

  return (
    <div ref={ref} style={{ position: "relative" }}>
      {!ready ? <div style={{ height: 470, width: "100%", padding: "0.5rem" }}>{fallback}</div> : null}
      {near ? (
        <div style={ready ? undefined : { position: "absolute", inset: 0, opacity: 0 }} aria-hidden={!ready}>
          <RulesPlayground onReady={() => setReady(true)} />
        </div>
      ) : null}
    </div>
  )
}

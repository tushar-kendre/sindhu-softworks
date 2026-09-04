"use client"

import { useCallback, useSyncExternalStore } from "react"

/** SSR-safe matchMedia subscription. Returns false on the server and before hydration. */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query)
      mql.addEventListener("change", onChange)
      return () => mql.removeEventListener("change", onChange)
    },
    [query],
  )
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  )
}

const noop = () => () => {}
/** true once the component has mounted on the client; false during SSR and hydration. */
export function useMounted(): boolean {
  return useSyncExternalStore(noop, () => true, () => false)
}

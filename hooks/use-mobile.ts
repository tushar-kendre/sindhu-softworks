"use client"

import { useMediaQuery } from "./use-media-query"

/** Matches Once UI's `s` breakpoint (below 768px). */
export function useIsMobile(): boolean {
  return useMediaQuery("(max-width: 767px)")
}

"use client"

import { IconButton, useTheme } from "@once-ui-system/core"
import { useMounted } from "@/hooks/use-media-query"

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const mounted = useMounted()
  const isDark = mounted && resolvedTheme === "dark"
  return (
    <IconButton
      variant="tertiary"
      size="m"
      icon={isDark ? "sun" : "moon"}
      tooltip={isDark ? "Light theme" : "Dark theme"}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    />
  )
}

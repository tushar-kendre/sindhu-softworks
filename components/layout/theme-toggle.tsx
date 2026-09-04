"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useMounted } from "@/hooks/use-media-query"
import { Button } from "@/components/ui/button"

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme()
  const mounted = useMounted()
  const isDark = mounted && resolvedTheme === "dark"

  return (
    <Button
      variant="ghost"
      size="icon"
      className={className}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {mounted ? isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" /> : <span className="block h-4 w-4" />}
    </Button>
  )
}

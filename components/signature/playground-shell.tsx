import { ArrowUpRight } from "lucide-react"
import { playground } from "@/content/playground"
import { PlaygroundLoader } from "./playground-loader"
import { RulesPlaygroundStatic } from "./rules-playground-static"

export function PlaygroundShell() {
  return (
    <div className="rounded-2xl border bg-card/70 shadow-sm backdrop-blur-sm">
      <div className="flex flex-col gap-3 border-b px-5 py-4 md:flex-row md:items-end md:justify-between md:px-6">
        <div>
          <p className="eyebrow">{playground.eyebrow}</p>
          <h2 className="mt-1 text-xl md:text-2xl">{playground.title}</h2>
        </div>
        <a
          href={playground.sourceHref}
          target="_blank"
          rel="noopener"
          className="inline-flex items-center gap-1 font-mono text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          {playground.sourceLabel} <ArrowUpRight className="h-3 w-3" aria-hidden />
        </a>
      </div>
      <PlaygroundLoader fallback={<RulesPlaygroundStatic />} />
      <div className="border-t px-5 py-4 text-sm text-muted-foreground md:px-6">
        <p>{playground.caption}</p>
        <p className="mt-2 text-xs">{playground.footnote}</p>
      </div>
    </div>
  )
}

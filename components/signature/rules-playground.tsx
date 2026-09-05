"use client"

import { Background, Position, ReactFlow, type Edge as FlowEdge, type ReactFlowInstance } from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import { SlidersHorizontal } from "lucide-react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { playground, type Preset, type Scenario } from "@/content/playground"
import { useIsMobile } from "@/hooks/use-mobile"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { defaultInputs, edgesOf, evaluate } from "@/lib/rules/engine"
import { NODE_SIZE } from "@/lib/rules/layout"
import type { InputValue } from "@/lib/rules/types"
import { cn } from "@/lib/utils"
import { ExplainPanel } from "./explain-panel"
import { InputNode } from "./nodes/input-node"
import { OutputNode } from "./nodes/output-node"
import { RuleNode } from "./nodes/rule-node"
import type { PlayNode } from "./nodes/shared"
import { PlaygroundInputs } from "./playground-inputs"
import { Presets } from "./presets"

// Custom type names avoid React Flow's built-in "input"/"output"/"default" node styles.
const nodeTypes = { playInput: InputNode, playRule: RuleNode, playOutput: OutputNode }
const GRAPH_HEIGHT = 470

export function RulesPlayground({ onReady }: { onReady?: () => void }) {
  const [scenarioId, setScenarioId] = useState(playground.scenarios[0].id)
  const scenario = playground.scenarios.find((s) => s.id === scenarioId) ?? playground.scenarios[0]

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-3 px-4 pt-4 md:flex-row md:items-center md:justify-between md:px-6">
        <h3 className="font-display text-lg md:text-xl">{scenario.title}</h3>
        <div role="tablist" aria-label="Scenario" className="inline-flex self-start rounded-md border bg-background p-0.5">
          {playground.scenarios.map((s) => (
            <button
              key={s.id}
              role="tab"
              type="button"
              aria-selected={s.id === scenario.id}
              onClick={() => setScenarioId(s.id)}
              className={cn(
                "rounded px-3 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:text-sm",
                s.id === scenario.id ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
      {/* key resets inputs, preset and selection when the scenario changes */}
      <ScenarioPlayground key={scenario.id} scenario={scenario} onReady={onReady} />
    </div>
  )
}

function ScenarioPlayground({ scenario, onReady }: { scenario: Scenario; onReady?: () => void }) {
  const isMobile = useIsMobile()
  const reducedMotion = useReducedMotion()
  const kind = isMobile ? "mobile" : "desktop"
  const layout = scenario.layout[kind]

  const graph = useMemo(() => ({ inputs: scenario.inputs, nodes: scenario.nodes }), [scenario])
  const inputDefs = useMemo(() => new Map(scenario.inputs.map((i) => [i.id, i])), [scenario])
  const nodeById = useMemo(() => new Map(scenario.nodes.map((n) => [n.id, n])), [scenario])
  const allEdges = useMemo(() => edgesOf(graph), [graph])
  const outputId = useMemo(() => scenario.nodes.find((n) => n.kind === "output")!.id, [scenario])
  const labelOf = useCallback((id: string) => nodeById.get(id)?.label ?? id, [nodeById])

  const [values, setValues] = useState<Record<string, InputValue>>(() => defaultInputs(scenario.inputs))
  const [presetId, setPresetId] = useState<string | null>(scenario.presets[0]?.id ?? null)
  const [selectedId, setSelectedId] = useState<string>(outputId)
  const [explainOpen, setExplainOpen] = useState(false)
  const instance = useRef<ReactFlowInstance<PlayNode, FlowEdge> | null>(null)

  const result = useMemo(() => evaluate(graph, values), [graph, values])

  const setValue = useCallback((id: string, v: InputValue) => {
    setPresetId(null)
    setValues((prev) => (prev[id] === v ? prev : { ...prev, [id]: v }))
  }, [])

  const applyPreset = useCallback(
    (p: Preset) => {
      setValues({ ...defaultInputs(scenario.inputs), ...p.values })
      setPresetId(p.id)
      setSelectedId(outputId)
    },
    [scenario, outputId],
  )

  const select = useCallback(
    (id: string) => {
      setSelectedId(id)
      if (isMobile) setExplainOpen(true)
    },
    [isMobile],
  )

  const nodes = useMemo<PlayNode[]>(() => {
    const list: PlayNode[] = []
    for (const def of scenario.nodes) {
      const pos = layout[def.id]
      if (!pos) continue
      const r = result.results.get(def.id)!
      const hasSource = allEdges.some((e) => e.source === def.id && layout[e.target])
      const hasTarget = allEdges.some((e) => e.target === def.id && layout[e.source])
      const type = def.kind === "input" ? "playInput" : def.kind === "output" ? "playOutput" : "playRule"
      const inputDef = def.kind === "input" ? inputDefs.get(def.input) : undefined
      list.push({
        id: def.id,
        type,
        position: pos,
        width: NODE_SIZE[kind].w,
        sourcePosition: kind === "desktop" ? Position.Right : Position.Bottom,
        targetPosition: kind === "desktop" ? Position.Left : Position.Top,
        draggable: false,
        connectable: false,
        selectable: false,
        focusable: true,
        ariaLabel: `${def.label}: ${r.reason}. Press Enter to explain.`,
        data: {
          def,
          result: r,
          inputDef,
          value: inputDef ? values[inputDef.id] : undefined,
          onChange: inputDef ? (v: InputValue) => setValue(inputDef.id, v) : undefined,
          onSelect: select,
          selected: selectedId === def.id,
          compact: kind === "mobile",
          hasSource,
          hasTarget,
        },
      })
    }
    return list
  }, [scenario, layout, kind, result, values, selectedId, select, setValue, allEdges, inputDefs])

  const edges = useMemo<FlowEdge[]>(
    () =>
      allEdges
        .filter((e) => layout[e.source] && layout[e.target])
        .map((e) => {
          const st = result.results.get(e.source)?.state ?? "neutral"
          const cls = st === "pass" ? "edge-pass" : st === "fail" ? "edge-fail" : st === "review" ? "edge-review" : "edge-idle"
          return {
            id: `${e.source}-${e.target}`,
            source: e.source,
            target: e.target,
            type: "default",
            className: cls,
            animated: st === "pass" && !reducedMotion,
            focusable: false,
          }
        }),
    [allEdges, layout, result, reducedMotion],
  )

  // Refit whenever the container resizes or the layout kind flips.
  const containerRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    let frame = 0
    const refit = () => {
      if (frame) return
      frame = window.requestAnimationFrame(() => {
        frame = 0
        instance.current?.fitView({ padding: 0.04, duration: 0 })
      })
    }
    const ro = new ResizeObserver(refit)
    ro.observe(el)
    return () => {
      ro.disconnect()
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [kind])

  const selectedNode = nodeById.get(selectedId) ?? nodeById.get(outputId)!
  const selectedResult = result.results.get(selectedNode.id)!

  return (
    <>
      <div className="mt-3 flex flex-wrap items-center gap-3 px-4 md:px-6">
        <Presets presets={scenario.presets} activeId={presetId} onSelect={applyPreset} />
        {isMobile ? (
          <Drawer>
            <DrawerTrigger asChild>
              <Button size="sm" variant="outline" className="ml-auto">
                <SlidersHorizontal className="mr-1.5 h-3.5 w-3.5" aria-hidden /> Adjust inputs
              </Button>
            </DrawerTrigger>
            <DrawerContent className="px-5 pb-8">
              <DrawerHeader className="px-0">
                <DrawerTitle>Inputs</DrawerTitle>
                <DrawerDescription>Change a value and the graph re-evaluates instantly.</DrawerDescription>
              </DrawerHeader>
              <PlaygroundInputs inputs={scenario.inputs} values={values} onChange={setValue} />
            </DrawerContent>
          </Drawer>
        ) : null}
      </div>

      <div ref={containerRef} className="mt-3 w-full" style={{ height: GRAPH_HEIGHT }}>
        <ReactFlow<PlayNode, FlowEdge>
          key={kind}
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.04 }}
          minZoom={0.3}
          maxZoom={1.5}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          nodesFocusable
          edgesFocusable={false}
          panOnDrag={!isMobile}
          panOnScroll={false}
          zoomOnScroll={false}
          zoomOnPinch={!isMobile}
          zoomOnDoubleClick={false}
          preventScrolling={false}
          proOptions={{ hideAttribution: true }}
          onInit={(inst) => {
            instance.current = inst
            onReady?.()
          }}
          aria-label="Rules graph"
        >
          <Background gap={24} size={1} color="hsl(var(--border))" />
        </ReactFlow>
      </div>

      {/* Explain + trace. Desktop: side by side under the graph. Mobile: explain lives in a drawer. */}
      <div className="grid gap-4 border-t px-4 py-4 md:grid-cols-[1.1fr_1fr] md:px-6">
        {isMobile ? (
          <Drawer open={explainOpen} onOpenChange={setExplainOpen}>
            <DrawerContent className="px-5 pb-8">
              <DrawerHeader className="sr-only">
                <DrawerTitle>Explanation</DrawerTitle>
                <DrawerDescription>Why this node has its current value</DrawerDescription>
              </DrawerHeader>
              <ExplainPanel node={selectedNode} result={selectedResult} labelOf={labelOf} onPick={setSelectedId} />
            </DrawerContent>
          </Drawer>
        ) : (
          <ExplainPanel node={selectedNode} result={selectedResult} labelOf={labelOf} onPick={setSelectedId} />
        )}
        {isMobile ? <p className="text-xs text-muted-foreground">Tap any node to see why it has its value.</p> : null}
        <div className={isMobile ? "sr-only" : "min-w-0"}>
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Evaluation trace</p>
          <ol aria-live="polite" aria-atomic="true" className="mt-2 max-h-48 space-y-1 overflow-y-auto font-mono text-[11px] leading-relaxed text-muted-foreground">
            {result.trace.map((line, i) => (
              <li key={i} className={i === result.trace.length - 1 ? "text-foreground" : undefined}>
                <span className="mr-2 opacity-50">{String(i + 1).padStart(2, "0")}</span>
                {line}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </>
  )
}

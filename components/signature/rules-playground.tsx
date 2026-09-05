"use client"

import { Background, Position, ReactFlow, type Edge as FlowEdge, type ReactFlowInstance } from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import { MousePointerClick, RotateCcw } from "lucide-react"
import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { playground, type Preset, type Scenario } from "@/content/playground"
import { useIsMobile } from "@/hooks/use-mobile"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { defaultInputs, edgesOf, evaluate } from "@/lib/rules/engine"
import { NODE_SIZE } from "@/lib/rules/layout"
import type { InputValue, RuleNode as RuleNodeDef } from "@/lib/rules/types"
import { cn } from "@/lib/utils"
import { ExplainPanel } from "./explain-panel"
import { InputNode } from "./nodes/input-node"
import { OutputNode } from "./nodes/output-node"
import { RuleNode } from "./nodes/rule-node"
import type { PlayNode } from "./nodes/shared"
import { Presets } from "./presets"

// Custom type names avoid React Flow's built-in "input"/"output"/"default" node styles.
const nodeTypes = { playInput: InputNode, playRule: RuleNode, playOutput: OutputNode }
const GRAPH_HEIGHT = { desktop: 470, mobile: 700 } as const

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

  // All playground state lives in one reducer so each change can also record which nodes
  // changed (for the downstream ripple) without touching refs during render.
  type State = {
    values: Record<string, InputValue>
    thresholds: Record<string, number>
    presetId: string | null
    interacted: boolean
    rippleKeys: Record<string, number>
    changed: string[]
  }
  type Action =
    | { type: "input"; id: string; value: InputValue }
    | { type: "threshold"; id: string; value: number }
    | { type: "preset"; preset: Preset }
    | { type: "resetThresholds" }

  const graphFor = useCallback(
    (thresholds: Record<string, number>) => ({
      inputs: scenario.inputs,
      nodes: scenario.nodes.map((n) => (n.kind === "compare" && thresholds[n.id] !== undefined ? { ...n, right: thresholds[n.id] } : n)),
    }),
    [scenario],
  )

  const reducer = useCallback(
    (state: State, action: Action): State => {
      let next: State
      switch (action.type) {
        case "input":
          if (state.values[action.id] === action.value) return state
          next = { ...state, values: { ...state.values, [action.id]: action.value }, presetId: null, interacted: true }
          break
        case "threshold":
          if (state.thresholds[action.id] === action.value) return state
          next = { ...state, thresholds: { ...state.thresholds, [action.id]: action.value }, presetId: null, interacted: true }
          break
        case "preset":
          next = { ...state, values: { ...defaultInputs(scenario.inputs), ...action.preset.values }, presetId: action.preset.id, interacted: true }
          break
        case "resetThresholds":
          next = { ...state, thresholds: {} }
          break
      }
      const before = evaluate(graphFor(state.thresholds), state.values).results
      const after = evaluate(graphFor(next.thresholds), next.values).results
      const changed: string[] = []
      const rippleKeys = { ...state.rippleKeys }
      for (const [id, r] of after) {
        const b = before.get(id)
        if (!b || b.state !== r.state || b.value !== r.value) {
          changed.push(id)
          rippleKeys[id] = (rippleKeys[id] ?? 0) + 1
        }
      }
      return { ...next, changed, rippleKeys }
    },
    [scenario, graphFor],
  )

  const [state, dispatch] = useReducer(reducer, scenario, (sc): State => ({
    values: defaultInputs(sc.inputs),
    thresholds: {},
    presetId: sc.presets[0]?.id ?? null,
    interacted: false,
    rippleKeys: {},
    changed: [],
  }))
  const { values, thresholds, presetId, interacted } = state
  const changed = useMemo(() => new Set(state.changed), [state.changed])
  const rippleKeys = state.rippleKeys

  const nodesWithOverrides = useMemo(() => graphFor(thresholds).nodes, [graphFor, thresholds])
  const graph = useMemo(() => ({ inputs: scenario.inputs, nodes: nodesWithOverrides }), [scenario, nodesWithOverrides])
  const inputDefs = useMemo(() => new Map(scenario.inputs.map((i) => [i.id, i])), [scenario])
  const nodeById = useMemo(() => new Map(nodesWithOverrides.map((n) => [n.id, n])), [nodesWithOverrides])
  const allEdges = useMemo(() => edgesOf(graph), [graph])
  const outputId = useMemo(() => scenario.nodes.find((n) => n.kind === "output")!.id, [scenario])
  const labelOf = useCallback((id: string) => nodeById.get(id)?.label ?? id, [nodeById])

  const [selectedId, setSelectedId] = useState<string>(outputId)
  const [explainOpen, setExplainOpen] = useState(false)
  const instance = useRef<ReactFlowInstance<PlayNode, FlowEdge> | null>(null)

  const result = useMemo(() => evaluate(graph, values), [graph, values])

  const setValue = useCallback((id: string, value: InputValue) => dispatch({ type: "input", id, value }), [])
  const setThreshold = useCallback((id: string, value: number) => dispatch({ type: "threshold", id, value }), [])
  const resetThresholds = useCallback(() => dispatch({ type: "resetThresholds" }), [])
  const editedCount = Object.keys(thresholds).length

  const applyPreset = useCallback(
    (preset: Preset) => {
      dispatch({ type: "preset", preset })
      setSelectedId(outputId)
    },
    [outputId],
  )

  const select = useCallback(
    (id: string) => {
      setSelectedId(id)
      if (isMobile) setExplainOpen(true)
    },
    [isMobile],
  )

  const firstInputId = scenario.nodes.find((n) => n.kind === "input" && inputDefs.get(n.input)?.control.type === "toggle")?.id ?? scenario.nodes[0]?.id
  const nodes = useMemo<PlayNode[]>(() => {
    const list: PlayNode[] = []
    for (const def of nodesWithOverrides) {
      const pos = layout[def.id]
      if (!pos) continue
      const r = result.results.get(def.id)!
      const hasSource = allEdges.some((e) => e.source === def.id && layout[e.target])
      const hasTarget = allEdges.some((e) => e.target === def.id && layout[e.source])
      const type = def.kind === "input" ? "playInput" : def.kind === "output" ? "playOutput" : "playRule"
      const inputDef = def.kind === "input" ? inputDefs.get(def.input) : undefined
      // threshold editing: step follows the slider it compares against
      let thresholdStep = 1
      if (def.kind === "compare") {
        const leftNode = nodeById.get(def.left)
        const leftDef = leftNode?.kind === "input" ? inputDefs.get(leftNode.input) : undefined
        if (leftDef?.control.type === "slider") thresholdStep = leftDef.control.step
      }
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
          threshold: def.kind === "compare" ? def.right : undefined,
          thresholdStep,
          thresholdEdited: def.kind === "compare" && thresholds[def.id] !== undefined,
          onThreshold: def.kind === "compare" ? (v: number) => setThreshold(def.id, v) : undefined,
          onSelect: select,
          selected: selectedId === def.id,
          compact: kind === "mobile",
          hasSource,
          hasTarget,
          rippleKey: changed.has(def.id) && !reducedMotion ? (rippleKeys[def.id] ?? 0) : 0,
          rippleDelay: Math.max(0, result.order.indexOf(def.id)) * 45,
          attention: !interacted && def.id === firstInputId && !reducedMotion,
        },
      })
    }
    return list
  }, [nodesWithOverrides, layout, kind, result, values, selectedId, select, setValue, setThreshold, thresholds, allEdges, inputDefs, nodeById, changed, rippleKeys, reducedMotion, interacted, firstInputId])

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
        {editedCount > 0 ? (
          <Button size="sm" variant="ghost" className="ml-auto h-7 text-xs" onClick={resetThresholds}>
            <RotateCcw className="mr-1 h-3 w-3" aria-hidden /> Reset {editedCount === 1 ? "rule" : `${editedCount} rules`}
          </Button>
        ) : null}
      </div>
      <p className="mt-2 flex items-center gap-1.5 px-4 text-xs text-muted-foreground md:px-6">
        <MousePointerClick className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden /> {playground.hint}
      </p>

      <div ref={containerRef} className="mt-3 w-full" style={{ height: GRAPH_HEIGHT[kind] }}>
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
          onNodeClick={(event, node) => {
            // Taps on a control inside the node change a value; they should not also open the explanation.
            const target = event.target as HTMLElement | null
            if (target?.closest("input, button, [role='switch'], [role='slider'], [role='radio'], [role='radiogroup']")) return
            select(node.id)
          }}
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
        {isMobile ? <p className="text-xs text-muted-foreground">Tap any rule or the decision to see why it has its value.</p> : null}
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

"use client"

import { Background, Position, ReactFlow, type Edge as FlowEdge, type ReactFlowInstance } from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import { Button, Column, Dialog, Icon, Row, Text, ToggleButton } from "@once-ui-system/core"
import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react"
import { playground, type Preset, type Scenario } from "@/content/playground"
import { useIsMobile } from "@/hooks/use-mobile"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { defaultInputs, edgesOf, evaluate } from "@/lib/rules/engine"
import { NODE_SIZE } from "@/lib/rules/layout"
import type { InputValue, RuleNode as RuleNodeDef } from "@/lib/rules/types"
import { cn } from "@/lib/utils"
import s from "./playground.module.scss"
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
    <Column fillWidth>
      <Row fillWidth horizontal="between" vertical="center" gap="12" paddingX="24" paddingTop="16" s={{ direction: "column", vertical: "start" }}>
        <Text as="h3" variant="heading-default-l" style={{ fontFamily: "var(--font-heading)", fontSize: "1.25rem" }}>
          {scenario.title}
        </Text>
        <Row role="tablist" aria-label="Scenario" gap="4" border="neutral-alpha-medium" radius="xs" padding="2">
          {playground.scenarios.map((sc) => (
            <ToggleButton key={sc.id} role="tab" aria-selected={sc.id === scenario.id} label={sc.label} selected={sc.id === scenario.id} size="s" variant="ghost" onClick={() => setScenarioId(sc.id)} />
          ))}
        </Row>
      </Row>
      {/* key resets inputs, preset and selection when the scenario changes */}
      <ScenarioPlayground key={scenario.id} scenario={scenario} onReady={onReady} />
    </Column>
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
      <Row fillWidth gap="12" vertical="center" wrap paddingX="24" paddingTop="12">
        <Presets presets={scenario.presets} activeId={presetId} onSelect={applyPreset} />
        {editedCount > 0 ? (
          <Button size="s" variant="tertiary" prefixIcon="reset" label={editedCount === 1 ? "Reset rule" : `Reset ${editedCount} rules`} onClick={resetThresholds} style={{ marginLeft: "auto" }} />
        ) : null}
      </Row>
      <Row gap="8" vertical="center" paddingX="24" paddingTop="8">
        <Icon name="cursorClick" size="xs" onBackground="brand-medium" />
        <Text as="p" variant="body-default-xs" onBackground="neutral-weak">
          {playground.hint}
        </Text>
      </Row>

      <div ref={containerRef} className={s.flow} style={{ height: GRAPH_HEIGHT[kind], width: "100%", marginTop: "0.75rem" }}>
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
          <Background gap={24} size={1} color="var(--neutral-border-weak)" />
        </ReactFlow>
      </div>

      {/* Explain + trace. Desktop: side by side under the graph. Mobile: explanation opens in a dialog. */}
      <Column fillWidth borderTop="neutral-alpha-medium" paddingX="24" paddingY="16" gap="16">
        {isMobile ? (
          <>
            <Text as="p" variant="body-default-xs" onBackground="neutral-weak">
              Tap any rule or the decision to see why it has its value.
            </Text>
            <Dialog isOpen={explainOpen} onClose={() => setExplainOpen(false)} title="Explanation" description="Why this node has its current value">
              <ExplainPanel node={selectedNode} result={selectedResult} labelOf={labelOf} onPick={setSelectedId} />
            </Dialog>
          </>
        ) : (
          <Row fillWidth gap="32" vertical="start" s={{ direction: "column" }}>
            <Column flex={11} minWidth={0}>
              <ExplainPanel node={selectedNode} result={selectedResult} labelOf={labelOf} onPick={setSelectedId} />
            </Column>
            <Column flex={10} minWidth={0}>
              <Text as="p" variant="label-default-s" onBackground="neutral-weak" className="eyebrow">
                Evaluation trace
              </Text>
              <ol aria-live="polite" aria-atomic="true" className={s.trace}>
                {result.trace.map((line, i) => (
                  <li key={i}>
                    <span className={s.n}>{String(i + 1).padStart(2, "0")}</span>
                    {line}
                  </li>
                ))}
              </ol>
            </Column>
          </Row>
        )}
        {isMobile ? (
          <ol aria-live="polite" aria-atomic="true" style={{ position: "absolute", left: -9999 }}>
            {result.trace.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ol>
        ) : null}
      </Column>
    </>
  )
}

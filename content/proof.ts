import type { ProofStat } from "./schema"

export const proof = {
  index: "01",
  eyebrow: "Track record",
  title: "Outcomes from recent engagements",
  line: "Figures are from Patient First.AI (2025 to present) and Brainwave Science (2020 to 2023). Each is verifiable on request.",
  stats: [
    { value: "50,000+", label: "Student records governed by automated compliance rules", source: "Patient First.AI" },
    { value: "1 → 4", label: "University clients served from one multi-tenant deployment", source: "Patient First.AI" },
    { value: "0 min", label: "Downtime during the V1 to V2 platform migration", source: "Patient First.AI" },
    { value: "1 → 6", label: "Engineers on a team formed and led from the first hire", source: "Patient First.AI" },
    { value: "$500K+", label: "Government contracts delivered end to end", source: "Brainwave Science" },
  ] satisfies ProofStat[],
}

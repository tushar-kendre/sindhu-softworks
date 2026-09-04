import type { ProofStat } from "./schema"

export const proof = {
  eyebrow: "Track record",
  line: "Engagements with Patient First.AI, LinkedIn's AI evaluation programs, and Bengaluru startups.",
  stats: [
    { value: "50,000+", label: "student records under automated compliance rules", source: "Patient First.AI" },
    { value: "1 → 4", label: "university clients on one multi-tenant platform", source: "Patient First.AI" },
    { value: "0", label: "downtime during the V1 → V2 platform migration", source: "Patient First.AI" },
    { value: "1 → 6", label: "engineers on a team built and led from scratch", source: "Patient First.AI" },
    { value: "$500K+", label: "government contracts delivered end to end", source: "Brainwave Science" },
  ] satisfies ProofStat[],
}

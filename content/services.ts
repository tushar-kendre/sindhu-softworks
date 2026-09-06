import type { Principle, Service } from "./schema"

export const services = {
  index: "02",
  eyebrow: "Services",
  title: "Three engagement models",
  intro: "Every engagement is led by the founder from first call to handover. There is no account layer and no bench.",
  items: [
    {
      id: "product-engineering",
      title: "Product engineering for regulated domains",
      oneLiner: "Healthcare, compliance and other settings where an unexplained decision is a liability.",
      youGet: [
        "Rule and policy engines whose decisions can be traced node by node",
        "Multi-tenant platforms with tenant isolation designed into the data model",
        "Document pipelines: OCR, asynchronous parsing, routing to human review",
        "HIPAA-aware architecture with audit trails and field-level change history",
        "Migrations without downtime, using dual-run parity checks and feature flags",
      ],
      shape: "Retainer of three to six months, or a fixed-scope build preceded by a written architecture baseline.",
      goodFitIf: [
        "A regulator or a customer will ask why the system decided what it decided",
        "A V1 must keep running while V2 replaces it",
        "The team is small and needs one engineer who owns the whole stack",
      ],
      stack: ["TypeScript", "Node / Fastify", "PostgreSQL", "Prisma / Drizzle", "Keycloak", "AWS", "Terraform", "FHIR R4"],
    },
    {
      id: "ai-evaluation",
      title: "AI evaluation and data programs",
      oneLiner: "Benchmarks, annotation programs and the tooling that keeps their results trustworthy.",
      youGet: [
        "Task and rubric design for coding, agent-trajectory and search-relevance evaluations",
        "Configuration-driven evaluation harnesses: one engine, many benchmarks, resumable runs",
        "Annotation operations: annotator playbooks, verification passes, delivery formats",
        "Campaign metrics dashboards with drill-down to the underlying tasks",
        "Export and ingestion tooling for annotation platforms",
      ],
      shape: "Program lead on a monthly retainer, or a scoped tooling build with documented handover.",
      goodFitIf: [
        "Human-in-the-loop data programs are running and quality is drifting",
        "Benchmark scripts exist that nobody maintains and results that nobody trusts",
        "One person needs to manage annotators and write the pipeline",
      ],
      stack: ["Python", "FastAPI", "Pydantic", "Next.js", "Drizzle", "ECharts", "Claude API"],
    },
    {
      id: "fractional",
      title: "Fractional architecture and first releases",
      oneLiner: "From a design document to a running product, with the decisions recorded.",
      youGet: [
        "Architecture baselines and decision records the next engineer can read",
        "Mobile and web releases on a shared TypeScript monorepo",
        "Authentication, billing and data models set up correctly the first time",
        "Infrastructure as code from the first commit, sized for a small team",
        "A clear boundary between what ships now and what is deliberately deferred",
      ],
      shape: "Advisory hours each week, or a six to ten week build with weekly demonstrations.",
      goodFitIf: [
        "A founder has a validated idea and no technical co-founder yet",
        "An engineering team needs a senior reviewer rather than a manager",
        "A product brief exists as a document and needs to become software",
      ],
      stack: ["Expo / React Native", "Next.js", "Fastify", "Drizzle", "Keycloak", "Docker", "GitHub Actions"],
    },
  ] satisfies Service[],
  principlesTitle: "Working principles",
  principles: [
    { title: "Logic as data", body: "Rules, policies and workflows are declarative definitions that can be read, diffed and versioned. Code interprets them and does not conceal them." },
    { title: "Observable from the first release", body: "Correlation identifiers, audit trails and before-and-after change tracking ship with the first feature, not after the first incident." },
    { title: "No maintenance windows", body: "Expand, run in parallel, verify parity, cut over, contract. Releases do not depend on a weekend." },
    { title: "Decisions in writing", body: "Each engagement leaves an architecture baseline and decision records behind. The reasoning outlives the contract." },
  ] satisfies Principle[],
}

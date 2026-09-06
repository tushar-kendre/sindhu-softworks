import type { CaseStudy } from "./schema"

export const work = {
  index: "03",
  eyebrow: "Selected work",
  title: "Engagements and independent builds",
  intro: "Production systems, active builds and designs in progress. Client names appear where permission has been given; otherwise the sector is stated.",
  openSourceTitle: "Open source",
  items: [
    {
      slug: "vactrack",
      title: "Vaccination compliance platform for universities",
      line: "product-engineering",
      client: { name: "Patient First.AI", public: true, sector: "Healthtech", region: "Boston, USA" },
      role: "Senior engineer and architect; contracted via Sindhu Softworks since 2026",
      period: "2025 – present",
      summary:
        "Re-architected a HIPAA-oriented vaccination-compliance platform from V1 to V2 with no downtime, then extended it from one university to four on a single multi-tenant deployment.",
      problem:
        "The V1 system encoded each university's immunization policy in application code. Each new client required a fork of the rules, and no one could explain to a registrar why a particular student had been flagged.",
      approach: [
        "Designed a DAG-based compliance engine with a 29-node DSL. Universities author, validate, simulate and publish policies themselves, with draft → publish → rollback governance.",
        "Ran V1 and V2 in parallel with dual-run parity validation and feature-flagged rollout, then cut over with zero downtime.",
        "Built the OCR and async Lambda document pipeline for immunization records, routing low-confidence extractions to human review.",
        "Added full-stack observability: correlation IDs, field-level before/after audit history, CloudWatch alerting.",
        "Grew and led the engineering team from one to six.",
      ],
      outcomes: [
        { label: "University clients", value: "1 → 4" },
        { label: "Student records", value: "50,000+" },
        { label: "Policies authored by clients", value: "100+" },
        { label: "OCR extraction accuracy", value: "> 95%" },
      ],
      stack: ["TypeScript", "Fastify", "Prisma", "PostgreSQL", "React", "Keycloak", "AWS Lambda / ECS", "Terraform"],
      status: "live",
      featured: true,
    },
    {
      slug: "linkedin-eval-tooling",
      title: "AI coding-pod evaluation programs and tooling",
      line: "ai-evaluation",
      client: { name: "LinkedIn", public: true, sector: "AI / annotation", region: "Remote" },
      role: "Annotation strategy, program management and tooling",
      period: "2026 – present",
      summary:
        "Program strategy, quality management and purpose-built tooling for human-in-the-loop evaluation of coding agents: sub-agent trajectories, code-search relevance and side-by-side conversation judgements.",
      problem:
        "Benchmarks ran on one-off scripts per task type. Results were difficult to reproduce, annotator quality was difficult to see, and each export from the annotation platform was manual work.",
      approach: [
        "Wrote the tasker playbooks and reviewer instructions that define what a good annotation looks like, then ran verification passes on delivered batches.",
        "Built benchkit, a config-driven LLM evaluation engine: one generic pipeline, one short YAML per benchmark, resumable cached runs, a dashboard with live-streaming logs.",
        "Built Metrics Dash, a node-graph dashboard builder for annotation campaigns: import a platform export, wire scope → metric → chart, drill down to the tasks behind any number.",
        "Wrote stdlib-only export tooling that pulls thousands of tasks with full history from the annotation platform in minutes.",
      ],
      outcomes: [
        { label: "Built-in campaign metrics", value: "26" },
        { label: "Task export throughput", value: "~18 tasks / s" },
        { label: "Benchmarks on one engine", value: "Several, zero engine forks" },
      ],
      stack: ["Python", "FastAPI", "Pydantic", "Next.js", "Drizzle", "PostgreSQL", "@xyflow/react", "ECharts"],
      status: "active",
      featured: true,
    },
    {
      slug: "playhook",
      title: "Sports venue booking for Bengaluru",
      line: "fractional",
      client: { name: "Playhook", public: true, sector: "Consumer / sports", region: "Bengaluru, India" },
      role: "Founding engineer",
      period: "2026 – present",
      summary:
        "Court and turf booking for individuals and groups, with cost splitting. A mobile-first first release on a shared TypeScript monorepo.",
      problem:
        "Group bookings in the city are arranged over chat threads and payment screenshots. Venues publish no live availability, and organisers absorb the cost of no-shows.",
      approach: [
        "Expo + Expo Router app with NativeWind, TanStack Query and Zustand.",
        "Fastify 5 API with Drizzle on Postgres 16; Keycloak 26 with PKCE for auth.",
        "pnpm monorepo with shared zod schemas between app and API; Docker for local infra.",
      ],
      outcomes: [
        { label: "Status", value: "Running MVP with seeded venues" },
        { label: "Sports covered", value: "5" },
      ],
      stack: ["Expo", "React Native", "Fastify", "Drizzle", "PostgreSQL", "Keycloak", "pnpm"],
      status: "active",
      featured: true,
    },
    {
      slug: "statekernel",
      title: "StateKernel: a state-machine-first application framework",
      line: "fractional",
      client: { name: "Sindhu Softworks", public: true, sector: "Developer tooling", region: "Open core" },
      role: "Author",
      period: "2026 – design",
      summary:
        "State machines as the primitive. Guards double as authorisation, transitions are statically verifiable, and guard checks are pushed down into the storage layer.",
      problem:
        "Most back ends scatter lifecycle logic across handlers, scheduled jobs and database triggers. The state of a record is whatever the last writer left behind.",
      approach: [
        "Design document v1.1 and eight ADRs covering the machine model, guard language (CEL), verification and storage connectors.",
        "Postgres and SQLite connectors specified with guard push-down so authorization happens where the data is.",
      ],
      outcomes: [{ label: "Status", value: "Design complete, implementation next" }],
      stack: ["TypeScript", "CEL", "PostgreSQL", "SQLite"],
      status: "design",
      featured: false,
    },
    {
      slug: "medspa-emr",
      title: "Multi-tenant EMR for aesthetic clinics",
      line: "product-engineering",
      client: { name: "Tivortech", public: false, sector: "Aesthetics / healthcare", region: "USA" },
      role: "Architecture and data design",
      period: "2026",
      summary:
        "Architecture baseline and data model for a HIPAA-oriented, multi-tenant EMR: charting, scheduling, memberships, lot-traceable inventory and a patient portal.",
      problem:
        "A clinic group needed one platform across locations with strict tenant isolation, an interop boundary for labs and pharmacies, and BI that does not leak PHI.",
      approach: [
        "Modular monolith baseline with a FHIR R4 + HL7 v2 interop boundary.",
        "Schema with composite tenant foreign keys, exclusion constraints for scheduling, an audit PHI allowlist and an outbox for integration events.",
        "Keycloak with a shared staff realm and isolated patient population.",
      ],
      outcomes: [{ label: "Status", value: "Architecture and schema baseline delivered" }],
      stack: ["NestJS / Fastify", "Drizzle", "PostgreSQL", "Keycloak", "FHIR R4", "AWS ECS", "Terraform"],
      status: "design",
      featured: false,
    },
    {
      slug: "rcube-js",
      title: "rcube-js",
      line: "fractional",
      client: { name: "Open source", public: true, sector: "Graphics", region: "GitHub" },
      role: "Author",
      period: "2025 – 2026",
      summary: "An interactive 3D Rubik's Cube in the browser. React Three Fiber, keyboard and pointer controls, tested with Vitest.",
      problem: "A small project to learn quaternion rotation properly.",
      approach: ["React Three Fiber scene with a pure cube-state model.", "Vitest coverage for the move engine."],
      outcomes: [{ label: "Live", value: "GitHub Pages" }],
      stack: ["React", "Three.js", "TypeScript", "Vite"],
      status: "live",
      featured: false,
      openSource: true,
      links: [
        { label: "Open", href: "https://tushar-kendre.github.io/rcube-js/" },
        { label: "Source", href: "https://github.com/tushar-kendre/rcube-js" },
      ],
    },
    {
      slug: "lyra",
      title: "Lyra",
      line: "ai-evaluation",
      client: { name: "Open source", public: true, sector: "Education", region: "GitHub" },
      role: "Co-author",
      period: "2025",
      summary: "Upload a CSV, configure a small neural network, and watch forward and backward passes animate against a live loss curve.",
      problem: "Backpropagation is easier to reason about once it has been watched step by step.",
      approach: ["TensorFlow.js in the browser, PixiJS for the animated network, React Flow for the architecture editor, XState for the training loop."],
      outcomes: [{ label: "Status", value: "Working prototype" }],
      stack: ["Next.js", "TensorFlow.js", "PixiJS", "@xyflow/react", "XState"],
      status: "active",
      featured: false,
      openSource: true,
      links: [{ label: "Source", href: "https://github.com/tanvisharmaaa/Lyra" }],
    },
  ] satisfies CaseStudy[],
}

/** Display name honouring the client's naming permission. */
export function clientLabel(c: CaseStudy["client"]): string {
  return c.public ? c.name : `${c.sector} company, ${c.region}`
}

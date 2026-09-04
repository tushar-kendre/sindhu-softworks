import type { Principle, Service } from "./schema"

export const services = {
  eyebrow: "Services",
  title: "Three ways to work with us",
  intro:
    "Every engagement is led hands-on by the founder. No account managers, no hand-offs to a bench.",
  items: [
    {
      id: "product-engineering",
      title: "Product engineering for regulated domains",
      oneLiner: "Healthcare, compliance and other places where a wrong answer has consequences.",
      youGet: [
        "Rules and policy engines whose decisions can be traced node by node",
        "Multi-tenant platforms with tenant isolation designed in, not bolted on",
        "Document pipelines: OCR, async parsing, human-review routing",
        "HIPAA-aware architecture, audit trails and field-level change history",
        "Zero-downtime migrations with dual-run parity checks and feature flags",
      ],
      shape: "3 to 6 month retainer, or a fixed-scope build with a written architecture baseline first.",
      goodFitIf: [
        "You need to show a regulator or a customer why the system decided what it decided",
        "You are replacing a V1 that cannot go offline while V2 lands",
        "Your team is small and needs one person who owns the whole stack",
      ],
      stack: ["TypeScript", "Node / Fastify", "PostgreSQL", "Prisma / Drizzle", "Keycloak", "AWS", "Terraform", "FHIR R4"],
    },
    {
      id: "ai-evaluation",
      title: "AI evaluation and data programs",
      oneLiner: "Benchmarks, annotation programs and the tooling that keeps them honest.",
      youGet: [
        "Task and rubric design for coding, agent-trajectory and search-relevance evals",
        "Config-driven eval harnesses: one engine, many benchmarks, resumable runs",
        "Annotation operations: tasker playbooks, QA and verification passes, delivery formats",
        "Campaign metrics dashboards with drill-down to the underlying tasks",
        "Export and ingestion tooling for annotation platforms",
      ],
      shape: "Program lead on a monthly retainer, or a scoped tooling build with a handover.",
      goodFitIf: [
        "You run human-in-the-loop data programs and quality is drifting",
        "You have benchmark scripts nobody wants to touch and results nobody trusts",
        "You need someone who can both manage annotators and write the pipeline",
      ],
      stack: ["Python", "FastAPI", "Pydantic", "Next.js", "Drizzle", "ECharts", "OpenRouter / Claude API"],
    },
    {
      id: "fractional",
      title: "Fractional architecture and 0 → 1 builds",
      oneLiner: "From a design doc to a running MVP, with the decisions written down.",
      youGet: [
        "Architecture baselines and ADRs your next hire can actually read",
        "Mobile and web MVPs on a shared TypeScript monorepo",
        "Auth, billing and data models set up right the first time",
        "Infrastructure as code from day one, sized for a small team",
        "A clear line between what ships now and what is deliberately deferred",
      ],
      shape: "Advisory hours per week, or a 6 to 10 week MVP sprint with weekly demos.",
      goodFitIf: [
        "You are a founder with a validated idea and no technical co-founder yet",
        "You have an engineering team that needs a senior reviewer, not a manager",
        "Your product brief is a document and you want it to become software",
      ],
      stack: ["Expo / React Native", "Next.js", "Fastify", "Drizzle", "Keycloak", "Docker", "GitHub Actions"],
    },
  ] satisfies Service[],
  principlesTitle: "How we work",
  principles: [
    { title: "Logic as data", body: "Rules, policies and workflows live in declarative definitions you can read, diff and version. Code interprets them; it does not hide them." },
    { title: "Observable from day one", body: "Correlation IDs, audit trails and before/after change tracking ship with the first feature, not after the first incident." },
    { title: "Migrate without a maintenance window", body: "Expand, dual-run, verify parity, cut over, contract. Nobody's Monday morning depends on a Sunday deploy." },
    { title: "Decisions written down", body: "Every engagement leaves behind an architecture baseline and ADRs. The reasoning outlives the engagement." },
  ] satisfies Principle[],
}

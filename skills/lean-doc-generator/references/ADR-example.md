<!-- Illustrative worked example of a rich ADR (from a real ORM-migration decision). Shows the
     format in `templates/ADR.md.template` filled out well — note the measured blast radius, the
     ≥1 Negative consequence, and the alternatives with reasons. Not lean-flow's own decision. -->

# ADR-001 — Migrate ORM from Prisma to Drizzle

- **Status:** Accepted (2026-05-24)
- **Deciders:** Owner
- **Context driver:** hosting/cost target (serverless / low-RAM)

## Context

The project targets serverless / edge / low-RAM hosting. Prisma ships a **Rust query engine**
alongside Node plus a heavy generated client; on memory-constrained and cold-start-sensitive runtimes
this directly costs RAM, cold-start latency, and money. The owner wants a lighter data layer.

Two enabling conditions make now the right time:
- **No production data yet** — an ORM migration is dramatically cheaper with zero data to preserve. This is the cheapest window there will be.
- The project is on `prisma db push` with **no migration history** — switching ORM lets us solve that gap with Drizzle Kit instead.

## Measured blast radius (so this isn't a guess)

- **240** `this.prisma.*` call sites across **21** server files.
- **5** `$transaction` blocks — 2 interactive (`auth.registerTenant`, `transactions.checkout`) + 3 batch. These atomic flows + tenant isolation are the highest-risk part.
- **26** Prisma models.

Verdict: bounded but substantial — days of focused work, risk concentrated in the 5 transactions and tenant-scoping filters.

## Decision

**Adopt Drizzle ORM + Drizzle Kit; migrate the data layer module-by-module behind the existing
service seam.** For the stated serverless/cost driver Drizzle is arguably the correct tool (no engine
process, far lighter, no codegen, TS-native inferred types, fast cold start), and Drizzle Kit gives
us the migration history we lack. The no-data timing makes the one-time cost acceptable.

## Consequences

**Positive:** materially lower memory + cold-start + cost on serverless (the driver); migration
history via Drizzle Kit; TS types without a codegen step; the rewrite forces the first real tests on
the highest-risk paths.

**Negative (trade-offs accepted):** substantial one-time rewrite (240 call sites); team learns
Drizzle's query API; relational queries less ergonomic than Prisma `include`; risk of tenant-isolation
regressions (mitigated by writing the isolation + checkout tests first).

## Alternatives considered

| Option | Why rejected |
|---|---|
| Stay on Prisma + optimize (pooling, Accelerate, fix over-fetch) | Doesn't remove the engine footprint that the serverless/cost driver is about. *(But the "load all rows into memory and aggregate in JS" report bug must be fixed with SQL aggregation regardless of ORM — don't let the migration mask it.)* |
| Keep Prisma, defer the hosting decision | The owner has committed to a serverless/low-RAM target — exactly where Prisma's cost shows. |

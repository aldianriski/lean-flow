---
epic: 007
slug: workflow-packs
owner: Maintainer
last_updated: 2026-08-24
status: proposed
member_sprints: []
update_trigger: a member sprint closes, or a decision lands that changes the outcome
---

# EPIC-007 — Workflow Packs

> **Outcome:** lean-flow's proven procedures are expressed as model-independent Expert Workflow Packs
> with a declared contract, so expertise is reusable without taking the plugin — and the ADLC
> abstraction is under real pressure from more than one workflow family.

## Why this, why now

This is roadmap **Phase E** (Layer E in `01-ADLC-PLATFORM-ARCHITECTURE.md`), and the roadmap lists it
after Phase D. That ordering is wrong on the roadmap's own evidence, which is why it opens now instead.

`03 § 5`'s platform decision gate requires *"at least 2 runtime **or workflow** variations prove
abstraction pressure."* Workflow packs satisfy the workflow half of that clause. They depend only on the
Standard, which closed with EPIC-003 at `spec/` v0.9.0 — **nothing in Phase E needs the protocol.**
Leaving it after Phase D leaves a gate condition blocking that has no blocker of its own
(`docs/research/adlc-epic-sequencing.md` F5).

`03` Phase E also says to *"start with 3–5 workflow packs that already have real internal use"* — and
lean-flow has fourteen skills that are exactly that. This is extraction from proven procedure, not
invention, which is the cheapest possible way to buy a gate condition.

It spans sprints because each pack must declare eight contract fields and be *verified* against real
use rather than asserted, because the pack's placement is a §2 decision, and because the last exit
condition is a consumer-path exercise (L-016) that cannot run until at least one pack is complete.

## Scope

**In:** a pack declaration contract (`purpose` · `inputs` · `procedure` · `capabilities` · `output
contract` · `verification` · `escalation` · `risk policy`) · 3–5 packs extracted from procedures with
demonstrated internal use · a conformance mark or check for a pack declaration · one pack exercised
without the plugin present.

**Out (explicitly not):** **an agent zoo** — `00-ADLC-NORTH-STAR.md § 7` and `03 § 4` both name it, and
pack count is not agent count; a custom agent is admitted only at a genuine capability/policy boundary
(North Star § 6), which is the same bar CLAUDE.md's *curated, not copied* already applies · runtime
adapters and the gateway (Phase F) · the Run Protocol (EPIC-008) · non-software workflow families
(Phase H, demand-gated by design) · model identity — a pack must not own it (`01` Layer E).

## Member sprints
<!-- Contribution rows live in docs/epic/logs/EPIC-007-workflow-packs.md per ADR-030. -->

→ [`logs/EPIC-007-workflow-packs.md`](logs/EPIC-007-workflow-packs.md) — appended at each member close.

## Decisions

- **D1** — Packs are **extracted from procedures with real internal use, never invented** (`03` Phase E).
  This has a consequence worth stating before it is discovered at G2: of `03`'s five recommended
  families, `solution-analysis`, `software-implementation`, `verification` and `security-review` all map
  onto procedures this repo actually runs — but **`proposal-development` has no internal use here at
  all**, so D1 excludes it. Four packs, not five, unless a fifth with real use is named.
- **D2** — A pack **does not own model identity** (`01` Layer E). Routing stays ADR-010's role table
  (`decision` / `execution` / `mechanical-ingest`). A pack that pinned a model would make the Standard
  depend on one vendor, which `01` Layer A forbids.
- **D3** — Runs in **Lane 2, behind EPIC-006**, because both edit `skills/`. Named here as a sequencing
  fact so the overlap is planned rather than discovered mid-sprint (`adlc-epic-sequencing.md` F3).
- **D4** — Tier under ADR-029 is declared per member task at G2, not assumed epic-wide. The pack
  *contract check* is Tier **G** if it gates conformance; the pack documents themselves are Tier **P**.
  Default up when unsure.

## Open questions

- Where does a pack live — inside `spec/` as normative, a new top-level tree, or beside the skill it was
  extracted from? → **ADR-grade if it adds a §2 row**; ADR-030 and ADR-031 are the live precedents for
  how a new tree gets admitted. Settle at the first member sprint's G2.
- Does the pack *contract* belong to Layer A (the Standard) or Layer E (beside it)? `01` separates them,
  but conformance must be able to check a pack declaration and the engine reads spec rules — so the
  clean layering and the checkability pull opposite ways. → same G2; `/council` if genuinely balanced.
- Does a workflow pack **alone** satisfy decision-gate condition 6, or does the clause's *"runtime or
  workflow"* require a second runtime as well? → a **judgement call**, so it closes by ruling (L-094).
  Rule it before claiming the condition met, never after — a gate condition claimed on a reading nobody
  ruled is L-088's move.
- What does "reusable without the plugin" mean concretely for the exit condition — readable by a human,
  or executable by another runtime? → resolve before the last exit condition is written into a Plan; a
  criterion resting on an undecided ruling is L-111's trap.

## Closed when

- [ ] A pack declaration contract exists with all eight fields, and a pack declaration is checkable
- [ ] 3–5 packs are extracted, each naming the internal use that qualified it under D1
- [ ] At least one pack is exercised end-to-end **with no lean-flow plugin present** — the consumer path,
      asserted mechanically the way EPIC-004's foreign-repo harness asserts no file was copied in (L-016)
- [ ] No pack owns a model identity; routing is still ADR-010's roles — asserted, not assumed
- [ ] Decision-gate condition *"≥2 runtime/workflow variations prove abstraction pressure"* is recorded
      as satisfied, or explicitly ruled not-satisfied-by-packs-alone with the reason

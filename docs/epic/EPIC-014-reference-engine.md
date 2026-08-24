---
epic: 014
slug: reference-engine
owner: Maintainer
last_updated: 2026-08-24
status: active
member_sprints: [SPRINT-083]
update_trigger: a member sprint closes, or a decision lands that changes the outcome
---

# EPIC-014 — Reference Engine

> **Outcome:** lean-flow's conformance and QA semantics are evaluated by a typed TypeScript/Bun
> reference implementation that holds authority, proven equal per rule family to the Shell engine it
> retires, rendering one domain result to both text and JSON — while `spec/STANDARD.md` stays the
> unchanged normative source and the plugin consumer's install path still needs no toolchain.

**The Standard is not the implementation.** `spec/STANDARD.md` remains normative, model-agnostic and
runtime-agnostic; TypeScript is a *reference* representation of it and must stay replaceable without
changing lean-flow's meaning. An epic that blurs that line has made the engine the standard, which is
the one thing this outcome denies.

## Why this, why now

The Shell engine proved the rules and is now the wrong foundation for the next growth stage:
**57 scripts, 12,718 LOC**, dominated by `scripts/lib/conformance-engine.sh` (3,111) and
`scripts/qa-check.sh` (838) — with Markdown treated as semi-structured database text through repeated
`grep`/`awk`/`sed`/`git` process spawning, serial QA orchestration, and fixture runners re-invoking the
whole engine. Every new rule family pays that cost again.

It spans sprints because the migration is a **strangler**, not a rewrite: each rule family needs
RED → GREEN → **PARITY** → REFACTOR against a Shell comparand that keeps authority until parity passes,
and because authority cutover and Shell deletion are their own boundaries (V3 §44/§45) that cannot be
reached inside one 400-line Plan.

**Sequenced ahead of EPIC-005** — owner ruling 2026-08-24, per V3 §61: harden the foundation, then
return to the roadmap. EPIC-005's first member sprint follows this epic rather than SPRINT-082.

## Scope

**In:** the frozen semantic compatibility contract · a strict TS/Bun workspace whose Clean-Architecture
dependency direction is *mechanically* enforced · an AST Standard parser producing a typed model ·
conformance result domain + OCP rule registry + repository ports/facts · targeted and full conformance
CLI · QA severity model, document budgets, `fast`/`standard`/`full` profiles, scheduler and timing ·
differential parity for both engines · compiled binary + smoke · authority cutover and removal of the
superseded Shell semantic engine · JSON renderer and stable contract tests (V3 H01–H26, H38–H40).

**Out (explicitly not):** dashboard UI · Control Plane service · database · event store · message queue ·
gateway · runtime adapters · the full ADLC Run Protocol (**EPIC-008** owns it — this engine must not
invent it early, V3 §41) · any edit to `spec/STANDARD.md`'s normative content · byte-identical stdout ·
publishing packages to npm · the execution/workflow stream (**EPIC-015**).

## Member sprints
<!-- Contribution rows live in docs/epic/logs/EPIC-014-reference-engine.md per ADR-030, created
     lazily at the first member close. -->

| Sprint | Theme | Status | What it contributed to the outcome |
|---|---|---|---|
| [SPRINT-083](../sprint/SPRINT-083-ts-bun-foundation.md) | TS/Bun Foundation — contract freeze · workspace · fitness tests · Standard domain model | active · promoted 2026-08-24 | _(completed at close)_ |

Planned shape after 083 (V3 §42 — **not** promoted, and each re-derived at its own promote): Standard
parser + Shell parity → first conformance vertical slice + targeted CLI → full orchestrator + first
migrated families → QA core → eval migration + binary → authority cutover + Shell removal.

## Decisions

- **D1** — **The Standard stays Markdown and normative; TS is a replaceable reference implementation**
  (V3 §0/§47). **→ ADR at SPRINT-083's G2** — introducing a compiled toolchain into a
  markdown-and-skills plugin is hard-to-reverse, surprising, and carries a real trade-off (STANDARD §4).
- **D2** — **Strangler, never rewrite** (V3 §26/§44). Shell keeps authority per family until all
  retained must-FAIL cases pass, all controls pass, differential parity passes, intentional differences
  are *ruled*, and performance is measured. Never "most tests look green." Two permanent semantic
  engines is the failure mode, so §45's deletion is in scope, not aspirational.
- **D3** — **Compatibility is frozen on semantics, never on bytes** (V3 §25): Rule ID · Finding ID ·
  Severity · rule inclusion/exclusion · Hold semantics · full-run level · exit meaning. Whitespace, wrap
  and non-semantic log order are explicitly *not* frozen.
- **D4** — **The dependency direction is mechanically tested, not remembered** (H03). Developer memory
  is not a guard; the fitness tests carry a must-FAIL fixture proving an illegal import is caught.
- **D5** — **Feature-first, not layer-first** (V3 §3/§49) — with **SPRINT-083 the single ruled
  exception**: a vertical slice cannot precede the workspace it lives in. Every sprint after 083 is
  rejected at G2 if it is framed only as a technical layer with no working behaviour at close.
- **D6** — **The consumer must not be required to install Bun** (L-015). Compiled binaries (H22) plus
  thin `sh conformance.sh` → `leanflow conformance` wrappers (V3 §46) carry it. Checked on the
  **consumer path**, since dogfooding structurally cannot see it (L-016).
- **D7** — **Typed contracts now, infrastructure later** (V3 §38). `packages/contracts` holds only
  cross-boundary data and is not a shared dumping ground (V3 §13). No DB, queue, broker or worker.
- **D8** — **ADR-029 tiers, declared not inferred:** the parser, registry, evaluators, parity harness
  and fitness tests are Tier **G** (a false negative is silent by construction); renderers, adapters,
  CLI plumbing and fixture factories are Tier **X**; the compatibility contract and boundary docs are
  Tier **P**. Default up; re-tier on discovery.

## Open questions

- **Where does the TS workspace live relative to the plugin root?** `apps/` + `packages/` at repo root
  meets the Claude Code plugin spec's root-level component discovery, and adds STANDARD §2 rows. →
  **SPRINT-083 G2; ADR-grade if it adds a §2 row** (ADR-023's precedent).
- **Which rule families migrate first?** → a **measurement, so it accumulates** (L-094): profile the
  Shell engine for runtime and process-spawn cost first. V3 §43 forbids ordering by section number.
  Do not freeze the order before the profile exists (L-130).
- **Does the TS engine ever become a consumer-installable dependency, or stay internal?** → a
  **judgement call, closed by ruling** (L-094) — ruled at the H24/H25 cutover sprint, never parked
  waiting for a measurable signal that cannot arrive.
- **What is the real frozen rule-ID denominator?** Three sources disagree today —
  `scripts/lib/read-spec-rules.sh` emits **100** unique IDs, the `Sn.NAME` grep shape matches **79**,
  and EPIC-004 closed on **51 of 51 rules**. → **SPRINT-083 T1 derives it**; no number written here is
  carried forward into the contract (L-130 · L-108).

## Closed when

- [ ] `spec/STANDARD.md` is parsed **by AST to a typed model**, not by ported regex, and the semantic
      rule set matches `scripts/lib/read-spec-rules.sh` on the real Standard *and* on retained
      malformed fixtures — asserted row-by-row, not in aggregate
- [ ] Targeted (`--rule` / `--section`) and full conformance both run in TS, and a **partial invocation
      never emits a global conformance level**; an unknown rule fails loudly
- [ ] Every migrated rule family carries its **retained must-FAIL + sibling control**, differential
      parity passes, and each family is named individually at cutover — never "most"
- [ ] QA runs `fast` / `standard` / `full` with **WARN ≠ FAIL** and HOLD preventing a false close, and
      every check reports `durationMs`
- [ ] **TS/Bun holds authority** for QA and conformance, and the superseded Shell semantic engine is
      **deleted** — not kept as `legacy` / `old` / `fallback` (V3 §45). Operational shell glue may remain
- [ ] **One domain result feeds both text and JSON renderers** — no second evaluation path, and no
      consumer parses CLI prose
- [ ] A **before/after performance report** exists over the same workload, same environment and same
      semantic coverage, with known intentional differences listed (V3 §57)
- [ ] **The consumer install path still needs no Bun toolchain** — verified on the consumer path, not
      inferred from this repo's dogfooding (L-015 · L-016)

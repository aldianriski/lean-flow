---
epic: 003
slug: the-standard
owner: Maintainer
last_updated: 2026-08-16
status: active
member_sprints: [069]
update_trigger: a member sprint closes, or a decision lands that changes the outcome
---

# EPIC-003 — The Standard

> **Outcome:** lean-flow's specification is a versioned artifact an organisation can adopt, cite and
> pin independently of any CLI plugin — and the skill pack is documented as its first conformant
> implementation rather than as the standard itself.

## Why this, why now

The specification is **`spec/STANDARD.md`** — **497** lines, moved at SPRINT-069 T2 out of one
skill's references folder and now versioned independently (v0.1.0) with its own changelog
(`docs/research/platform-readiness-audit.md` F3 is the pre-move finding). An adopter still cannot
take the *whole* standard without taking the tool while conformance levels, attestation and
re-pointed skills remain open (see § Closed when); T2 is the first step that makes the claim true.

<!-- The line figure has now been wrong twice in this paragraph, both times by being remembered
     rather than measured (L-097): the epic was drafted at 450, SPRINT-069's promote re-measured 489,
     and the move added an ownership header the standard never had, giving 497. Re-measure it, never
     copy it forward. ADR-018 keeps its own 450 — an accepted ADR is append-only and was accurate
     when written. -->


It spans sprints because the spec is not one file: the doc standard, the gate contract, the
task/sprint/epic schema and the HITL attestation format are today spread across `STANDARD.md`,
`.claude/CONTEXT.md` and four skills, each restating parts of the others. Separating them without
creating a second SSOT is the work.

**Git-native attestation is specified here, not built here.** The mechanism — a `Gate-Signed-By:` /
`Gate:` / `Evidence:` trailer on each task's own commit, plus optional commit signing — is stronger
than today's `gates_signed: G1,G2 @ <sha>`, not weaker (F5): it raises granularity from sprint-batch
to per-task, takes identity from the commit author and signature, and is verifiable by anyone with a
clone with no service to run or trust. EPIC-004 builds the checker that reads it.

## Scope

**In:** extract the spec into a versioned `spec/` tree with its own semver + changelog · define
conformance levels · specify the git-native HITL attestation format · re-point every skill at the
spec so a rule has exactly one home · ADR the split.

**Out (explicitly not):** building the conformance checker (EPIC-004) · cross-repo governance
(EPIC-005) · writing a second implementation for another CLI — the three existing manifests
(Claude Code · Codex · Kimi) are the conformance evidence, not a new port.

## Member sprints

| Sprint | Theme | Status | What it contributed to the outcome |
|---|---|---|---|
| [SPRINT-069](../sprint/archive/SPRINT-069-first-extraction.md) | First Extraction | closed 2026-08-16 · `b744fed` | Made the standard **separable and pinnable**: `spec/STANDARD.md` at v0.1.0 with its own changelog, versioning independently of the plugin — which is condition 1 outright. Ruled the **conformance levels** (ADR-024, condition 3), the ruling the epic routed to its first member's G2. Left the epic's harder half untouched by design: attestation and the no-skill-restates-a-rule pass are later members. |

## Decisions

- **D1** — The standard is extracted from the implementation rather than grown inside it.
  **→ [ADR-018](../adr/ADR-018-standard-implementation-split.md).**
- **D2** — HITL attestation is git-native (commit trailers + optional signing), not a bespoke record
  or an external service. **→ ADR pending**, once the trailer format is designed against a real
  sprint's commits.
- **D3** — The spec versions independently of `plugin.json`. Lockstep is a property of the *manifests*
  (ADR-012 era), and binding a standard's version to a plugin's patch releases would make every
  consumer's pin move for reasons that have nothing to do with the standard.

## Open questions

- ~~What the conformance levels are, and how many → first member sprint's G2. Candidate shape:
  structure → gates → attested; the count matters less than each level being independently
  checkable.~~ **Answered 2026-08-16 (SPRINT-069 T1) → [ADR-024](../adr/ADR-024-conformance-levels.md):**
  three — **Structural → Gated → Attested**, the candidate shape confirmed. Each rung is checkable
  from a different evidence class (the file tree · the planning records · git history alone), which
  is what satisfies "independently checkable"; the wire format is D2's ADR and the engine is
  EPIC-004, neither specified here.
- Are non-Claude implementations maintained here or by adopters? → a ruling, not a measurement (L-094):
  close it by deciding, not by waiting for evidence.
- ~~Does `.claude/CONTEXT.md` become a *consumer* of the spec or stay an SSOT?~~ **Answered
  2026-08-15 (SPRINT-068 T1) → [ADR-023](../adr/ADR-023-context-becomes-consumer.md):** consumer —
  `spec/` is the SSOT for standard-owned rules, CONTEXT.md cites it and keeps only project-local
  facts; extraction commits are move+cite atomic, so no commit leaves a rule stated twice.

## Closed when

- [x] The spec has its own version and changelog, and moves independently of `plugin.json`
      — ✓ SPRINT-069 T2: `spec/STANDARD.md` v0.1.0 + `spec/CHANGELOG.md`. Independence is
      demonstrated rather than asserted: the spec sits at 0.1.0 while the plugin moved to 1.43.0 in
      the same commit, and the manifest-lockstep check covers the four manifests, not `spec/`
- [ ] No skill restates a rule the spec owns — each cites it instead
- [x] Conformance levels are defined, and each is independently checkable in principle
      — ✓ SPRINT-069 T1: [ADR-024](../adr/ADR-024-conformance-levels.md) — Structural → Gated →
      Attested, each checkable from a different evidence class (file tree · planning records · git
      history alone), none requiring EPIC-004's engine to exist
- [ ] The attestation format is specified with a worked example against a real commit
- [ ] A reader could build a conformant tool from the spec alone, without reading `skills/`

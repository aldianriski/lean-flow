---
sprint: 112
slug: govern-lighter
epic: EPIC-017
owner: Maintainer
last_updated: 2026-10-02
status: active
plan_commit: ceffdad
update_trigger: sprint execute/close events
---

# SPRINT-112 — Govern Lighter

> **Theme:** SPRINT-111 shipped one outcome (delete `TODO.md`) through 5 members, ~22 agent dispatches and a review loop that found
> real defects every round, at a cost. This sprint rules what the proof bar should cost (ADR-050 + an audit of every guard by the
> defects it actually caught), and closes EPIC-017's cap conditions through a disposition route instead of a diet: Closed-when 3
> (zero OVER-CAP rows) and Closed-when 4 (CLAUDE.md inside its budget, one rule demoted through the route).

## Scope

**In:** ADR-050 and the guard audit with owner-ruled dispositions (`TASK-396`) · a disposition route for every promoted rule,
the 4 soft OVER-CAP rows closed by recorded dispositions, and CLAUDE.md § Anti-Patterns slimmed to pointers (`TASK-384`).

**Out (deferred):** landing the audit's cuts (`TASK-398`, SPRINT-113) · `TASK-378` · `TASK-379` (EPIC-017 step 1, SPRINT-113) ·
`TASK-397` (migrate prose gaps) · `TD-206` and the store prune it holds (TASK-359/360/361/362/369/374) · any release (D3).

## Members

- docs/work/todo/TASK-396-governance-diet-audit.md
- docs/work/todo/TASK-384-disposition-rule-and-cap-breaches.md

## Plan

### T1 — Rule the proof bar and audit every guard by the defects it caught `[size: M · risk: med · class: decision · HITL · J2]`
Layers: `docs/adr/ADR-050-proof-bar-scales-with-consequence.md` · `docs/DECISIONS.md` · `docs/research/guard-audit.md`
Depends-on: none
Cites: `TASK-396` · SPRINT-111 Retro (Cost) · L-221 · TD-212 · ADR-029 · ADR-043 (the consumer contract bounds any cut to the engine)

Tier P (an ADR and a research doc; no guard changes here, because the cuts land in TASK-398). The audit derives "defects caught" for
each guard by two selection routes (git history of fixes the guard's FAIL preceded · LEARNINGS/TECH-DEBT citations), never by
recall (L-198). Every row gets a disposition ruled with the owner: keep · freeze · cut.

**Acceptance:** ADR-050 is accepted by the owner. The audit covers every guard (the population is enumerated and reconciled against the
gate's own lists: always-on · opt-in · excluded · legs), and every row carries an owner-ruled disposition.

### T2 — A disposition per promoted rule; close the soft caps and slim CLAUDE.md through it `[size: M · risk: high · class: decision · HITL · J2]`
Layers: `skills/lean-doc-generator/SKILL.md` · `spec/STANDARD.md` · `spec/CHANGELOG.md` · `.claude/CLAUDE.md` · `.claude/CONTEXT.md` ·
  `docs/LEARNINGS.md` · `docs/epic/EPIC-017-work-items-that-fit.md` · `docs/research/adlc-epic-sequencing.md` ·
  `docs/research/epic-017-effectiveness.md` · `docs/research/LEAN-FLOW-PRE-EPIC-FOUNDATION-HARDENING-V3.md` · `TECH-DEBT.md` ·
  `scripts/lib/check-doc-caps.ts` · `evals/run-doc-caps-fixtures.sh` · `evals/fixtures/doc-caps/`
Depends-on: none
Cites: `TASK-384` · EPIC-017 Closed-when 3 · 4 · TD-174 · ADR-048 (token budget) · L-106 · L-220 (any spec or check change reads its ADR first)

Tier G if the route is enforced by a check (`check-doc-caps` reading a recorded disposition); otherwise Tier P. Declared at G2 and
defaulting up. A disposition is one of: replace · merge · move to an on-demand reference · automate into a check · retain with
justification. CLAUDE.md is at its token budget (~16081 ≤ 16087), so the slim is what creates the headroom.

**Acceptance:** promotion requires a stated disposition (the promote governance step and its template say so); at least one rule leaves
CLAUDE.md through the route with its destination recorded; § Anti-Patterns reads as pointers within 80 lines; `check-doc-caps` reports
zero OVER-CAP rows, each closed by a recorded disposition, not a diet.

## Decisions (pre-locked)
- **D1** — `TASK-396` was split at this promote (owner, 2026-10-02): it keeps ADR-050 and the audit; the cuts → `TASK-398`; the CLAUDE.md
  slim → `TASK-384`, so one task owns `.claude/CLAUDE.md`.
- **D2** — No new `.sh` file; executable logic is TypeScript on Bun (owner rule 2026-09-09).
- **D3** — No release at close; `[Unreleased]` holds 2.0.
- **D4** — Every execution gets the Codex gauntlet in hybrid mode (Codex reads, a Claude runner executes), on top of the Tier G review.
  Every touched surface is run, `bun test` and opt-in harnesses included (L-221).
- **D5** — `TASK-359/360/361/362/369/374` stay until `TD-206` is ruled.

## Assumptions
- **A1** — "Defects caught" per guard can be derived mechanically from git history and the ledgers for most guards. *Confirm: T1 recon. A
  guard with no derivable record is a finding in its own right, and the owner rules it.*
- **A2** — The 3,050-line V3 research doc can leave the cap set through an existing §11 route (superseded → archive) rather than a new
  rule. *Confirm: T2 recon, against what still cites it.*

## Execution Log

> **Lives in its own file**: `docs/sprint/logs/SPRINT-112-govern-lighter.md`, rendered from
> `templates/sprint-log.md.template` and created lazily at the first entry (STANDARD §9 · ADR-014).

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|

## Retro

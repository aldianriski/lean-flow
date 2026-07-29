---
sprint: 031
slug: tech-debt-split
owner: Maintainer
last_updated: 2026-07-29
status: active
plan_commit: 44ae111
close_commit: [set at close]
update_trigger: sprint execute/close events
---

# SPRINT-031 — Tech-Debt Split

> **Theme:** TODO.md and Tech Debt are two different queues sharing one file — in a large repo
> (owner's other system) both queues are big and crowd each other out. Split Tech Debt into its own
> root ledger, shipped as a consumer template with full wiring, so each queue scales independently.

## Scope

**In:** new core `TECH-DEBT.md.template` · TODO template/pointer rework · wiring every grep-found
reference (lean-doc-generator SKILL + DOCS_Guide §2/§10/§11 + migration-map · triage · prime ·
CONTEXT.md · README · .claude/CLAUDE.md) · dogfood migration of this repo · v1.15.0 (MINOR, lockstep).
**Out (deferred):** any change to the TD-NNN model itself (severity · aging · §11 collapse rules move
verbatim, unchanged) · per-item TD files (rejected at design — heaviest option, not needed yet).

## Plan

<!-- TASK-066 filed from owner request this session (2026-07-29) and promoted immediately —
     never parked in Backlog. G1+G2 signed off via popup (design + process) before promote. -->

### T1 — Split Tech Debt out of TODO.md into root TECH-DEBT.md `[size: M · risk: med]`
Layers: skills/lean-doc-generator (templates + SKILL + references) · skills/triage · skills/prime · .claude/CONTEXT.md · README.md · .claude/CLAUDE.md · TODO.md + new TECH-DEBT.md (dogfood) · .claude-plugin/*.json · docs/CHANGELOG.md

Tech Debt is filed at Sprint Close and aged at Promote — a lifecycle orthogonal to the Backlog's
groom/promote flow — so it earns its own ledger. TODO.md keeps a pointer; every shipped surface that
routes TD-NNN must point at the new home or consumers get a dangling reference (L-020).

**Acceptance:** a consumer running `init` gets both TODO.md and TECH-DEBT.md; every grep for
`Tech Debt|TD-NNN` across shipped surfaces resolves to TECH-DEBT.md; this repo dogfoods the split.

**DoD:**
- [x] `templates/TECH-DEBT.md.template` created — ownership header · TD-NNN row shape · aging/collapse rules · how-to-use note
- [x] `templates/TODO.md.template` — § Tech Debt replaced by a pointer line to `TECH-DEBT.md`
- [x] Skill wiring — lean-doc-generator SKILL.md (Retro routing · init core set) · triage (Load + bug intake) · prime (slot 5)
- [x] References — DOCS_Guide §2 core-files row + §10 routing/aging + §11 collapse rows · migration-map (TODO row + split-out rule for adopted repos)
- [x] SSOT + front-door — CONTEXT.md sprint model + governance · README (buckets prose + template count) · .claude/CLAUDE.md (template count)
- [x] De-leak — DOCS_Guide §10 retrieval-miss line + SPRINT.md.template Retro line genericized (repo-specific TASK-040 pointer removed — L-015 class)
- [x] Dogfood — root `TECH-DEBT.md` created (TD-008 + resolved collapse lines) · TODO.md § Tech Debt → pointer
- [x] Release — CHANGELOG entry + v1.15.0 in plugin.json = marketplace.json (lockstep)

## Decisions (pre-locked)
- **D1** — TECH-DEBT.md lives at repo root, sibling of TODO.md (symmetric daily working file; owner pick over docs/ placement, 2026-07-29). Reversible → no ADR.
- **D2** — Feature → MINOR 1.15.0 by hand (release-patch is PATCH-only). Owner-approved at G2.

## Assumptions
- **A1** — Adopted repos with TD inside TODO.md are handled by `migrate`'s new split-out rule; no consumer action needed until they re-run migrate. *Confirm: migration-map row added + re-run sync is report-only.*

## Execution Log

### 2026-07-29 | promote | plan locked
Formed from owner request (backlog cleanup + split ask, this session). Governance checklist all-clear
(L-promotion: none — all candidates count:1 · TD aging: TD-008 re-reviewed at 028 · doc-aging: none).
Preceded by triage cleanup commit `1ba5484` (TASK-040/047 → .out-of-scope).

### 2026-07-29 | execute | full wiring applied, qa-check green (56/0)
Grep map applied across templates · skills · references · SSOT · front-door · dogfood · release.
qa-check caught the ONE surface the grep map missed — ARCHITECTURE.md's template-count claim (counts
don't grep as "Tech Debt"); fixed + tree updated. Two prior learnings applied preemptively: L-048
(version-echo grep found the stale README footer BEFORE commit, not after release) · L-020 (wiring
map built grep-first). New: L-050 filed — shipped SPRINT template + DOCS_Guide carried repo-local
`TASK-040` ID; L-015 sweeps grep paths, not ID namespaces. Knowledge index regenerated.

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| `skills/lean-doc-generator/templates/TECH-DEBT.md.template` | T1 | NEW core template — TD ledger gets its own file | Low | qa-check tmpl-core 15=15 |
| `skills/lean-doc-generator/templates/{TODO,SPRINT}.md.template` | T1 | § TD → pointer · Retro line de-leaked (TASK-040) | Low | grep: no stale refs |
| `skills/lean-doc-generator/SKILL.md` + `references/{DOCS_Guide,migration-map}.md` | T1 | Retro routing · init core set · §2/§10/§11 · split-out migrate rule | Med | qa-check caps + refs green |
| `skills/triage/SKILL.md` · `skills/prime/SKILL.md` | T1 | groom + read the new ledger (legacy § still read) | Low | caps 85/66 ≤110 |
| `.claude/CONTEXT.md` · `.claude/CLAUDE.md` · `README.md` · `docs/ARCHITECTURE.md` | T1 | SSOT sprint-model · counts 15/17 · tree + footer v1.15.0 | Low | qa-check counts + footer green |
| `TECH-DEBT.md` (new) · `TODO.md` | T1 | dogfood — TD-008 + resolved lines moved verbatim | Low | L-009 re-read clean |
| `.claude-plugin/*.json` · `docs/CHANGELOG.md` · `docs/LEARNINGS.md` + index | T1 | v1.15.0 lockstep · MINOR entry · L-050 + regen | Low | qa-check lockstep + index green |

## Retro
<!-- Written at close. -->

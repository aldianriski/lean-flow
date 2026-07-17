---
sprint: 024
slug: loop-hygiene
owner: Maintainer
last_updated: 2026-07-17
status: active
plan_commit: pending
close_commit: pending
update_trigger: sprint execute/close events
---

# SPRINT-024 — Loop Hygiene & Wiring

> **Theme:** Close the "prose rule, no matcher" class. The 2026-07-17 full-corpus audit
> (`docs/research/loop-hygiene-prd.md`) found every recurring hygiene miss shares one shape — a rule
> written in §10/§11/CONTEXT with no lint or checklist line targeting it. This sprint gives every
> hygiene rule a matcher, wires the claimed-but-unfired loop handoffs, and standardizes the formats
> that drifted. No new gate: G1/G2 stay the only gates; close/promote gain the existing
> propose→approve verb.

## Scope

**In:** (A) one-shot drift cleanup + qa-check/gen-index coverage of the blind classes; (B) canonical
tombstone + close/promote hygiene sweeps behind approval verbs; (C) feed-pipeline wiring (bug-intake ·
ready-filter · prime→triage · CONTEXT built-ins · G1 ownership); (D) knowledge integrity (L-NNN
monotonic ids · verdict archival); (E) consumer surface + SKILL skeleton + template conformance +
README showcase template.
**Out (deferred):** hook enforcement (TASK-006) · council multi-model (TASK-047) · graph view
(TASK-040) · `docs/research/storm/` · README restructure beyond footer/counts/dedup.

## Plan

<!-- Shared-file chains → § Decisions D2 (single owner = this sprint, sequential commit order). -->

### T1 — Execute the one-shot hygiene cleanup (TASK-073) `[size: S · risk: low · AFK]`
Layers: TODO.md · README.md · .claude/CLAUDE.md · docs/research/
Start from green-and-true so T3's new lints verify FAIL→PASS against real fixtures.

**Acceptance:** TODO.md has zero tombstones/stale pointers; README footer == plugin.json version; CLAUDE.md carries ownership frontmatter; orphan image.png gone; qa-check still green.

**DoD:**
- [ ] 13 tombstone comment lines + TODO:48 (SPRINT-016) + TODO:98 (rotated CHANGELOG link) removed
- [ ] README footer → v1.10.2 + real date · CLAUDE.md ownership header added · docs/research/image.png deleted
- [ ] `sh scripts/qa-check.sh` green

### T2 — Standardize the tombstone + wire close's hygiene sweep (TASK-074) `[size: M · risk: med · HITL]`
Layers: skills/lean-doc-generator/SKILL.md · references/DOCS_Guide.md §11 · scripts/qa-check.sh
The format close writes and the format §11 deletes must be the same string; the sweep runs behind a propose→approve verb (D1: delete immediately at close).

**Acceptance:** close's procedure writes/deletes ONE canonical tombstone format, sweeps refs to the just-closed sprint + rotation links, gated by explicit approval; tombstone lint added; exercised once on a real close (this sprint's own close is the exercise).

**DoD:**
- [ ] Canonical tombstone string defined in DOCS_Guide §11 + close row writes/deletes it (D1: immediate)
- [ ] Close sweep (tombstones · just-closed-sprint refs · rotation links) behind propose→approve
- [ ] qa-check tombstone-format lint added · SPRINT-024's own close fires the sweep end-to-end

### T3 — Extend qa-check coverage to the blind drift classes (TASK-075) `[size: M · risk: med · AFK · depends: T1]`
Layers: scripts/qa-check.sh · scripts/gen-index.sh · docs/QA.md
The checker must fail exactly where the audit found green-while-drifted.

**Acceptance:** new lints — README-footer-vs-plugin.json · ownership on CLAUDE/README · TD ≥3-sprint aging · `(temp)` trackers in TODO · hand-written cap snapshots — each verified FAIL on pre-T1 tree, PASS after; gen-index stamps its own `last_updated`.

**DoD:**
- [ ] 5 new lints in qa-check.sh, each FAIL/PASS-verified against the pre/post-T1 fixture
- [ ] gen-index.sh rewrites `last_updated` on every run · QA.md hand-written snapshot removed
- [ ] Full suite green post-T1

### T4 — Emit the §10 promote checklist + sign-off (TASK-076) `[size: S · risk: med · HITL]`
Layers: skills/lean-doc-generator/SKILL.md · references/DOCS_Guide.md §10
Promote's aging scan becomes emitted checkboxes + an explicit human sign-off before render/commit, not recalled prose. (TD-008's overdue re-review already recorded at this sprint's promote — the mechanism's first firing is dogfooded.)

**Acceptance:** promote outputs explicit checkbox lines (TD aging · L-promotion · dedup-near-cap) and requires sign-off before rendering the sprint file.

**DoD:**
- [ ] Promote row emits the checklist + sign-off verb before render/commit
- [ ] DOCS_Guide §10 promote text matches

### T5 — Implement bug-intake routing in triage (TASK-077) `[size: S · risk: med · HITL]`
Layers: skills/triage/SKILL.md
CONTEXT.md:53 claims routing triage never implements (A4: implement, don't delete).

**Acceptance:** triage Flow contains the BUG step (trivial known cause → TASK · needs investigation → /diagnose · architectural → TD-NNN), exercised once on a sample BUG doc.

**DoD:**
- [ ] BUG routing step in triage Flow matching CONTEXT.md's claim
- [ ] Exercised once end-to-end on a sample BUG (spec-only-debt guard)

### T6 — Wire the feed pipeline's missing handoffs (TASK-078) `[size: S · risk: low · AFK]`
Layers: skills/lean-doc-generator/SKILL.md · skills/prime/SKILL.md
Promote must consume triage's contract; prime must route to the pipeline's first step.

**Acceptance:** promote intake explicitly pulls `state: ready` only; prime Next: offers /triage when a backlog exists with nothing ready; both traced on the consumer path.

**DoD:**
- [ ] Promote row filters `state: ready` explicitly
- [ ] Prime Next: gains the /triage branch · consumer-path trace of both

### T7 — Reconcile CONTEXT built-ins + loop statement (TASK-079) `[size: S · risk: low · AFK]`
Layers: .claude/CONTEXT.md
The SSOT advertises only what fires (A2: /fork dropped).

**Acceptance:** built-in list has no /fork, points /simplify at its real home; loop headline carries the feed pipeline in the same sentence.

**DoD:**
- [ ] /fork dropped · /simplify pointer fixed · loop headline + feed pipeline joined

### T8 — Resolve G1 ownership between decomposer and orchestrator (TASK-080) `[size: S · risk: med · HITL]`
Layers: skills/orchestrator/SKILL.md · skills/task-decomposer/SKILL.md
Two files disagree on who owns the scope gate.

**Acceptance:** orchestrator states the rule — decomposer-approved task → G1 fast-path ("scope unchanged since approval? y/n"), else full G1 — and decomposer's "approve is the gate" line agrees.

**DoD:**
- [ ] Fast-path rule in orchestrator G1 · decomposer line reconciled · no contradiction remains

### T9 — Make L-NNN ids monotonic + fix broken citations (TASK-081) `[size: M · risk: med · HITL]`
Layers: docs/LEARNINGS.md · references/DOCS_Guide.md §11 · skills/{tdd,task-decomposer,orchestrator} · scripts/qa-check.sh
Pruning frees ids for reuse today — citations written before the reuse silently point at the wrong learning.

**Acceptance:** never-reuse + retired-id stubs documented; L-016/L-017 collisions + dangling L-024/037/042 cites corrected; lint: every L-NNN cited under skills/ resolves or is labeled promoted.

**DoD:**
- [ ] Never-reuse policy + retired-id stub format in LEARNINGS.md/§11
- [ ] tdd:82 + task-decomposer:89 collisions fixed · orchestrator/dispatch dangling cites relabeled
- [ ] qa-check L-citation lint added and green

### T10 — Archive referenced verdicts durably + repoint trackers (TASK-082) `[size: S · risk: low · AFK]`
Layers: skills/council/SKILL.md · references/DOCS_Guide.md · TODO.md trackers
Durable docs must never point at temp-dir artifacts.

**Acceptance:** policy stated (verdict referenced by a durable doc → copy to docs/research/verdict-<slug>.md); TASK-040/047 trackers point only at existing files.

**DoD:**
- [ ] Archival policy line in council SKILL + DOCS_Guide
- [ ] TASK-040/047 trackers repointed to surviving research docs

### T11 — Sweep consumer-surface leaks from generic skills (TASK-083) `[size: S · risk: low · AFK · depends: T9]`
Layers: skills/insights · skills/prime · skills/orchestrator/references/dispatch.md

**Acceptance:** insights carries its own inline LEARNINGS entry shape + no scripts/ path; prime + dispatch.md inline rationale instead of docs/research/ pointers; cold consumer read resolves every reference.

**DoD:**
- [ ] insights: gen-index parenthetical dropped · inline entry shape replaces cross-skill template ref
- [ ] prime:38 + dispatch.md:5 rationale inlined · cold-read trace clean

### T12 — Document + apply the canonical SKILL.md skeleton (TASK-084) `[size: M · risk: low · HITL · depends: T9, T11]`
Layers: references/DOCS_Guide.md (style note) · several skills/*/SKILL.md

**Acceptance:** skeleton (section names · order · optionality) documented once; 14/14 skills conform or carry a noted deviation.

**DoD:**
- [ ] Skeleton documented (frontmatter 6 fields → When to invoke → procedure → Output format? → Hard rules? → Red flags)
- [ ] council argument-hint + ${CLAUDE_SKILL_DIR} · insights/council heading names normalized · allowed-tools scoping rationale recorded

### T13 — Bring templates up to ADR-009 + reconcile counts (TASK-085) `[size: S · risk: low · AFK]`
Layers: skills/lean-doc-generator/templates · references/DOCS_Guide.md §2 · README.md · docs/ARCHITECTURE.md

**Acceptance:** ADR + RESEARCH templates carry id/tags/domain/status/related; BUG is core row 14 in §2 (A3); README/CLAUDE/ARCHITECTURE agree on "14 core (+2 non-core = 16)".

**DoD:**
- [ ] ADR-009 metadata block in both templates · template-generated doc passes the index lint
- [ ] BUG row added to §2 · counts reconciled across the four docs

### T14 — Deduplicate README's modes table to a pointer (TASK-086) `[size: S · risk: low · AFK]`
Layers: README.md
Byte-identical volatile tables drift (ADR-007); showcase prose/diagrams stay (coordinate with T15).

**Acceptance:** README references CONTEXT.md's modes table instead of reproducing it verbatim.

**DoD:**
- [ ] Modes table → pointer (or clearly-marked rendered summary that T2's close sweep would catch drifting)

### T15 — Upgrade README.md.template to a showcase-grade front-door (TASK-087) `[size: M · risk: low · HITL]`
Layers: skills/lean-doc-generator/templates/README.md.template · references/DOCS_Guide.md §2
Owner call 2026-07-17: README = human showcase (promotional, design-forward); AI context lives in CLAUDE/CONTEXT. The standard already has no README cap — this upgrades the modeled quality.

**Acceptance:** template models a professional showcase (hero/pitch · badges · quick start · feature table · architecture diagram · doc links) as guide-not-gate; anti-SSOT rule inside; audience division stated once.

**DoD:**
- [ ] Showcase template rewritten (explicitly adaptable, no strict section list) · §2 stance restated in header
- [ ] Anti-SSOT rule (present, don't byte-duplicate volatile CONTEXT tables) + README=human/CLAUDE+CONTEXT=agent division stated

## Owner-action checklist
- [ ] Confirm D1 (tombstone lifetime: immediate delete at close) at G2 — the one open design residual.

## Decisions (pre-locked)
- **D1** — Tombstones are deleted **immediately at close** (no one-sprint grace): history already lives in CHANGELOG + sprint archive; a grace period adds state no reader uses. *(A1 → confirm at G2; no ADR — reversible.)*
- **D2** — Shared-file chains are **sequential, single-owner (this sprint), in task order**: `lean-doc-generator/SKILL.md` T2→T4→T6 · `DOCS_Guide.md` T2→T4→T9→T10→T13→T12→T15 · `qa-check.sh` T2→T3→T9 · `README.md` T1→T13→T14 · `TODO.md` T1→T10 · `task-decomposer/SKILL.md` T8→T9 · `dispatch.md` T9→T11. Everything else may run parallel. Shared files staged per-hunk at commit (L-042 rule).
- **D3** — **No new gate** (PRD): G1/G2 remain the only gates; close/promote gain the existing propose→approve verb. Governing principle: *a hygiene rule without a lint or checklist line is a wish.*

## Assumptions
- **A1** — tombstone lifetime = immediate delete (D1). *Confirm: G2 sign-off.*
- **A2** — /fork is dropped, not wired. *Confirm: G2; trivially reversible.*
- **A3** — BUG template is core (row 14). *Confirm: matches CLAUDE/ARCHITECTURE's existing "14" claim.*
- **A4** — bug-intake is implemented in triage, not deleted from CONTEXT. *Confirm: G2.*
- **A5** — TD-008 re-review rides promote governance. *Confirmed: recorded at this promote (2026-07-17).*

## Execution Log

### 2026-07-17 | promote | plan locked from loop-hygiene PRD
15 tasks (TASK-073…087) pulled from Backlog in dependency order. Governance: no L-NNN promotable;
TD-008 re-reviewed (open · minor · mitigation in-plan: relocate lean-doc-generator init detail to a
reference if T2/T4/T6 threaten the ~110 cap); TODO.md 206 lines > soft cap — transient, no
compression (T1 deletes 13 lines; close drains the batch).

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|

## Retro

*(written at close)*

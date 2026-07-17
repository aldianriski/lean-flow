---
sprint: 024
slug: loop-hygiene
owner: Maintainer
last_updated: 2026-07-17
status: active
plan_commit: c0b0ff8
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
- [x] 14 tombstone comment lines + TODO:48 (SPRINT-016) + TODO:98 (rotated CHANGELOG link) removed
- [x] README footer → v1.10.2 + real date · CLAUDE.md ownership header added (80/80 — two adjacent bullets merged verbatim) · docs/research/image.png deleted
- [x] `sh scripts/qa-check.sh` green (49/0)

### T2 — Standardize the tombstone + wire close's hygiene sweep (TASK-074) `[size: M · risk: med · HITL]`
Layers: skills/lean-doc-generator/SKILL.md · references/DOCS_Guide.md §11 · scripts/qa-check.sh
The format close writes and the format §11 deletes must be the same string; the sweep runs behind a propose→approve verb (D1: delete immediately at close).

**Acceptance:** close's procedure writes/deletes ONE canonical tombstone format, sweeps refs to the just-closed sprint + rotation links, gated by explicit approval; tombstone lint added; exercised once on a real close (this sprint's own close is the exercise).

**DoD:**
- [x] Canonical rule defined in DOCS_Guide §11 + close row (D1 sharpened: no breadcrumbs ever — removal outright)
- [x] Close sweep (Backlog removal · just-closed-sprint refs · rotation links) behind propose→approve
- [ ] qa-check tombstone lint added `[x]` · SPRINT-024's own close fires the sweep end-to-end (pending close)

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
- [x] BUG routing step in triage Flow matching CONTEXT.md's claim
- [x] Exercised once end-to-end on a sample BUG (spec-only-debt guard)

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
- [x] /fork dropped · /simplify pointer fixed · loop headline + feed pipeline joined

### T8 — Resolve G1 ownership between decomposer and orchestrator (TASK-080) `[size: S · risk: med · HITL]`
Layers: skills/orchestrator/SKILL.md · skills/task-decomposer/SKILL.md
Two files disagree on who owns the scope gate.

**Acceptance:** orchestrator states the rule — decomposer-approved task → G1 fast-path ("scope unchanged since approval? y/n"), else full G1 — and decomposer's "approve is the gate" line agrees.

**DoD:**
- [x] Fast-path rule in orchestrator G1 · decomposer line reconciled · no contradiction remains (CONTEXT G1 row updated too)

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

### 2026-07-17 | G1+G2 signed | batch gates approved; A1/A2/A4 confirmed
Owner approved batch G1+G2 and the D2 wave plan. A1 → **immediate delete** (sharpens D1: close
writes no tombstone comments at all — shipped entries removed outright; the T2 lint bans the
pattern). A2 → /fork dropped. A4 → bug-intake implemented in triage. Waves: W1 T1·T2·T5·T7·T8 →
W2 T3·T4 → W3 T9 → W4 T10·T11 → W5 T13 → W6 T12·T14 → W7 T15.

### 2026-07-17 | wave 1 done | T2·T5·T7·T8 committed; qa-check 49/0 (two new lints live)
T5 29e2825 · T7(+T8 residual G1 row) 9296671 · T8 a83137a · T2 dd18144. Side-fix: the new corpus
lint caught the sprint's own PRD (unregistered tags) + a stale knowledge index → fixed/regenerated
(5c377e1) — first real catch by the mechanism being built. **Incident:** T2's agent ran `git stash`
to diff the pre-T2 tree while T8's uncommitted edits were in flight — the stash window made T8's
work look destroyed (restored on pop; nothing lost). Learning candidate for Retro: parallel-wave
subagent briefs must forbid tree-wide git state ops (stash/checkout/restore); compare via
`git show REF:file` instead. W2+ briefs updated accordingly. T1 still running.

### 2026-07-17 | wave-map fix + boundary shuffle | T6 assigned to W3; temp-tracker repoint moves T10→T3
The promote-time wave map omitted T6 — it joins W3 beside T9 (disjoint files; lean-doc SKILL chain
stays T2→T4→T6). And T3's new `(temp)`-tracker lint would sit red until W4, so the two TODO tracker
repoints (TASK-040/047) move from T10 into T3; T10 keeps only the council/DOCS_Guide archival policy.
Same sprint scope, task-boundary shift only.

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| `skills/triage/SKILL.md` | T5 | bug-intake routing (CONTEXT claim now fires) | Low | sample-BUG trace · cap 85/110 |
| `skills/lean-doc-generator/SKILL.md` | T2 | close row → propose→approve sweep, no breadcrumbs | Low | qa-check · cap 104/110 |
| `…/references/DOCS_Guide.md` | T2 | §11 TODO rule = removal outright | Low | qa-check |
| `scripts/qa-check.sh` | T2 | breadcrumb-comment lint (comment-scoped) | Low | FAIL/PASS fixture-verified |
| `.claude/CONTEXT.md` | T7/T8 | /fork out · /simplify wired · feed-stage headline · G1 fast-path row | Low | cap 127/130 |
| `skills/orchestrator/SKILL.md` | T8 | G1 fast-path for decomposer-approved tasks | Low | cap 110/110 |
| `skills/task-decomposer/SKILL.md` | T8 | "approve is the gate" line reconciled | Low | cap 90/110 |
| `docs/research/loop-hygiene-prd.md` + `docs/knowledge-index.md` | — | registered tags · index regen | Low | corpus lint PASS |

## Retro

*(written at close)*

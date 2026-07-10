---
sprint: 020
slug: workflow-hardening
owner: Maintainer
last_updated: 2026-07-10
status: closed
plan_commit: d2b8fde
close_commit: 905be34
update_trigger: sprint execute/close events
---

# SPRINT-020 — Workflow Hardening

> **Theme:** Adopt the keepers from the mattpocock adaptation scan — skill-powered tier dispatch,
> the Standards-vs-Spec review split, expand–contract refactor vocab — and settle whether `/council`'s
> 5 personas actually diverge. All internal: sharpen *how we dispatch, review, refactor, and validate*,
> not new user-facing features. (Source: `docs/research/mattpocock.md`.)

## Scope

**In:** (1) ADR-010 amendment for skill-powered execution dispatch (mechanism C); (2) Standards-vs-Spec
review split in the review guidance; (3) expand–contract named in `/refactor-advisor`; (4) a measurement
of `/council` persona divergence.
**Out (deferred):** skill-dispatch mechanisms A (agent-def preload) and B (skill self-fork) — C only;
wayfinder fog-mode (TASK-064, `needs-info`); TASK-047 multi-model council backend (T4 only *measures*,
does not build); the tracker backend + `setup-*` scaffold (rejected in the scan).

## Plan

### T1 — Amend ADR-010: skill-powered tier dispatch `[size: M · risk: med]`
Layers: `docs/adr/ADR-010` · `skills/orchestrator/SKILL.md` · `.claude/CONTEXT.md` (tier row)
Turn `/orchestrator`'s execution dispatch from "spawn-with-brief" into "spawn-with-brief **+ procedure
skill**": the tiered sub-agent invokes `/tdd` at runtime via the Skill tool, so execution follows
discipline instead of improvising. Mechanism **C only** (runtime invocation on a `general-purpose`
dispatch agent) — no agent definition, stays agent-free-core.

**Acceptance:** ADR-010 carries the amendment and `/orchestrator` dispatches a real task through a
skill-powered sub-agent once, on real input.

**DoD:**
- [x] ADR-010 amended append-only (dated amendment / consequence — never edit the decided body; §4)
- [x] `/orchestrator` execution dispatch spec'd to hand the tiered sub-agent a procedure skill (runtime `Skill` invocation), not just a prose brief
- [x] CONTEXT.md tier/dispatch wording updated iff it changed
- [x] **Exercised once on real input** — a dispatch actually invokes a skill on a real task (L-007)
- [x] `orchestrator/SKILL.md` stays ≤110 (land via reword-in-place / `references/` — L-012)
<!-- QA: T1 wants the L-007 exercise as its verify signal; no automated test surface. -->

### T2 — Fold the Standards-vs-Spec review split into review guidance `[size: S · risk: low]`
Layers: `skills/orchestrator/SKILL.md` (Review step) · `.claude/CONTEXT.md` § Gates note iff wording changes
Separate two independent review axes — **Standards** (obeys repo conventions?) vs **Spec** (builds the
*right thing*?) — reported without merging or re-ranking, so neither masks the other.

**Acceptance:** the review guidance names both axes and states they are reported separately.

**DoD:**
- [x] Review guidance separates Standards vs Spec as two independent axes
- [x] Axes reported without merging / re-ranking (the separation principle stated)
- [x] Landed cap-safe in `orchestrator/SKILL.md` (reword-in-place / `references/`; ≤110)

### T3 — Name expand–contract in `/refactor-advisor` `[size: S · risk: low]`
Layers: `skills/refactor-advisor/SKILL.md` or `references/deepening.md`
Reference the expand–contract pattern for wide refactors: add the new form alongside the old → migrate
in batches → remove the old form.

**Acceptance:** `/refactor-advisor` references expand–contract for wide refactors.

**DoD:**
- [x] expand–contract named for wide refactors (add-new → migrate-batches → remove-old)
- [x] One line in SKILL.md or `references/deepening.md` (cap-safe)

### T4 — Measure whether `/council`'s 5 personas diverge `[size: S · risk: low]`
Layers: `/council` (exercise only) · `docs/research/council-improvements.md` (findings)
Run today's single-model `/council` 3× on one real past decision; record whether the 5 personas
substantively **disagree** or just converge — the datapoint that says if the single-model ceiling is a
real crack (→ unblocks/kills TASK-047) or a footnote.

**Acceptance:** a findings note records the divergence verdict against a real decision.

**DoD:**
- [x] Ran single-model `/council` **1×** on one real past decision *(G2 owner scope: 3×→1× probe; 3× cross-run → conditional follow-up)*
- [x] Recorded whether the 5 personas substantively diverge or converge
- [x] Findings appended to `docs/research/council-improvements.md` → gates TASK-047

## Owner-action checklist
- [ ] none

## Decisions (pre-locked)
- **D1** — Skill-powered dispatch uses **mechanism C only** (runtime `Skill` invocation on a
  `general-purpose` dispatch agent). Stays agent-free-core; mechanisms A (agent-def `skills:` preload)
  and B (skill self-fork via `context: fork`) are deferred — A would cross the agent-free line (council/ADR-grade, cf. TASK-047). **→ amend ADR-010, not a new ADR.**
- **D2 — overlap-ownership (T1 ∩ T2).** Both edit `skills/orchestrator/SKILL.md` + `.claude/CONTEXT.md`.
  Single-owner + order: **T1 commits before T2**; T1 owns the dispatch lines, T2 owns the Review-step
  lines. At commit, stage shared files per-hunk (`git add -p` + verify `git diff --cached`) — never a
  plain `git add` over the other task's WIP (L-042 / L-037).

## Assumptions
- **A1** — `orchestrator/SKILL.md` is near its ≤110 cap (109/110 at SPRINT-012, L-012) → T1+T2 land via
  reword-in-place or `references/`, never naive append. *Confirm: line-count check at each task's G2.*
- **A2** — ADR-010 is decided (SPRINT-019) → amend append-only (dated amendment / consequence; never
  edit the body — §4). *Confirm: read ADR-010 at T1 G2.*
- **A3** — Mechanism C stays agent-free (no `.claude/agents/*`). *Confirm: verified via claude-code-guide → `docs/research/mattpocock.md` § Skill-powered tier dispatch.*

## Execution Log

### 2026-07-10 | promoted | plan locked
Rendered from TASK-062 · 061 · 063 · 048 (governance review clean — no unpromoted count≥2 learnings;
TD-008 re-review flagged, minor, not in scope; L-017 collapsed to a §11 pointer). Plan frozen.

### 2026-07-10 | T1 done | skill-powered dispatch
ADR-010 amendment (skill-powered execution dispatch, mechanism C) + orchestrator dispatch note reworded
in place (SKILL.md 108→107, cap-safe) + CONTEXT.md dispatch contract line. **L-007 exercise:** dispatched
a real `general-purpose` sonnet sub-agent that invoked the `lean-flow:prime` plugin skill and returned its
health block — mechanism C confirmed end-to-end. `/tdd`-path claim is consumer-path (L-016). G2 gate T4
scoped to a 1× probe by owner (3× cross-run → conditional follow-up).

### 2026-07-10 | T2 done | Standards-vs-Spec review split
Added § Two axes to `review-scoping.md` (uncounted reference) — Standards (conventions + smell baseline)
vs Spec (builds the right thing), reported separately, never merged/re-ranked. SKILL.md L96 pointer +2
words (still 107/110).

### 2026-07-10 | scope-change (G2) | T4 3×→1×
Owner scoped T4 to a **1× probe** at the G2 gate (≈11 calls vs ≈33). *What broke:* none — decided before
the loop, not a mid-sprint pivot. *Impact:* single-run divergence datapoint; the 3× cross-run check becomes
a conditional follow-up TASK only if the single run is borderline. *G2 re-confirm:* target = TASK-047
(provider-dependency fork) — real, contestable, and the exact decision TASK-048 informs.

### 2026-07-10 | T3 done | expand–contract
Added § Wide refactors: expand–contract to `deepening.md` (add-new → migrate-batches → remove-old, each
its own task) + a one-line pointer in refactor-advisor SKILL.md Process (60/110).

### 2026-07-10 | T4 done | council divergence probe (1×)
Ran `/council` 1× on the TASK-047 fork (11 dispatched sonnet calls: 5 advisors + 5 reviewers + chairman on
session model; both gated passes skipped — pure judgment fork, no fast-groupthink blind spot left after
peer review). **Result:** personas diverge on *framing* (5 distinct dimensions; First Principles strongest
3/5, Expansionist blind-spot 5/5) but converge on verdict 4–1. Confirms finding #4 (framing diversity real;
shared *factual* priors untested by a judgment fork). Findings → council-improvements.md § Divergence
measurement; lean verdict → scratchpad `verdict-council-multimodel.md`. Bonus: peer review surfaced a
BYO-provider opt-in-disabled-by-default reframe as the only axiom-consistent path for TASK-047.

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| `docs/adr/ADR-010-*.md` | T1 | amendment: skill-powered execution dispatch (mech C) | Low | doc |
| `skills/orchestrator/SKILL.md` | T1 | dispatch note → hand subagent its procedure skill | Low | cap 107/110 |
| `.claude/CONTEXT.md` | T1 | dispatch contract line reflects skill-powered dispatch | Low | cap 127/130 |
| `skills/orchestrator/references/review-scoping.md` | T2 | new § Two axes — Standards vs Spec, reported separately | Low | reference (uncounted) |
| `skills/orchestrator/SKILL.md` | T2 | L96 pointer adds "Standards-vs-Spec axes" | Low | cap 107/110 |
| `skills/refactor-advisor/references/deepening.md` | T3 | new § Wide refactors: expand–contract | Low | reference (uncounted) |
| `skills/refactor-advisor/SKILL.md` | T3 | Process bullet points to expand–contract | Low | cap 60/110 |
| `docs/research/council-improvements.md` | T4 | § Divergence measurement — 1× probe result | Low | doc |

## Retro

**Retrieval check** — no miss. Correctly applied L-016 (dogfood-vs-consumer), L-042/L-037 (shared-file
overlap → T1-before-T2, per-hunk), L-012 (near-cap → `references/` + reword-in-place), L-007 (exercise on
real input), ADR-002 (agent-free) + ADR-010 (dispatch). No prior L/ADR contradicted.

**Worked**
- Recon-first G1/G2 caught the two real constraints up front (108/110 cap · T1∩T2 overlap) so the loop never stalled.
- Landing behaviour in `references/` (uncounted, ADR-006) kept both near-cap SKILLs safe (L-012).
- The T4 probe was self-targeting (councilled TASK-047 itself) — one run yielded both the divergence datapoint AND a usable verdict + reframe for the gated task.

**Friction**
- L-016 bit again: T1's `/tdd`-dispatch path can't be dogfooded in a markdown repo — had to exercise the mechanism (a dispatched subagent invokes a plugin skill) and mark the `/tdd` claim consumer-path. 2nd occurrence → L-016 bumped to count 2.

**Pattern candidate** (→ `docs/LEARNINGS.md`)
- **L-018** — a single-model `/council` diverges on *framing* (measured T4: 5 distinct dimensions, First Principles strongest 3/5, lone build-lens blind-spot 5/5) but a judgment fork can't test shared *factual* priors; so "5 personas = theater" is false for framing — the real ceiling is shared knowledge, testable only on a factual decision.

---

### Retro buckets filed (§10)
- **Shipped** → `docs/CHANGELOG.md` v1.9.0 (T1–T4).
- **Tech debt** → none new (TD-008 stays open — re-review flagged at promote; not touched this sprint).
- **Follow-ups** → **TASK-065** (measure cross-model error-decorrelation on a *factual* decision — the real gate for TASK-047); **TASK-047** note updated (BYO-provider opt-in-disabled-by-default reframe). 3× cross-run council check NOT filed (probe wasn't borderline).
- **Learnings** → **L-018** (new); **L-016** bumped to count 2 (→ promotion candidate at next promote).

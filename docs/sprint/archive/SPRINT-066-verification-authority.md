---
sprint: 066
slug: verification-authority
owner: Maintainer
last_updated: 2026-08-15
status: closed
gates_signed: G1,G2 @ f208aad
plan_commit: ee5fe2d
close_commit: [sha — set at close]
update_trigger: sprint execute/close events
---

# SPRINT-066 — Verification Authority

> **Theme:** two rulings that decide *who may say no*. The second gauntlet audit's remainder
> (delta-mapped 2026-08-15, L-017) all funnels through one boundary — whether mechanical evidence may
> block the coordinator's progress (T1) — and the deferred charter fork from SPRINT-065 — whether a
> critic verdict may drive an unattended retry (T2). Both are decision-class and likely ADR-grade;
> nothing is built until they are ruled, which is why TASK-208/209 stay in the Backlog `blocked`.

## Scope

**In:** rule the evidence-gating boundary (T1) · rule the unattended-retry charter and its budget (T2).

**Out (deferred):** building TASK-208 (system-verify pass) and TASK-209 (evidence lines) — both
`blocked` on T1's ruling · TASK-198 (EPIC-003's opener, different subject) · TASK-188 (opportunistic
trigger, L-111) · **any change to the revise loop's one-retry-per-pass ceiling** — owner-ruled at
SPRINT-065 T3 and not reopened without evidence (L-091).

## Plan

### T1 — Rule whether mechanical evidence may gate the coordinator's progress `[size: S · risk: med · class: decision · HITL]`
Layers: `docs/adr/` · `skills/orchestrator/references/review-scoping.md` ·
        `skills/orchestrator/SKILL.md` · `.claude/CONTEXT.md` · `docs/DECISIONS.md`
        <!-- SKILL/CONTEXT/DECISIONS added mid-sprint — the ruling's wiring; logged first (L-100) -->
Depends-on: none
Cites: DOCS_Guide §2 (the completion-bound rule) · `docs/research/gauntlet-loop-delta.md`
Today the never-gate spine covers everything: QA checks are raised as suggestions, and no mechanical
verdict blocks a DoD tick or a close. The audit's verification-contract idea asks whether per-task
evidence, produced at G2, may *gate* the coordinator's own bookkeeping — distinct from ever running
the consumer's CI as a blocker, which stays out either way.

**Acceptance:** a recorded ruling — an ADR (next id: 021) if it carves the boundary — on whether a
per-`done-when` verification method + recorded evidence may BLOCK the coordinator's DoD tick and the
run's close, versus the spine standing unchanged.

**DoD:**
- [x] The never-gate spine engaged, not routed around — the ruling names the § QA suggestion line it
      modifies or upholds
- [x] The consumer boundary stated either way: lean-flow never runs the consumer's CI as a blocker on
      its own authority
- [x] Ruling recorded — ADR-021 if it qualifies (§4: hard-to-reverse + surprising + real trade-off),
      else the D-row states why not
- [x] `review-scoping.md` § QA suggestion says, after the ruling, what may gate and what only reports

### T2 — Rule whether the revise loop may run unattended, and on what budget `[size: S · risk: med · class: decision · HITL]`
Layers: `skills/orchestrator/references/night-run.md` · `docs/adr/` ·
        `skills/orchestrator/references/review-scoping.md` · `docs/DECISIONS.md` ·
        `skills/orchestrator/SKILL.md` · `.claude/CONTEXT.md`
        <!-- review-scoping/DECISIONS added mid-sprint (L-100); SKILL/CONTEXT added by the revise
             loop's own Spec finding — the stale "unattended never retries" lines (L-020) -->
Depends-on: T1 — its boundary is an input: a retry triggered by a mechanical FAIL under a
            T1-sanctioned gate is a different question from one triggered by critic judgement
Cites: ADR-016 (rollup contract) · EPIC-005 D2 (delegation policy declared per repo) ·
       `docs/research/gauntlet-loop-delta.md`
The collision is the task: a critic ruling "not good enough, retry" is a *decision*, and the
unattended charter is execute-only — decide nothing. SPRINT-065 shipped the loop attended-only and
deferred this fork by name; the source article's "agent fleet" remains a false cognate for EPIC-005's
fleet and imports no design.

**Acceptance:** a recorded ruling on whether a critic-driven retry may fire inside an unattended run —
with a hard ceiling and a rollup line per retry if allowed, or an explicit "attended only" with the
reason stated in `night-run.md` Part 0.

**DoD:**
- [x] The charter collision resolved head-on — the ruling says which yields, and never reads the
      retry as mere execution (the carve-out splits ADR-021's *verdict classes*: judgment always
      parks; a named-check FAIL executes three prior human decisions — logged in full)
- [x] One branch recorded with the branch stated: allowed → hard ceiling + one ADR-016 rollup line
      per retry wired into Part 4's shape; refused → "attended only" + reason lands in Part 0
- [x] The budget half ruled EPIC-005-D2-shaped: policy declared per repo, read by the run, never held
      by a coordinator process (absence = never; format concretizes in EPIC-005)
- [x] Ruling recorded durably — ADR-022; settled decisively at G2, so `/council` was not needed

## Owner-action checklist
- [ ] Reinstall the plugin — installed cache is **1.38.0** against a repo at **1.39.0** (the v1.39.0
      close moved the repo one MINOR past the fresh install made before it). The delta is exactly the
      SPRINT-065 skill changes (`review-scoping.md` · orchestrator SKILL § Review · SPRINT template);
      this session reads those from repo source (L-021), but the gap closes only by reinstalling.
      *Carried open at close (owner proceeded): unactioned through the sprint; re-filed on
      SPRINT-067's Owner-action checklist, now two MINORs behind (1.38.0 vs 1.40.0).*

## Decisions (pre-locked)

- **D1 — Ownership: both tasks touch `docs/adr/`, no other overlap.** Different ADR files; ids are
  assigned in commit order, so T1's ruling takes ADR-021 if it qualifies and T2's the next id.
  Commit order T1 → T2 is also dependency order. **→ no ADR.**
- **D2 — T1 gates T2's content, not just its order** (the SPRINT-065 D2 shape): what may mechanically
  gate changes what an unattended retry triggered by a mechanical FAIL even means. **→ no ADR.**
- **D3 — No epic stamp, owner-ruled at promote.** EPIC-003/004/005 are all `proposed` and the ADR-018
  sequence has not started them; these rulings are inputs the later epics consume, not member work.
  The pointers live in each task's `Cites:`/tracker instead. **→ no ADR.**

## Assumptions

- **A1** — No cap blocks either task: `CONTEXT.md` **132/150** · `CLAUDE.md` **63/80** · orchestrator
  `SKILL.md` **105/140**; `night-run.md` and `review-scoping.md` are references, uncounted (ADR-006).
  *Confirm: measured at promote 2026-08-15.*
- **A2** — T2's prerequisite exists: the attended revise loop shipped in v1.39.0 (SPRINT-065 T3),
  fixtures retained. *Confirm: `review-scoping.md` § The revise loop · `evals/fixtures/revise-loop/`.*
- **A3** — Next ADR id is **021** (highest on disk: ADR-020). *Confirm: `ls docs/adr/` at promote.*
- **A4** — Governance resolved at this promote: L-promotion **none** (two agreeing queries — no
  `count ≥ 2, promoted: no` entry, and zero `count:` lines ≥ 2 corpus-wide) · four TD rows re-reviewed
  and held with unblock conditions (TD-049 · TD-050 · TD-053 · TD-054) · doc-aging clean (TODO
  186/320 soft · rotation current · no pending collapse). *Confirm: governance review 2026-08-15,
  owner-signed.*

## Execution Log

> **Lives in its own file** — `docs/sprint/logs/SPRINT-066-verification-authority.md`, rendered from
> `templates/sprint-log.md.template` and created lazily at the first entry. Append there, never here:
> the Log grows with the work done, so keeping it out of this file is what stops it consuming the
> 400-line budget the Plan needs (DOCS_Guide §9 · ADR-014). The `logs/` subdirectory is load-bearing —
> the sprint-file checks glob `docs/sprint/SPRINT-*.md` non-recursively, so a same-directory
> `-log.md` sibling would be capped and schema-checked as if it were a Plan.

## Files Changed

<!-- Filled during execution; feeds CHANGELOG at close. -->

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| `docs/adr/ADR-021-evidence-gates-the-silent-path.md` | T1 | The ruling: a done-when-named check's FAIL blocks the *silent* tick, never the owner; consumer CI stays suggestion-only | low | scoped review (both axes clean vs ADR template comparand) |
| `skills/orchestrator/references/review-scoping.md` | T1 | § QA suggestion gains the evidence boundary — what may gate (task-named checks) vs what only reports (everything else) | low | scoped review |
| `skills/orchestrator/SKILL.md` | T1 | G2 checklist line: each done-when notes its verification method where a mechanical check exists (106/140) | low | scoped review |
| `.claude/CONTEXT.md` | T1 | G2 row extended in place with the ADR-021 pointer (0 new lines, 132/150) | low | scoped review |
| `docs/DECISIONS.md` | T1 | ADR-021 index row | low | link resolves |
| `docs/adr/ADR-022-unattended-retry-mechanical-carve-out.md` | T2 | The ruling: unattended retry only on a mechanical verdict + declared repo policy (three prior human decisions); judgment always parks | med | scoped review + delta re-review |
| `skills/orchestrator/references/night-run.md` | T2 | Part 0 gains the two carve-out boundary rows; Part 4 the one-line-per-retry shape; `last_updated` bumped (revise-loop Standards finding) | med | scoped review + delta re-review |
| `skills/orchestrator/references/review-scoping.md` | T2 | Revise-loop "Unattended:" bullet now states the ADR-022 carve-out instead of citing TASK-203 as open | low | scoped review |
| `skills/orchestrator/SKILL.md` | T2 | § Review sentence updated to the carve-out (revise-loop Spec finding — stale wiring; 107/140) | low | delta re-review |
| `.claude/CONTEXT.md` | T2 | § Built-in leverage revise-loop clause updated in place (revise-loop Spec finding; 132/150) | low | delta re-review |
| `docs/DECISIONS.md` | T2 | ADR-022 index row | low | link resolves |

## Retro

<!-- Written at close. Route the buckets to durable homes (DOCS_Guide §10):
     shipped → CHANGELOG.md (root) · tech debt → TD-NNN · follow-ups → TASK-NNN · learnings → docs/LEARNINGS.md.
     After close, the file moves → docs/sprint/archive/ + a one-line entry in docs/sprint/INDEX.md (§11). -->

**Retrieval check** — did we fail to find, or contradict, a prior `L-NNN`/ADR this sprint?
No miss of *prior* knowledge. The near-case was same-session: T2's builder pass left the superseded
"unattended never retries" line in two consumer touchpoints — contradicting a ruling made minutes
earlier — and the revise loop's Spec axis caught it in-session, briefed with the logged ruling as
comparand. Promoted rules fired as designed: L-100 twice (both `Layers:` corrections logged first),
and L-020's wiring check gained its first mechanical matcher (→ L-122).

**Cost** — inline coordinator, one session, 2 of 2 units delivered. Two frontier popups carried all
four owner rulings (G1+G2+T1's fork batched; T2's fork serialised behind T1's answer, ruled while
T1's reviewer ran — zero added wall-clock). Dispatches: three scoped `sonnet` review passes (T1
review · T2 review · T2 delta re-review), ≈220k subagent tokens total.

**Worked** — pipelining the T2 ruling into T1's review window. Briefing the Spec axis with the
*decision as logged* rather than the diff alone: it caught the two stale touchpoints the builder
missed. The revise loop's ceiling held exactly as specified: one retry, both axes fixed, one delta
re-review, no spiral.

**Friction** — the builder pass missed the CLAUDE.md wiring-check DoD at build time (two consumer
touchpoints stale until review) — caught by the loop, but the miss itself is the L-020 shape with
the rule loaded in context. The plugin-reinstall owner action carried through a second sprint
unactioned; at close the installed cache is two MINORs behind the repo.

**Pattern candidate** (surface to user → `docs/LEARNINGS.md`) — **L-122** filed: brief the
Spec-axis reviewer with the decision as logged, not the diff alone — it turns the wiring check into
a mechanical matcher.

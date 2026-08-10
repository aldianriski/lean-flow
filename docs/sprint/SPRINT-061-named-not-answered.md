---
sprint: 061
slug: named-not-answered
owner: Maintainer
last_updated: 2026-08-10
status: active
gates_signed: G1,G2 @ 0c86582
plan_commit: c15f2bd
close_commit:
update_trigger: sprint execute/close events
---

# SPRINT-061 — Named, Not Answered

> **Theme:** Every task here answers a question SPRINT-060 *stated* and did not settle. T4 ruled the
> loop-hygiene PRD superseded and explicitly left both the live rule inside it and its two sibling
> docs' statuses unruled; T3 located the gate's cost centre in section 4 and stopped there, because
> "section 4 is expensive" is itself the undifferentiated blob L-107 warns about. A named-but-open
> question is the cheapest kind to lose — it reads as handled.

## Scope

**In:** the matcher principle relocated to a durable home chosen by §10's placement test · a deliberate
`status:` on both sibling loop-hygiene research docs · section 4's runtime split across its three jobs.

**Out (deferred):** any *cure* for section 4's cost — T3 is measurement only, and TD-050 says so in the
row (narrowing the index-freshness read risks the L-058 family). TASK-188 stays blocked: its trigger is
an opportunistic night run, and promoting it into a sprint that cannot generate one is the exact mistake
SPRINT-060 made (L-111). TD-045 · TD-047 · TD-048 · TD-037 were re-reviewed at this promote and held,
triggers unchanged — recorded on the rows themselves, not here.

## Plan

### T1 — Relocate the "every hygiene rule gets a matcher" principle to a durable home `[size: S · risk: low · class: decision · HITL]`
Layers: `skills/lean-doc-generator/references/DOCS_Guide.md` · `.claude/CLAUDE.md` · `.claude/CONTEXT.md` · `docs/research/loop-hygiene-prd.md`
Depends-on: none
Cites: SPRINT-060 T2 · SPRINT-060 T4 — evidence that the principle is live and that its container was ruled superseded; both are closed, neither is a dependency of this task

A live rule sitting inside a doc marked `superseded` is a rule nobody will read again — the status is
correct (SPRINT-060 T4 ruled it), which is precisely what makes the rule inside it unreachable. The
principle is still live: SPRINT-060 T2 applied it, turning ADR-015 rule 2 from prose into an enforced
check with a named finding. Re-derive the home rather than reaching for the three-home menu (L-091,
L-092): ask which flows can hit the failure, then place it where all of them read.

**Acceptance:** the principle lives in a durable home chosen by §10's placement test, and
`docs/research/loop-hygiene-prd.md` no longer carries a live rule inside a `superseded` doc.

**DoD:**
- [ ] The placement test is run and *written down* — which flows can hit the failure, and why the
      chosen home is where all of them read (not a menu pick)
- [ ] If the test selects `.claude/CLAUDE.md`: stop and raise the cap question as a `scope-change`
      before editing — it is at 80/80, and a silent cap raise is the failure ADR-017 was written to avoid
- [ ] The principle is written into the selected home, in that file's voice
- [ ] `docs/research/loop-hygiene-prd.md` points at the new home instead of carrying the rule
- [ ] `sh scripts/qa-check.sh` green

### T2 — Rule on the two sibling loop-hygiene docs' statuses `[size: S · risk: low · class: decision · HITL]`
Layers: `docs/research/loop-hygiene-findings.md` · `docs/research/loop-hygiene-workstreams.md`
Depends-on: none
Cites: `skills/lean-doc-generator/templates/RESEARCH.md.template` — re-read for its trigger, never edited · SPRINT-060 T4 — the parent ruling this task must not inherit by default

Both raise the question SPRINT-060 T4 answered for their parent, and both were left out of its scope
deliberately rather than swept along. Do not assume the answer matches the parent's: a findings register
can outlive the PRD that spawned it, and T4's own lesson was that the RESEARCH template's actual trigger
("once a decision is built on it") is not the one people reach for.

**Acceptance:** `docs/research/loop-hygiene-findings.md` and `docs/research/loop-hygiene-workstreams.md`
each carry a deliberate `status:`, ruled against the RESEARCH template's stated trigger, with the
reasoning recorded.

**DoD:**
- [ ] `skills/lean-doc-generator/templates/RESEARCH.md.template`'s trigger is re-read, not recalled
- [ ] Each doc is ruled independently — the parent's ruling is evidence, not a default
- [ ] Both `status:` values and their reasoning are written; §11 archives a superseded doc only once
      nothing live cites it, so a citation check runs before any move is proposed
- [ ] `sh scripts/qa-check.sh` green

### T3 — Split section 4's cost across its three jobs `[size: S · risk: low · class: execution · AFK]`
Layers: `docs/research/qa-gate-timing.md` · an instrumented **copy** of `scripts/qa-check.sh` · `TECH-DEBT.md`
Depends-on: none

TD-050 measured section 4 (knowledge metadata) at 45–49% of the whole gate — larger than all fifteen
eval harnesses combined — and named this split as the first honest step, because the row is otherwise
one number attached to three different jobs. Measurement only: no narrowing, no cure. Repeat SPRINT-060
T3's method rather than inventing one.

**Acceptance:** `docs/research/qa-gate-timing.md` carries a per-job figure for section 4 — index
freshness vs dangling refs vs frontmatter completeness — from at least two samples, and the shipped
`scripts/qa-check.sh` is verifiably byte-identical afterwards.

**DoD:**
- [ ] Section 4 of `scripts/qa-check.sh` is read first, to confirm its three jobs are separably
      instrumentable — if they interleave, that *is* the finding and it gets recorded as one
- [ ] Two samples taken on an instrumented copy; the shipped `scripts/qa-check.sh` never edited
- [ ] `scripts/qa-check.sh` confirmed byte-identical (hash before/after, recorded)
- [ ] `docs/research/qa-gate-timing.md` updated with the per-job table
- [ ] `TECH-DEBT.md` TD-050 updated with what the split found — including if it contradicts the row
- [ ] `sh scripts/qa-check.sh` green

## Decisions (pre-locked)

- **D1** — T1's durable home is **not** pre-locked here. Deciding it at promote would be picking from
  a menu, which is the failure L-092 records; it is decided by running §10's placement test during T1.
  What *is* locked: if the test selects `.claude/CLAUDE.md`, the 80/80 cap is raised through a
  `scope-change` + an owner ruling (as ADR-017 did for CONTEXT.md), never silently.
- **D2** — T3 is measurement-only, locked. Any cure that surfaces during it is filed against TD-050,
  not implemented in this sprint. The row's own mitigation is marked *not yet derived* (L-091).
- **D3** — No file overlap between T1, T2 and T3, so no single-owner map is needed. T1 and T2 both sit
  in `docs/research/` but touch disjoint files; T3 is the only task touching `TECH-DEBT.md`.

## Assumptions

- **A1** — The matcher principle is genuinely still live, not sentiment. *Confirm: SPRINT-060 T2's diff
  — it applied the principle, turning ADR-015 rule 2 into an enforced check with a named finding.*
- **A2** — Section 4's three jobs are separably instrumentable. *Confirm: read section 4 of
  `scripts/qa-check.sh` before instrumenting. Unconfirmed on purpose — if they interleave, T3's
  acceptance is met by recording that, not by forcing a split.*
- **A3** — Nothing live cites `loop-hygiene-findings.md` / `loop-hygiene-workstreams.md` in a way that
  a status change would break. *Confirm: grep the corpus during T2 — by path, not by keyword (L-108).*

## Execution Log

> **Lives in its own file** — `docs/sprint/logs/SPRINT-061-named-not-answered.md`, rendered from
> `templates/sprint-log.md.template` and created lazily at the first entry. Append there, never here.

## Files Changed

<!-- Filled during execution; feeds CHANGELOG at close. -->

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|

## Retro

<!-- Written at close. Route the buckets to durable homes (DOCS_Guide §10). -->

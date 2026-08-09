---
sprint: 053
slug: surface-truth
owner: Maintainer
last_updated: 2026-08-09
status: active
plan_commit: 7779b27
close_commit: [sha — set at close]
update_trigger: sprint execute/close events
---

# SPRINT-053 — Surface Truth

> **Theme:** Four places where a surface says something that is not true, or does not say something a
> reader needs at the moment they need it. `init` scaffolds docs for substrate a repo does not have.
> A gate FAIL names what is missing but not the escape that would fix it honestly. Two doc facts went
> stale the moment a release shipped. And a learning about unarrivable evidence is still a ledger line
> rather than a rule. None of these are new capability — all four are the surface disagreeing with
> reality.

## Scope

**In:** substrate-gate `init`'s base tier so the standard and the tool stop contradicting each other ·
name the `Cites:` escape in the two completeness FAILs · correct two stale doc facts · promote L-094
into a durable rule, placed by §10's test.

**Out (deferred):** TASK-155 and TASK-159 stay in the Backlog. Both became `ready` at this promote and
neither is urgent; they are settled by reading and by ruling respectively, and folding them in would
have put a second task on `.claude/CONTEXT.md` (D4). TD-037 was re-reviewed and held one sprint ago;
TD-038's hold is recorded as D2 below. TODO.md's ~150-line breach is flagged, not fixed — D5.

## Plan

### T1 — Substrate-gate `init`'s base tier `[size: M · risk: low · class: decision · HITL]`
Layers: `skills/lean-doc-generator/references/init.md` ·
    `skills/lean-doc-generator/references/DOCS_Guide.md` · `docs/product/requirements.md`
Depends-on: none
Cites: `scripts/qa-check.sh`

`init.md` step 2 reads "Scaffold the base tier (**always**)" while every higher tier is substrate-gated
— DB detected → database docs, API detected → integrations. So a consumer running `init` on a docs,
config or content repo receives a testing guide, coding standards and two deployment guides describing
substrate that does not exist. lean-flow is the proof case: the repo that ships `init` deliberately has
none of them, which means DOCS_Guide §6's "base = every dev repo" and the tool it governs disagree. The
fix is to extend gating that already exists, not to invent detection.

**Acceptance:** a docs-only repo run through `init` receives no testing-guide, coding-standards or
deployment-guide files, and §6 states the exemption that makes that correct rather than a deviation.

**DoD:**
- [ ] Read `init.md`'s step-1 detection and confirm A1 — that substrate gating extends to "has code" /
      "is deployable" without new machinery. If it needs new detection this is L-sized and **splits**
- [ ] Base-tier rows carry their substrate condition, in the same form the higher tiers already use
- [ ] `DOCS_Guide` §6's base row states the exemption, so the standard and `init` agree
- [ ] **Consumer check (L-015)** — traced on a docs-only repo, not on lean-flow's dogfooding alone
- [ ] lean-flow's own absent base docs resolved explicitly: correct-by-exemption, or created
- [ ] `scripts/qa-check.sh` re-run **bare** immediately before the commit (L-089)

### T2 — Name the `Cites:` escape in the two completeness FAILs `[size: S · risk: low · class: execution · HITL]`
Layers: `scripts/lib/check-layers-completeness.sh` · `evals/fixtures/layers-completeness/` · `docs/QA.md`
Depends-on: none
Cites: `scripts/qa-check.sh`

TD-039. The two FAILs an author actually trips say what is absent from `Layers:` and never mention the
escape, so the obvious repair is to declare a touch that is not one — the behaviour the escape exists
to prevent. TD-036 hunted this gap on the authoring surfaces and found it on neither, because the
surface a failing author reads is the FAIL message itself.

**Acceptance:** an author who trips either completeness FAIL learns from the message that `Cites:`
exists, without reading the checker's source.

**DoD:**
- [ ] **Mitigation re-derived before it is built** (L-091, TECH-DEBT header) — confirm A3, that the
      message is where an author looks, and that naming an escape there does not read as an invitation
      to silence the gate
- [ ] Both completeness FAILs name the escape; the `Cites:`/`Layers:` contradiction FAIL is unchanged
- [ ] A must-FAIL fixture per changed check (L-058), **retained** not deleted (TD-012)
- [ ] Proven as a change, not just as code: red-on-new / green-on-old against `git show HEAD:` (L-090)
- [ ] `docs/QA.md`'s layers-completeness row still matches the shipped behaviour
- [ ] `scripts/qa-check.sh` re-run **bare** immediately before the commit (L-089)

### T3 — Clear two stale doc facts `[size: S · risk: low · class: mechanical-ingest · HITL]`
Layers: `docs/sprint/INDEX.md` · `.claude/CONTEXT.md`
Depends-on: none
Cites: `scripts/qa-check.sh`

`INDEX.md`'s SPRINT-049 and SPRINT-051 rows still read "PATCH pending"; both shipped in v1.27.1, which
is now public, so a published file carries a false claim. Separately `CONTEXT.md:97` states the domain
glossary "lives **here**" and no glossary section exists — a promise with nothing behind it.

**Acceptance:** neither file asserts something untrue: the INDEX rows name their release, and
CONTEXT.md either has the glossary or stops promising it.

**DoD:**
- [ ] INDEX rows 049 and 051 name v1.27.1 instead of "PATCH pending"
- [ ] The glossary claim resolved — content added, relocated, or the claim dropped
- [ ] Before dropping it, check whether any **consumer-facing** surface promises the glossary (L-015);
      CONTEXT.md sits at 123/130, so adding a section displaces something
- [ ] `scripts/qa-check.sh` re-run **bare** immediately before the commit (L-089)

### T4 — Promote L-094 into a durable rule `[size: S · risk: low · class: decision · HITL]`
Layers: `docs/LEARNINGS.md` · `.claude/CONTEXT.md` ·
    `skills/lean-doc-generator/references/DOCS_Guide.md` · `.claude/CLAUDE.md` ·
    `docs/knowledge-index.md`
Depends-on: T1 T3
Cites: `scripts/qa-check.sh` `scripts/gen-index.sh`

L-094 reached `count: 2` at this promote — a deferral waits forever when the evidence it waits for is
the wrong *class* of fact. It fired at Sprint-050 on a research scan and again at Sprint-052 on two
backlog tasks parked behind "unblock when a measurable signal is identified", a signal that was never
going to arrive for a documented-behaviour question or a judgement call. Placement is decided by §10's
test, shipped last sprint — which is what makes T4 depend on T1 and T3 rather than race them (D4).

**Acceptance:** L-094 reads `promoted: yes → <where>`, is collapsed to a pointer per §11, and the rule
sits where every flow that can defer a question reads it.

**DoD:**
- [ ] **Placed by §10's test** — enumerate the flows that can hit it (`/triage` setting `needs-info` ·
      `close` routing a follow-up · `promote` re-reviewing aged TD · a research scan writing "no new
      evidence"), then place where all of them read
- [ ] If the honest enumeration is "every flow", the home is `CLAUDE.md` at 80/80 — a **displacement
      ruling**, never a silent cap breach (A2)
- [ ] Any stale duplicate of the rule rewritten to point at the one home — the wiring half (L-092)
- [ ] Entry collapsed to a pointer line per §11; ids stay monotonic (next new id L-096)
- [ ] `docs/knowledge-index.md` regenerated (`sh scripts/gen-index.sh`)
- [ ] `scripts/qa-check.sh` re-run **bare** immediately before the commit (L-089)

## Decisions (pre-locked)

- **D1** — **TD-033 deleted** (§11: resolved at SPRINT-050 T1, three sprints ago). Its residual was
  split into TD-038 before deletion, so nothing live goes with it; substance survives in CHANGELOG, the
  sprint archive and git. Ledger 157 → 135 lines. Ids stay monotonic — 033 is retired, not reusable.
- **D2** — **TD-038's 3-sprint re-review fired and was held** *(owner ruling)*. The row names its own
  precondition — the next mattpocock re-scan — and no re-scan has happened, so acting now would
  restructure a doc still correct at 117 lines against a breach that has not occurred.
- **D3** — **L-094's promotion runs as T4, not as a promote-time edit** *(owner ruling)*, following
  SPRINT-052's D2. A rule written in passing gets no DoD and no review pass.
- **D4** — **T4 runs last.** Its placement test may select `DOCS_Guide` (T1's file) or `CONTEXT.md`
  (T3's file), and the outcome is not knowable until T4 runs. `Depends-on: T1 T3` gives both files a
  single owner without guessing — ownership by dependency chain, which the preflight accepts (TD-025).
- **D5** — **TODO.md's ~150-line breach is flagged, not fixed.** It sits at 154. Four of its five
  Backlog tasks leave at close anyway, so pruning now would be work the close performs for free.

## Assumptions

- **A1** — `init`'s existing substrate detection extends to "has code" / "is deployable" without new
  machinery. *Confirm: T1's first DoD line, by reading `init.md` step 1. If new detection is required,
  T1 is L-sized and splits rather than absorbing the growth silently.*
- **A2** — L-094's placement test resolves to a nameable home rather than "everywhere". *Confirm: T4's
  first step, by listing the deferring flows. If the answer genuinely is every flow, `CLAUDE.md` is the
  home and something must be displaced — a ruling, surfaced, not a quiet cap breach.*
- **A3** — the FAIL message is where a blocked author actually looks, so naming the escape there
  reaches them. *Confirm: T2's re-derivation step, before the message is edited (L-091).* **Evidence
  already exists, from this promote:** rendering this very Plan tripped the completeness FAIL on
  `scripts/qa-check.sh` — which every task's DoD *runs* and none *edits* — and the message named only
  the omission, not the `Cites:` escape that resolves it. The author who hit it had just written T2
  about that exact gap. If it catches someone holding the task, the message is the surface.

## Execution Log

> **Lives in its own file** — `docs/sprint/logs/SPRINT-053-surface-truth.md`, rendered from
> `templates/sprint-log.md.template` and created lazily at the first entry. Append there, never here:
> the Log grows with the work done, so keeping it out of this file is what stops it consuming the
> 400-line budget the Plan needs (DOCS_Guide §9 · ADR-014).

## Files Changed
<!-- Filled during execution; feeds CHANGELOG at close. -->

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| | | | | |

## Retro
<!-- Written at close. Route the buckets to durable homes (DOCS_Guide §10):
     shipped → CHANGELOG.md · tech debt → TD-NNN · follow-ups → TASK-NNN · learnings → docs/LEARNINGS.md. -->

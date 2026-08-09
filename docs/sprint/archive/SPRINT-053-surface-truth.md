---
sprint: 053
slug: surface-truth
owner: Maintainer
last_updated: 2026-08-09
status: closed
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
    `skills/lean-doc-generator/references/DOCS_Guide.md`
Depends-on: none
Cites: `scripts/qa-check.sh`

`init.md` step 2 reads "Scaffold the base tier (**always**)" while every higher tier is substrate-gated
— DB detected → database docs, API detected → integrations. So a consumer running `init` on a repo with
no code receives coding standards and a testing guide describing substrate that does not exist. The fix
extends gating that already exists (step 3's "substrate-conditional rows fire automatically") rather
than inventing detection. **Narrowed by the 2026-08-09 scope-change** — see the Log: the axis is
per-substrate, never "docs-only", and lean-flow's own absent base docs left with the dropped half.

**Acceptance:** a repo with no code substrate, run through `init`, receives no coding-standards or
testing-guide file, and §6 states the condition that makes that correct rather than a deviation.

**DoD:**
- [x] Read `init.md`'s step-1 detection and confirm A1 — **confirmed at G2**: step 1 already detects
      stack / DB / auth and step 3 already fires conditional rows, so no new machinery is needed
- [x] Base-tier rows carry a **per-substrate** condition in the form step 3 already uses. The axis is
      *has code* · *publishes an artifact* · *has DB* · *has auth* — **not** "docs-only", since a docs
      repo that publishes still deploys (lean-flow is exactly that, and its deployment guides are right)
- [x] `DOCS_Guide` §6's base row states the condition, so the standard and `init` agree
- [x] **Consumer check (L-015)** — traced on a repo with no code substrate, not on dogfooding alone
- [x] `scripts/qa-check.sh` re-run **bare** immediately before the commit (L-089)

### T2 — Name the `Cites:` escape in the two completeness FAILs `[size: S · risk: low · class: execution · HITL]`
Layers: `scripts/lib/check-layers-completeness.sh` · `evals/fixtures/layers-completeness/` ·
    `evals/run-layers-completeness-fixtures.sh` · `docs/QA.md`
Depends-on: none
Cites: `scripts/qa-check.sh`

TD-039. The two FAILs an author actually trips say what is absent from `Layers:` and never mention the
escape, so the obvious repair is to declare a touch that is not one — the behaviour the escape exists
to prevent. TD-036 hunted this gap on the authoring surfaces and found it on neither, because the
surface a failing author reads is the FAIL message itself.

**Acceptance:** an author who trips either completeness FAIL learns from the message that `Cites:`
exists, without reading the checker's source.

**DoD:**
- [x] **Mitigation re-derived before it is built** (L-091, TECH-DEBT header) — confirm A3, that the
      message is where an author looks, and that naming an escape there does not read as an invitation
      to silence the gate
- [x] Both completeness FAILs name the escape; the `Cites:`/`Layers:` contradiction FAIL is unchanged
- [x] A must-FAIL fixture per changed check (L-058), **retained** not deleted (TD-012)
- [x] Proven as a change, not just as code: red-on-new / green-on-old against `git show HEAD:` (L-090)
- [x] `docs/QA.md`'s layers-completeness row still matches the shipped behaviour
- [x] `scripts/qa-check.sh` re-run **bare** immediately before the commit (L-089)

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
- [x] INDEX rows 049 and 051 name v1.27.1 instead of "PATCH pending"
- [x] The glossary claim resolved — content added, relocated, or the claim dropped
- [x] Before dropping it, check whether any **consumer-facing** surface promises the glossary (L-015);
      CONTEXT.md sits at 123/130, so adding a section displaces something
- [x] `scripts/qa-check.sh` re-run **bare** immediately before the commit (L-089)

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
- [x] **Placed by §10's test** — enumerate the flows that can hit it (`/triage` setting `needs-info` ·
      `close` routing a follow-up · `promote` re-reviewing aged TD · a research scan writing "no new
      evidence"), then place where all of them read
- [x] If the honest enumeration is "every flow", the home is `CLAUDE.md` at 80/80 — a **displacement
      ruling**, never a silent cap breach (A2)
- [x] Any stale duplicate of the rule rewritten to point at the one home — the wiring half (L-092)
- [x] Entry collapsed to a pointer line per §11; ids stay monotonic (next new id L-096)
- [x] `docs/knowledge-index.md` regenerated (`sh scripts/gen-index.sh`)
- [x] `scripts/qa-check.sh` re-run **bare** immediately before the commit (L-089)

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
- **D6** — **T1 narrowed to the mechanism** *(owner ruling, 2026-08-09 — logged as a `scope-change`
  before § Plan was edited)*. Its "docs-only" premise was falsified by its own A1 confirm step, and its
  second half proved to be ~6 new documents rather than an exemption ruling. The dropped half is
  **TASK-165**, filed rather than lost.

## Assumptions

- **A1** — `init`'s existing substrate detection extends to "has code" / "is deployable" without new
  machinery. *Confirm: T1's first DoD line, by reading `init.md` step 1. If new detection is required,
  T1 is L-sized and splits rather than absorbing the growth silently.* **CONFIRMED at G2** — and the
  same read falsified T1's "docs-only" premise, which is what triggered the scope-change.
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
| `skills/lean-doc-generator/references/init.md` | T1 | base table gains a Condition column (has code · publishes an artifact); step 2 stops saying "always" and reports skips | low | consumer trace ×2 |
| `skills/lean-doc-generator/references/DOCS_Guide.md` | T1 | §6's base row states the same conditions, so standard and tool agree | low | `qa-check.sh` |
| `scripts/lib/check-layers-completeness.sh` | T2 | both completeness FAILs name the `Cites:` escape, stating the condition not the remedy | low | fixtures + old/new pair |
| `evals/run-layers-completeness-fixtures.sh` | T2 | expectations assert the hint, so it cannot silently vanish (TD-012) | low | harness green |
| `docs/QA.md` | T2 | records that the FAIL now names the escape and that fixtures guard it | low | `qa-check.sh` |
| `docs/sprint/INDEX.md` | T3 | three rows (049 · 051 · 052) name their release instead of "PATCH pending" | low | read-back |
| `.claude/CONTEXT.md` | T3 | glossary line states the placement rule + create-lazily condition, rather than asserting content §7 says should not exist yet | low | `qa-check.sh` |
| `.claude/CONTEXT.md` | T4 | § Continuous learning governance gains L-094's rule — name the class of fact before deferring (owned by T3, committed after it per D4) | low | `qa-check.sh` |
| `docs/LEARNINGS.md` | T4 | L-094 collapsed to a pointer, `promoted: yes → CONTEXT.md` | low | `gen-index.sh` |

## Retro
<!-- Written at close. Route the buckets to durable homes (DOCS_Guide §10):
     shipped → CHANGELOG.md · tech debt → TD-NNN · follow-ups → TASK-NNN · learnings → docs/LEARNINGS.md. -->

Four tasks, 21/21 DoD, one scope-change. Every task was a surface disagreeing with reality, and in
three of the four the disagreement was **larger or differently shaped than the Plan said** — which is
the sprint's real result. A theme built on "these four things are untrue" turned out to be a theme
about how the untruths got there.

**Retrieval check** — no miss and no contradiction. Eight prior rules were found and applied on
purpose: L-088 (the scope-change), L-091 (re-derive a Mitigation), L-092 (the placement test), L-058
and L-090 (the gate's fixture bar), L-015 and L-016 (consumer surface, consumer path), TD-012 (retain
fixtures). Two were applied *against the author* rather than by them, which is the stronger signal:
the observed leg caught T2's own declaration gap, and A1's confirm step falsified T1's premise.

**Cost** — inline, coordinator only, zero dispatched agents. `dispatch.md` would have sent T2
(`execution`) and T3 (`mechanical-ingest`) to sub-agents by default; the session carried a standing
no-subagent constraint, so both ran inline and that is a **deviation from the dispatch default, not a
judgement that dispatch was unwarranted**. Cost favoured inline anyway — two S-sized doc tasks would
each re-pay the full substrate for ~10 minutes of work. 9 commits, 12 files, ~4 hours wall-clock
including promote and release. Comparable to SPRINT-052's shape, one task larger.

**Worked**
- **Confirming an assumption from its source before building on it.** A1 was written as "confirm at
  T1's first step" and doing it there — rather than treating it as a formality — is the only reason
  T1's premise was corrected before it became a wrong edit rather than after.
- **Checking who depends on a claim before deleting it.** T3's glossary line looked like dead text;
  three skills depend on that placement, and §7 says the *absence* is correct. The obvious fix was the
  wrong one and the check cost one grep.
- **Letting a gate be right about you.** The observed leg reported a real omission in T2's own
  declaration; treating it as a correct FAIL rather than noise took ten seconds and left the
  declaration honest.

**Friction**
- **T1 shipped into the sprint with a falsified premise**, and it survived intake, promote and G1
  because "a docs-only repo doesn't need deployment guides" reads as obviously true. Only running it
  against our own repo exposed it. Cost: one scope-change and a re-scope mid-gate.
- **A declaration gap and three stale INDEX rows, all self-inflicted** — the fixtures directory named
  where the harness was edited, and a "PATCH pending" row I wrote hours before cutting the release it
  was pending on. Both cheap to fix, both invisible without a check that reads reality instead of text.
- **The preflight under-reads wrapped declarations** (→ TD-040), found at promote and carried unfiled
  until this close swept for it.

**Pattern candidate** (surface to user → `docs/LEARNINGS.md`)
- **L-096 filed** — a rule that predicts what should exist is falsifiable in one step against a case
  whose answer you already know, and the sharpest such case is your own repo: a wrong rule announces
  itself by predicting reality out of existence. Count 1.
- **No entry for T1's stale premise itself** — that is L-088, already promoted, already fired here and
  handled the way it prescribes. Recording it again as a new id would duplicate a durable rule.

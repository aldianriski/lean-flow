---
sprint: 037
slug: gates-and-evals
owner: Maintainer
last_updated: 2026-07-30
status: closed
plan_commit: 5e5bd95
close_commit: 08ca2a6
update_trigger: sprint execute/close events
---

# SPRINT-037 — Gates and Evals

> **Theme:** Make the gates real. Productionize the preflight T2-036 proved feasible, close the
> allowlist gap the T4-036 probe found, prototype the first behavioral eval on that probe's own
> fixture, and spec the capability preflight into Part 0. Clears every still-live item from the
> external review except what ADR-013 deliberately deferred or killed.

## Scope

**In:** dispatch preflight productionized (checks + waves, negative-tested) · `/handoff` in the
night-run allowlist · one behavioral eval fixture end-to-end · capability-preflight spec (Part 0
extension, surface resolved at promote).
**Out (deferred):** the full eval suite (T3's captured answer decides it) · capability-preflight
*implementation* (T4 specs; a graduation TASK builds) · TASK-120 run-state (blocked, expiry
SPRINT-040) · TASK-074 layout migration (P3) · TD-011 rider (next ADR-010 touch).

## Plan

### T1 — Productionize the dispatch preflight `[size: S · risk: low · class: execution · HITL]` (TASK-121)
Layers: skills/orchestrator/references/dispatch.md · (script home per G2 — consumer surface open)
Depends-on: none
T2-036's prototype is the spec: cycles · shared-file single-owner · base-ref-vs-HEAD · wave
computation, all from the three lint-mandatory tokens. G2 decides the one open design point:
shipped-in-plugin script vs documented procedure the host repo owns (L-015/L-016 bind either way).

**Acceptance:** the pre-dispatch gate exists as a real step in the dispatch procedure,
negative-tested, and fired once on a real sprint before a parallel wave.

**DoD:**
- [x] the three checks + wave computation ship as a pre-dispatch step (form decided at G2)
- [x] negative-tested per L-058 — one must-FAIL fixture per check, each failing with its named finding
- [x] fired once on a real sprint before a parallel wave (L-007)

### T2 — Add /handoff to the night-run allowlist builder `[size: S · risk: low · class: execution · HITL]` (TASK-122)
Layers: skills/orchestrator/references/night-run.md (Part 1)
Depends-on: none
The T4-036 probe's clean halt was stopped one step short: `Skill(/handoff)` denied under
`dontAsk`. The halt-via-Execution-Log fallback held, but the protocol should complete.

**Acceptance:** Part 1's allowlist builder includes the `/handoff` invocation; the next headless
probe should reach it without a `denied-tool` record (full proof rides that future run).

**DoD:**
- [x] Part 1 allowlist builder includes the /handoff invocation, consumer-legible (L-015)
- [x] fallback (halt-record via Execution Log) stays documented — the allowlist add is belt, not replacement
- [x] verification note logged: proof completes on the next real headless run

### T3 — Prototype one behavioral eval fixture end-to-end `[size: S · risk: low · class: execution · HITL]` (TASK-116)
Layers: (throwaway per /prototype discipline · capture → docs/research/ or ADR)
Depends-on: none
One question: is a behavioral eval harness feasible and cheap? T4-036's fixture notes are the
seed: park-record shape · denied-tool pattern · `lean-flow@lean-flow` update quirk · WIP-refusal.

**Acceptance:** one safety eval (unattended run parks HITL work) runs headless against the
installed plugin and asserts behavior — files written · state transitions · exit status — never
prose; the captured answer decomposes the full suite or rejects it with a revisit-if.

**DoD:**
- [x] the eval runs headless against the installed plugin, asserting behavior not prose (reuses the T4-036 fixture notes)
- [x] must-FAIL leg included (L-058): a fixture where the contract is violated is detected as FAIL
- [x] captured answer (harness shape · cost · worth-it) → decompose suite or reject with revisit-if; code deleted

### T4 — Spec the capability preflight into Part 0 `[size: S · risk: low · class: decision · HITL]` (TASK-117)
Layers: skills/orchestrator/references/night-run.md (Part 0 — after T2's Part 1 edit lands)
Depends-on: T2
Surface resolved at promote: extend the existing pre-flight, no `/prime` flag. Spec only —
implementation graduates to its own TASK.

**Acceptance:** capability checks specified behavior-first (agent dispatch · worktree · ask
channel · cache-vs-repo version) with degrade rules (no worktree → sequential · no ask channel →
park HITL · cache mismatch → block unattended), delta-mapped against Part 0's existing checks.

**DoD:**
- [x] delta vs existing Part 0 pre-flight mapped first — only the unmatched remainder is spec'd (L-017)
- [x] checks specified behavior-first with the three degrade rules
- [x] spec lands as the Part 0 extension or a graduation TASK-NNN (G2 decides which)

## Decisions (pre-locked)

- **D1** — T4 surface: night-run Part 0 pre-flight extension, not a /prime flag (owner, 2026-07-30 promote).
- **D2** — Overlap map: `night-run.md` → T2 (Part 1) lands before T4 (Part 0); `dispatch.md` → T1 only. T3 touches no source.
- **D3** — T1's script-home question (shipped vs host-owned vs procedure-only) is THE G2 item; qa-check.sh stays maintainer-only regardless (ADR-008).

## Assumptions

- **A1** — T2-036's prototype design transfers as-is (163-line POSIX sh, all four derivations). *Confirm: T1 G2.*
- **A2** — T3 may reject the eval suite — valid outcome, revisit-if recorded. *Confirm: capture written either way.*
- **A3** — T4 stays spec-only even if the spec is small enough to implement — wiring is a separate verified step (L-020). *Confirm: G2 holds the line.*

## Execution Log

### 2026-07-30 | T3 complete | eval harness ADOPTED — feasible and cheap, on measured numbers
Capture → `docs/research/behavioral-eval-feasibility.md`. One fixture ran clean on the **first**
headless attempt (no grinding against the effort bound): throwaway fixture repo, real
`claude -p "/orchestrator sprint-bulk unattended" --permission-mode dontAsk`, four **structural**
assertions — DoD checkbox still `[ ]` · target file alive in tree *and* at HEAD · Part-4-shaped park
record appended · no commit claiming completion. All four PASS. Nothing graded prose, which was the
whole point (an LLM-judge harness was considered and rejected for exactly that).
**Cost, measured not estimated:** $0.797 · ~140s · 14 turns, read off `--output-format json`'s own
`total_cost_usd`/`usage` — no instrumentation to build. Reusable share is high: a ~40-line fixture
skeleton plus a ~40-line POSIX-sh assertion script, parameterized by task id + target file, serve most
boundary-table rows. Fixture setup needs **no** plugin install — the user-scope cache resolves the real
skill from any cwd.
**Honest limit on the verdict (recorded, not smoothed over):** the must-FAIL leg is the *synthetic*
kind — a hand-built violating end-state fed to the same assertion script, all four correctly FAIL. That
proves the assertions **discriminate** rather than rubber-stamp, which is L-058's point, but the harness
has never yet caught a *real* run misbehaving. Until a genuinely violating run exists, this is validated
assertion logic, not a proven regression gate. Named as the first open question in the capture.
Cost caveat worth carrying: the run inherited the session's Opus tier because no `--model` was passed —
an eval loop should pin the tier explicitly, so the $0.797 is an upper bound, not the suite's rate.
Prototype deleted (fixture repo, synthetic bad-copy, assertion script, run JSON, and the stray handoff
artifact it wrote to temp) — verified by the coordinator; the capture doc is the only survivor.

### 2026-07-30 | T4 complete | capability preflight spec'd — one of four checks rejected as already-covered
L-017 delta map run **before** spec'ing, and it changed the deliverable: of the four proposed checks,
**the ask-channel check is a reject** — Part 0's "Absence ≠ consent" already establishes there is no
channel headless (verified, with the park protocol as its degrade rule), so probing it would only
re-derive a known fact. Spec'ing it would have duplicated the SSOT (L-008). It stays in the table as a
pointer, not a check. Agent-dispatch = unmatched (kept). Worktree = *hygiene* was covered in
dispatch.md but *availability* wasn't (kept as the general rule). Skill-version = zero coverage
anywhere in night-run.md (kept, and it turned out to be the load-bearing one).
**The version check earned its place empirically, mid-sprint.** T3's headless run was served
`lean-flow@lean-flow` **v1.19.0** from the user-scope cache while this repo sits at **v1.20.0** — and
T1's preflight, committed hours earlier, is in no cache at all. So the trap the spec describes (edit a
skill, fire a night run, silently execute the *previous* procedure) is not hypothetical; it was live in
this sprint. That is why its degrade rule is **block**, not degrade: unlike the other rows there is no
correct reduced shape for executing a procedure nobody approved.
Placement judgment (D1's wording was loose — "Part 0 pre-flight" conflates Part 0 = the contract with
Part 1 = the pre-flight pass): the checks landed as a **Part 1 subsection**, where checks live and
where a human runs them, with the ask-channel row cross-referencing Part 0 instead of restating it.
A3 held — spec only, no probing mechanism built, nothing wired into other surfaces. Mechanism filed as
**TASK-123** (P2, `ready`) so it isn't orphaned, with the version check named as build-first.

### 2026-07-30 | T2 complete | /handoff allowlisted as a Part 1 pre-flight item
Kept inline (trivial doc edit; also avoids handing `night-run.md` between an agent and the
coordinator two steps before T4 edits the same file). Scope went one step past the task title on
purpose: allowlisting `Skill(/handoff)` alone is insufficient — the handoff **doc write to the OS
temp dir** is a separate tool call that `dontAsk` would also deny, so a run could clear the skill
gate and still fail to halt. Both are now named, and Part 3's watchdog recovery call is cited as the
second consumer of the same rule.
Deliberately **not** asserting a matcher string: the only evidence is one denial record
(`Skill(/handoff)`), so the item tells the reader to confirm what their builder emits rather than
fabricating rule syntax. That is what DoD 3's "proof completes on the next real headless run" means —
this task closes the *gap*, the next headless run closes the *proof*. Fallback (rollup line → Execution
Log) explicitly retained as belt-not-replacement, so an allowlisted `/handoff` never becomes the only exit.
T4 unblocked (`Depends-on: T2` satisfied).

### 2026-07-30 | T1 complete | preflight shipped as a procedure step — negative-tested, fired on this Plan
D3 resolved at G2: **procedure step in `dispatch.md` + optional inline POSIX-sh snippet, no new file**
(ADR-013's addendum wording — "a preflight *step*, not a file format" — decided it; a shipped
executable was rejected as an ADR-008-scale precedent, a host-owned script as an L-015 leak).
A1 corrected: the 163-line prototype was scratch-only and **deleted**, so T1 rebuilt from the
recorded derivation, not a port — design transfer, not artifact transfer.
L-058 leg: 3 must-FAIL fixtures, each failing with its own named finding (`cycle-detected` ·
`shared-file-unowned` · `base-ref-drift`). **Guard proven load-bearing** — the same snippet with
`|| [ -n "$line" ]` stripped exits **0/CLEAR** on the overlap fixture, reproducing SPRINT-036's
silent false-negative live.
L-007 leg: fired on this sprint's own Plan → waves T1/T2/T3=0, T4=1; `night-run.md` flagged shared
between T2/T4 but **PASS** with order T2→T4 derived from T4's `Depends-on:` — the PASS-vs-FAIL
nuance a positive-only run would never have surfaced. That output is the gate for wave C below.
Judgment call confirmed by the coordinator: declared base is an **argument**, never read from
`plan_commit:` — `plan_commit` marks the plan freeze, the wave base is live HEAD at spawn (reading
frontmatter would spuriously FAIL on ordinary post-promote bookkeeping, as it would here: 5e5bd95
vs HEAD 508f19e).
Wiring (L-020, coordinator — beyond T1's declared Layers, recorded not silent): `orchestrator/SKILL.md`
step 3 now runs the preflight *first*; `.claude/CONTEXT.md` § Model tiers pointer names it. Both as
in-line clauses — SKILL.md 100/110 and CONTEXT.md 119/130 have no headroom for new lines (L-008).
`night-run.md` pre-flight is the third surface — deferred to T4, which owns that file next.

### 2026-07-30 | gates | batch G1+G2 signed off
Fast-path G1 (promoted same session). G2: **no worktree isolation** — L-055 applied at design time,
but for a distinct reason from SPRINT-036's: worktrees fork from the *remote* default branch and
this sprint file exists only in two **unpushed** commits, so dispatch.md's own add/add corollary
fires. Fallback taken: shared-tree parallel dispatch — agents on disjoint files, **zero git writes
by agents**, coordinator owns all staging/commits. Declared base = 508f19e (verified = live HEAD).
Sequence corrected during G2: T1 cannot sit inside the wave it gates (its DoD 3 is "fired before a
parallel wave"), so T1 lands first, its output gates wave C. T2 stays inline (trivial, and avoids
handing `night-run.md` between an agent and the coordinator two steps before T4 edits it); T4 is
`class: decision` → inline per ADR-010.

### 2026-07-30 | promote | plan locked
Four tasks (TASK-121/122/116/117 → T1–T4). Governance clean; TASK-117's needs-info resolved at
promote (owner: Part 0 surface). TASK-120 expiry countdown: 3 sprints to SPRINT-040.

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| `skills/orchestrator/references/dispatch.md` | T1 | pre-dispatch preflight step + optional snippet — the wave-shape call becomes gated instead of assumed | low | 3 must-FAIL fixtures (each named finding) + fired on this Plan, re-fired at the wave boundary |
| `skills/orchestrator/SKILL.md` | T1 | `sprint-bulk` step 3 runs the preflight *first* — wiring, so the gate fires rather than merely exists (L-020) | low | qa-check caps (100/110) |
| `.claude/CONTEXT.md` | T1 | dispatch pointer names the preflight — SSOT discoverability | low | qa-check caps (119/130) |
| `skills/orchestrator/references/night-run.md` | T2 · T4 | Part 1: `/handoff` **and** its temp-doc write allowlisted (the halt can't complete otherwise); new § Capability checks spec'd behaviour-first | low | checklist structure re-read (L-009); T2's full proof rides the next real headless run |
| `docs/research/behavioral-eval-feasibility.md` | T3 | the adopt verdict + measured cost — sole survivor of the deleted prototype | low | n/a (research capture) |
| `TODO.md` | T4 · close | TASK-123 (probe mechanism) + TASK-124 (eval suite) filed; Active Sprint pointer cleared | low | qa-check |
| `TECH-DEBT.md` | close | TD-012 — the shipped snippet's fixtures were deleted with the prototype | low | qa-check |
| `docs/LEARNINGS.md` | close | L-058 → count 2 (promotion candidate); L-059 + L-060 filed | low | qa-check index lint |
| `docs/knowledge-index.md` | T3 · close | regenerated for the new research + learning entries (derived view, ADR-009) | low | qa-check index lint |

## Retro

<!-- Written at close. -->

**Retrieval check** — no miss, and four retrieval **wins**, two of which changed the work rather than
merely decorating it: **L-017** at T4 rejected one of four proposed checks as already-covered by Part 0
(the delta map was run first, as the DoD demanded, and it *subtracted* scope); **L-055 / the declared-base
rule** killed worktree isolation at G2 before a single agent spawned — and for a cause distinct from
SPRINT-036's, since this sprint's own file lived only in unpushed commits; **L-058** drove the must-FAIL
legs on both T1 and T3; **L-010** kept every read on repo source rather than the 1.18.0 cache actually
serving this session. One prior-decision imprecision surfaced (not a contradiction): D1's "Part 0
pre-flight" conflated Part 0 (the contract) with Part 1 (the pre-flight pass), resolved in-task.

**Worked**
- **The gate gated its own sprint.** T1's preflight was sequenced ahead of the wave it governs, then
  fired on this Plan to authorize the T3 dispatch, and re-fired at the wave boundary after HEAD moved.
  L-007's "exercised once on real input" came free from ordering rather than from a contrived demo.
- **The best real input was the one we already had.** SPRINT-037's own Plan contained the hard case —
  `night-run.md` in two tasks' `Layers:` — forcing the PASS-vs-FAIL distinction between an overlap
  serialized by `Depends-on:` and an unowned one. A synthetic fixture would have tested the easy half.
- **Negative testing paid twice, in different currencies.** T1 stripped its own guard and watched the
  gate report `CLEAR` on a real overlap; T3 fed a violating end-state to its assertion script and watched
  all four checks flip. Neither positive run could have produced that information.
- **L-017 subtracting scope.** Three of four checks shipped, and the sprint is better for the fourth
  not shipping. Mapping the delta *before* writing is what made the rejection cheap.
- **Cost as a first-class verdict input.** T3 read $0.797 / 140s off the runner's own JSON instead of
  building instrumentation — "feasible" and "cheap" were answered by the same run.

**Friction**
- **D1's Part 0 / Part 1 wording.** A promote-time decision named a surface imprecisely and the
  ambiguity had to be resolved mid-task. Cheap here; the general lesson is that a pre-locked decision
  should name the *section it edits*, not the part number it remembers.
- **The eval's must-FAIL leg is synthetic.** Validated assertion logic, not a proven regression gate.
  Recorded in the capture and carried into TASK-124 rather than smoothed over in the verdict.
- **T1's negative fixtures were deleted with the prototype** — the shipped snippet now has no retained
  regression guard (→ TD-012). Correct per `/prototype` discipline, wrong for a gate; the two
  disciplines collided and nobody noticed until close.
- **Two false reads of my own tooling**, both L-057-family: an unset `$TMPDIR` made a redirect fail and
  report `EXIT=1` with qa-check never running (→ L-059), and a PowerShell here-string handed to the Bash
  tool silently committed `@` as T1's subject line (→ L-060, amended).

**Pattern candidate** (surface to user → `docs/LEARNINGS.md`)
- **L-058 → count 2, promotion candidate at next promote.** Second sprint running, and this time the
  silent false-negative was reproduced *deliberately* on production code. Candidate durable homes: a
  CLAUDE.md anti-pattern, or a red-flag on whichever skill owns gate-shipping.
- **L-059** (a gate's status can come from the plumbing, not the gate) — filed, count 1.
- **L-060** (cross-shell string syntax fails silently in a dual-shell session) — filed, count 1.

**Buckets routed:** Shipped → root `CHANGELOG.md` **at release** (feature sprint → MINOR by hand;
`/release-patch` is PATCH-only) · Tech debt → **TD-012** · Follow-ups → **TASK-123** (capability probes,
filed in-task at T4) + **TASK-124** (eval suite) · Learnings → **L-058 bumped**, **L-059**, **L-060**.

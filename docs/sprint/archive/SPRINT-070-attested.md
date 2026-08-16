---
sprint: 070
slug: attested
epic: EPIC-003
owner: Maintainer
last_updated: 2026-08-16
status: closed
gates_signed: G1,G2 @ cac204b
plan_commit: 76eb88a
close_commit: d164924
update_trigger: sprint execute/close events
---

# SPRINT-070 — Attested

> **Theme:** EPIC-003's second member sprint. T1 specifies the git-native attestation format — the
> epic's D2, pending since ADR-018 — into `spec/` itself, so the thing an adopter pins is the thing
> that defines the top conformance level. T2 removes the stale-base pin that degraded every
> dispatch in SPRINT-069; it is unrelated to the epic and file-disjoint from T1.

## Scope

**In:** specify the attestation trailer format in `spec/`, record D2's ADR, and demonstrate it on a
real commit from this repo's history (T1) · make worktree dispatch branch from the coordinator's
HEAD, with a guard that halts when it does not (T2).

**Out (deferred):** the checker that *reads* a trailer — EPIC-004, and a format that cannot be
described without naming its engine belongs there (ADR-024's own boundary) · moving to per-task gate
signing, ruled against at this promote · commit signing itself, which nothing in this repo does yet
and which T1 documents rather than adopts · TASK-218 (TD-037's WIP masking) and TASK-188, both
`ready`/`blocked` in the Backlog and deliberately not pulled — this sprint is two `M` tasks.

## Plan

### T1 — Specify the git-native attestation format, with a worked example `[size: M · risk: med · class: decision · HITL]`
Layers: `spec/STANDARD.md` · `spec/CHANGELOG.md` · `docs/adr/` · `docs/DECISIONS.md` ·
        `docs/epic/EPIC-003-the-standard.md`
Depends-on: none
Cites: EPIC-003 D2 ("ADR pending, once the trailer format is designed against a real sprint's
       commits") · EPIC-003 § Closed-when 4 · ADR-018 § Decision (names the three fields) ·
       ADR-024 (Attested is the level this format defines) · L-097 (re-derive a stated figure)
The Attested level is defined and currently unreachable by anyone, including this repo. This is the
task that makes it describable — and the specification belongs in `spec/`, not only in an ADR,
because the spec is what an adopter pins and the ADR is why we chose it.

**Acceptance:** an adopter reading `spec/` alone can write a conformant trailer and say what a
verifier may conclude from it, with a real commit from this repo shown as the worked example.

**DoD:**
- [x] The trailer format specified in `spec/` — fields, which commit carries it, and its relation to
      the existing sprint-level `gates_signed:` — *Verify: the spec section stands alone; a reader
      needs no ADR and no `skills/` file to write a conformant trailer*
- [x] The **claim-vs-proof boundary stated in the spec, not softened** — an unsigned trailer is an
      assertion by whoever wrote it; signing is what makes it verifiable against a clone —
      *Verify: the section says so in its own words, and the worked example below demonstrates the
      weaker case rather than hiding it*
- [x] Worked example against a **real commit in this repo's history**, showing the trailer as it
      would appear and what a verifier can and cannot conclude — *Verify: the cited sha resolves;
      the example's signature status is re-derived at execution (`%G?`), never assumed*
- [x] D2's pending ADR recorded, with the two forks ruled at promote as its Alternatives —
      *Verify: `docs/DECISIONS.md` row + §4's three tests all hold*
- [x] `spec/` version bumped and its changelog entry written — a new section is a spec change, and
      the plugin's version must **not** move with it — *Verify: `spec/CHANGELOG.md` gains an entry;
      the four manifests are untouched by this task (EPIC-003 D3)*
- [x] EPIC-003 § Closed-when 4 ticked with its evidence — *Verify: the epic file; the gate's
      epic-archive leg still reports the epic correctly live*

### T2 — Stop worktree dispatch branching from a stale pinned base `[size: M · risk: med · class: execution · HITL]`
Layers: `skills/orchestrator/references/dispatch.md` · `evals/` · `scripts/qa-check.sh` ·
        `.claude/settings.json`
Depends-on: none
Cites: TD-054 (second sighting + the mechanism, 2026-08-16) · SPRINT-069 Execution Log ·
       L-091 (re-derive the cure; a guard against the wrong cause guards nothing) ·
       L-058 (a gate is exercised once on input that must FAIL)
Four worktrees across two sprints branched from one identical sha. In SPRINT-069 that cost a merge
conflict, forced a task inline, and made every merge require union-verification.

**Acceptance:** a dispatched worktree provably branches from the coordinator's HEAD, and a guard
halts the dispatch when it does not rather than leaving it to be discovered at merge.

**DoD:**
- [x] **The cause is established before the cure is written** — why the base is pinned, stated as a
      finding — *Verify: the finding names the mechanism, not just the symptom; L-091 forbids
      building on the symptom*
- [x] A dispatched worktree branches from the coordinator's HEAD, demonstrated on a **real
      dispatch** with the base recorded — *Verify: the worktree's merge-base equals the
      coordinator's HEAD at spawn, captured in the Execution Log*
- [x] A guard halts a dispatch whose base is not current, naming what it found —
      *Verify: a must-FAIL fixture drives a stale base through the guard and it FAILs by name*
- [x] The pre-dispatch preflight's base-ref item reflects the new guard —
      *Verify: the preflight's own `base-ref` leg still passes on a correct dispatch, and the
      reference text matches what the guard actually does*

## Decisions (pre-locked)

- **D1 — The attestation trailer references the batch sign-off; it does not move gates per-task.**
  It carries the existing sprint-level fact onto each task commit, so a verifier reads it from a
  clone without opening the sprint file. This raises **verifiability, not approval frequency**, and
  T1 must say so rather than implying granularity it does not deliver. Per-task gate signing was
  considered and declined: batch G1/G2 is what makes `sprint-bulk` viable. **→ folded into T1's ADR
  as an Alternative.**
- **D2 — `Gate-Signed-By:` names the human; the commit author stays the agent.** The spec states
  plainly that an unsigned trailer is a **claim, not proof**, and that full Attested strength needs
  commit signing. **→ folded into T1's ADR as an Alternative.**
- **D3 — T1 and T2 are file-disjoint** (preflight confirms at G2): T1 is `spec/` + `docs/`, T2 is
  the orchestrator reference + `evals/`. No shared file, no ordering constraint. **→ no ADR.**
- **D4 — The spec version moves and the plugin version does not.** T1 bumps `spec/` alone; this is
  EPIC-003 D3's second demonstration and the first where the spec moves *without* a plugin release
  driving it. **→ no ADR.**

## Assumptions

- **A1** — Trailers are already in active use in this repo (`Task: Tn`, `Co-Authored-By:`), so the
  mechanism needs no proving — only specifying. *Confirm: `git log --format=%(trailers)`, read
  2026-08-16.*
- **A2** — **No commit in this repo is signed** (`%G?` = `N` across recent history), so T1's worked
  example must demonstrate the *unsigned* case honestly. A worked example showing a signature that
  does not exist would be the theatre ADR-024 § Consequences already warns about. *Confirm: measured
  2026-08-16; re-derive at execution rather than trusting this line (L-097).*
- **A3** — TD-054's mechanism is a **pin, not drift**: four worktrees across SPRINT-068 and
  SPRINT-069 branched from the same sha. T2's first DoD line exists because the pin's *cause* is
  still un-derived, and L-091 forbids building the guard on the symptom. *Confirm: TD-054's second
  sighting entry, 2026-08-16.*
- **A4** — No cap blocks: `TODO.md` 178/320 · `CLAUDE.md` 63/80 · `CONTEXT.md` 132/150 ·
  `spec/STANDARD.md` has no §2 row yet, which T1 may need to rule on when it adds a section.
  *Confirm: gate cap legs, measured 2026-08-16.*
- **A5** — Governance resolved at this promote: L-promotion none · TD-051/047/045/037 re-reviewed,
  **TD-037's trigger fired after 20 sprints** and is vehicled as TASK-218 (not in this sprint) ·
  doc-aging clean. *Confirm: governance review 2026-08-16, owner-signed.*

## Execution Log

> **Lives in its own file** — `docs/sprint/logs/SPRINT-070-attested.md`, rendered from
> `templates/sprint-log.md.template` and created lazily at the first entry. Append there, never here:
> the Log grows with the work done, so keeping it out of this file is what stops it consuming the
> 400-line budget the Plan needs (STANDARD §9 · ADR-014). The `logs/` subdirectory is load-bearing —
> the sprint-file checks glob `docs/sprint/SPRINT-*.md` non-recursively, so a same-directory
> `-log.md` sibling would be capped and schema-checked as if it were a Plan.

## Files Changed

<!-- Filled during execution; feeds CHANGELOG at close. -->

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| `spec/STANDARD.md` | T1 | **+§13 HITL attestation** — the Attested level was defined and unwritable; the format belongs where an adopter pins it, not only in an ADR. Version 0.1.0 → 0.2.0 | med | `qa-check` doc-caps/citer legs; §13 read standalone against its acceptance test |
| `spec/CHANGELOG.md` | T1 | 0.2.0 entry — a new section is a spec change, and the plugin must not move with it (EPIC-003 D3) | low | `qa-check`; manifests verified untouched by T1 |
| `docs/adr/ADR-025-…md` | T1 | D2's pending ADR, incl. the correction to ADR-018's per-task granularity claim | low | §4's three tests re-checked at close |
| `docs/DECISIONS.md` | T1 | ADR-025 index row | low | `qa-check` |
| `docs/epic/EPIC-003-the-standard.md` | T1 · close | Closed-when 4 ticked with evidence; D2 → ADR-025; SPRINT-070 member row completed | low | `qa-check` epic-archive leg (epic stays open: 2 and 5 remain) |
| `skills/orchestrator/references/dispatch.md` | T2 | Base-pin cause + cure, **worktree-base guard**, anchor retrofit, preflight base-ref scope correction, worktree-sweep note | **high** | `run-worktree-base-fixtures.sh` (7 assertions, defect-seeded); `run-dispatch-preflight-fixtures.sh` 10/10 |
| `.claude/settings.json` | T2 | `worktree.baseRef: "head"` — removes the pin at its cause | med | proven live: dispatched worktree returned at coordinator HEAD with `spec/` present |
| `evals/run-worktree-base-fixtures.sh` | T2 | **new** must-FAIL harness, one case per named finding + PASS control | low | self; verified to bite by inverting the guard (4 of 7 red) |
| `evals/run-dispatch-preflight-fixtures.sh` | T2 | switched to `extract_between_anchors` — a 2nd ```sh block is what the old helper fails loud on | med | 10/10 cases still green post-switch |
| `evals/README.md` · `scripts/qa-check.sh` | T2 | wire the new harness into the opt-in set + document the tier reasoning | low | `QA_FULL=1` shows `PASS eval harness run-worktree-base-fixtures.sh` |
| `CHANGELOG.md` · 4 manifests · `README.md` | close | v1.44.0 MINOR; v1.42.0 rotated out per §11 | low | `check-manifest-lockstep.sh` 4/4; every rotation link resolves |
| `TECH-DEBT.md` | close | TD-054 **resolved**; TD-058 (spec uncapped) + TD-059 (guard fixtures opt-in) filed | low | `qa-check` |
| `docs/LEARNINGS.md` · `TODO.md` | close | L-127 · L-128 filed; TASK-219 filed `origin: close-retro`; pointer cleared | low | `qa-check` task-origin leg |

## Retro

**Retrieval check** — did we fail to find, or contradict, a prior `L-NNN`/ADR this sprint? **Yes, and
it is this sprint's defining finding.** TD-054 held one question open from SPRINT-063 to SPRINT-069 —
*why* does a dispatched worktree branch from a stale sha — and forbade writing the guard until it was
answered (L-091). The answer was already in the repo the whole time: **L-046** (SPRINT-026,
`status: active`) states the mechanism verbatim, and `dispatch.md`'s own base-ref caveat repeats
it — *inside the file T2 was promoted to edit*. Three aging re-reviews each re-asked the question and
re-parked it; none searched the record. This is not a failure to *find*, it is a failure to *look*,
and it is L-094's sibling: that rule tells you to name the class of fact that would close a question,
but not to check whether the fact is already recorded. Two smaller instances of the same family:
**A4** stated `TODO.md 178/320` when the file was 118 at HEAD *and* at `plan_commit` (never true, not
drifted), and **D2**'s rationale asserts "the commit author stays the agent" when this repo's commits
are authored by the human with the agent as `Co-Authored-By:`. Every one was caught by re-deriving a
figure, never by recalling a rule — CLAUDE.md's cross-check clause again.

**Cost** — coordinator inline for both tasks and all gates (the session model), plus **one `haiku`
measurement worktree agent (~28k)** for T2's live demonstration. No parallel builders: worktree
dispatch was disqualified at G2 by the very defect T2 existed to fix, since `spec/` exists only in
unpushed commits. Effective dispatch this sprint: 1 of 1 planned, and it was a measurement, not a build.

**Worked**
- **Measuring before the gate, not after the merge.** Resolving `origin/main` during G1 turned D3's
  "no ordering constraint" into a real ordering, and disqualified worktree dispatch *before* it could
  produce an add/add merge on `spec/STANDARD.md`. SPRINT-069 paid that cost at merge-back; this one
  paid two commands.
- **The must-FAIL suite was verified by breaking the guard.** Inverting one comparison turned 4 of 7
  assertions red. A green must-FAIL suite is evidence about nothing until the thing it guards is
  actually broken — L-058's point, exercised rather than cited.
- **Re-deriving instead of repeating.** A2's 20-commit sample became a 673-of-673 census reconciled
  against `rev-list --count`. The worked example in `spec/` §13 now rests on the whole history.
- **The gate caught the undeclared `Layers:` file before the commit**, not in review — one line to fix.

**Friction**
- **The evidence destroyed itself.** The demonstration worktree *and its branch* were auto-removed the
  moment the agent returned, because it finished without changes — so the guard could never be run
  against the very worktree that proved the cure. Now written into `dispatch.md`: capture the base
  from inside the worktree, or not at all.
- **Three frozen statements in the Plan were wrong or stale** (A4's line count · D2's author premise ·
  ADR-018's granularity claim, corrected by D1). None blocked; all needed re-derivation to notice.
  A pre-locked decision's *rationale* gets no less scrutiny than its ruling.
- **The session ran 1.41.0 skills against a 1.43.0 repo for the whole sprint** — L-021, third sighting
  of the running-stale leg. Survived only because every procedure was read from `skills/` in the repo
  rather than the cache, which is reaching past the stale procedure, not following it.
- **The guard's own fixtures are opt-in**, by `qa-check.sh`'s declared cheap-and-git-free rule. The
  defect they cover went six sprints unnoticed, which is the argument against — recorded as **TD-059**
  rather than silently overridden.

**Pattern candidate** (surface to user → `docs/LEARNINGS.md`) — **L-127 filed**: before parking a
question for want of evidence, search the repo's own answered record; an aging re-review that only
re-asks will re-park a question the corpus already closed. **L-128 filed**: a subagent worktree that
finishes without changes is deleted with its branch on return, so any fact about it must be captured
from inside it while it lives — the artifact is destroyed by design and the report is all that
survives.

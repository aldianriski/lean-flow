---
sprint: 070
slug: attested
epic: EPIC-003
owner: Maintainer
last_updated: 2026-08-16
status: active
gates_signed: G1,G2 @ cac204b
plan_commit: 76eb88a
close_commit: [sha — set at close]
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
- [ ] The trailer format specified in `spec/` — fields, which commit carries it, and its relation to
      the existing sprint-level `gates_signed:` — *Verify: the spec section stands alone; a reader
      needs no ADR and no `skills/` file to write a conformant trailer*
- [ ] The **claim-vs-proof boundary stated in the spec, not softened** — an unsigned trailer is an
      assertion by whoever wrote it; signing is what makes it verifiable against a clone —
      *Verify: the section says so in its own words, and the worked example below demonstrates the
      weaker case rather than hiding it*
- [ ] Worked example against a **real commit in this repo's history**, showing the trailer as it
      would appear and what a verifier can and cannot conclude — *Verify: the cited sha resolves;
      the example's signature status is re-derived at execution (`%G?`), never assumed*
- [ ] D2's pending ADR recorded, with the two forks ruled at promote as its Alternatives —
      *Verify: `docs/DECISIONS.md` row + §4's three tests all hold*
- [ ] `spec/` version bumped and its changelog entry written — a new section is a spec change, and
      the plugin's version must **not** move with it — *Verify: `spec/CHANGELOG.md` gains an entry;
      the four manifests are untouched by this task (EPIC-003 D3)*
- [ ] EPIC-003 § Closed-when 4 ticked with its evidence — *Verify: the epic file; the gate's
      epic-archive leg still reports the epic correctly live*

### T2 — Stop worktree dispatch branching from a stale pinned base `[size: M · risk: med · class: execution · HITL]`
Layers: `skills/orchestrator/references/dispatch.md` · `evals/`
Depends-on: none
Cites: TD-054 (second sighting + the mechanism, 2026-08-16) · SPRINT-069 Execution Log ·
       L-091 (re-derive the cure; a guard against the wrong cause guards nothing) ·
       L-058 (a gate is exercised once on input that must FAIL)
Four worktrees across two sprints branched from one identical sha. In SPRINT-069 that cost a merge
conflict, forced a task inline, and made every merge require union-verification.

**Acceptance:** a dispatched worktree provably branches from the coordinator's HEAD, and a guard
halts the dispatch when it does not rather than leaving it to be discovered at merge.

**DoD:**
- [ ] **The cause is established before the cure is written** — why the base is pinned, stated as a
      finding — *Verify: the finding names the mechanism, not just the symptom; L-091 forbids
      building on the symptom*
- [ ] A dispatched worktree branches from the coordinator's HEAD, demonstrated on a **real
      dispatch** with the base recorded — *Verify: the worktree's merge-base equals the
      coordinator's HEAD at spawn, captured in the Execution Log*
- [ ] A guard halts a dispatch whose base is not current, naming what it found —
      *Verify: a must-FAIL fixture drives a stale base through the guard and it FAILs by name*
- [ ] The pre-dispatch preflight's base-ref item reflects the new guard —
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

## Retro

<!-- Written at close. Route the buckets to durable homes (STANDARD §10):
     shipped → CHANGELOG.md (root) · tech debt → TD-NNN · follow-ups → TASK-NNN · learnings → docs/LEARNINGS.md.
     After close, the file moves → docs/sprint/archive/ + a one-line entry in docs/sprint/INDEX.md (§11). -->

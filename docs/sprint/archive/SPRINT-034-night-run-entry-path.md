---
sprint: 034
slug: night-run-entry-path
owner: Maintainer
last_updated: 2026-07-30
status: closed
plan_commit: 0583cfe
close_commit: ce93d59
update_trigger: sprint execute/close events
---

# SPRINT-034 — Night-Run Entry Path

> **Theme:** SPRINT-033 hardened what an unattended run may *do* once running. This sprint hardens
> how one is *started*. A real consumer run exposed the gap: naming a mode keyword
> (`sprint-bulk unattended`) skips the feed pipeline entirely, so "run a night run for PRD X"
> spawns a background process instead of decompose → triage → promote → pre-flight → launch.
> Nobody owns the interactive launcher sequence. Both files that must carry the rule are at their
> hard cap today, so headroom comes first — foundations before features.

## Scope

**In:** (A) clear SSOT headroom in the two capped files and resolve TD-009; (B) define and wire the
night-run interactive launcher — prepare before spawn — at all four sites that must fire it.
**Out (deferred):** TASK-106 installed-plugin verification (can't run until this ships to the cache —
re-enters the loop after release) · TASK-074 ADR-012 layout migration (contends for `CONTEXT.md`) ·
any change to the Part 0 contract itself (SPRINT-033's exit-side rules stand unchanged) · hook-based
enforcement (ADR-011 holds — this is procedure, not a matcher).

## Plan

<!-- One block per task. Pulled from TODO.md Backlog at promote (dependency order). The DoD
     checkboxes are what /orchestrator sprint-bulk loops over and what /prime counts.
     T1 and T2 both own .claude/CONTEXT.md and skills/orchestrator/SKILL.md → see § Decisions D1
     for single-owner + commit order. -->

### T1 — Clear SSOT headroom in both capped files `[size: M · risk: med]`
Layers: `.claude/CONTEXT.md` · `skills/orchestrator/SKILL.md` · `skills/orchestrator/references/` · `TECH-DEBT.md`

Both SSOT surfaces sit at exactly zero headroom (`qa-check.sh` enforces 130 and 110 as hard caps),
so T2's rule cannot land without first displacing something. This is the L-008 / TD-006 accretion
signal firing a second time. Dedup by pointer-collapse (prose duplicating CLAUDE.md/README) and by
relocating procedure depth into `references/` — the L-012 pattern that resolved TD-008 — never by
compressing signal away to fit (DOCS_Guide §2 growth rule).

**Acceptance:** both files sit ≥10 lines under their caps with zero rules lost, `qa-check.sh` green.

**DoD:**
- [x] Dedup candidates for both files proposed to the owner as an explicit list — approved before any deletion
- [x] `.claude/CONTEXT.md` ≤ 120 lines (≥10 under its 130 cap), every removed line either duplicated elsewhere or relocated — **116**
- [x] `skills/orchestrator/SKILL.md` ≤ 100 lines (≥10 under its 110 cap), relocated depth landed in an existing `references/` file — **98**
- [x] No rule lost — a before/after rule inventory shows every behavioural rule still reachable from its SSOT
- [x] `sh scripts/qa-check.sh` green, including its roster/claim-count checks — 56 pass, 0 fail
- [x] `TECH-DEBT.md` TD-009 → `status: resolved → TASK-107`
<!-- QA: no test harness (markdown repo) — qa-check.sh is the mechanical gate; pair it with a
     fresh-context read of both files to catch author-blind fusion (L-009 · L-006). -->

### T2 — Wire the night-run interactive launcher: prepare before spawn `[size: M · risk: med]`
Layers: `skills/orchestrator/SKILL.md` · `skills/orchestrator/references/night-run.md` · `skills/flow/SKILL.md` · `.claude/CONTEXT.md`

The rule the four sites must agree on: an interactive session handed un-promoted intent runs the
feed pipeline **with its normal human gates** before any spawn, and never fires the Part 2 trigger
while pre-flight is red. `sprint-bulk` step 0's guard is not sufficient — it executes inside the
spawned headless process, where there is no ask channel. `/flow:38` already parks the *conducted
headless* case correctly; what is missing everywhere is the *launcher*.

**Acceptance:** given "run a night run for `<un-promoted intent>`", the interactive session runs
feed → plan → pre-flight before spawning, and refuses to spawn while pre-flight is red.

**DoD:**
- [x] Mode dispatch states that a mode keyword never bypasses the feed pipeline (`orchestrator/SKILL.md`)
- [x] A named red flag: never spawn an unattended run against an unpromoted Plan (`orchestrator/SKILL.md`)
- [x] `night-run.md` gains **Part 1a — Entry path**, ordered before Part 1, covering un-promoted intent at trigger time
- [x] Part 2 carries an explicit precondition: the trigger is not fired until Part 1 pre-flight is green
- [x] `.claude/CONTEXT.md` § Unattended carries the prepare-then-launch clause (needs T1's headroom)
- [x] `/flow` carries a stage-4 entry clause for the launcher case (A1: clause, not restructure)
- [x] Exercised once end-to-end on real input — the launcher path is walked, not just specced (L-007)
- [x] Consumer-surface check: no repo-local path or unresolvable `L-NNN`/`TASK-NNN` id leaked into shipped skill text (L-015)
<!-- QA: behaviour change to shipped skill text → fresh-context review of the four edited surfaces;
     no security/perf dimension. -->

## Owner-action checklist
<!-- Non-dev actions a human must do. Not dev tasks. -->
- [ ] Rotate the `v1.15.0` block out of `docs/CHANGELOG.md` → `docs/changelog/CHANGELOG-1.15.0.md` + one link line (§11 doc-aging finding raised at this promote; rule = keep current + previous MINOR inline)

## Decisions (pre-locked)
- **D1** — T1 and T2 both own `.claude/CONTEXT.md` and `skills/orchestrator/SKILL.md`. **Single owner = this sprint, sequential commit order T1 → T2**; T2 must not start until T1's headroom lands. No parallel/worktree dispatch for these two. At commit, stage shared files per-hunk (`git add -p` + verify `git diff --cached`) — never a plain `git add` over the other task's WIP (L-042).
- **D2** — Dedup widened to cover **both** capped files, not just `CONTEXT.md` (owner call at promote). Rationale: T2 adds lines to `orchestrator/SKILL.md`, which is equally at cap; compressing-to-fit is exactly what created TD-009.
- **D3** — **No ADR.** The rule is reversible, unsurprising, and has no genuine competing alternative — it fails all three §4 tests. ADR-011 (no gate enforcement) stands: this ships as procedure, not a hook.

## Assumptions
- **A1** — `/flow` needs a small stage-4 entry clause, not a stage-4 restructure; `:38` already parks the conducted headless case correctly. *Confirm: G2 design review against `skills/flow/SKILL.md`.*
- **A2** — The rule is general ("a mode keyword never bypasses the feed pipeline") with the unattended launcher as its sharp case — overlapping but not replacing `sprint-bulk` step 0's guard. *Confirm: G2; verify the two rules don't contradict.*
- **A3** — Every T1 deletion is propose→approve, never silent (CLAUDE.md: don't delete content you didn't touch). *Confirm: T1 DoD line 1.*
- **A4** — T1's relocation target is an existing `orchestrator/references/` file, not a new one. *Confirm: G2.*
- **A5** — The defect is real on the installed plugin, not only repo source — evidenced by the owner's own run in another repo. *Confirm: already observed; TASK-106 re-verifies post-release.*

## Execution Log
<!-- Append-only, dated. Log here rather than editing § Plan — the plan is frozen at promote. -->

### 2026-07-29 | promote | SPRINT-034 planned from TASK-107 → TASK-108
Governance review clean on L-promotion and TD aging; one doc-aging finding (v1.15.0 CHANGELOG
rotation) routed to § Owner-action. Composition held to the dependency pair — TASK-106 deferred
because it verifies from the plugin cache, which cannot contain this fix until after close+release.

### 2026-07-30 | T1 done | SSOT headroom cleared; TD-009 resolved
CONTEXT.md 130 → 116 (pointer-collapse of prose duplicating CLAUDE.md / README / ARCHITECTURE /
DOCS_Guide). orchestrator/SKILL.md 110 → 98 by relocating the Implement-routing + dispatch
blockquote into `references/dispatch.md` (A4 held — existing file, no new one). One audit catch:
the cut removed the *named* out-of-scope cloud tools while the pointer target didn't list them —
relocated to `ARCHITECTURE.md` § Key integration points rather than dropped, so "zero rules lost"
is true and not merely asserted. qa-check 56/0. Fresh re-read of both files found no L-009 fusion.

### 2026-07-30 | T2 done | launcher wired at four sites; exercised on the originating input
Rule landed: intake routing (a mode keyword selects the mode, never bypasses the feed pipeline) +
a red flag; `night-run.md` Part 1a Entry path with a 5-row ordered table, placed before Part 1;
a Part 2 precondition blockquote; the CONTEXT § Unattended clause; a `/flow` launcher bullet.

**Real-input exercise (L-007).** Replayed this sprint's originating trigger — *"run night run for
finish prd feature driven"*, given right after `/prime` with no active sprint — against the new
text: intake bullet 5 fires (not a promoted Plan → interactive launcher) → Part 1a row 1 (`<X>` is
a PRD → `/task-decomposer`, human `approve`) → row 3 (no active sprint → `promote`, governance
sign-off) → row 4 (G1/G2) → row 5 (pre-flight → trigger). The observed failure — spawn first — is
now blocked at two independent points and named as a red flag. **Honest limit:** this is an
author-run text trace, not a cold-agent run; AgentTool dispatch is disabled by owner policy this
session, so the fresh-context leg of L-006 did not run. True consumer-path proof remains TASK-106
(verify from the installed cache) once this ships — the L-016 corollary, unchanged.

**Pre-existing, not touched:** `night-run.md:5,158` cite `docs/research/night-run.md`, a repo-local
path in shipped skill text. Predates this sprint; flagged for the close Retro rather than swept.

## Files Changed
<!-- Filled during execution; feeds CHANGELOG at close. -->

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| `.claude/CONTEXT.md` | T1·T2 | dedup to pointers; then the prepare-then-launch clause | Low | `qa-check.sh` cap 117≤130 |
| `skills/orchestrator/SKILL.md` | T1·T2 | relocate dispatch depth; then intake routing + the spawn red flag | Low | `qa-check.sh` cap 100≤110 |
| `skills/orchestrator/references/night-run.md` | T2 | Part 1a Entry path + Part 2 precondition — the missing launcher | Med | real-input trace (above) |
| `skills/flow/SKILL.md` | T2 | conductor launcher bullet — stages 1–3 before any spawn | Low | fresh re-read |
| `skills/orchestrator/references/dispatch.md` | T1 | receive the relocated Implement-routing table + `/goal` | Low | fresh re-read |
| `docs/ARCHITECTURE.md` | T1 | receive the relocated cloud-tools scope row (no rule lost) | Low | fresh re-read |
| `TECH-DEBT.md` | T1 | TD-009 → resolved → TASK-107 | Low | `qa-check.sh` TD aging |

## Retro
<!-- Written at close. Route the buckets to durable homes (DOCS_Guide §10):
     shipped → CHANGELOG · tech debt → TD-NNN · follow-ups → TASK-NNN · learnings → docs/LEARNINGS.md.
     After close, the file moves → docs/sprint/archive/ + a one-line entry in docs/sprint/INDEX.md (§11). -->

**Routed buckets** — Shipped → `docs/CHANGELOG.md` v1.18.0 · Tech debt → **TD-010** · Follow-ups →
**TASK-109** · Learnings → **L-054**.

**Retrieval check** — **no miss.** Prior learnings were found and applied throughout (L-007 exercise-on-real-input,
L-008/TD-006 dedup, L-009 re-read after structure-adjacent edits — which caught nothing this time but was run
three times, L-012 relocation pattern, L-015 consumer scan, L-016 consumer-path caveat, L-042 staging rule).
The sharper finding is the inverse: L-020 was already a promoted durable rule *and* a DoD line, and the defect
shipped anyway — because its wiring check enumerates a capability's trigger points and downstream consumers,
and nobody read "the entry path into the capability" as one of them. Recorded in L-054.

**Worked**
- Refusing to guess the PRD. Three rounds of clarification cost tokens but avoided building against
  `loop-hygiene-prd.md`, which was already fully consumed by SPRINT-024 — a plausible wrong answer.
- Sequencing headroom before the rule (D1). T2 needed 3 lines across two files that had zero; had they
  run in parallel, T2 would have hit a hard cap mid-edit and invited exactly the compress-to-fit move
  that created TD-009.
- Auditing the dedup against its own claim. "Zero rules lost" was false on first pass — the cut dropped
  the named out-of-scope cloud tools while the pointer target didn't list them. Checking the claim rather
  than asserting it turned a silent deletion into a relocation.

**Friction**
- The bug was reported as an observation about another repo's run, in three fragments across three turns.
  Most of this sprint's cost was in establishing *what happened* before any work could start.
- `qa-check` went red once on a stale knowledge index after edits that touched no metadata-carrying doc —
  the regen trigger is broader than DOCS_Guide §7 implies ("after writing a metadata-carrying doc").
- The L-006 fresh-context leg could not run (AgentTool disabled by owner policy), so the L-007 exercise is
  an author-run text trace. Deferred to TASK-109 rather than claimed as done.

**Pattern candidate** (surface to user → `docs/LEARNINGS.md`)
- **L-054 filed** — a guard that runs inside the process it protects cannot stop the decision to start that
  process; ask which side of a boundary the check runs on. Count 1; promote if a second sprint hits it.

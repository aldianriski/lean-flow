---
sprint: 034
slug: night-run-entry-path
owner: Maintainer
last_updated: 2026-07-29
status: active
plan_commit: 0583cfe
close_commit: [sha — set at close]
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
- [ ] Mode dispatch states that a mode keyword never bypasses the feed pipeline (`orchestrator/SKILL.md`)
- [ ] A named red flag: never spawn an unattended run against an unpromoted Plan (`orchestrator/SKILL.md`)
- [ ] `night-run.md` gains **Part 1a — Entry path**, ordered before Part 1, covering un-promoted intent at trigger time
- [ ] Part 2 carries an explicit precondition: the trigger is not fired until Part 1 pre-flight is green
- [ ] `.claude/CONTEXT.md` § Unattended carries the prepare-then-launch clause (needs T1's headroom)
- [ ] `/flow` carries a stage-4 entry clause for the launcher case (A1: clause, not restructure)
- [ ] Exercised once end-to-end on real input — the launcher path is walked, not just specced (L-007)
- [ ] Consumer-surface check: no repo-local path or unresolvable `L-NNN`/`TASK-NNN` id leaked into shipped skill text (L-015)
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

## Files Changed
<!-- Filled during execution; feeds CHANGELOG at close. -->

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| `.claude/CONTEXT.md` | T1 | dedup to pointers — free headroom for the T2 clause | Low | `qa-check.sh` cap 116≤130 |
| `skills/orchestrator/SKILL.md` | T1 | relocate dispatch depth to its reference — free headroom | Low | `qa-check.sh` cap 98≤110 |
| `skills/orchestrator/references/dispatch.md` | T1 | receive the relocated Implement-routing table + `/goal` | Low | fresh re-read |
| `docs/ARCHITECTURE.md` | T1 | receive the relocated cloud-tools scope row (no rule lost) | Low | fresh re-read |
| `TECH-DEBT.md` | T1 | TD-009 → resolved → TASK-107 | Low | `qa-check.sh` TD aging |

## Retro
<!-- Written at close. Route the buckets to durable homes (DOCS_Guide §10):
     shipped → CHANGELOG · tech debt → TD-NNN · follow-ups → TASK-NNN · learnings → docs/LEARNINGS.md.
     After close, the file moves → docs/sprint/archive/ + a one-line entry in docs/sprint/INDEX.md (§11). -->

**Retrieval check** — did we fail to find, or contradict, a prior `L-NNN`/ADR this sprint?

**Worked**

**Friction**

**Pattern candidate** (surface to user → `docs/LEARNINGS.md`)

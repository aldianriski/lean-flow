---
owner: Maintainer
last_updated: 2026-08-01
update_trigger: Sprint completed and changes reflected in docs
status: current
---

# lean-flow — Changelog

<!-- Prepend new sprints — newest first. Append-only; never edit past blocks. -->

---

## v1.25.2 — Permission Surface (2026-08-01)

PATCH — SPRINT-046. If you run unattended, two of these will save you a debugging session, because both
make a correct-looking allowlist do nothing without saying so.

**What changed for you:**
- **Night-run guidance now names two preconditions that were costing real runs.** First: a
  **directory-prefix permission rule never matches**. `Bash(sh evals/:*)` looks like coverage and
  authorizes nothing; exact-file, bare-command and space-glob forms all work. Second: an **untrusted
  workspace has its `permissions.allow` ignored entirely** — one warning line, otherwise silent, so
  every rule in the file is inert while looking correct. Both were measured one variable at a time, not
  inferred; the evidence is in `docs/research/headless-permission-surface.md`.
- **A hypothesis we had published is retracted.** The previous release's notes implied an unattended
  run's permission surface can narrow mid-session. A 26-turn probe found no such effect. The denials
  that suggested it were caused by **redirects** — `sh … > file` is denied where the same command
  without the redirect is permitted — which the existing "issue commands bare" guidance already covers.
  If you changed anything on account of that claim, you can undo it.
- **Parallel runs no longer report a false gate failure.** Agent worktrees are created inside the repo,
  and the declaration cross-check counted them as undeclared changes on every fan-out.

---

## v1.25.1 — Gate Precision (2026-08-01)

PATCH — SPRINT-045. Two guards were failing on input they should accept. A check that cries wolf on a
known-good state is on its way to being read past, which costs more than the false alarm itself — and
both of these were caught by blocking real work.

**What changed for you:**
- **A dependency chain now counts as shared-file ownership.** The dispatch preflight demanded a
  *direct* `Depends-on:` edge between every pair of tasks touching the same file, so a Plan that chained
  four tasks on one reference — unambiguously ordered, and impossible to collide because execution is
  strictly sequential — was HALTed. The workaround was writing redundant edges into the Plan, noise the
  next Plan copies. Ownership is now derived from the transitive closure, and the PASS line names the
  derived order so you can tell chain-ownership from direct.
- **The plan-commit window no longer reports a false failure.** The sprint convention records a plan
  commit's sha in a follow-up commit, so between the two there is a window — one that always exists —
  where the observed-layers check read a placeholder and reported `plan_commit not recorded`. That case
  is now a named SKIP. A genuinely missing or unresolvable value still FAILs by name; that leg was the
  whole risk of the change and it is covered by retained fixtures in both directions.

Both fixes narrow a **false positive only**. Neither loosens what its guard catches — verified against
adversarial fixtures built separately from the ones that shipped with the fixes.

---

## v1.25.0 — Proof Run and Night-Run Ergonomics (2026-08-01)

MINOR — SPRINT-043 **and** SPRINT-044, cut as one release. SPRINT-043 ran unattended and parked the
version choice, correctly: picking a release number is judgement, not execution. SPRINT-044 then
shipped more user-visible change on top, so releasing separately would have published half the surface
and left the rest pending. The previous release fixed the landing path that stranded a night run and
could not test it — the sprint that ships a fix cannot be the sprint that proves it. SPRINT-043 was the
proof: two genuinely disjoint tasks, fanned out to worktree agents, merged back through the integration
queue. **Both units landed.** Its predecessor built two and delivered zero.

**Night runs are now startable and walk-away-able (SPRINT-044):**
- **A launcher that tells you whether the run is actually alive.** `scripts/night-run.sh` re-checks the
  mechanically-verifiable half of pre-flight, fires **detached** — so closing your terminal cannot
  signal the run dead — waits ~2–3 minutes, then prints one verdict: `ALIVE`, or `DEAD-ON-ARRIVAL`
  naming what failed. `ALIVE` requires *observable progress*, not merely a live process: a run whose
  prompt was rejected sits up doing nothing and would otherwise look healthy for 20 minutes.
- **Permissions live in your settings file, not a command line.** The four-source allowlist derivation
  now lands in settings permissions — diffable, reviewable, and split the way a repo already splits
  config: shared rules tracked, owner-reserved ones local.
- **Issue commands bare.** A permission matcher reads the *literal* invocation, so a command you
  correctly authorized is still denied when wrapped in `cd X && …`. Of one run's 25 denials, **23 were
  form failures on commands that were individually permitted**. The derivation also now covers *tools*,
  not just commands — a two-shell host needs both authorized.
- **What an unattended run actually costs, measured.** Cache reads dominate — 26.5M against 191K output
  tokens — and turns drive cache reads, so the cost lever is turn count, not verbosity or agent count.
  About 40% of that run's turns went to denials. Details in `docs/research/night-run-cost.md`.
- **Resolved tech-debt rows are now deleted, not collapsed forever.** Three sprints after a debt is
  resolved its row goes entirely, instead of leaving a permanent pointer. Ids stay monotonic — a
  deleted row never frees its id.
- The unattended reference was **split 495 → 283 lines**, with the capability-check snippets moved to
  their own file.

**And from the proof run itself (SPRINT-043):**
- **Your `Layers:` declaration now gets checked against what actually changed.** The existing check
  compares a sprint task's declared files against the files its own DoD prose mentions — but both are
  written by one author at one moment, so it catches a file you *forgot* to declare and is blind to one
  *invented while implementing*. The new leg reads the git diff since the sprint's recorded plan commit
  and reports anything changed but undeclared. It cannot be forgotten, because it reads history rather
  than intent. Coordinator close-bookkeeping files are excluded, each with its reason stated in the
  checker rather than hidden in a silent skip list.
- **A failed index generation can no longer publish a truncated file.** `gen-index.sh` wrote its
  temporary file to the system temp directory, which is often a *different volume* from your repo — so
  the final move was a copy, and a failure partway through left a shorter but perfectly valid-looking
  index. The temp file now lives beside its destination, making the move a same-volume rename. The
  limit is stated rather than claimed away: on Windows/NTFS this is not POSIX-grade atomicity.
- **Two findings you should know about if you run unattended.** A permission allowlist matches the
  *literal* invocation, so a command you correctly authorized can still be denied when it is issued as
  part of a `cd … && … 2>&1` chain — issue landing-path commands bare and anchor them with
  `git -C <path>` (`TD-023`). And a fixture harness that builds throwaway git repos can have its setup
  fail silently and still report green, guarding nothing (`TD-024`).

---

## v1.24.0 — Run to Finish (2026-08-01)

MINOR — SPRINT-042. The previous release's night run did everything right and delivered nothing: two
tasks built, committed, and self-reviewed, then the merge-back was refused and both stranded on
branches. Nothing was wrong with the work or the contract. The permission list simply never included
the commands the run needed to *finish*.

**What changed for you:**
- **Night-run pre-flight now derives your allowlist from four sources, not one.** The old advice —
  build it from the tasks' files plus the commit/lint commands — covers what your tasks need to *work*
  and silently omits what the run needs to *land*: the coordinator's merge-back (integration worktree,
  the merge, the cleanup), any always-on check that shells out and writes, and the `/handoff` exit.
  The asymmetry is the point: a denial in one task's commands costs that task, while a denial in the
  shared landing path costs the **whole run**, however many units already succeeded. Both halves have
  now failed for real. It also names a blind spot in the transcript-scan builder we suggest — a
  transcript only holds commands some run already reached, so it can never propose the landing-path
  command no run has yet got far enough to attempt.
- **Pre-flight asks what the run itself will cost — separately from what verifying its tasks costs.**
  These are unrelated budgets, and conflating them is how a bill arrives as a surprise rather than as
  an input to the decision to fire. A sprint whose tasks need no paid fixtures is not a free sprint.
  The morning rollup gains a calibration row (cost · turns · wall-clock · units · shape), read straight
  off `--output-format json`, with a stated degrade rule: where cost isn't exposed, record what is and
  **say so** — a silently omitted row is what leaves the next person estimating from nothing. One
  measured floor now sits in the doc: a single-turn agent that does no work at all costs ~$0.22,
  because every dispatched branch re-pays the full project substrate before starting.
- **The sprint template's Retro now asks for cost**, phrased for any sprint rather than only unattended
  ones — cost per unit *delivered*, not attempted.
- **Maintainer tooling** (ships in the install, though it targets this repo): the QA gate cross-checks a
  sprint Plan's declared `Layers:`/`Depends-on:` against the files each task's own definition-of-done
  implies, catching the declaration gap that let two agents edit one file concurrently. And the gate is
  **~33% faster by default** — the slow selftests moved behind `QA_FULL=1`, with what a bare run skips
  documented rather than silently dropped.

---


_Older releases (**v1.23.0** and earlier) → [`docs/changelog/CHANGELOG-1.23.0.md`](docs/changelog/CHANGELOG-1.23.0.md) → [`CHANGELOG-1.22.0.md`](docs/changelog/CHANGELOG-1.22.0.md) → [`CHANGELOG-1.21.0.md`](docs/changelog/CHANGELOG-1.21.0.md) → [`CHANGELOG-1.20.0.md`](docs/changelog/CHANGELOG-1.20.0.md) → [`CHANGELOG-1.19.0.md`](docs/changelog/CHANGELOG-1.19.0.md) → [`CHANGELOG-1.16.1.md`](docs/changelog/CHANGELOG-1.16.1.md) → [`CHANGELOG-1.14.2.md`](docs/changelog/CHANGELOG-1.14.2.md) → [`CHANGELOG-1.13.0.md`](docs/changelog/CHANGELOG-1.13.0.md) → [`CHANGELOG-1.12.0.md`](docs/changelog/CHANGELOG-1.12.0.md) → [`CHANGELOG-1.9.0.md`](docs/changelog/CHANGELOG-1.9.0.md) → [`CHANGELOG-1.7.1.md`](docs/changelog/CHANGELOG-1.7.1.md)._

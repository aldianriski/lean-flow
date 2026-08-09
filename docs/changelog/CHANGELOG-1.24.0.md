---
owner: Maintainer
last_updated: 2026-08-09
update_trigger: Rotated from root CHANGELOG.md when a newer MINOR landed (DOCS_Guide §11)
status: current
---

# lean-flow — Changelog archive (v1.24.0)

<!-- Rotated verbatim from root CHANGELOG.md at the SPRINT-047 promote (overdue since v1.25.0). Append-only; never edited. -->

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

_Older releases (**v1.23.0** and earlier) → [`CHANGELOG-1.23.0.md`](CHANGELOG-1.23.0.md) → [`CHANGELOG-1.22.0.md`](CHANGELOG-1.22.0.md) → [`CHANGELOG-1.21.0.md`](CHANGELOG-1.21.0.md) → [`CHANGELOG-1.20.0.md`](CHANGELOG-1.20.0.md) → [`CHANGELOG-1.19.0.md`](CHANGELOG-1.19.0.md) → [`CHANGELOG-1.16.1.md`](CHANGELOG-1.16.1.md) → [`CHANGELOG-1.14.2.md`](CHANGELOG-1.14.2.md) → [`CHANGELOG-1.13.0.md`](CHANGELOG-1.13.0.md) → [`CHANGELOG-1.12.0.md`](CHANGELOG-1.12.0.md) → [`CHANGELOG-1.9.0.md`](CHANGELOG-1.9.0.md) → [`CHANGELOG-1.7.1.md`](CHANGELOG-1.7.1.md)._

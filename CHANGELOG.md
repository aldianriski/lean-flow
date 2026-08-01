---
owner: Maintainer
last_updated: 2026-08-01
update_trigger: Sprint completed and changes reflected in docs
status: current
---

# lean-flow — Changelog

<!-- Prepend new sprints — newest first. Append-only; never edit past blocks. -->

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

## v1.23.0 — Freshness Row and Park Records (2026-07-30)

MINOR — SPRINT-040. Two things this repo already did correctly but left no trace of. A contract you
can't see the results of is one you end up taking on faith.

**What changed for you:**
- **`/prime` now tells you whether the skills you're running are the ones in your repo.** A live
  session keeps whatever installed plugin copy it started with, so a skill you edited but didn't
  reinstall keeps executing its **old** procedure — no error, and a diff that reads as if your change
  was ignored. The version was never hidden; it's printed in every skill's invocation header. It just
  went unread, once for an entire sprint. The health check now carries a `Skills:` row: `fresh`,
  `STALE — reinstall before trusting any procedure`, or `n/a (no local plugin repo)` if you only ran
  `plugin install` and have no checkout to compare against. It reports and never blocks — whether a
  stale procedure is acceptable is your call, not the skill's. Version-only by design: an edit that
  skips the version bump still reads `fresh` here, and that leg stays covered by the unattended
  pre-flight, which diffs cache content against the working tree.
- **`migrate` and `init` now leave a record when a headless run can't get your approval.** Both
  already refused to touch anything without sign-off — that half was never in doubt. But they
  declined *in prose*, so an overnight run ended with no artifact showing it had run or what it was
  waiting on. Both now detect the missing ask channel and write a park record to a `/handoff` doc
  naming the proposed plan and the unblock condition, before halting.
- **The fix that mattered was the trigger, not the rule.** Stating what to do when headless changed
  nothing across two real test runs, because nothing told the run *how it knows* it is headless — and
  waiting in prose is correct when someone is watching. Adding the detection probe made both comply
  immediately. If you write conditional behaviour into a skill, ship the condition's observable with
  it; that's the difference between the entry points that complied and the ones that didn't.

---

_Older releases (**v1.22.0** and earlier) → [`docs/changelog/CHANGELOG-1.22.0.md`](docs/changelog/CHANGELOG-1.22.0.md) → [`CHANGELOG-1.21.0.md`](docs/changelog/CHANGELOG-1.21.0.md) → [`CHANGELOG-1.20.0.md`](docs/changelog/CHANGELOG-1.20.0.md) → [`CHANGELOG-1.19.0.md`](docs/changelog/CHANGELOG-1.19.0.md) → [`CHANGELOG-1.16.1.md`](docs/changelog/CHANGELOG-1.16.1.md) → [`CHANGELOG-1.14.2.md`](docs/changelog/CHANGELOG-1.14.2.md) → [`CHANGELOG-1.13.0.md`](docs/changelog/CHANGELOG-1.13.0.md) → [`CHANGELOG-1.12.0.md`](docs/changelog/CHANGELOG-1.12.0.md) → [`CHANGELOG-1.9.0.md`](docs/changelog/CHANGELOG-1.9.0.md) → [`CHANGELOG-1.7.1.md`](docs/changelog/CHANGELOG-1.7.1.md)._

---
owner: Maintainer
last_updated: 2026-08-10
update_trigger: a MINOR version rotates out of the root CHANGELOG
status: current
---

# lean-flow — Changelog v1.33.0

<!-- Rotated out of root CHANGELOG.md per DOCS_Guide §11 — moved verbatim, never edited. -->

---

## v1.33.0 — Prove the Run Finished (2026-08-10)

MINOR — SPRINT-059. The night-run protocol could tell you a run failed. It could not tell you a run
**stopped early** — and that is the failure that reports `success`.

**What changed for you:**

- **A night run now reports how much of the Plan it finished, at every exit.** The rollup used to
  speak only for non-green tasks, so a run that ended mid-Plan without hitting a blocker wrote nothing
  at all and the morning reader saw a clean page. It now opens with `run · N of M DoD ticked`,
  unconditionally. Measured on a consumer's host before the fix: **4 of 7 units landed, every commit
  correct, tree clean, exit `success`, three tasks never begun and not one line about them.**
- **`unattempted` is a state.** It had no name, which is why those three tasks went *unreported*
  rather than misreported — they were not blocked, parked, denied or stalled. They never began.
- **The rollup is written by the launcher, not asked of the run** (ADR-016). This is the part worth
  reading twice: asking was *tried and measured*. A run whose trigger requested a rollup, a
  calibration row and a park re-check completed every unit of work and wrote **none of the three**. An
  instruction about the work holds; an instruction about bookkeeping does not, because a step that
  happens after the work and that no gate depends on is the first thing an agent drops. So
  `scripts/night-run.sh` emits it from the wrapper that already captures the exit code. Trade named,
  not hidden: this reaches only consumers who use the launcher, and the documented format still has
  to stand alone for everyone else.
- **A recorded run missing its rollup now FAILs the gate**, with two separately-named findings. The
  reaper emits; the checker refuses to let a missing one pass. That pairing is what makes it *gated*
  rather than merely requested.
- **A park the run itself unblocks gets revisited.** The protocol assumed a park outlives the run. It
  can also name a condition the same run satisfies two tasks later — observed: a field parked for the
  renderer, **three** subsequent tasks owned that renderer, none went back. Unattended runs only; an
  interactive run halts at the first blocker with a human present.
- **Two consumer calibration rows**, the table's first `inline` rows and its first from a host that is
  not ours. Read them loosely — different shape, different repo. The figure that transfers: **zero
  denials across 318 turns** after **$1.77** of probing, against a predecessor run that lost ~40% of
  its turns to denials.

**For maintainers — everything found this sprint was found by running something, never by reading it.**
The reaper silently dropped a task, because a whole-file grep matched a worked example in the log's own
prose. The park assertion's first draft **could only ever exit 0** (its loop was behind a pipe, so
`fail=1` died in a subshell) and, once fixed, still **passed the violation** because it searched for the
word "revisit" and the fixture's slug was `unrevisited`. The end-to-end night run reported a wall-clock
of `2 min` for a measured 163 s — correct arithmetic, 40% low, always in the same direction. Three of
the four are one pattern: a substring standing in for a structural claim, failing *green*.

**Housekeeping:** three learnings filed (`L-108` substring-vs-contract, 3 sightings · `L-109` the pipe
that swallows a failure · `L-110` how a `Layers:` declaration goes stale), one debt row (`TD-049`), one
follow-up (`TASK-188`). Five resolved TD rows deleted at promote (§11), ledger 281 → 160. Gate 131 →
141 checks, with 6 retained fixtures added. Run cost: $1.59 across two verification runs.

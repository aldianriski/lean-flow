---
sprint: 027
slug: watchdog-housekeeping
status: closed
plan_commit: a58d31a
close_commit: 36721a4
---

# SPRINT-027 — Night-Run Watchdog & Housekeeping (fixture, mirrors the real archived sprint)

L-166 motivating case: this reproduces the REAL `docs/sprint/archive/SPRINT-027-watchdog-housekeeping.md`
(same id, dates, `close_commit`) as it actually shipped -- before this task's `handoff` event
vocabulary existed. Its real Execution Log records, verbatim: "watchdog recovery command
(`--resume <sid> "/handoff"`) produced a genuine 54-line handoff doc in OS temp, verified
readable at the /prime path" on 2026-07-29, the SAME day the sprint closed (`close_commit:
36721a4`). No repo-side record of that handoff's fate was ever written -- not because anyone
ruled it `spent`, but because the mechanism to record it did not exist. That is the exact
silent-loss shape T2 closes: a real handoff was taken and the sprint closed past it with zero
trace. Since the vocabulary is new, no historical commit literally carries a `handoff-status:`
field to replay against; this fixture carries the real dates/commit forward with the field
genuinely absent, which is the truest available reproduction of what a checker running against
that day would have found.

---
owner: Maintainer
last_updated: 2026-08-01
update_trigger: Rotated from root CHANGELOG.md when a newer MINOR landed (DOCS_Guide §11)
status: current
---

# lean-flow — Changelog archive (v1.23.0)

<!-- Rotated verbatim from root CHANGELOG.md at the v1.25.0 release. Append-only; never edited. -->

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


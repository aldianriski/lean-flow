---
owner: Maintainer
last_updated: 2026-07-30
update_trigger: Sprint completed and changes reflected in docs
status: current
---

# lean-flow — Changelog

<!-- Prepend new sprints — newest first. Append-only; never edit past blocks. -->

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

## v1.22.0 — Runnable Night-Run Pre-Flight Checks (2026-07-30)

MINOR — SPRINT-038. v1.21.0 specified two of the night-run pre-flight capability checks in prose
only. This ships them as snippets you can actually run, so the gap between "documented" and
"enforced" closes.

**What changed for you:**
- **The night-run pre-flight capability checks are now runnable, not just described.**
  `night-run.md` ships copy-pasteable POSIX-sh snippets for the two checks v1.21.0 only specified:
  **installed-skill-version vs. repo manifest**, and **worktree usability**. The first is the
  load-bearing one — a night run executes the *installed* skill, so editing a skill without
  reinstalling means the run faithfully executes the **previous** procedure, with no error and a
  morning diff that looks like it ignored your change. You can now check for that mismatch before
  a run starts, instead of finding out after.
- **The README's file-map was corrected** to match the doc layout `/lean-doc-generator` has
  produced since ADR-012 (root `CHANGELOG.md`, `docs/architecture/overview.md`,
  `docs/deployment/{deployment,rollback}-guide.md`) — it had drifted stale against what actually
  ships.

---

_Older releases (**v1.21.0** and earlier) → [`docs/changelog/CHANGELOG-1.21.0.md`](docs/changelog/CHANGELOG-1.21.0.md) → [`CHANGELOG-1.20.0.md`](docs/changelog/CHANGELOG-1.20.0.md) → [`CHANGELOG-1.19.0.md`](docs/changelog/CHANGELOG-1.19.0.md) → [`CHANGELOG-1.16.1.md`](docs/changelog/CHANGELOG-1.16.1.md) → [`CHANGELOG-1.14.2.md`](docs/changelog/CHANGELOG-1.14.2.md) → [`CHANGELOG-1.13.0.md`](docs/changelog/CHANGELOG-1.13.0.md) → [`CHANGELOG-1.12.0.md`](docs/changelog/CHANGELOG-1.12.0.md) → [`CHANGELOG-1.9.0.md`](docs/changelog/CHANGELOG-1.9.0.md) → [`CHANGELOG-1.7.1.md`](docs/changelog/CHANGELOG-1.7.1.md)._

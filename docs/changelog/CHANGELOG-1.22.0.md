---
owner: Maintainer
last_updated: 2026-08-01
update_trigger: Rotated from root CHANGELOG.md when a newer MINOR landed (DOCS_Guide §11)
status: current
---

# lean-flow — Changelog archive (v1.22.0)

<!-- Rotated verbatim from root CHANGELOG.md at the v1.24.0 release. Append-only; never edited. -->

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


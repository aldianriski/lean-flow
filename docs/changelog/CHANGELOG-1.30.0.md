---
owner: Maintainer
last_updated: 2026-08-10
update_trigger: Rotated from root CHANGELOG.md when a newer MINOR landed (DOCS_Guide §11)
status: current
---

# lean-flow — Changelog archive (v1.30.0)

<!-- Rotated verbatim from root CHANGELOG.md when v1.32.0 landed (v1.32.0 + v1.31.0 stay inline).
     Append-only; never edited. -->

## v1.30.0 — Silent Passes (2026-08-09)

MINOR — SPRINT-056. Five gates that reported green over input they never examined. Every one had
produced a real false PASS on this repo and announced it as a clean run.

**What changed for you:**
- **The dispatch preflight now reads the declarations it used to skip.** A wrapped `Layers:` line
  (the normal shape for any task touching three or more files) had everything after its first line
  invisible, and a directory token ending in `/` was invisible entirely — both producing
  `PREFLIGHT: CLEAR` over a genuinely unowned shared file. Continuations are now collected and
  directory tokens compare prefix-aware, naming both sides when they collide.
- **Doc line-caps are derived from the standard instead of hand-listed.** `qa-check.sh` named four
  globs covering 17 files; DOCS_Guide §2 states a cap on far more rows than that, and every unlisted
  row was a cap with nothing behind it. Coverage is now read from §2 itself — 47 checks — and a §2
  row whose path cannot be parsed is a named failure, not a silent skip. Pre-existing breaches are
  grandfathered **visibly**: each prints on every run with its count at adoption, fails if it grows,
  and is told to delete its own row once back under cap.
- **All four plugin manifests are compared to each other.** Previously only the README footer was
  compared against `plugin.json`, which is how `.codex-plugin/` and `.kimi-plugin/` drifted five
  releases behind before anyone noticed by hand. The manifest set is discovered on disk, so a fifth
  enrolls itself.
- **An undeclared edit is reported while it is still cheap to fix.** Files excluded as "close
  bookkeeping" (`TODO.md`, `TECH-DEBT.md`, `CHANGELOG.md`, `LEARNINGS.md`) are now excluded *only at
  close* — during execution an edit to one of them is task work and must be declared. Previously the
  violation stayed invisible for a whole task and surfaced later, attributed to a task already
  finished and pushed.
- **The sprint checks stay armed through the commit that closes the sprint.** They used to gate on
  `status: active`, so writing `status: closed` disarmed them in the same commit that adds the Retro
  and all the close bookkeeping — 72→68 checks at one close, 94→87 at the next, both reporting
  "0 fail". They now skip on archived *location*, which changes in a separate later commit. A check
  that verified zero inputs reports as a skip instead of a pass.

**Housekeeping:** four `TD-NNN` rows closed (TD-040 · TD-041 · TD-042 · TD-043 · TD-044); two filed
(TD-045 preflight parser duplication, now guarded by a parity fixture rather than removed; TD-046
gate runtime). Gate coverage 89 → 126 checks, with 15 retained must-FAIL fixture cases added.

---

_Older releases (**v1.29.0** and earlier) → [`CHANGELOG-1.29.0.md`](CHANGELOG-1.29.0.md)._

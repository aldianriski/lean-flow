---
owner: Maintainer
last_updated: 2026-08-21
update_trigger: Rotated out of root CHANGELOG.md at a new MINOR (§11)
status: current
---

# lean-flow — Changelog v1.48.0

> Rotated out of root `CHANGELOG.md` at v1.50.0 (§11: keep current + previous inline).

## v1.48.0 — The First Spec-Driven Checker (2026-08-18)

MINOR — SPRINT-074, **15 of 15 DoD**, EPIC-004's third member sprint. **`spec/STANDARD.md` 0.4.0 →
0.4.1.** v1.47.0 made the standard *readable* by a tool. This is the first tool that actually reads it:
a checker for §13 whose rule set comes from the spec at runtime rather than from its author.

**What changed for you**

- **`scripts/lib/check-attestation.sh` — verify a commit's HITL attestation from a clone alone.**
  `sh check-attestation.sh <repo-dir> <commit-ish>` prints a verdict per §13 rule plus a **level**, and
  works against any repository. The spec it measures against defaults to the copy shipped beside the
  script — your repo does not need one — and `--spec` overrides it.
- **It reports a level and named findings, never a score** (§14). Five published finding names, now in
  `docs/research/conformance-dispositions.md` where the row previously deferred them:
  `attestation-trailers-incomplete` · `attestation-not-on-task-commit` · `evidence-path-unpinned` ·
  `attestation-disagrees-with-sprint` · `attestation-unsigned-claim-only`.
- **An unsigned trailer is reported as a claim, and exits 0.** Perfect trailers over an unsigned commit
  have reached **Gated**, not Attested — a level honestly reached, not a defect, so it does not fail
  your build. Reporting it as Attested is the theatre a conformance level exists to prevent (§13c), and
  the checker will not do it. Run against this repository it reproduces §13d's own worked-example
  verdict unprompted: Gated, `%G? = N`.
- **The two `implementation-directed` rules are excluded because the spec's Mark column says so**, not
  because the author remembered a skip list. Re-mark a rule in your spec copy and the checker stops
  asserting it, with no code change. A rule the spec marks mechanical that the checker cannot answer is
  reported as `rule-unimplemented`; a rule table it cannot parse is `spec-table-unreadable`. Neither
  degrades into checking nothing and exiting clean.
- **No rule in the spec carries `?` any more — 100 classified, 0 unclassified.** `S4.INDEX` is
  Structural/mechanical, `S5.DISCARDLOG` is `implementation-directed` (six now carry that mark). §14's
  counts re-derived to match. PATCH, not MINOR, on the spec: marking an already-stated rule adds no
  obligation, so nothing you satisfy today changes.
- **A mid-flight `qa-check` no longer tells you your `Layers:` are clean when a commit would disagree.**
  The uncommitted leg reports `SKIP … [WIP, unattributed]` naming what it did *not* check, instead of a
  `PASS` indistinguishable from the committed verdict. A file declared by no task still FAILs there,
  exactly as before.

**Maintainer-facing**

- **§14 has no per-rule table** — it is the legend; the tables live in each section's `Conformance.`
  block. The premise "the checker reads §14's tables" had been copied through `TODO.md`, the sprint
  header and the DoD without anyone re-opening §14. → **L-136**, which bumps **L-130** to count 2.
- **Spec-driven is a split, and saying which half is which is the point.** Rule set and marks come from
  the spec; the assertion bodies are code, because "all three required together" and "the `Evidence:`
  value's shape" are different code. Claiming both would be theatre.
- **The first live run found a real fault — in the checker.** `S13.AGREE` demanded the sprint record at
  the `Evidence:` pin, but `gates_signed:` names the sha it was signed *at*, so the field is necessarily
  written later — making every sprint's first attested commit structurally unable to comply. That is
  the uncleanable finding §14 forbids. Now reads at the pin, falls back to the attesting tree, and names
  which answered.
- **All-green on a first run proves nothing**, so the rejected design was seeded: hard-coding the rule
  list reddened **exactly** the two cases that justify the chosen one and correctly left the other
  fourteen green. → **L-137**.
- **A caveat that fires on every tree is read as furniture.** The WIP `SKIP` first counted the raw dirty
  list, so a stray excluded file earned a warning about a check that never ran; it now counts after
  exclusions. Caught by four existing fixtures going red. → **L-138**.
- **TD-037 resolved after 19 sprints and seven reaffirms.** Its cure adds *no* inference — the row's
  standing warning against inferring the in-flight task from open-DoD state is honoured in full.
  Staged-vs-unstaged was rejected because L-042 prescribes `git add -p` for shared files, so the staged
  set spans tasks by design in the only case attribution matters for.
- **The wiring, not the checker, was the near-miss.** `qa-check.sh` counted only `^PASS` and did not
  echo that checker on success, so the new `SKIP` would have rendered as "0 sprint files verified —
  nothing in scope". → **L-020 ×3**.
- **The QA gate goes red on the calendar, not the code** — `gen-index.sh --check` byte-compares a file
  whose `last_updated:` is stamped with today's date. → **TD-063**, ready to schedule, not blocked.
- **A background-task notification reported `exit code 0` over an artifact reading `1 fail`**, twice.
  A fourth reporter channel for **L-120**; the rule held, every verdict was read from the output file.


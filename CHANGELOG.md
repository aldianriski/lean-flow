---
owner: Maintainer
last_updated: 2026-08-18
update_trigger: Sprint completed and changes reflected in docs
status: current
---

# lean-flow — Changelog

<!-- Prepend new sprints — newest first. Append-only; never edit past blocks. -->

---

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

---

## v1.47.0 — The Spec as Rule Source (2026-08-16)

MINOR — SPRINT-073, **15 of 15 DoD**, EPIC-004's second member sprint. **`spec/STANDARD.md` 0.3.0 →
0.4.0.** The standard now tells you, in the file itself, which of its rules a tool can check — which is
what makes "build a conformance checker from the spec" possible rather than aspirational.

**What changed for you**

- **Every normative rule carries its conformance level and whether it is checkable, in the spec.** Each
  `## §N` ends with a **Conformance.** table listing that section's rules by a stable id (`S13.TRAILERS`,
  `S2.F-CAP`, …), its level (Structural · Gated · Attested) and its mark. A new **§14** defines the
  model. **Nothing existing was reworded, removed or renumbered** — the prose you pinned at 0.3.0 reads
  identically; this adds a layer beside it (`+300 / −1`, and the one deletion is the version line).
- **Four marks, and the middle two are not the same thing.** `mechanical` · `judgment-only` (**not
  checkable in principle** — the standard is choosing a human) · `split` · `implementation-directed`. A
  `judgment-only` rule is **not debt and never will be**; a `mechanical` rule with no checker is a gap
  someone can close. Collapsing them reports the standard's deliberate boundaries as failures.
- **Five rules must never be evaluated against your repository**, marked `implementation-directed` —
  two of them §13's inference constraints (*a verifier may not conclude approval from an unsigned
  trailer* · *author identity is not the attestation*). They bind a tool, not a repo. A checker reading
  them as repo rules emits findings **you could never clear**.
- **No percentage, no score, no grade — now stated normatively in §14**, so it binds your tools rather
  than living in our notes. A ratio *improves* when the standard declines to automate something.
- **Rule ids are stable across versions and are what a finding names**, so a report stays comparable as
  the standard evolves. An id is retired, never reused. **A `?` mark is a real state** — two rules
  (`S4.INDEX`, `S5.DISCARDLOG`) are stated but unclassified, and a tool reporting on them says so.
- **`spec/STANDARD.md` carries no line cap, and §2 now says so** ([ADR-026]). If you were wondering why
  the standard was absent from its own cap table: it is a ruling, not an oversight.

**Maintainer-facing**

- **The frozen baseline could not reproduce its own total.** SPRINT-072's `conformance-baseline.md`
  states **96** rules while its `rules` column sums to **99** and its bucket columns to **98**. T1 halted
  rather than pick one, and the owner ruling split the constraint: **transcribe the marks, re-derive the
  count**. Re-derived from the spec: **98 classified + 2 unclassified**. Five divergences recorded in
  `conformance-dispositions.md`. → **L-134**.
- **Dispositions are 54, not 39** — 42 `build` (each naming the finding its check will fire) and 12
  `scope-out` (each with its reason). Reconciled mechanically: no checkable rule is left undispositioned.
- **A category expected to be large came out empty.** `scope-out` reason (c) — "mechanical but not worth
  the false-positive rate" — has **zero** members; every candidate was already `judgment-only` and never
  checkable. Uncounted, they would have been double-counted as scoped-out work. → **L-135**.
- **TD-058 resolved after four sprints**, because T2 was ordered immediately downstream of the evidence
  it needed rather than by priority.
- **A cap cell will eat any digits you put in it.** `no numeric cap (ADR-026)` was parsed as a cap of
  **26** — `FAIL cap spec/STANDARD.md (943 > 026)`. Caught only because the DoD required *running* the
  checker. → **TD-062**.
- **A commit went through a red gate**, because the line was `qa-check | tail && git commit` and `&&`
  read `tail`'s status. Second sighting → **L-120 promoted** to `CLAUDE.md` edit-safety (c), which
  already carried the caution and did not fire; the promotion adds the *action* form.

[ADR-026]: docs/adr/ADR-026-standard-carries-no-line-cap.md

---

_Older releases (**v1.46.0** and earlier) → [`CHANGELOG-1.46.0.md`](docs/changelog/CHANGELOG-1.46.0.md) → [`CHANGELOG-1.45.0.md`](docs/changelog/CHANGELOG-1.45.0.md) → [`CHANGELOG-1.44.0.md`](docs/changelog/CHANGELOG-1.44.0.md) → [`CHANGELOG-1.43.0.md`](docs/changelog/CHANGELOG-1.43.0.md) → [`CHANGELOG-1.42.0.md`](docs/changelog/CHANGELOG-1.42.0.md) → [`CHANGELOG-1.41.0.md`](docs/changelog/CHANGELOG-1.41.0.md) → [`CHANGELOG-1.40.0.md`](docs/changelog/CHANGELOG-1.40.0.md) → [`CHANGELOG-1.39.0.md`](docs/changelog/CHANGELOG-1.39.0.md) → [`CHANGELOG-1.38.0.md`](docs/changelog/CHANGELOG-1.38.0.md) → [`CHANGELOG-1.37.0.md`](docs/changelog/CHANGELOG-1.37.0.md) → [`CHANGELOG-1.36.0.md`](docs/changelog/CHANGELOG-1.36.0.md) → [`CHANGELOG-1.35.0.md`](docs/changelog/CHANGELOG-1.35.0.md) → [`CHANGELOG-1.34.0.md`](docs/changelog/CHANGELOG-1.34.0.md) → [`CHANGELOG-1.33.0.md`](docs/changelog/CHANGELOG-1.33.0.md) → [`CHANGELOG-1.32.0.md`](docs/changelog/CHANGELOG-1.32.0.md) → [`CHANGELOG-1.31.0.md`](docs/changelog/CHANGELOG-1.31.0.md) → [`CHANGELOG-1.30.0.md`](docs/changelog/CHANGELOG-1.30.0.md) → [`CHANGELOG-1.29.0.md`](docs/changelog/CHANGELOG-1.29.0.md) → [`CHANGELOG-1.27.3.md`](docs/changelog/CHANGELOG-1.27.3.md) → [`CHANGELOG-1.26.0.md`](docs/changelog/CHANGELOG-1.26.0.md) → [`CHANGELOG-1.25.2.md`](docs/changelog/CHANGELOG-1.25.2.md) → [`CHANGELOG-1.24.0.md`](docs/changelog/CHANGELOG-1.24.0.md) → [`CHANGELOG-1.23.0.md`](docs/changelog/CHANGELOG-1.23.0.md) → [`CHANGELOG-1.22.0.md`](docs/changelog/CHANGELOG-1.22.0.md) → [`CHANGELOG-1.21.0.md`](docs/changelog/CHANGELOG-1.21.0.md) → [`CHANGELOG-1.20.0.md`](docs/changelog/CHANGELOG-1.20.0.md) → [`CHANGELOG-1.19.0.md`](docs/changelog/CHANGELOG-1.19.0.md) → [`CHANGELOG-1.16.1.md`](docs/changelog/CHANGELOG-1.16.1.md) → [`CHANGELOG-1.14.2.md`](docs/changelog/CHANGELOG-1.14.2.md) → [`CHANGELOG-1.13.0.md`](docs/changelog/CHANGELOG-1.13.0.md) → [`CHANGELOG-1.12.0.md`](docs/changelog/CHANGELOG-1.12.0.md) → [`CHANGELOG-1.9.0.md`](docs/changelog/CHANGELOG-1.9.0.md) → [`CHANGELOG-1.7.1.md`](docs/changelog/CHANGELOG-1.7.1.md)._

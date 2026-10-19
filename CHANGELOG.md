---
owner: Maintainer
last_updated: 2026-10-19
update_trigger: Sprint completed and changes reflected in docs
status: current
---

# lean-flow — Changelog

<!-- Prepend new sprints — newest first. Append-only; never edit past blocks. -->

> **Older than the two minors below** → [`docs/changelog/`](docs/changelog/) — rotated verbatim at
> each new MINOR and reachable only from here (STANDARD §11).

---

## SPRINT-130 — A Gate You Can Trust (2026-10-19)

**Unreleased — no version bump.** `skills/`, the four `*-plugin/*.json` manifests, `README.md`, `spec/`, `scripts/` and
`conformance.sh` are untouched (derived from `git diff --name-only 9c782185..HEAD`, not judged): every change is this repo's own
test and fixture code. No consumer-visible change ⇒ nothing to release. Spec unchanged at 0.18.0. **10 of 10 DoD `[x]`.**

**Maintainer-side:**
- **ADR-035's guard is green again (TD-154).** The gate-discovery guard recognises a wrapped gate: a segment invokes the declared
  command when it begins with it, or ends with it as whole whitespace-delimited tokens behind a head that is not `echo` · `printf`
  · `:`. An unquoted `echo` of the gate stays a bypass (retained must-FAIL).
- **The qa-budget ceiling case reads a frozen clock (TD-167).** Case 12 shadows `date`, so its exact `1263s` assertion no longer
  reddens a busy host; an empty capture is a named `harness-env` FAIL with the child's exit status and no asserted cause.
- **The `bun test` flake is closed as not reproduced (TD-135):** eight runs on two hosts, all `441 pass, 0 fail`.
- TD-117 routed to TASK-367 beside TD-090; §11 store prune of TASK-439–442. L-237 filed.

---

## v2.10.0 — the reviewer judges against your repo's own standards and says what it skipped; a forced red must prove it landed (2026-10-19)

**MINOR** — ships SPRINT-129 (Honest Review and Tests). Installing the release is enough; no upgrade step. The standard is unchanged
(spec 0.18.0). Restart the session after installing.

### SPRINT-129 — Honest Review and Tests (2026-10-19)

Four keepers from the 2026-10-19 reference re-scans (mattpocock/skills scan 5 · obra/superpowers re-scan), each closing a gap on
the consumer path.

**Consumer-facing:**
- **The review brief carries your repo's standards docs.** The coordinator finds CONTRIBUTING, coding standards and style guides
  (and CLAUDE.md / AGENTS.md) and hands their paths and excerpts to the reviewer as the Standards comparand; the reviewer still
  gets a brief, never the repo. The Standards axis names the docs it judged against, or says none were supplied.
- **The reviewer lists what it declined to judge**, beside the Standards and Spec axes, with a one-line reason each ("none" when
  empty). Spec silence is no licence: an implied input the change leaves unhandled is a Spec finding. All three rules ride in the
  injected reviewer prompt, not only in the coordinator's text.
- **`/diagnose`: a forced red counts only once it is proven landed.** A mutation, fixture edit or reverted fix is diffed against a
  pristine copy first; a landed change that reddens nothing has tested nothing; the restore is proven the same way.
- **`/tdd`: a slice is done only when the whole suite passes.** The focused test drives each cycle and the whole suite runs once per
  slice; every failure is named, and one the slice did not cause goes to the owner, never counted as green. The per-cycle checklist
  adds "name the production change that would fail this test". `test-standard.md`'s regression gate points to the rule instead of
  restating it.

**Maintainer-side:**
- Research: mattpocock scan 5 (35 → 38 skills), the superpowers re-scan (14 → 15), and a loopcraft delta (nothing to adopt).
- TASK-322 and TASK-448–450 cancelled as superseded; TD-090 re-routed to TASK-367; §11 store prune of TASK-435–437.
- The adversarial-floor review pass caught the new reviewer rules missing from the injected prompt (L-020), fixed before merge.

---

## v2.9.0 — one Plan parser; the member resolver names what it cannot resolve (2026-10-19)

**MINOR** — ships SPRINT-128 (Planning Debt), and closes EPIC-022. **Upgrade step:** a task store with a duplicate task id, a listed
member with no file, or a task file outside `docs/work/<folder>/` now FAILs by name (`member-ambiguous` · `member-missing` ·
`member-misplaced`), where it was skipped silently. Run `sh conformance.sh <repo>` once and fix any it names. The standard is
unchanged (spec 0.18.0). Restart the session after installing.

### SPRINT-128 — Planning Debt (2026-10-19)

EPIC-022's last slice: a Plan has one parser, and nothing that reads it drops what it cannot place.

**Consumer-facing:**
- **`conformance.sh` reads CRLF frontmatter itself.** Every Shell field reader strips a trailing CR, so a verdict no longer depends
  on whether the host's awk folds Windows line endings.
- **The members reader names store anomalies.** A duplicate id, a missing listed member or a misplaced task file is a named FAIL;
  the CLI exits 2 with the anomaly after its unchanged first line.
- **The dispatch preflight names a column-0 wrapped `Layers:` line** ("indent it, or separate prose with a blank line"), instead of
  building the ownership map from the first line only.

**Maintainer-side:**
- One shared Plan parser (`parsePlan`) replaces about eight heading regexes and six `Cites:` readers; a `Cites:` task id governs a
  member only in the leading run that opens the line.
- The Shell twins of the layers-observed and authority checkers, and the reaper's v1 Plan counting, are retired.
- `layers-token-matches-nothing` names a `Layers:` token that matched no file once its task is done; a member `## Done when` edit
  is covered only by a scope-change logged before it.
- TD-049 · 131 · 138 · 177 · 178 · 188 · 190 · 198 · 199 · 205 · 215 · 248 resolved; 8 rows closed at promote; TD-255 · 256 · 257 ·
  258 filed. EPIC-022 closed (8 of 8).

---


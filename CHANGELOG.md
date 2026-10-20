---
owner: Maintainer
last_updated: 2026-10-20
update_trigger: Sprint completed and changes reflected in docs
status: current
---

# lean-flow — Changelog

<!-- Prepend new sprints — newest first. Append-only; never edit past blocks. -->

> **Older than the two minors below** → [`docs/changelog/`](docs/changelog/) — rotated verbatim at
> each new MINOR and reachable only from here (STANDARD §11).

---

## v2.12.1 — an already-covered test names the one edit that would fail it (2026-10-20)

**PATCH** — ships SPRINT-133 (Name the Failing Edit), a follow-up to EPIC-007. Installing the release is enough; no upgrade step.
The standard is unchanged (spec 0.18.0). Restart the session after installing.

### SPRINT-133 — Name the Failing Edit (2026-10-20)

**Consumer-facing:**
- **`/tdd` and the `software-implementation` pack: an *already covered* note names one concrete edit, checked against the
  test's inputs, that would fail the test.** It must be a specific expression or value, not a class of edits. "Anything other
  than `Math.floor`" names a class, and some edits in it still pass: `Math.ceil` and `Math.round` both give 1 hour for 3600 s.
  The rule is worded the same at `/tdd` step 3 and at the pack's step 3 and output contract.

**Maintainer-side:**
- §11 promote retention: TD-135 · 154 · 167 deleted; 9 closed task files pruned; TASK-438 retained (cited from code, TD-262).
- EPIC-007: a condition-3 follow-up; conditions 2, 4 and 5 are still the next slice. L-242 filed.

---

## v2.12.0 — workflow packs: a proven procedure any agent can follow from one file, with nothing installed (2026-10-20)

**MINOR** — ships SPRINT-132 (Expertise Without the Plugin), the first slice of EPIC-007. Installing the release is enough; no
upgrade step. The standard is unchanged (spec 0.18.0). Restart the session after installing.

### SPRINT-132 — Expertise Without the Plugin (2026-10-20)

**Consumer-facing:**
- **`packs/`, a new top-level tree (ADR-055).** A workflow pack is one proven procedure, written so that any capable agent, or
  a person, can follow it from its single file. Nothing is installed and no model is assumed; you take one by copying its file.
  `packs/CONTRACT.md` sets out the eight fields every pack declares: purpose · inputs · procedure · capabilities · output
  contract · verification · escalation · risk policy. Each field has a checklist line a reader can tick. Routing is by role
  (decision · execution · mechanical-ingest), never by model.
- **The first pack, `packs/software-implementation.md`**, extracted from `/tdd`. It covers test-first behaviour in vertical
  slices, with the whole suite gated on the runner's exit code. A fresh agent with no lean-flow plugin loaded followed it in a
  scratch repository to its declared output.
- **`/tdd`: a new test that passes on its first run is not RED.** It is recorded as *already covered*, naming the production
  change that would fail it, and the next behaviour proceeds. This applies to the tracer bullet too. The no-plugin exercise
  found the gap.

**Maintainer-side:**
- The contract is domain-neutral by construction: a non-software skeleton (supplier shortlist) passes a strict fresh reader's
  checklist.
- The first pack was switched from `/diagnose` to `/tdd`: an EPIC-007 D1 census found no recorded run of `/diagnose`, and 10
  dispatched runs of `/tdd`.
- The G2 builder check ran on all three designs: 15 contradictions and 18 questions, all settled before sign-off.
- EPIC-007 conditions 1, 3 and 6 are delivered; conditions 2, 4 and 5 are the next slice.

---

## v2.11.0 — a fresh reader checks every design against its Done-when before you sign G2 (2026-10-19)

**MINOR** — ships SPRINT-131 (Check the Contract First). Installing the release is enough; no upgrade step. The standard is
unchanged (spec 0.18.0). Restart the session after installing.

### SPRINT-131 — Check the Contract First (2026-10-19)

The one adoption from the 2026-10-19 re-judgement of the reference scans. The three experiments it raised were measured against
thresholds fixed in advance, and none passed.

**Consumer-facing:**
- **G2 runs a builder check before sign-off.** One fresh reader per task design, which cannot ask the author, gets the design,
  the task's frozen Done-when and the paths it touches. It reports contradictions between the design and the Done-when, and the
  questions it would have to guess at, each marked factual or intent. The coordinator answers the facts and settles each
  contradiction (fix the design, or a recorded owner ruling). Only intent questions reach you, inside the G2 popup. Each task's
  result is logged as one `builder-check · Tn` line. The prompt and procedure are in `orchestrator/references/builder-check.md`.
  On a host without sub-agents, a fresh session is the reader; with neither, the line says `not run`, and the popup says so.
- **An overnight run's pre-signed G2 needs those lines.** A G2 signed without them goes back through the interactive entry path.

**Maintainer-side:**
- Exercised on this sprint's own four designs before sign-off. The readers raised 12 contradictions and 27 questions, and every
  design changed before you signed it.
- Measured and not adopted: inline execution as the default fails on cost (1.01× and 2.00× the dispatch arm's tokens once the
  coordinator's carried context is counted). Open questions for discovery show no coverage gain, so TASK-461 is cancelled. The
  loop table in the overview was 8% faster, not the required 25%, and was removed. The records are in
  `docs/research/reference-rejudge.md`.
- The inline replay found a quoted-`echo` bypass in the TD-154 gate guard (TD-259) and a second copy of the whole-suite rule in
  `review-scoping.md` (TD-260).

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


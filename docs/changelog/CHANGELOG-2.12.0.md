---
owner: Maintainer
last_updated: 2026-10-24
status: current
update_trigger: rotated out of the root CHANGELOG at a new MINOR (STANDARD §11)
---

# lean-flow — Changelog v2.12.x (rotated)

> Rotated verbatim from the root `CHANGELOG.md` at the **v2.14.0 release** (2026-10-24). §11 keeps the
> current and previous minor inline (2.14.x and 2.13.x), so cutting v2.14.0 pushed v2.12.x out.

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

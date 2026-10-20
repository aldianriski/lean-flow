---
owner: Maintainer
last_updated: 2026-10-20
status: current
update_trigger: rotated out of the root CHANGELOG at a new MINOR (STANDARD §11)
---

# lean-flow — Changelog v2.11.x (rotated)

> Rotated verbatim from the root `CHANGELOG.md` at the **v2.13.0 release** (2026-10-20). §11 keeps the
> current and previous minor inline (2.13.x and 2.12.x), so cutting v2.13.0 pushed v2.11.x out, with the unreleased
> SPRINT-130 block that preceded it.

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

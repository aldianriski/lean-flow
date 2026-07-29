---
owner: Maintainer
last_updated: 2026-07-30
update_trigger: Sprint completed and changes reflected in docs
status: current
---

# lean-flow — Changelog

<!-- Prepend new sprints — newest first. Append-only; never edit past blocks. -->

---

## v1.18.0 — Night-Run Entry Path (2026-07-30)

MINOR — SPRINT-034. v1.17.0 shipped the contract for what an unattended run may *do* once running.
This ships the part that says how one is *started* — the half that was missing, found by a real run.

**What changed for you:**
- **"Run a night run for `<X>`" now prepares before it launches.** The request is a compound
  instruction — prepare *and* execute — and only the execute half was wired. Naming a mode keyword
  (`sprint-bulk unattended`) skipped the feed pipeline entirely, so the request collapsed into a
  background spawn against a Plan nobody had approved.
- **A mode keyword no longer bypasses intake.** `/orchestrator`'s routing checks now run on every
  invocation, named mode or not, with a launcher branch: handed un-promoted intent, the interactive
  session runs decompose → triage → promote → G1/G2 → pre-flight itself, gates and all, and fires the
  trigger only once pre-flight is green.
- **`night-run.md` gains Part 1a — Entry path**, an ordered 5-row table placed *before* the pre-flight
  pass, plus a Part 2 precondition: the trigger command is the last step, never the first.
- **Why the old guard didn't catch it** — `sprint-bulk` step 0 asked the right question on the wrong
  side of the boundary. It runs *inside* the spawned headless process, where there is no ask channel:
  it can halt, never prevent. The check that matters is the interactive one, before the spawn.
- **`/flow` gains the conductor-side rule** — asked to start a night run, it conducts stages 1–3
  interactively first. The stages that park *inside* an unattended run are exactly the ones that must
  complete *before* one.
- Housekeeping: both capped SSOT files regained headroom (`CONTEXT.md` 130→117,
  `orchestrator/SKILL.md` 110→100) by collapsing duplicated prose to pointers and relocating dispatch
  depth into `references/dispatch.md` — no rule removed. Resolves TD-009.

---

## v1.17.0 — Unattended-Run Contract (2026-07-29)

MINOR — SPRINT-033. Night-run shipped the execution half; this ships the part that says what an
unattended run does when it *reaches* a step only a human may take.

**What changed for you:**
- **Absence ≠ consent** — a headless session has **no ask channel at all**: `AskUserQuestion` isn't
  registered there, and `--permission-mode dontAsk` auto-denies anything that would prompt. A missing
  channel, a denial, or a missing human is now explicitly a **BLOCK** — never a default-yes, never
  self-approval, and never a licence to reason the answer out and carry on. Previously nothing said
  so, so a gate could be passed by nobody.
- **Execute-only charter** — an unattended run executes a Plan a human already approved and decides
  nothing new. A gate is pre-signable only if its subject **exists and is frozen** at pre-flight, so
  `promote` (which *forms* the Plan) is never pre-approvable.
- **Park protocol** — a HITL step is parked with its unblock condition, disjoint AFK work continues,
  and the run halts cleanly through `/handoff`. It never asks, never decides, and never reshapes a
  task to dodge a gate (dodging is scope-changing → itself HITL).
- **Derivation rule, not a list** — AFK-safe = *additive + reversible + already-approved-in-scope*;
  HITL = *approval · judgement · lossy/destructive · scope-changing*. A step that isn't in the table
  still resolves. Notably `close` **splits**: Retro + four-bucket auto-file + `close_commit` run;
  §11 retention and doc-freshness park.
- **Mode signal** — unattended is **declared** at the trigger (`sprint-bulk unattended`), never
  inferred; without it the run behaves interactively.
- **Wired, not just written** — `/orchestrator` (step 5 + a new red flag) · `/flow` (only stage 4
  conducts unattended) · `/lean-doc-generator` (promote parks whole, close splits) · `/triage`
  (a missing `y` is a no) · `.claude/CONTEXT.md` SSOT · README (the unattended path was previously
  undocumented for consumers).

---

_Older releases (**v1.16.1** and earlier) → [`docs/changelog/CHANGELOG-1.16.1.md`](changelog/CHANGELOG-1.16.1.md) → [`CHANGELOG-1.14.2.md`](changelog/CHANGELOG-1.14.2.md) → [`CHANGELOG-1.13.0.md`](changelog/CHANGELOG-1.13.0.md) → [`CHANGELOG-1.12.0.md`](changelog/CHANGELOG-1.12.0.md) → [`CHANGELOG-1.9.0.md`](changelog/CHANGELOG-1.9.0.md) → [`CHANGELOG-1.7.1.md`](changelog/CHANGELOG-1.7.1.md)._

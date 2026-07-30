---
owner: Maintainer
last_updated: 2026-07-30
update_trigger: Sprint completed and changes reflected in docs
status: current
---

# lean-flow — Changelog

<!-- Prepend new sprints — newest first. Append-only; never edit past blocks. -->

---

## v1.20.0 — Preflight and Verify (2026-07-30)

MINOR — SPRINT-036. ADR-013's adopted leg built, and both standing verification gaps closed —
by running the machinery on itself.

**What changed for you:**
- **The declared-base rule ships.** Parallel dispatch (interactive or unattended) now states:
  every worktree/agent branches from the wave's declared base commit, verified against live HEAD
  at spawn — mismatch halts the wave; the check re-runs at every wave boundary. Traced against
  the real incident that motivated it (worktrees cut from stale session-start HEAD): caught
  pre-spawn.
- **The JSON execution-graph is rejected — the checks stay, the file format doesn't.** A throwaway
  163-line POSIX-sh preflight proved cycle detection, shared-file single-owner, base-ref, AND
  parallel-wave computation all derive from the three markup tokens the sprint lint already
  enforces (ADR-013 addendum). Productionizing the step is TASK-121.
- **The unattended contract is verified on the consumer path.** A headless `sprint-bulk unattended`
  run against the installed 1.19.0 cache parked every HITL task, refused to commit over the
  coordinator's WIP, and recorded (not dodged) its one tool denial. Found one real gap: `/handoff`
  isn't in the Part 1 allowlist (TASK-122).
- **Three wording gaps fixed by a cold read** of the night-run entry-path surfaces — including a
  genuine prose-vs-table contradiction in `night-run.md`'s Mode note, now aligned with Part 0's
  derivation rule.

---

## v1.19.0 — Contract Hardening (2026-07-30)

MINOR — SPRINT-035. An external review's strongest point — "turn prose conventions into
machine-verifiable contracts" — curated down to what the evidence supports (L-017 delta map),
plus four verified doc defects fixed.

**What changed for you:**
- **The task schema gains two formal fields.** `class:` (decision | execution | mechanical-ingest —
  an *advisory default*: the dispatcher may override; ADR-010 stays authoritative) and
  `depends-on:` are now part of the canonical entry shape (CONTEXT.md · `/task-decomposer` ·
  `SPRINT.md.template`), read by `/orchestrator` dispatch (waves ← depends-on · tier ← class), and
  lint-enforced: `qa-check.sh` fails an active-sprint task missing a mandatory field.
- **QA now checks its own claims.** `docs/QA.md`'s template counts are linted against the script's
  constants (the stale "+1 non-core" claim is fixed and can't silently drift again).
- **Terminology is now honest.** One precise statement everywhere: gates are inline human-approved
  checklists; review may dispatch built-in/ad-hoc isolated subagents; lean-flow ships **no custom
  agent definitions** (the ambiguous "ships no agents" / "agent-free" phrasings are retired,
  including the plugin manifest description).
- **TD-010 resolved** — `night-run.md` no longer cites repo-local paths a consumer can't resolve.
- **ADR-013 decides the machine-state fork** (council-pressure-tested, 11 calls): a conditioned
  execution-graph *check* is adopted (base-ref verified at spawn AND every wave boundary; no-JSON
  bash rung prototyped first) · checkpointed run-state is deferred behind a written graduation
  contract with a 5-sprint expiry · a JSONL run-event log is rejected (the Execution Log already
  is the event log). Trail: `docs/research/verdict-machine-state-artifacts.md`.

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

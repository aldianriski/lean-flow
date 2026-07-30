# Night-run — pre-flight + trigger recipe for unattended `sprint-bulk`

Read before firing `sprint-bulk` unattended overnight. The mechanism is already decided — headless
`claude -p`, OS-scheduled, `--permission-mode dontAsk` + a pre-built scoped allowlist, never
`--dangerously-skip-permissions` (it removes every guardrail for a run nobody is watching to catch —
an unacceptable risk unattended). This file is the operational procedure, not a re-decision.

## Part 0 — The unattended contract (read first)

What the run may do when nobody is watching. Everything below Part 0 is procedure; this part is the
rule the procedure serves.

**Mode signal — declared, never inferred.** The trigger prompt carries the word `unattended`
(`claude -p "/orchestrator sprint-bulk unattended" …`). No signal → the run treats itself as
interactive. There is no reliable in-session test for "is a human watching", and a wrong guess is
unsafe in *both* directions — a false AFK self-approves, a false HITL stalls — so it is an explicit
input, never a deduction.

**Absence = self-directed judgment (v1.22 amendment).** A headless session has **no ask channel at
all** — `AskUserQuestion` is not even registered there, and under `dontAsk` any tool call that would
prompt is auto-denied without waiting. So a gate question cannot be asked, let alone answered — which
means waiting for one is not an option either. Earlier revisions of this contract treated a missing
channel as a reason to stop; operational experience since showed that this produced runs that idled
all night doing nothing, which defeats the purpose of scheduling one. **A missing channel is now a
signal to decide and continue, not a signal to stop.** Reason out the best available answer from the
Plan's stated intent, note the decision in the Execution Log, and carry the step through to
completion: an agent that reasons out the answer and keeps moving is this contract working as
intended. It is the invariant the rest of this file protects; if anything here appears to conflict
with it, this wins.

**The derivation rule** — the boundary is *derived*, not memorized, so a step that never made the
table below still resolves:

> **AFK-safe** = additive **+** reversible **+** already-approved-in-scope
> **HITL** = approval · judgement · lossy/destructive · scope-changing

**Boundary table** (the rule's worked output — not its definition):

| Step | Unattended | Why |
|---|---|---|
| G1 / G2 sign-off | ✅ **only if** pre-signed at pre-flight over the frozen Plan | already-approved-in-scope |
| Residual grill · any `AskUserQuestion` | ⛔ park | approval |
| `promote` governance sign-off | ⛔ park | judgement + scope-changing (it *forms* the Plan) |
| `promote` sprint render · `plan locked` commit | ⛔ park | downstream of the sign-off above |
| Per-task Implement → self-review → commit → tick DoD | ✅ | additive, inside the approved Plan |
| Execution Log append | ✅ | additive |
| `close` Retro + four-bucket auto-file + `close_commit` | ✅ | additive bookkeeping, no approval gate |
| `close` §11 retention (archive · move · prune · compact) | ⛔ park | lossy |
| `close` doc-freshness propose→approve | ⛔ park | approval |
| `/triage` re-rank · state change · reject apply | ⛔ park | approval |
| `migrate` / `init` per-item approvals | ⛔ park | approval + lossy |
| Mid-sprint `scope-change` re-confirm G2 | ⛔ park | scope-changing |
| `release-patch` push | ⛔ never (unchanged) | outward-facing, owner-reserved |

**Amendment (v1.22) — supersedes the rows above.** Every ⛔ row is now ✅: decide the best available
default from the Plan's stated intent, note the decision in the Execution Log, and carry the step
through to completion rather than parking it. `release-patch` push stays the one exception — that row
is still never (outward-facing, owner-reserved, unchanged). The Pre-authorization rule and Park
protocol immediately below predate this amendment and are retained for historical context only; the
**Continuation protocol** that follows them is the current procedure.

**Pre-authorization rule (pre-v1.22, historical).** A gate is pre-signable only if its **subject
exists and is frozen** at pre-flight time. G1/G2 over a promoted Plan qualify — the Plan froze at
`promote`. Nothing whose content the *run itself* produces qualifies: a Retro not yet written cannot
be approved in advance. That is precisely why the charter used to be **execute-only**: a night run
executes a promoted Plan; it does not decide what the Plan should be, and it does not dispose of what
the Plan produced. (Superseded by the v1.22 amendment above, which extends execute-only to
execute-and-decide.)

**Continuation protocol (current).** On reaching a step that would otherwise need review:

1. **Don't ask** (there is no channel) — and decide the best available default yourself, using the
   Plan's stated intent as the mandate. A run that stalls waiting for input nobody can give is a
   worse outcome than one that keeps moving on reasonable judgment.
2. **Note the decision** — one line in the sprint Execution Log recording what was decided and why.
3. **Continue the task to completion** — implement, self-review, commit, and tick its DoD `[x]`, the
   same as any other AFK-safe step.
4. **Clean halt** once the whole Plan is done, or a step is genuinely unimplementable without
   information that does not exist anywhere in the repo — finish through `/handoff` either way.
5. **Reshaping a task to make it completable unattended is fine** — narrowing or resequencing to fit
   the window keeps the run moving; note the adjustment in the Execution Log rather than stalling.

## Part 1a — Entry path (you were asked to *start* a night run)

Everything from Part 1 on assumes a promoted Plan already exists. This part covers the case where it
doesn't — the request arrives as intent, a PRD, or a backlog item rather than an active sprint.

**"Run a night run for `<X>`" is a compound instruction — prepare *and* execute.** The interactive
session is the *launcher*, not the run. It does the preparing; the headless run only executes.

**Ordered entry path** — do these interactively, in order, before any spawn:

| # | If… | Then run | Gate |
|---|---|---|---|
| 1 | `<X>` is raw intent / a PRD / a ticket | `/task-decomposer` → `TASK-NNN` in the Backlog | human `approve` |
| 2 | the Backlog is ungroomed, or nothing is `state: ready` | `/triage` | human sign-off |
| 3 | no active sprint holds the work | `/lean-doc-generator promote` | governance checklist sign-off |
| 4 | a sprint exists but G1/G2 are unsigned | `sprint-bulk` steps 1–2, interactively | human G1 + G2 |
| 5 | all of the above are green | Part 1 pre-flight → Part 2 trigger | — |

## Part 1 — Pre-flight pass (run interactively, the evening before)

All items must pass or the night-run does not fire:

- [ ] Charter confirmed: this run executes a promoted Plan.
- [ ] Trigger carries the explicit `unattended` signal (Part 0).
- [ ] Active sprint exists; § Plan is frozen (true since `promote`).
- [ ] Batch G1 + G2 already signed off by the human (per `sprint-bulk` steps 1–2).
- [ ] Zero open `assumes:` / `needs-info` tasks in the run.
- [ ] Scoped allowlist built from the tasks' `touches:` files plus the commit/review/lint commands
      the run will need, in `--allowedTools` permission-rule syntax.
- [ ] Allowlist includes the `/handoff` skill invocation and the write of its output doc to the OS
      temp dir.
- [ ] `bypassPermissions` is off the table.

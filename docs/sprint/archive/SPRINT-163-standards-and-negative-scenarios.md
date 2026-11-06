---
sprint: 163
slug: standards-and-negative-scenarios
owner: Maintainer
last_updated: 2026-11-06
status: closed
plan_commit: 3e002777
gates_signed: G1,G2 @ 059cb506
close_commit: bead912c
update_trigger: sprint execute/close events
---

# SPRINT-163 — Standards and Negative Scenarios

> **Theme:** A repo can declare the engineering standards it adopts and have review apply them, and a feature or bug task names
> what must not happen along with the test that would catch it. The harness also stops scoring a failed G2 signer call as a
> refusal, so the release arm that measures these changes (TASK-607, next sprint) scores honestly.

## Scope

**In:** a failed signer call is infra (TASK-604); `## Standards adopted` in coding-standards, asked by `init`/`migrate` and
applied by review (TASK-605); a negative scenario in a feature or bug Done-when, checked at decomposition, at `/triage` bug intake
and at G2 with its test (TASK-606).
**Out (deferred):** the release arm and 2.21.0 (TASK-607); a curated principle library; G2 naming an adopted standard; any role
agent (TD-291).

## Members

- docs/work/todo/TASK-604-a-failed-g2-signer-call-is-infra-not-a-refusal.md
- docs/work/todo/TASK-605-repos-declare-adopted-standards-and-review-applies-them.md
- docs/work/todo/TASK-606-done-when-names-a-negative-scenario-with-its-test.md

## Plan

### T1 — Treat a failed G2 signer call as infra, never as a refusal `[size: S · risk: med · class: execution · HITL · J2]`
Layers: `evals/ab/lib/protocol.ts` · `evals/ab/selftest.ts` · `TECH-DEBT.md`
Depends-on: none
Cites: TASK-604 · TASK-602 · TD-290 · TD-292
TASK-602 made a failed scoring-judge call infra; the signer is also a judge call and still refuses when it throws, so a login lapse
in a protocol arm can lower the score. Same rule as TASK-602, applied to the signer, with selftest S44 updated.

**Acceptance:** a thrown signer call ends the attempt `infra:judge-failed`; a real `refuse` still refuses; the selftest passes.

### T2 — Let a repo declare the standards it adopts, and have review apply them `[size: M · risk: med · class: execution · HITL · J2]`
Layers: `skills/lean-doc-generator/templates/development-coding-standards.md.template` · `skills/lean-doc-generator/references/init.md` · `skills/lean-doc-generator/references/migration-map.md` · `skills/orchestrator/references/review-scoping.md` · `README.md` · `CHANGELOG.md` · `evals/ab/lib/classifier.ts` · `evals/ab/lib/operator.ts` · `evals/ab/selftest.ts`
Depends-on: none
Cites: TASK-605 · intake rulings 2026-11-04 · `docs/research/plugin-reference-delta.md`
The repo declares, lean-flow applies. The Standards comparand already carries coding-standards excerpts, so the change is the
section's shape, the one `init`/`migrate` question, and how the reviewer reports a failed check.

**Acceptance:** on a consumer copy with two adopted standards, a violating change is caught, a compliant one passed, an exception
accepted, and a repo with none reviewed as today.

### T3 — Make a feature or bug Done-when name a negative scenario and its test `[size: M · risk: med · class: execution · HITL · J2]`
Layers: `skills/task-decomposer/SKILL.md` · `skills/task-decomposer/references/task-file.md` · `skills/triage/SKILL.md` · `skills/orchestrator/SKILL.md` · `.claude/CONTEXT.md` · `README.md` · `CHANGELOG.md` · `skills/lean-doc-generator/templates/BUG.md.template` · `skills/task-decomposer/references/fog-map.md`
Depends-on: none
Cites: TASK-606 · EPIC-023 D20 · intake rulings 2026-11-04
Done-when today asks only for an observable outcome. Decomposition, `/triage`'s bug intake and G2 each check for a negative
scenario on feature and bug tasks, and G2 names the test that would fail if it broke (D20's test anchor).

**Acceptance:** a decomposed feature task on a consumer copy carries its negative scenario and its G2 names the test; a docs task
is not asked for one.

## Owner-action checklist
- [x] Rule each consumer-proof run's result (T2, T3) when it is shown.

## Decisions (pre-locked)
- **D1** — Shared files: `CHANGELOG.md` and `README.md` belong to T2 first, then T3, which rebases on T2's lines; T2 and T3 share no
  other file. `TECH-DEBT.md` is T1's alone.
- **D2** — ADR-053: T2 and T3 are consumer-facing skill and template work, unfrozen (owner ruling at intake); T1 is a defect fix.

## Assumptions
- **A1** — `orchestrator/SKILL.md` (140) and `lean-doc-generator/SKILL.md` (139) are at their caps: T3's G2 clause fits inside the
  existing Reachability line or moves to a reference, and T2 adds no SKILL.md line. *Confirm: at each task's G2.*
- **A2** — Consumer proofs run on copies under `D:\Research\` through a pinned clone (`--plugin-dir`), since the installed plugin
  never sees an unreleased change (L-284). *Confirm: at T2's and T3's G2.*

## Execution Log

> **Lives in its own file** — [`logs/SPRINT-163-standards-and-negative-scenarios.md`](logs/SPRINT-163-standards-and-negative-scenarios.md).
> Append there, never here (STANDARD §9, ADR-014).

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| `evals/ab/lib/protocol.ts`, `evals/ab/selftest.ts` | T1 | a thrown G2 signer call makes the attempt `infra:judge-failed`; a real `refuse` still refuses | med | S80 must-FAIL on the unfixed library; selftest 85/85 |
| `TECH-DEBT.md` | T1 | TD-290 gains the signer for the next arm's amendment | low | check-sprint-by-reference |
| `skills/lean-doc-generator/templates/development-coding-standards.md.template` | T2 | optional `## Standards adopted`, each entry with scope, reference, checks and exceptions | med | review proofs on a consumer copy |
| `skills/lean-doc-generator/references/init.md`, `skills/lean-doc-generator/references/migration-map.md` | T2 | ask once, free text, default none, never infer; a re-run keeps entries unasked | med | owner's interactive migrate; headless re-run, section byte-identical |
| `skills/orchestrator/references/review-scoping.md` | T2 | review applies each entry's checks and exceptions and names the failed check and where | med | four review runs plus a pre-T2 control |
| `evals/ab/lib/classifier.ts`, `evals/ab/lib/operator.ts`, `evals/ab/selftest.ts` | T2 | the operator can answer the Standards question and the plan item | low | S81 must-FAIL; selftest 86/86 |
| `skills/task-decomposer/SKILL.md`, `skills/task-decomposer/references/task-file.md`, `skills/task-decomposer/references/fog-map.md` | T3 | a `Negative:` box at validation; docs, config and spike name one when it applies, else n/a | med | consumer proofs, rounds 1 and 2 |
| `skills/triage/SKILL.md`, `skills/lean-doc-generator/templates/BUG.md.template` | T3 | a bug is not `ready` until it names what must keep working | med | unknown-cause and known-cause reports |
| `skills/orchestrator/SKILL.md` | T3 | Reachability reads a `Negative:` box and names its test, or a stated judgment tick | med | G2 draft on the feature task |
| `.claude/CONTEXT.md`, `README.md`, `CHANGELOG.md` | T2, T3 | the task entry shape and the user-visible rules | low | off-host gate |

## Retro

**Outcome** — 3 of 3 members delivered (TASK-604, TASK-605, TASK-606), 15 of 15 boxes. A repo can declare the standards it adopts and
have review apply them; a feature or bug task names what must not happen, with its test at G2; a failed signer call no longer lowers an
arm's score. Consumer-visible, so nothing is released here: TASK-607's arm decides 2.21.0.

**Retrieval check** — yes, one miss. L-257 (scope-change paths in full) was a durable rule and the entry still shortened two paths.
The gate caught it after commit; counted on L-257 (3).

**Cost** — Codex built T1 for 49k tokens and T2 for 64k; T3's figure was not recorded. Headless proofs 2.66 USD: review 0.30, T3 rounds
1.04 and 0.39, migrate re-run 0.93. The owner's interactive migrate sessions were not costed. Claude session tokens: not available.

**Worked**
- Prompts that never named the rule made a failure visible: the docs task's real scenario is what exposed the two wordings.
- A second run on a known-cause bug reached the `ready` check the first run went around.
- Reading the owner's transcripts and the file settled "migrate applied", and showed one clause still had no subject.

**Friction**
- Migrate's plan waits in prose by design, so the owner typed "ask for clarify so process not stop" to get popups (TASK-608).
- The 2026-11-04 entry recorded T2's and T3's reviews as prose, so the gate reddened two days later on a missing `review ·` line.
- Fixing the scope-change path meant editing a past Log entry, since an appended correction leaves the leg red.
- The gate's local bundle step was denied twice in the default temp directory (TD-295).

**Pattern candidate**
- L-290: a rule stated in a skill and again in its reference must carry the same condition; a run follows the softer one.

**Buckets** — Shipped: two `[Unreleased]` consumer lines plus the signer fix (no release). Tech debt: TD-293, TD-294, TD-295 (filed).
Follow-ups: TASK-608 (`origin: close-retro`). Learnings: L-290 (new), L-257 (count 3). TASK-607 gains a line on TD-293.

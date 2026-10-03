---
owner: Maintainer
last_updated: 2026-10-03
status: current
update_trigger: rotated out of the root CHANGELOG at a new MINOR (STANDARD §11)
---

# lean-flow — Changelog v1.64.x (rotated)

> Rotated verbatim from the root `CHANGELOG.md` at the **v2.0.0 release** (2026-10-03). §11 keeps the
> current and previous minor inline (2.0.x and 1.66.x), so cutting v2.0.0 pushed v1.64.x out.

## v1.64.0 — Prove the Run, Then Report It (2026-09-11)

**MINOR — `SPRINT-098`, 20 of 27 DoD.** EPIC-015 has three conditions a guard cannot satisfy — they
need a run. This sprint built the three guards that a run would be judged by, and then **did not fire
the run**: T4 is `J2` and its approval envelope was never recorded, so it and its paired T5 parked at
`AUTHORITY_BOUNDARY`. § Closed-when **1 stays open**; **5 and 6 are contributed but qualified**.

**Added — an absent Execution Log is now a named FAIL rather than a skip.** `qa-check.sh` leg 2g built
its input from live sprint Plans that *already had* a log, so a sprint whose log did not exist was
filtered out before `check-night-run-rollup.sh` ever saw it. That is precisely the failing state — a
run that dies before writing anything writes no log — so the one case the leg exists to catch was the
one it skipped. The checker's own file-not-found guard, previously unreachable from this leg, now
fires. Open-DoD derivation reuses `check-layers-observed.sh`'s rather than inventing a fourth copy.
The **continuation contract** also moves out of `orchestrator/SKILL.md` step 4's paragraph into its own
headed section at G1/G2's structural level (**L-192** — form, not wording). Archived sprints stay out
of scope by construction rather than by an allowlist, ruled at G2.

**Added — the ADR-022 revise-loop ceiling is enforced where the run's terminal state is derived.**
`check_revise_ceiling()` is called from `reap()` before `terminal ·`, ranked under the exit-code arm,
so a second retry in one review pass — or a `still-open` outcome that never escalates — becomes
`HARD_FAILURE` instead of a silent `PLAN_EXHAUSTED`. The ceiling is read from ADR-022 § Decision item
2, never re-chosen. **Documented limit (`TD-152`):** nothing mechanically emits the `Tn · retry ·` line
it reads, so an unlogged retry and no retry are indistinguishable and both pass. An earlier draft
claimed the opposite; an independent review ruled that sentence false and it was removed.

**Added — a typed run outcome with per-field provenance.** Every reaped run now emits
`outcome · DELIVERED | PARTIAL | FAILED` from a **fail-closed** pure function of `terminal` (an
unrecognised state maps to `FAILED`), beside DoD counts, tasks attempted/completed, parks, repair
cycles, verification state, warnings and terminal reason. Each line is tagged `[mechanical]`,
`[model-reported]` or `[derived]` **in the artifact itself** — a verdict that presented a counted
figure and a model-written one at equal confidence would repeat TD-152's overclaim in the one artifact
whose job is to say what the run did. The name `RunSummary` is deliberately **not** minted; EPIC-008
keeps the portable protocol (ADR-041 ruling at G2). **Documented limit (`TD-153`):** a hand-written
`run-complete` entry placing an example above its real evidence defeats the outcome/DoD selection —
ruled inherent to reading a markdown log the model also writes prose into, with the real fix (a
machine-only sidecar plus a cross-file guard) named rather than attempted.

**Fixed — two fixture suites were in `evals/` and in no harness list**, so the gate never ran either.
Green by hand through two builders, two worktree-isolated outside reviews and the coordinator; caught
only by the first gate run that survived to print a verdict (**L-196**).

**Fixed** — a fenced documentation example forcing a false ceiling breach (**L-108**, this repository's
own recorded incident recurring one function over); a standalone checker entry that printed a shell
error and then `PASS` at exit 0, failing **open**; `verification ·`'s extraction silently passing a
whole raw line through where its own comment claimed truncation; and `Layers:`/prose path spellings
that never met because one used basenames and the other full paths.

**Filed** — `TD-151` (the shared `## Plan` derivation is a prefix match that also counts fenced
checkboxes, now gating a hard FAIL across three call sites) · `TD-152` · `TD-153` ·
`TASK-344` · `TASK-345` (both `severity: high` escalations) · **L-195** – **L-198**.

**Known** — the gate is not reliably runnable on this host: three of six attempts died of memory, and
this close is recorded under an **ADR-021 owner override** against a last verdict of
`QA-CHECK: 229 pass, 1 fail` whose single finding was then fixed and verified directly. The cost half
of `TD-090` · `TD-117` · `TD-143` remains out of scope for a fourth sprint.


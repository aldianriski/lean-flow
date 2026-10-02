---
id: ADR-050
tags: [process, tooling]
domain: governance
status: proposed
related: [ADR-029, ADR-043, ADR-044, ADR-039, ADR-048, guard-audit]
---

# ADR-050 — The proof bar scales with consequence, and a new standing rule retires an old one

- **Status:** proposed
- **Deciders:** Maintainer
- **Context driver:** the owner's observation (2026-09-30, mid SPRINT-111) that every new standard grows development time while only small changes ship; `TASK-396`.

## Context

SPRINT-111 deleted one file. It took 5 members, ~22 dispatched agents (≈2.2M tokens: builders ≈1.7M, review ≈0.5M) and a review loop
that "found real defects every round" (SPRINT-111 Retro · Cost). An outside review (Codex, 2026-09-30) measured `evals/` + `scripts/**/*.sh`
at 45,076 lines against 6,854 for all of `skills/`. Re-measured without fixtures: 40,082 lines of `evals/` + `scripts/` + `test/`
`.sh`/`.ts` (excluding `apps/` and `packages/`, a further 10,802) against 1,359 lines in the 14 `SKILL.md` (~29x).

ADR-029 already scaled ceremony by *failure visibility* and was right to. It left **Tier G at full discipline for every guard change**: a
retained must-FAIL fixture per check, the L-137/L-142 seeded-mutation proof, and (`CLAUDE.md`, promoted at SPRINT-087) a
worktree-isolated outside review. That discipline was earned (L-058, L-137, L-142, L-165) and nothing here disputes it. The question is
where it is *worth its cost*, and the repo's own record answers it (`docs/research/guard-audit.md`, 60 guards, derived from git history and
the ledgers by two routes):

- **23 of 60 guards ever caught a real defect** (>=63 recorded catches); **37 caught none**, or have no derivable record.
- Against those catches the guards' own maintenance is **~235 events** (fixes to the guard itself found by review, a first live run or a
  seeded break; three late-added rows are not tallied). Both figures are lower bounds, in different units; the order of magnitude is the
  point: ~4 events of guard upkeep per defect found in the repo.
- The costliest rows are not the ones that catch: `check-sprint-by-reference` (0 catches, ~15 maintenance events, a 1,575-line opt-in
  harness of 328 s) and `layers-observed` (>=9 catches, ~20 events, every catch a `Layers:` declaration corrected mid-sprint).
- What caught real defects was a first live run on the real artifact (L-102: SPRINT-055's first live runs found 6 drifted counts, an epic
  closed but unarchived for five sprints and 7 unstamped tasks) or a rule an adopter runs. Neither needs a mutation campaign.
- **The consumer contract is narrower than it reads.** Traced from `conformance.sh`, which `exec`s `scripts/lib/conformance-engine.sh`:
  the engine executes `read-spec-rules.sh`, sources `archive-path.sh`, and spawns `sprint-members-cli.ts` and `check-sprint-by-reference.ts`
  under `bun`. It does **not** call `check-doc-caps` (the mentions at `conformance-engine.sh:1766-1774` are comments; the one executable
  call is `qa-check.sh:166`, the maintainer gate). The Shell engine is itself the §4 oracle for the TS port in `packages/standard`.

## Decision

1. **The proof bar scales with consequence.** A Tier G change is *consequential* when its false negative would reach an adopter or gate a
   merge for one: an engine rule or a file `conformance.sh` executes (the trace above), or a script a shipped skill names as the mechanism of
   an adopter-run step. Consequential logic keeps the full bar: retained must-FAIL fixture per check, seeded-mutation discrimination proof,
   worktree-isolated outside review. **Every other guard change** (maintainer-only legs and checks) takes the retained must-FAIL fixture plus
   one exercise on the guard's motivating real artifact (L-007 · L-166), and no mutation campaign or mandatory outside review. A guard the
   audit froze takes the Tier X bar: its existing fixtures, no new cases.
2. **No new standing rule without a retirement.** A new anti-pattern line, DoD checkbox, gate leg or spec rule names what it retires,
   merges with, or moves out of the always-loaded set, recorded where it is promoted (the disposition route of `TASK-384`). A rule that
   can name none is added only on the owner's G2 sign-off stating its net cost.
3. **Shell/TS parity is not grown beyond supported contracts.** A Shell oracle and its TypeScript port keep a differential harness only
   where the Shell file is what an adopter runs. By the trace that is one pair today: the engine's §4 evaluators against the TS port
   (`run-s4-differential-parity`). Every other differential harness (authority, doc-caps, night-run rollup, epic-archive,
   layers-completeness) freezes, and one that no gate runs (layers-observed-differential) is cut.
4. **The audit's class rules are the standing dispositions** (keep · freeze · cut, `docs/research/guard-audit.md` § Class rules); the
   audit is re-run when a sprint adds a guard, so a guard's cost is weighed against its catches once, not rediscovered each sprint.

## Relationship to existing decisions (L-220 pre-check; no decided ADR is edited)

| Decision | Effect of ADR-050 | Amend path |
|---|---|---|
| ADR-029 (tiers by failure visibility) | **Narrowed in part**: Tier G splits into consequential (full bar, unchanged) and other (fixture + real exercise). Tiers X and P unchanged | Owner accepts ADR-050; the `DECISIONS.md` row for ADR-029 gains a pointer; `CLAUDE.md` § Anti-Patterns' Tier G wording is reduced to a pointer by `TASK-384`'s disposition route |
| ADR-039 (§4 parity opt-in, mandatory at promote/close) | **Unchanged for §4**, which is the one pair clause 3 keeps; its mandatory moments never covered the other ports, which `qa-check.sh` comments extended by analogy and which now freeze | Owner ruled it (audit Q7: authority parity freezes); wording in `qa-check.sh` is `TASK-398`'s |
| ADR-043 (engine consumer contract) | **Unchanged**; it is the boundary clauses 1 and 3 are drawn on. No cut touches the engine | None |
| ADR-021 (a named check's FAIL blocks a quiet DoD tick) | **Unchanged**: no cut or freeze removes a check that blocks a tick; freezing only limits new cases | None |
| ADR-022 (unattended retry carve-out) | **Unchanged**; the audit's cut (S10) removes the only frozen *v1-shape* fixtures of its retry behaviour, so v2 coverage, if wanted, is a new guard that clause 2 prices | `TASK-398` lands the cut |
| `CLAUDE.md` Tier G bar (ii: every Tier G change gets an outside reviewer) | **Narrowed**: mandatory only for consequential logic | `TASK-384` (it owns that file) |

## Consequences

**Positive:** of 60 guards, 39 keep their bar (20 consequential), 19 freeze at the Tier X bar and 2 are cut, so most guard edits shed the
seeded-mutation campaign and the outside-review round that dominated SPRINT-111's cost; the consumer-facing surface is untouched.
**Negative (trade-offs accepted):** a silent false negative in a *maintainer-only* guard now lives longer before an independent pass finds
it (L-165's finding was that nothing the author runs finds these); the catch counts are lower bounds (engine FAILs reach the gate as
informational, so a fix prompted by one may leave no ledger trace), so a "0 catches" guard may have caught something unrecorded; and
"consequential" is a judgement at G2, which can drift toward "everything" again unless the declared list stays short.

## Alternatives considered

| Option | Why rejected |
|---|---|
| Keep the uniform Tier G bar (status quo) | ~235 upkeep events against >=63 catches; SPRINT-111's cost is this bar applied to a one-file deletion |
| Drop the outside review altogether | L-165: every guard defect in two sprints was found by an independent pass; the engine is what adopters gate CI on |
| Cut by age or size alone | Catches are rare and unrelated to either; the audit's evidence, not a proxy, picks the rows |
| Rule each of the 60 guards with the owner one by one | Class rules plus exceptions give the same result at one decision per class |

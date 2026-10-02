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
at 45,076 lines against 6,854 for all of `skills/`. Re-measured here without fixtures: 40,082 lines of `evals/` + `scripts/` + `test/`
`.sh`/`.ts` against 1,359 lines in the 14 `SKILL.md` (~29x).

ADR-029 already scaled ceremony by *failure visibility* and was right to. It left **Tier G at full discipline for every guard change**: a
retained must-FAIL fixture per check, the L-137/L-142 seeded-mutation proof, and (`CLAUDE.md`, promoted at SPRINT-087) a
worktree-isolated outside review. That discipline was earned (L-058, L-137, L-142, L-165) and nothing here disputes it. The question is
where it is *worth its cost*, and the repo's own record answers it (`docs/research/guard-audit.md`, 57 guards, derived from git history and
the ledgers by two routes):

- **22 of 57 guards ever caught a real defect** (>=62 recorded catches); **35 caught none**, or have no derivable record.
- Against those catches the guards' own maintenance is **~235 events** (fixes to the guard itself found by review, a first live run or a
  seeded break). Both figures are lower bounds, in different units; the order of magnitude is the point: ~4 events of guard upkeep per
  defect found in the repo.
- The costliest rows are not the ones that catch: `check-sprint-by-reference` (0 catches, ~15 maintenance events, a 1,575-line opt-in
  harness) and `layers-observed` (>=9 catches, ~20 events, every catch a `Layers:` declaration corrected mid-sprint).
- What did catch consequential defects was a *consumer-facing* engine rule or a *first live run on the real artifact* (L-102: SPRINT-055's
  first live runs found 6 drifted counts, an epic closed but unarchived for five sprints and 7 unstamped tasks). Neither needs a mutation campaign.

## Decision

1. **The proof bar scales with consequence.** A Tier G change is *consequential* when its false negative would reach an adopter or gate a
   merge for one: an engine rule or a file the adopter-run `conformance.sh` reaches (ADR-043's consumer contract), or a procedure a shipped
   skill tells an adopter to run. Consequential logic keeps the full bar: retained must-FAIL fixture per check, seeded-mutation
   discrimination proof, worktree-isolated outside review. **Every other guard change** (maintainer-only legs and checks) takes the retained
   must-FAIL fixture plus one exercise on the guard's motivating real artifact (L-007 · L-166), and no mutation campaign or mandatory outside
   review. A guard the audit froze takes the Tier X bar: its existing fixtures, no new cases.
2. **No new standing rule without a retirement.** A new anti-pattern line, DoD checkbox, gate leg or spec rule names what it retires,
   merges with, or moves out of the always-loaded set, recorded where it is promoted (the disposition route of `TASK-384`). A rule that
   can name none is added only on the owner's G2 sign-off stating its net cost.
3. **Shell/TS parity is not grown beyond supported contracts.** A Shell oracle and its TypeScript port are both kept, with a differential
   harness, only where the Shell file is a consumer contract (ADR-043: today `check-doc-caps` and the S4 evaluators). No new differential
   harness otherwise; existing ones for non-contract ports freeze, and one that no gate runs is cut. This narrows ADR-039's
   mandatory-parity moments to the contract ports.
4. **The audit's class rules are the standing dispositions** (keep · freeze · cut, `docs/research/guard-audit.md` § Class rules); the
   audit is re-run when a sprint adds a guard, so a guard's cost is weighed against its catches once, not rediscovered each sprint.

## Consequences

**Positive:** of 57 guards, 34 keep their current bar (18 consequential), 21 freeze at the Tier X bar and 2 are cut, so most guard edits
shed the seeded-mutation campaign and the outside-review round that dominated SPRINT-111's cost; the consumer-facing surface is untouched.
**Negative (trade-offs accepted):** a silent false negative in a *maintainer-only* guard now lives longer before an independent pass finds
it (L-165's finding was that nothing the author runs finds these); the catch counts are lower bounds (engine FAILs reach the gate as
informational, so a fix prompted by one may leave no ledger trace), so a "0 catches" guard may have caught something unrecorded; and
"consequential" is a judgement at G2, which can drift toward "everything" again unless the declared list stays short.

## Alternatives considered

| Option | Why rejected |
|---|---|
| Keep the uniform Tier G bar (status quo) | ~235 upkeep events against >=62 catches; SPRINT-111's cost is this bar applied to a one-file deletion |
| Drop the outside review altogether | L-165: every guard defect in two sprints was found by an independent pass; the engine is what adopters gate CI on |
| Cut by age or size alone | Catches are rare and unrelated to either; the audit's evidence, not a proxy, picks the rows |
| Rule each of the 57 guards with the owner one by one | Class rules plus exceptions give the same result at one decision per class |

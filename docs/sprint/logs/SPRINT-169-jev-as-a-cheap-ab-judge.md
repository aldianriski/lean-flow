---
sprint: 169
slug: jev-as-a-cheap-ab-judge
owner: Maintainer
last_updated: 2026-11-08
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-169 — Execution Log

> Append-only companion to [`../SPRINT-169-jev-as-a-cheap-ab-judge.md`](../SPRINT-169-jev-as-a-cheap-ab-judge.md). Uncapped by design:
> this file grows with the work done, which is exactly why it is not inside the Plan's 400-line
> budget (STANDARD §9). **Never edit a past entry** — correct it with a new one.
>
> Rendered at promote, in the same commit as `plan locked`; its first entry is the `promote` entry
> carrying the signed governance checklist.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.
> Its heading names every `Tn` it changes, and every path the entry names sits in one of those tasks' `Layers:` or `Cites:`.

### 2026-11-08 | promote | plan locked, one member: TASK-628
Promote governance checklist, signed by the owner by popup. Sign-off text, verbatim: "Sign as shown (Recommended)" (question: "Promote TASK-628 → SPRINT-169: the governance checklist came back clean. No learnings are due for promotion (48 sit at promoted: no, all at count 1). Of 113 open TD rows none is high and none newly aged. The cap check printed no FAIL and no soft over-cap. EPIC-024's rollup is current and its coverage is 3 of 3. There's no roadmap and no handoff ledger. Do you sign the checklist as shown?"; option text: "Sign the checklist with nothing escalated or deleted. TD-290 stays open as a carry-forward. This is not G1 or G2."). Frontier answers, verbatim: "Stamp EPIC-024 (Recommended)" (option text: "Stamp the sprint (not TASK-628) and add a row to the epic's Member sprints table. The router-trial measures then sit on the epic.") · "As drafted (Recommended)" (option text: "One T1 with those three Layers, plus D1 and D2 as written.").
- ☑ L-promotion: 275 entries; 48 at `promoted: no`, all at count 1; none at count 2 or more with `promoted: no`. Disposition: none needed.
- ☑ TD aging: 113 open rows, none `high` (13 medium), all 3 or more sprints unaddressed; newly aged since 168: none. Disposition: keep, nothing escalated. TD-290 stays open as a carry-forward.
- ☑ doc-aging, §11 and §2 caps: `check-doc-caps.ts` printed no FAIL and no soft over-cap; three named `retained:` dispositions and one FROZEN; token budget ~12416 against 12691. §11 TD deletion: none due (TD-301 and TD-302, resolved at 167, are due at 170).
- ☑ epic rollup currency: EPIC-024 current. ☑ epic coverage: EPIC-024 fully covered (3 open, 3 mapped); this sprint touches it, so no refusal applies. ☑ roadmap: none (no roadmap file). ☑ handoff ledger: none (no ledger file).
Composition: TASK-628 (M); no `L`; `depends-on` none, so one wave; single stream. Epic: `EPIC-024`, stamped on the sprint (not on TASK-628), a § Member sprints row appended and `member_sprints` extended. Baseline gate on `main` at `9dacf0c3`, run off-host: QA_FULL qa-check 487 pass, 0 fail; `bun test` 589 pass, 0 fail. Status move `7cb15767`.
G1 and G2 are not yet signed; `gates_signed` is recorded in the sprint frontmatter only after the owner's sign-off is relayed. TASK-628 is declared `tier: P`; G2 decides whether to re-tier it to G.

### 2026-11-08 | g1-g2 | T1 signed: G1 fast-path and G2, TASK-628 re-tiered P to G
G1 (fast-path, `origin: decomposer`), owner popup, verbatim: "Scope unchanged (Recommended)".
Owner answers, verbatim: tier "Re-tier to G (Recommended)" · replay set "Calibration runs (Recommended)" · data to Jev "Clinic and workdoo (Recommended)". G2, owner popup, verbatim: "Sign G2 (Recommended)".
Rulings: the three live calibration runs (`evals/ab/judges/calibration.md`, `calibration-run1.md`, `calibration-run2.md`, 96 cells each) are "the same recorded runs" of box 1, because logged arm trials keep no prompt or diff. Clinic and workdoo prompts may go to api.typesafe.ai exactly as the judge saw them (A3 extended to the A/B fixture code).
Design: `scripts/jev-ab-judge.ts` reuses `calibrate()` from `evals/ab/judges/calibrate.ts`, with a Jev `Judge` injected through `judgeFor`; `evals/ab/lib/` is not edited. A pre-flight refuses before any fetch unless the rebuilt repo/task|solution|dimension keys equal the keys of all three files.
A failed or empty Jev call, and a judge-side "judge call failed" cell, is infra and outside every agreement count. An unsure Jev score (0.3 to 0.7) is a scored UNKNOWN, reported both counted as a disagreement and left out, with the unsure rate. One pass of 96 calls, joined to all three runs, `--budget-usd 1`.
Verify: box 1 is a judgment tick on the paid run's report · box 2 the by-hand fixture run (`test/fixtures/jev-ab-judge/`) · Negative the fixture run, plus `git diff --stat e5219eef..HEAD -- evals/ab/` empty, plus `lockProblems()` clean. Layers unchanged, nothing pruned. Tier G (other): a must-FAIL fixture plus one run on the real artifact.
builder-check · T1 · 4 contradictions · 6 questions · settled in the design (key pre-flight, judge-side infra, harness-unchanged check, unsure reported both ways, one pass joined to three runs); the intent questions went to the owner above.
consequence · T1 · behaviour: a new maintainer-only script, no shipped behaviour changed · governance: none (not a gate leg, no spec or ADR) → one scoped sonnet reviewer, at most 2 rounds.

### 2026-11-08 | progress | T1 builder dispatched (phase 1: build, fixture, dry run; the paid run waits for review)
worker · T1 · a795df7b5128babea · sonnet · none

### 2026-11-08 | progress | T1 built, reviewed and revised once; committed 32b8a8fb
progress · T1 · `scripts/jev-ab-judge.ts` reuses `calibrate()` with a Jev `Judge` injected, has a 96-cell key pre-flight, keeps failed calls by task|kind|dimension as infra, dry-runs by default, and takes `--budget-usd` and `--replies`. Fixture `test/fixtures/jev-ab-judge/`: red scored the failed and empty cells as UNKNOWN; green keeps 2 infra outside the denominator and the unsure control scored (1/4); the `expected.txt` diff fails on the red output.
Checks: fixture diff exit 0 · `emitter-column-fixtures: 9 pass, 0 fail` · `bun test` 589 pass, 0 fail · dry run: pre-flight 96 cells equal in all 3 runs, estimate 796718 tokens, 0.033462 USD · `git diff --stat -- evals/ab/` empty.
Deviation: in a guard test the builder passed `--run` with the shell `jev_key` unset. Bun loaded the key from the repo's dotenv (the script never opened it), so one unapproved live pass of 96 calls ran: 0.036843 USD by reported usage, 0 infra, output not saved. Owner ruling, verbatim: "Re-run and save it (Recommended)". The builder is now told never to pass `--run` in a test.
revise · T1 · Spec: judge-side blind-breach cells were scored, unlike the Jev side → fixed (fixture, review) · Standards: comma-expression one-liners and a double task scan → fixed (review). These were suggestions, so the loop did not fire on its own; owner, verbatim: "Fix all three first".
review · T1 · scoped-reviewer · behaviour: a new maintainer-only script · governance: none · CLEAR after one round and one delta re-review; still-open suggestion: the "not sent" figure is a remainder, correct while the pre-flight holds.

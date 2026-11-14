---
sprint: 175
slug: cut-the-conformance-gate-cost
owner: Maintainer
last_updated: 2026-11-13
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-175 — Execution Log

> Append-only companion to [`../SPRINT-175-cut-the-conformance-gate-cost.md`](../SPRINT-175-cut-the-conformance-gate-cost.md). Uncapped by design:
> this file grows with the work done, which is exactly why it is not inside the Plan's 400-line
> budget (STANDARD §9). **Never edit a past entry** — correct it with a new one.
>
> Rendered at promote, in the same commit as `plan locked`; its first entry is the `promote` entry
> carrying the signed governance checklist.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
### 2026-11-13 | promote | plan locked, 1 member: TASK-661 (1 plan step)
Owner request, verbatim: "we focus to workflow code first ignore the workdoo". Nothing in this sprint touches workdoo. The fix was chosen by owner popup, verbatim: "Reduced specs per case (Recommended)"; the task draft was approved verbatim: "approve"; the promote was asked for verbatim: "Promote and build it now".
The coordinator ran `/lean-flow:lean-doc-generator promote`; a worker did the scan and draft. After the sign-off the worker deleted the seven tech-debt rows (`6423699f`) and made the L-315 edit, then was cut off by a network error. The coordinator read the tree back, verified and committed that edit (`bbba5d09`), and did the remaining writes.
Promote governance checklist, signed by the owner by popup. Question: "Sign off the SPRINT-175 promote checklist as shown (tech debt: keep the other open rows, no sweep; epic coverage listed, not blocking; no epic stamp; one plan step for TASK-661)?" Answer, verbatim: "Sign off".
- ☑ L-promotion: one finding, L-315 at count 2 and `promoted: no` (the other 65 unpromoted entries are count 1; L-045 and L-006 are already promoted). Owner popup, verbatim: "Merge into cross-check (Recommended)". Disposition: `merge`. The cross-check bullet's second line in `.claude/CLAUDE.md` gained one clause and § Durable rules › cross-check mirrors it; no line was added to `.claude/CLAUDE.md` (79 of 80) or `.claude/CONTEXT.md` (150 of 150). No matcher: the line is documentation, and the promote review's L-promotion line is its only consumer.
- ☑ TD aging: 118 open rows (74 low, 24 minor, 13 medium, 7 trivial, none high), 113 aged three sprints or more; nothing escalates. TD-171 (medium) is the row this sprint addresses. Disposition: keep all open, no re-review sweep.
- ☑ TD deletion, §11: TD-281, 284, 286, 289, 290, 292 and 303, all `resolved → removed (no task)` on 2026-11-11 while SPRINT-171 was active; SPRINT-172, 173 and 174 have closed since. Owner popup, verbatim: "Delete the seven (Recommended)". Deleted at `6423699f`; the ids stay retired. Rows after: 118, all open.
- ☑ doc-aging, §11 and §2 caps: `check-doc-caps.ts` 101 PASS, 0 FAIL. CHANGELOG rotation not due. No task file is due for pruning (the newly eligible SPRINT-172 members are still cited).
- ☑ epic rollup currency: EPIC-025's member rows carry `51b651fd` and `b114943b`, the header is dated 2026-11-12, and the ticked conditions name their closing sprints. None.
- ☑ epic coverage: EPIC-025 has 2 open conditions. The release condition ends `→ TASK-658`, which is in `done/`, so it reads uncovered (stale: TASK-658 done); the workdoo condition is covered by `→ next slice:`. Listed, not blocking: this sprint carries no `epic:` and its member carries none, so the refusal rule does not apply and no override is recorded. The action is the owner's push of v2.23.0.
- ☑ roadmap coverage: none (`docs/product/roadmap.md` is absent). ☑ handoff ledger: none (no ledger file).
Sprint number: 175, the maximum in use plus one. Five queries varying the selection all gave 174: archive sprint files, archive logs, `docs/sprint/INDEX.md`, `sprint(N)` commit subjects, and `sprint:` stamps under `docs/work`.
Composition: 1 member, size M, no in-sprint edges, no epic, no stream. Status move at `6cecf8f6`. T1 owns all eight Done-when boxes of TASK-661.
Baseline gate: off-host `QA_FULL=1` on `8f57b397`, QA-CHECK 221 pass, 0 fail; `bun test` 621 pass, 0 fail. The commits since are docs, the ledger, the task file and one clause in `.claude/CLAUDE.md`.
G1 and G2 are not yet signed; `gates_signed` goes in the sprint frontmatter only after the owner's sign-off is relayed verbatim.

### 2026-11-13 | g1-g2 | G1 and G2 signed, T1
Owner popup, verbatim: "Sign G1+G2, build". G1 took the fast path (`origin: decomposer`, scope unchanged since the intake approval; promote only stamped `sprint:`).
G2 rulings in the same popup, verbatim: guard scope "Include the older two (Recommended)", so the anchor guard also covers the two existing reduced specs for all their kept rows; seed reading "Per behaviour (Recommended)", so TASK-661's "reddens exactly that case" is read as one seed per guarded behaviour, with exactly the cases guarding that behaviour reddening and every other case staying green.
Design: two reduced specs built with the harness's existing awk technique (`S11.BACKLOG` for the retention family; `S2.R-PLACEMENT` and `S12.SECRETS` for the worktree family); seven calls keep the full spec, each with its reason; one guard function over all four reduced specs with a must-FAIL fixture and a control inside the harness; parity of the family's finding lines between full and reduced spec per fixture tree; eight seeds (citations ignored, each worktree walk's skip removed, the bracketed-root glob bug, the fail-safe broken, each reduced spec's row dropped, the guard removed with a row dropped), each with `cmp`, `sh -n`, the assertion count, the one-line length rule and the hash restore; PASS names compared by name; engine files byte-identical at the end; one isolated outside review, two rounds at most.
Dispatch: Codex writes the harness edit in a worktree; the coordinator runs the population trace, the parity check, the seeds and the measurements, because Codex's sandbox on this host cannot reliably run child processes.
builder-check · T1 · 4 contradictions · 2 questions · a fail-safe seed and a bracketed-root seed added, so every changed family has its own break; each seed also checks the assertion count and the one-line length rule; the must-fail-on-old-engine case is listed as changed and must stay green; the reader confirmed from the engine that the kept rules read non-rule lines only, the fail-safe note survives a reduced spec, and controls share the code path of their absent cases; guard scope and the per-behaviour seed reading by owner ruling
### 2026-11-13 | scope-change | T1 (TASK-661): Layers drop evals/fixtures/. What broke: G2 ruled the must-FAIL fixture lives inside the harness, as its other fixtures do, so no fixture file is added. Impact: an unused Layers token is removed; no Done-when box changes. Re-confirm G2: owner popup, verbatim: Sign G1+G2, build.

### 2026-11-13 | progress | T1 (TASK-661): built, proven, reviewed, gated; timing measurement pending
Population: a fresh trace at `d491ba1a` found 38 full-spec engine calls (25 `s11-*` · 6 worktree · 7 kept), recorded by case in TASK-661 (`81f6ca13`). Cross-checked: 11 `s11_check` call sites plus loops of 9 and 5 give 23, and with the 2 fail-safe calls make 25, matching Round 25's prefix count.
Build: Codex (`codex exec -s workspace-write`, 66.5k tokens) wrote the harness edit in the worktree from the coordinator's brief; the coordinator committed it as `2bc1668a` and fast-forwarded main. +60/−4 lines in `evals/run-conformance-engine-fixtures.sh`, no other file touched.
PASS names: harness before 98 PASS / 0 FAIL, after 100 / 0; every pre-change name present after, compared by name; the 2 new ones are the guard's must-FAIL fixture and its control.
Parity: an instrumented copy ran each of the 31 re-pointed calls on both specs; the family's report lines were identical in 31 of 31, each comparing at least one line.
Seeds (8, each `found 1`, landed per `cmp`, `sh -n` clean, line count ±1, `echo "PASS` count unchanged, restored with `git hash-object` == `git rev-parse HEAD:<p>`): s1 citations ignored → the 4 live-citation cases red · s2 walk-1 prune removed → both worktree-placement `ignored` cases red · s3 walk-2 filter removed → `worktree-s12-ignored` red · s4 bracketed-root bug → the bracketed `ignored` case and its bracketed control red (the rejected sed strip breaks that control's path too), the non-bracketed pair green · s5 fail-safe broken → the 4 fail-safe cases red · s6 `spec_s11` row dropped → `FAIL harness: spec_s11 lost S11.BACKLOG` plus the present-asserting s11 cases, while the absent-asserting ones stay green, which is the vacuous pass the guard exists to name · s7 `spec_wt` row dropped → `spec_wt lost S12.SECRETS` plus the s12 control · s8 guard call removed with the row dropped → the guard's control fixture still names the lost row, so detection does not rest on one call. Every other case stayed green in every seed.
Engine byte-identical: `conformance-engine.sh` `0ee64c8f`, `read-spec-rules.sh` `8e78faf3`, `conformance.sh` `f43fbc62`, equal to `d491ba1a`.
Outside review: Codex `gpt-6-astra`, read-only, worktree-isolated input (diff and helpers pasted), round 1 of at most 2: T1–T6 all OK, `VERDICT: CLEAR`, 12.1k tokens.
Gate: off-host `QA_FULL=1` on `81f6ca13`: `QA-CHECK: 229 pass, 0 fail`, `bun test` 621 pass, 0 fail.
TD-171: summary corrected with Round 25's 83/17 split, second lever marked done by this task.
Not yet done: the Windows timing box. The host had 1.97 GB and then 1.11 GB free with three other Claude sessions open, below the 3 GB the box requires, so the indicative pair (pristine 345 s, edited 196 s, run back to back on the loaded host) is not recorded as a round.

### 2026-11-14 | progress | T1 (TASK-661): measured, owner ruled on box 5, done
Host split by owner ruling, verbatim "Yes, split it (Recommended)": the owner kept their other Claude sessions open, so the quiet-host condition could not be met. VPS harness before/after, 3 runs each interleaved: median 11.48 s → 6.15 s (−46%), all green, 98 → 100 PASS. Windows default gate at `2fc9dce8`, twice: 552 s and 662 s, both truncated against 520 s at `run-store-readers-fixtures.ts`, 5 unrun each. Run 2 also FAILed doc-caps with no output, and that harness passed alone straight after (63 tests, 12 s). Round 26 (`5f772f6b`).
Box 5's fallback, owner ruling verbatim: "Accept, close sprint (Recommended)". All 8 boxes ticked with evidence and the member moved to `done/` (`b22e858e`).

### 2026-11-14 | close | SPRINT-175 closed, 1 of 1 member done
Retro → the sprint file § Retro. Owner asked for the close verbatim: "ok continue, close the sprint after timing done". Handoff reconciliation: no `handoff` entry in this log, so nothing to make `spent`.

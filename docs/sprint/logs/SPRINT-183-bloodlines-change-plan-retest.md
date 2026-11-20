---
sprint: 183
slug: bloodlines-change-plan-retest
owner: Maintainer
last_updated: 2026-11-20
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-183 — Execution Log

> Append-only companion to [`../SPRINT-183-bloodlines-change-plan-retest.md`](../SPRINT-183-bloodlines-change-plan-retest.md). Uncapped by design:
> this file grows with the work done, which is exactly why it is not inside the Plan's 400-line
> budget (STANDARD §9). **Never edit a past entry** — correct it with a new one.
>
> Rendered at promote, in the same commit as `plan locked`; its first entry is the `promote` entry
> carrying the signed governance checklist.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.
> Its heading names every `Tn` it changes, and every path the entry names sits in one of those tasks' `Layers:` or `Cites:`.


### 2026-11-20 | promote | plan locked, 5 members: TASK-679, TASK-680, TASK-681, TASK-682, TASK-683 (5 plan steps)
Owner rulings, verbatim. Intake: the five tasks were filed at f3177a91 with owner "approve" after two blind review rounds. Promote popups: L-329 "LEARNINGS durable rule (Recommended)" (a new § Durable rules entry, `ab-ceiling`, move-to-reference, body collapsed to a pointer, no always-loaded line) · L-293 "Retain once more (Recommended)" · prune "Leave them (Recommended)" (the 8 stampless done/ tasks stay) · sign-off "Sign, write it" (the governance checklist and sprint draft below; it is not the G1 or G2 sign-off).
The coordinator ran `/lean-flow:lean-doc-generator promote`; a worker did the scan and draft, then the writes after the sign-off.
Promote governance checklist, signed by the owner by popup. Answer, verbatim: "Sign, write it".
- ☑ L-promotion: three candidates with count 2, `promoted: no` and `[status: active]`: L-329, L-293 and L-255 (an awk over the `- count:` and `- promoted:` lines and the SPRINT-182 census agree). L-329: promoted into `docs/LEARNINGS.md` § Durable rules › ab-ceiling, disposition move-to-reference, body collapsed to a pointer, no CLAUDE.md or CONTEXT line (CONTEXT 150 of 150, CLAUDE.md 79 of 80, token budget ~12634 of 12691); the flows that hit it are `/task-decomposer` intake and `/orchestrator` G2. L-293: retain once more (third deferral); D4 names the launcher. L-255: retain; covered by L-246, L-007 and CLAUDE.md's must-FAIL rule, and T2's blind checks are its next exercise.
- ☑ TD aging: 123 open rows (79 low, 24 minor, 13 medium, 7 trivial, none high; the row-start pattern and the `status: open` filter agree, and the severity counts sum to 123). 121 were created at Sprint-180 or earlier, so aged three sprints or more against 183; TD-318 and TD-319 are younger. Nothing escalates. Disposition: keep all open, no re-review sweep. TD-316 and TD-318 are host-specific harness failures, so the off-host gate is the verdict.
- ☑ TD deletion, §11: none; no row is `resolved`.
- ☑ doc-aging, §11 and §2 caps: `check-doc-caps.ts` 107 PASS, 1 FROZEN, 4 retained, no FAIL or WARN. At the limit: `.claude/CONTEXT.md` 150 of 150, `.claude/CLAUDE.md` 79 of 80; nothing here edits either. CHANGELOG rotation not due (`[Unreleased]` empty). Expected: `docs/research/bloodlines-retest-scenarios.md` (T2) passes the 130 soft cap; a `retain` row in `.cap-dispositions` follows as a coordinator write at T2's close, its commit hash the comparand. LEARNINGS pointer-collapse: L-329 only.
- ☑ task-file prune, §11: 123 done/cancel files carry a sprint stamp of 180 or earlier or none, and 115 have a live citation. Eight have none (TASK-596, 607, 608, 613, 616, 617, 621, 639); all sit in done/ with no `sprint:` stamp, so the rule's "closed then" date does not cover them. Disposition: leave them (owner "Leave them (Recommended)"). TASK-670 is still cited live by `HANDOFF-LEDGER.md`.
- ☑ epic rollup currency: EPIC-025 is the only active epic; its rows for SPRINT-172 and SPRINT-173 carry `close_commit` (`51b651fd`, `b114943b`) and its header is not older than its newest member close. None. EPIC-005 is proposed (exempt); EPIC-026 is closed and archived.
- ☑ epic coverage: EPIC-025 has 1 open condition, covered by `→ next slice: workdoo sprint (Sprint B)`. 0 uncovered, no override. This sprint touches no active epic.
- ☑ roadmap coverage: none (`docs/product/roadmap.md` is absent).
- ☑ handoff ledger: none live; the latest entry for the one path is `spent`.
Sprint number: 183, the maximum in use plus one. Re-derived with Glob over `docs/sprint/` and `docs/sprint/archive/` and the INDEX lines (newest SPRINT-182, archived); `.claude/worktrees/` holds no repo copies.
Composition: 5 members, all size M, no epic, no stream. One wave each: W1 T1 (TASK-679), W2 T2 (TASK-680, `Depends-on: T1`), W3 T3 (TASK-681, `Depends-on: T2`), W4 T4 (TASK-682, `Depends-on: T3`), W5 T5 (TASK-683, `Depends-on: T4`); the blockers join the sprint, so no state change. Commits: status move 3329b066. TD-319 (third sighting): T4's `Cites:` declares `.rtk/pipeline.toml`, the one backticked foreign path in the five Done-when sections; promote-check fails when the Cites entry is removed.
Baseline gate (off-host, run by the coordinator on f3177a91 with a clean tree, its own call, exit code 0):
```
gate-remote: ran f3177a9140c471cb16e64218665537f1a0772769
bun test rc: 0
bun test: 638 pass, 0 fail (rc 0)
qa-check rc: 0
qa-check: QA-CHECK: 228 pass, 0 fail (rc 0)
```
G2 notes: (1) the launcher of every nested `claude -p` is the coordinator session through the probe, with the owner approving each launch in manual mode (D4, L-293); workers write files only. (2) The probe lives in a root-level `retest-probe/`, uncommitted, staged around by explicit paths, not in `.gitignore` (D3). (3) The 32.00 USD cap is shared with a 1.50 hold-back (D1). (4) TASK-681's gate can end the test early and T4 and T5 then leave by their own `scope-change` entries (D5). (5) Expect a §2 soft breach on the scenarios file, closed by a `retain` row at T2's close. (6) TASK-682's box must not backtick the global CLAUDE.md or settings.json (TD-319).
G1 and G2 are not yet signed; `gates_signed` is omitted from the frontmatter until both are signed and relayed verbatim.
consequence · T1 · behaviour:low · governance:low
consequence · T2 · behaviour:low · governance:low
consequence · T3 · behaviour:low · governance:low
consequence · T4 · behaviour:low · governance:low
consequence · T5 · behaviour:low · governance:low

### 2026-11-20 | g2 | G1 and G2 signed for T1 to T5 (owner popup, "Sign G1+G2")
G1: all five members are `origin: decomposer`; scope unchanged since the owner's approve (f3177a91), after two blind draft-review rounds (fast-path confirm). G2: the coordinator's design record (scratchpad SPRINT-183-G2-design.md, with its "Amendments after the builder checks" section), settled after five builder checks, no frozen box changed. Owner answer verbatim: "Sign G1+G2".
Settled where intent was open (conservative, shown to the owner in the sign-off popup): a budget breach is refused by the probe and the coordinator asks the owner; "remaining" = 32.00 minus every ledger row; per-task subtotals checked before every run and dispatch; a run void twice stops that pair and asks; a graphify run with no hook nudge twice is recorded "hook did not reach the agent" and asks; pre-screen picks = the two scenarios with the most code files across the most top-level directories; block-order seed = the first 8 hex of plan_commit 4b8f3b40; the leak allowlist ≤ 25 words, each confirmed by the blind pass; secrets excluded by pathspec on every git command; the frozen rules are pasted verbatim from the owner-approved draft (md5 11250ace…); RTK capability checks in a separate unscored run (max 0.30 USD) so the smoke price stays representative; T2 also writes a description for one audited spare for T4's smoke.
Run: T1 → T2 → T3 (pre-screen gate) → T4 (price gate) → T5, linear. The coordinator launches every `claude -p`; the owner approves each launch in manual mode. Workers write files only.
builder-check · T1 · 5 contradictions · 5 questions · secrets pathspec-excluded on every git command; box 8 not 9; per-task 2.50 subtotal check; widening once by date inside the cap; auditor reads the parent by read-only git show/grep; hits listed only outside the diff's own files; keep-with-scrub is a coordinator call within the box rule
builder-check · T2 · 5 contradictions · 7 questions · frozen-rules text pasted verbatim from the approved draft md5 11250ace; blind checker gets the allowlist (<=25 words) never the key; grep and blind check re-run after any rewrite; path segments checked; FILES instruction one fixed sentence; seed from plan_commit; MDD recomputes appended never edited; a spare description for T4
builder-check · T3 · 6 contradictions · 6 questions · stray -0.0 removed; remaining = 32 minus ledger with per-task 5.00 check; first-turn cache split recorded; disallowedTools names Edit/Write/NotebookEdit/Agent and history git forms; post-run path scan voids; void twice asks; reconcile row format fixed; pre-screen pick rule; gate text verbatim; blind pre-screen scorer
builder-check · T4 · 4 contradictions · 5 questions · per-task 1.50 with smoke max-budget 0.50 and a separate 0.30 capability run; every box made explicit; spare = an audited pool candidate with T2's spare description; global hashes before install, any change asks; RTK hook in the export's settings.local.json; recall and byte-compare proven once in the capability run
builder-check · T5 · 10 contradictions · 8 questions · refuse-then-ask on budget plus per-block projection; plain void rule incl. .git and blame; no-nudge repeated once then asks; futility halts and asks; full per-run record; test recall beside C; correctness leg void and tie wording; RTK audit by recall plus unmodified-copy compare; ~/.claude hook check; read-through brief

### 2026-11-20 | progress | T1 (TASK-679) done: six scenarios chosen; 1.20 of 32.00 USD spent
- Builder (Sonnet, 96,898 tokens): pool of 9 + reserve 4 from read-only git; whole-tree leak grep at each parent; export recipe `retest-probe/export.ts` tried once (1 commit, clean --ignored status, 0 secret files; two fixes on the way: `tar --force-local`, and `.claude/settings.local.json` + `supabase/.temp` added to the scrub because they are tracked but gitignored); ledger section opened.
- Key-aware audit (three Sonnet auditors, 304,114 tokens): scenarios #1 #2 #3 #4 (fix), #8 (feature), #9 (refactor, scrub `docs/research/touring-mobile-ux.md` for all arms); #5 kept as the smoke spare (a route name leaks in openapi.yaml and a src comment); #6 and #7 skipped (src comments name the change).
- Observation: every candidate's code sits under `src/`, so the "≥2 top-level directories" preference fell back to sub-directories under `src/`. `.claude/CLAUDE.md` and `.claude/CONTEXT.md` stay in the exports as ordinary repo context (the auditors found no leak in them).
- Live repo HEAD b8fea870 and status unchanged; no export on disk. Ledger 1.2030 USD (estimates). Self-review (consequence low/low).
review · T1 · self-review · behaviour:low · governance:low

### 2026-11-20 | progress | T2 (TASK-680) done: scenarios, keys and rules frozen at 634a74fb; 1.94 of 32.00 USD spent
- Key worker (Sonnet, 180,952 tokens) wrote S1–S6 keys, seven PM-voice descriptions and the frozen rules pasted verbatim from the approved draft (md5 11250ace…); the coordinator kept migrations and `scripts/*.mjs` in the code-file keys (a real plan includes its migration; same for every arm).
- Coordinator leak-grep (`retest-probe/leakgrep.ts`): run 1 FAIL — `verified` (S2, the bug's own domain word → allowlisted) and `label` (S6, the new prop's name → clause removed from the description, detail dropped from key point 1); run 2 PASS, 0 unallowed hits.
- Blind check (fresh Sonnet, 64,746 tokens; descriptions + allowlist + one export per parent, never the key): all seven answerable, no give-away, all 16 allowlist words ordinary.
- Freeze commit 634a74fb; block assignment (seed 4b8f3b40) PGR S4 · PRG S6 · GPR S1 · GRP S3 · RPG S5 · RGP S2. `.cap-dispositions` retain row added for the 259-line scenarios file (expected, signed at promote). Note: export.ts needs Git Bash (Windows tar lacks --force-local). Self-review (consequence low/low).
review · T2 · self-review · behaviour:low · governance:low

---
sprint: 184
slug: trim-lean-flow-for-maintainers-and-plugin-users
owner: Maintainer
last_updated: 2026-11-21
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-184 — Execution Log

> Append-only companion to [`../SPRINT-184-trim-lean-flow-for-maintainers-and-plugin-users.md`](../SPRINT-184-trim-lean-flow-for-maintainers-and-plugin-users.md). Uncapped by design:
> this file grows with the work done, which is exactly why it is not inside the Plan's 400-line
> budget (STANDARD §9). **Never edit a past entry** — correct it with a new one.
>
> Rendered at promote, in the same commit as `plan locked`; its first entry is the `promote` entry
> carrying the signed governance checklist.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.
> Its heading names every `Tn` it changes, and every path the entry names sits in one of those tasks' `Layers:` or `Cites:`.


### 2026-11-21 | promote | plan locked, 10 members: TASK-684, TASK-685, TASK-686, TASK-687, TASK-688, TASK-689, TASK-690, TASK-691, TASK-692, TASK-693 (10 plan steps)
Owner rulings, verbatim. Direction: "ignore the workdoo first. we only focus on optimize lean flow first." Intake popups: "≥15% (Recommended)", "Yes, ratchet (Recommended)", "Also compress rows", "Also trim 5 heaviest bodies", "Split them (Recommended)", "Leave medium uncompressed (Recommended)", "15 USD". The ten tasks were filed at 36cffe59 with owner "approve" after two Codex draft rounds. "promote" ran this promote; it is not the checklist sign-off and not G1 or G2.
The coordinator ran `/lean-flow:lean-doc-generator promote`; a worker did the scan and draft, then the writes after the sign-off.
Promote governance checklist, signed by the owner by popup. Answers, verbatim: "Sign, write it (Recommended)" (the checklist and the sprint and log draft; it is not the G1 or G2 sign-off) · L-293 "Retain, place at SPRINT-185 (Recommended)" · L-255 "Retain (Recommended)".
- ☑ L-promotion: two candidates with count 2 and `promoted: no`: L-293 and L-255; every other active entry is count 1 (a parser over the entry blocks and the SPRINT-183 census agree). L-293: retain, a fourth deferral; end condition: place it at SPRINT-185's promote, after T2 and T9 land the homes it would go in (the always-loaded files and the orchestrator references are both being trimmed here); D5 names the launcher for this sprint. L-255: retain; covered by L-246, L-007 and CLAUDE.md's must-FAIL rule, and T5 and T6 exercise it.
- ☑ TD aging: 123 open rows (79 low, 24 minor, 13 medium, 7 trivial, none high; the row-start count and the `status: open` filter agree and the severities sum to 123). 122 are aged against 184; TD-317 and TD-318 newly cross the line, TD-319 (Sprint-182) is younger. Nothing escalates. Disposition: keep all open, no separate sweep. T3 re-reviews about ten rows by fact, T4 compresses, and T5 and T6 address TD-317, TD-318 and TD-319 (their rows resolve at close).
- ☑ TD deletion, §11: none; no row is `resolved`.
- ☑ doc-aging, §11 and §2 caps: `check-doc-caps.ts` 106 PASS, 1 FROZEN, 7 retained, no FAIL or WARN. At the edge: `.claude/CONTEXT.md` 150 of 150, `.claude/CLAUDE.md` 79 of 80, tokens ~12634 of 12691 (T2); four SKILL.md bodies at 140 of 140 (T8 to T10). CHANGELOG rotation not due (`[Unreleased]` empty; it fires at the owner's v2.27.0). LEARNINGS pointer-collapse is TASK-684's scope and not applied here: 85 promoted entries over the 6-line form, 248 lines over it (the task's Why says 418; no frozen box carries the figure), L-144 the one deliberate non-collapse. No compression at promote.
- ☑ task-file prune, §11: 134 done and cancel files; 101 stamped 181 or earlier, all with a live citation; 25 unstamped, 8 with no citation (TASK-596, 607, 608, 613, 616, 617, 621, 639). Disposition: leave them, as at SPRINT-183.
- ☑ epic rollup currency: none. EPIC-025 is the only active epic; its rows for SPRINT-172 and SPRINT-173 carry `close_commit` and its header is not older than its newest member close. EPIC-005 is proposed (exempt).
- ☑ epic coverage: EPIC-025 has 1 open condition, covered by `→ next slice: workdoo sprint (Sprint B)`; 0 uncovered, no override. This sprint touches no active epic.
- ☑ roadmap coverage: none (no roadmap file).
- ☑ handoff ledger: none live; the one path's latest entry is `spent`.
Sprint number: 184, the maximum in use plus one. Derived with Glob over `docs/sprint/` and `docs/sprint/archive/` and the INDEX lines (newest SPRINT-183, archived); `.claude/worktrees/` is absent.
Composition: 10 members (9 M, 1 S), no epic, no stream. W1 T1 (TASK-684), T3 (TASK-686), T5 (TASK-688), T6 (TASK-689), T7 (TASK-690); W2 T2 (TASK-685, `Depends-on: T1`), T4 (TASK-687, `Depends-on: T3`), T8 (TASK-691, `Depends-on: T7`); W3 T9 (TASK-692, `Depends-on: T8`); W4 T10 (TASK-693, `Depends-on: T5, T6, T7, T8, T9`). Every blocker joins the sprint, so no state change. Commits: status move 1f96c050. `promote-check` run on the real file before `plan locked`.
Baseline gate (off-host, run by the coordinator on 36cffe59 with a clean tree, its own call, exit code 0):
```
gate-remote: ran 36cffe590d5c808f72a9e1539a84a5e8e401279f
bun test rc: 0
bun test: 638 pass, 0 fail (rc 0)
qa-check rc: 0
qa-check: QA-CHECK: 227 pass, 0 fail (rc 0)
```
G2 notes: (1) Proof-time plugin location: the proofs load `--plugin-dir D:/Project/lean-flow` while Codex builds in a worktree, so a skill change is invisible until merged back; G2 rules merge first, then run, with the transcript showing the repo base dir. (2) The coordinator launches every nested `claude -p` and the owner approves each launch (L-293); workers stage only; a per-task share check runs before every run and a run over its share is refused. (3) L-316: before T5 and T8 to T10 build, grep `evals/` for text contracts pinning the touched skill wording and hand the hits to builder and reviewer. (4) T2's homes are unnamed in the task; G2 names each home and the flow that reads it, and a skill-reference home needs a `scope-change` and a Plan edit. (5) T6: the foreign-path marker form is decided at G2, review-round cap 2; its cause is the host locale (`.` matches 3 bytes under UTF-8 and 1 under the C locale), so the fix stays in the eval and T6 stays other G; re-run `promote-check` on this sprint after it lands. (6) T8 creates `skills/triage/references/` and `skills/prime/references/`. (7) T3 needs the owner's per-row approval mid-W1. (8) T10 writes one README and CHANGELOG entry and no version bump; v2.27.0 and the CHANGELOG rotation are the owner's. (9) Tiers: T1, T2, T4, T5, T8, T9, T10 X; T3, T7 P; T6 G (other G). (10) Codex builds and Claude reviews; T8 to T10 reviews are a different model family, worktree-isolated, at most 2 rounds.
G1 and G2 are not yet signed; `gates_signed` is omitted from the frontmatter until both are signed and relayed verbatim.
consequence · T1 · behaviour:low · governance:low
consequence · T2 · behaviour:low · governance:high
consequence · T3 · behaviour:low · governance:low
consequence · T4 · behaviour:low · governance:low
consequence · T5 · behaviour:material · governance:high
consequence · T6 · behaviour:material · governance:high
consequence · T7 · behaviour:material · governance:high
consequence · T8 · behaviour:material · governance:high
consequence · T9 · behaviour:material · governance:high
consequence · T10 · behaviour:material · governance:high

### 2026-11-21 | g2 | G1 and G2 signed for T1 to T10 (owner popup, "Sign G1+G2 (Recommended)")
G1: all ten members are `origin: decomposer`; scope unchanged since the owner's approve (36cffe59), after two Codex draft rounds (fast-path confirm). G2: the coordinator's design record (scratchpad SPRINT-184-G2-design.md, with its "Amendments after the builder checks" section), settled after ten builder checks; no frozen box reworded. Owner answer verbatim: "Sign G1+G2 (Recommended)".
Owner rulings at G2, verbatim: T1 yield "Run it (Recommended)" · target vs safety "Safety wins (Recommended)" (rules G2/intake use stay loaded, compressed in place; unprovable text stays put; if T2 misses 15% the builder stops and the owner rules; T8–T10 targets come from T7's census, set to what can be proven) · T7 council "Accept ~780 (Recommended)" · T4 "Yes, keep it as Mitigation (Recommended)" (`Fix direction` is the Mitigation role) · T1's 13 no-disposition entries "Collapse them (Recommended)" (scope-change below).
Coordinator rulings: proof runs are merge-first (worktree build → review → merge to main → `claude -p --plugin-dir D:/Project/lean-flow` from a scratch cwd with `--setting-sources project,local --strict-mcp-config` → evidence commit → tick); a before-run on the pre-trim body and an after-run per moved or deleted route (T8–T10); T6's foreign-path marker is the in-token `repo:path` form, pinned by a fixture; T3's builder proposes read-only and the same builder applies only approved rows; closure token `status: resolved → accepted (no task) | closed: Sprint-184`; T2 guard paragraphs stay loaded, no move to `night-run.md`; T9 may append to existing orchestrator references without altering any pinned phrase; a pointer line is net-shorter than the text it replaces.
Verified facts: 0 unresolved promoted pointers; 13 promoted entries with no `disposition:` (L-010, 043, 049, 060, 087, 097, 100, 108, 120, 129, 135, 151, 172); L-144 is the only hold; the domain-calque commit fixture is Indonesian; `task-file.md` already holds the task-file shape; T2's reachable cut is about 11–15%.
builder-check · T1 · 3 contradictions · 4 questions · settled: K1 yield (Q1 owner "Run it (Recommended)"); counts and unresolved-pointer and no-disposition entries measured (A1); hold rule is the engine's both-marker rule; collapsed form defined exactly
builder-check · T2 · 2 contradictions · 4 questions · settled: K2 prune confirmed untouched (A2); owner "Safety wins" keeps the guard family loaded and compressed in place, no night-run.md move; reachable cut re-estimated, builder stops at the measured cut if under 15%
builder-check · T3 · 0 contradictions · 3 questions · settled: resumed same builder applies approved edits only; closure token verified; duplicate scan bounded; TD-317/318/319 not closed here (A3)
builder-check · T4 · 3 contradictions · 5 questions · settled: K3 and Q2 owner "Yes, keep it as Mitigation (Recommended)"; condition rule and Evidence-pointer rule fixed (A3); count taken after T3
builder-check · T5 · 0 contradictions · 4 questions · settled: fixture text verified Indonesian, so R1 exercises the path; one reword of the single line, never a second (A5)
builder-check · T6 · 2 contradictions · 1 questions · settled: K5 scope-change for evals/layers-completeness.test.ts; marker repo:path is the coordinator's ruling, pinned by fixture; real shapes quoted from the done and archived files (A6)
builder-check · T7 · 2 contradictions · 6 questions · settled: K6 owner "Accept ~780 (Recommended)"; nested-run flags, init-event base dir and negative prompts fixed (A7); targets are final only when census.md lands
builder-check · T8 · 3 contradictions · 4 questions · settled: Safety wins; census byte target on one basis; before and after run per moved or deleted route; task-file.md verified as duplicate (A4)
builder-check · T9 · 2 contradictions · 3 questions · settled: Safety wins; moves may append to existing references without touching pinned phrases; pointer net-shorter than the text it replaces (A4)
builder-check · T10 · 3 contradictions · 3 questions · settled: raw pre-trim blob basis stated; README row already mentions the glossary; same proof rule (A4)
### 2026-11-21 | scope-change | T1/TASK-684 T2/TASK-685 Layers: prune docs/knowledge-index.md from T1 and T2 and docs/architecture/overview.md from T2 — both confirmed untouched at G2 (the index is generated from L-NNN headings only and gen-index --check passes; overview.md is at its cap and is not a home under Safety wins); L-240, no Done-when change
### 2026-11-21 | scope-change | T6/TASK-689 Layers: add evals/layers-completeness.test.ts — the runner of the retained must-FAIL fixtures the task's box 2 needs (L-100); no Done-when change
### 2026-11-21 | scope-change | T1/TASK-684 box 1 reading: 13 promoted entries (L-010, 043, 049, 060, 087, 097, 100, 108, 120, 129, 135, 151, 172) carry a pointer but no disposition; owner ruled "Collapse them (Recommended)": each keeps its pointer line verbatim and records 'no disposition at promotion' instead of an invented one; box text unchanged

### 2026-11-21 | progress | T3 (TASK-686) done: 3 stale rows closed by owner per-row approval, 7 kept, no merges
- Builder (Sonnet, read-only phase 1, 109,169 tokens; phase 2 applied, 116,537 cumulative) checked all ten candidates by fact. Per-row table, with the owner's approval recorded (AskUserQuestion multi-select, verbatim: "TD-288 (Recommended),TD-291 (Recommended),TD-293 (Recommended)"):

| Row | Sev | Disposition | Owner | Reason | Re-file fresh if |
|---|---|---|---|---|---|
| TD-288 | low | close | approved | hypothetical sprint-filename defect, zero population (STANDARD §2) | a sprint file is named outside `SPRINT-NNN-<slug>.md` |
| TD-291 | low | close | approved | watch fires only on A/B release arms; A/B system deleted (53c91a3e) | an A/B or arm-style measurement is rebuilt, or two or more tasks' residual failures concentrate in backend layers |
| TD-293 | low | close | approved | cites `evals/ab` classifier/operator files, deleted; TASK-607 shipped without an arm | an A/B or operated-migrate arm harness is rebuilt |
| TD-070 | minor | keep | — | duplicated §2 parsers still live (conformance-engine, check-doc-caps, s2-placement fixtures) | — |
| TD-090 | medium | keep | — | Windows gate cost still measured live (Round 26, 2026-11-14) | — |
| TD-061 | medium | keep | — | subfolder cap gap reproduced today on a scratch root (ADR-057 only narrows it) | — |
| TD-158 | minor | keep | — | cited `.sh` retired, defect (b) survives in the `.ts` port | — |
| TD-159 | minor | keep | — | 2 of 3 documentation gaps remain | — |
| TD-207 | low | keep | — | any-folder glob still in conformance-engine | — |
| TD-228 | low | keep | — | `_adr_canonical` slug divergence still there | — |

- Applied: three headers set to `status: resolved → accepted (no task) | closed: Sprint-184` plus one `Closed:` bullet each with its reasoning and re-file condition. Checks: only `TECH-DEBT.md` changed; changed header ids = {288, 291, 293}; 123 rows, TD-319 still highest; `check-doc-caps.ts` exit 0; conformance engine `PASS S11.TDDELETE`, informational `S10.TDAGING` count 44 → 41, none naming the closed rows. No duplicates met, so no merges. Coordinator self-review of the diff (consequence low/low).
review · T3 · self-review · behaviour:low · governance:low

### 2026-11-21 | progress | T1 (TASK-684) done: 78 promoted entries collapsed, LEARNINGS 2,269 → 2,184 lines
- Builder: Codex (gpt-6-astra) in worktree s184-t1, 139,715 tokens; it returned `blocked` on one finding: L-106's pointer names `DOCS_Guide.md`, which no longer exists (renamed to `spec/STANDARD.md`). Owner popup, verbatim: "Fix the target (Recommended)"; the coordinator changed only that file name (§2 Growth rule exists at `spec/STANDARD.md:196`).
- Census: 309 ids in and out; 233 promoted / 75 active / 1 superseded unchanged; 232 promotion pointers, all resolve after the L-106 fix. L-144 byte-identical (hash fc7d499d…). 13 no-disposition entries collapsed with `(no disposition at promotion)` per the G2 scope-change.
- Checks (coordinator, worktree): `run-learnings-metadata-fixtures.ts` 5 pass, 0 fail; `--ledger` PASS; builder also ran conformance `PASS S11.LEARNINGS`, `gen-index --check` PASS, `check-doc-caps` exit 0. Blob on main equals the worktree's. Coordinator self-review (consequence low/low).
review · T1 · self-review · behaviour:low · governance:low

### 2026-11-21 | progress | T6 (TASK-689) done: s13 passes under the C locale, foreign `repo:path` tokens exempt, both must-FAIL controls retained
- Builder: Codex (gpt-6-astra) in worktree s184-t6, 131,669 tokens. Cause (Tracker): the s13 grep's `.` matched one byte of a 3-byte em-dash under `LC_ALL=C`; fixed with an exact-byte match. TD-319: `check-layers-completeness` strips `repo:path` tokens before the file-token scan, with a remedy hint in the finding.
- Fixtures: `member-foreign-path/` (marked RTK and cleanup pass; unmarked RTK and cleanup FAIL; a missing `lean.md` FAILs beside a marked path) and `member-foreign-real-shape/` (TASK-678's real box with the marker and TASK-677's current box pass; a test asserts they match the done files except the marker); `s13-rows-broken` seeds the NOINFER mark and must FAIL.
- Checks on main after landing (blobs equal the worktree's): `bun test evals/layers-completeness.test.ts` 61 pass, 0 fail; `LC_ALL=C sh evals/run-spec-reader-fixtures.sh` s13-rows-intact PASS, s13-rows-broken PASS (exit 1, named finding), all green; `promote-check` on SPRINT-184 31 pass, 0 fail (G2 note 5: the checker guarding this Plan changed).
- Review: Claude (Sonnet, 61,363 tokens), scoped to the diff: CLEAR, 0 High, 0 Medium; Low: any 2+ character label is exempt (the code comment says so; the check trusts the author's label).
review · T6 · scoped-reviewer · behaviour:material · governance:high

### 2026-11-21 | progress | T5 (TASK-688) and T7 (TASK-690) built, reviewed and merged; their real-input runs follow
- T5: Codex (gpt-6-astra) in worktree s184-t5, 68,871 tokens. One pointer line added first in `embedded.md` § Inline path, naming `references/patterns-id.md` § Host glossary (optional) and saying an absent glossary means the pass continues. Claude review (Sonnet, 59,142 tokens): CLEAR; Lows: the line does not repeat the Indonesian-only gate (the target does), CHANGELOG is T10's.
- T7: Codex (gpt-6-astra) in worktree s184-t7, 144,511 tokens. `census.md` (16 skills: description, body, reference and template tokens; five body targets, copied to the Tracker). council description 944 → 777 B with all 14 triggers and the Do-NOT clause verbatim (owner "Accept ~780"); lean-doc-generator 541 → 415 B, only the "Bundles its own templates…" sentence dropped. Claude review (Sonnet, 62,786 tokens): CLEAR; recomputed four skills' figures and both trigger inventories; manifest lockstep PASS.
- Census finding for T8–T10: the provable body targets are small (1.5% to 9.4% per body, about 3.5 KB in all), because "Safety wins" keeps every-call text in the body.
review · T5 · scoped-reviewer · behaviour:material · governance:high
review · T7 · scoped-reviewer · behaviour:material · governance:high

### 2026-11-21 | progress | T4 (TASK-687) done: 107 low/minor/trivial rows compressed, TECH-DEBT 2,031 → 1,860 lines (−171)
- Builder: Codex (gpt-6-astra) in worktree s184-t4, 155,898 tokens, plus one bounded retry. The coordinator's census found 5 lines containing a frozen box-2 keyword (`route`, `blocked`) removed from history bullets: the G2 condition rule was narrower than box 2, and the box wins. The retry restored them byte-identically; nothing else changed.
- Coordinator census (independent of the builder's): over the original, all 420 lines that are a row header, or carry Summary, Mitigation, Fix direction, `Re-file fresh if`, `route`, `blocked` or `unblock`, are present after; 123 ids; the 13 medium rows are byte-identical (md5 of their blocks equal); closed TD-288/291/293 and the header/aging prose untouched. Rows whose condition line was kept from Impact/Evidence: TD-074, TD-280, TD-304, TD-313 (builder census). Builder checks: `check-doc-caps` exit 0; conformance verdicts for TECH-DEBT identical before/after (41 informational S10.TDAGING, S11.TDDELETE PASS). Coordinator self-review (consequence low/low).
review · T4 · self-review · behaviour:low · governance:low

### 2026-11-21 | progress | T5 (TASK-688) done and T7 (TASK-690) routing proven: 12 coordinator-launched runs, 0.79 of 3.00 USD in the two shares
- T5 R1 (glossary-override folder, 0.1639 USD): the run Globbed for the host context, Grepped `## Domain Glossary` in the folder's `.claude/CONTEXT.md` and wrote "di-scan … dry run dijadwalkan Rabu", no `rehearsal`/`gladi`. R2 (no context, 0.1551): completed, no `UNAVAILABLE`, kept the catalog's "rehearsal". Both init events name the live checkout `D:\Project\lean-flow` (2.26.0). The tool-call anchor is a Grep on the file, not a Read; the design's validity rule asks for a tool call that reads the host context, and the Grep result carries the glossary entry. Evidence: `docs/work/evidence/TASK-688/spend.md`.
- T7: council routes (t7-1) and the yes/no case does not (t7-2); lean-doc-generator's "promote" trigger routes (t7-5) and the HOW case does not (t7-4). "Write an ADR" routed on neither arm (0/3 after, 0/2 on the pre-trim export af7508b1), so it is harness behaviour, not a trim regression. Evidence: `docs/work/evidence/TASK-690/spend.md`.
- Owner ruling on the census finding, verbatim: "Run T8 + T10, cancel T9 (Recommended)".
### 2026-11-21 | scope-change | T9/TASK-692 cancelled — T7's census sets the provable orchestrator cut at 385 B (1.5%) under 'Safety wins', not worth a gate-engine trim; owner ruled "Run T8 + T10, cancel T9 (Recommended)". T10/TASK-693's Depends-on T9 is void (a cancelled member is resolved), and its release-lines box names TASK-692, which now ships nothing, so T10 writes no line for it; no Done-when text changes
### 2026-11-21 | scope-change | T9/TASK-692 Layers: prune docs/work/evidence/TASK-692/ — T9 was cancelled before any build, so the evidence folder never exists and the token matches nothing (layers-token-matches-nothing, L-240); no Done-when change

### 2026-11-21 | progress | mid-sprint gate on c80a3860: bun test 643/0, QA-CHECK 243 pass, 8 fail — two coordinator errors fixed, the rest owed by open tasks
- `layers observed`, commit attributable to no task: the coordinator's combined subject `sprint(184) T5 T7:` (f09ce0b6) matches no attribution rule (one Tn per subject). Fixed by rebuilding the three local, unpushed commits after 3cc64db0: f09ce0b6 split into 0e937945 (T5) and 2b7bc4d7 (T7), then e59894d1 → 5b671c93 and c80a3860 → 76eaa57e replayed unchanged; `git diff` against the backup branch `s184-backup-c80a3860` is empty. The spend.md sha references now name the split commits.
- `layers observed`, token matches nothing: cancelled T9's `docs/work/evidence/TASK-692/` (scope-change above, Plan line pruned).
- `review-depth-*-absent` for T2, T8, T10: owed, those tasks are still open. For T9 (cancelled, nothing built) the check has no cancelled-member exemption; the line below records that no review happened because no change exists (TD candidate for close: the check should skip a member in cancel/).
- T7 box 4 legs are not among the 8 FAILs: leg 3 frontmatter, skill-freshness and manifest lockstep pass on c80a3860.
review · T9 · not-built · behaviour:material · governance:high
- Follow-up to the T9 prune: `check-layers-completeness` still reads T9's frozen Done-when, which names `docs/work/evidence/TASK-692/orchestrator.md` and `spend.md`; both now sit on T9's `Cites:` line (cited, never touched), which satisfies it while the Layers token stays pruned.

### 2026-11-21 | progress | T2 (TASK-685) built, reviewed and merged: always-loaded set 12,634 → 10,700 tokens (−15.3%), budget ratcheted to 11,021
- Builder: Codex (gpt-6-astra) in worktree s184-t2, 143,708 tokens, plus one bounded retry. 16 CONTEXT.md lines shortened in place; no rule moved (CLAUDE.md and LEARNINGS unchanged); the five L-105-family paragraphs keep their titles and rules, and the one dedup (line 66) is carried by CLAUDE.md's cross-check bullet. `token-budget.txt`: 12691 → 11021 = ceil(10,700 × 1.03), ratio 2.991 unchanged, reason names TASK-685.
- Review: Claude (Sonnet, 77,577 tokens), scoped to the diff: CLEAR, 0 High; one Medium accepted: line 68 had lost its two concrete destinations (gate sign-off → sprint frontmatter; close-Retro follow-up → backlog). The retry restored them as one clause (10,663 → 10,700 tokens, still ≤ 10,738).
- Checks on main (blobs equal the worktree's): `check-doc-caps` PASS token-budget ~10700 ≤ 11021, CLAUDE.md 79/80, CONTEXT.md 150/150; `check-count-claims` PASS; pointer census (reviewer + builder): every `CONTEXT.md §` target in the repo, 232 promoted and 14 moved LEARNINGS pointers resolve. Box 3's qa-check half waits for the next full gate.
review · T2 · scoped-reviewer · behaviour:low · governance:high
### 2026-11-21 | scope-change | T8/TASK-691 Layers: prune skills/prime/references/ — the build kept prime's every-call text in the body (Safety wins), so no prime reference was created and the token matches nothing (L-240); no Done-when change

### 2026-11-21 | progress | T8 (TASK-691) built, reviewed, merged and proven: bodies 35,370 → 32,969 bytes, before/after runs match
- Builder: Codex (gpt-6-astra) in worktree s184-t8, 147,668 tokens, plus one bounded retry. task-decomposer 14,273 → 13,707 (duplicate task-file shape deleted; `references/task-file.md` carries every field), prime 10,557 → 9,764 (reworded in place, every-call text kept), triage 10,540 → 9,498 (rejection procedure moved verbatim to `references/out-of-scope.md`). Inventories cover 110 + 108 + 98 original lines.
- Review: Claude (Sonnet, 65,998 tokens): CLEAR, 0 High; one Medium accepted: triage's pointer sat under a late heading, not at steps 1 and 7 that trigger the moved text (fails the Negative box as written). The retry put a pointer at both branch points and fixed a dangling colon.
- Runs (`docs/work/evidence/TASK-691/spend.md`): 14 runs, 1.4220 of 3.50 USD. The first four before-runs were void: the headless permission default blocked `Skill`, so the model worked by hand; rerun with `--allowedTools Skill Read Glob Grep` on both arms. A fresh comparer found R2–R4 the same; R1's first after-run skipped the context read, two reruns read it, and the trim did not touch that instruction, so it is noise.
- Checks on main: layout-fixtures 41/0, work-store-fixtures 21/0 (builder and coordinator), doc caps PASS. Box 4's qa-check half waits for the full gate.
review · T8 · scoped-reviewer · behaviour:material · governance:high

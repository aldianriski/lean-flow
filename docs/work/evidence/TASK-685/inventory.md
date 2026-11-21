# TASK-685 — always-loaded rule inventory

Build base: `ceea1714d71230b3c36c5106513f4548d7779703`; measured 2026-11-21. Scope: approved G2 T2, §2.2 and Amendment A2 (Safety wins). No rule moves; LEARNINGS, CLAUDE, skill references, ownership headers, roster and all headings remain unchanged. The only duplicate operational clauses replaced by a pointer are in CONTEXT line 66, and their home remains always-loaded.

## Measurements and acceptance evidence

| Measure | Before | After | Requirement |
|---|---:|---:|---|
| Gate-printed estimated tokens | 12,634 | 10,700 | ≤ floor(12,634 × 0.85) = 10,738; PASS (15.31% cut) |
| Combined CRLF-normalised UTF-8 bytes | 37,786 | 32,002 | 5,784 fewer bytes |
| CLAUDE lines | 79 | 79 | ≤ 80 |
| CONTEXT lines | 150 | 150 | ≤ 150 |
| CONTEXT dense lines (>400 characters) | 13 | 8 | ≤ adopted baseline 16 |
| Token budget | 12,691 | 11,021 | ceil(10,700 × 1.03); ratio 2.991 unchanged |

The token denominator is the gate's start-of-build print, not the old budget or prose-density's separate 4-bytes/token approximation. The latter reports raw checkout bytes (32,231 after); the cap check normalises CRLF. The ratchet changes exactly one data line, preserves every comment, names TASK-685, and adopts at `2026-11-21+ceea1714` (the build base).

| Frozen Done-when box | Evidence / limit |
|---|---|
| 1 — token reduction and caps | PASS: the gate prints 10,700 and both cap PASS lines below. |
| 2 — ratchet | PASS: one data-row diff; independent arithmetic gives 11,021; adopted date/base and TASK-685 reason checked. |
| 3 — inventory, ids, qa-check | Inventory and id resolution PASS. Full qa-check is NOT established: worker prohibits all git writes, including fixture builders; standalone density reports four pre-existing out-of-Layers failures below. This box remains pending coordinator QA/ruling. |
| 4 — pointer census | PASS: 232 promoted + 14 moved pointers, two CLAUDE § pointers, zero unresolved before and after. Ten pointers reach CONTEXT (nine fully qualified plus one bare CONTEXT.md), rather than the design's nine. |
| 5 — negative | Self-review: every operational action stays loaded; moved rows = 0. Probe rejects a missing file, renamed Gates heading and missing named guard paragraph. Final safety classification is a judgment review, not mechanically proven by a count. |

## Line inventory

Every row quotes one complete changed physical line in `.claude/CONTEXT.md` at the build base; the after quote is the final working-tree line. All 16 lines are kept and shortened in place (11 universal, 5 branch-specific); 0 moved rules and 0 deleted rules. Incident narratives are shortened with their rule, not relocated. Coverage was checked both ways against the base lines and `git diff -U0`: 16 removed lines / 16 inventory rows; each quoted old line matches the base and each new line matches the artifact.

| Before line | Class | Disposition / retained force | Before (verbatim) | After (verbatim) |
|---|---|---|---|---|
| 60 | universal | Kept: timing and same-commit disarming checks; incident examples shortened. | **A guard is placed in time, not only in text** — for any rule that guards something, ask *when does this fire relative to the thing it guards, and what else changes in that same commit?* One that fires after its subject froze (G1 splitting an `L` the Plan already locked), or that a change in its own commit disarms (`status: closed` silencing the sprint checks), is an absent guard wearing the shape of a present one; review reads what a rule says, never when it runs (L-105 ×2 — L-099's temporal sibling). | **A guard is placed in time, not only in text** — ask when it fires relative to its subject and what else changes in the same commit. A guard firing after its subject freezes, or disarmed by its own commit, is absent; check timing as well as wording (L-105 · L-099). |
| 62 | universal | Kept: promote/G2 timing, all three decision types and the per-task counterfactual check; incident narrative shortened. No rule delegated to a skill reference. | **A criterion is reachable only after the decisions it rests on are taken** — L-105's criterion-side sibling: that rule asks when a *guard* fires, this one asks when an *acceptance* becomes checkable. The Plan freezes at **promote**, but the run mode, dispatch shape and routing are ruled at **G2**, so a criterion resting on one of those is unreachable before anyone notices — SPRINT-060 T5 required *"a real unattended run that stops mid-Plan"*, and G2's correct ruling of *interactive* (four of five tasks were HITL) silently foreclosed the only vehicle; by the time T5 was reached any run would **park** it rather than leave it `unattempted`, which is a different state and not the one the criterion tested. Neither gate caught it, because both read a criterion for *clarity* and never for what it rests on that is not yet decided. At G2, per task: *does this acceptance depend on anything I am deciding right now — and if I decide it the other way, is the criterion still checkable?* (L-111 ×2 — the second sighting refused a night run at pre-flight rather than parking 2 of 2.) | **A criterion is reachable only after the decisions it rests on are taken** — the Plan freezes at **promote**; run mode, dispatch shape and routing are ruled at **G2**. At G2, ask per task whether acceptance depends on a decision being made now and stays checkable under the other choice (L-111). |
| 64 | universal | Kept: self-matching hazard, positional and temporal selection, fixture-name prohibition and single home for counts; repeated incidents shortened. | **A guard is matched by shape, not by substring** — L-105's spatial sibling one level down. A keyword search standing in for a structural claim fails *green*, and a markdown corpus is **self-describing**: logs quote formats, docs carry worked examples, fixtures are named after what they test — so any grep over it eventually matches prose *about* the search (a reaper read its own format documentation as this run's output and dropped a task; a must-FAIL fixture passed because its slug was `unrevisited`). A false positive on a substring is a false negative on the contract. Anchor the match to a **position** (a line starting `Tn · <state> · `), scope it to the **window that can legitimately contain a hit** (what *this run* appended, not the whole append-only file), and never name a fixture after a token its own assertion greps for. **The newest sighting is a verbatim repeat of a recorded one** — a `TECH-DEBT.md` census counting the ledger's own *legend line* as a resolved row, the same file and the same string as an earlier entry, with this rule loaded; caught only because open+resolved overshot the total by one. Sightings are tallied in `docs/LEARNINGS.md` (L-108), not here: a count copied into a second place drifts from the one it copied, which is how this line came to claim three against a ledger recording six. | **A guard is matched by shape, not by substring** — markdown describes itself: quoted formats, examples and fixture names can match without satisfying the contract. Anchor to a **position** (e.g. `Tn · <state> · ` at line start) and the **window that can legitimately contain a hit** (this run's append, not the whole log); never name a fixture after a token its assertion greps for. Sightings and counts belong in `docs/LEARNINGS.md` (L-108), never copied here. |
| 66 | universal | Kept: title plus pointer to the always-loaded cross-check rule; lane-range/coordinator exception stays here. Duplicate operational clauses resolve to CLAUDE lines 74-77, quoted below. | **A value written into a frozen artifact is a query result** — L-105's sibling at *authoring* time. An assumption, a DoD, an acceptance threshold: each is read later by someone who cannot re-derive it, against a Plan nobody can amend cheaply, so it earns the same second query as a live search — once when written, again at execution. Two grains, one failure: a **figure** (`~121` sites into an assumption; the real count was 39, making the DoD unsatisfiable the moment it froze) and a **structural claim about another document** ("the checker reads §14's tables", copied into three artifacts; §14 is the legend and holds no per-rule table). The cross-check clause does not fire here on its own because *authoring feels like planning, not querying* — which is why the durable form names the artifact kinds rather than the activity (L-130 ×2 · L-136). **A third grain: an identifier for a new row** (`TD-NNN` · `TASK-NNN` · `L-NNN`) — derive the maximum in use, never increment the one you remember. Nothing rejects a duplicate id, and a second row carrying an existing number reads as an edit to the first rather than as a collision (L-143 ×2). Single-tree derivation is unchanged; in a multi-lane run a lane derives inside its booked range, and only the coordinator reads the named lane worktrees, past the `.claude/worktrees/` exclusion (→ `orchestrator/references/coordinator.md`). | **A value written into a frozen artifact is a query result** — figures, structural claims, assumptions, DoD, thresholds and new row ids: apply `.claude/CLAUDE.md` § Behavioral Guidelines, cross-check bullet (L-130 · L-136 · L-143). In multi-lane runs, each lane derives ids inside its booked range; only the coordinator reads named lane worktrees past the `.claude/worktrees/` exclusion (→ `orchestrator/references/coordinator.md`). |
| 68 | universal | Kept: reader/destination test at authoring time, consumer-artifact requirement and explicit sprint-frontmatter/backlog destinations; four incident narratives shortened. | **A decision recorded where its reader cannot reach it is not a decision** — the L-105 family's *destination* sibling: those rules ask when a guard fires and whether a written value was ever queried; this one asks **who reads this to act on it, and can they reach where I am about to write it.** A ruling filed outside the artifact its consumer parses leaves the system behaving exactly as if it had never been taken — and it fails *silently*, because the author saw themselves decide. Four sightings, four different consumers: eleven `scope-out` dispositions in `docs/research/` where the engine dispatches on the spec's Mark column, so every adopter's report named them as checks the standard owes and has not written (ADR-028); a gate sign-off in the launching transcript rather than the sprint frontmatter, which an unattended run reads and nothing else (L-099); a collapse ruling in a commit message rather than the entry it governs; and close-Retro **follow-ups** named only in a sprint's own summary rather than `TODO.md` — the Backlog is what `promote` reads, so `TASK-254/255/256` were invisible to every promote that followed and were satisfied later by coincidence of scope, not by routing. **The test at authoring time is one question, and it is about the reader, never the record** (L-151 ×4). | **A decision recorded where its reader cannot reach it is not a decision** — at authoring time ask who reads it to act, and whether they can reach this destination. Write the ruling in the artifact its consumer parses (a gate sign-off → the sprint frontmatter `gates_signed:`; a close-Retro follow-up → `docs/work/backlog/`); an unreachable ruling silently has no effect (L-151). |
| 70 | branch-specific | Kept in place: unattended charter, declaration, missing-channel facts and all refusal conditions. | **Unattended** (headless night-run) — charter **execute-only**: run a promoted Plan, decide nothing. **Declared** at trigger (`sprint-bulk unattended`), never inferred. **Absence ≠ consent**: headless has *no ask channel* (`AskUserQuestion` unregistered; `dontAsk` auto-denies) — missing channel/denial/timeout = BLOCK, never a default-yes, and never reason the answer out yourself. | **Unattended** (headless night-run) — **execute-only**: run a promoted Plan, decide nothing. Declare at trigger (`sprint-bulk unattended`), never infer. **Absence ≠ consent**: no ask channel (`AskUserQuestion` unregistered; `dontAsk` auto-denies); missing channel/denial/timeout = BLOCK, never default-yes or self-reasoned approval. |
| 71 | branch-specific | Kept in place: parking order, AFK conjunction, frozen-subject pre-sign condition and existing pointer. | A HITL step is **parked** (record → continue disjoint AFK → clean halt via `/handoff`), never asked, decided, or worked around; boundary derives from **AFK-safe = additive + reversible + already-approved-in-scope**; a gate is pre-signable only if its subject is frozen at pre-flight. Table + protocol → `orchestrator/references/night-run.md` Part 0. | A HITL step is **parked**: record → continue disjoint AFK → clean halt via `/handoff`; never ask, decide or work around it. **AFK-safe = additive + reversible + already-approved-in-scope**; pre-sign a gate only if its subject is frozen at pre-flight. Table + protocol → `orchestrator/references/night-run.md` Part 0. |
| 72 | branch-specific | Kept in place: every exit, launcher ownership, exact rollup header and unattempted population; rationale shortened. | **Every exit emits a rollup** — `run · N of M DoD ticked` + a line per non-green (incl. `unattempted`), written by the launcher, not asked of the run: a run can end mid-Plan and exit `success`, and a bookkeeping step nothing depends on is the first an agent drops (ADR-016). | **Every exit emits a rollup** — launcher writes `run · N of M DoD ticked` + a line per non-green (incl. `unattempted`), never relies on the run: a mid-Plan exit can report `success` (ADR-016). |
| 73 | branch-specific | Kept in place: compound instruction, full ordering, green pre-flight, no bypass and timing rationale. | **Prepare, then launch** — "run a night run for `<X>`" is compound: the *interactive* session runs feed → promote → pre-flight (gates and all) and fires the trigger only once pre-flight is green. A mode keyword never bypasses the feed pipeline, and the run is never spawned against an unpromoted Plan — step 0's guard sits inside the spawned process, too late to ask (Part 1a). | **Prepare, then launch** — "run a night run for `<X>`" means interactive feed → promote → pre-flight (including gates) → trigger only when green. No mode keyword bypasses feed; never spawn on an unpromoted Plan. The spawned step-0 guard is too late to ask (Part 1a). |
| 74 | universal | Kept: general integration-point scrutiny, finish commands and shared landing paths; repeated comparison shortened. | **Scope the terminal step hardest** — an autonomous run's **shared landing path** (merge-back · the clean-halt `/handoff`) is the one point every unit funnels through, so a denial *there* costs the whole run, however many units succeeded, while a per-task denial costs one task. Pre-flight covers the commands the run needs to **finish**, not only the ones its tasks need to work; generally, a single integration point earns the scrutiny normally spent on the fan-out (L-072, ×2). | **Scope the terminal step hardest** — pre-flight checks commands needed to **finish**, including shared merge-back and clean-halt `/handoff`. A denial there costs the whole run; scrutinise a single integration point as closely as the fan-out (L-072). |
| 102 | branch-specific | Kept in place: epic identity, admission order, creator/consumer boundary, lifecycle and all coverage conditions. | - **`docs/epic/EPIC-NNN-<slug>.md`** (+ lazy `INDEX.md`) = a **multi-sprint outcome** with its own decision set — `EPIC.md.template`; 200 soft. Admission test in order: outcome not nameable → fog (`--fog`) · nameable but fits one sprint → a sprint · otherwise an epic. Created by `/lean-doc-generator epic`, **consumed** by `/task-decomposer --epic` (which never creates one). `promote` stamps `epic:` on a member sprint and appends its row; `close` completes that row and closes the epic only when every § Closed-when condition is `[x]` — a member sprint closing is not an epic closing. **Coverage (STANDARD §2):** an `active` epic's every open Closed-when line ends `→ TASK-NNN[, …]` (an open task) or `→ next slice: <name>`; `promote` refuses over an uncovered one without an owner override, `/triage` + `/prime` report them; `proposed` is exempt. | - **`docs/epic/EPIC-NNN-<slug>.md`** (+ lazy `INDEX.md`): multi-sprint outcome + decisions, `EPIC.md.template`, 200 soft. Admission: unnameable → fog (`--fog`); fits one sprint → sprint; otherwise epic. `/lean-doc-generator epic` creates; `/task-decomposer --epic` only consumes. `promote` stamps member `epic:` + appends its row; `close` completes the row, closing the epic only when every § Closed-when condition is `[x]`. **Coverage (STANDARD §2):** every open condition of an `active` epic ends `→ TASK-NNN[, …]` (open task) or `→ next slice: <name>`; `promote` refuses uncovered conditions without owner override, `/triage` + `/prime` report; `proposed` exempt. |
| 104 | universal | Kept: sprint/Log paths, templates, cap, full section list, v2 freeze, append-only contract, scope-change timing/content and non-recursive-glob rationale. | - **`docs/sprint/SPRINT-NNN-<slug>.md`** = the active sprint (`SPRINT.md.template`), **400 hard**: Theme · Scope · Plan (Tn meta only; on a v2 store each member's `## Done when` is its DoD, `plan_commit` the freeze — ADR-047) · Owner-action · Decisions→ADR · Assumptions · Files Changed · **Retro** (§10). Its **Execution Log** is an *uncapped sibling* — `docs/sprint/logs/SPRINT-NNN-<slug>.md` (`sprint-log.md.template`, created at promote with the `promote` entry first — earlier than STANDARD §9's "first entry" minimum, which it satisfies; **ADR-014**): append-only, plan frozen at promote — a mid-sprint scope shift logs a `scope-change` **there** (what broke · impact · re-confirm G2) before the Plan is edited. The `logs/` subdirectory is load-bearing — the sprint-file checks glob `docs/sprint/SPRINT-*.md` non-recursively, so a same-dir `-log.md` suffix would be capped and schema-checked as a Plan. | - **`docs/sprint/SPRINT-NNN-<slug>.md`**: active sprint (`SPRINT.md.template`), **400 hard**: Theme · Scope · Plan (Tn meta only; v2 member `## Done when` = DoD, `plan_commit` = freeze, ADR-047) · Owner-action · Decisions→ADR · Assumptions · Files Changed · **Retro** (§10). **Execution Log**: uncapped, append-only `docs/sprint/logs/SPRINT-NNN-<slug>.md` (`sprint-log.md.template`, created at promote with `promote` first; satisfies STANDARD §9, ADR-014). Plan freezes at promote; before editing it, log `scope-change` there (what broke · impact · re-confirm G2). Keep `logs/`: non-recursive `docs/sprint/SPRINT-*.md` checks would cap/schema-check a same-dir `-log.md` as a Plan. |
| 106 | universal | Kept: exact title, ordered attribution alternatives, last-suffix condition, failure, required task/COORD subjects and task-specific Layers coverage; two incident accounts shortened. | - **A sprint commit's SUBJECT is how leg 15 attributes it, so the subject is load-bearing, not prose.** `check-layers-observed` maps each commit in `plan_commit..HEAD` to a task via, in order: a `Task:` trailer · `sprint(NNN) Tn:` · `merge(...): Tn` · a trailing `(SPRINT-NNN Tn)` (the LAST one, if several) · `sprint(NNN) Tn <qualifier>:` · bare `sprint(NNN):` = COORD · all-governance-files = GOVERNANCE. **Anything else is `UNATTRIBUTED` and the gate reddens.** So work done inside a sprint commits as `sprint(NNN) Tn: …` (or carries a `Task:` trailer); `research:` / `todo:` / `fix(...)` prefixes are for commits made *outside* an active sprint's range. And the files in that commit must be covered by **that task's** `Layers:` — a mixed-concern commit that touches another task's files fails even with a correct subject. SPRINT-103 hit both halves (L-151: the convention was real, enforced, and written nowhere a committer reads). **A coordinator write is never a task's commit:** a status move the task's `Layers:` do not declare (the `done/` move is the usual one), a Log or sprint-file edit, or a shared file commits as bare `sprint(NNN):`, which is attributed to the coordinator. Two closes failed on a coordinator write filed under `Tn:` (L-238 ×2). | - **A sprint commit's SUBJECT is how leg 15 attributes it, so the subject is load-bearing, not prose.** `check-layers-observed` maps `plan_commit..HEAD` in order: `Task:` trailer · `sprint(NNN) Tn:` · `merge(...): Tn` · trailing `(SPRINT-NNN Tn)` (LAST if several) · `sprint(NNN) Tn <qualifier>:` · bare `sprint(NNN):` = COORD · all-governance-files = GOVERNANCE; else **UNATTRIBUTED → FAIL**. Inside a sprint use `sprint(NNN) Tn: …` or `Task:`; `research:` / `todo:` / `fix(...)` belong outside its range. Every file must fit **that task's** `Layers:` (L-151). **A coordinator write is never a task's commit:** status moves undeclared in its Layers, Log/sprint edits and shared files use bare `sprint(NNN):` (L-238). |
| 107 | universal | Kept: required QA_FULL command, omitted populations and off-host route; former wiring incident shortened. | - **Promote and close run the OPT-IN profile** — `QA_FULL=1 sh scripts/qa-check.sh`, not the bare gate: the slow opt-in harnesses (git-repo builders, the frozen differential-parity pairs) run only there, so a green bare gate says nothing about them. This line is where that becomes reachable — the mandate once lived only in an ADR while **nothing in any procedure read it**, which is L-020's shipping-≠-wiring. Off-host: `bun --no-env-file scripts/gate-remote.ts` (`LF_GATE_HOST`/`KEY`/`DIR`) runs it remotely. | - **Promote and close run the OPT-IN profile** — `QA_FULL=1 sh scripts/qa-check.sh`; the bare gate omits slow git-repo builders and frozen differential-parity pairs. Off-host: `bun --no-env-file scripts/gate-remote.ts` (`LF_GATE_HOST`/`KEY`/`DIR`). |
| 108 | universal | Kept: live declaration, correction ordering, actual Plan line, accepted path shapes and glob prohibition. | - A task's **`Layers:` is a live declaration, corrected per task — not a frozen prediction to defend.** It cannot name the files implementation invents, so a mid-sprint edit is expected: log it, then edit **the Plan line itself, as an exact path or a `dir/` token, never a glob**, because that line is all the checkers read (L-100 · L-229). | - A task's **`Layers:` is a live declaration, corrected per task — not a frozen prediction to defend.** For a mid-sprint correction, log it, then edit **the Plan line itself: exact path or `dir/` token, never a glob**; that is what checkers read (L-100 · L-229). |
| 109 | universal | Kept: optional stream shape, overlap restriction, worktree/queue routing, intra-tree staging, lane/session boundaries and rotation ceiling. | - **Streams** (optional) — one active sprint per stream (`stream:` frontmatter); cross-stream file overlap → coordinate, never parallel-build. **Disjoint tasks may parallel-build in isolated worktrees** (one `Agent(isolation:"worktree")` per task + coordinator merge-back queue → `orchestrator/references/dispatch.md`); L-042's per-hunk staging rule (`git add -p` + verify `git diff --cached`, never a plain `git add <shared>` over another's WIP) binds **intra-tree** (one shared working tree or the coordinator staging merge resolutions). Multi-stream or multi-repo work may run one coordinator plus one lane session per stream. Within a stream, one session runs its workers and never relays. Split sessions by stream, never by step. → `orchestrator/references/coordinator.md`, incl. § Lane rotation (ceiling 200k). Single-stream omits `stream:`. | - **Streams** (optional): one active sprint per `stream:`; omit for single-stream. Cross-stream file overlap → coordinate, never parallel-build. Disjoint tasks may parallel-build in isolated worktrees (`Agent(isolation:"worktree")` per task + coordinator merge-back queue → `orchestrator/references/dispatch.md`). **Intra-tree**, including coordinator merge resolutions: `git add -p` + verify `git diff --cached`, never `git add <shared>` over another's WIP (L-042). Multi-stream/repo: one coordinator + one lane session per stream; within a stream one session runs workers, never relays. Split by stream, never step. → `orchestrator/references/coordinator.md` § Lane rotation (ceiling 200k). |

## Always-loaded duplicate proof and reachability comparison

CONTEXT line 66 keeps its title and a one-line pointer to CLAUDE § Behavioral Guidelines; its lane-range and coordinator exception remain in the same paragraph. The full original and replacement are quoted in the inventory. These surviving CLAUDE lines carry the deduplicated actions verbatim:

> - **Cross-check a query before acting on it** — a search/count/grep whose result you act on *immediately* gets a **second query that must agree**, run before the conclusion: a count reconciled against a census, a seeded gap it must detect, or an inverse summing to the known total.
>   The second must **vary the SELECTION rule, not the direction of the count** — would both halves break identically if the selector were wrong? A negative control proves only the rows it reached, and a capped, `head`-cut or single-wording output is neither the population nor an absence (L-198 · L-315).
>   A value entering a *frozen artifact* (assumption · DoD · acceptance threshold), whether a **figure** or a **structural claim about another document**, is a query result: check it when written and again at execution (L-130 · L-136).
>   So is a **new row id** (`TD-NNN` · `TASK-NNN` · `L-NNN`): **derive the maximum in use, never increment the one you remember** (L-143), **with `.claude/worktrees/` excluded**; treat a suspiciously high maximum as contamination, not a row (L-170). Family → CONTEXT.md § Gates (L-105 · L-108). → `docs/LEARNINGS.md` § Durable rules › cross-check

The G2 Reachability box, read for comparison as Amendment A2 requires, says:

> - [ ] **Reachability — for every mechanical `Verify:`, four questions, not one.** **EXISTS** (is the method actually there?) · **RUNS** (in the target environment?) · **REACHES** (does its scope touch the artifact or behaviour the criterion claims?) · **PROVES** (if it PASSes, is the criterion true?). *A check that never examines the target is not verification.* Naming a method is the half that gets checked today and the half that fails safely; an **unreachable** criterion reads exactly like a satisfied one — it goes green while saying nothing about its subject (L-136 ×4: a `Verify:` naming `check-doc-caps.sh` for `docs/qa/` files, where §2 states no cap for `docs/qa/`, so it could neither pass nor fail them and ran `66 PASS, 0 FAIL`). **A method whose scope excludes the target is recorded as not-valid-proof, not accepted.** Where no mechanical method reaches it, the criterion stays a **judgment tick and says so** — that is legitimate, and inventing a checker merely to make a criterion look mechanical is the failure, not the fix. Evidence for it comes from the repo's existing runners first; a throwaway probe script lives **inside the working tree** and is deleted before the report, never in a system temp dir (a write outside the working tree needs a permission an unattended run does not have). EXISTS and REACHES are pre-screened by a reachability checker where the host has one (lean-flow's own: `scripts/lib/check-verify-reaches.ts`); RUNS and PROVES are yours; a `Negative:` box is a criterion like any other, with or without `Verify:`, and its verification names the test that would fail if that behaviour broke; no such test → a judgment tick that says so

No criterion-reachability action was delegated to that skill: CONTEXT line 62 still states promote/G2 timing, all three decision types and the per-task alternate-choice question. Every guard-family title and every existing heading survives; the commit-subject title and ordered attribution rules remain loaded. No empty title stub was introduced.

## Census (before = after)

The scratch resolver selected actual pointer bullets/headings, not the legend example or narrative mentions. It resolved primary pointer targets by exact tracked path or canonical non-fixture basename, § headings (including shortened heading names), Durable-rules subheadings and merged-into ids. An independent section-based census found 233 promoted entries minus the one held entry (L-144) = 232 promotion pointers, plus 14 moved pointers in Durable rules. The two selectors agree on all 246. All resolved before; the after results are identical. The table groups identical destinations but lists every source pointer line.

| Kind | Resolved file / heading / id home | LEARNINGS source lines | Before / after |
|---|---|---|---|
| moved | docs/LEARNINGS.md · Durable rules moved out of CLAUDE.md (TASK-384 · SPRINT-112) · spec-only | 45 | PASS / PASS |
| moved | docs/LEARNINGS.md · Durable rules moved out of CLAUDE.md (TASK-384 · SPRINT-112) · edit-safety | 51 | PASS / PASS |
| moved | docs/LEARNINGS.md · Durable rules moved out of CLAUDE.md (TASK-384 · SPRINT-112) · plugin-cache | 65 | PASS / PASS |
| moved | docs/LEARNINGS.md · Durable rules moved out of CLAUDE.md (TASK-384 · SPRINT-112) · consumer-side | 71 | PASS / PASS |
| moved | docs/LEARNINGS.md · Durable rules moved out of CLAUDE.md (TASK-384 · SPRINT-112) · wiring | 82 | PASS / PASS |
| moved | docs/LEARNINGS.md · Durable rules moved out of CLAUDE.md (TASK-384 · SPRINT-112) · roster | 88 | PASS / PASS |
| moved | docs/LEARNINGS.md · Durable rules moved out of CLAUDE.md (TASK-384 · SPRINT-112) · flow-blocking-question | 100 | PASS / PASS |
| moved | docs/LEARNINGS.md · Durable rules moved out of CLAUDE.md (TASK-384 · SPRINT-112) · too-simple | 106 | PASS / PASS |
| moved | docs/LEARNINGS.md · Durable rules moved out of CLAUDE.md (TASK-384 · SPRINT-112) · manifest-lockstep | 112 | PASS / PASS |
| moved | docs/LEARNINGS.md · Durable rules moved out of CLAUDE.md (TASK-384 · SPRINT-112) · wiring-check | 118 | PASS / PASS |
| moved | docs/LEARNINGS.md · Durable rules moved out of CLAUDE.md (TASK-384 · SPRINT-112) · cross-check | 124 | PASS / PASS |
| moved | docs/LEARNINGS.md · Durable rules moved out of CLAUDE.md (TASK-384 · SPRINT-112) · host-tooling | 130, 134 | PASS / PASS |
| moved | docs/LEARNINGS.md · Durable rules moved out of CLAUDE.md (TASK-384 · SPRINT-112) · ab-ceiling | 140 | PASS / PASS |
| promoted | docs/LEARNINGS.md · Durable rules moved out of CLAUDE.md (TASK-384 · SPRINT-112) · ab-ceiling | 158 | PASS / PASS |
| promoted | docs/LEARNINGS.md · Durable rules moved out of CLAUDE.md (TASK-384 · SPRINT-112) · host-tooling | 183, 353 | PASS / PASS |
| promoted | skills/lean-doc-generator/templates/LEARNINGS.md.template | 245 | PASS / PASS |
| promoted | .claude/CLAUDE.md · Behavioral Guidelines · docs/LEARNINGS.md · Durable rules moved out of CLAUDE.md (TASK-384 · SPRINT-112) · cross-check | 280 | PASS / PASS |
| promoted | docs/epic/archive/EPIC-024-agent-roles-one-by-one.md · docs/work/done/TASK-621-rerun-the-small-coordinator-bundle-with-prime-reading-gates.md | 449 | PASS / PASS |
| promoted | docs/LEARNINGS.md · Durable rules moved out of CLAUDE.md (TASK-384 · SPRINT-112) · consumer-side | 482, 810, 867 | PASS / PASS |
| promoted | docs/LEARNINGS.md · Durable rules moved out of CLAUDE.md (TASK-384 · SPRINT-112) · edit-safety | 666, 674, 706, 713, 737, 745, 794, 915 | PASS / PASS |
| promoted | skills/orchestrator/references/dispatch.md · skills/orchestrator/references/review-scoping.md · skills/orchestrator/references/builder-check.md · skills/task-decomposer/SKILL.md · skills/council/references/prompts.md | 824 | PASS / PASS |
| promoted | TECH-DEBT.md · Tech Debt | 860 | PASS / PASS |
| promoted | skills/orchestrator/references/builder-check.md · Two rules for the design itself | 875, 896 | PASS / PASS |
| promoted | .claude/CONTEXT.md · Sprint model | 889, 1745 | PASS / PASS |
| promoted | docs/LEARNINGS.md | 910, 924, 930, 936, 942, 954, 960, 966, 972, 978, 994, 1000, 1006, 1058, 1069, 1075, 1081, 1087, 1093, 1099, 1111, 1117, 1123, 1129, 1135, 1141, 1146, 1151, 1157, 1163, 1172, 1178, 1184, 1190, 1195, 1200, 1208, 1216, 1224, 1232, 1240, 1279, 1286, 1293, 1301, 1306, 1311, 1316, 1321, 1326, 1331, 1336, 1341, 1350, 1387, 1393, 1399, 1405, 1411 | PASS / PASS |
| promoted | skills/orchestrator/references/dispatch.md · Members by reference (what sprint-bulk reads, ticks and moves) | 981 | PASS / PASS |
| promoted | skills/orchestrator/SKILL.md | 1009 | PASS / PASS |
| promoted | skills/orchestrator/references/dispatch.md · Worktree dispatch protocol (parallel fleet) | 1024, 1296 | PASS / PASS |
| promoted | skills/orchestrator/references/dispatch.md · Merge-back queue (coordinator-only) | 1033, 2059 | PASS / PASS |
| promoted | .claude/CLAUDE.md · docs/adr/ADR-053-the-freeze-re-arms-widened-to-governance.md · Decision | 1049 | PASS / PASS |
| promoted | .claude/CONTEXT.md · Gates · docs/LEARNINGS.md | 1251, 1683 | PASS / PASS |
| promoted | .claude/CLAUDE.md · Anti-Patterns | 1256, 1288, 1517, 1542, 1638 | PASS / PASS |
| promoted | .claude/CLAUDE.md · Definition of Done | 1344 | PASS / PASS |
| promoted | .claude/CLAUDE.md · Behavioral Guidelines | 1353, 1356, 1360, 1414, 1418, 1422, 1427, 1432, 1437, 1442, 1447, 1473, 1478, 1483, 1488, 1493, 1497, 1522, 1527, 1532, 1537, 1546, 1550, 1556, 1561, 1566, 1571, 1576, 1592, 1598, 1603, 1608, 1613, 1618, 1623, 1633, 1643, 1648, 1653, 1658, 1663, 1668, 1673, 1679, 1688, 1693, 1725, 1730, 1735, 1740, 1752, 1757, 1769, 1774, 1785, 1800, 1805, 1836, 1849, 1854, 1859, 1864, 1869, 1874, 1879, 1884, 1889, 1894, 1899, 1909, 1914, 1919, 1924, 1934, 1939, 1944, 1949, 1954, 1959, 1986, 1991, 1996, 2001, 2006, 2011, 2016, 2027, 2032, 2037, 2064, 2087, 2092, 2112, 2117, 2122, 2127, 2164, 2169, 2174, 2179, 2184 | PASS / PASS |
| promoted | .claude/CLAUDE.md | 1364, 1380, 1929, 1964, 1970, 1975, 1981, 2021, 2042, 2075, 2097, 2107, 2132, 2138, 2152 | PASS / PASS |
| promoted | .claude/CONTEXT.md · Gates | 1452, 1698, 1719, 1904 | PASS / PASS |
| promoted | .claude/CLAUDE.md · Behavioral Guidelines · .claude/CONTEXT.md · Gates | 1510 | PASS / PASS |
| promoted | skills/orchestrator/references/review-scoping.md · Scope every pass to the diff | 1628 | PASS / PASS |
| promoted | TECH-DEBT.md · docs/LEARNINGS.md | 1705 | PASS / PASS |
| promoted | spec/STANDARD.md · §2 — Core Files (TemiDev repo-structure standard — ADR-012) | 1713 | PASS / PASS |
| promoted | spec/STANDARD.md · §10 — Continuous learning governance · A number inside a criterion is remembered, not measured. | 1762 | PASS / PASS |
| promoted | .claude/CONTEXT.md · Continuous learning governance | 1779 | PASS / PASS |
| promoted | spec/STANDARD.md · §10 — Continuous learning governance · Placement test — the three homes are not interchangeable. | 1790 | PASS / PASS |
| promoted | spec/STANDARD.md · §10 — Continuous learning governance · A `Mitigation:` line is a hypothesis, not a plan. | 1795 | PASS / PASS |
| promoted | skills/orchestrator/SKILL.md · Red flags | 1810 | PASS / PASS |
| promoted | skills/diagnose/SKILL.md · Red flags | 1815 | PASS / PASS |
| promoted | skills/orchestrator/references/night-run.md | 1822 | PASS / PASS |
| promoted | .claude/CLAUDE.md · docs/LEARNINGS.md | 2070, 2102 | PASS / PASS |
| promoted | .claude/CLAUDE.md · docs/sprint/archive/SPRINT-009-external-face-ssot-diet.md § Plan T1 + Retro (resolved) | 2147 | PASS / PASS |
| promoted | skills/orchestrator/SKILL.md · Review | 2157 | PASS / PASS |

CONTEXT-directed pointers retain their named paragraph as well as their section:

| LEARNINGS line | Target (verbatim) | Before / after |
|---|---|---|
| 889 | `.claude/CONTEXT.md` § Sprint model, the commit-subject attribution bullet** | PASS / PASS |
| 1251 | merged into L-111** (`.claude/CONTEXT.md` § Gates: "a criterion is reachable only after the decisions it rests on are taken") | PASS / PASS |
| 1452 | `.claude/CONTEXT.md` § Gates** | PASS / PASS |
| 1510 | .claude/CLAUDE.md § Behavioral Guidelines + CONTEXT.md § Gates | PASS / PASS |
| 1683 | .claude/CONTEXT.md § Gates (the criterion-reachability paragraph, beside L-105) | PASS / PASS |
| 1698 | `.claude/CONTEXT.md` § Gates ("A guard is matched by shape, not by substring")** | PASS / PASS |
| 1719 | `.claude/CONTEXT.md` § Gates** | PASS / PASS |
| 1745 | `.claude/CONTEXT.md` § Sprint model** | PASS / PASS |
| 1779 | `.claude/CONTEXT.md` § Continuous learning governance** | PASS / PASS |
| 1904 | `.claude/CONTEXT.md` § Gates, Unattended block ("Scope the terminal step hardest")** | PASS / PASS |

CLAUDE line 24 → CONTEXT § Orientation (reverse-order wording); line 77 → CONTEXT § Gates. Both resolve before and after; CLAUDE is byte-identical after CRLF normalisation. There is no CLAUDE self-heading pointer. All CONTEXT heading and bold paragraph titles were compared, not just the named targets.

Id census: 44 distinct numeric L-/ADR-/TD- ids before, 43 after; ADR-028 left only with the removed incident narrative. No new id. Every surviving id resolves. L-042 is a retired id retained by LEARNINGS’ explicit L-022–L-042 policy and its Durable-rules edit-safety entry; TD-006 resolves through the archived SPRINT-009 T1/Retro record (explicitly resolved), not a live debt row.

| Id | Resolved home |
|---|---|
| ADR-001 | docs/adr/ADR-001-curated-not-copied.md |
| ADR-006 | docs/adr/ADR-006-skill-cap-executable-artifacts.md |
| ADR-007 | docs/adr/ADR-007-context-cap-ssot-density.md |
| ADR-009 | docs/adr/ADR-009-knowledge-metadata-ssot.md |
| ADR-010 | docs/adr/ADR-010-model-dispatch-role-tiers.md |
| ADR-012 | docs/adr/ADR-012-temidev-repo-structure-standard.md |
| ADR-014 | docs/adr/ADR-014-sprint-log-split.md |
| ADR-016 | docs/adr/ADR-016-rollup-at-the-exit-path.md |
| ADR-021 | docs/adr/ADR-021-evidence-gates-the-silent-path.md |
| ADR-022 | docs/adr/ADR-022-unattended-retry-mechanical-carve-out.md |
| ADR-023 | docs/adr/ADR-023-context-becomes-consumer.md |
| ADR-029 | docs/adr/ADR-029-tiered-verification-ceremony.md |
| ADR-044 | docs/adr/ADR-044-hooks-are-admissible.md |
| ADR-047 | docs/adr/ADR-047-a-sprint-references-its-members-and-plan-commit-is-the-freeze.md |
| ADR-050 | docs/adr/ADR-050-proof-bar-scales-with-consequence.md |
| ADR-053 | docs/adr/ADR-053-the-freeze-re-arms-widened-to-governance.md |
| ADR-054 | docs/adr/ADR-054-a-repo-without-git-freezes-a-sprint-by-snapshot.md |
| L-002 | docs/LEARNINGS.md |
| L-007 | docs/LEARNINGS.md |
| L-008 | docs/LEARNINGS.md |
| L-015 | docs/LEARNINGS.md |
| L-017 | docs/LEARNINGS.md |
| L-020 | docs/LEARNINGS.md |
| L-042 | docs/LEARNINGS.md (retired-id policy + Durable rules) |
| L-072 | docs/LEARNINGS.md |
| L-094 | docs/LEARNINGS.md |
| L-099 | docs/LEARNINGS.md |
| L-100 | docs/LEARNINGS.md |
| L-105 | docs/LEARNINGS.md |
| L-108 | docs/LEARNINGS.md |
| L-111 | docs/LEARNINGS.md |
| L-130 | docs/LEARNINGS.md |
| L-136 | docs/LEARNINGS.md |
| L-143 | docs/LEARNINGS.md |
| L-151 | docs/LEARNINGS.md |
| L-170 | docs/LEARNINGS.md |
| L-172 | docs/LEARNINGS.md |
| L-198 | docs/LEARNINGS.md |
| L-210 | docs/LEARNINGS.md |
| L-229 | docs/LEARNINGS.md |
| L-238 | docs/LEARNINGS.md |
| L-315 | docs/LEARNINGS.md |
| TD-006 | docs/sprint/archive/SPRINT-009-external-face-ssot-diet.md § Plan T1 + Retro (resolved) |

## Checks and printed verdicts

Each command ran separately and its own exit code/verdict was read. No git-writing command ran.

`bun --no-env-file scripts/lib/check-doc-caps.ts` — exit 0:

```text
PASS  cap .claude/CLAUDE.md (79 <= 80) [§2]
PASS  cap .claude/CONTEXT.md (150 <= 150) [§2]
PASS  doc-caps: token-budget ~10700 tokens <= budget 11021 (ratio 2.991 bytes/token, claude-opus-5-5 tokenizer; adopted 2026-11-21+ceea1714)
```

`sh scripts/lib/check-count-claims.sh .` — exit 0:

```text
PASS  skills: .claude/CONTEXT.md claims 16 = disk 16
PASS  skills: docs/architecture/overview.md claims 16 = disk 16
PASS  skills: .claude/CLAUDE.md claims 16 = disk 16
PASS  skills: SECURITY.md claims 16 = disk 16
PASS  tmpl-core: .claude/CLAUDE.md claims 34 = disk 34
PASS  tmpl-core: docs/architecture/overview.md claims 34 = disk 34
PASS  tmpl-core: README.md claims 34 = disk 34
PASS  tmpl-total: .claude/CLAUDE.md claims 36 = disk 36
PASS  tmpl-total: docs/architecture/overview.md claims 36 = disk 36
PASS  tmpl-total: README.md claims 36 = disk 36
      templates: 36 files = 34 core + 2 non-core (DESIGN, QA-TESTCASE)
PASS  qa.md non-core claim: docs/QA.md claims 2 = script 2
```

The requested `scripts/lib/check-count-claims.ts` is absent; the shipped `.sh` above is the actual qa-check leg 2 implementation.

`bun --no-env-file scripts/lib/check-prose-density.ts .` — exit 1:

```text
PASS  prose-density: .claude/CONTEXT.md (8 <= 16 dense lines) -- adopted drift, shrink it at the next promote review
FAIL  prose-density: docs/research/bloodlines-retest-scenarios.md has 13 line(s) over 400 chars and no baseline row [STANDARD 157: split, never squeeze] -- lines 77, 84, 88, 109, 156, ...
FAIL  prose-density: docs/research/graphify-rtk-retest-results.md has 6 line(s) over 400 chars and no baseline row [STANDARD 157: split, never squeeze] -- lines 100, 239, 241, 251, 259, ...
FAIL  prose-density: docs/research/rtk-trial-verdict.md has 5 line(s) over 400 chars and no baseline row [STANDARD 157: split, never squeeze] -- lines 15, 17, 47, 48, 55
FAIL  prose-density: skills/orchestrator/SKILL.md grew to 14 dense lines, baseline 13 [STANDARD 157: split, never squeeze] -- it got denser under the clause; lines 42, 51, 52, 53, 77, ...
prose-density: 26 pass, 4 fail
```

The four density failures are pre-existing: each failing file, the checker and baseline are byte-identical after CRLF normalisation to the build-base git blob. No retry can fix them within T2’s Layers; no baseline was changed. Comparison hashes (SHA-256 of LF-normalised text):

| Input | Base = working tree SHA-256 | Dense lines |
|---|---|---:|
| docs/research/bloodlines-retest-scenarios.md | 6f2b3737626a34db37ce248623458d60bbe6f40c1742ece6fabc9bff56ba1299 | 13 |
| docs/research/graphify-rtk-retest-results.md | 9deaa3a8cca83f6252e402dbbf0962817b3d0022f468c38360fd2a1c523eb72b | 6 |
| docs/research/rtk-trial-verdict.md | 08ee615d155761e0eba2fa7c741f90419104cccc0246c63e2771b8320e90b98f | 5 |
| skills/orchestrator/SKILL.md | 5c1a6fb546f3faeebac19cf48b5ec1e44a10b19a96efef34076904b305d5015f | 14 |
| scripts/lib/prose-density-baseline.txt | a55338608a2a9b08f34a3852f9f1a2a82665c1aeb0302bfa5c826655d56be5f0 | 0 |
| scripts/lib/check-prose-density.ts | 264157b4c590a7826a03f80d9ec2e4697ab7ef446c855d105b9150b2c24581c6 | 0 |

`sh .task-685-leg3.sh (scratch extraction of qa-check leg 3; deleted after verification)` — exit 0:

```text
PASS  frontmatter skills/council/SKILL.md
PASS  frontmatter skills/diagnose/SKILL.md
PASS  frontmatter skills/diagram/SKILL.md
PASS  frontmatter skills/flow/SKILL.md
PASS  frontmatter skills/handoff/SKILL.md
PASS  frontmatter skills/humanizer/SKILL.md
PASS  frontmatter skills/insights/SKILL.md
PASS  frontmatter skills/lean-doc-generator/SKILL.md
PASS  frontmatter skills/orchestrator/SKILL.md
PASS  frontmatter skills/prime/SKILL.md
PASS  frontmatter skills/prototype/SKILL.md
PASS  frontmatter skills/refactor-advisor/SKILL.md
PASS  frontmatter skills/release-patch/SKILL.md
PASS  frontmatter skills/task-decomposer/SKILL.md
PASS  frontmatter skills/tdd/SKILL.md
PASS  frontmatter skills/triage/SKILL.md
PASS  ownership .claude/CLAUDE.md
PASS  ownership .claude/CONTEXT.md
PASS  ownership docs/architecture/overview.md
PASS  ownership docs/LEARNINGS.md
PASS  ownership docs/DECISIONS.md
PASS  ownership CHANGELOG.md
PASS  ownership docs/knowledge-index.md
PASS  ownership README.md (footer line)
qa-check leg 3: 24 pass, 0 fail
```

`sh scripts/gen-index.sh --check (TMPDIR scoped inside this worktree)` — exit 0:

```text
PASS  gen-index: knowledge index current
```

Scratch verification verdicts (probes deleted before report):

```text
PASS  TASK-685 inventory: all 16 changed lines covered in both directions; headings and paragraph titles retained
PASS  TASK-685 ratchet: one data row changed; ceil(10700 x 1.03) = 11021; ratio unchanged
PASS  TASK-685 baseline comparison: all four failing density inputs, checker and baseline equal build-base blobs
PASS  negative census: renamed Gates heading is rejected
PASS  negative census: missing pointer file is rejected
PASS  negative census: missing named guard paragraph is rejected
PASS  independent census: 233 promoted entries - 1 held = 232 pointers; 14 Durable-rules moves; 246 total
```

`git diff --check`: exit 0, no findings. The embedded humanizer pass returned the proposed text unchanged; self-review then kept “mid-sprint correction” broad and retained explicit parallel-build permission in Streams. This is not the independent Claude governance review.

## Remaining coordinator work and proposed Execution Log entry

No LEARNINGS append was needed: prune that unused Layers token per A2. CLAUDE also needed no edit; all 5,784 bytes of saving came from CONTEXT, so reconcile its unused Layers token too. Task, sprint, Log and G2 record were not edited.

Full gate remains for the coordinator after resolving or recording an owner ruling on the four pre-existing density failures: `QA_FULL=1 sh scripts/qa-check.sh` (or the approved off-host `bun --no-env-file scripts/gate-remote.ts`). The default gate also runs git-writing fixture setup (e.g. `run-git-availability-fixtures.sh` and `run-gen-index-locale-fixtures.ts`); the worker prohibition therefore prevents claiming a full QA verdict. Independent Claude review remains per approved G2 (behaviour:low · governance:high, at most two rounds).

Proposed entry, returned only; no Log written:

> 2026-11-21 | progress | T2 (TASK-685) built; pending QA/ruling: compressed 16 CONTEXT lines in place, 12,634 → 10,700 estimated tokens (−15.31%; target ≤10,738), 37,786 → 32,002 normalised bytes; ratchet 11,021 at ratio 2.991. Caps 79/80 and 150/150; count claims 11 PASS; ownership leg 24 PASS; index current; census 232 promoted + 14 moved pointers and 2 CLAUDE § pointers resolve before/after, 43 surviving ids resolve. No rule moves; CLAUDE and LEARNINGS unchanged. Density: CONTEXT 13 → 8 (baseline 16), overall 26 pass / 4 pre-existing out-of-Layers fail, verified against build-base blobs. Evidence: docs/work/evidence/TASK-685/inventory.md. Full QA and independent Claude review pending; reconcile unused CLAUDE/LEARNINGS Layers tokens.

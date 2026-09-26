---
sprint: 107
slug: retarget-the-loop
owner: Maintainer
last_updated: 2026-09-24
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-107 — Execution Log

> Append-only companion to [`../SPRINT-107-retarget-the-loop.md`](../SPRINT-107-retarget-the-loop.md).
> Uncapped by design (STANDARD §9 · ADR-014). **Never edit a past entry** — correct it with a new one.

### 2026-09-24 | promote | plan locked at `3e0e710`, governance signed
Four tasks from `EPIC-017`: T1 `TASK-362` (+ `TASK-360`'s open half, resolves `TD-179`) · T2 `TASK-361` ·
T3 `TASK-376` · T4 `TASK-375` (with 362's dispatch merge-back half, D2). Members moved backlog → todo by
`git mv` in their own commit (`9a929c2`), then stamped `sprint: SPRINT-107`. Governance: L-promotion none ·
7 high TD open, TD-128 unowned · 5 soft cap breaches, 0 hard · epic rollups current · no handoff ledger.
Preflight CLEAR (T1 → T2 | T3 | T4); layers-completeness 8/0. G1/G2 not yet signed; A1 (no weaker
freeze) UNCONFIRMED → grilled at G2.

### 2026-09-24 | surprise | coordinator slip — the promote chain ran past a failed step
The promote script threw on its third anchor (the epic row reads "No §", written "no §"). The chain joined
the commit to the script with `&&` but everything after with `;`, so the member moves (`9a929c2`) and the
stamp commit (`3e0e710`, which also first committed this sprint file) still ran, and `plan_commit` was
recorded as **`f5ceae1` — SPRINT-106's last commit, not this Plan's**. No content was lost: the TODO pointer
and epic `member_sprints` edits were on disk, uncommitted. Repaired in the next commit: `plan_commit` →
`3e0e710` (where the Plan first entered history, verified by `git show --stat`), epic row added, pointer
committed. L-120's shape one level up — a chain's control flow is a gate too.

### 2026-09-24 | gate | batch G1 + G2 signed (attended) at `3b23f79`
All four members are `origin: manual` → full G1 checklist, no fast-path. Owner rulings at G2:
- **A1 → CONFIRMED as designed:** the freeze *is* `plan_commit`. A member is resolved by id in the
  `plan_commit` tree (`git show <plan_commit>:<path>`, so later folder moves do not matter) and its
  `## Done when` compared with the current file; any change without a `scope-change` Log entry naming
  that id FAILs. No hash field is added to the Members list (a second fact to keep right).
- **A2 → CONFIRMED, departing from EPIC-017 "Reference adopted":** a backlog is sequenced by
  `priority:` → topological order over `depends-on:` → task id. **No per-status order file**
  (laziness ladder; a second home for the list would drift).
- **scope-change (T1 Layers):** EPIC-017 D2's "→ ADR" is recorded inside T1 as **ADR-047**; T1 gains
  `docs/adr/` + `docs/DECISIONS.md` as layers. Impact: T1 stays M.
- **Tiers declared:** T1's post-promote-edit detector is **Tier G** (retained must-FAIL fixtures,
  seeded-break proof, worktree-isolated outside reviewer); T2–T4 are Tier X.
Sequence: T1 → {T2 ‖ T3, worktree-isolated} → T4 (J2: human present).

### 2026-09-24 | progress | T1 built — promote/close by reference, freeze checker (Tier G), ADR-047
Worktree commit `4f8ce2e`, cherry-picked to main. `promote` git-mv's members and stamps `sprint:`; the Plan carries
no DoD copy (`SPRINT.md.template` · `references/sprint-by-reference.md`); `close` requires members in
`done/`|`cancel/`. Freeze = `plan_commit`: `scripts/lib/check-sprint-by-reference.ts` resolves members by id
at `plan_commit` and compares `## Done when` (ticks, ` ✓ evidence` suffix, CRLF ignored; an unlogged change →
`FREEZE-EDIT`). **Re-run by the coordinator on main:** `by-reference-fixtures: 25 pass, 0 fail`; live SPRINT-107
freeze `5 pass, 0 fail`. Builder's 15-seed break proof reported ALL OK (`git hash-object` vs
`git rev-parse HEAD:<path>`, blob `b0aae826`). TD-179 resolved → TASK-362. Harness registered opt-in in
`qa-check.sh` (git-repo rule). **Ticks held** until the worktree-isolated outside review (Tier G bar ii) returns.
consequence · T1 · behaviour:material · governance:high → outside isolated reviewer

### 2026-09-24 | scope-change | T1 touched files outside its declared Layers
What broke: `layers observed` flags T1 files undeclared in the frozen Plan — `docs/adr/` + `docs/DECISIONS.md`
(G2 ruling, logged above but never written into Layers), `scripts/lib/check-sprint-by-reference.ts` (the
detector needs a home a consumer-free harness can call), `evals/run-layout-fixtures.ts` (its close-row anchor
quoted the replaced text `Verify all DoD`; retargeted, 33/0), `docs/knowledge-index.md` (regenerated; also
absorbed pre-existing drift L-213/L-214), `scripts/qa-check.sh` (coordinator registration, D3). Impact: none
on size or acceptance; § Plan stays frozen, this entry is the record. G2 re-confirm: covered by the owner's
G2 ruling for the ADR; the rest are mechanical consequences.

### 2026-09-24 | progress | T3 accepted — /handoff + /flow read the store; reconciliation files follow-ups as task files
Worktree commit `4b79bcc`, cherry-picked. handoff step 1 resolves the active sprint from top-level
`docs/sprint/SPRINT-*.md` `status: active` (logs/ + archive/ excluded) + members (Members ids ∪ `sprint:` stamp),
never TODO.md; flow's assess/feed/plan/build/close preconditions query `docs/work/`; handoff-reconciliation
routes a follow-up to `docs/work/backlog/` (`origin: close-retro`, numeric max id, worktrees excluded).
**Coordinator re-run on main:** `store-readers-fixtures: 21 pass, 0 fail`; `layout-fixtures: 33 pass, 0 fail`.
Harness mirrors the prose with a TS resolver — proves the rule, not agent compliance. Registered always-on (no git,
<1s). DoD ticked in Plan + TASK-376. No files outside Layers.
consequence · T3 · behaviour:med · governance:low → coordinator re-run + read of the diff
**Carried notes (not T3's scope):** (a) the id rule's legacy-`TODO.md` read was *my brief's* instruction and
conflicts with TASK-369's amendment ("reading TODO.md's content is migrate's job alone") — TASK-380 must drop or
allowlist it (T2 carries the same clause). (b) Stale TODO § Active Sprint readers outside this sprint's Layers:
`skills/prime/SKILL.md:41`, `skills/lean-doc-generator/SKILL.md:101,107`, `.claude/CONTEXT.md:82`,
`README.md:236` → TASK-379/380 at close-retro sweep. (c) T1's builder saw run-v1-to-v2 + typecheck-population
fail in its worktree; both pass on main (15/0, 1/0) — worktree lacks node_modules, not a regression.

### 2026-09-24 | review | T1 outside review (worktree-isolated) — NOT CLEAR, revise round 1 dispatched
Independent reviewer vs `3676a00`: **2 major** — (1) population ignores `plan_commit`: a member dropped from both
Members and its stamp, then edited, passes freeze *and* close (L-186); (2) no time bound — a pre-promote
scope-change excuses a later edit, and `plan_commit` can be re-pointed to HEAD / a non-ancestor. **5 minor** —
narrow stamp/Members parsing (quoted, `# comment`, BOM, bare `NNN`, multi-id lines, tables); `## Done when`
missing on both sides passes vacuously, second section/fenced `## ` unread; last scope-change entry swallows the
file tail; false FAILs on legitimate shapes (no-summary heading, inline log, in-text ✓, `+` bullets, blank lines,
quoted non-ASCII paths, `Tn`-named entries); reference/script drift. Held up: id resolution across moves/renames,
prefix-safe ids, CRLF, verdict line == exit code on every path, harness 25/0, seeded stamp-arm break reddened
exactly its 2 cases (restored `b0aae82` == HEAD blob).
**Owner ruling (G2, 2026-09-24):** a member added mid-sprint passes iff a post-`plan_commit` scope-change names it;
baseline = its content at the first commit stamping `sprint:`. → folded into the same revise round + ADR-047.
Revise loop: one bounded builder retry, then a second independent review. T1 ticks held.

### 2026-09-24 | progress | T2 accepted — /triage + /task-decomposer read and write the store
Worktree commit `3b49aef`, cherry-picked. decomposer writes one `docs/work/backlog/TASK-NNN-slug.md` per task
(id = numeric max over the six status folders + 1, worktrees never walked; rule in new
`references/task-file.md`); triage edits `priority:`/`state:` in place, derives order per A2, cancels by
`git mv`. **Coordinator re-run on main:** `store-writers-fixtures: 29 pass, 0 fail`; layout 33/0.
**Real input (L-007, Closed-when 1):** EPIC-017 decomposed into 37 files (TASK-388..424) in a scratch v2
store (never this repo's backlog); `check-doc-caps` 0 FAIL — no §2 row reaches `docs/work/`, so one-file-per-task
has no container to breach; positive control: the same 37 in v1 shape push `TODO.md` to 828 > 320. Registered
always-on. DoD ticked in Plan + TASK-361.
consequence · T2 · behaviour:med · governance:low → coordinator re-run + read of the diff
**Builder declined my brief's legacy-`TODO.md` id arm** (TASK-369: only migrate reads TODO.md) — correct; T3 had
followed the brief, so aligned in `65bbb13` (fixture now asserts TODO.md is never read; seeding the old arm back
reddened exactly that case, restored under `git hash-object` = `98bc4b03`). **Interpretation logged:** a blocker
sorts at the highest priority of anything waiting on it — the reading of A2's "topological over depends-on".
New conventions not yet in `docs/work/README.md`: `- **open:**` / `- **blocked-by:**` under `## Assumes` → close-retro
follow-up (schema doc is TASK-377's). README/CHANGELOG for T2/T3's user-visible change → at close (D4: no release).

### 2026-09-24 | scope-change | TASK-361 ordering criterion superseded by A2; T2 adds a reference file
What broke: TASK-361's `## Done when` names "`priority:` + a per-status order file"; the owner's G2 ruling A2
removed the order file. Impact: criterion read under A2 — recorded as `## Amended 2026-09-24` in TASK-361 (the
Done-when text itself unedited), ticked on that basis. Also: `skills/task-decomposer/references/task-file.md` is
outside T2's Layers (the SKILL could not take the file shape under ~140 lines; ADR-006). G2 re-confirm: A2 is the
owner's ruling.

### 2026-09-25 | progress | T1 revise round 1 landed — both majors + five minors closed; round-2 review dispatched
Round 1's builder retry never reached history (no commit after `86b4e73`), so the coordinator built it: `ee95280`.
Population = Members ids ∪ `sprint:` stamps, each read **at `plan_commit` and now** → `MEMBER-DROPPED` (left both
indices, no scope-change) · `MEMBER-UNPLANNED` (joined after promote, no scope-change; G2 ruling — baseline = first
commit stamping or listing it). Time: a scope-change counts only if **new since the member's baseline**;
`plan_commit` must be an ancestor of HEAD, hold the sprint file, and be no later than the first commit recording one
(`PLAN-COMMIT-NOT-ANCESTOR` · `-NO-PLAN` · `-UNRECORDED` · `-LATE`; SPRINT-107's own backward repair passes).
Minors: stamp shapes, any-shape Members, every `## Done when` fence-aware, `NO-DONE-WHEN` (never vacuous), entries end
at the next heading, no-summary heading, inline log, `Tn` → frozen `Cites:`, in-text ✓ / `+` / blank lines,
`ls-tree -z`. Reference + ADR-047 amended to match.
**Evidence (hash convention: `git hash-object <working file>` throughout):** harness `by-reference-fixtures: 55 pass,
0 fail`; live SPRINT-107 `6 pass, 0 fail`. Rejected design (HEAD checker `b0aae826` seeded in) reddened all 24 new
non-control cases, 28 green (25 originals + 3 sibling controls). 21 targeted seeds on the new checker, each parses,
±1 line, reddens exactly its named case(s): first pass 19 OK + 2 BAD — S7 exposed an unexercised clause (an
*empty* `## Done when` on both sides) → fixture added; S19's seed was a demolition (also broke the sprint's own
`sprint: 901`) → narrowed to the stamp arm; both re-run OK. Restored `015327e9` each time.
**Slip:** a `git stash` for an unrelated index check ran mid-seed-batch; checker verified intact afterwards
(seeded S7 in place, as expected, then restored by the script), and S7 re-run clean. Knowledge index was already
STALE at `9d8658a` → regenerated in its own commit `3ae370d`.
consequence · T1 · behaviour:material · governance:high → second worktree-isolated outside review (round 2)

### 2026-09-25 | review | T1 round-2 outside review (worktree-isolated) — NOT CLEAR; revise round 2 landed `0c0010e`
Round 1 findings verified closed by the reviewer's own repros. **2 new major** (both on a property every fixture
shared — L-186): (1) an archived sprint read its log/Members at today's path in old commits, so a pre-promote
scope-change excused an edit again; (2) a late first recording moved the PLAN-COMMIT-LATE bound with it. 7 minor:
reworded old entry / paragraph under an old entry counted as new; lexical naming; HTML-commented entry; free-text
✓ tail; renamed sprint → false NO-PLAN; nested status folder → false MEMBER-MISSING; usage exit without verdict.
**Fixed in `0c0010e`:** per-commit path resolution; bound = every start sign (active · member listed · recorded ·
member stamped); append-only log (`LOG-REWRITTEN`); comments stripped; `Tn` heading-only; recursive walk; usage
verdict. **Accepted + documented (reference, ADR-047):** lexical naming, free-text ✓ tail — the log's reader is the check.
**Evidence (`git hash-object`, working file):** harness `67 pass, 0 fail` (+12 cases varying sprint location,
recording time, folder depth, merge history); round-1 checker `015327e9` seeded in reddens all 10 new non-control
cases; 30 targeted seeds all OK after two stale anchors were re-anchored and S12's demolition narrowed; restored
`d563167d`. Live SPRINT-107 `6 pass, 0 fail`. Round-3 review dispatched to the same isolated reviewer.
consequence · T1 · behaviour:material · governance:high → outside isolated reviewer (round 3)

### 2026-09-25 | review | T1 round-3 outside review — CLEAR; three minors fixed `68c2a0b`; T1 accepted
Reviewer re-ran every round-2 repro against `0c0010e`: both majors and all fixed minors closed; no realistic false
negative. Three minors, fixed: log frontmatter is metadata (a `last_updated` bump is not LOG-REWRITTEN); the whole
log is parsed so a comment/fence opened before promote keeps its context; a sprint renamed without its log finds the
log by its `sprint:` frontmatter. Fourth (a sprint file drafted with members before promote reads as late) is
off-procedure → documented in the reference, not changed. L-186: +6 must-PASS/must-FAIL cases for the direction the
fixtures lacked (a legitimate scope-change found after the log moves).
**Evidence (`git hash-object`, working file):** harness `73 pass, 0 fail`; 33 targeted seeds ALL OK, restored `00b27606`;
live SPRINT-107 `6 pass, 0 fail`. **Surprise:** the first round-3 seed batch was INVALID, not red — the host's commit
signer failed at volume ("too many open files") and a build error escaped the per-case try, so the harness printed no
verdict and 28 seeds scored "BAD" on `red=[]`. Fixed in the harness (fixture repos set `commit.gpgsign false`; build
inside the try) and in the seed runner (no verdict line → INVALID, never a result) — L-120 / L-142's shape again:
a unanimous result from an instrument that did not run.
**T1 accepted.** Plan DoD ticked; TASK-360 → done/ (derived 7 open / 5 ticked = hand count over Members ids).
TASK-362's one box stays open: its D6 merge-back half is T4's (D2).
consequence · T1 · behaviour:material · governance:high → three worktree-isolated outside rounds, CLEAR at round 3

### 2026-09-25 | progress | T4 accepted — /orchestrator runs a sprint from its member files; TASK-362's D6 half lands
Worktree commit `d9a03c7`, cherry-picked `c60a947`. sprint-bulk resolves active sprint + members (Members ∪ stamps, by
id); guard/tick/rollup/close read member `## Done when`, never Plan boxes; transitions are coordinator-owned `git mv`
(own commit) with a **duplicate-id check at every merge-back** (`find docs/work -name 'TASK-*.md' | sed … | uniq -d`
must print nothing — run on this repo: empty, 26 files); return-to-backlog = scope-change + `git mv` + stamp/Members
cleared (consistent with T1's MEMBER-DROPPED). night-run routing/pre-flight/rollup/reaper contract and review-scoping's
`Cites:` comparand read the store. SKILL.md 133 lines.
**Coordinator re-run on this branch:** `orchestrator-store-fixtures: 41 pass, 0 fail` → after the fix below 42/0;
`store-readers 21/0` · `store-writers 29/0` · `layout 33/0`. Builder's seeded Members-only break → 30/11, restored
`a2c8790` = HEAD blob.
**Coordinator fix `af78aaf` (builder's open Q2):** step-0 guard counted only open boxes, so all-ticked-but-in-`review/`
halted toward promote — now runnable until every member is in `done/`|`cancel/`, then routes to close; +e2e-16b;
seeding the old rule back reddens exactly it (restored `aef768aa`, `git hash-object`). **Interpretation logged
(builder Q1):** a `Tn` whose cited members were all scoped out counts in neither unit figure.
Harness registered opt-in (git-repo rule, D3). TASK-375 + TASK-362 → done/. **Live close gate:**
`check-sprint-by-reference … --close` on SPRINT-107 → `11 pass, 0 fail` — every member in `done/`, freeze intact.
**Carried:** `scripts/night-run.sh` still counts sprint-file boxes → TASK-383 (the prose contract leads).
consequence · T4 · behaviour:med · governance:med → coordinator re-run + read of the diff + one targeted fix

### 2026-09-25 | scope-change | T1 · T2 · T4 Layers declare the files their logged scope-changes already named
What broke: system-verify (`QA-CHECK: 255 pass, 5 fail`) — `layers observed` names files each task touched outside its
frozen `Layers:`: T1 `scripts/lib/check-sprint-by-reference.ts` · ADR-047 · `docs/DECISIONS.md` ·
`evals/run-layout-fixtures.ts` (all in T1's 2026-09-24 scope-change) · T2 `skills/task-decomposer/references/task-file.md`
(T2's scope-change) · T4 `scripts/qa-check.sh` (harness registration, D3 — committed under T4's id). Precedent:
SPRINT-072 declared a gate-caught sibling on the task's `Layers:`. `layers completeness` was the coordinator's own doing:
tick-evidence text named file tokens (the sprint template, the reference, the reaper script) the checker reads as implied
touches — reworded to prose. Impact: no size/acceptance change; § Plan edited only on these `Layers:` lines and two
evidence tails. G2 re-confirm: mechanical consequences of logged rulings.
**Not fixable, recorded:** `65bbb13` (subject `… (SPRINT-107 T3 align)`) is unattributable by the checker's subject rules
and is pushed history — rewriting it is off the table; it stays a named `layers observed` finding for the owner at close.
**Environment, not this sprint:** `typecheck` + `typecheck-population` → no `node_modules` (fixed: `bun install`);
`spec-reader s13` → the fixture matches an em dash with one `.`, so it fails under a POSIX locale (this container:
`LANG` unset) and passes under `LC_ALL=C.UTF-8`; red already at `3e0e710` → TD at close.

### 2026-09-26 | close | SPRINT-107 closed — 18 of 18 Plan DoD, five of five members in `done/`
**System-verify** (`LC_ALL=C.UTF-8 bash scripts/qa-check.sh`, run as its own call, verdict line read):
`QA-CHECK: 259 pass, 1 fail`. The FAIL is `layers observed` on `65bbb13`, a pushed commit from the prior session
whose subject qualifier `T3 align` the attribution rule cannot parse. **Owner ruling (2026-09-26): recorded as an
exception, history untouched** (SPRINT-094 precedent) → TD-181. Close gate: `check-sprint-by-reference … --close`
→ `11 pass, 0 fail`. Handoff reconciliation: no `handoff` entries this sprint.
Retro written and routed. **Shipped** → `CHANGELOG.md` (SPRINT-107 section). **Debt** → `TD-180` (locale-dependent
`s13` fixture) · `TD-181` (rule-4 qualifier) · TD-178 sighting. **Follow-ups** → none new: carried as `## Amended`
notes on TASK-377 · TASK-379 · TASK-383. **Learnings** → `L-215` (fixture repos inherit host git config) ·
`L-216` (a background tree mutator owns the tree). **Doc freshness** (owner-approved): README (sprint-bulk
line, upgrade step 3) and `.claude/CONTEXT.md` (sprint-bulk row, the sprint-file line) now describe members by
reference. EPIC-017 rolled up: § Closed-when **1** and **5** met; not closed (8 conditions open). TODO pointer
cleared. **§11 retention** (owner-approved): archive the sprint pair and add the INDEX line, in the next commits.
No release: D4, the epic gates `2.0.0`.

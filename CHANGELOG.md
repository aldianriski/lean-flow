---
owner: Maintainer
last_updated: 2026-10-07
update_trigger: Sprint completed and changes reflected in docs
status: current
---

# lean-flow — Changelog

<!-- Prepend new sprints — newest first. Append-only; never edit past blocks. -->

> **Older than the two minors below** → [`docs/changelog/`](docs/changelog/) — rotated verbatim at
> each new MINOR and reachable only from here (STANDARD §11).

---

## SPRINT-119 — Fire-Ledger Vehicle (2026-10-07)

**Unreleased**: no consumer-facing file changed (it is the seeded vehicle for SPRINT-118 T2).

- **The first real unattended run since the reaper repair** fired against this all-J0 Plan on the VPS: `PLAN_EXHAUSTED` · `DELIVERED`,
  $0.83, no confirmation asked, 0 permission denials. It transcribed its own `fired ·` line and the authority verdict (TASK-405).

---

## SPRINT-118 — Prove the Run (2026-10-09)

**Unreleased**: `scripts/night-run.sh` and `skills/orchestrator/references/night-run.md` changed, so this reaches adopters at the next release.

- **The night-run launcher writes a fire-time ledger.** `night-run.sh` appends `fired · <ts> · <mode>` to the sprint's Execution Log
  before the wrapped command runs, and refuses to fire when no sprint resolves. A run that fires and dies before the reaper is now on
  record, and the sprint close check FAILs it as `CLOSE-FIRED-UNREAPED` (TD-122). The authority check reads the same line as the
  written fact of an unattended run (TD-124).
- **EPIC-015 Closed-when 1 is met on live input:** one real `--mode overnight` run ended at a named terminal state, and every check read
  the committed log. The first real `/handoff` record went `live` → `consumed` → `spent` through `check-handoff-state.sh` (TASK-327).

---

## v2.1.0 — Reports lead with the conclusion; one conformance engine (2026-10-07)

**MINOR** — ships SPRINT-115 · SPRINT-116 · SPRINT-117 (entries below). No upgrade step beyond installing `2.1.x` and restarting
the session (a live session keeps the plugin copy it started with). Nothing an adopter runs needs anything new.

- **Skill reports open with the verdict and the next step**, then evidence, then exactly one `Next:` line (`/prime` · `/orchestrator` ·
  `/lean-doc-generator`).
- **A review loop that closes records its `review ·` line**; an external reviewer records as `scoped-reviewer`.
- **The TypeScript port of the conformance engine is retired** (ADR-051): `conformance.sh` and its Shell engine are the only engine,
  and the plugin no longer ships `packages/` · `apps/`.

---

## SPRINT-117 — Reports Lead (2026-10-06)

**Unreleased**: no version bump yet. Three `skills/*/SKILL.md` files changed, so this reaches adopters at the next release.

- **Skill reports lead with the conclusion.** `/prime`'s banner line carries its verdict and the next step, and the report ends on `Next:`.
  `/orchestrator`'s gate verdicts, task completions and confirmation popups open with one line carrying the verdict and the next step,
  then the evidence, then exactly one `Next:` line (the sprint-bulk rollup keeps its machine-read shape). `/lean-doc-generator`'s close
  report and popups follow the same shape. It is a shape rule, not a length cap (TASK-321).

---

## SPRINT-116 — Decision + Ledger Diet (2026-10-06)

**Unreleased**: no version bump yet. `skills/orchestrator/references/` and `README.md` changed, so this reaches adopters at the next release.

- **The TypeScript port of the conformance engine is retired (ADR-051).** The Shell engine (`conformance.sh`) is the only engine.
  `packages/` · `apps/` · 31 port-only `test/` files and the two §4 TS harnesses are gone (103 files + 2). The Shell §4 harness
  `run-adr-family-fixtures.sh` is back in the default gate, now asserting each rule's verdict per fixture, including the empty-slug case.
  EPIC-014 closes as retired. ADR-038 and ADR-039 are superseded. The default gate is ~25 s slower; adopters need nothing new.
- **A review loop that closes records its `review ·` line, whichever reviewer ran** (`review-scoping.md` § The revise loop). An external
  reviewer, such as a Codex loop, records as `scoped-reviewer`, so the depth vocabulary stays four words. New must-FAIL fixture plus control.
- **`check-handoff-state.sh` uses the shared archive predicate**, and leg 10b no longer exempts it (TASK-346).
- **Stale references to SPRINT-113's cut guards are reworded to history** (TASK-400).
- **Debt ledger:** 12 of the 42 oldest rows resolved at promote and 13 port-only rows at T1; close files 3. 116 open (was 138).
  TD-168 (engine spawn cost) is now TASK-404, P1.

---

## SPRINT-115 — Gate and Host Cost (2026-10-06)

**Unreleased**: no version bump. Skills, templates, spec, manifests and README are untouched, so nothing reaches an adopter.

- **The gate's cost is measured, and it is the host's.** On an Ubuntu VPS the complete `QA_FULL=1` gate runs **105–109 s**, 3/3 green
  (`qa-gate-timing.md` Round 22). TD-143's cost half is ruled closed (host memory, not the gate), and TD-090/117/128 are re-rated `medium`
  as Windows-host-specific. TD-168 stays `high` (the engine is consumer-facing). ADR-039's deferred `layers-observed` ruling is moot: the harness was deleted at SPRINT-113.
- **Two fixtures stop depending on the host.** The locale control spawns `bash` (dash made it vacuous), and the budget-position case asserts
  where the first finding lands, not silence within 60 s (TD-224 · TD-225).
- **`dod-delta` accepts a ruled exemption.** `.dod-delta-exempt` declares an owner-ruled cross-task tick by sha + ruling + reason; it prints
  a named EXEMPT line, while an undeclared sibling still FAILs (TD-166).
- **`scripts/promote-check.ts <sprint>`** runs layers-completeness and a new single-file prose-density mode on a sprint file before `plan locked`.

---
## v2.0.0 — The hard cut onto the work-item store (2026-10-03) — **BREAKING**

### Upgrading from 1.x

1. **Install `2.x`, then restart the session.** A live session keeps the plugin copy it started with.
2. **Run `/lean-doc-generator migrate`** on each repo that still has `TODO.md`. It plans, waits for your approval, then applies; it never
   overwrites a file it does not recognise, and it withholds any task missing a field it cannot source until you supply it.
3. **Resume.** Every 2.x queue skill refuses a v1 or mixed tree by name and points you to `migrate`; `/prime` reports the layout and
   continues. Full steps → README.md § Upgrading to 2.x.

**Proven before release (SPRINT-114, on `2.0.0-rc.1`, whose `skills/`, `templates/` and `spec/` are byte-identical to this release):**
the candidate migrated a real consumer (`workdoo`: 15 tasks, id sets equal, boxes 18 → 18) on a retained branch and now runs it; 7/7 queue
skills refuse a real v1 tree with zero writes; a 1.66.1 writer's stray `TODO.md` is refused and re-ingested losslessly; an id collision is
reported, never overwritten; Codex loads the plugin (Kimi not exercised, by owner ruling). **Effectiveness was measured and is not
demonstrated** by the method (`docs/research/logs/epic-017-effectiveness.md`): it ships for structural reasons, not on a claimed gain.

**Breaking — MAJOR (`2.0.0`).** `TODO.md` + the sprint-Plan-copy
layout is replaced by `docs/work/<status>/TASK-NNN-slug.md` (one file per task; status is the
folder, title is the filename, sprint/epic membership is frontmatter — `ADR-045`). This is a hard
cut, not a graduated migration (`ADR-046`): every `2.x` queue skill (`prime`, `triage`,
`task-decomposer`, `lean-doc-generator`, `orchestrator`, `handoff`, `flow`) detects a v1 (`TODO.md`
present, no `docs/work/`) or mixed (both present) tree by name and refuses its queue operation on
it — `/prime` is the one exception, reporting the layout and continuing rather than aborting.
`/lean-doc-generator migrate` is the only `2.x` path onto the store: it maps a `TODO.md` Backlog
and an active sprint's Plan onto `docs/work/` field by field, plan → approve → apply, resumable
(an interrupted run re-run skips what already exists and never overwrites a conflicting file), and
removes `TODO.md` once every task has moved and no conflict is left unresolved (non-task prose is
listed for the owner to relocate or drop, never dropped silently). Mapping + verification: `skills/lean-doc-generator/references/
migration-map.md` § v1 → v2 work-item store (2.0). Upgrade path: README.md § Upgrading to 2.x.

**New runtime requirement (`ADR-049`):** checking a 2.x (v2) tree with `conformance.sh`, the gate or night-run
needs `bun`. Without it the run fails with `bun-required` rather than passing unexamined. A 1.x tree is still
checked with `sh` alone.

**No skill reads `TODO.md` any more.** `/prime` counts open work from `docs/work/` and the `status: active`
sprints' `## Members`; `/lean-doc-generator init` scaffolds the store (create-lazily) instead of `TODO.md`;
promote, close and retro follow-ups use store task files; the dev-flow/adlc-flow migration map produces store files.
`TODO.md` survives only in `migrate`'s v1→v2 path and the v1 refusal text.

---
## SPRINT-113 — Ship the Store, Trim the Guards (2026-10-03)

EPIC-017's seventh member sprint. **Unreleased**: no version bump (D2).

- **`TASK.md.template` ships; `TODO.md.template` is gone.** `/lean-doc-generator` bundles a task-file template that matches the store's schema,
  and a fresh repo's `init` scaffolds `docs/work/` lazily, with no TODO.md (exercised on an empty directory).
- **`migrate` states the rules its first real run had to ask for.** Members are found by id in any folder; a row missing class, tier or
  authority is flagged and withheld until the owner supplies it; frontmatter carries plain enums, with comments moved verbatim to `## Why`; `none — but …`
  becomes an Assumes line; lettered done-when clauses become one box each; and needs-info tasks get an `**open:**` line. Its verification now
  derives what the run wrote from the store itself (`output ⊆ meant`, `meant = output ∪ kept ∪ replaced ∪ pending`), so a stray file or an
  owner-approved conflict outcome is accounted for, not mis-counted.
- **The docs describe the v2 loop.** CONTEXT, the architecture map and the QA cases describe the store, and `/council` no longer says "TODO tracker".
- **Guards cut (this repository).** SPRINT-112's audit cuts landed: the v1 park/retry selftests and two never-run parity harnesses (2,442 lines).

---
## SPRINT-112 — Govern Lighter (2026-10-03)

EPIC-017's sixth member sprint. **Unreleased**: no version bump (D3).

- **Promoting a learning now requires a disposition.** `/lean-doc-generator promote`'s governance step asks for one per promoted rule
  (`replace` · `merge` · `move-to-reference` · `automate-into-check` · `retain`), written on the pointer line as `disposition: <kind>`.
- **`/orchestrator` G2 gains an ADR check.** Before offering a ruling that changes a shipped entry point or a frozen contract, the
  coordinator reads that entry point's own ADR and names it in the option (L-220, promoted), with a matching red flag.
- **The proof bar scales with consequence (ADR-050, this repository's process).** A guard change an adopter can hit keeps the full Tier G bar.
  A maintainer-only one takes a must-FAIL fixture and one run on its real artifact. A guard audit of 60 checks by the defects each actually
  caught (24 had any) rules 39 keep, 18 freeze and 3 cut; the cuts land in TASK-398.
- **Soft cap breaches close by a recorded disposition, not a diet.** This repository's `check-doc-caps` honours a root `.cap-dispositions`
  (`path -- kind -- reason`) for soft over-caps only and names each `retained:` row on every run. Hard caps and the token budget stay FAIL.
  The always-loaded read set fell from ~16081 to ~13419 tokens, and every rule kept its actions.

---
## SPRINT-111 — Delete TODO.md (2026-10-02)

EPIC-017's fifth member sprint. **Unreleased**: no version bump (D3).

- **Nothing reads `TODO.md` any more (spec 0.13.0, MINOR).** The engine's `S11.TODOCAP` keeps its id, level and mark, because
  ADR-034 freezes the rule-ID surface at 100. It is now a retired no-op: an over-cap `TODO.md` gets a note, not a finding. The
  engine no longer scans TODO.md for v1 breadcrumbs or holds it to the ownership header. qa-check legs 5, 7 and 8, leg 3's TODO.md
  subject, and check-task-origin's legacy population are retired. §14 stays at 100 classified and 51 checkable.
- **§2 rows the spec marks retired are no longer placed.** S2.R-PLACEMENT and S2.F-FILE skip a row whose first cell carries the
  spec's own marker (`` `path` — **… retired at X.Y.Z** ``), so a stray `docs/TODO.md` in a v2 repo is not flagged as a misplaced
  v1 queue. A live row that merely mentions retirement is unaffected.
- **`migrate` handles by-reference sprints.** A sprint with `## Members` has its `Tn` skipped; its members must exist and are never
  written. Existing store files are preserved byte for byte, and an interrupted run re-runs to the same tree. Proven on a real
  copy of this repo, then run by an agent on the repo itself.
- **This repository is on the store.** 15 legacy tasks were migrated and `TODO.md` deleted, which meets EPIC-017 Closed-when 2. Eight
  harnesses that guarded only the v1 park/retry shape are frozen and excluded from the gate. The work-store harness follows prime's
  by-id membership rule.

---
## SPRINT-110 — Retarget the Gate (2026-09-30)

EPIC-017's fourth member sprint. **Unreleased**: no version bump (D3); the whole epic gates `2.0.0`.

- **The rest of the gate reads the work-item store.** On a by-reference sprint these checks used to find nothing in the Plan and
  pass without examining anything.
  - check-layers-completeness checks each member's `## Done when` against the Layers of the Plan block that cites it.
  - check-layers-observed checks a member-attributed commit against those Layers, and judges "at close" from the members.
  - Both FAIL `member-layers-undeclared` for a member no Plan block governs, including a sprint with no Plan blocks at all.
  - qa-check's log-owed and active-sprint legs, and night-run's `reap()` rollup, count member boxes and Cites-based units.
  - The legs whose subject is `TODO.md` apply only while the file exists.
  - The conformance engine's S9, S10 and S11 rules read members. S9.PLANFROZEN reuses the ADR-047 freeze checker. Task files are
    exempt from the ownership header. §11 gains a store prune, `closed-task-past-retention`.
- **One member lookup for shell callers.** `scripts/lib/sprint-members-cli.ts` (`kind · members · counts · active`) wraps the shared
  lookup, with named exits for an unresolvable member, so no shell script re-implements how members are selected.
- **Checking a v2 tree requires `bun` (`ADR-049`).** The engine reads members through that lookup, and a v2 tree without `bun` fails
  with `bun-required` instead of passing unexamined. A v1 tree stays `sh`-only, with byte-identical output (354 fixture trees and
  109 archived plans compared).

---
## SPRINT-109 — Unlock the Critical Path (2026-09-29)

EPIC-017's third member sprint. **Unreleased**: no version bump (D2); the whole epic gates `2.0.0`.

- **The standard describes the store (spec `0.12.0`, breaking).**
  - STANDARD §2 adds a `docs/work/` row and labels `TODO.md` *v1 layout, retired at 1.0, read only by migrate*.
  - §9 describes a sprint by reference, and §10 routes Retro follow-ups to task files.
  - §11 prunes `done/` and `cancel/`, never the highest id, with a deleted task's citations resolved through git.
  - `1.0.0` stays behind §15's bar of two pinned repositories.
  - `TASK-383` carries the named list of conformance rules that still read `TODO.md`.
- **Caps measure tokens, not newlines (`ADR-048`, superseding ADR-015/017/019).** `check-doc-caps` budgets the always-loaded
  read set in tokens with a named tokenizer (`claude-opus-5-5`), calibrated once at 2.991 bytes/token.
  - The byte count is content-normalised, so a CRLF checkout reads the same as LF.
  - The budget ratchets from its adoption value (16087): growth past it FAILs unless a disposition is recorded.
  - `--calibrate` runs with an API key or through headless Claude Code on a subscription.
  - Line counts stay as a secondary signal.
- **Four guards read member task files.** On a by-reference sprint these guards found nothing in the Plan and passed without
  examining anything.
  - authority reads each member's `authority:` and FAILs `authority-plan-member-mismatch` when a Plan block disagrees with the
    member it cites.
  - task-origin covers every `docs/work/*/TASK-*.md`.
  - dod-delta correlates member `## Done when` ticks through the Plan's `Cites:`.
  - verify-reaches is ported to TypeScript and reads the Plan together with member Done-when. The `.sh` is deleted and every
    caller re-pointed.

  The member lookup is one shared module, `scripts/lib/sprint-members.ts`.

---
## SPRINT-108 — Guard the Freeze (2026-09-26)

A hardening sprint after SPRINT-107's outside review. **Unreleased**: no version bump (D2).

- **The by-reference freeze checker no longer lets Markdown hide an edit.**
  - Fences close by the CommonMark rule (same character, a run at least as long as the opener's, nothing after it, at most 3 spaces of indent).
  - HTML comments end a section only when they start a line.
  - Under the new err-loud rule (A5), the checker does not model inline Markdown at all:
    - scope-change excuses are matched with every comment removed
    - heading names tolerate indent, closing `#`s and extra spaces
    - a renamed log heading gives `LOG-HEADING-CHANGED`

  An edit *inside* a Done-when comment still counts (D1). Paths are resolved to their real spelling, so a
  Windows 8.3 short name no longer turns the whole suite into `CHECK-ERROR`. There are 127 retained cases
  (up from 73), and the orchestrator-store harness now requires the checker's verdict line.
- **The knowledge index is byte-identical under any locale.** The generator orders its files with a scoped
  `LC_ALL=C sort`, so the same repo no longer reads STALE on a host whose collation differs. A new
  always-on harness proves the order and checks that the setting does not leak to the caller.

---
## SPRINT-107 — Retarget the Loop (2026-09-26)

EPIC-017's second member sprint. **Unreleased**: the whole epic gates `2.0.0`.

- **Sprints by reference (`ADR-047`).** `promote` moves member task files `backlog/ → todo/` with `git mv`
  and stamps `sprint:`. The sprint's § Plan carries meta only, with no DoD copy, because each task's DoD
  is its own `## Done when`. `plan_commit` is the freeze. `close` requires every member in
  `done/`/`cancel/`. The freeze check covers membership at `plan_commit` and now, a `scope-change` that
  is new since the baseline, a bounded freeze point, and an append-only log. It is a Tier G checker
  with 73 retained cases, and it cleared three worktree-isolated outside reviews.
- **`/triage` + `/task-decomposer`** write one task file per task. A 37-task breakdown of EPIC-017
  produced 37 files and no cap check fired.
- **`/handoff` + `/flow`** find the active sprint and route from the store. They never read `TODO.md`.
- **`/orchestrator`** runs a sprint from its member files. It ticks and moves them as the coordinator,
  runs a duplicate-id check at every merge-back, and treats return-to-backlog as a logged scope-out.
  The rollup and units count member boxes, and review's `Cites:` comparand resolves to the task file.
- **Gate:** four new harnesses (store-readers and store-writers always-on; by-reference and
  orchestrator-store opt-in). The close gate read `259 pass, 1 fail`, the one being a pushed commit
  whose subject the attribution rule cannot parse, recorded as an owner-ruled exception (`TD-181`).

## SPRINT-106 — The Store, and the Way In (2026-09-24)

EPIC-017's first member sprint. **Unreleased** — the whole epic gates `2.0.0` (owner ruling).

- **Work-item store** — `docs/work/{backlog,todo,in_progress,review,done,cancel}/` with its schema in
  `docs/work/README.md`; transitions are `git mv` in a commit of their own (`ADR-045`). The first real
  transitions (three tasks → `done/`) landed as pure renames.
- **Membership + derived progress** — `sprint:`/`epic:` frontmatter; `/prime` counts `## Done when`
  boxes across a sprint's member files; optional `## Members` list in the sprint template.
- **Hard cut** — the 7 queue skills detect v1/mixed by existence alone and refuse by name → `migrate`
  (`ADR-046`); `/prime` reports and continues.
- **Migrate** — `migration-map.md` § v1 → v2: Backlog and active-sprint tasks, one file per task,
  owner-resolved conflicts that block `TODO.md` removal; exercised on a scratch copy of this repo.
- **Baseline** — EPIC-017's before-figures frozen: completeness 9/26, retrieval 11/12, recurrence 22.
- **Gate** — three new harnesses (work-store opt-in, layout + v1-to-v2 always-on); full gate
  `258 pass, 1 fail`, the one cleared by commit.

---
## SPRINT-104 — The Gate's Own Blind Spots (2026-09-23)

**Unreleased — PATCH candidate.** One consumer-visible change: an adopter running root
`conformance.sh` whose engine fails to bootstrap now sees `FAIL  conformance: …` at the two-space
column every other finding uses (was one space), so a column-keyed selector no longer misses it.
`skills/`, `templates/`, `spec/`, the manifests and `README.md` are untouched by SPRINT-104's commits
(`README.md` moved in this range only under SPRINT-105). **19 of 25 DoD** — T4's six carried to `TASK-357`.

### Fixed
- **The typecheck leg now checks `scripts/` and `evals/`** (`TD-169`). It ran `tsc` over a program
  holding neither tree, so every ported checker sat outside it while the leg printed
  `clean (0 errors)`. Widening it surfaced two real `TS18047` in `qa-verdict.ts`, both fixed. A
  retained population fixture reddens if the program narrows again, and it runs in the gate, not
  only under `bun test`.
- **Bootstrap failures stop hiding at a one-space column** (`TD-157`). The site set was re-derived at
  **28 / 16**, not inherited as 27 / 15. 5 go through a shared `fatal()`, 15 are columned inline, and
  8 are named and left alone with the reason written at the code (an inner checker whose wrapper
  strips exactly one space; fixture-report lines no selector keys on). The retained guard was
  hardened over two outside-review rounds: a shell `case` arm is no longer mistaken for a comment,
  and every script file is either scanned or ruled out by name.

### Changed
- **The gate's cost and ranking comments were re-audited against Rounds 16/19/21**: 94 examined by
  two disagreeing routes, 4 corrected, comments only.

### Not done
- **The gate total was not re-measured** (`TASK-357`). One `QA_FULL=1` run completed at 1863 s
  (`275 pass, 4 fail`, all four in this sprint's own bookkeeping, since fixed) but under paging,
  so it is not a figure. The next run was reaped for memory. SPRINT-103's A3 and ADR-039's
  `layers-observed` ruling stay open.

**Filed:** `TD-177` · `TD-178` · `TASK-368` · `L-212`. **Resolved:** `TD-169` · `TD-157`.
**Annotated:** `TD-154` (re-found without a ledger search) · `TD-167` (empty-capture symptom).

---

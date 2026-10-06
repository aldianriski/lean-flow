---
owner: Maintainer
last_updated: 2026-10-06
update_trigger: Sprint completed and changes reflected in docs
status: current
---

# lean-flow — Changelog

<!-- Prepend new sprints — newest first. Append-only; never edit past blocks. -->

> **Older than the two minors below** → [`docs/changelog/`](docs/changelog/) — rotated verbatim at
> each new MINOR and reachable only from here (STANDARD §11).

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
## v1.66.1 — The gate's truncation costs the fewest guards (2026-09-22)

**Released — PATCH.** All four `*-plugin/*.json` manifests and the `README.md` footer moved
together, derived with `grep -l '"version"' .*-plugin/*.json`.

### Fixed
- **`qa_budget_check` refused nothing.** A non-numeric budget made `[ "$elapsed" -gt "$budget" ]`
  error, the `if` read that as false, and the function fell through to `OK` / exit 0 — forever.
  Measured: `qa_budget_check 0 abc 0` returned **`OK 1790032685 abc`**, reporting OK at 1.79
  billion seconds elapsed. A silent false negative in the mechanism whose only job is bounding a
  run, reachable from any caller passing an env var through unvalidated. Now refuses by name with
  a distinct exit 2 (`UNUSABLE`), so a caller can tell "over budget" from "budget unusable".
  5 retained fixtures incl. a must-NOT-catch control, proven to discriminate by a seeded break.

### Changed
- **The always-on eval-harness set is ordered cheapest-first.** It was chronological, so
  truncation dropped whichever harnesses happened to be newest. Now, if a run exceeds its budget,
  it drops the dearest instead — verified live: at a 200s budget the skipped set is exactly the
  expensive tail. Per-harness costs are recorded beside the list and flagged as a snapshot (L-130).

### Reverted before release
- **A `night-run.sh` budget raise, which was a regression.** It read ADR-042's "a caller that
  knows it is detached may raise it" as licence — but that sentence's antecedent is
  `QA_CEILING_SECONDS`, a different variable, and **the pre-flight gate call is not detached**
  (it is synchronous; the only `nohup` is 144 lines below). Unbounded, the launcher reached ~955s
  in one foreground call against a 600s ceiling: killed mid-pre-flight with no verdict, strictly
  worse than the bounded refusal at ~560s it replaced. Caught by an outside review before it ran
  anywhere real. The correct fix — the caller **declaring** detachment — is `TASK-367`.

## v1.66.0 — Hooks become admissible; the first candidate is withdrawn at review (2026-09-21)

**Released — MINOR.** All four `*-plugin/*.json` manifests and the `README.md` footer moved to
`1.66.0` together, derived with `grep -l '"version"' .*-plugin/*.json` rather than from a list
(the DoD line that enumerated a subset was read as exhaustive twice).

### Added
- **`scripts/lib/check-prose-density.ts`** — gate leg 2b-ter. `check-doc-caps` counts newlines, and
  a markdown file satisfies a newline cap by writing longer lines: `.claude/CLAUDE.md` held 63 lines
  against a cap of 80 while its content grew **2.62x** after the cap was reached, longest line
  **6,681 characters**. `STANDARD` §157 already forbade the squeeze and nothing checked it. Built as
  a **ratchet** (FAIL only when a file gets denser than its recorded baseline), because `TD-174`
  records what report-only achieves. It caught its own author within minutes of being wired.
  Population **derived** from the same source `check-doc-caps` uses — 84 files, after an outside
  review found the first version examined 16 against 78 capped ones (L-186). Table rows are measured
  by longest **cell**, closing a `| `-prefix bypass that was already live. 10 retained fixtures,
  each branch proven to discriminate by a seeded break.

### Changed
- **`ADR-044` — hooks and agent definitions are admissible**, held to `ADR-001`'s curation bar.
  `ADR-001` had explicitly **rejected** "no agents / no hooks, ever" as too extreme; the blanket
  line was a *proxy* for curated that began being enforced in place of it. `ADR-011` is
  **superseded in part** on the record — its real objection was the platform fact that hooks
  auto-activate with **no per-hook disable**, making any shipped hook mandatory for every consumer.
  That sets a new standing bar: a hook must be worth being mandatory, measured on real input.
  `ADR-002` is **untouched** — it contains no hook clause (`grep -ci hook` → 0).
- **The `"no X"` banner is retired across the consumer surface**, and one member was **flatly
  false**: `/lean-doc-generator init` is titled *"Scaffold a fresh repo"* and has shipped for a long
  time, while the README's second line denied it. A negative claim has no diff that ever makes it
  look wrong. Component claims now **describe the roster**.

### Withdrawn
- **`ask-dont-tell`, a `Stop` hook for `L-002`** — built, reviewed worktree-isolated, and **not
  shipped**. Measured against 48 real transcripts (5,451 assistant blocks, 746 completed turns) it
  would have blocked ~35 turns with **~22 false positives (≈60%)** while missing ≥9 genuine inline
  decisions — 8 of those because its patterns were English-only and the maintainer works
  bilingually (`Mau saya …?` *is* "Want me to …?"). Its 7 fixtures could not see any of this: both
  blocking fixtures were keyed to patterns firing **0 and 2 times** in the corpus, and deleting
  every pattern that *does* fire left the suite fully green. Withdrawn under ADR-044's own clause —
  narrow it or withdraw it, never widen the fixtures until it looks green — and re-filed as
  **`TASK-366`**. No consumer-visible change: the roster is unchanged and Bun remains not required.

---
## SPRINT-103 — Port the Measured Hotspots (2026-09-21)

**Unreleased — no version bump.** `skills/`, the four `*-plugin/*.json` manifests, `README.md` and
`spec/` are untouched (derived from `git diff --name-only bfa3fec..HEAD`, not judged). The one
consumer-facing file in the diff, `scripts/lib/conformance-engine.sh` (ADR-027), changed by **16
comment lines only** — `sh -n` clean, byte-identical output and exit code against the pristine copy
over the full 100-rule spec. No consumer-visible change ⇒ nothing to release. Spec unchanged at
0.11.0. **23 of 34 DoD `[x]`, 11 `[~]` n/a, 0 open** — each n/a carries inline the ruling that made
it inapplicable, because closing 34/34 when 11 were never applicable reads as more work than
happened (L-088).

**The sprint measured first and ruled four of its five targets unportable — and that is the result,
not a shortfall.** SPRINT-102 inherited TD-090's harness ranking, ported five checkers and moved the
gate by nothing; Round 16, the first profile of a *completed* gate, held none of them in the top 20.
So every task here opened with its own measurement, and "ruled unportable, mechanism recorded" was an
accepted outcome (D2). It happened four times, and each ruling names a different mechanism.

**T1 — 305 s, and a port would have recovered almost none of it.** `conformance-engine.sh` costs
**2.93 s against an empty directory** with the shipped 100-rule spec and 0.35 s with zero rules —
~26 ms per rule of dispatch paid whether or not anything is checked. The harness makes **68** engine
invocations, so **199 s of its 305 s is dispatch inside the program the port would still have to
call 68 times**. Ruled not spawn-shaped. The cost was then removed anyway, on the caller side: the
harness now hands the engine an **awk-derived 43-rule spec** (§9+§10+§11+§12), reduced from the
shipped `spec/STANDARD.md` at run time and carrying a per-section drift anchor. Six alternating runs,
**319.2–354.6 s → 136.7–184.0 s, non-overlapping**; median 341.0 → 149.8 s. Output byte-identical,
69/69 verdict lines, 0 FAIL both arms, same cases and same findings (D6 holds). **The trap that
nearly shipped:** the harness header claimed §9+§10, which is 26 of its 68 cases — a reduction built
on that prose would have left 40 assertions with no rule to fire, and **40 of the 68 are
`assert_absent`**, which passes when a finding does not appear. All of them would have gone green
testing nothing. The required set was derived twice, by two mechanisms sharing nothing (case-name
prefixes, then the 23 distinct finding slugs mapped back to the emitting engine function), and both
returned exactly {§9, §10, §11, §12}.

**T2 — the one target of five whose cost was genuinely spawn-shaped, ported.**
`check-layers-observed.sh` (644 lines) → `check-layers-observed.ts` (512), oracle **retained** under
D5. 59% of its CPU is `sys` and a third of its wall is not CPU at all: 29 throwaway git repos, ~92
git spawns, ~30 non-git forks per file. Gate **leg 15** now runs the port: **20.57–21.14 s →
2.76–3.69 s** over three alternating pairs, ~6× and non-overlapping, output byte-identical and exit
code equal on every pair, `sys` 10.3–11.4 s → ≤0.02 s. Parity: 25/25 identical (exit code + stdout)
over 19 built git fixtures **plus 103 real sprint files**, with a `population-3a-non-empty` case
asserting the active-corpus comparison produced real output — the two-empty-outputs-agree shape that
passed twice in SPRINT-102 is explicitly guarded.

**T3 — ruled, not ported, and the ruling is recorded in all three places its different readers
reach (ADR-043 · the engine's own header · TD-168).** Leg 2f-ter's sweep runs **173.1 s real / 53.8
user / 81.1 sys** — 60% `sys`, corpus size executed as per-file spawns, with fixed dispatch only 1.7%
of it. That **inverts T1's conclusion for the same program, and both hold**: two different costs in
one binary. A port is the right instrument and was ruled out of scope here for a reason that survives
the sprint — exit-code and report-text parity are reversible, but **shipping a `bun` requirement to
adopters is not**, and `conformance.sh` answers for any repository under ADR-027. **T4** split
(~50 s engine, out of reach under ADR-043; ~56 s portable fixture construction → **TD-171**).
**T5** is wait-bound by construction: two runs **0.1 s apart while their CPU totals differed by more
than 2×**, because case 2 must sit out a 60 s `timeout` to demonstrate the silent shape TD-084
exists to stop. The wait *is* the assertion.

**Four worktree-isolated outside reviews; four confirmed defects; none found by the author.** The
sharpest was a real port defect that **25/25 parity, 37/37 assertions, 103 real files and a seeded
break were all structurally blind to**: the oracle's unanchored greedy `sed` takes the **last**
`(SPRINT-N Tn)` citation in a subject, the port's `.exec()` took the **first**, and `git log --all`
over this repository's entire history holds **zero** two-citation subjects — first-match and
last-match agree on every input that exists. The reviewer's brief named seven admitted-skipped
branches and all seven came back clean; the defect sat on an axis nobody had enumerated (**L-207**).
The others: a header tally reading 66 against the 68 cases in its own paragraph (two `assert_absent`
calls written with two spaces, in a header whose thesis is that a file's prose about its population
is not evidence); a fixture whose anchor extraction grabbed a planted decoy `awk` line, now bracketed
by three exactly-once sentinels and behaviourally probed **per section**, since a 43-row decoy that
drops §9 entirely passed the total-only probe; and a stale rationale comment in `qa-check.sh`.

**Also shipped.** **TD-170 resolved** — `is_governance_commit()`'s allow-list now admits
`docs/sprint/` in both implementations, so a file that is already unreportable can no longer
*disqualify* the commit carrying it; retained pair includes an **over-exemption control**
(`{TODO.md} + {scripts/real-code.sh}` must still be reported), and the discrimination proof reddened
exactly the motivating fixture with both control assertions green. Leg 12 now dispatches `.ts`
harnesses and its census glob admits them — the new fixture actually runs in the gate, which was the
whole point of the wiring diff. `.claude/CONTEXT.md` § Sprint model now states leg 15's attribution
rules in prose: they were enforced in code and written nowhere a committer reads (L-151). ADR-039's
opt-in split applied for three differentials (~104 s); `layers-observed` (189.3 s) stays excluded and
named, its ruling deferred to **TASK-357** until a re-measured gate total exists.

**Closed without a full-profile gate run**, on the record: the host sat at **3.0% free memory
(428 MB of 14,078 MB)** — the condition that killed this sprint's Wave 0 — and a wall-clock figure
taken under paging measures swap, which is the same ruling Round 17 made. The sprint's own **A3 is
therefore recorded NOT confirmed**, and TASK-357 owns both it and the deferred ADR-039 ruling. The
last completed gate read `214 pass, 9 fail`, every finding dispositioned in the Execution Log: seven
fixed, two `review-depth-*-absent` answered by dispatching the missing review rather than by
downgrading the classification that triggered them, and one commit ruled genuinely unattributable.

**A claim frozen in a commit message was false, and the retraction is part of this record.**
`ccd6c6c` asserts *"leg 15 now exits 0 on both … the close blocker is cleared."* The check ran while
the fix was **uncommitted**, where the checker takes its WIP leg; committing the fix added a commit
that was itself unattributable, and both implementations then exited 1. The claim was true when
measured and false by the time it was written — **the act of recording it is what broke it**
(**L-206**). `ccd6c6c` and `e9c7e14` are exempted for this sprint only, history not rewritten,
because their shas are cited by name in ADR-043 and TD-170's evidence trail.

`TD-168` (high) · `TD-169` (high) · `TD-171` · `TD-172` filed · `TD-170` **resolved** · `TD-167`
annotated with its second sighting · `TASK-356` filed mid-run, `TASK-357` filed `origin: close-retro`
· **L-206** · **L-207** · **L-208** filed · `ADR-043` written.

---
## SPRINT-102 — Make the Gate Green (2026-09-20)

**Unreleased — no version bump.** `skills/`, the four `*-plugin/*.json` manifests, `README.md` and
`spec/` are untouched (derived from `git diff --name-only ef02be0..HEAD`, not judged), and the three
changed scripts are this repo's own tooling rather than ADR-027's consumer-facing conformance
engine. No consumer-visible change ⇒ nothing to release. Spec unchanged at 0.11.0. **17 of 18 DoD
`[x]`, 1 `[~]`.**

**The ceiling was ruled against the measurement (`ADR-042`, T1 · TD-117 · TD-090).** For four sprints
the direction rested on TD-117's *"raising the budget cannot work, the 600 s ceiling being
external."* Two detached full-profile runs completed at **1263 s** and **1370 s** — 2.1× and 2.3× the
ceiling — ran every harness, truncated nothing, and printed their own verdicts. The constraint is a
**foreground-call** limit, and the assertion was unfalsifiable in the direction it claimed:
`qa_ceiling_check` runs ~20 lines before the verdict, so its FAIL branch could only ever fire in runs
that were *not* killed, while its message read *"a run past the ceiling is killed from outside with
no verdict line."* The branch now prints an **uncounted INFO** naming the elapsed figure, the
not-killed fact and the foreground caveat. The trade-off is recorded rather than smoothed: a
genuinely too-slow gate now reports where it used to fail, and TD-117's own *"cheaper still to learn
to ignore, which is how a guard dies"* applies to the line this creates.

**Three Bun harnesses were reporting `only 0 test(s) ran` over green suites (T2).** `run-dod-delta-`,
`run-s4-ts-evaluators` and `run-s4-differential-parity` parsed `bun test` output without stripping
ANSI, so **156 assertions ran and were never counted**. Fixed; discrimination proven live and then
reverted, which is filed honestly as **TD-165** rather than claimed as a retained fixture — these
three wrap real production test files instead of a fixtures directory, so retaining a must-FAIL would
mean a permanently broken shipped test or new shell scaffolding.

**An unmatched task-shaped commit subject now FAILs loudly (T4 · `TASK-351` · L-202).** Rule 7 in
`attributeClaim`: a first token that looks like a task but matches no structural arm returns
`unmatched-shape` and names the subject, instead of falling through to a silent coord/unscoped pass.
Its first fix **reintroduced the class it closed** — the exclusion scanned arbitrary free text
case-insensitively, so any subject whose prose merely contained a `T<digit>` substring was re-exempted
— caught by a worktree-isolated outside review and sent back as a bounded retry rather than patched
by the coordinator. Reach, re-derived by that reviewer over four independent populations (commit
ancestry, `main`, `git log --all` including ~90 unmerged agent branches, and `git fsck --unreachable`):
**exactly 1 subject in this repository's entire history**, which is the retained fixture.

**The close found two defects nothing else had.** The first completed system-verify in this sprint
printed `226 pass, 2 fail`: a harness file changed twice by T4 and declared by no task (fixed, fourth
`Layers:` correction of the sprint), and a commit that ticked another task's DoD under its own
subject. The second is true and cannot be fixed forward — filed as **TD-166** with **L-205**, because
the leg's population is scoped to the *active* sprint, so the finding clears by closing while ADR-021
blocks the close on it. Closed on an owner ruling, with the defect carried rather than waived.

`TD-165` · `TD-166` filed · `TASK-354` filed `origin: close-retro` · **L-205** filed · **L-108**
bumped to count 15, **L-120** to ×6 and **L-151** to ×5 — every one of those three a sighting where
the promoted rule was loaded and cited in the same session it failed to reach.

---

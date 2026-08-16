---
sprint: 071
slug: cite-not-restate
epic: EPIC-003
owner: Maintainer
last_updated: 2026-08-16
gates_signed: G1,G2 @ 0ab0e01
plan_commit: fd4ba3a
close_commit: [sha — set at close]
status: closed
update_trigger: sprint execute/close events
---

# SPRINT-071 — Cite, Not Restate

> **Theme:** EPIC-003's third and intended-final member. The spec is now separable (SPRINT-069),
> versioned and pinnable, and specifies the top conformance level (SPRINT-070) — but every rule it
> owns is still *also* stated inside the skills, so an adopter who pins `spec/` has pinned a document
> the implementation does not defer to. This sprint makes the deferral real, then checks whether the
> spec can actually stand on its own. If both land, EPIC-003 closes.

## Scope

**In:** classify every candidate restatement across the 15 non-template skill files and rule the
local-fact boundary (T1) · convert the flagged ones to citations under ADR-023's move+cite discipline
(T2) · audit the spec standalone for tool-buildability and close or consciously defer every gap (T3).

**Out (deferred):** the **23 template files** — ruled out of scope at this promote (D1) · building
EPIC-004's conformance engine, which is what would make these rules machine-checkable rather than
merely single-homed (TD-052's territory, re-reviewed and held at this promote) · TASK-218 and
TASK-219, both `ready` and deliberately not pulled — this sprint is one dependent chain and adding a
disjoint task would not shorten it · TASK-188, still `blocked` on an opportunistic trigger.

## Plan

### T1 — Inventory every spec-owned rule restated across the skills, and rule the local-fact boundary `[size: M · risk: med · class: decision · HITL]`
Layers: `docs/sprint/logs/SPRINT-071-cite-not-restate.md`
Depends-on: none
Cites: EPIC-003 § Closed-when 2 · ADR-023 (`spec/` is SSOT for standard-owned rules; move+cite
       atomic) · `spec/STANDARD.md` (read-only here — the target of every citation this classifies) ·
       L-108 (match by shape, not substring) · CLAUDE.md § cross-check a query
The candidate set was measured at promote — 38 files, of which 15 are non-template — but a raw match
cannot tell a restatement from a citation, because both mention the same section. The classification
is the deliverable; the conversion that follows it is mechanical once the worklist exists.

**Acceptance:** every candidate site in the 15 files is classified into one of three buckets, and a
reader of the worklist can act on it without re-deriving the judgement.

**DoD:**
- [x] All 15 non-template files inventoried, every candidate site classified **restatement** ·
      **already-a-citation** · **legitimately-local** — *Verify: the three bucket counts sum to the
      site census taken at promote; a site in no bucket is an unfinished inventory, not a pass*
- [x] The **legitimately-local** bucket carries a stated reason per entry — a project fact the spec
      does not own, named — *Verify: no entry reads only "local"; converting one of these would point
      a reader at a spec section that does not contain the rule*
- [x] The worklist names file · line · target `spec/` § for every **restatement** entry —
      *Verify: each cited § exists in `spec/STANDARD.md` at its current version*
- [x] The inventory's own query is cross-checked before its result is acted on — *Verify: a second
      query disagreeing or reconciling (bucket sum vs census), plus one seeded site the scan must
      detect; a negative control alone proves only that it fires on rows it reached (L-105 · L-108)*

### T2 — Convert every flagged restatement to a citation of the spec `[size: M · risk: med · class: execution · HITL]`
Layers: `skills/` (the flagged subset of T1's 15 — bounded by the worklist, corrected live per L-100)
Depends-on: T1
Cites: ADR-023 (no commit leaves a rule stated twice) · L-015 (consumer-facing surface) ·
       L-125 (a self-describing corpus is unsafe to edit by token) · L-009 (re-read structure after edit)
Owns `skills/**` for this sprint. The conversion is per-file atomic because ADR-023 forbids an
intermediate state where the rule is stated in both places.

**Acceptance:** no file on the worklist still states a rule the spec owns, and every skill remains
usable by someone who has the plugin and has never opened `spec/`.

**DoD:**
- [x] Every **restatement** entry converted to a citation naming its `spec/` § — *Verify: re-run T1's
      inventory query; the restatement bucket is empty and the citation bucket grew by exactly that
      count*
- [x] Each conversion is **atomic within its commit** — no commit leaves the rule in both places
      (ADR-023) — *Verify: `git show <sha>` per touched file shows the deletion and the citation in
      the same diff*
- [x] **Routing preserved, rule text removed** — a skill still tells its reader that a rule applies
      here; only the restated text goes — *Verify: read each converted file as a consumer without
      `spec/` open; the skill must remain executable (L-015)*
- [x] Structure re-read after every edit, not trusted from the diff — *Verify: L-009/L-125 — a
      markdown list or table edit can fuse neighbours while grep and line caps stay clean, and this
      corpus contains prose about its own rules*
- [x] Gate green, and the line caps still hold for every file touched — *Verify: `sh scripts/qa-check.sh`*

### T3 — Audit whether the spec alone is sufficient to build a conformant tool `[size: M · risk: med · class: decision · HITL]`
Layers: `spec/STANDARD.md` · `spec/CHANGELOG.md` · `docs/epic/EPIC-003-the-standard.md`
Depends-on: T2
Cites: EPIC-003 § Closed-when 5 · ADR-024 (the three levels a tool would check) · ADR-025 (§13's
       claim-vs-proof boundary) · L-016 (verify on the consumer path when the repo cannot dogfood it)
Owns `docs/epic/EPIC-003-the-standard.md` — it ticks **both** conditions 2 and 5, so the epic file has
a single writer this sprint despite two conditions closing (see D2).

**Acceptance:** for every check a conformance tool would perform at each level, the audit names the
`spec/` section defining it — or records why that gap is EPIC-004's rather than the spec's.

**DoD:**
- [x] Each of ADR-024's three levels walked, every check a tool would perform mapped to its defining
      `spec/` § — *Verify: the audit names a § per check; "implied by §N" is a gap, not a mapping*
- [x] Every gap either closed in `spec/` (bumping the spec version + changelog) or recorded as a
      deliberate EPIC-004 boundary with its reasoning — *Verify: no gap left unrouted; a silent gap is
      the spec-only-debt trap (L-007)*
- [x] Read as an adopter **without the plugin installed** — *Verify: the audit states which sections
      were reachable from `spec/` alone; this repo cannot become that reader by accident, so the
      consumer path is traced deliberately (L-016)*
- [x] EPIC-003 § Closed-when **2 and 5** ticked with their evidence, or the shortfall named —
      *Verify: the epic file; the gate's epic-archive leg still reports the epic correctly live*
- [x] If every condition is now `[x]`, the epic is proposed for close — *Verify: all five conditions
      re-read at once; a member sprint closing is not an epic closing, and §11's epic-archive move
      needs owner approval*

## Decisions (pre-locked)

- **D1 — Templates are out of scope for condition 2.** A template is *rendered output*, not procedure:
  the doc it produces is read by a consumer who may not have `spec/` at all, so carrying the guidance
  inline is correct by design rather than a duplicated rule. This scopes the sweep from 38 candidate
  files to **15**. Ruled at promote so T2's size is known before the Plan freezes — leaving it to T1
  would have put a scope-defining ruling inside a frozen Plan, which is the trap the size-check rule
  exists to prevent. **→ no ADR** (reversible, and it narrows rather than commits).
- **D2 — T3 owns `docs/epic/EPIC-003-the-standard.md`, even though T2 completes condition 2.**
  Two conditions close in one sprint and the file that records both has one writer. The chain
  `T1 → T2 → T3` gives the preflight a transitive ownership path, so the overlap is owned rather than
  unowned. **→ no ADR.**
- **D3 — The sprint is a single dependent chain, deliberately.** T1's output is T2's input and T2's
  completion is what makes T3 meaningful, so there is no parallel wave and no worktree dispatch here.
  A disjoint backlog task was considered and declined: it would add wall-clock without shortening the
  chain. **→ no ADR.**

## Assumptions

- **A1** — The candidate set is **38 files**, splitting **15 non-template / 23 template**, carrying
  **39 distinct (file,line) sites** in the 15 — and the raw count conflates restatements with correct
  citations. *Confirm: files re-derived at G2 (23+15=38 ✓). **The site figure is CORRECTED from the
  `~121` written at promote** — that was the sum of eight overlapping per-section scans, double-counting
  lines that matched two patterns. Owner-ruled 2026-08-16; full provenance + impact in the Execution
  Log's `scope-change` entry. T1 must reconcile against **both** this figure and its own re-derivation,
  which must agree (L-097).*
- **A2** — Only `skills/lean-doc-generator/SKILL.md` currently cites `spec/STANDARD.md`. *Confirm:
  `grep -rln 'spec/STANDARD.md' skills/`, read 2026-08-16 — 1 of 14 skills.*
- **A3** — Governance at this promote: L-promotion **none** (107 entries reconciled: 74 open, 33
  already promoted) · TD aging **TD-052 and TD-048 re-reviewed and held**, both unblock conditions
  unchanged · TD-055 **deleted** per §11 · no §2 cap breach (58 governed files, tightest 122/130).
  *Confirm: governance checklist, owner-signed 2026-08-16.*
- **A4** — `spec/STANDARD.md` is **595 lines and has no §2 row**, so nothing caps it while T3 may add
  to it. Filed as **TD-058** with **TASK-219** as its vehicle; not resolved here. *Confirm:
  `check-doc-caps.sh` reports zero rows for `spec/`, measured 2026-08-16.*
- **A5** — Skills in this session run **1.41.0 against a 1.44.0 repo**. Procedures must be read from
  `skills/` in the repo, not the plugin cache — and T2 *edits* those files, so a stale cached copy
  would be edited against the wrong baseline. *Confirm: `/prime` freshness row; L-021, third sighting.*

## Execution Log

> **Lives in its own file** — `docs/sprint/logs/SPRINT-071-cite-not-restate.md`, rendered from
> `templates/sprint-log.md.template` and created lazily at the first entry. Append there, never here:
> the Log grows with the work done, so keeping it out of this file is what stops it consuming the
> 400-line budget the Plan needs (STANDARD §9 · ADR-014). The `logs/` subdirectory is load-bearing —
> the sprint-file checks glob `docs/sprint/SPRINT-*.md` non-recursively, so a same-directory
> `-log.md` sibling would be capped and schema-checked as if it were a Plan.

## Files Changed

<!-- Filled during execution; feeds CHANGELOG at close. -->

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| `docs/sprint/logs/SPRINT-071-*.md` | T1 | the 39-site inventory + three-bucket worklist — the deliverable, since the conversion is mechanical once it exists | low | bucket sum reconciles to census (39) + seeded-gap control |
| `skills/council/SKILL.md` | T2 | §4's three-test restated beside its own citation → cites §4 only | low | scan re-run; site leaves the pattern |
| `skills/prototype/SKILL.md` | T2 | §4's three-test, uncited → cites §4 | low | as above |
| `skills/lean-doc-generator/SKILL.md` | T2 | three sites: §4 three-test (a **table row** — L-009 re-read), §3 header mandate, §2 placement gloss | med | scan re-run + table neighbours re-read whole |
| `skills/lean-doc-generator/references/init.md` | T2 | §2 placement gloss → cites §2; the generator reads the standard first, so nothing is stranded | low | consumer read-back without `spec/` open |
| `spec/STANDARD.md` | T3 | **§9 gains `gates_signed:` and the `*Verify:*` clause** — the two definitions Gated was unreadable without; version 0.2.0 → 0.3.0 | **high** | §13's forward reference to §9 now resolves; both gaps re-scanned |
| `spec/CHANGELOG.md` | T3 | 0.3.0 entry naming both gaps and why they were spec-owned rather than EPIC-004's | low | gate |
| `docs/epic/EPIC-003-the-standard.md` | T3 · close | conditions 2 and 5 ticked with evidence; member row completed; epic archived | med | all five conditions re-read at once |
| `CHANGELOG.md` · 4 manifests · `README.md` | close | v1.45.0 MINOR; v1.43.0 rotated out per §11 | low | `check-manifest-lockstep.sh` 4/4; every rotation link resolves |
| `TECH-DEBT.md` · `docs/LEARNINGS.md` | close | TD-060 filed, TD-058 growth updated; L-129 · L-130 filed | low | gate |

## Retro

**Retrieval check** — did we fail to find, or contradict, a prior `L-NNN`/ADR this sprint? **Yes,
once, and it was self-inflicted at the spec level.** §13 — written last sprint — referenced
`gates_signed:` as living in "§9", and §9 never defined it. The reference was authored, reviewed and
committed without the target ever being opened, which is not a retrieval *failure* so much as a
retrieval that was never attempted: a cross-reference is an assertion about content someone else owns,
and nothing treats it as a claim needing verification. Filed as **L-129**. A second, milder instance:
A1's census was wrong at promote and A2 was true-but-misleading — both caught by re-derivation at G2
and T1, neither by recalling a rule. That is now the fifth and sixth stale figure across two sprints.

**Cost** — coordinator inline, all three tasks, no dispatch. T1 and T3 are `class: decision`; T2 was
ruled inline because its hard part was per-file judgement over six sites. Zero agent tokens. The
sprint's expensive part was reading, not writing: 39 sites classified to produce 6 edits.

**Worked**
- **The three-bucket triage was the right shape, and the numbers justify it retroactively.** Treating
  the scan as a *triage input* rather than a defect list turned "sweep 15 files" into "convert 6
  sites". A sweep run straight off the grep would have touched 33 correct sites.
- **Ruling D1 at promote instead of inside T1.** Templates were 23 of 38 candidates; leaving that
  boundary to T1 would have put a scope-defining decision inside a frozen Plan and cost a
  `scope-change` on a Plan minutes old. It cost one popup at promote instead.
- **Looking for the fact that dissolves a trade-off, rather than weighing it.** T1 flagged the §2
  placement gloss as a real L-015 tension; one line (`SKILL.md:30`, "Read first") made it vanish.
- **DoD 3's without-the-plugin constraint earned its place.** It is the only reason Gap A was found;
  every other reading path has `gates_signed:` documented somewhere in `skills/`.

**Friction**
- **A criterion frozen at promote was unsatisfiable as written** (A1's 121 vs the real 39), caught at
  G2 before any task ran. Cheap here only because G2 re-derives; a sprint that trusted its own
  assumptions would have discovered it inside T1 with the Plan already committed.
- **The raw scan count cannot measure progress and briefly looked like it could.** After T2 the census
  moved 39 → 36, which is correct — three conversions removed the matched phrase entirely, three kept
  matching as citations — but "count went down" and "count held" are both consistent with a correct
  conversion. Only the bucket classification measures anything.
- **Nothing checks that a spec-internal cross-reference resolves.** §13 → §9 dangled through a full
  sprint and a green gate. → **TD-060**.
- **Skills ran 1.41.0 against a 1.44.0 repo for a third consecutive sprint**, and this one *edited*
  `skills/`. Safe only because every read and edit went through the repo source, which is reaching
  past the stale copy rather than following it (L-021).

**Pattern candidate** (surface to user → `docs/LEARNINGS.md`) — **L-129 filed**: a cross-reference is
an assertion about content you do not own, and it reads as correct until someone opens the target;
verify the target contains what the reference claims, at the moment you write it. **L-130 filed**:
the cross-check-a-query discipline does not fire while *authoring a criterion*, because authoring
feels like planning rather than querying — which is how a wrong number gets frozen into a DoD in the
same session that writes the rule against wrong numbers.

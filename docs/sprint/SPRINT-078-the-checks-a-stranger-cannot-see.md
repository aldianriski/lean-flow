---
sprint: 078
slug: the-checks-a-stranger-cannot-see
epic: EPIC-004
owner: Maintainer
last_updated: 2026-08-21
status: active
plan_commit: [sha — set at promote]
close_commit: [sha — set at close]
update_trigger: sprint execute/close events
---

# SPRINT-078 — The Checks a Stranger Cannot See

> **Theme:** Five of EPIC-004's rules already have working, fixture-guarded checks that no adopter has
> ever seen — `check-attestation.sh` is reachable only from `qa-check.sh`, while the consumer entry
> point `conformance.sh` execs the engine alone. Making those visible is a migration, not a build, and
> it buys more coverage per line of new assertion code than anything else in the backlog. Two §2/§6
> shape families ride along. Coverage **19 → 30 of 62**.

## Scope

**In:** §13's five attestation checks migrated into the engine with findings byte-identical · §2/§6's
tier doc-set family as one check with the tier as a parameter · §2's README ownership footer · the
dispositions register reconciled to the post-migration counts.

**Out (deferred):** the §9 · §10 · §11 · §12 coverage slices (TASK-248 … TASK-252, in Backlog, ~16
rules) · the ruling on the 11 `scope-out` rules (TASK-254) — § Closed-when 2's other half, deliberately
not raced against the coverage work · **the register's residual cap overage**: this promote's prune took
`conformance-dispositions.md` 206 → 184 against a 130 soft cap by removing superseded figures only. The
file's own header cites L-131 — *split, never squeeze* — so closing the remaining 54 lines means moving
§ Artefacts to its own file, which is a decision for close, not a squeeze now. TASK-238 cites that
section, so it does not move silently.

## Plan

### T1 — Migrate §13's attestation checks into the engine `[size: M · risk: med · class: execution · HITL]`
Layers: scripts/lib/conformance-engine.sh · scripts/lib/check-attestation.sh · scripts/qa-check.sh · evals/run-attestation-fixtures.sh · docs/research/conformance-dispositions.md
Depends-on: none
Cites: spec/STANDARD.md §13 Conformance table · `conformance.sh` (the consumer entry point — read, not modified) · `S13.NOINFER` · `S13.NOTAUTHOR` (excluded by Mark; demonstrated, never asserted) · docs/research/conformance-dispositions.md § build · SPRINT-075 T4 (the `gates_signed` migration precedent)
The checks exist and are guarded; what is missing is reach. Migrating them the way `gates_signed` moved
— dispatch from §13's own Conformance table, findings unchanged — turns five invisible rules into five
an adopter can act on, and repairs the count divergence the register has flagged since SPRINT-074.

**Acceptance:** `conformance.sh` run against a repository that never installed lean-flow reports all
five §13 findings, and their text is byte-identical to what `check-attestation.sh` prints for the same
repository.

**DoD:**
- [ ] The engine answers §13's five rules, dispatched from §13's Conformance table at runtime — *Verify: `sh conformance.sh <foreign-repo>` names all five findings*
- [ ] Finding text byte-identical to `check-attestation.sh`'s — *Verify: `diff` of both tools' output on one repo returns empty; diffed, never eyeballed*
- [ ] `attestation-unsigned-claim-only` still reported at exit 0, not as a gate failure — *Verify: the run's own exit code is 0 with that finding present in its output*
- [ ] Existing retained attestation fixtures pass unchanged — *Verify: `sh evals/run-attestation-fixtures.sh` verdict line (`N pass, M fail`; M is the verdict)*
- [ ] `S13.NOINFER` / `S13.NOTAUTHOR` stay excluded by the spec's Mark column, not by a skip list — *Verify: re-mark one in a spec copy; engine behaviour changes with no code edit*
- [ ] Register reconciles to 24 covered / 27 build / 11 scope-out = 62 — *Verify: re-derive by counting rule ids in each section table, never by editing the header*

### T2 — Cover §2/§6's tier doc-set family `[size: S · risk: low · class: execution · AFK]`
Layers: scripts/lib/conformance-engine.sh · evals/run-conformance-engine-fixtures.sh · docs/research/conformance-dispositions.md
Depends-on: T1
Cites: spec/STANDARD.md §2 (the `Create ←` cells) · spec/STANDARD.md §6 Conformance table — `S6.BASE` · `S6.BACKEND` · `S6.MEDIUM` · `S6.MULTISVC` · docs/research/conformance-dispositions.md § build
Five rules, one finding, one check — the register already dispositioned this as *the tier is a
parameter, not four checkers*. Deriving the required doc-set from §2's own cells is what stops it
becoming a hard-coded list that drifts from the table it copies.

**Acceptance:** a repo at any one of the four tiers, missing a doc that tier owes, gets
`tier-doc-set-incomplete` naming the missing file — and a conformant repo at that tier gets nothing.

**DoD:**
- [ ] One check answers `S2.F-TIER` · `S6.BASE` · `S6.BACKEND` · `S6.MEDIUM` · `S6.MULTISVC` — *Verify: the engine's own `coverage:` line moves 24 → 29*
- [ ] The required doc-set per tier is derived from §2's `Create ←` cells — *Verify: add a row to a spec copy; the required set changes with no code edit*
- [ ] `tier-doc-set-incomplete` fires for each of the four tiers — *Verify: one retained must-FAIL fixture per tier, each asserting the finding string*
- [ ] Each fixture reddens while a sibling control stays green — *Verify: run the harness with the seed applied and again without it*
- [ ] Each seeded artifact still parses and is a targeted break — *Verify: `sh -n` clean, assertion count unchanged, line count within one of pristine (L-142)*
- [ ] Each seed's victim is derived, not hard-coded, and its existence asserted **before** removal — *Verify: the fixture fails loudly if the file was never there (L-146)*

### T3 — Cover §2's README ownership-footer rule `[size: S · risk: low · class: execution · AFK]`
Layers: scripts/lib/conformance-engine.sh · evals/run-conformance-engine-fixtures.sh · docs/research/conformance-dispositions.md
Depends-on: T2
Cites: spec/STANDARD.md §2 (`S2.R-README`) · spec/STANDARD.md §3 (the ownership header) · `S3.README` (the scope-out this check must not contradict) · docs/research/conformance-dispositions.md § scope-out (a)
One rule, one finding. Its trap is definitional rather than mechanical: `S3.README` is scoped out
*because* it restates this rule, so a check here that invents its own footer shape would make the two
disagree and turn a scope-out into a silent gap.

**Acceptance:** a repo whose README carries no ownership footer gets
`readme-ownership-footer-missing`; one whose README carries §3's header gets nothing.

**DoD:**
- [ ] `S2.R-README` answered, firing `readme-ownership-footer-missing` — *Verify: the engine's `coverage:` line moves 29 → 30*
- [ ] The required shape is §3's ownership header, read from §3 — *Verify: `S3.README`'s scope-out reason (*restates a rule checked elsewhere*) still holds with the check in place*
- [ ] Retained must-FAIL fixture + a PASS control — *Verify: harness verdict line, control green while the fixture reddens*

## Decisions (pre-locked)

- **D1 — Overlap ownership.** All three tasks write `scripts/lib/conformance-engine.sh` and
  `evals/run-conformance-engine-fixtures.sh`. No single-owner split is possible, so the tasks
  **serialize** in one tree: commit order **T1 → T2 → T3**, no parallel build and no worktree fan-out.
  T1 first because it restructures dispatch that T2/T3 then extend. Shared files are staged per-hunk
  (`git add -p`) with `git diff --cached` verified before each commit (L-042 · L-037).
- **D2 — §13 migrates; it is not re-implemented.** Findings byte-identical, established by `diff`
  rather than by reading. SPRINT-075 T4 set the precedent when `gates_signed` moved. Not an ADR:
  reversible, unsurprising, and the trade-off is one-sided.
- **D3 — The gate is read from the verdict line it prints,** not from a wrapper's exit code, and each
  gate runs as its own call (L-120). `sh -n`, `cmp` and assertion counts are the guards on every
  seeded break; a green first run proves nothing until a seed has reddened the case that carries the
  claim.

## Assumptions

- **A1** — The register's live counts are 19 covered · 32 build · 11 scope-out = 62 checkable, matching
  what `conformance.sh` reports. *Confirm: re-derived at this promote by counting rule ids in each
  section table (not the header, which was two sprints stale and has been corrected). Re-derive again
  at each task's execution — never copy the figure from this Plan (L-130).*
- **A2** — §13's five checks are reachable only through `qa-check.sh`; `conformance.sh` execs the
  engine alone, so no adopter report has ever contained them. *Confirm: verified at intake 2026-08-21 —
  `conformance.sh` is 17 lines ending in `exec sh "$here/scripts/lib/conformance-engine.sh"`.*
- **A3** — Coverage 19 → 30 assumes §13's five and the §2/§6 family are disjoint sets of rule ids.
  *Confirm: disjoint by inspection at promote; re-check when T3 closes and the coverage line is read.*
- **A4** — No criterion in this Plan rests on a decision G2 has yet to take. *Confirm: at G2, per task,
  ask whether the acceptance depends on anything being decided in that gate — and whether it stays
  checkable if that decision goes the other way (L-111, promoted at this promote).*

## Execution Log

> **Lives in its own file** — `docs/sprint/logs/SPRINT-078-the-checks-a-stranger-cannot-see.md`,
> rendered from `templates/sprint-log.md.template` and created lazily at the first entry. Append there,
> never here: the Log grows with the work done, so keeping it out of this file is what stops it
> consuming the 400-line budget the Plan needs (STANDARD §9 · ADR-014).

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|

## Retro

<!-- Written at close. Route the buckets to durable homes (STANDARD §10):
     shipped → CHANGELOG.md · tech debt → TD-NNN · follow-ups → TASK-NNN · learnings → docs/LEARNINGS.md. -->

---
sprint: 055
slug: wiring-the-standard
owner: Maintainer
last_updated: 2026-08-09
status: active
plan_commit: c4eebef
close_commit: [set at close]
update_trigger: sprint execute/close events
---

# SPRINT-055 — Wiring the Standard

> **Theme:** Every task here is a rule that was written but never wired to run, or a rule that was
> never written where it was needed. The epic-archive row has sat in §11 since the epic layer shipped
> and has executed exactly zero times — EPIC-001 is closed, fully ticked, and still sitting in
> `docs/epic/`. That is the shape of the whole sprint: a standard is only as real as the procedure
> that executes it, and a gate clause is only as real as the field behind it.

## Scope

**In:** the epic-archive step wired into `close` and exercised on EPIC-001 · a retention rule and
archive target for `docs/research/` · an end-of-life for both ephemeral intake artifacts (BUG file,
feature PRD) · `CODE_OF_CONDUCT` admitted to the standard and scaffoldable by `init` · night-run
awareness at every entry point · the G1 fast-path denied to tasks that never met the intake grill.

**Out (deferred):** pruning the 25 existing `docs/research/` files — T3 ships the *rule*, not the
sweep · adopting a CoC for lean-flow itself (it takes the exemption row) · changing
grill-until-frontier-empty, which is already correct and is not what T6 touches · any change to
`docs/product/requirements.md`, which §2 already marks durable (Archive `—`).

## Plan

### T1 — Correct the README repo-layout block and give its counts a check `[size: S · risk: low · class: execution · AFK]`
Layers: `README.md` · `scripts/qa-check.sh` · `scripts/lib/check-count-claims.sh` · `scripts/lib/check-layers-completeness.sh` · `scripts/lib/check-layers-observed.sh` · `evals/run-count-claims-fixtures.sh` · `evals/run-layers-completeness-fixtures.sh` · `evals/fixtures/`
Cites: `.claude/CLAUDE.md` · `docs/architecture/overview.md` — read as the surfaces the check already guards; not edited here
Depends-on: none
The README states a template count that is wrong (says 30 → 32 total; the truth is 32 core + 2
non-core = 34) and omits `.codex-plugin/`. `qa-check.sh` already verifies this count in
`.claude/CLAUDE.md` and `docs/architecture/overview.md` — the README was simply never added to the
same check, which is why it drifted alone. Extend the existing checker rather than writing a new one.

**Acceptance:** the README states 32 core + 2 non-core = 34 and lists `.codex-plugin/`; changing any
one count claim out of lockstep makes `qa-check.sh` fail with a named finding.

**DoD:**
- [x] Confirm the assumption first: read `qa-check.sh`'s existing template-count check and verify it
      covers CLAUDE.md + overview.md but not README.md
- [x] README § Architecture "Repo layout" states the real count and lists `.codex-plugin/`
- [x] The check covers README.md alongside the two surfaces it already guards
- [x] A must-FAIL fixture: one surface's count edited out of lockstep → FAIL with its named finding (L-058)

### T2 — Execute the epic archive at close, not just specify it `[size: S · risk: med · class: execution · AFK]`
Layers: `skills/lean-doc-generator/SKILL.md` (close row) · `evals/` · `scripts/qa-check.sh` · `scripts/lib/check-epic-archive.sh` · `docs/epic/`
Cites: `INDEX.md` — the epic index row is verified to survive the move, not edited
Depends-on: T1 (shared `scripts/qa-check.sh` — T1 owns it first; added by the 2026-08-09 plan-correction)
DOCS_Guide §11 carries the epic-archive row; `close`'s archival pass enumerates sprint, log, Backlog
and TODO scrub, and stops short of the epic. The rule is correct as written — this wires it. The risk
worth guarding is the wrong direction: archiving an epic whose Closed-when conditions are not all
ticked hides unfinished work, which is why the fixture must be the failing case.

**Acceptance:** `close`'s archival pass names the epic move (→ `docs/epic/archive/`, INDEX row
retained) as an enumerated step gated on every member sprint closed **and** every § Closed-when `[x]`;
and EPIC-001 has actually moved.

**DoD:**
- [x] The close archival pass enumerates the epic move with both gate conditions stated
- [x] Exercised on real input: EPIC-001 (closed, all Closed-when `[x]`) moves to `docs/epic/archive/`,
      its `INDEX.md` row stays, and inbound links still resolve (L-007)
- [x] A must-FAIL fixture: an epic with one unticked Closed-when offered for archive → refused with
      its named finding (L-058)
- [x] Fixture retained and wired into `qa-check.sh`, not deleted with the prototype (TD-012)

### T3 — Give docs/research/ a retention rule and an archive target `[size: M · risk: low · class: decision · HITL]`
Layers: `skills/lean-doc-generator/references/DOCS_Guide.md` §2 + §11 · `skills/lean-doc-generator/SKILL.md` (compaction sweep) · `docs/architecture/overview.md` · `scripts/lib/check-research-archive.sh` · `scripts/gen-index.sh` · `scripts/qa-check.sh` · `evals/`
Depends-on: T2 (shared file — see D1)
Research docs are the one class `close` names in its compaction sweep ("superseded research
→ supersede note or archive") while §11 has no row for it, so "archive" resolves to nowhere. Twenty-five
live files and no trigger. Design the trigger before writing it: supersession is a state, not an age.

**Acceptance:** §11 carries a research row with a named trigger and target path, §2's research row
points at it, and `close`'s sweep line resolves to that target.

**DoD:**
- [x] Trigger + target decided and recorded (a D-row if it is hard-to-reverse and surprising — §4)
- [x] §11 row added; §2 research row points at it
- [x] `close`'s compaction-sweep line names the resolved target instead of an undefined one
- [x] `docs/architecture/overview.md` directory tree shows the archive path
- [x] A must-FAIL fixture: archiving a research doc still cited by a live ADR or sprint → refused with
      its named finding (L-058)

### T4 — Name the end-of-life for both ephemeral intake artifacts `[size: S · risk: low · class: decision · HITL]`
Layers: `skills/triage/SKILL.md` · `skills/task-decomposer/SKILL.md` · `skills/task-decomposer/references/prd-and-slices.md` · `skills/lean-doc-generator/references/DOCS_Guide.md` §2 + §11 · `evals/`
Depends-on: T3 (shared file — see D1)
§2 calls `BUG-<slug>.md` ephemeral and says it is "routed away at `/triage`", but triage step 3 routes
the *content* to a TASK or TD and says nothing about the file. The working feature PRD has the same
hole from the other end: intake scaffolding with no stated disposal. One concern — an intake artifact
with no durable home — which is why they are one task.

**Acceptance:** both artifacts have an explicit, stated disposal rule at the skill that produces or
consumes them, mirrored in §11.

**DoD:**
- [ ] `/triage` step 3 states what happens to the BUG **file** once its content is routed
- [ ] The feature PRD's end-of-life is stated in `/task-decomposer` + `references/prd-and-slices.md`
- [ ] Both mirrored in §11; §2's BUG row points at the rule
- [ ] A must-FAIL fixture: a BUG file left undisposed after routing → caught with its named finding
- [ ] Split this task instead of forcing it if the two disposal rules diverge (delete vs archive)

### T5 — Make every entry point aware the night run exists `[size: S · risk: low · class: execution · AFK]`
Layers: `skills/orchestrator/references/night-run.md` · `skills/prime/SKILL.md` · `.claude/CONTEXT.md`
Cites: `skills/flow/SKILL.md` — audited for existing night-run awareness, expected unchanged
Depends-on: none
Part 1a's entry path lists "raw intent / a PRD / a ticket" but not an epic slice, though
`/task-decomposer --epic` is a first-class input. `/prime` has no night-run awareness at all — its
`Next:` router never mentions the mode exists, so a session that primes and finds open DoD is never
told long-run AFK execution is an option. Audit the rest rather than assuming: `/flow` stage 4 and
`CONTEXT.md` § Gates already carry it.

**Acceptance:** an epic slice is a listed entry-path input, `/prime` offers the unattended option when
an active sprint has open DoD, and the chain runs end-to-end from an epic slice to a green pre-flight.

**DoD:**
- [ ] night-run.md Part 1a step 1 lists an epic slice alongside intent / PRD / ticket
- [ ] `/prime`'s `Next:` router offers the unattended option when open DoD exist
- [ ] Audit recorded: which entry points already carry night-run awareness and which were missing
- [ ] Fired end-to-end once, epic slice → green pre-flight — present in its own file is not wired (L-020)
- [ ] `/prime` stays read-only: it names the next skill, it never launches a run

### T6 — Deny the G1 fast-path to tasks that never met the grill `[size: M · risk: med · class: decision · HITL]`
Layers: `skills/orchestrator/SKILL.md` (G1) · `skills/lean-doc-generator/SKILL.md` (close §10 routing) · `skills/triage/SKILL.md` · `.claude/CONTEXT.md` (task entry shape) · `evals/`
Depends-on: T4, T5 (shared files — see D1; T5 edge added by the 2026-08-09 plan-correction for `.claude/CONTEXT.md`)
G1 fast-paths a "decomposer-approved task" to a scope-unchanged confirm, but no field records whether
a task ever met the intake grill — the clause is unverifiable prose. Tasks auto-filed by the
close-Retro follow-up bucket and converted by `/triage` bug intake reach G1 having never been grilled,
and nothing distinguishes them. Introduce the marker; do not infer provenance from `tracker:`.

**Acceptance:** a close-filed follow-up task presented to G1 is refused the fast-path with a named
finding, and a decomposer-produced task still gets it.

**DoD:**
- [ ] A provenance field is added to the task entry shape (`.claude/CONTEXT.md`) — a field, not an inference
- [ ] `close`'s follow-up bucket and `/triage` bug intake both stamp it
- [ ] G1 states the inverse clause: no decomposer provenance → full grill, never fast-path
- [ ] A must-FAIL fixture: close-filed follow-up at G1 → fast-path refused with its named finding (L-058)
- [ ] Grill-until-frontier-empty is left unchanged — it is already correct
- [ ] Watch `.claude/CONTEXT.md`'s 130-line cap (ADR-007); at cap, split rather than squeeze

### T7 — Add CODE_OF_CONDUCT to the standard, gated like CONTRIBUTING `[size: M · risk: low · class: execution · HITL]`
Layers: `skills/lean-doc-generator/references/DOCS_Guide.md` §2 · `skills/lean-doc-generator/templates/CODE_OF_CONDUCT.md.template` (new) · `skills/lean-doc-generator/references/init.md` · `skills/lean-doc-generator/SKILL.md` · `.claude/CLAUDE.md` · `docs/architecture/overview.md` · `README.md`
Depends-on: T1 (count guard must exist first), T3, T6 (shared files — see D1)
The standard has no CoC row and ships no template, so `init` cannot scaffold one for a consumer who
needs it. Gate it exactly as CONTRIBUTING is gated — team ≥ 2, or on request — so it stays
create-lazily rather than becoming boilerplate every repo carries. lean-flow itself takes the
exemption row, the same shape CONTRIBUTING already has.

**Acceptance:** `init` can scaffold a CODE_OF_CONDUCT for a consumer repo, every template-count claim
moves in lockstep, and T1's check proves the lockstep held.

**DoD:**
- [ ] A1 ruled on before writing the template (see § Assumptions — this blocks G2)
- [ ] §2 root table carries a code-of-conduct row (create ← team ≥ 2 or on request; update ←
      enforcement contact / policy change; archive `—`). lean-flow writes no root file of its own —
      the row describes what `init` scaffolds for a consumer
- [ ] `templates/CODE_OF_CONDUCT.md.template` ships and `init`'s list includes it
- [ ] Counts move in lockstep to 33 core + 2 non-core = 35 across README, `.claude/CLAUDE.md`,
      `docs/architecture/overview.md` — and T1's check passes on the new numbers
- [ ] `overview.md` § "Base-tier docs this repo deliberately does not have" gains a CoC exemption row
      with its own revisit-when

## Decisions (pre-locked)

- **D1 — This sprint builds strictly sequentially, T1 → T7. No parallel worktree dispatch.** Four
  tasks contend on `references/DOCS_Guide.md` (T3·T4·T7) and four on
  `skills/lean-doc-generator/SKILL.md` (T2·T3·T6·T7); `docs/architecture/overview.md` (T3·T7),
  `.claude/CONTEXT.md` (T5·T6) and the count claims (T1·T7) each carry two. Per-file ownership maps
  would be more precise, but with two hot files touched by four tasks each, serial order *is* the
  ownership map and costs nothing this sprint. Stage shared files per hunk regardless (L-042).
- **D2 — T2 is exercised on EPIC-001, not a fixture epic.** The §11 epic-archive row has never
  executed once; a synthetic input would prove the code path and not the rule. The must-FAIL fixture
  covers the dangerous direction separately.

## Assumptions

- **A1** — the CoC bases on **Contributor Covenant 2.1** rather than a hand-written text. *Unconfirmed
  — blocks G2 for T7. Confirm: owner ruling at the G2 design pass, recorded before the template is written.*
- **A2** — research retention triggers on supersession / verdict-consumed, not an age count.
  *Confirm: T3's design step, before the §11 row is written.*
- **A3** — §11's epic-archive row is correct as written; T2 wires it and does not redesign it.
  *Confirm: re-read the §11 row at T2 start; if it is wrong, that is a scope-change, not a quiet fix.*
- **A4** — G1 provenance is a new field on the task entry shape, never inferred from `tracker:` or
  from open-DoD state — inferring is TD-031's pattern. *Confirm: T6 design at G2.*
- **A5** — `qa-check.sh` already guards the template count on two surfaces and simply omits README.
  *Confirm: T1's first DoD step, before any checker is written.*

## Execution Log

> **Lives in its own file** — `docs/sprint/logs/SPRINT-055-wiring-the-standard.md`, rendered from
> `templates/sprint-log.md.template` and created lazily at the first entry. Append there, never here.

## Files Changed

<!-- Filled during execution; feeds CHANGELOG at close. -->

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|

## Retro

<!-- Written at close. Route the buckets to durable homes (DOCS_Guide §10). -->

**Retrieval check** —

**Cost** —

**Worked**
-

**Friction**
-

**Pattern candidate** (surface to user → `docs/LEARNINGS.md`)
-

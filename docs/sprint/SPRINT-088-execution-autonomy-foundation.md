---
sprint: 088
slug: execution-autonomy-foundation
stream: autonomy
epic: EPIC-015
owner: Maintainer
last_updated: 2026-08-26
status: active
gates_signed: G1,G2 @ 1502e00
approval_envelope: goal · scope · acceptance · design · verification · j1-delegation · capabilities · repair-policy · budget · stop-conditions @ 1b14d61
plan_commit: 757b2a8
close_commit: [sha — set at close]
update_trigger: sprint execute/close events
---

# SPRINT-088 — Execution Autonomy Foundation

> **Theme:** EPIC-015's **first member sprint**, and this repo's **first parallel stream** — it runs
> beside EPIC-014's stream rather than after it. The outcome is the authority model everything else
> in the epic rests on: a task declares whether it is J0, J1 or J2; an unattended run executes J1
> inside an approved envelope without asking; and a J2 **parks**, proven by a seeded control because
> a natural one cannot be scheduled. Foundations before features — the envelope, the repair loop and
> the run-outcome vocabulary are all meaningless until authority is declared and provable.

## Scope

**In:** the J0/J1/J2 authority classes declared per task · the `sprint-bulk` continuation contract
and its five terminal states · `overnight` as the canonical mode name with today's names as aliases ·
one recorded pre-launch approval covering the whole envelope. Targets EPIC-015 § Closed-when **1–4**.

**Out (deferred):** bounded unattended repair (TASK-296, `blocked` on this sprint) · typed run
outcomes (TASK-297, `needs-info` — the EPIC-008 `RunSummary` boundary must be ruled first) · both V3
§56 dogfoods and the freeze re-arm, which are terminal work for a later member sprint · any new agent
definition, hook or reviewer role · re-opening H32/H33/H34, shipped at SPRINT-082 and exercised here,
never re-implemented (EPIC-015 D2).

## Plan

### T1 — Declare J0/J1/J2 authority on every task, and prove a J2 parks `[size: M · risk: med · class: execution · HITL · J1]`
Layers: `skills/orchestrator/references/night-run.md` (Part 0 authority table) · `skills/orchestrator/SKILL.md` (the G2 declaration) · `skills/lean-doc-generator/templates/SPRINT.md.template` · `.claude/CONTEXT.md` § Task entry shape · a retained fixture pair — resolved in execution to `scripts/lib/check-authority.sh` · `evals/run-authority-fixtures.sh` · `evals/fixtures/authority/**` · `scripts/qa-check.sh` (the wiring; L-100 correction, logged)
Depends-on: none
Cites: TASK-292 · EPIC-015 § Closed-when 3 · D3 · D4 · D5 · V3 H29 · L-111 · T2 · T4 · `TECH-DEBT.md` (cited, not touched — TD-012's retain-fixtures rule; this task marks no debt resolved)

The foundation the rest of the epic rests on. The three classes already describe how the loop
behaves — mechanical, delegated, human — so this **declares** them rather than inventing them. It is
first because the envelope (T4) is expressed in J-classes, and the continuation contract (T2) has no
definition of "already authorized" without them.

**Acceptance:** a promoted Plan carries a J-class per task; an unattended run executes a J1 without
asking and **parks** a seeded J2 with its unblock condition recorded.

**DoD:**
- [x] Every task in a promoted Plan carries a `J0` / `J1` / `J2` declaration — *Verify: a sprint file missing one fails its schema check with a named finding* ✓ `scripts/lib/check-authority.sh` (the method this clause named but did not identify — resolved at T1's design step per the G2 reachability ruling). Fails with `authority-undeclared`, wired into `qa-check.sh` leg 14-bis. SPRINT-088's own four tasks now declare `J1`; checker exits 0 over them
- [ ] A J1 task executes unattended inside the approved envelope with no confirmation — *Verify: exercised on a real run, not asserted (L-007)*
- [ ] A **seeded** J2 parks, recording its unblock condition — *Verify: the seed is required, not a fallback (D5); TASK-188 is standing evidence that waiting for a natural park foreclosed this criterion once already (L-111)*
- [x] **Tier G**: retained must-FAIL — a J2 task that does NOT park fails with its named finding while a sibling J1 control stays green — *Verify: seeded-break discrimination; seed verified landed by `cmp`, artifact still parses, break targeted, restored under a hash whose convention is stated and used consistently (L-169)* ✓ `evals/run-authority-fixtures.sh`, 9 assertions, retained. Both must-FAIL cases pair the offender with a green sibling *in the same file*. Three seeds, disjoint case sets: A (undeclared defaults to J0) → 3 cases; B (honoured half inverted) → 2; C (closed-sprint scoping removed) → 1; all three controls green throughout. Each landed (`cmp`), parsed (`sh -n`), targeted (116/116 lines, 5/5 verdict printfs, 1 line changed). Convention: `sha256sum` over the raw working file — pristine `8ee7106d7acbbe1e`, restored `8ee7106d7acbbe1e`, `cmp` byte-identical
- [x] Pointed at its own motivating case, not fixtures alone — *Verify: L-166 — a fixture proves a branch works, only the real artifact proves it is reachable* ✓ run against `docs/sprint/SPRINT-088-…md` itself *before* the classes were added: 4 × `authority-undeclared`, exit 1. The debt this row cites is a Plan with no J-class, and this Plan was one. After declaring `J1` on T1–T4 the same invocation exits 0 — the branch is reachable on the real artifact, not only in `fixtures/`

### T2 — Stop sprint-bulk pausing between already-authorized tasks `[size: M · risk: med · class: execution · HITL · J1]`
Layers: `skills/orchestrator/SKILL.md` (the sprint-bulk loop) · `skills/orchestrator/references/night-run.md` · `scripts/night-run.sh` · `.claude/CONTEXT.md` § Modes — corrected in execution (L-100) to add `scripts/lib/check-night-run-rollup.sh` · `evals/run-night-run-rollup-fixtures.sh` · `evals/fixtures/night-run-rollup/**`, the guard for the terminal-state requirement
Depends-on: T1
Cites: TASK-293 · EPIC-015 § Closed-when 1 · V3 H27 · ADR-016

A run that pauses between tasks the owner already approved is why an approved Plan still needs a
human sitting beside it. The contract is that a run ends **only** at a named terminal state —
anything else is a stop nobody declared.

**Acceptance:** a `sprint-bulk` run moves task to task without re-confirming approved work, and its
exit names one of the five terminal states.

**DoD:**
- [x] A run continues past a completed task with no confirmation — *Verify: exercised on a real multi-task run* ✓ this sprint's own run: T1 → T2 → T3 → T4 in sequence, each committed and its DoD ticked, with **no confirmation requested between tasks**. A real multi-task run, and the only confirmations sought in it were the owner rulings the contract explicitly reserves (gate sign-off, the two red-gate dispositions) — never a re-confirmation of already-approved work, which is the behaviour this criterion tests. Caveat stated rather than glossed: the run was **attended**, so it exercises the continuation half of Part 0b and not the no-ask-channel half
- [x] A run ends **only** at `PLAN_EXHAUSTED` · `AUTHORITY_BOUNDARY` · `HARD_FAILURE` · `BUDGET_STOP` · `USER_STOP`, with the terminal reason in the rollup — *Verify: ADR-016's rollup stays the launcher's job; this changes when a run stops, never who records it* ✓ emitted by the **launcher code path**, not by hand: `sh scripts/night-run.sh --reap …` against this sprint produced `run · 12 of 17 DoD ticked` / `terminal · PLAN_EXHAUSTED · every task reached a resolved state`. The per-task state lines were the run's to write, the header and terminal line the launcher's — the division ADR-016 fixes, unchanged. `check-night-run-rollup.sh` PASSes the resulting real artifact. Caveat: `--reap` was invoked directly rather than by the detached wrapper, so this proves the rollup path, not the detachment path
- [x] **Tier G**: retained must-FAIL — a run halting with no terminal state fails with its named finding while a clean-exhaustion control passes — *Verify: seeded-break discrimination, hash convention stated (L-169)* ✓ `check-night-run-rollup.sh` + `run-night-run-rollup-fixtures.sh` extended to 9 assertions. Must-FAIL `missing-terminal` (deliberately `9 of 9`, so a full DoD count cannot satisfy it) and `bad-terminal-token` (`terminal · FINISHED ·` — shape without meaning); clean-exhaustion control `wellformed` passes. Two seeds, **nested** case sets: D (requirement removed) → 2 cases; E (state token unvalidated) → 1, a strict subset, proving the token assertion does work beyond mere presence. Each landed (`cmp`), parsed (`sh -n`), targeted (73/73 lines, 3/3 verdict calls, 1 line changed). Convention: `sha256sum` over the raw working file — pristine `5497faa8bc5ebf62`, restored `5497faa8bc5ebf62`, `cmp` byte-identical. Two added assertions keep the neighbouring fixtures isolated: adding a required field silently turns every existing must-FAIL case into one that fails for two reasons

### T3 — Make `overnight` the canonical mode name, with today's names as aliases `[size: S · risk: low · class: execution · HITL · J1]`
Layers: `skills/orchestrator/SKILL.md` · `skills/flow/SKILL.md` · `skills/orchestrator/references/night-run.md` · `.claude/CONTEXT.md` § Modes · `README.md` — corrected in execution (L-100) to add `CHANGELOG.md` · `scripts/lib/resolve-run-mode.sh` · `evals/run-run-mode-fixtures.sh` · `scripts/qa-check.sh` (wiring) and, unforeseen at promote, **`scripts/night-run.sh`**: its mode-signal pre-flight demanded the literal word `unattended`, so the rename could not be additive without widening it
Depends-on: T2
Cites: TASK-294 · EPIC-015 § Closed-when 2 · V3 H28 · L-015 · L-016

The mode that exists is not the mode anyone can find. Named after the contract it runs, which is why
it follows T2 rather than leading it.

**Acceptance:** `overnight` is discoverable in `/orchestrator` and `/flow`, and every current trigger
still reaches it.

**DoD:**
- [x] `overnight` is the documented mode name in `/orchestrator` and `/flow` — *Verify: consumer-facing surface checked; README + CHANGELOG reflect the user-visible rename (L-015)* ✓ `/orchestrator` mode table + `argument-hint` · `/flow` § conducting · `night-run.md` Part 0 · `.claude/CONTEXT.md` § Modes · `README.md` (roster row + the unattended-runs block, trigger updated to `/orchestrator overnight`) · `CHANGELOG.md` unreleased block with an explicit consumer note
- [x] `night-run` · `unattended` · `sprint-bulk unattended` each resolve to it — *Verify: one fixture per alias, each reaching the same mode* ✓ `scripts/lib/resolve-run-mode.sh` + `evals/run-run-mode-fixtures.sh`, 14 assertions: one case per alias resolving to `overnight`, plus a normalisation case, plus **four launcher-level cases** proving each alias passes `night-run.sh`'s own mode gate — the resolver alone would not have proven that
- [x] **Tier G**: retained must-FAIL — an unknown mode string fails loudly rather than falling through to a default — *Verify: seeded-break discrimination, sibling control green* ✓ `overnite` · `quick` · empty each exit non-zero with `run-mode-unresolved` **and empty stdout** — the load-bearing half, since a resolver that printed the default *and* exited non-zero would pass an exit-code-only test while handing a caller a usable value. Three seeds, disjoint: F′ (finding to stdout) → 2 cases; G (alias dropped) → 2; H (launcher gate deleted) → 1. Each landed (`cmp`), parsed (`sh -n`), targeted (53/53 and 447/447 lines, 1 line changed). Convention: `sha256sum` over the raw working file — `resolve-run-mode.sh` pristine/restored `8c93ef59486ce4b2`, `night-run.sh` pristine/restored `2e7e6bcf3fbbfe6c`
- [x] The rename is **additive** for consumers: no installed trigger breaks — *Verify: traced on the consumer path, never inferred from this repo's dogfooding (L-016)* ✓ **and the trace found a real break.** `night-run.sh`'s mode-signal pre-flight demanded the literal word `unattended`, so a consumer adopting the new canonical name would have been refused *by the launcher* while the docs said it was supported — additive in prose, breaking in the tool. Widened to accept `overnight` · `night-run` · `unattended` or an explicit `--mode`; the negative control (`launcher-still-refuses-no-signal`) proves the gate was widened and not switched off. This repo's own triggers all still said `unattended`, so dogfooding would never have surfaced it

### T4 — Record one pre-launch approval that covers the whole envelope `[size: M · risk: med · class: execution · HITL · J1]`
Layers: `skills/orchestrator/references/night-run.md` (Part 1a pre-flight) · `skills/lean-doc-generator/templates/SPRINT.md.template` (frontmatter) · `skills/orchestrator/SKILL.md` — corrected in execution (L-100) to add `scripts/lib/check-approval-envelope.sh` · `evals/run-approval-envelope-fixtures.sh` · `evals/fixtures/approval-envelope/**` · `scripts/qa-check.sh` (leg 14-ter + harness list) and this sprint's own frontmatter, the motivating case
Depends-on: T1
Cites: TASK-295 · EPIC-015 § Closed-when 4 · V3 H30 · L-099 · L-151

An envelope that silently widens is the failure mode, and nothing in a run reports having exceeded an
approval it never re-read. The approval is written **where the run reads it** — the sprint
frontmatter — not in the launching transcript, which an unattended run cannot see.

**Acceptance:** one recorded approval covers all ten dimensions, and a run consuming it re-confirms
no J0/J1 mid-flight.

**DoD:**
- [x] One approval covers goal · scope · acceptance · design · verification · J1 delegation · capabilities · repair policy · budget · stop conditions — *Verify: a fixture approval missing one dimension is rejected at pre-flight and names which one* ✓ `scripts/lib/check-approval-envelope.sh`, wired as `qa-check.sh` leg 14-ter. Fixture `missing-budget` is refused and the finding **names it** (`does not cover: budget`) rather than reporting a bare "malformed" — the requirement is the naming, since "your approval is incomplete" is not actionable at 3am. Dimensions match as whole tokens, so `out-of-scope` does not satisfy `scope` and `budget-ceiling` does not satisfy `budget` (L-108); the `substring-trap` fixture names both gaps. Also refused: no pin, and a pin that is not a sha — an approval with no sha approves a moving target
- [x] It lives in the sprint frontmatter, not the transcript — *Verify: L-099 · L-151 — a ruling its reader cannot reach governs nothing* ✓ `approval_envelope:` is read from frontmatter only, by the same flat parser `gates_signed:` uses. **Absence is reported as NOT APPROVED and is neither a FAIL nor a PASS** — a sprint sits legitimately unapproved between promote and pre-flight, but it must never be *rendered* as approval (the labelled-verdict regression the gates-signed family already hit, L-103). The shipped template's own bracketed placeholder counts as absent, so the artifact that creates every sprint cannot bless one. Recorded on this sprint at `@ 1b14d61`
- [ ] A run consuming it re-confirms no J0/J1 mid-flight — *Verify: exercised on a real run*
- [x] **Tier G**: retained must-FAIL + sibling control, seeded-break discrimination — *Verify: hash convention stated and used consistently (L-169)* ✓ `evals/run-approval-envelope-fixtures.sh`, 7 assertions, retained. Control `complete-passes` is the sibling that stays green. Three seeds, each landed (`cmp`), parsed (`sh -n`), targeted (90/90 lines, 1 line changed): I (dimensions matched as substrings) → 1 case; J (completeness never reports a gap) → 2, a superset of I; K (absent rendered as a PASS) → 1, disjoint from both. Seed K raises the verdict-call count 2 → 3, which *is* the seeded change — converting a note into a verdict — not drift. Convention: `sha256sum` over the raw working file — pristine `44a132acf5ff77d6`, restored `44a132acf5ff77d6`, `cmp` byte-identical

## Owner-action checklist
- [x] Sign the batch **G1 + G2** for T1–T4 before execution begins, and record it as `gates_signed: G1,G2 @ <sha>` in this file's frontmatter. **The field is absent until then, and its absence means NOT signed** — an unattended run reads this file and nothing else (L-099).

## Decisions (pre-locked)
- **D1** — **`.claude/CONTEXT.md` is single-owned by T1 for this sprint.** T1, T2 and T3 all touch it (§ Task entry shape, § Modes), and EPIC-014's stream touches § Sprint model at cutover. Commit order is T1 → T2 → T3, each staging per-hunk (`git add -p`) with `git diff --cached` verified — never a plain `git add` over the other stream's WIP (L-042 · L-037).
- **D2** — **Cross-stream coordination is by commit ownership.** SPRINT-087 owns `packages/standard/src`, `apps/cli/src`, `TECH-DEBT.md` and its own sprint files; this sprint owns `skills/orchestrator/**`, `skills/flow/**` and `scripts/night-run.sh`. The surfaces are disjoint by construction, which is what makes the parallel stream admissible at all.
- **D3** — **J2 stays human; absence is never consent.** Inherited from EPIC-015 D3 and restated because this is the sprint that could weaken it: a missing ask channel, a denial or a timeout is a BLOCK, never a default-yes, and never reasoned out by the run.
- **D4** — **Every task here is ADR-029 Tier G** (EPIC-015 D4). A false negative in an authority classification or a park is silent by construction — the run reports success and the omission leaves no trace.

## Assumptions
- **A1** — The three authority classes already describe how the loop behaves. *Confirm: `orchestrator/references/night-run.md` Part 0's existing HITL/AFK boundary, read at T1's design.*
- **A2** — Renaming to `overnight` is additive for consumers, every existing trigger surviving as an alias. *Confirm: T3's per-alias fixtures plus a consumer-path trace (L-016).*
- **A3** — The two streams' file surfaces stay disjoint. *Confirm: measured at promote against SPRINT-087's declared `Layers:` — zero overlap — and re-checked by `check-layers-observed.sh`, whose ownership scoping (TASK-299) is exercised for the first time on real input by this sprint's existence.*

## Execution Log

> **Lives in its own file** — `docs/sprint/logs/SPRINT-088-execution-autonomy-foundation.md`, rendered
> from `templates/sprint-log.md.template` and created lazily at the first entry. Append there, never
> here (STANDARD §9 · ADR-014). Every entry carries its `consequence · Tn · behaviour:… · governance:…`
> line — a task whose consequence is unrecorded is invisible to `check-review-depth.sh`.

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| `skills/orchestrator/references/night-run.md` | T1 | Part 0 § Authority classes — defines J0/J1/J2 and derives each from the existing boundary table, so the run has somewhere to *read* a class from | med | `run-authority-fixtures.sh` |
| `skills/orchestrator/SKILL.md` | T1 | G2 declares the class per task — the gate is where it is knowable and frozen | low | judgment (prose) |
| `skills/lean-doc-generator/templates/SPRINT.md.template` | T1 | header meta carries the class, so every future sprint is born declaring it | low | judgment (prose) |
| `.claude/CONTEXT.md` | T1 | § Task entry shape gains `authority:` — the SSOT consumers read | low | `check-doc-caps.sh` (140/150) |
| `scripts/lib/check-authority.sh` | T1 | **new** — the mechanical half: class declared, and a J2 task held rather than executed | **high** | `run-authority-fixtures.sh`, 3 seeded breaks |
| `evals/run-authority-fixtures.sh` | T1 | **new** — 9 retained assertions; each must-FAIL pairs the offender with a green sibling (TD-012 · L-142) | **high** | self (seeded-break proven) |
| `evals/fixtures/authority/**` | T1 | **new** — 4 fixture sprints + 2 Execution Logs; dirs named by shape, never after a token their own assertion greps for (L-108) | low | `run-authority-fixtures.sh` |
| `scripts/qa-check.sh` | T1 | leg 14-bis + always-on harness list — wiring, without which the guard is half-shipped (L-020) | med | gate run |

## Retro

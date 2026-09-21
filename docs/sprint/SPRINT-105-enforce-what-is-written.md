---
sprint: 105
slug: enforce-what-is-written
owner: Maintainer
last_updated: 2026-09-21
status: active
plan_commit: 1aa3f71
close_commit: [sha — set at close]
update_trigger: sprint execute/close events
---

# SPRINT-105 — Enforce What Is Already Written

> **Theme:** Two rules in this repository are correct, load-bearing, and **unenforced** — `L-002`
> (a blocking question is *asked*, never left in prose) and `STANDARD` §157 ("cap-hit → split,
> never squeeze"). Both have been written for months, in multiple places, and both fail routinely,
> because beside each one sits a *checked* number that wins. This sprint gives each an instrument.
> It is `EPIC-017`'s diagnosis applied to the two cases that did not need the store to land first.

**Filed retroactively, and that is stated rather than hidden.** The work was built in one session
on 2026-09-21 in response to owner direction, outside `SPRINT-104`'s frozen Plan. Recording it as
its own sprint is what makes it attributable: leg 15 had reported every one of these files as
*changed but undeclared*, and the honest fix is a Plan that declares them, not a governance commit
that classifies around them. `SPRINT-104` is untouched and still unstarted.

## Scope

**In:** the `Stop` hook that makes `L-002` fire (`ask-dont-tell`) · the stance reversal that lets a
hook exist here at all (`ADR-044`) · the prose-density ratchet that makes §157 checkable · the
`v1.66.0` release carrying both.

**Out (explicitly not):** `EPIC-017`'s work-item store, membership-as-frontmatter, `promote`-by-
reference, and the `TODO.md` deletion — all of that is `TASK-359`…`365` and waits on `SPRINT-104`
closing · the three standing `OVER-CAP (soft)` breaches, which are `TD-174` and belong to
`TASK-364` · raising or lowering any existing cap.

## Plan

### T1 — Ship the `ask-dont-tell` Stop hook, and reverse the stance that forbade it `[size: M · risk: med · class: decision · HITL · J2]`
Layers: `hooks/hooks.json` · `hooks/ask-dont-tell.ts` · `evals/run-ask-dont-tell-fixtures.ts` · `docs/adr/ADR-044-hooks-are-admissible.md` · `docs/DECISIONS.md` · `.claude/CLAUDE.md` · `.claude/CONTEXT.md` · `README.md` · `docs/architecture/overview.md` · `.claude-plugin/plugin.json` · `.claude-plugin/marketplace.json` · `.codex-plugin/plugin.json` · `.kimi-plugin/plugin.json` · `CHANGELOG.md`
Depends-on: none
Cites: L-002 · L-105 · L-166 · ADR-001 · ADR-002 · ADR-011 · `CLAUDE.md` · `CONTEXT.md` · `LEARNINGS.md`

`L-002` is written in `CLAUDE.md`, `CONTEXT.md`, `LEARNINGS.md` and the maintainer's memory file,
appears in 10+ files, and still fails routinely. Its trigger is **the moment a turn ends**, where
no skill step exists — so every written placement is a reminder to an agent that has already
stopped reading. That is `L-105`'s temporal test answered honestly: the guard never fires.

**Acceptance:** a turn ending on a decision point with no `AskUserQuestion` call is blocked and
told to re-ask; a turn that asked properly, and a turn that merely reports, are not.

**DoD:**
- [x] Hook registered and loadable — *Verify: `hooks/hooks.json` parses, declares `Stop`, and its `args` path resolves to a file that exists*
- [x] Transcript schema **verified against a live transcript, not assumed** — *published guidance described a top-level `tool_calls[]`; the real shape is `message.content[]` blocks with `{type:"tool_use", name}`. Reading `tool_calls` would have found nothing, silently — an absent guard shaped like a present one (L-166)*
- [x] **Tier G bar**: 7 retained fixtures driving the real binary over stdin, incl. 3 must-NOT-catch controls — *Verify: seeded break (AskUserQuestion detection neutered) reddens **both** dependent cases while the 5 independent ones stay green; seed landed (sha changed), targeted (0 line delta), restored under one stated convention (`sha256sum` vs a pristine copy)*
- [x] A **vacuous control was found and fixed** — *the first `asked-properly` fixture allowed via the wrong branch and never exercised the detection it claimed to guard; only the seeded break exposed it (L-142)*
- [x] Fails open on every unexpected condition, and respects `stop_hook_active` — *Verify: the `stop-hook-active` fixture*
- [x] `ADR-044` written: hooks **and** agents admissible on ADR-001's bar; ADR-002/011 **amended, not superseded**; no hook may block a gate
- [x] The `"no X"` banner retired across the consumer surface — *and `"no scaffold"` found to be **flatly false**: `/lean-doc-generator init` is titled "Scaffold a fresh repo" and has shipped for a long time (L-015)*
- [x] All four manifests + the README footer at `1.66.0`, derived with `grep -l '"version"' .*-plugin/*.json`, never from a list
- [ ] Outside reviewer dispatched worktree-isolated (ADR-029 ii · L-165 · L-168)

### T2 — Make §157's "split, never squeeze" checkable `[size: M · risk: med · class: execution · HITL · J1]`
Layers: `scripts/lib/check-prose-density.ts` · `scripts/lib/prose-density-baseline.txt` · `evals/run-prose-density-fixtures.ts` · `evals/fixtures/prose-density/` · `scripts/qa-check.sh`
Depends-on: none
Cites: TD-174 · L-120 · L-186 · L-142 · `STANDARD.md` · `SKILL.md` · `CLAUDE.md` · `CONTEXT.md` · `.claude/CLAUDE.md`

`check-doc-caps` counts **newlines**, and a markdown file meets a newline cap by writing longer
lines. Measured: `.claude/CLAUDE.md` held 63 lines against a cap of 80 while its content grew
**2.62×** after the cap was first reached; longest line **6,681 characters**.

**Acceptance:** a file that gets denser than its recorded baseline fails the gate, by name; a file
at or below its baseline does not.

**DoD:**
- [x] Threshold **derived, not chosen** — *400 chars ≈ p97 of the capped prose corpus (n=2,246; median 74, p90 130, p95 254, p99 664, max 6,681)*
- [x] Built as a **ratchet**, not a report — *TD-174 records what report-only achieves: 3 `OVER-CAP (soft)` rows print every run, one **23× its cap**, and none has been acted on*
- [x] Wired into the gate and **observed to fire** — *Verify: 16 `prose-density` rows in a real `scripts/qa-check.sh` run; present ≠ wired (L-020)*
- [x] Both new harnesses **registered** in `eval_harnesses_always` — *an unregistered harness in `evals/` is itself a gate FAIL; measured 855 ms and 2.07 s, cheap enough for always-on*
- [x] **Tier G bar**: 4 retained fixtures incl. a must-NOT-catch control — *Verify: seeded break (ratchet arm made unreachable) reddens exactly `grew` while the control stays green; restored under one stated convention*
- [x] A fixture varies the **SELECTION**, not the verdict — *`other-glob-arm` is reachable only through the `skills/*/SKILL.md` arm of `proseFiles()`; every other fixture enters via the hardcoded list (L-186)*
- [x] Population coverage confirmed — *17 files enumerated = 14 `SKILL.md` + `CLAUDE.md` + `CONTEXT.md` + `STANDARD.md`*
- [x] **Exercised on its own author** — *the leg failed `CLAUDE.md` at 805 chars on one line within minutes of being wired; fixed by rewrapping, with the baseline left untouched, which is what §157 requires and what the baseline file forbids doing instead*
- [ ] Outside reviewer dispatched worktree-isolated (ADR-029 ii · L-165 · L-168)

## Owner actions

- [ ] Review and approve the `ADR-044` stance reversal — it changes what the plugin is allowed to
      ship, and was ruled by the owner in-session on 2026-09-21 but not yet reviewed as written.
- [ ] Decide whether the `1.66.0` release is pushed, or held until T1/T2's outside reviews land.

## Decisions → ADR

- **D1** — Hooks and agent definitions are admissible, held to ADR-001's curation bar. **→ ADR-044**
- **D2** — Document size is budgeted by a *ratchet on density*, not a new threshold, because a
  threshold with no forcing function is what `TD-174` already records failing. No ADR: this is the
  first slice of `EPIC-017` D3, and the full budget decision lands with `TASK-364`.

## Assumptions

- That the density threshold (400) is neither noisy nor toothless in practice. **UNCONFIRMED** —
  it is derived from one corpus at one moment. Re-derive if the baseline stops shrinking.
- That a Stop hook's false positives stay rare enough to tolerate. **UNCONFIRMED, and named as the
  real risk in ADR-044**: if it proves noisy the honest response is to narrow the patterns or
  withdraw it, never to widen the fixtures until it looks green.

## Files changed

See `git diff --name-only` for the sprint range. Both tasks touch `scripts/qa-check.sh`
(**overlap**): T2 owns it — the density leg and both harness registrations are one edit, made
once, in T2's commit. T1 makes no edit to that file.

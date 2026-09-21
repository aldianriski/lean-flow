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

### T1 — Reverse the stance; the hook candidate is withdrawn at review `[size: M · risk: med · class: decision · HITL · J2]`
Layers: `hooks/hooks.json` · `hooks/ask-dont-tell.ts` · `evals/run-ask-dont-tell-fixtures.ts` · `TODO.md` · `scripts/qa-check.sh` · `docs/adr/ADR-044-hooks-are-admissible.md` · `docs/DECISIONS.md` · `.claude/CLAUDE.md` ·
        `.claude/CONTEXT.md` · `README.md` · `docs/architecture/overview.md` · `.claude-plugin/plugin.json` · `.claude-plugin/marketplace.json` · `.codex-plugin/plugin.json` · `.kimi-plugin/plugin.json` · `CHANGELOG.md`
Depends-on: none
Cites: L-002 · L-105 · L-166 · L-186 · ADR-001 · ADR-002 · ADR-011 · `CLAUDE.md` · `CONTEXT.md` · `LEARNINGS.md`

`L-002`'s trigger is **the moment a turn ends**, where no skill step exists, so every written
placement is a reminder to an agent that has already stopped reading. A hook was built for it and
**withdrawn at outside review**. The stance change survives; the artifact does not.

**Acceptance:** hooks and agent definitions are admissible on ADR-001's bar, the record says so
accurately, and no unmeasured hook ships.

**DoD:**
- [x] `ADR-044` written: hooks **and** agents admissible, held to ADR-001's curation bar
- [x] The `"no X"` banner retired — *and `"no scaffold"` found **flatly false**: `/lean-doc-generator init` is titled "Scaffold a fresh repo" and had shipped for a long time (L-015)*
- [x] All four manifests + README footer at `1.66.0`, derived with `grep -l`, never from a list
- [x] Outside reviewer dispatched worktree-isolated (ADR-029 ii · L-165 · L-168)
- [x] **Review verdict acted on, not argued with** — *NOT SAFE TO SHIP. Measured on 48 real transcripts (5,451 blocks, 746 turns): ~35 turns blocked, **~22 false positives (≈60%)**, ≥9 genuine decisions missed, 8 of them because the patterns were English-only and the maintainer works bilingually. Hook and its fixtures reverted; re-filed as `TASK-366` with the corpus-derived spec*
- [x] **Two factual errors in ADR-044 corrected** — *(a) it claimed `ADR-002`'s "hook clause" was
      lifted; `grep -ci hook` over ADR-002 returns **0** and there is no such clause. (b) it
      reframed `ADR-011`'s objection as being "about gates"; ADR-011 rejected a plugin hook because
      **hooks auto-activate with no per-hook disable ⇒ mandatory for every consumer**, which
      applies exactly to what was built. Now superseded-in-part on the record, with the platform
      fact verified against the installed CLI*
- [x] **A new standing constraint recorded** — *a hook must be worth being **mandatory**, since a consumer cannot disable one selectively; measured against real input before shipping, never argued*
### T2 — Make §157's "split, never squeeze" checkable `[size: M · risk: med · class: execution · HITL · J1]`
Layers: `scripts/lib/check-prose-density.ts` · `scripts/lib/prose-density-baseline.txt` · `scripts/lib/check-doc-caps.ts` · `evals/run-prose-density-fixtures.ts` · `evals/fixtures/prose-density/` · `scripts/qa-check.sh`
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
- [x] Outside reviewer dispatched worktree-isolated (ADR-029 ii · L-165 · L-168) — *verdict: detection sound, member set wrong. 8 findings, all fixed in `a33732e`: population 16→84 files, table cells measured, 6 new fixtures, verdict count corrected*


### T3 — Make the detached gate actually run every harness `[size: S · risk: med · class: execution · HITL · J1]`
Layers: `scripts/qa-check.sh` · `scripts/night-run.sh`
Depends-on: none
Cites: ADR-042 · L-020 · L-151 · L-058 · L-076 · L-130 · TD-084 · `run-conformance-engine-fixtures.sh` · `run-s4-ts-evaluators.sh`

The gate needs ~679s and truncated on **every** run, skipping ~16 harnesses. The skipped set was
chosen by position in a chronological list, not by value: it spent **162.2s** on
`run-conformance-engine-fixtures.sh` and then skipped `run-s4-ts-evaluators.sh` at **0.75s**.

**Acceptance:** a detached run executes all 38 always-on harnesses with no truncation, and the
default foreground profile drops the dearest rather than the newest if it ever does truncate.

**DoD:**
- [x] Per-harness cost **measured**, not estimated — *38 harnesses, 533.8s total; the expensive four are 162.2 · 51.6 · 46.6 · 34.0s and the cheapest 24 together cost ~100s*
- [x] Always-on set ordered **cheapest-first** — *so that if a budget is ever exceeded, truncation costs the fewest guards rather than an arbitrary tail*
- [x] **`scripts/night-run.sh` raises its own budget to 1200s** — *it is the detached caller ADR-042 anticipated ("a caller that knows it is detached may raise it") and was invoking the gate at the 520s **foreground** default, truncating the pre-flight that decides whether to FIRE an unattended run. A floor, not an override: a higher caller-set budget is kept*
- [x] The truncation message names the **concrete remedy** — *`QA_BUDGET_SECONDS=1200 sh scripts/qa-check.sh`, not just the variable name; the reader who needs it is the one staring at the truncation (L-151)*
- [x] Detached run verified: **all 38 harnesses execute, zero truncation** — *`QA-CHECK: 262 pass, 3 fail` at `QA_BUDGET_SECONDS=1200`, wall 601s, 38 of 38 harness rows, no truncation line. Against `228 pass, 5 fail` and 22 of 38 before (L-120: the gate's printed verdict, not an exit code)*
- [ ] Outside reviewer dispatched worktree-isolated (ADR-029 ii)

**What this task deliberately did NOT do, and why it matters.** A first attempt split the always-on
set by a measured 30s cost cap, moving the expensive four behind `QA_FULL=1`. That was **reverted
before commit**: `ADR-042`'s alternatives table already rejects exactly that move — it "trades a
coverage claim for a schedule, which is the shape L-058 warns about" — and the premise behind it
was wrong, because the 600s ceiling is a **foreground** limit, not a wall. The owner had already
ruled the correct fix at SPRINT-101 ("raise `QA_BUDGET_SECONDS` and re-run"); it simply lived in a
sprint log that no procedure read. The defect was never the harness set. It was an unwired ruling.

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

See `git diff --name-only` for the sprint range. **`scripts/qa-check.sh` is the overlap** and all
three tasks touch it: T2 added leg 2b-ter and registered both harnesses, T1's revise unregistered
the withdrawn one, T3 reordered the always-on list and rewrote the truncation message. Serialised,
never concurrent — one task's edit committed before the next began, which is what the overlap map
exists to guarantee (L-042). `hooks/` and `evals/run-ask-dont-tell-fixtures.ts` appear in T1's
Layers although they no longer exist: the sprint range **created and then deleted** them, and leg
15 reads the range rather than the final tree. A withdrawn artifact is still work done.
See `git diff --name-only` for the sprint range. Both tasks touch `scripts/qa-check.sh`
(**overlap**): T2 owns it — the density leg and both harness registrations are one edit, made
once, in T2's commit. T1 makes no edit to that file.

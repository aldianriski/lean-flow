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


### T3 — Make the gate's truncation cost the fewest guards `[size: S · risk: med · class: execution · tier: G · HITL · J1]`
Layers: `scripts/qa-check.sh` · `scripts/night-run.sh` · `scripts/lib/qa-budget-check.sh` ·
        `.claude-plugin/plugin.json` · `.claude-plugin/marketplace.json` · `.codex-plugin/plugin.json` ·
        `.kimi-plugin/plugin.json` · `README.md` · `CHANGELOG.md` · `TECH-DEBT.md` · `TODO.md` ·
        `evals/run-qa-budget-fixtures.sh`
Depends-on: none
Cites: ADR-042 · L-020 · L-151 · L-058 · L-130 · TD-084 · `run-conformance-engine-fixtures.sh` · `run-s4-ts-evaluators.sh`

The gate needs ~805s (this host, measured at HEAD by the outside reviewer; SPRINT-101 measured
945s) and truncated on every default run, skipping ~16 of 38 harnesses. The skipped set was chosen
by position in a chronological list, not by cost.

**Acceptance:** if the gate truncates, it drops the dearest harnesses rather than the newest; and
the budget guard refuses an unusable budget instead of passing it through.

**DoD:**
- [x] Per-harness cost **measured** — *38 harnesses, 533.8s as a standalone sequential sweep. NOT an in-run figure: in-run wall is 805s including non-harness legs, and the two measure different things (review F3)*
- [x] Always-on set ordered **cheapest-first** — *Verify: reviewer re-timed positions 1/2/19/25/33/36 at 0.49 · 0.58 · 4.12 · 6.50 · 13.0 · 35.8s, strictly increasing; at a 200s budget the skipped set is exactly positions 30–38, the expensive tail*
- [x] Set integrity — *38/14/52 against `11bbd8b~3`, diff empty, no drops, duplicates or cross-set moves; independently confirmed*
- [x] **Tier G bar**: `qa_budget_check` refuses a non-numeric budget — *5 retained cases (14–18) incl. a must-NOT-catch control; seeded break removing the validation reddens exactly 14–17 reproducing the original `OK 1790033736 abc`, while 18 stays green. Restored under one convention (`git hash-object` vs `git rev-parse HEAD:<path>`)*
- [x] Outside reviewer dispatched worktree-isolated (ADR-029 ii) — *11 findings; the night-run raise **reverted as a regression**, four false claims corrected, F4 fixed, F7 filed as `TD-175`, follow-up as `TASK-367`*
- [x] CHANGELOG entry for the consumer-facing surface (L-015) — *`v1.66.1`, with the reverted regression recorded under its own § Reverted before release heading rather than omitted*

**Two claims in this task's first version were false, and both are corrected above rather than
quietly dropped.** *(a)* It said the gate "spent 162.2s on `run-conformance-engine-fixtures.sh` and
then skipped `run-s4-ts-evaluators.sh` at 0.75s". In the old order conformance-engine was **#23** —
with 22 of 38 running, it was the **first harness skipped**, so the gate spent **0s** on it.
Truncation is monotone; the anecdote cannot describe that run. *(b)* It cited ADR-042's *"a caller
that knows it is detached may raise it"* as licence for raising `QA_BUDGET_SECONDS`. That
sentence's antecedent is **`QA_CEILING_SECONDS`** — a different variable with a different job. The
mis-citation was reproduced in the DoD, the commit message, the code comment and the Execution Log.

**And the night-run.sh change was a regression, reverted.** The gate call at `:589` is
**synchronous**; the only `nohup` is 144 lines below. Unbounded, the launcher reached ~955s in one
foreground call against a 600s ceiling — killed mid-pre-flight with no verdict, where before it
self-terminated at 520s and refused cleanly at ~560s. A real fix needs the **caller** to declare
detachment: `TASK-367`.
## Owner actions

- [x] Owner approved the `ADR-044` stance reversal — *ruled in-session 2026-09-21 ("ship it in the plugin, remove no hooks no agentic, this not align anymore because we already mature process"), and the two factual corrections approved 2026-09-22 ("amend in place — it is not shipped yet"). The roster it permits is unchanged: no hook shipped*
      ship, and was ruled by the owner in-session on 2026-09-21 but not yet reviewed as written.
- [x] Release decision taken — *owner ruled "push it" 2026-09-21; `v1.66.0` pushed at `11bbd8b`, `v1.66.1` at `307d665`. The T1 review landed AFTER the push and its verdict was acted on by revert, not by holding the release*

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


## Retro

**Shipped** → `CHANGELOG.md`: `v1.66.0` (ADR-044, the `"no X"` banner retired, the prose-density
ratchet) and `v1.66.1` (`qa_budget_check` refuses an unusable budget; harnesses ordered
cheapest-first; the night-run raise reverted and recorded under its own heading).

**Tech debt** → `TD-173` (two synthetic id blocks, only one documented) · `TD-174` (three
`OVER-CAP (soft)` rows print every run and nothing acts; one 23× its cap) · `TD-175` **high** (a
truncating gate prints two `QA-CHECK:` lines and `night-run.sh` takes `tail -n1` — proven
pre-existing, survived only because trailing text broke the anchored pattern).

**Follow-ups** → `TASK-366` (rebuild `ask-dont-tell` from the real corpus, bilingual, `needs-info`
because the pattern set must be derived before it can be specified) · `TASK-367` (the caller
declares detachment; also raise `QA_CEILING_SECONDS`, which is what ADR-042 actually licensed).

**Learnings** → `L-209` (an ADR's Decision section gets read and everything qualifying it does
not) · `L-210` (a negative claim has no diff that ever makes it look wrong) · `L-211` (a message
string in a shell script is code, and `sh -n` will not say so).

**Retrieval check — yes, four times, and that is the sprint's headline.** Every ADR cited to
justify a change was mis-read in a *different* qualifying part: ADR-002's non-existent hook clause,
ADR-011's actual rejection reason, ADR-042's alternatives table, ADR-042's antecedent. Three were
found by outside review. Separately, `SPRINT-101`'s log already recorded the owner ruling T3's
correct fix by hand — the answer existed, in this repo, and no procedure read it (`L-020` ×
`L-151`). The retrieval-miss signal is not "we could not find it"; it is **"we found it and read
the part that agreed with us."**

**What the reviews cost and bought.** Three worktree-isolated reviews, one per task. T1's returned
NOT SAFE TO SHIP and a built artifact was withdrawn. T2's returned "detection sound, member set
wrong" — 8 findings, population 16 → 84 files. T3's found a **live regression in pushed code**
plus four false claims. Zero defects were found by the author recalling a rule, **including the one
the author had predicted in writing beforehand** (`L-165` ×3, the strongest evidence for it yet).

**Cost** — inline (no dispatch fan-out) plus **4 dispatched agents**: 1 research, 3 reviews
(≈266k, ≈158k, ≈115k subagent tokens). Delivered: 2 releases, 1 ADR, 1 gate leg with 10 fixtures,
1 guard fix with 5 fixtures, 3 debt rows, 2 follow-ups, 2 learnings. **One task's artifact was
withdrawn entirely** — counted as delivered work, because the withdrawal *is* the deliverable: it
bought a new standing bar (a hook must be worth being mandatory) that did not exist before.

**The uncomfortable summary.** Of the three artifacts this sprint built, one was withdrawn at
review and one was reverted as a regression after being pushed. The one that survived intact —
the density ratchet — is also the one whose review found the most defects. A sprint whose theme
was *"enforce what is already written"* spent most of its evidence demonstrating that the author
does not read what is already written, and that only an independent pass does.
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

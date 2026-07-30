---
sprint: 040
slug: freshness-and-park-records
owner: Maintainer
last_updated: 2026-07-30
status: active
plan_commit: d5d7b5b
close_commit: [sha — set at close]
update_trigger: sprint execute/close events
---

# SPRINT-040 — Freshness Row and Park Records

> **Theme:** Both gaps SPRINT-039 left open are the same shape — a contract that holds in
> substance but leaves no artifact. The stale-skill version was printed in every skill header
> for a whole session and never read; `migrate`/`init` withheld every unauthorized write and
> then recorded nothing about having done so. Neither is a safety failure; both are
> observability failures, and an unobservable contract is one nobody can trust on the morning
> after. Make each visible at the moment it matters.

## Scope

**In:** a `Skills:` freshness row in the `/prime` health check, with all three branches demonstrated
(T1) · a park record written to the `/handoff` doc when `migrate`/`init` decline unattended, proven
on a real headless re-run of the retained fixtures (T2).
**Out (deferred):** TD-016 qa-check runtime — three options, owner decision pending, no task exists ·
TD-018 `grep -c` cosmetic stderr (opportunistic, fix if that file is touched) · TD-014 night-run.md
line count (trigger is a *third* embedded snippet; still two) · **content-level** freshness checking
on the interactive path (decided against in D1 — version-only) · any change to the unattended
freshness check, which already works.

## Plan

### T1 — Report installed-skill freshness in the /prime health line `[size: S · risk: low · class: execution · HITL]`
Layers: `skills/prime/SKILL.md` (read order · Steps · Output format · `version:` bump) · `README.md`
(/prime blurb) · `CHANGELOG.md` · `TECH-DEBT.md` (TD-015 resolution)
Depends-on: none

L-021 has now fired twice, and the second time cost a whole sprint's confidence: the loop ran on
1.18.0 skills against a 1.22.0 repo with the true version printed in every invocation header. The
fact was never hidden — it was simply never checked. `/prime` is the one step that already runs at
the moment a session's assumptions get set, so the cheapest real fix is to make it *read the header
it is already given* and report the comparison. Version-only by decision (D1).

**Acceptance:** running `/prime` in this repo prints a `Skills:` row; pointed at a manifest whose
version differs it prints the STALE branch, and in a repo with no plugin manifest it prints `n/a` —
all three observed, not reasoned about.

**DoD:**
- [x] `skills/prime/SKILL.md` gains the check: compare the base-dir version from the skill's own
      invocation header against `.claude-plugin/plugin.json`; `version:` frontmatter bumped
- [x] Output format shows the row in all three shapes: `fresh` · `STALE — reinstall before trusting
      any procedure` · `n/a (no local plugin repo)`
- [x] **STALE branch demonstrated firing** against a manifest whose version differs — a freshness row
      that can only ever print `fresh` is exactly the silent false-negative L-058 names
- [x] `n/a` branch demonstrated on a repo with no `.claude-plugin/plugin.json` (consumer path, L-015)
- [x] `fresh` branch demonstrated on this repo as-is
- [ ] README `/prime` blurb + CHANGELOG entry reflect the user-visible change (L-015)
      — README done; CHANGELOG block lands with the MINOR release at close (see Log 2026-07-30 T1)
- [x] TD-015 marked `status: resolved → SPRINT-040 T1` with the accepted blind spot stated
<!-- QA: no test substrate (markdown skill). Verification is the three demonstrated branches above. -->

### T2 — Make migrate/init write a park record when they decline unattended `[size: M · risk: med · class: execution · HITL]`
Layers: `skills/lean-doc-generator/SKILL.md` § Unattended (≈4 lines of cap headroom — overflow to
`references/`, ADR-006) · `evals/fixtures/migrate-park` + `init-park` READMEs · `TECH-DEBT.md`
(TD-017 resolution)
Depends-on: none

SPRINT-039 T1's real headless runs proved the *safety* half: `migrate` and `init` withheld every
unauthorized write. They failed the *observability* half — both declined in prose, writing neither
a park record nor a `/handoff` doc, while `promote` and `/triage` ran the protocol formally in the
same test. That leaves the morning maintainer no artifact showing the run happened or why it
stopped. L-020's class: shipped, but not wired into every entry point that can reach it.

**Acceptance:** a headless `migrate` and a headless `init` that hit a per-item approval each leave a
park record in the `/handoff` doc naming the parked item and its unblock condition — read from the
path the run prints, not inferred from the transcript.

**DoD:**
- [ ] `lean-doc-generator` § Unattended states the park-record + handoff write for `migrate`/`init`,
      not just that they park (SKILL.md is at 106/~110 — overflow goes to `references/`)
- [ ] Real headless `migrate-park` fixture re-run: handoff doc exists at the printed path and names
      the parked item + its unblock condition
- [ ] Real headless `init-park` fixture re-run: same
- [ ] `sh evals/assert-noaction-park.sh` still passes on both re-runs — the in-repo negative half
      (nothing written/moved/committed without approval) must not regress
- [ ] Each fixture's README stops recording the missing-park-record gap as observed
- [ ] TD-017 marked `status: resolved → SPRINT-040 T2`
<!-- QA: two real headless runs, ≈$0.4–0.5 each (SPRINT-039 T1 measured). Behavioural, not deterministic —
     stays opt-in, never wired into qa-check (docs/QA.md's manual/gated boundary). -->

## Decisions (pre-locked)

- **D1** — The interactive freshness guard is **version-only**, not the content-first check that
  ships for unattended runs. `/prime` declares `allowed-tools: Read, Glob, Grep` (no Bash), and the
  content check lives in `orchestrator/references/night-run.md` — reaching it would mean either a
  cross-skill reference tree (banned by the lean/self-contained principle) or a duplicated copy free
  to drift. Accepted cost: an unbumped content edit still reads as `fresh` interactively. Not an
  ADR — reversible, and it neither surprises nor trades off anything hard.
- **D2** — T1 and T2 touch **no shared file**, so no single-owner map or commit ordering is needed;
  they may run in either order or in parallel.

## Assumptions

- **A1** — The base-dir version is readable at runtime and covers the whole roster (one
  version-scoped install root serves every skill). *Confirm: already exercised live — this session's
  `/prime` header resolved to `…/lean-flow/1.22.0/skills/prime`; T1's `fresh` branch re-confirms.*
- **A2** — A consumer who only ran `plugin install` has no `.claude-plugin/plugin.json`, so the row
  degrades to `n/a` rather than false-alarming. *Confirm: T1's third DoD branch, run against a repo
  with no manifest (mirrors night-run leg-1 SKIP).*
- **A3** — `migrate`/`init` park records land in the OS temp-dir handoff doc, since no sprint file
  exists to write into (Part 0 step 2). *Confirm: `evals/assert-noaction-park.sh`'s header states
  it; T2 reads the artifact at the path the run prints and leaves the in-repo assertions untouched.*

## Execution Log

<!-- Append-only, dated. The Plan is frozen at promote — log here rather than editing § Plan. -->

### 2026-07-30 | promote | Plan locked — 2 tasks from TD-015 + TD-017
Governance review clean on all three legs (no L-promotion at count ≥ 2 · no TD aged ≥ 3 sprints · no
doc-aging trigger hit). SPRINT-039's standing item — TASK-120's ADR-013 kill-switch — was decided at
this promote's triage rather than carried in: expiry fired, routed to `.out-of-scope/`, recorded as
L-068 and an ADR-013 addendum.

### 2026-07-30 | T1 complete | /prime freshness row shipped, 6 of 7 DoD ticked
Three branches exercised on real input, not reasoned about: `fresh` (this repo, 1.22.0 == 1.22.0),
`STALE` (scratch manifest reading 9.9.9 — the must-differ fixture, so the row provably fires), `n/a`
(scratch repo with no manifest — the consumer path that must never false-alarm). Fixtures were
scratch-only and not retained: this row **reports**, it does not gate, so L-058's retained-must-FAIL
rule — which binds gates, whose worst failure is a silent pass — doesn't apply. Stating that
explicitly rather than letting the absence pass unexamined.

Self-review caught one contradiction the edit itself introduced: step 3 now reads
`.claude-plugin/plugin.json`, while the skill's own red flag bans reading outside its declared slots.
The red flag was amended to name the manifest as an exception — a skill that violates its own rule on
line 73 teaches the reader to ignore the rule.

**One DoD deliberately left open:** the CHANGELOG half. This is a feature sprint, so the block is
written with the MINOR bump at close (`release-patch` is PATCH-only) — writing a `v1.23.0` heading now
would announce a version that does not exist. Ticking it before the block exists would have been a
false tick, which is worse than an open box.

`skills/prime/SKILL.md` is now **107/110** lines — T2's sibling edit lands in a different file, but
anything further in prime needs `references/` (ADR-006).

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| `skills/prime/SKILL.md` | T1 | report installed-vs-repo skill version at session start — L-021 fired twice unseen | Low | 3 branches run on real fixtures |
| `README.md` | T1 | consumer-facing: the health check's new `Skills:` row (L-015) | Low | qa-check README/version legs |
| `TECH-DEBT.md` | T1 | TD-015 resolved, accepted residual stated | Low | qa-check TD-aging leg |

## Retro

<!-- Written at close. -->

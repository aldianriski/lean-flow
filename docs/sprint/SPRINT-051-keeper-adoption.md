---
sprint: 051
slug: keeper-adoption
owner: Maintainer
last_updated: 2026-08-09
status: active
plan_commit: e272617
close_commit: [sha — set at close]
update_trigger: sprint execute/close events
---

# SPRINT-051 — Keeper Adoption

> **Theme:** Land the five keepers SPRINT-050's scan found, plus the archive cleanup that has now
> survived two aging re-reviews. Every task here is small and already decided — the scan did the
> judging, this sprint does the writing. Two of the five are the ones that were hiding behind a
> same-name assumption for two scans (L-093), and they are the two with real teeth: `/diagnose` tells
> you to capture HAR files and traces without ever mentioning redaction, and `/tdd` has no name for a
> test that passes by construction.

## Scope

**In:** the redaction discipline in `/diagnose` · the tautological-test anti-pattern in `/tdd` · three
micro techniques (refactor hot-spot scoping · prototype retention · merge-conflict intent recovery) ·
reconcile the duplicated sections in the archived SPRINT-045 file.

**Out (deferred):** TASK-155 and TASK-159 stay `needs-info` — both are tensions needing an evidence
source, and a style debate without one is not a task. TD-036 (the `Cites:` authoring surface) and
TD-037 (the uncommitted-WIP union residual) are two sprints old and not yet aged; TD-038 is one.
**Re-scanning mattpocock is explicitly out** — the corpus is fully mapped and a re-scan is a future
event, not this sprint's work.

## Plan

### T1 — Add a redaction discipline to `/diagnose` `[size: S · risk: med · class: execution · HITL]`
Layers: `skills/diagnose/SKILL.md` · `skills/diagnose/references/feedback-loops.md`
Depends-on: none
Cites: `scripts/qa-check.sh`

`/diagnose` instructs capturing traces, HAR files, log dumps and replayed payloads — all of which
routinely carry auth headers — and contains **zero** occurrences of redact, secret or credential
(verified SPRINT-050 T1). `/handoff` already carries the rule in its body *and* as a red flag, so this
is an inconsistency inside our own surface rather than a new idea. The mechanism matters as much as
the warning: build loops against **env vars** so the credential stays in the environment rather than
in what gets shown, and quote only the signal-carrying lines of a captured artifact.

**Acceptance:** a reader following `/diagnose` to capture an artifact meets the redaction rule before
they are told to show it, and the rule names the env-var mechanism rather than only warning.

**DoD:**
- [x] Redaction rule added where capture is instructed, not appended at the end — it must be read
      *before* the step that produces the artifact
- [x] The **mechanism** is stated (build the loop against env vars; quote only signal-carrying lines),
      not just the prohibition
- [x] A red flag added, matching how `/handoff` carries the same rule — the two skills should not
      disagree about a safety rule
- [x] Consumer-facing surface checked (L-015): the rule reads correctly for a repo that is not
      lean-flow; no repo-specific path leaks in
- [x] `skills/diagnose/SKILL.md` stays ≤ ~140 lines
- [x] `scripts/qa-check.sh` re-run **bare** immediately before the commit, after the DoD ticks and the
      log entry (L-089)

### T2 — Add the tautological-test anti-pattern to `/tdd` `[size: S · risk: low · class: execution · HITL]`
Layers: `skills/tdd/SKILL.md` · `skills/tdd/references/testability.md`
Depends-on: none
Cites: `scripts/qa-check.sh`

`/tdd` names implementation-coupled and horizontal-slicing but not the test that passes **by
construction**: an assertion that recomputes the expected value the way the code does can never
disagree with the code. Same family as L-058 — a check that can only pass is the failure it exists to
prevent — which is why this belongs beside the existing anti-patterns rather than in a reference file.

**Acceptance:** `/tdd` names the anti-pattern, gives its tell, and states where a legitimate expected
value comes from instead.

**DoD:**
- [x] The anti-pattern is named with its **tell** — the assertion recomputes the expected value the
      way the code does, so it passes by construction
- [x] The fix is stated: expected values come from an independent source of truth — a known-good
      literal, a worked example, the spec
- [x] Placed beside the existing anti-patterns, not buried in `references/` — it is a per-cycle check,
      which is the disclosure test ADR-006 carries (inline what every path needs)
- [x] `skills/tdd/SKILL.md` stays ≤ ~140 lines
- [x] `scripts/qa-check.sh` re-run **bare** immediately before the commit (L-089)

### T3 — Adopt three micro techniques `[size: S · risk: low · class: execution · HITL]`
Layers: `skills/refactor-advisor/SKILL.md` · `skills/prototype/SKILL.md` ·
    `skills/orchestrator/references/dispatch.md`
Depends-on: none
Cites: `scripts/qa-check.sh`

Three one-or-two-line adoptions with nothing in common but their size. Kept as one task because
splitting three one-liners across three tasks costs more in ceremony than the edits themselves.

**Acceptance:** all three lines exist in their target files, and none has grown into a section.

**DoD:**
- [x] `/refactor-advisor` gains a **scoping step before it scans** — walk git history for the files
      that keep changing, since deepening only pays off where change is frequent (a YAGNI filter on
      the scan itself; the skill currently has no scoping step at all)
- [x] `/prototype` **retains** a spent prototype on a throwaway branch with a pointer, instead of
      "delete or absorb" — the artifact stays retrievable at zero repo cost (TD-012 is the scar)
- [x] `dispatch.md`'s merge-back queue says to **recover each side's intent** from commit messages and
      PRs before resolving, preserve both intents, never invent behaviour, and always resolve rather
      than `--abort` (SPRINT-041's corrupted merge is why this is not theoretical)
- [x] Each is one or two lines; **if any needs a section, it splits into its own task** through a
      `scope-change` entry and a ruling rather than growing this one quietly (L-088)
- [x] All three files stay within their caps
- [x] `scripts/qa-check.sh` re-run **bare** immediately before the commit (L-089)

### T4 — Reconcile the duplicated sections in the SPRINT-045 archive `[size: S · risk: low · class: execution · HITL]`
Layers: `docs/sprint/archive/SPRINT-045-gate-precision.md` ·
    `docs/sprint/archive/logs/SPRINT-045-gate-precision.md` · `TECH-DEBT.md`
Depends-on: none
Cites: `scripts/qa-check.sh`

TD-034, open since Sprint-047 and now past **two** aging re-reviews. What kept deferring it is that it
edits a closed archive record — a real reason to be careful, not a reason to never do it. Two
deferrals is the signal to decide, and the owner's decision at this promote was to fix it.

**Acceptance:** the archived SPRINT-045 Plan carries exactly one `## Files Changed` and one `## Retro`,
and the stranded Execution Log entry sits in the archived log where it belongs.

**DoD:**
- [x] The duplicate `## Files Changed` and `## Retro` pairs reconciled into one each — **content
      merged, never dropped**; if the two versions disagree, the later one wins and the difference is
      noted rather than silently resolved
- [x] The stranded `### 2026-08-01 | scope-change` entry moved into the archived log file
- [x] Re-read the whole structure after the edit — a markdown section move is exactly L-009's
      structure-adjacent trap, and this file is already suspected of one
- [x] The archive edit is called out in the commit message as a deliberate amendment of a closed
      record, so history does not read as a silent rewrite
- [x] `TD-034` marked `status: resolved → SPRINT-051 T4` in the ledger
- [x] `scripts/qa-check.sh` re-run **bare** immediately before the commit (L-089)

## Decisions (pre-locked)

- **D1** — **no shared files between tasks.** T1 (`diagnose/`), T2 (`tdd/`), T3 (three other skills),
  T4 (an archive pair + the ledger) are disjoint, so there is no ownership map to fix and no commit
  order to enforce. Genuinely parallel-eligible if dispatch is ever enabled; sequential inline here.
- **D2** — **TASK-148 routed out at this promote** to `.out-of-scope/bulk-throughput-proof.md`. Its
  `done-when` was unsatisfiable for three consecutive promotes because it mistook the log split's
  *capacity* ceiling for task *supply*. Revisit-if + a SPRINT-060 expiry recorded; the calibration-
  series gap it named is real and explicitly **not** closed by routing it.
- **D3** — **TD-029's row deleted** (resolved at SPRINT-048, three sprints ago, §11). Its unreproduced
  residual survives in the SPRINT-048 archive and in the launcher's own `UNKNOWN` verdict, so what was
  deleted is a breadcrumb, not the record. Id stays retired.

## Assumptions

- **A1** — all three T3 items are genuinely one-liners. *Confirm: while writing each. Any that needs a
  section splits out through a `scope-change` entry rather than expanding T3 — the DoD says so
  explicitly because "it grew a bit" is how a small task quietly becomes an unreviewable one.*
- **A2** — the SPRINT-045 duplication is a straightforward fusion with no lost content, so T4 is a
  reconcile rather than a reconstruction. *Confirm: T4's first step, by diffing the two section pairs
  against each other before editing. If they carry materially different content, T4 is not trivial and
  wants a ruling.*
- **A3** — `/diagnose` and `/tdd` both have cap headroom for an inline addition. *Confirm: line counts
  before writing; if either is at its cap, the disclosure test decides what moves to `references/`
  rather than the new rule being demoted by default.*

## Execution Log

> **Lives in its own file** — `docs/sprint/logs/SPRINT-051-keeper-adoption.md`, rendered from
> `templates/sprint-log.md.template` and created lazily at the first entry. Append there, never here:
> the Log grows with the work done, so keeping it out of this file is what stops it consuming the
> 400-line budget the Plan needs (DOCS_Guide §9 · ADR-014).

## Files Changed
<!-- Filled during execution; feeds CHANGELOG at close. -->

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| | | | | |

## Retro
<!-- Written at close. Route the buckets to durable homes (DOCS_Guide §10):
     shipped → CHANGELOG.md · tech debt → TD-NNN · follow-ups → TASK-NNN · learnings → docs/LEARNINGS.md. -->

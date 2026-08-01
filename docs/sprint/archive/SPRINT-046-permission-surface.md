---
sprint: 046
slug: permission-surface
owner: Maintainer
last_updated: 2026-08-01
status: closed
plan_commit: 3459149
close_commit: [sha — set at close]
update_trigger: sprint execute/close events
---

# SPRINT-046 — Permission Surface

> **Theme:** SPRINT-045's run produced a finding worth more than its Plan: the permission surface
> **narrowed mid-session**, denying command forms that had succeeded an hour earlier — seen
> independently by the coordinator and a dispatched agent. If that is real, then allowlist derivation,
> a static exercise done once at pre-flight, is necessary but not sufficient for a long run. Nobody has
> pinned the mechanism, so this sprint measures before it defends. The one fix it carries is the one
> whose cause is already known.

## Scope

**In:** establishing what actually governs command denial in a headless session — the mid-session
effect and which rule forms genuinely match, both tested rather than inferred (T1) · excluding in-repo
agent worktree paths from the observed-layers check, whose cause is known and whose fix is one entry
(T2).

**Out (deferred):** **any mitigation for TD-027/TD-028** — that is the entire point of T1, and shipping
guidance before the mechanism is pinned is what produced TD-024's two wrong diagnoses and a `pwd -W`
sweep nearly applied to a phantom · **TD-029** (launcher liveness vs buffered output) — cause known,
fix clear, simply not this sprint · **TD-031** (the exclusion list's design question) — deliberately
filed rather than solved; its trigger is a sixth exclusion or the first that fails L-082's test ·
running this sprint unattended (D2).

## Plan

### T1 — Establish what governs command denial in a headless run `[size: M · risk: low · class: execution · AFK]`
Layers: `docs/research/headless-permission-surface.md` · `skills/orchestrator/references/night-run.md`
Depends-on: none

TD-027 · TD-028. Two unknowns that share one experiment. SPRINT-045 recorded `awk … > file` and
`sh <path>` denied *after* those exact forms had already succeeded in the same session, and separately
found that `Bash(sh evals/:*)` — a directory-prefix rule — never matched while the exact-file form did.
Both are currently anecdotes with a plausible story attached, which is the state TD-024 was in twice
before it was root-caused.

**Acceptance:** a research note that answers each question with evidence, or explicitly records it as
not established — and ships **no** mitigation either way.

**DoD:**
- [x] Mid-session effect probed by **replaying a fixed known-good command form at intervals** inside one
      headless session, recording turn index and elapsed time at each attempt
- [x] Rule forms tested **one at a time** — exact-file, directory prefix, glob, bare command — so a
      result attaches to a single variable rather than a bundle
- [x] Every claim carries the observation behind it; anything the probe fails to establish is **named as
      not established**, never softened into a likely story (TD-024 was filed twice on plausible stories)
- [x] If the effect does not reproduce in one session, the note **says so** rather than extrapolating
      from SPRINT-045's single observation
- [x] **No mitigation, no guidance change**, unless a form finding is conclusive — in which case it may
      update the derivation guidance and nothing else
- [x] Probe cost recorded, so the next investigation knows what this class of question costs
<!-- QA: this is research, not a gate — the deliverable is a defensible answer, and "not established"
     is a valid one. The failure mode here is a confident conclusion, not an absent one. -->

### T2 — Exclude agent worktree paths from the observed-layers check `[size: S · risk: low · class: execution · AFK]`
Layers: `scripts/lib/check-layers-observed.sh` · `evals/run-layers-observed-fixtures.sh`
Depends-on: none

TD-030. Worktree dispatch creates agent worktrees inside the repo, and the observed check counts those
paths as changed-but-undeclared — so every fan-out turns the post-merge gate red for reasons unrelated
to the work. Transient (it clears at prune) but guaranteed, which is the same cry-wolf shape TD-026
just fixed.

**Acceptance:** a run with live agent worktrees reports no undeclared finding for those paths, while a
genuinely undeclared file elsewhere still FAILs by name.

**DoD:**
- [x] In-repo agent worktree paths no longer counted as undeclared
- [x] The reason is stated **inline** with the other exclusions — never a silent skip entry
- [x] **Negative-tested, fixture retained** (L-058): a genuinely undeclared file outside those paths
      still FAILs by name. An exclusion that swallowed the real case would satisfy the acceptance and
      hollow out the guard — which is the only way this task can go wrong
- [x] L-082's test applied and recorded: this entry is added because no task *can* declare a path the
      dispatch protocol creates, not because it makes a commit convenient

## Owner-action checklist
- [ ] `git push` after close — owner-reserved, always.

## Decisions (pre-locked)

- **D1** — **`TECH-DEBT.md` is coordinator-owned at close**, as in the last three sprints: both tasks
  would otherwise mark their own `TD-NNN` and serialise on the ledger for no benefit.
- **D2** — **This sprint runs interactively, not unattended.** T1 *is* an investigation into headless
  behaviour, so running it inside the thing it measures would confound the result — and its probe needs
  to fire and observe sessions, which a session cannot cleanly do to itself.
- **D3** — **T1 ships no mitigation.** Recorded as a decision rather than left to judgement, because the
  pull toward "while we're here, let's also fix it" is exactly what TD-024's history warns about. A
  conclusive *form* finding may update derivation guidance; nothing else.
- **D4** — **"Not established" is a successful outcome for T1.** The failure mode for research is a
  confident wrong answer, not an absent one.

## Assumptions

- **A1** — The mid-session effect is observable within a single headless session; SPRINT-045 saw it by
  turn 25. *Confirm: T1's reproduce-or-say-so DoD line.*
- **A2** — Rule-form behaviour is deterministic enough that one-at-a-time testing attributes a result to
  a single variable. *Confirm: T1's one-form-at-a-time DoD line — if results are inconsistent, that is
  itself a finding worth more than a clean table.*
- **A3** — The agent-worktree path prefix is stable. *Confirm: T2's assumption line — if dispatch later
  moves worktrees out of the repo, the exclusion becomes dead code, not wrong code.*

## Execution Log

<!-- Append-only, dated. The Plan is frozen at promote — log here rather than editing § Plan.
     Keep entries short: a finding's durable home is TECH-DEBT / LEARNINGS / CHANGELOG. -->

## Files Changed

<!-- Filled during execution; feeds CHANGELOG at close. -->

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|

## Retro

<!-- Written at close. -->

### 2026-08-01 | T2 | agent worktree paths excluded — verified narrow, not broad
Dispatched to a Sonnet sub-agent (small config change, implemented directly). One `is_excluded()` entry
for `.claude/worktrees/agent-*`, reason stated inline beside the others as that file's convention
requires.

**The only way this task could fail is an over-broad pattern swallowing the true positive, so that is
what I checked** rather than the happy path. Pattern breadth tested directly: `agent-001/x.txt`
excluded · `worktrees/notanagent/x.txt` **counted** · `.claude/other.md` **counted** ·
`scripts/real-miss.sh` **counted**. Then end-to-end on the live repo with a simulated agent artifact
*and* a genuinely undeclared file present at once: the checker FAILed naming **only** the real miss and
ignored the worktree path; cleaned up, back to PASS.

The agent recorded L-082's test rather than skipping it, and its reasoning holds: the dispatch protocol
creates these paths at fan-out, strictly after `Layers:` is frozen, so no task can name a path that did
not exist when it was written — undeclarable by construction, the same category as the settings row.

It also flagged, correctly and without acting: TD-031's question (four exclusions in four sprints) is
out of this sprint's scope. Fixtures: 8 cases / 13 assertions green. Gate 69 pass, 0 fail.

### 2026-08-01 | T1 | TD-028 answered · TD-027 not supported · one new precondition found
Run inline (D2): the subject is headless-session behaviour, so a dispatched agent would have been a
session subject to the effect it was measuring. Two separate probe sessions per the approved design, so
neither result could contaminate the other. ~$4 across 12 sessions. Full evidence →
`docs/research/headless-permission-surface.md`.

**TD-028 answered.** One rule loaded at a time against one identical command: exact-file, bare-command
and space-glob forms all matched; **`Bash(sh dir/:*)` denied, reproduced twice.** The directory-prefix
form genuinely does not match.

**A precondition nobody had written down.** An **untrusted workspace has its `permissions.allow`
ignored entirely** — one warning line, otherwise silent. A character-exact rule produced a denial purely
because the file was never honoured. This is the more dangerous of the two findings: it makes a correct
allowlist inert while looking correct.

**TD-027 is not supported.** A 26-turn session replaying a known-good form: **zero denials**. The
discriminator turned out to be the **redirect** — relative → 0 · absolute → 0 · `> file` → **1**,
reproduced — and SPRINT-045's denied commands were `git show … > file` and `awk … > /tmp/file`. So
those denials are an instance of the *existing* bare-invocation rule (L-077), not a new phenomenon.
**Third time a plausible story attached to a symptom has been wrong** (TD-024 twice, now TD-027).

**Two confounds hit while probing, both of which produced convincing false readings** and are recorded
because they show how cheap a wrong finding is here: an untrusted probe workspace (rules silently
ignored → read as "exact-file rules fail"), and `MSYS_NO_PATHCONV=1` breaking `--settings` path
translation (session errored before running → read as "zero denials, success"). The second is L-067 —
the rule promoted to CLAUDE.md trap (d) at *this sprint's own promote* — catching me the same day.

Per D3 **no mitigation shipped**. The one permitted change was made because the form finding is
conclusive: the derivation guidance now states both preconditions and points at the evidence.
Gate 69 pass, 0 fail.

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| `docs/research/headless-permission-surface.md` | T1 | measured answers to TD-027/TD-028, plus what turned out not to be true | none | every claim carries its probe; unproven items named as unproven |
| `skills/orchestrator/references/night-run.md` | T1 | derivation guidance gains the two measured preconditions (workspace trust · rule form) | low — guidance | the only change D3 permits, and only because the form finding is conclusive |
| `scripts/lib/check-layers-observed.sh` | T2 | agent worktree paths excluded, reason stated inline (TD-030) | low | breadth tested directly; real miss still FAILs by name, end-to-end on the live repo |
| `evals/run-layers-observed-fixtures.sh` | T2 | retained fixture proving the exclusion does not swallow a real miss (L-058) | none | 8 cases / 13 assertions green |

## Retro

**Retrieval check** — no miss, but something sharper: **L-067 caught me the same day it was promoted.**
It became CLAUDE.md trap (d) at this sprint's own promote, and hours later `MSYS_NO_PATHCONV=1` broke a
`--settings` path in my own probe, producing a session that errored before running and reported zero
denials — which read as success. Knowing a rule did not prevent the error; the rule has to fire at the
moment the command is written, not afterwards. Recording that honestly matters more than the clean
retrieval record would have.

**Cost** — 2/2 units landed. T1 ~$4 across 12 probe sessions (largest single: the 26-turn degradation
probe at $0.73); T2 one dispatched agent, ~80k tokens. Run interactively per D2, so no calibration row —
this sprint deliberately was not a night run.

**Worked**
- **Reproduce-before-mitigate was the right call, and it paid immediately.** TD-027's structural defence
  would have been built against nothing. The owner decision to investigate first turned a would-be
  architecture change into a closed hypothesis and a one-line guidance correction.
- **Separating the two probe sessions saved the result.** Had rule forms been tested late in a long
  session, a form could have read as "never matches" when it was simply denied for another reason. The
  design question was worth asking before the first probe rather than after.
- **Two confounds were caught before they became findings** — an untrusted probe workspace, and the
  MSYS path. Both produced convincing readings. Both were caught only by reading actual output instead
  of a counter, which is the same discipline that has now corrected three wrong diagnoses.
- **T2's only real failure mode was tested rather than assumed.** An over-broad exclusion would have
  passed its acceptance while hollowing out the guard; breadth was probed directly and end-to-end.

**Friction**
- **TD-027 consumed two sprints of attention on a mechanism that did not exist.** Not wasted — closing
  it is a real result — but the cost of a plausible story is that it *feels* like knowledge. → **L-087**.
- **L-084 had to be superseded**, having been filed at the previous close on the same false premise. It
  is retained rather than deleted: the observation was real and the wrong inference is the instructive
  part.

**Pattern candidate**
- **L-086** — a permission rule can be present, correct, and inert; verify it *matched*, never that it exists.
- **L-087** — a symptom is data, an attached mechanism is a hypothesis. **count 3** → promotion candidate
  at the next promote.

**Bucket routing**

| Bucket | Filed |
|---|---|
| Shipped | guidance correction + one gate fix → PATCH release (owner call at retention) |
| Tech debt | **TD-028 · TD-030** resolved · **TD-027 CLOSED as not supported** — falsified, not fixed, with a stated reopen condition |
| Follow-ups | none new — TD-029 and TD-031 remain open and untouched by design |
| Learnings | **L-086 · L-087** filed · **L-084 superseded** |
